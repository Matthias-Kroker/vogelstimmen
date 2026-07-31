"""Raeumt unbenutzte Bilder weg und verkleinert die uebrigen fuers Handy.

Nach mehreren Anlaeufen lagen 349 Dateien im Ordner, von denen nur 246
tatsaechlich verwendet werden -- der Rest stammt aus frueheren Verfahren.

Verkleinert wird auf BREITE Pixel: auf einem Handybildschirm bringt mehr
nichts, kostet aber Ladezeit und Speicher. Von 84 MB bleibt gut die Haelfte.

Aufruf:
  C:/Python314/python.exe bilder_verkleinern.py [--trocken]
"""
import json
import sys
from pathlib import Path

from PIL import Image

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
BILD_DIR = BASIS.parent / "assets" / "voegel"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BREITE = 720          # reicht fuer Handy und Web reichlich
QUALITAET = 82        # sichtbar verlustfrei bei Fotos


def benutzte_dateien():
    """Alles, was in den Artdaten oder im Index referenziert wird."""
    benutzt = set()
    for pfad in SPECIES_DIR.glob("*.json"):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        for gruppe in (d.get("bildgruppen") or {}).values():
            for b in gruppe:
                benutzt.add(b["datei"])
    # Der Index kann auf Rueckfallbilder zeigen, die nicht in bildgruppen stehen
    index = BILD_DIR / "index.ts"
    if index.exists():
        text = index.read_text(encoding="utf-8")
        for zeile in text.splitlines():
            if 'require("./' in zeile:
                benutzt.add(zeile.split('require("./')[1].split('"')[0])
    return benutzt


def main():
    trocken = "--trocken" in sys.argv
    benutzt = benutzte_dateien()
    alle = sorted(BILD_DIR.glob("*.jpg")) + sorted(BILD_DIR.glob("*.png"))

    verwaist = [f for f in alle if f.name not in benutzt]
    behalten = [f for f in alle if f.name in benutzt]

    vorher = sum(f.stat().st_size for f in alle)
    print(f"{len(alle)} Dateien, {vorher/1048576:.1f} MB")
    print(f"  benutzt: {len(behalten)}   verwaist: {len(verwaist)}")

    if trocken:
        print("\n(Trockenlauf -- nichts geaendert)")
        return

    for f in verwaist:
        f.unlink()

    verkleinert = 0
    for f in behalten:
        try:
            with Image.open(f) as bild:
                if bild.width <= BREITE:
                    continue
                hoehe = round(bild.height * BREITE / bild.width)
                # LANCZOS: bestes Ergebnis beim Verkleinern von Fotos
                klein = bild.convert("RGB").resize((BREITE, hoehe),
                                                   Image.LANCZOS)
                klein.save(f, "JPEG", quality=QUALITAET, optimize=True)
                verkleinert += 1
        except OSError as e:
            print(f"  {f.name}: {e}")

    nachher = sum(f.stat().st_size for f in BILD_DIR.glob("*.jpg"))
    print(f"\n{len(verwaist)} verwaiste gelöscht, {verkleinert} verkleinert")
    print(f"{vorher/1048576:.1f} MB  ->  {nachher/1048576:.1f} MB "
          f"({100 - nachher*100//vorher} % gespart)")


if __name__ == "__main__":
    main()
