"""Holt die VOLLSTAENDIGEN xeno-canto-Metadaten unserer Aufnahmen.

Warum getrennt von rufe_einbacken.py: Dort wird nur `type` gespeichert --
ausgerechnet das Feld, das sich als unzuverlaessig erwiesen hat (`call` und
`alarm call` ueberlappen bei unserem Material zu 77 %). Die API liefert
aber deutlich mehr, und einiges davon ist STRUKTURIERT statt Freitext:

  stage          adult / juvenile / nestling / uncertain
                 -> Bettelrufe sind damit nicht geraten, sondern abgelesen
  sex            male / female
  rmk            Bemerkung der aufnehmenden Person -- der EINZIGE Ort, an
                 dem Territorialverhalten auftaucht ("two males had trouble
                 with each other" bei XC123588)
  also           welche anderen Arten mit auf der Aufnahme sind
                 -> reagieren andere mit? Youngs Kriterium fuer echten Alarm
  animal-seen    wurde der Vogel gesehen
  playback-used  wurde mit Klangattrappe gelockt -> dann ist die Reaktion
                 provoziert und als Alarmbeispiel wertlos
  q              Aufnahmequalitaet A-E

Das Skript laedt KEIN Audio nach, nur Metadaten zu bereits vorhandenen
Ausschnitten. Ergebnis: data/rufe_metadaten.json

Aufruf:
  set XENO_CANTO_API_KEY=...
  C:/Python314/python.exe rufe_metadaten.py [--pruefen]

  --pruefen   nur auswerten, was schon geholt wurde (ohne Netz)
"""
import json
import os
import re
import sys
import time
from collections import Counter
from pathlib import Path

import requests

BASIS = Path(__file__).resolve().parent
RUFE_DIR = BASIS.parent / "assets" / "rufe"
ZIEL = BASIS / "rufe_metadaten.json"
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

API = "https://xeno-canto.org/api/3/recordings"

# Nur die Felder, die wir wirklich auswerten -- der Rest blaeht die Datei auf.
BEHALTEN = ("id", "gen", "sp", "en", "type", "stage", "sex", "rmk", "also",
            "animal-seen", "playback-used", "q", "method", "length", "cnt")


def hole(params, versuche=4):
    warte = 3
    for versuch in range(versuche):
        try:
            r = requests.get(API, params=params, headers=UA, timeout=90)
            if r.status_code == 429:
                time.sleep(warte); warte *= 2; continue
            r.raise_for_status()
            return r.json()
        except requests.RequestException:
            if versuch == versuche - 1:
                return None
            time.sleep(warte); warte *= 2
    return None


def unsere_nummern():
    muster = re.compile(r"_XC(\d+)\.mp3$", re.I)
    nummern = set()
    for f in RUFE_DIR.glob("*.mp3"):
        m = muster.search(f.name)
        if m:
            nummern.add(m.group(1))
    return sorted(nummern, key=int)


def sammeln(key):
    """Erst je Art sammeln (guenstig), dann Fehlende einzeln nachfassen."""
    nummern = set(unsere_nummern())
    print(f"{len(nummern)} Aufnahmen im Bestand\n")

    gefunden = {}
    arten = set()
    for pfad in (BASIS / "species").glob("*.json"):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        arten.add((d["gattung"], d["art"]))

    print("Sammelabfrage je Art...")
    for gen, sp in sorted(arten):
        seite, seiten = 1, 1
        while seite <= seiten and seite <= 6:
            d = hole({"query": f'sp:"{gen} {sp}"', "key": key, "page": seite})
            if not d:
                break
            seiten = int(d.get("numPages", 1))
            for rec in d.get("recordings") or []:
                if rec["id"] in nummern:
                    gefunden[rec["id"]] = {k: rec.get(k) for k in BEHALTEN}
            seite += 1
            time.sleep(0.2)
        print(f"  {gen} {sp:16s} {len(gefunden):4d} bekannt")

    fehlend = sorted(nummern - set(gefunden), key=int)
    if fehlend:
        print(f"\n{len(fehlend)} einzeln nachfassen...")
        for i, nr in enumerate(fehlend, 1):
            d = hole({"query": f"nr:{nr}", "key": key})
            recs = (d or {}).get("recordings") or []
            if recs:
                gefunden[nr] = {k: recs[0].get(k) for k in BEHALTEN}
            if i % 25 == 0:
                print(f"  {i}/{len(fehlend)}")
            time.sleep(0.25)

    ZIEL.write_text(json.dumps(gefunden, ensure_ascii=False, indent=1),
                    encoding="utf-8")
    print(f"\n-> {ZIEL}  ({len(gefunden)} von {len(nummern)})")
    return gefunden


# Woerter, die im Freitext auf eine der Fuenf Stimmen deuten. Bewusst
# konservativ: lieber nichts erkennen als falsch zuordnen.
HINWEISE = {
    "territorial": re.compile(
        r"\b(territor\w*|dispute|disput\w+|chas(e|ing)|fight\w*|rival\w*|"
        r"aggressi\w+|two males|2 males|counter[- ]?sing\w*|revier\w*|"
        r"streit\w*|maennchen.{0,20}maennchen)\b", re.I),
    "bettelruf": re.compile(
        r"\b(begg\w+|fledgl\w+|juvenile|nestling|young bird|chicks?|"
        r"bettel\w*|jungvogel|fuettert?\w*|feeding young)\b", re.I),
    "alarm": re.compile(
        r"\b(alarm\w*|mobb\w+|scold\w+|predator|cat\b|sparrowhawk|hawk|"
        r"owl\b|buzzard|fox\b|snake|warn\w*|hass\w*|zeter\w*|katze|"
        r"sperber|habicht|eule|kauz)\b", re.I),
    "begleitruf": re.compile(
        r"\b(contact call|kontaktruf|pair\b|paar\b|foraging|feeding\b|"
        r"flight call|flugruf)\b", re.I),
}


def auswerten(daten):
    print("\n" + "=" * 66)
    print("WAS STECKT DRIN — Auswertung")
    print("=" * 66)

    n = len(daten)
    stage = Counter((d.get("stage") or "?").lower() for d in daten.values())
    print(f"\nstage (Altersstufe) — Grundlage fuer Bettelrufe:")
    for k, v in stage.most_common():
        print(f"  {k:20s} {v:4d}  ({v/n*100:.0f} %)")

    mit_rmk = [d for d in daten.values() if (d.get("rmk") or "").strip()]
    print(f"\nBemerkungen vorhanden: {len(mit_rmk)} von {n} "
          f"({len(mit_rmk)/n*100:.0f} %)")

    treffer = Counter()
    for d in mit_rmk:
        for stimme, muster in HINWEISE.items():
            if muster.search(d["rmk"]):
                treffer[stimme] += 1
    print("  davon mit Hinweis auf:")
    for k, v in treffer.most_common():
        print(f"    {k:14s} {v:4d}")

    pb = sum(1 for d in daten.values()
             if str(d.get("playback-used") or "").lower() in ("yes", "1"))
    print(f"\nMit Klangattrappe gelockt: {pb}  "
          f"(als Alarmbeispiel unbrauchbar — Reaktion ist provoziert)")

    mit_also = sum(1 for d in daten.values() if d.get("also")
                   and [a for a in d["also"] if a.strip()])
    print(f"Andere Arten mit auf der Aufnahme: {mit_also} "
          f"({mit_also/n*100:.0f} %) — Youngs Kriterium pruefbar")

    typen = Counter((d.get("type") or "?").lower() for d in daten.values())
    print(f"\nHaeufigste type-Etiketten:")
    for k, v in typen.most_common(12):
        print(f"  {k[:40]:40s} {v:4d}")


def main():
    if "--pruefen" in sys.argv:
        if not ZIEL.exists():
            print("Noch nichts geholt."); sys.exit(1)
        auswerten(json.loads(ZIEL.read_text(encoding="utf-8")))
        return

    key = os.environ.get("XENO_CANTO_API_KEY")
    if not key:
        print("XENO_CANTO_API_KEY nicht gesetzt.")
        sys.exit(1)
    auswerten(sammeln(key))


if __name__ == "__main__":
    main()
