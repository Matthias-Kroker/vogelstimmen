"""Schneidet Aufnahmen an den Zeitmarken ihrer Bemerkungen und misst dort.

Das ist der Rohstoff, der bisher fehlte: 1757 Stellen, bei denen jemand
anders aufgeschrieben hat, welcher Ruf dort zu hoeren ist. Damit lassen
sich Vorlagen je Ruftyp rechnen, statt Schwellwerte zu raten.

LIZENZEN -- der Grund, warum es dieses Skript getrennt gibt:
Die geladenen Aufnahmen sind VOLLSTAENDIGE fremde Werke, keine
Ausschnitte, und ein Teil steht unter ND (keine Bearbeitung erlaubt).
Sie wandern deshalb nach data/eichmaterial/ und werden NICHT
ausgeliefert und NICHT eingecheckt (.gitignore). Verwendet werden sie
ausschliesslich, um Messwerte zu gewinnen. Was in der App landet, sind
Zahlen -- keine Tonspuren.

ZEITMARKEN SIND PUNKTE, KEINE BEREICHE. "alarm at 0:14" heisst nicht,
dass der Ruf exakt bei 14,000 s beginnt. Aufnehmende runden, und sie
meinen mal den Anfang, mal die Stelle, wo es ihnen auffiel. Deshalb wird
um jede Marke ein Fenster gelegt und darin die kraeftigste Silbe gesucht,
statt stur ab der Sekunde zu schneiden.

Aufruf:
  set XENO_CANTO_API_KEY=...
  C:/Python314/python.exe marken_schneiden.py --laden     # Audio holen
  C:/Python314/python.exe marken_schneiden.py             # messen
"""
import json
import os
import re
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
import requests

BASIS = Path(__file__).resolve().parent
QUELLE = BASIS / "annotierte_aufnahmen.json"
AUDIO = BASIS / "eichmaterial"
ZIEL = BASIS / "ruftyp_vorlagen.json"
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from analyse_alarmtyp import ereignisse, lade_mono, silbe_messen  # noqa: E402

# Fenster um eine Marke. Asymmetrisch, weil Aufnehmende eher zu spaet
# notieren als zu frueh -- man hoert den Ruf, dann schaut man auf die Uhr.
VOR_S, NACH_S = 1.0, 3.0

# Die Woerter aus den Bemerkungen auf unsere Begriffe abbilden. Bewusst
# grob: mehr Klassen als Belege waere Selbstbetrug.
GRUPPE = {
    "alarm": "alarm", "warning": "alarm", "scold": "alarm",
    "chink": "alarm", "pink": "alarm", "tick": "alarm",
    "excitement": "alarm", "excited": "alarm", "chatter": "alarm",
    "churr": "alarm", "seee": "luftalarm", "tsee": "luftalarm",
    "tsi": "luftalarm", "siih": "luftalarm", "seet": "luftalarm",
    "song": "gesang", "subsong": "gesang", "gesang": "gesang",
    "drum": "trommeln", "trommel": "trommeln",
    "begging": "bettelruf", "bettel": "bettelruf",
    "contact": "begleitruf", "kontaktruf": "begleitruf",
    "flight": "flugruf", "flugruf": "flugruf",
    "call": None,     # zu unspezifisch -- bringt uns nicht weiter
}

# Trommeln koennen nur Spechte. Taucht die Marke bei einer anderen Art auf,
# gehoert sie einem Specht im Hintergrund -- die Bemerkung beschreibt die
# AUFNAHME, nicht zwingend den Vogel, um den es geht. Beispiel XC553588:
# eine Buchfink-Aufnahme, in deren Bemerkung ausdruecklich eine Singdrossel
# bei 0:02 steht. Solche Marken wuerden unsere Vorlagen vergiften.
NUR_SPECHTE = {"trommeln"}
SPECHTE = {"Buntspecht"}


def marke_plausibel(art, gruppe, sekunde, laenge_s):
    """Offensichtlich falsche Marken aussortieren."""
    # Zeitangaben wie 12:07 koennen auch Uhrzeiten sein. Liegt die Marke
    # hinter dem Ende der Aufnahme, ist sie sicher keine Fundstelle.
    if laenge_s and sekunde > laenge_s:
        return False
    if gruppe in NUR_SPECHTE and art not in SPECHTE:
        return False
    return True


def sekunden(marke):
    m, s = marke.split(":")
    return int(m) * 60 + float(s)


def laden(key):
    """Audio der annotierten Aufnahmen holen. Nur was noch fehlt."""
    daten = json.loads(QUELLE.read_text(encoding="utf-8"))
    AUDIO.mkdir(parents=True, exist_ok=True)

    # Zuerst die mit verwertbaren Marken -- der Rest hat keinen Vorrang.
    def wert(x):
        return sum(1 for _, w in x["beispiele"] if GRUPPE.get(w.lower()))
    daten = sorted(daten, key=lambda x: -wert(x))
    daten = [x for x in daten if wert(x) > 0]
    print(f"{len(daten)} Aufnahmen mit verwertbaren Marken\n")

    geholt = fehler = uebersprungen = 0
    for i, x in enumerate(daten, 1):
        ziel = AUDIO / f"XC{x['xc_id']}.mp3"
        if ziel.exists():
            uebersprungen += 1
            continue
        try:
            r = requests.get("https://xeno-canto.org/api/3/recordings",
                             params={"query": f"nr:{x['xc_id']}", "key": key},
                             headers=UA, timeout=90)
            recs = r.json().get("recordings") or []
            if not recs or not recs[0].get("file"):
                fehler += 1; continue
            a = requests.get(recs[0]["file"], headers=UA, timeout=180)
            a.raise_for_status()
            ziel.write_bytes(a.content)
            geholt += 1
        except Exception as e:
            print(f"  XC{x['xc_id']}: {e}")
            fehler += 1
        if i % 20 == 0:
            print(f"  {i}/{len(daten)}  geholt {geholt}, "
                  f"vorhanden {uebersprungen}, Fehler {fehler}")
        time.sleep(0.4)
    print(f"\n{geholt} geladen, {uebersprungen} waren da, {fehler} Fehler")
    print(f"-> {AUDIO}  (nicht eingecheckt, nur zum Eichen)")


def messen():
    daten = json.loads(QUELLE.read_text(encoding="utf-8"))
    nach_id = {x["xc_id"]: x for x in daten}

    proben = defaultdict(list)      # (art, gruppe) -> Messwerte
    verworfen = Counter()
    ohne_audio = keine_silbe = 0

    for datei in sorted(AUDIO.glob("XC*.mp3")):
        xid = datei.stem[2:]
        x = nach_id.get(xid)
        if not x:
            continue
        try:
            laenge_s = sekunden(x["laenge"])
        except (ValueError, KeyError):
            laenge_s = None
        marken = []
        for m, w in x["beispiele"]:
            g = GRUPPE.get(w.lower())
            if not g:
                continue
            try:
                t = sekunden(m)
            except ValueError:
                continue
            if not marke_plausibel(x["art"], g, t, laenge_s):
                verworfen[g] += 1
                continue
            marken.append((m, g))
        if not marken:
            continue
        try:
            signal, sr = lade_mono(datei, max_ms=None)   # ganze Aufnahme
        except Exception:
            ohne_audio += 1; continue
        if signal is None or not sr:
            ohne_audio += 1; continue

        for marke, gruppe in marken:
            try:
                t = sekunden(marke)
            except ValueError:
                continue
            a = int(max(0, (t - VOR_S) * sr))
            b = int(min(len(signal), (t + NACH_S) * sr))
            fenster = signal[a:b]
            if len(fenster) < sr // 4:
                continue
            # Kraeftigste Silbe im Fenster -- nicht stur ab der Sekunde
            kandidaten = ereignisse(fenster, sr)
            if not kandidaten:
                keine_silbe += 1; continue
            start, ende = max(kandidaten,
                              key=lambda se: float(np.sqrt(np.mean(
                                  fenster[se[0]:se[1]] ** 2))))
            m = silbe_messen(fenster[start:ende], sr)
            if not m:
                keine_silbe += 1; continue
            m["dauer_s"] = (ende - start) / sr
            m["silben_im_fenster"] = len(kandidaten)
            proben[(x["art"], gruppe)].append(m)

    if not proben:
        print("Nichts gemessen. Erst --laden.")
        return

    print(f"Ohne Audio {ohne_audio}, ohne erkennbare Silbe {keine_silbe}\n")

    # Vorlagen je Ruftyp -- ueber alle Arten UND je Art
    def fasse(liste):
        return {
            "n": len(liste),
            "spitze_hz": round(float(np.median([m["spitze_hz"] for m in liste]))),
            "spitze_streuung": round(float(np.percentile(
                [m["spitze_hz"] for m in liste], 75)
                - np.percentile([m["spitze_hz"] for m in liste], 25))),
            "anteil_ueber_5k": round(float(np.median(
                [m["anteil_ueber_5k"] for m in liste])), 3),
            "dauer_s": round(float(np.median([m["dauer_s"] for m in liste])), 3),
            "silben_im_fenster": round(float(np.median(
                [m["silben_im_fenster"] for m in liste])), 1),
        }

    ueber_arten = defaultdict(list)
    for (art, gruppe), liste in proben.items():
        ueber_arten[gruppe].extend(liste)

    print(f"{'Ruftyp':12s} {'n':>5s} {'Spitze':>8s} {'Streu':>7s} "
          f"{'>5kHz':>7s} {'Dauer':>7s} {'Silben':>7s}")
    print("-" * 58)
    vorlagen = {}
    for gruppe, liste in sorted(ueber_arten.items(), key=lambda kv: -len(kv[1])):
        f = fasse(liste)
        vorlagen[gruppe] = f
        print(f"{gruppe:12s} {f['n']:5d} {f['spitze_hz']:7d}  "
              f"{f['spitze_streuung']:6d}  {f['anteil_ueber_5k']:6.2f}  "
              f"{f['dauer_s']:6.2f}  {f['silben_im_fenster']:6.1f}")

    je_art = defaultdict(dict)
    for (art, gruppe), liste in proben.items():
        if len(liste) >= 4:      # unter vier Proben ist ein Median Zufall
            je_art[art][gruppe] = fasse(liste)

    print(f"\nArten mit mindestens einer belastbaren Vorlage "
          f"(>= 4 Proben): {len(je_art)}")
    for art, g in sorted(je_art.items()):
        print(f"  {art:18s} " + ", ".join(
            f"{k} ({v['n']})" for k, v in sorted(g.items())))

    ZIEL.write_text(json.dumps({
        "hinweis": "Aus fremdbeschrifteten Zeitmarken gemessen "
                   "(data/marken_schneiden.py). Die Tonaufnahmen selbst "
                   "werden NICHT ausgeliefert — nur diese Messwerte.",
        "fenster_s": [VOR_S, NACH_S],
        "hochpass_hz": 1200,
        "ueber_alle_arten": vorlagen,
        "je_art": je_art,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n-> {ZIEL}")


def main():
    if "--laden" in sys.argv:
        key = os.environ.get("XENO_CANTO_API_KEY")
        if not key:
            print("XENO_CANTO_API_KEY fehlt."); sys.exit(1)
        laden(key)
    messen()


if __name__ == "__main__":
    main()
