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
    # Ergaenzt 2026-08: steht in den Fressfeind-Listen unserer Arten an
    # sechster Stelle, fehlte aber als eigene Art. Zudem der Praedator,
    # gegen den die Kohlmeise nachweislich laenger und elementreicher
    # zetert als gegen den Waldkauz (Sci. Rep. 9, 2019) -- also genau die
    # Art, die man beim Alarm-Lernen kennen muss.
    ("Sperber", "Accipiter", "nisus"),
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
    "Rattus norvegicus": "Wanderratte",
}

# Was erbeutet wird. GloBI kennt diese Unterscheidung nicht (das Feld
# life_stage ist durchgehend leer), sie ist aber der Kern der Sache: ein
# Buntspecht jagt keine erwachsene Amsel, er pluendert Nester. Und nur
# Praedatoren von Altvoegeln loesen den Alarmruf aus, um den es beim
# Lernen geht.
BEUTE_STADIUM = {
    # Greifvögel und Eulen -- jagen Altvögel
    "Sperber": "Altvogel", "Habicht": "Altvogel", "Wanderfalke": "Altvogel",
    "Baumfalke": "Altvogel", "Merlin": "Altvogel", "Turmfalke": "Altvogel",
    "Mäusebussard": "Altvogel", "Rotmilan": "Altvogel", "Schwarzmilan": "Altvogel",
    "Wespenbussard": "Altvogel", "Steinadler": "Altvogel", "Waldkauz": "Altvogel",
    "Schleiereule": "Altvogel", "Waldohreule": "Altvogel", "Steinkauz": "Altvogel",
    "Uhu": "Altvogel", "Raufußkauz": "Altvogel", "Sperlingskauz": "Altvogel",
    "Raubwürger": "Altvogel", "Neuntöter": "Altvogel",
    # Rabenvögel, Specht, Nager, Schlangen -- pluendern Gelege und Jungvögel
    "Rabenkrähe": "Nest", "Kolkrabe": "Nest", "Saatkrähe": "Nest",
    "Elster": "Nest", "Eichelhäher": "Nest", "Buntspecht": "Nest",
    "Eichhörnchen": "Nest", "Siebenschläfer": "Nest", "Haselmaus": "Nest",
    "Gartenschläfer": "Nest", "Kreuzotter": "Nest", "Äskulapnatter": "Nest",
    "Wanderratte": "Nest",
    # Säuger am Boden -- beides, je nach Gelegenheit
    "Hauskatze": "beides", "Wildkatze": "beides", "Rotfuchs": "beides",
    "Baummarder": "beides", "Steinmarder": "beides", "Hermelin": "beides",
    "Mauswiesel": "beides", "Iltis": "beides", "Marderhund": "beides",
}

# Welchen Alarm ein Praedator ausloest. Zweite, UNABHAENGIGE Achse neben
# BEUTE_STADIUM -- das ist der Kern der Sache:
#
#   Warnruf  ~7 kHz, gleichbleibender duenner Ton, weicher Ein- und Ausklang.
#            Absichtlich schwer zu orten, verraet den Rufer nicht. Reaktion:
#            Deckung suchen. Nur fuer Greifvoegel IM FLUG.
#   Hassruf  breitbandig, hart, abgehackt. Absichtlich leicht zu orten, ruft
#            Artgenossen herbei. Reaktion: hinfliegen und bedraengen ("Hassen").
#            Fuer alles Sitzende oder am Boden -- auch Nesträuber.
#
# Wichtig: Eine Eule erbeutet Altvoegel (stadium=Altvogel), wird tagsueber am
# Schlafplatz aber gehasst (alarmtyp=Hassruf). Die beiden Achsen laufen
# deshalb nicht parallel und duerfen nicht zusammengelegt werden.
# Quelle: Marler, Unterscheidung aerial alarm / mobbing call.
ALARMTYP = {
    # Greifvögel im Flug -> duenner Warnruf, Deckung suchen
    "Sperber": "Warnruf", "Habicht": "Warnruf", "Wanderfalke": "Warnruf",
    "Baumfalke": "Warnruf", "Merlin": "Warnruf", "Turmfalke": "Warnruf",
    "Mäusebussard": "Warnruf", "Rotmilan": "Warnruf", "Schwarzmilan": "Warnruf",
    "Wespenbussard": "Warnruf", "Steinadler": "Warnruf",
}
# Alles Uebrige (Eulen am Schlafplatz, Rabenvoegel, Saeuger, Nager, Schlangen)
# wird gehasst statt bewarnt.
ALARMTYP_STANDARD = "Hassruf"

ALARMTYP_INFO = {
    "Warnruf": {
        "ausloeser": "Greifvogel im Flug",
        "klang": "hoher, gleichbleibender dünner Ton (~7 kHz), weich ein- und ausklingend",
        "warum": "absichtlich schwer zu orten — verrät den Rufer nicht",
        "reaktion": "Deckung suchen, verstummen",
        "beispiel_amsel": "langes „ziiiiehhh“",
    },
    "Hassruf": {
        "ausloeser": "sitzender oder bodengebundener Feind, auch Nesträuber",
        "klang": "breitbandig, hart, abgehackt",
        "warum": "absichtlich leicht zu orten — ruft Artgenossen zur Verstärkung",
        "reaktion": "hinfliegen und den Feind bedrängen („Hassen“)",
        "beispiel_amsel": "„keckern“, Schäckern",
    },
}

# Zusaetzliche Suchformen fuer den Wikipedia-Abgleich. Der Artikel schreibt
# "Füchse", nicht "Rotfuchs" -- ohne diese Varianten faende der Abgleich
# genau die Arten nicht, die im Text stehen.
SUCHFORMEN = {
    "Rotfuchs": ["Fuchs", "Füchse", "Füchsen"],
    "Hauskatze": ["Hauskatze", "Hauskatzen", "Katze", "Katzen"],
    "Wildkatze": ["Wildkatze", "Wildkatzen"],
    "Baummarder": ["Baummarder", "Marder"],
    "Steinmarder": ["Steinmarder", "Marder"],
    "Eichhörnchen": ["Eichhörnchen"],
    "Rabenkrähe": ["Rabenkrähe", "Rabenkrähen", "Krähe", "Krähen"],
    "Wanderratte": ["Wanderratte", "Wanderratten", "Ratte", "Ratten"],
    "Mäusebussard": ["Mäusebussard", "Bussard"],
    "Kreuzotter": ["Kreuzotter", "Schlange", "Schlangen"],
}


def _suchformen(name_de):
    """Wortformen, unter denen ein Praedator im Artikel stehen kann."""
    if name_de in SUCHFORMEN:
        return SUCHFORMEN[name_de]
    return [name_de, name_de + "n", name_de + "en", name_de + "e"]


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


def wikipedia_volltext(name_de):
    """Kompletter Artikeltext -- Grundlage fuer den Gegencheck."""
    r = hole("https://de.wikipedia.org/w/api.php",
             {"action": "query", "prop": "extracts", "explaintext": 1,
              "format": "json", "titles": name_de}, timeout=45)
    if r is None:
        return ""
    try:
        seiten = r.json()["query"]["pages"]
        return list(seiten.values())[0].get("extract", "") or ""
    except (KeyError, IndexError, ValueError):
        return ""


def pruefe_fressfeinde(kandidaten, artikel):
    """Gegencheck gegen den Wikipedia-Artikel + Einordnung nach Beutestadium.

    GloBI allein ist zu grosszuegig (weltweite Datensaetze, je nur eine
    Quelle, keine Lebensstadien). Wer im Artikel der Art namentlich steht,
    gilt als bestaetigt -- das ist eine unabhaengige zweite Quelle.
    """
    bestaetigt, offen = [], []
    for k in kandidaten:
        eintrag = dict(k)
        # Zwei unabhaengige Achsen: WAS erbeutet wird und WELCHER Alarm kommt.
        eintrag["stadium"] = BEUTE_STADIUM.get(k["deutsch"], "unbekannt")
        eintrag["alarmtyp"] = ALARMTYP.get(k["deutsch"], ALARMTYP_STANDARD)
        if artikel and any(f in artikel for f in _suchformen(k["deutsch"])):
            eintrag["bestaetigt"] = True
            bestaetigt.append(eintrag)
        else:
            eintrag["bestaetigt"] = False
            offen.append(eintrag)

    # Bestaetigte zuerst. Bleibt nichts uebrig (kurzer Artikel), die
    # plausibelsten unbestaetigten mitnehmen, aber sichtbar markiert.
    if bestaetigt:
        return bestaetigt, offen
    return offen[:6], []


def enrich(name_de, genus, species):
    print(f"  {name_de} ({genus} {species})")
    qid, qbeschreibung = wikidata_id(genus, species)
    wiki = wikipedia_summary(genus, species, name_de)
    kandidaten, roh_anzahl = globi_fressfeinde(genus, species)
    artikel = wikipedia_volltext(name_de)
    feinde, unbestaetigt = pruefe_fressfeinde(kandidaten, artikel)

    alt = sum(1 for f in feinde if f["stadium"] in ("Altvogel", "beides"))
    nest = sum(1 for f in feinde if f["stadium"] in ("Nest", "beides"))
    warn = sum(1 for f in feinde if f["alarmtyp"] == "Warnruf")
    hass = sum(1 for f in feinde if f["alarmtyp"] == "Hassruf")
    print(f"    Wikidata={qid}  Wikipedia={'ja' if wiki.get('text') else 'NEIN'}"
          f"  Fressfeinde={len(feinde)}/{len(kandidaten)} (roh {roh_anzahl})"
          f"  [Altvogel {alt}/Nest {nest}]  [Warnruf {warn}/Hassruf {hass}]")

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
        "fressfeinde_unbestaetigt": unbestaetigt,
        "alarmtypen": ALARMTYP_INFO,
        "quelle_fressfeinde": {
            "name": "GloBI, gegengeprüft mit Wikipedia (de)",
            "url": "https://www.globalbioticinteractions.org/",
            "hinweis": "auf mitteleuropäische Arten gefiltert; als bestätigt "
                       "gilt, wer im Artikel der Art namentlich vorkommt. "
                       "'stadium' unterscheidet Jäger von Altvögeln und "
                       "Nesträubern -- nur erstere lösen Alarmrufe aus.",
        },
    }


def main():
    # Optionen (--force) von einem Art-Filter trennen.
    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    filter_ = argumente[0].lower() if argumente else None
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
