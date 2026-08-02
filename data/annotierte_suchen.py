"""Sucht Aufnahmen mit ZEITMARKEN in der Anmerkung.

Matthias' Beobachtung: wenn der Aufnehmende schreibt "seee at 0:01, 0:15.4
und 0:28.7", brauchen wir keine Silbenerkennung mehr zu raten -- wir wissen,
wo welcher Ruf sitzt. Das sind fertig beschriftete Trainingsdaten.

Gesucht wird nach dem Muster "<Begriff> ... at e.g. 0:01" bzw. jeder
Kombination aus Ruftyp-Wort und Zeitangabe in derselben Anmerkung.

Aufruf:
  C:/Python314/python.exe annotierte_suchen.py            # alle Arten
  C:/Python314/python.exe annotierte_suchen.py Turdus     # eine Gattung
"""
import collections
import json
import os
import re
import sys
import time
from pathlib import Path

import requests

# Windows-Konsole kann sonst Namen mit Sonderzeichen nicht ausgeben
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

API_KEY = os.environ.get("XENO_CANTO_API_KEY", "")
BASIS = Path(__file__).resolve().parent
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}

ARTEN = [
    ("Amsel", "Turdus", "merula"), ("Kohlmeise", "Parus", "major"),
    ("Blaumeise", "Cyanistes", "caeruleus"), ("Haussperling", "Passer", "domesticus"),
    ("Star", "Sturnus", "vulgaris"), ("Ringeltaube", "Columba", "palumbus"),
    ("Elster", "Pica", "pica"), ("Rabenkrähe", "Corvus", "corone"),
    ("Kolkrabe", "Corvus", "corax"), ("Rotkehlchen", "Erithacus", "rubecula"),
    ("Buchfink", "Fringilla", "coelebs"), ("Zaunkönig", "Troglodytes", "troglodytes"),
    ("Eichelhäher", "Garrulus", "glandarius"), ("Buntspecht", "Dendrocopos", "major"),
    ("Sumpfmeise", "Poecile", "palustris"), ("Zilpzalp", "Phylloscopus", "collybita"),
    ("Heckenbraunelle", "Prunella", "modularis"), ("Turmfalke", "Falco", "tinnunculus"),
    ("Mäusebussard", "Buteo", "buteo"), ("Habicht", "Accipiter", "gentilis"),
]

# Zeitangabe wie 0:01, 1:23.4, 12:07
ZEIT = re.compile(r"\b\d{1,2}:\d{2}(?:\.\d)?\b")
# Ruftyp-Woerter, die neben einer Zeitmarke stehen sollten.
# 2026-08 erweitert: um deutsche Begriffe und um Lautmalerei. Aufnehmende
# schreiben oft nicht "alarm call", sondern was sie hoeren -- "pink at
# 0:14", "hueet". Der erste Durchlauf suchte danach nicht.
RUFWORT = re.compile(
    r"\b(call|song|alarm|warning|seee+|seep|rattle|tix|chink|drum|"
    r"flight|contact|begging|scold|mobbing|subsong|advertis|"
    r"gesang|ruf\b|warnruf|alarmruf|zeter\w*|hassruf|bettel\w*|"
    r"kontaktruf|flugruf|revier\w*|trommel\w*|"
    r"pink|hu[ei]+t|tick|tsee|tseep|chack|chatter|churr|tsi|"
    r"seet|siih|djueck|tuck|chuck|pook|excite\w*|agitat\w*)", re.I)

# Lizenzen mit ND (no derivatives) duerfen wir nicht schneiden -- fuer die
# App also unbrauchbar. Zum EICHEN unserer Messung sind sie trotzdem Gold:
# dort steht, welcher Ruf wann zu hoeren ist. Deshalb werden sie nicht
# aussortiert, sondern markiert.
def nutzbar(lizenz):
    return "-nd" not in (lizenz or "").lower()


def hole(url, params=None, versuche=4, timeout=60):
    warte = 3
    for versuch in range(versuche):
        try:
            r = requests.get(url, params=params, headers=UA, timeout=timeout)
            if r.status_code == 429:
                time.sleep(warte); warte *= 2; continue
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if versuch == versuche - 1:
                print(f"    fehlgeschlagen: {e}")
                return None
            time.sleep(warte); warte *= 2
    return None


def bewerten(rmk):
    """Wie brauchbar ist die Anmerkung? Zaehlt Zeitmarken neben Rufwoertern."""
    if not rmk:
        return 0, []
    zeiten = ZEIT.findall(rmk)
    if not zeiten or not RUFWORT.search(rmk):
        return 0, []
    # Abschnitte um jede Zeitmarke herum ansehen
    treffer = []
    for m in ZEIT.finditer(rmk):
        umfeld = rmk[max(0, m.start() - 90):m.start()]
        wort = RUFWORT.search(umfeld)
        if wort:
            treffer.append((m.group(), wort.group().lower()))
    return len(treffer), treffer


def main():
    if not API_KEY:
        print("XENO_CANTO_API_KEY fehlt."); sys.exit(1)

    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    filter_ = argumente[0].lower() if argumente else None

    gesamt = []
    aufnehmer = collections.Counter()

    for name_de, genus, species in ARTEN:
        if filter_ and filter_ not in f"{name_de} {genus} {species}".lower():
            continue
        gefunden = []
        # 2026-08: vorher nur drei Seiten -- bei der Amsel also 300 von 1804
        # Aufnahmen. Beschriftete Zeitmarken sind selten; wer nur ein
        # Sechstel durchsieht, findet auch nur ein Sechstel. Jetzt alle
        # Seiten.
        seite, seiten = 1, 1
        while seite <= seiten:
            r = hole("https://xeno-canto.org/api/3/recordings",
                     {"query": f"gen:{genus} sp:{species}", "key": API_KEY,
                      "page": seite})
            if r is None:
                break
            d = r.json()
            seiten = int(d.get("numPages", 1))
            recs = d.get("recordings") or []
            if not recs:
                break
            for rec in recs:
                anzahl, treffer = bewerten(rec.get("rmk") or "")
                if anzahl >= 2:      # mindestens zwei beschriftete Zeitpunkte
                    gefunden.append({
                        "xc_id": rec.get("id"), "art": name_de,
                        "wissenschaftlich": f"{genus} {species}",
                        "typ": rec.get("type"), "laenge": rec.get("length"),
                        "qualitaet": rec.get("q"), "land": rec.get("cnt"),
                        "aufnehmer": rec.get("rec"), "lizenz": rec.get("lic"),
                        "marken": anzahl,
                        # ND-Lizenzen duerfen wir nicht schneiden -- fuer
                        # die App unbrauchbar, zum Eichen aber wertvoll.
                        "in_app_nutzbar": nutzbar(rec.get("lic")),
                        "bemerkung": (rec.get("rmk") or "")[:400],
                        "beispiele": treffer[:12],
                    })
                    aufnehmer[rec.get("rec")] += 1
            seite += 1
            time.sleep(0.3)

        gefunden.sort(key=lambda x: -x["marken"])
        gesamt.extend(gefunden)
        kennz = "***" if gefunden else "   "
        print(f"{kennz} {name_de:17s} {len(gefunden):3d} annotierte Aufnahmen"
              + (f"   beste: XC{gefunden[0]['xc_id']} ({gefunden[0]['marken']} Marken)"
                 if gefunden else ""))

    ziel = BASIS / "annotierte_aufnahmen.json"
    ziel.write_text(json.dumps(gesamt, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n{len(gesamt)} annotierte Aufnahmen -> {ziel.name}")

    marken = sum(x["marken"] for x in gesamt)
    nutzbar_n = sum(1 for x in gesamt if x["in_app_nutzbar"])
    print(f"{marken} beschriftete Zeitpunkte insgesamt")
    print(f"{nutzbar_n} davon mit Lizenz, die wir in der App verwenden "
          f"duerfen — {len(gesamt) - nutzbar_n} nur zum Eichen")

    woerter = collections.Counter()
    for x in gesamt:
        for _, w in x["beispiele"]:
            woerter[w.lower()] += 1
    print("\nWelche Ruftypen sind beschriftet:")
    for w, n in woerter.most_common(20):
        print(f"  {w:22s} {n:4d}")

    if aufnehmer:
        print("\nErgiebigste Aufnehmende:")
        for wer, n in aufnehmer.most_common(8):
            print(f"  {n:4d}  {wer}")


if __name__ == "__main__":
    main()
