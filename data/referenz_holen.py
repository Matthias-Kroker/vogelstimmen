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

PRO_TYP = 10         # so viele Referenzaufnahmen je Art und Ruftyp
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


def hole(url, params=None, versuche=4, timeout=60):
    """GET mit Wiederholung -- xeno-canto laeuft gelegentlich in Zeitueberschreitung."""
    warte = 3
    for versuch in range(versuche):
        try:
            r = requests.get(url, params=params, headers=UA, timeout=timeout)
            if r.status_code == 429:
                print(f"    gedrosselt, warte {warte}s...")
                time.sleep(warte); warte *= 2
                continue
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if versuch == versuche - 1:
                print(f"    Abruf endgültig fehlgeschlagen: {e}")
                return None
            print(f"    Versuch {versuch + 1} fehlgeschlagen, neuer Anlauf in {warte}s")
            time.sleep(warte); warte *= 2
    return None


def suche(genus, species, typ):
    wert = f'"{typ}"' if " " in typ else typ
    query = f"gen:{genus} sp:{species} type:{wert} q:A"
    r = hole("https://xeno-canto.org/api/3/recordings",
             {"query": query, "key": API_KEY})
    if r is None:
        return []
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

    # Bestehendes Verzeichnis einlesen und ERGAENZEN, nicht ersetzen. Sonst
    # verlieren Dateien ihre Metadaten, sobald ein Suchlauf fehlschlaegt --
    # genau so sind die alarm-call-Dateien schon einmal zu "?" geworden.
    verzeichnis_map = {}
    vpfad = REF_DIR / "verzeichnis.json"
    if vpfad.exists():
        for e in json.loads(vpfad.read_text(encoding="utf-8")):
            verzeichnis_map[e["datei"]] = e

    geladen = uebersprungen = 0
    leer_ausgegangen = []

    for name_de, genus, species, typen in REFERENZ_ARTEN:
        if filter_ and filter_ not in f"{name_de} {genus} {species}".lower():
            continue
        print(f"\n{name_de} ({genus} {species})")
        for typ in typen:
            treffer = suche(genus, species, typ)
            if not treffer:
                # Nicht stillschweigend weiterlaufen: ein leerer Suchlauf kann
                # heissen "gibt es nicht" ODER "Abruf fehlgeschlagen".
                print(f"  {typ:12s} KEINE Treffer — Abruf gescheitert oder Bestand leer")
                leer_ausgegangen.append(f"{name_de}/{typ}")
                continue
            print(f"  {typ:12s} {len(treffer)} Referenz(en)")
            for rec in treffer:
                xid = rec.get("id")
                suffix = Path(rec.get("file-name") or "x.mp3").suffix.lower() or ".mp3"
                sicher = typ.replace(" ", "_")
                # Ein Ordner je Vogelart -- beim Abhoeren will man nicht
                # zwischen zwanzig Arten in einem Verzeichnis suchen.
                art_dir = REF_DIR / name_de
                art_dir.mkdir(parents=True, exist_ok=True)
                ziel = art_dir / f"{species}_{sicher}_XC{xid}{suffix}"

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

                verzeichnis_map[ziel.name] = {
                    "datei": ziel.name,
                    "ordner": name_de,
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
                }
                print(f"     XC{xid:9s} {rec.get('length'):6s} {ziel.name}")

    verzeichnis = sorted(verzeichnis_map.values(), key=lambda e: e["datei"])
    (REF_DIR / "verzeichnis.json").write_text(
        json.dumps(verzeichnis, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n{len(verzeichnis)} Referenzen im Verzeichnis "
          f"({geladen} neu geladen, {uebersprungen} schon vorhanden)")
    print(f"Ordner: {REF_DIR}")
    print("Hinweis: bleibt lokal, wird NICHT ausgeliefert (siehe .gitignore).")
    if leer_ausgegangen:
        print("\nOHNE ERGEBNIS: " + ", ".join(leer_ausgegangen))
        print("  -> nochmal laufen lassen; das sind meist Zeitüberschreitungen")


if __name__ == "__main__":
    main()
