"""Fasst die Einzel-JSONs zu einer TypeScript-Datei fuer die App zusammen.

Warum nicht die JSONs direkt importieren: so gibt es Typen, der Bundler
zieht genau eine Datei, und die App startet ohne Dateisystemzugriff --
sie funktioniert damit offline, auch im Browser.

Aufruf:
  C:/Python314/python.exe daten_bauen.py
"""
import json
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
ZIEL = BASIS.parent / "daten" / "voegel.ts"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

TYPEN = '''// Erzeugt von data/daten_bauen.py -- nicht von Hand aendern.

export type Fressfeind = {
  deutsch: string;
  wissenschaftlich: string;
  /** Was erbeutet wird -- unabhaengig vom Alarmtyp. */
  stadium: "Altvogel" | "Nest" | "beides" | "unbekannt";
  /** Welchen Alarm der Feind ausloest. Eine Eule erbeutet Altvoegel,
   *  wird tagsueber aber gehasst -- die Achsen laufen nicht parallel. */
  alarmtyp: "Warnruf" | "Hassruf";
  /** Im Wikipedia-Artikel der Art namentlich bestaetigt. */
  bestaetigt: boolean;
};

export type Vogel = {
  id: string;
  name_de: string;
  name_wissenschaftlich: string;
  kurzbeschreibung: string;
  beschreibung: string;
  wikidata_id: string | null;
  quelle_text: { name: string; url: string | null; lizenz: string };
  fressfeinde: Fressfeind[];
};

'''


def main():
    dateien = sorted(SPECIES_DIR.glob("*.json"))
    if not dateien:
        print("Keine Artdaten."); sys.exit(1)

    voegel = []
    for pfad in dateien:
        d = json.loads(pfad.read_text(encoding="utf-8"))
        voegel.append({
            "id": d["id"],
            "name_de": d["name_de"],
            "name_wissenschaftlich": d["name_wissenschaftlich"],
            "kurzbeschreibung": d.get("kurzbeschreibung") or "",
            "beschreibung": d.get("beschreibung") or "",
            "wikidata_id": d.get("wikidata_id"),
            "quelle_text": d.get("quelle_text") or {},
            "fressfeinde": [
                {"deutsch": f["deutsch"], "wissenschaftlich": f["wissenschaftlich"],
                 "stadium": f.get("stadium", "unbekannt"),
                 "alarmtyp": f.get("alarmtyp", "Hassruf"),
                 "bestaetigt": bool(f.get("bestaetigt"))}
                for f in d.get("fressfeinde", [])
            ],
        })

    voegel.sort(key=lambda v: v["name_de"])
    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    ZIEL.write_text(
        TYPEN + "export const voegel: Vogel[] = "
        + json.dumps(voegel, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")

    feinde = sum(len(v["fressfeinde"]) for v in voegel)
    print(f"{len(voegel)} Arten, {feinde} Fressfeind-Eintraege -> {ZIEL}")


if __name__ == "__main__":
    main()
