"""Holt die BESTEN Aufnahmen als Referenz -- Lizenz bewusst egal.

Idee (von Matthias): Erst an erstklassigen Aufnahmen lernen, wie ein Ruftyp
ueberhaupt klingt. Aus diesen Referenzen werden Messwerte abgeleitet
(Spitzenfrequenz, Bandbreite, Modulation). Erst diese ZAHLEN wandern
weiter und dienen dazu, im lizenzsauberen Bestand dieselben Rufe zu finden.

Rechtlich sauber, weil die Referenzaufnahmen NIE ausgeliefert werden:
sie bleiben hier auf der Platte. Messwerte sind keine Bearbeitung eines
Werks -- dass ein Ruf bei 7 kHz liegt, ist eine Tatsache, kein Zitat.
Deshalb liegt referenz/ auch in .gitignore.

Auswahl: Qualitaet A, eindeutig EIN Ruftyp, kurz (der Ausschnitt trifft
dann wirklich den gemeinten Ruf), moeglichst mit Anmerkung des Aufnehmenden.

Aufruf:
  C:/Python314/python.exe referenz_holen.py            # Standardarten
  C:/Python314/python.exe referenz_holen.py Turdus     # nur eine Gattung
"""
import json
import os
import sys
import time
from pathlib import Path

import requests

API_KEY = os.environ.get("XENO_CANTO_API_KEY", "")
REF_DIR = Path(__file__).resolve().parent / "referenz"
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}

PRO_TYP = 4          # so viele Referenzaufnahmen je Art und Ruftyp
MAX_SEKUNDEN = 45    # laengere Aufnahmen enthalten meist mehrere Ruftypen

# Bewusst klein gehalten: die Referenz soll erstklassig sein, nicht gross.
# Amsel zuerst -- dort ist der Bestand am dichtesten und die Verwirrung
# am groessten.
REFERENZ_ARTEN = [
    ("Amsel", "Turdus", "merula", ["alarm call", "call", "song"]),
    ("Kohlmeise", "Parus", "major", ["alarm call", "call", "song"]),
    ("Rotkehlchen", "Erithacus", "rubecula", ["alarm call", "call", "song"]),
    ("Buchfink", "Fringilla", "coelebs", ["alarm call", "call", "song"]),
    ("Zaunkönig", "Troglodytes", "troglodytes", ["alarm call", "call", "song"]),
]


def sekunden(rec):
    try:
        teile = (rec.get("length") or "99:99").split(":")
        return int(teile[0]) * 60 + int(teile[1])
    except (ValueError, IndexError):
        return 9999


def rang(rec):
    """Kleiner ist besser: erst mit Anmerkung, dann kurz."""
    hat_anmerkung = 0 if (rec.get("rmk") or "").strip() else 1
    return (hat_anmerkung, sekunden(rec))


def suche(genus, species, typ):
    wert = f'"{typ}"' if " " in typ else typ
    query = f"gen:{genus} sp:{species} type:{wert} q:A"
    r = requests.get("https://xeno-canto.org/api/3/recordings",
                     params={"query": query, "key": API_KEY},
                     headers=UA, timeout=40)
    r.raise_for_status()
    treffer = []
    for rec in r.json().get("recordings") or []:
        typen = [t.strip() for t in (rec.get("type") or "").lower().split(",")]
        # NUR eindeutig einfach getaggte Aufnahmen -- die Referenz muss sauber sein
        if typen != [typ.lower()]:
            continue
        if sekunden(rec) > MAX_SEKUNDEN:
            continue
        treffer.append(rec)
    treffer.sort(key=rang)
    return treffer[:PRO_TYP]


def main():
    if not API_KEY:
        print("XENO_CANTO_API_KEY fehlt (Umgebungsvariable setzen).")
        sys.exit(1)

    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    filter_ = argumente[0].lower() if argumente else None

    REF_DIR.mkdir(parents=True, exist_ok=True)
    verzeichnis = []
    geladen = uebersprungen = 0

    for name_de, genus, species, typen in REFERENZ_ARTEN:
        if filter_ and filter_ not in f"{name_de} {genus} {species}".lower():
            continue
        print(f"\n{name_de} ({genus} {species})")
        for typ in typen:
            treffer = suche(genus, species, typ)
            print(f"  {typ:12s} {len(treffer)} Referenz(en)")
            for rec in treffer:
                xid = rec.get("id")
                suffix = Path(rec.get("file-name") or "x.mp3").suffix.lower() or ".mp3"
                sicher = typ.replace(" ", "_")
                ziel = REF_DIR / f"{species}_{sicher}_XC{xid}{suffix}"

                if not ziel.exists():
                    url = rec["file"]
                    if not url.startswith("http"):
                        url = "https:" + url
                    try:
                        d = requests.get(url, headers=UA, timeout=120)
                        d.raise_for_status()
                        ziel.write_bytes(d.content)
                        geladen += 1
                    except requests.RequestException as e:
                        print(f"     XC{xid} fehlgeschlagen: {e}")
                        continue
                    time.sleep(0.4)
                else:
                    uebersprungen += 1

                verzeichnis.append({
                    "datei": ziel.name,
                    "art": name_de,
                    "wissenschaftlich": f"{genus} {species}",
                    "xc_typ": typ,
                    "xc_id": xid,
                    "laenge": rec.get("length"),
                    "qualitaet": rec.get("q"),
                    "aufnehmer": rec.get("rec"),
                    "lizenz": rec.get("lic"),
                    "anmerkung": (rec.get("rmk") or "").strip()[:300],
                    "label": None,        # <- wird beim Abhoeren gesetzt
                })
                print(f"     XC{xid:9s} {rec.get('length'):6s} {ziel.name}")

    (REF_DIR / "verzeichnis.json").write_text(
        json.dumps(verzeichnis, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n{len(verzeichnis)} Referenzen ({geladen} neu, {uebersprungen} vorhanden)")
    print(f"Ordner: {REF_DIR}")
    print("Hinweis: bleibt lokal, wird NICHT ausgeliefert (siehe .gitignore).")


if __name__ == "__main__":
    main()
