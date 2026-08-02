"""Ordnet jede Aufnahme einer der Fuenf Stimmen zu -- mit Herkunftsangabe.

Bisher kannte die App drei Schubladen: Gesang, Rufe, Trommeln. Die
Unterscheidung, um die es beim Lernen geht, ist aber eine andere: VIER der
Fuenf Stimmen sind Baseline, nur die fuenfte bedeutet Gefahr.

WICHTIG -- was hier NICHT passiert: geraten. Jede Zuordnung bekommt
mitgeliefert, WOHER sie stammt und wie sicher sie ist. Wo nichts trägt,
bleibt "unbestimmt" stehen. Eine falsch beschriftete Alarmaufnahme ist
schlimmer als eine unbeschriftete, weil man sie auswendig lernt.

Die Rangfolge der Pruefungen ist nicht beliebig:

  1. Altersstufe   `stage` = nestling/juvenile ist ein eigenes Feld, kein
                   Freitext -> staerkster Beleg, kommt zuerst.
  2. Gesang        `type` enthaelt "song". Das ist die EINE Unterscheidung,
                   die xeno-canto zuverlaessig trifft.
  3. Territorial   NUR aus der Bemerkung. Muss VOR der Alarmpruefung
                   stehen, denn genau diese Aufnahmen sind bei xeno-canto
                   als "alarm call" eingetragen -- XC123588 ("two males had
                   trouble with each other") ist der Fall, der uns das
                   beigebracht hat. Akustisch ist der Unterschied
                   grundsaetzlich nicht zu holen: die Elster benutzt
                   nachweislich DENSELBEN Ruf fuer beides
                   (Kuspiel et al., Animal Cognition 2025).
  4. Alarm         Etikett plus Bemerkung.
  5. Begleitruf    Kontakt- und Flugrufe.

Aufruf:
  C:/Python314/python.exe stimmen_zuordnen.py            # nur berichten
  C:/Python314/python.exe stimmen_zuordnen.py --schreiben  # nach daten/
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

BASIS = Path(__file__).resolve().parent
META = BASIS / "rufe_metadaten.json"
ZIEL = BASIS.parent / "daten" / "stimmen.json"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from rufe_metadaten import HINWEISE  # noqa: E402  -- eine Quelle fuer die Muster

STIMMEN = ["gesang", "begleitruf", "territorial", "bettelruf", "alarm",
           "unbestimmt"]
BASELINE = {"gesang", "begleitruf", "territorial", "bettelruf"}


def zuordnen(rec):
    """-> (stimme, sicherheit, woher). Reihenfolge ist bedeutungstragend."""
    typ = (rec.get("type") or "").lower()
    stage = (rec.get("stage") or "").lower()
    rmk = (rec.get("rmk") or "").strip()

    # 1. Altersstufe -- strukturiertes Feld, kein Freitext
    if "nestling" in stage or "juvenile" in stage or "hatchling" in typ \
            or "begging" in typ:
        return "bettelruf", "sicher", "Altersangabe im Archiv"

    # 2. Gesang. "subsong" ist Jugendgesang und zaehlt nicht als voller
    #    Gesang; "dawn song" schon.
    if "song" in typ and "subsong" not in typ:
        return "gesang", "sicher", "Etikett „song“"

    # 3. Territorial VOR Alarm -- sonst verschwinden Revierstreits in der
    #    Alarmschublade, so wie es uns bei XC123588 passiert ist.
    if rmk and HINWEISE["territorial"].search(rmk):
        return "territorial", "wahrscheinlich", "Bemerkung der Aufnahme"

    # 4. Alarm
    if "alarm" in typ:
        if rmk and HINWEISE["alarm"].search(rmk):
            return "alarm", "wahrscheinlich", "Etikett + Bemerkung"
        return "alarm", "unsicher", "nur Etikett „alarm call“"
    if rmk and HINWEISE["alarm"].search(rmk):
        return "alarm", "wahrscheinlich", "Bemerkung der Aufnahme"

    # 5. Begleitrufe
    if "flight call" in typ or "contact call" in typ or "social call" in typ:
        return "begleitruf", "wahrscheinlich", "Etikett"
    if rmk and HINWEISE["begleitruf"].search(rmk):
        return "begleitruf", "unsicher", "Bemerkung der Aufnahme"

    if "drumming" in typ:
        return "gesang", "sicher", "Trommeln zaehlt als Revieranzeige"

    return "unbestimmt", "unsicher", "kein verwertbarer Hinweis"


def main():
    if not META.exists():
        print("Erst rufe_metadaten.py laufen lassen."); sys.exit(1)
    daten = json.loads(META.read_text(encoding="utf-8"))

    ergebnis, zaehler, sicherheit, woher = {}, Counter(), Counter(), Counter()
    je_art = defaultdict(Counter)
    for nr, rec in daten.items():
        s, sich, wo = zuordnen(rec)
        # Klangattrappe: die Reaktion ist provoziert, nicht spontan.
        gelockt = str(rec.get("playback-used") or "").lower() in ("yes", "1")
        mit_anderen = bool([a for a in (rec.get("also") or []) if a.strip()])
        ergebnis[nr] = {
            "stimme": s, "sicherheit": sich, "woher": wo,
            "baseline": s in BASELINE,
            "gelockt": gelockt,
            "andere_arten": mit_anderen,
        }
        zaehler[s] += 1
        sicherheit[sich] += 1
        woher[wo] += 1
        je_art[f"{rec.get('gen')} {rec.get('sp')}"][s] += 1

    n = len(daten)
    print(f"{n} Aufnahmen zugeordnet\n")
    print(f"{'Stimme':14s} {'Anzahl':>7s}  {'Anteil':>7s}  Zustand")
    print("-" * 52)
    for s in STIMMEN:
        v = zaehler[s]
        zustand = ("Gefahr" if s == "alarm"
                   else "—" if s == "unbestimmt" else "Baseline")
        print(f"{s:14s} {v:7d}  {v/n*100:6.0f} %  {zustand}")

    print(f"\n{'Sicherheit':16s} Anzahl")
    print("-" * 26)
    for k, v in sicherheit.most_common():
        print(f"{k:16s} {v:6d}")

    print(f"\n{'Woher die Zuordnung stammt':38s} Anzahl")
    print("-" * 47)
    for k, v in woher.most_common():
        print(f"{k:38s} {v:6d}")

    gelockt = sum(1 for e in ergebnis.values() if e["gelockt"])
    anderen = sum(1 for e in ergebnis.values()
                  if e["stimme"] == "alarm" and e["andere_arten"])
    alarm = zaehler["alarm"]
    print(f"\nMit Klangattrappe gelockt: {gelockt} (Reaktion provoziert)")
    print(f"Alarmaufnahmen mit anderen Arten drauf: {anderen} von {alarm}"
          f" — bei denen liesse sich Youngs Kriterium pruefen,"
          f" ob andere mitreagieren")

    print("\nArten ohne jede Alarmaufnahme:")
    leer = [a for a, c in sorted(je_art.items()) if not c["alarm"]]
    print("  " + (", ".join(leer) if leer else "keine"))

    if "--schreiben" in sys.argv:
        ZIEL.parent.mkdir(parents=True, exist_ok=True)
        ZIEL.write_text(json.dumps({
            "hinweis": "stimme/sicherheit/woher je xeno-canto-Nummer. "
                       "Erzeugt von data/stimmen_zuordnen.py — nicht von "
                       "Hand aendern.",
            "zuordnung": ergebnis,
        }, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"\n-> {ZIEL}")


if __name__ == "__main__":
    main()
