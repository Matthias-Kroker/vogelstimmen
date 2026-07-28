"""Sammelt Steckbrief-Daten je Vogelart aus offenen Quellen.

Quellen und Lizenzen:
  Wikidata   CC0        Taxonomie, IDs, Verknuepfung
  Wikipedia  CC BY-SA   Beschreibungstext (deutsch)
  Commons    CC BY-SA   Foto
  GloBI      offen      Fressfeinde (preyedUponBy)

Ergebnis: data/species/<art>.json -- wird in die App eingebacken, damit
sie offline funktioniert (Feldeinsatz, schlechter Empfang).

Aufruf:
  C:/Python314/python.exe enrich_species.py            # alle Arten
  C:/Python314/python.exe enrich_species.py Turdus     # nur Treffer
"""
import json
import sys
import time
import urllib.parse
from pathlib import Path

import requests

OUT_DIR = Path(__file__).resolve().parent / "species"
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}

# (deutscher Name, Gattung, Art) -- identisch zum Audio-Generator
SPECIES = [
    ("Amsel", "Turdus", "merula"),
    ("Kohlmeise", "Parus", "major"),
    ("Blaumeise", "Cyanistes", "caeruleus"),
    ("Haussperling", "Passer", "domesticus"),
    ("Star", "Sturnus", "vulgaris"),
    ("Ringeltaube", "Columba", "palumbus"),
    ("Elster", "Pica", "pica"),
    ("Rabenkrähe", "Corvus", "corone"),
    ("Kolkrabe", "Corvus", "corax"),
    ("Rotkehlchen", "Erithacus", "rubecula"),
    ("Buchfink", "Fringilla", "coelebs"),
    ("Zaunkönig", "Troglodytes", "troglodytes"),
    ("Eichelhäher", "Garrulus", "glandarius"),
    ("Buntspecht", "Dendrocopos", "major"),
    ("Sumpfmeise", "Poecile", "palustris"),
    ("Zilpzalp", "Phylloscopus", "collybita"),
    ("Heckenbraunelle", "Prunella", "modularis"),
    ("Turmfalke", "Falco", "tinnunculus"),
    ("Mäusebussard", "Buteo", "buteo"),
    ("Habicht", "Accipiter", "gentilis"),
]

# GloBI liefert weltweite Datensaetze und enthaelt Unsinn fuer unseren Raum
# (ein Blauhai als Amselfresser). Deshalb gegen eine Positivliste
# mitteleuropaeischer Praedatoren filtern, statt blind zu uebernehmen.
PRAEDATOREN_DE = {
    "Accipiter nisus": "Sperber",
    "Accipiter gentilis": "Habicht",
    "Falco peregrinus": "Wanderfalke",
    "Falco subbuteo": "Baumfalke",
    "Falco tinnunculus": "Turmfalke",
    "Falco columbarius": "Merlin",
    "Buteo buteo": "Mäusebussard",
    "Milvus milvus": "Rotmilan",
    "Milvus migrans": "Schwarzmilan",
    "Pernis apivorus": "Wespenbussard",
    "Aquila chrysaetos": "Steinadler",
    "Strix aluco": "Waldkauz",
    "Tyto alba": "Schleiereule",
    "Asio otus": "Waldohreule",
    "Athene noctua": "Steinkauz",
    "Bubo bubo": "Uhu",
    "Aegolius funereus": "Raufußkauz",
    "Glaucidium passerinum": "Sperlingskauz",
    "Corvus corone": "Rabenkrähe",
    "Corvus corax": "Kolkrabe",
    "Corvus frugilegus": "Saatkrähe",
    "Pica pica": "Elster",
    "Garrulus glandarius": "Eichelhäher",
    "Dendrocopos major": "Buntspecht",
    "Lanius excubitor": "Raubwürger",
    "Lanius collurio": "Neuntöter",
    "Felis catus": "Hauskatze",
    "Felis silvestris": "Wildkatze",
    "Vulpes vulpes": "Rotfuchs",
    "Martes martes": "Baummarder",
    "Martes foina": "Steinmarder",
    "Mustela erminea": "Hermelin",
    "Mustela nivalis": "Mauswiesel",
    "Mustela putorius": "Iltis",
    "Nyctereutes procyonoides": "Marderhund",
    "Sciurus vulgaris": "Eichhörnchen",
    "Glis glis": "Siebenschläfer",
    "Muscardinus avellanarius": "Haselmaus",
    "Eliomys quercinus": "Gartenschläfer",
    "Vipera berus": "Kreuzotter",
    "Zamenis longissimus": "Äskulapnatter",
}


def hole(url, params=None, versuche=4, timeout=30):
    """GET mit Wiederholung. Wikidata drosselt (429), das ist normal --
    dann warten statt abbrechen. Gibt None zurueck, wenn es endgueltig
    nicht klappt; der Aufrufer laeuft dann ohne dieses Feld weiter.
    """
    warte = 2
    for versuch in range(versuche):
        try:
            r = requests.get(url, params=params, headers=UA, timeout=timeout)
            if r.status_code == 429:
                print(f"    gedrosselt, warte {warte}s...")
                time.sleep(warte)
                warte *= 2
                continue
            if r.status_code == 404:
                return None
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if versuch == versuche - 1:
                print(f"    Abruf fehlgeschlagen: {e}")
                return None
            time.sleep(warte)
            warte *= 2
    return None


def wikidata_id(genus, species):
    """Q-ID zum wissenschaftlichen Namen finden."""
    r = hole("https://www.wikidata.org/w/api.php",
             {"action": "wbsearchentities", "search": f"{genus} {species}",
              "language": "de", "format": "json", "limit": 5})
    if r is None:
        return None, ""
    for hit in r.json().get("search", []):
        return hit["id"], hit.get("description", "")
    return None, ""


def wikipedia_summary(genus, species, name_de):
    """Deutscher Einleitungstext. Zuerst ueber den deutschen Namen."""
    for title in (name_de, f"{genus} {species}"):
        r = hole("https://de.wikipedia.org/api/rest_v1/page/summary/"
                 + urllib.parse.quote(title.replace(" ", "_")))
        if r is None:
            continue
        d = r.json()
        if d.get("type") == "disambiguation":
            continue
        return {
            "titel": d.get("title"),
            "text": d.get("extract"),
            "url": (d.get("content_urls", {}).get("desktop", {}).get("page")),
            "bild": (d.get("thumbnail") or {}).get("source"),
            "bild_gross": (d.get("originalimage") or {}).get("source"),
        }
    return {}


def globi_fressfeinde(genus, species):
    """Praedatoren, gefiltert auf mitteleuropaeisch plausible Arten."""
    url = ("https://api.globalbioticinteractions.org/taxon/"
           + urllib.parse.quote(f"{genus} {species}") + "/preyedUponBy")
    r = hole(url, timeout=60)
    if r is None:
        return [], 0
    try:
        roh = set()
        for zeile in r.json().get("data", []):
            ziel = zeile[-1]
            roh.update(ziel if isinstance(ziel, list) else [ziel])
    except (ValueError, IndexError) as e:
        print(f"    GloBI-Antwort unlesbar: {e}")
        return [], 0

    treffer = sorted(
        ({"wissenschaftlich": n, "deutsch": PRAEDATOREN_DE[n]}
         for n in roh if n in PRAEDATOREN_DE),
        key=lambda d: d["deutsch"])
    return treffer, len(roh)


def enrich(name_de, genus, species):
    print(f"  {name_de} ({genus} {species})")
    qid, qbeschreibung = wikidata_id(genus, species)
    wiki = wikipedia_summary(genus, species, name_de)
    feinde, roh_anzahl = globi_fressfeinde(genus, species)
    print(f"    Wikidata={qid}  Wikipedia={'ja' if wiki.get('text') else 'NEIN'}"
          f"  Fressfeinde={len(feinde)}/{roh_anzahl}")

    return {
        "id": f"{genus.lower()}_{species.lower()}",
        "domaene": "voegel",
        "name_de": name_de,
        "name_wissenschaftlich": f"{genus} {species}",
        "gattung": genus,
        "art": species,
        "wikidata_id": qid,
        "kurzbeschreibung": qbeschreibung,
        "beschreibung": wiki.get("text"),
        "quelle_text": {"name": "Wikipedia (de)", "url": wiki.get("url"),
                        "lizenz": "CC BY-SA 4.0"},
        "bild": wiki.get("bild_gross") or wiki.get("bild"),
        "quelle_bild": {"name": "Wikimedia Commons", "lizenz": "siehe Dateiseite"},
        "fressfeinde": feinde,
        "quelle_fressfeinde": {"name": "GloBI", "url":
                               "https://www.globalbioticinteractions.org/",
                               "hinweis": "auf mitteleuropäische Arten gefiltert"},
    }


def main():
    filter_ = sys.argv[1].lower() if len(sys.argv) > 1 else None
    arten = [s for s in SPECIES
             if not filter_ or filter_ in " ".join(s).lower()]
    if not arten:
        print(f"Keine Art passt zu '{filter_}'")
        sys.exit(1)

    neu_laden = "--force" in sys.argv
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"{len(arten)} Art(en), Ausgabe nach {OUT_DIR}\n")

    fertig, uebersprungen, luecken = 0, 0, []
    for name_de, genus, species in arten:
        ziel = OUT_DIR / f"{genus.lower()}_{species.lower()}.json"
        # Wiederaufnahme: schon Geholtes nicht erneut abfragen. Schont die
        # Wikipedia-/Wikidata-Server und macht Abbrueche unkritisch.
        if ziel.exists() and not neu_laden:
            print(f"  {name_de}: schon vorhanden, überspringe")
            uebersprungen += 1
            continue

        daten = enrich(name_de, genus, species)
        if not daten.get("beschreibung"):
            luecken.append(f"{name_de} (kein Text)")
        ziel.write_text(json.dumps(daten, ensure_ascii=False, indent=2),
                        encoding="utf-8")
        fertig += 1
        time.sleep(1.5)      # hoeflich bleiben, sonst 429

    print(f"\nFertig. {fertig} neu, {uebersprungen} übersprungen, "
          f"{len(list(OUT_DIR.glob('*.json')))} Dateien gesamt.")
    if luecken:
        print("Unvollständig:", ", ".join(luecken))


if __name__ == "__main__":
    main()
