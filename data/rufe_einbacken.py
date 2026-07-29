"""Backt die Rufe in die App ein -- komprimiert und mit Quellenangabe.

Quelle sind die bereits geladenen und lizenzgefilterten Ausschnitte des
Audio-Generators (Nachbarprojekt `Vogelstimmen`). Dort liegen sie als
WAV mit 320 MB -- viel zu viel fuer eine App. Hier werden sie zu Mono-MP3
mit 64 kbit/s gewandelt; das reicht fuer Vogelstimmen voellig und bringt
die Sammlung auf eine tragbare Groesse.

Lizenz: alles BY-NC-SA oder BY-SA (ND ist im Generator ausgefiltert).
Namensnennung ist Pflicht, deshalb wandert zu jedem Ruf der Aufnehmende,
die xeno-canto-Nummer und die Lizenz mit in die App.

Aufruf:
  C:/Python314/python.exe rufe_einbacken.py
"""
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

import requests

API_KEY = os.environ.get("XENO_CANTO_API_KEY", "")
BASIS = Path(__file__).resolve().parent
QUELLE = Path(r"C:\Users\kroker\Projekte\Vogelstimmen\audio\Vogelstimmen\clips")
ZIEL = BASIS.parent / "assets" / "rufe"
SPECIES_DIR = BASIS / "species"
FFMPEG = Path(r"C:\Users\kroker\Tools\ffmpeg\bin\ffmpeg.exe")
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BITRATE = "64k"        # Mono, reicht fuer Vogelstimmen
MAX_SEKUNDEN = 8       # wie im Lernaudio

# Die xeno-canto-Etiketten taugen nicht als Lernkategorien (call und alarm
# call ueberlappen fast vollstaendig). Fuer die App bleibt deshalb nur die
# Unterscheidung, die wirklich traegt: Gesang gegen Rufe. Die feineren
# Typen (Siih, Tixen, Zetern, Djueck) kommen erst, wenn die Zuordnung steht.
def kategorie(xc_typ):
    t = (xc_typ or "").lower()
    if "song" in t and "subsong" not in t:
        return "gesang"
    if "drumming" in t:
        return "trommeln"
    return "rufe"


KATEGORIE_TITEL = {"gesang": "Gesang", "rufe": "Rufe", "trommeln": "Trommeln"}


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
                print(f"    Abruf fehlgeschlagen: {e}")
                return None
            time.sleep(warte); warte *= 2
    return None


def metadaten_sammeln(arten):
    """Je Art EINE Abfrage statt je Aufnahme -- schont die API."""
    nach_id = {}
    for name_de, genus, species in arten:
        for seite in (1, 2):
            r = hole("https://xeno-canto.org/api/3/recordings",
                     {"query": f"gen:{genus} sp:{species}", "key": API_KEY,
                      "page": seite})
            if r is None:
                break
            d = r.json()
            for rec in d.get("recordings") or []:
                nach_id[str(rec.get("id"))] = rec
            if int(d.get("numPages", 1)) <= seite:
                break
        time.sleep(0.3)
    return nach_id


def main():
    if not API_KEY:
        print("XENO_CANTO_API_KEY fehlt."); sys.exit(1)
    if not QUELLE.exists():
        print(f"Keine Ausschnitte unter {QUELLE}"); sys.exit(1)
    if not FFMPEG.exists():
        print("ffmpeg fehlt."); sys.exit(1)

    arten = []
    # ACHTUNG: der Artname allein ist mehrdeutig -- Kohlmeise ist
    # "Parus major", Buntspecht "Dendrocopos major". Die Ausschnitte heissen
    # beide "major_XC...". Deshalb wird ueber GATTUNG UND ART zugeordnet,
    # und zwar aus den xeno-canto-Metadaten, nicht aus dem Dateinamen.
    nach_paar = {}
    for pfad in sorted(SPECIES_DIR.glob("*.json")):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        genus, species = d["gattung"], d["art"]
        arten.append((d["name_de"], genus, species))
        nach_paar[(genus.lower(), species.lower())] = d

    print("Hole Metadaten (Aufnehmende, Lizenz, Ruftyp)...")
    meta = metadaten_sammeln(arten)
    print(f"  {len(meta)} Aufnahmen aus der Sammelabfrage")

    # Die Sammelabfrage liefert nur die ersten Seiten je Art. Unsere
    # Ausschnitte stammen teils von spaeteren -- fuer die fehlenden Nummern
    # einzeln nachfassen, sonst faellt zwei Drittel der Sammlung weg.
    muster_vor = re.compile(r"^[a-z]+_XC(\d+)\.\w+$", re.I)
    gebraucht = {m.group(1) for m in
                 (muster_vor.match(f.name) for f in QUELLE.iterdir()) if m}
    fehlend = sorted(gebraucht - set(meta))
    if fehlend:
        print(f"  {len(fehlend)} Nummern fehlen — frage einzeln nach...")
        for i, xid in enumerate(fehlend, 1):
            r = hole("https://xeno-canto.org/api/3/recordings",
                     {"query": f"nr:{xid}", "key": API_KEY})
            if r:
                recs = r.json().get("recordings") or []
                if recs:
                    meta[xid] = recs[0]
            if i % 25 == 0:
                print(f"    {i}/{len(fehlend)}")
            time.sleep(0.25)
    print(f"  {len(meta)} Aufnahmen bekannt\n")

    ZIEL.mkdir(parents=True, exist_ok=True)
    for alt in ZIEL.glob("*.mp3"):
        alt.unlink()

    muster = re.compile(r"^(?P<art>[a-z]+)_XC(?P<id>\d+)\.\w+$", re.I)
    eintraege, ohne_meta = [], []

    for datei in sorted(QUELLE.iterdir()):
        m = muster.match(datei.name)
        if not m:
            continue
        xc_id = m.group("id")
        rec = meta.get(xc_id)
        if not rec:
            ohne_meta.append(datei.name)
            continue
        # Art aus den Metadaten bestimmen, nicht aus dem Dateinamen
        vogel = nach_paar.get(((rec.get("gen") or "").lower(),
                               (rec.get("sp") or "").lower()))
        if not vogel:
            continue

        ziel = ZIEL / f"{vogel['id']}_XC{xc_id}.mp3"
        ergebnis = subprocess.run(
            [str(FFMPEG), "-y", "-loglevel", "error", "-i", str(datei),
             "-t", str(MAX_SEKUNDEN), "-ac", "1", "-b:a", BITRATE,
             "-map_metadata", "-1", str(ziel)],
            capture_output=True)
        if ergebnis.returncode != 0 or not ziel.exists():
            print(f"  {datei.name}: ffmpeg fehlgeschlagen")
            continue

        eintraege.append({
            "id": f"{vogel['id']}_XC{xc_id}",
            "vogel": vogel["id"],
            "vogel_name": vogel["name_de"],
            "kategorie": kategorie(rec.get("type")),
            "xc_typ": rec.get("type"),
            "xc_id": xc_id,
            "aufnehmer": rec.get("rec"),
            "land": rec.get("cnt"),
            "lizenz": rec.get("lic"),
            "datei": ziel.name,
            "kb": round(ziel.stat().st_size / 1024),
        })

    schreibe_index(eintraege)

    gesamt = sum(e["kb"] for e in eintraege) / 1024
    print(f"{len(eintraege)} Rufe, {gesamt:.1f} MB (vorher 320 MB als WAV)")
    nach_kat = {}
    for e in eintraege:
        nach_kat[e["kategorie"]] = nach_kat.get(e["kategorie"], 0) + 1
    print("  " + ", ".join(f"{KATEGORIE_TITEL.get(k,k)} {n}"
                           for k, n in sorted(nach_kat.items())))
    ohne = {e["vogel_name"] for e in eintraege}
    fehlt = [a[0] for a in arten if a[0] not in ohne]
    if fehlt:
        print("OHNE RUFE: " + ", ".join(fehlt))
    if ohne_meta:
        print(f"{len(ohne_meta)} Ausschnitte ohne Metadaten übersprungen")


def schreibe_index(eintraege):
    """React Native loest require() nur statisch auf -- daher Tabelle."""
    zeilen = [
        "// Erzeugt von data/rufe_einbacken.py -- nicht von Hand aendern.",
        "// Aufnahmen von xeno-canto.org, ueberwiegend CC BY-NC-SA.",
        "// Namensnennung ist Pflicht: 'aufnehmer' und 'lizenz' gehoeren",
        "// sichtbar in die Oberflaeche, nicht nur in diese Datei.",
        "",
        "export type Ruf = {",
        "  id: string;",
        "  vogel: string;",
        "  kategorie: \"gesang\" | \"rufe\" | \"trommeln\";",
        "  xcTyp: string;",
        "  xcId: string;",
        "  aufnehmer: string;",
        "  land: string;",
        "  lizenz: string;",
        "  quelle: number;",
        "};",
        "",
        "export const rufe: Ruf[] = [",
    ]
    for e in sorted(eintraege, key=lambda x: (x["vogel"], x["kategorie"])):
        zeilen.append(
            f'  {{ id: "{e["id"]}", vogel: "{e["vogel"]}", '
            f'kategorie: "{e["kategorie"]}", '
            f'xcTyp: {json.dumps(e["xc_typ"] or "", ensure_ascii=False)}, '
            f'xcId: "{e["xc_id"]}", '
            f'aufnehmer: {json.dumps(e["aufnehmer"] or "", ensure_ascii=False)}, '
            f'land: {json.dumps(e["land"] or "", ensure_ascii=False)}, '
            f'lizenz: {json.dumps(e["lizenz"] or "", ensure_ascii=False)}, '
            f'quelle: require("./{e["datei"]}") }},')
    zeilen += ["];", "",
               "export const rufeZuVogel: Record<string, Ruf[]> = {};",
               "for (const r of rufe) {",
               "  (rufeZuVogel[r.vogel] ??= []).push(r);",
               "}", ""]
    (ZIEL / "index.ts").write_text("\n".join(zeilen), encoding="utf-8")


if __name__ == "__main__":
    main()
