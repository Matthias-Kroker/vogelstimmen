"""Laedt die Vogelbilder herunter und backt sie in die App ein.

Warum lokal statt per URL: die App soll im Feld funktionieren, wo der
Empfang schlecht ist. Ausserdem koennen sich Commons-URLs aendern.

Die Bilder werden auf Breite BREITE verkleinert -- Wikipedia liefert
teilweise 5000-Pixel-Originale, das braucht niemand auf dem Handy.

Erzeugt ausserdem assets/voegel/index.ts: React Native kann Bilder nur
ueber statisches require() einbinden, ein zusammengebauter Pfad
funktioniert nicht.

Aufruf:
  C:/Python314/python.exe bilder_holen.py
"""
import json
import sys
from pathlib import Path

import time

import requests

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
BILD_DIR = BASIS.parent / "assets" / "voegel"
# Wikimedia verlangt eine aussagekraeftige Kennung mit Kontaktmoeglichkeit,
# sonst greift die Robot-Policy und es hagelt 429er.
UA = {"User-Agent": "Vogelstimmen-Lernprojekt/0.1 (privat; kroker.matthias@googlemail.com)"}

# Wikimedia erlaubt nur bestimmte Vorschaubreiten -- 900 wird mit 400
# abgelehnt ("Use thumbnail sizes listed on..."). 800 ist zulaessig.
BREITE = 800
PAUSE = 1.2           # Sekunden zwischen Abrufen, sonst drosselt Wikimedia
sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def commons_verkleinert(url, breite=BREITE):
    """Wikimedia liefert verkleinerte Fassungen ueber den /thumb/-Pfad."""
    if "/commons/" not in url or "/thumb/" in url:
        return url
    teile = url.split("/commons/")
    datei = teile[1].rsplit("/", 1)[-1]
    return f"{teile[0]}/commons/thumb/{teile[1]}/{breite}px-{datei}"


def main():
    BILD_DIR.mkdir(parents=True, exist_ok=True)
    dateien = sorted(SPECIES_DIR.glob("*.json"))
    if not dateien:
        print("Keine Artdaten gefunden."); sys.exit(1)

    eintraege, fehlend = [], []

    for pfad in dateien:
        d = json.loads(pfad.read_text(encoding="utf-8"))
        url = d.get("bild")
        art_id = d["id"]
        if not url:
            fehlend.append(d["name_de"]); continue

        # .svg waere in RN unbrauchbar, dann lieber das Vorschaubild
        endung = ".jpg" if not url.lower().endswith(".png") else ".png"
        ziel = BILD_DIR / f"{art_id}{endung}"

        if not ziel.exists():
            geschafft = False
            for versuch_url in (commons_verkleinert(url), url):
                warte = 2
                for versuch in range(4):
                    try:
                        r = requests.get(versuch_url, headers=UA, timeout=90)
                        if r.status_code == 429:
                            time.sleep(warte); warte *= 2; continue
                        r.raise_for_status()
                        ziel.write_bytes(r.content)
                        geschafft = True
                        break
                    except requests.RequestException as e:
                        if versuch == 3:
                            print(f"  {d['name_de']}: {e}")
                        else:
                            time.sleep(warte); warte *= 2
                if geschafft:
                    break
            if not geschafft:
                fehlend.append(d["name_de"]); continue
            time.sleep(PAUSE)

        groesse = ziel.stat().st_size
        eintraege.append((art_id, ziel.name, d["name_de"]))
        print(f"  {d['name_de']:17s} {ziel.name:28s} {groesse/1024:7.0f} KB")

        # Bildpfad in die Artdaten zurueckschreiben
        d["bild_lokal"] = f"assets/voegel/{ziel.name}"
        pfad.write_text(json.dumps(d, ensure_ascii=False, indent=2),
                        encoding="utf-8")

    # React Native braucht statische require() -- ein aus Variablen
    # zusammengesetzter Pfad wird vom Bundler nicht aufgeloest.
    zeilen = ["// Erzeugt von data/bilder_holen.py -- nicht von Hand aendern.",
              "// React Native loest require() nur statisch auf, deshalb diese Tabelle.",
              "",
              "export const vogelBilder: Record<string, number> = {"]
    for art_id, dateiname, name_de in eintraege:
        zeilen.append(f'  "{art_id}": require("./{dateiname}"),   // {name_de}')
    zeilen.append("};")
    zeilen.append("")
    (BILD_DIR / "index.ts").write_text("\n".join(zeilen), encoding="utf-8")

    print(f"\n{len(eintraege)} Bilder in {BILD_DIR}")
    print(f"Tabelle: {BILD_DIR / 'index.ts'}")
    if fehlend:
        print("OHNE BILD: " + ", ".join(fehlend))


if __name__ == "__main__":
    main()
