"""Holt Bilder aus den Commons-Kategorien -- viel groesserer Vorrat als der Artikel.

Der Wikipedia-Artikel enthaelt nur eine Handvoll Bilder, und nach dem
Aussortieren blieben beim Habicht null uebrig. Die Commons-Kategorie zur
Art umfasst dagegen hunderte Dateien.

Neu: Nester und Eier werden nicht mehr weggeworfen, sondern als EIGENE
Gruppe geführt. Wie ein Nest aussieht, ist Lernstoff -- es gehoert nur
nicht unter "so sieht der Vogel aus".

Gruppen:
  vogel   erwachsener Vogel, freilebend
  nest    Nest, Gelege, Brutplatz
  jung    Jungvögel, Nestlinge, Bettelnde

Aussortiert bleiben: Museumspraeparate, Karten, Grafiken, Kunst, Videos.

Aufruf:
  C:/Python314/python.exe bilder_commons.py [Artname]
"""
import json
import re
import sys
import time
from pathlib import Path

import requests

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
BILD_DIR = BASIS.parent / "assets" / "voegel"
UA = {"User-Agent": "Vogelstimmen-Lernprojekt/0.1 (privat; kroker.matthias@googlemail.com)"}
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BREITE = 800
PAUSE = 0.8
KATEGORIE_LIMIT = 200      # so viele Dateien je Kategorie ansehen

ZIELMENGE = {"vogel": 8, "nest": 3, "jung": 2}

# --- Erkennungsmuster ---------------------------------------------------

# Nichts davon zeigt einen lebenden Vogel in der Natur.
AUSSCHLUSS = re.compile(
    r"(mhnt|mwnh|nhmw|rmnh|naturalis|zoo\.\d|museum|specimen|"
    r"präparat|praeparat|\bbalg\b|skelet|skull|schädel|"
    r"figurine|statue|zeichnung|drawing|illustration|painting|gemälde|"
    r"stamp|briefmarke|coin|münze|logo|icon|diagram|chart|"
    r"map|karte|verbreitung|distribution|range|iucn|dist\b|"
    r"sonagram|spektrogramm|spectrogram|"
    r"\bfeder\b|feather|\bfuß\b|\bfoot\b|kralle|talon|"
    r"tot\b|dead|verletzt|injured|krank|disease|usutu|roadkill)", re.I)

NEST = re.compile(r"(nest|horst|eyrie|gelege|clutch|\begg|\beier?\b|"
                  r"brutplatz|nistkasten|nistplatz|brutkasten|nide)", re.I)

JUNG = re.compile(r"(jungvogel|juvenil|juvenile|nestling|fledgling|"
                  r"\bjunge[rns]?\b|küken|kueken|chick|pullus|"
                  r"days old|bettel|begging)", re.I)

PRAEFIX = re.compile(r"^(datei|file|image):\s*", re.I)


# Commons benennt seine Unterkategorien nach Motiv -- damit IST die
# Kategorie das Etikett, und wir muessen nicht an Dateinamen raten.
# Beispiel Amsel: "Turdus merula nests", "Turdus merula (eggs)",
# "Turdus merula (juvenile)", "Turdus merula (museum specimens)".
UNTERKATEGORIE = [
    ("nest", re.compile(r"(nests?|eggs?|breeding|nidification)", re.I)),
    ("jung", re.compile(r"(juvenile|nestling|chicks?|fledgling|pullus)", re.I)),
    # Flugbilder und Kopfaufnahmen sind gute Vogelbilder, nur aus anderer
    # Perspektive -- genau die Abwechslung, um die es geht.
    ("vogel", re.compile(r"(in flight|flying|\bmales?\b|\bfemales?\b|"
                         r"heads?|with prey|behaviour|behavior)", re.I)),
]

# Diese Unterkategorien bringen nichts fuers Wiedererkennen.
KATEGORIE_AUS = re.compile(
    r"(museum specimens|distribution maps|illustrations|audio files|"
    r"sonograms?|spectrograms?|captive|\bdead\b|diseases|disorders|"
    r"skeletons?|skulls?|feathers?|stamps?|coins?|feral|"
    r"with other species|in art|paintings?|drawings?|by country)", re.I)


def gruppe_von_kategorie(kategorie, wissenschaftlich=""):
    """Motiv aus dem Namen der Unterkategorie. None = ueberspringen.

    Beim Zaunkoenig lag in der Hauptkategorie nur eine Karte -- alle Fotos
    stecken in Unterkategorien fuer Unterarten und in "Quality images of".
    Deshalb werden beide hier ausdruecklich beruecksichtigt.
    """
    if KATEGORIE_AUS.search(kategorie):
        return None

    # Commons' eigene Qualitaetsauswahl -- die beste Quelle ueberhaupt
    if re.search(r"(quality|featured|valued) images", kategorie, re.I):
        return "vogel"

    if wissenschaftlich:
        gattung, _, art = wissenschaftlich.partition(" ")
        # Nominatform, z.B. "Troglodytes troglodytes troglodytes" -- das ist
        # die mitteleuropaeische Unterart, also brauchbar.
        if kategorie.lower() == f"{wissenschaftlich} {art}".lower():
            return "vogel"
        if re.search(r"unidentified subspecies", kategorie, re.I):
            return "vogel"
        # Andere Unterarten (islandicus, cypriotes, ...) sehen abweichend aus
        # und wuerden beim Lernen irritieren -- ueberspringen.
        teile = kategorie.split()
        if len(teile) == 3 and teile[0].lower() == gattung.lower():
            return None

    for gruppe, muster in UNTERKATEGORIE:
        if muster.search(kategorie):
            return gruppe
    return None


def gruppe_von(name):
    """Rueckfall fuer die Hauptkategorie: Motiv aus dem Dateinamen raten."""
    sauber = PRAEFIX.sub("", name)
    if AUSSCHLUSS.search(sauber):
        return None
    # Reihenfolge zaehlt: ein Nest mit Jungvoegeln ist ein Nestbild
    if NEST.search(sauber):
        return "nest"
    if JUNG.search(sauber):
        return "jung"
    return "vogel"


def bewerte(name, info, vogel, gruppe):
    """Hoeher ist besser. Fuer jede Gruppe gelten andere Vorlieben."""
    sauber = PRAEFIX.sub("", name)
    punkte = 0

    # Artname im Dateinamen -- EINMAL, nicht je Synonym
    if any(b and b.lower() in sauber.lower()
           for b in (vogel["name_de"], vogel["gattung"], vogel["art"])):
        punkte += 40

    breite = info.get("breite") or 0
    hoehe = info.get("hoehe") or 1
    if 1200 <= breite <= 5000:
        punkte += 15
    elif breite < 900:
        punkte -= 15
    if breite / max(hoehe, 1) >= 1.15:
        punkte += 10

    # Bei Vogelbildern stoeren Schwaerme und Gruppen -- man will EINEN Vogel
    if gruppe == "vogel" and re.search(r"(schwarm|flock|gruppe|group|"
                                       r"\bpair\b|paar\b)", sauber, re.I):
        punkte -= 20

    # Wer eine Lizenzangabe hat, ist meist ordentlich hochgeladen
    if info.get("lizenz") and "siehe" not in info["lizenz"]:
        punkte += 5

    return punkte


def hole(url, params=None, versuche=4, timeout=60):
    warte = 2
    for versuch in range(versuche):
        try:
            r = requests.get(url, params=params, headers=UA, timeout=timeout)
            if r.status_code == 429:
                time.sleep(warte); warte *= 2; continue
            if r.status_code == 404:
                return None
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if versuch == versuche - 1:
                print(f"    fehlgeschlagen: {e}")
                return None
            time.sleep(warte); warte *= 2
    return None


def unterkategorien(kategorie):
    """Namen der Unterkategorien -- dort steckt das meiste Material."""
    r = hole("https://commons.wikimedia.org/w/api.php",
             {"action": "query", "format": "json", "list": "categorymembers",
              "cmtitle": f"Category:{kategorie}", "cmtype": "subcat",
              "cmlimit": 60})
    if r is None:
        return []
    return [c["title"].replace("Category:", "")
            for c in r.json().get("query", {}).get("categorymembers", [])]


def kategorie_dateien(kategorie):
    """Alle Dateien einer Commons-Kategorie samt Bildinfos."""
    raus = {}
    weiter = None
    while True:
        params = {
            "action": "query", "format": "json",
            "generator": "categorymembers",
            "gcmtitle": f"Category:{kategorie}",
            "gcmtype": "file", "gcmlimit": 100,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size|mime",
            "iiurlwidth": BREITE,
        }
        if weiter:
            params["gcmcontinue"] = weiter
        r = hole("https://commons.wikimedia.org/w/api.php", params)
        if r is None:
            break
        d = r.json()
        for seite in (d.get("query", {}).get("pages") or {}).values():
            info = (seite.get("imageinfo") or [{}])[0]
            if not info.get("thumburl") or info.get("mime") != "image/jpeg":
                continue
            meta = info.get("extmetadata") or {}

            def feld(k):
                wert = (meta.get(k) or {}).get("value", "")
                return re.sub(r"<[^>]+>", "", wert).strip()

            raus[seite["title"]] = {
                "url": info["thumburl"],
                "breite": info.get("width"), "hoehe": info.get("height"),
                "urheber": feld("Artist")[:120] or "unbekannt",
                "lizenz": feld("LicenseShortName") or "siehe Dateiseite",
            }
        weiter = (d.get("continue") or {}).get("gcmcontinue")
        if not weiter or len(raus) >= KATEGORIE_LIMIT:
            break
        time.sleep(0.3)
    return raus


def main():
    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    filter_ = argumente[0].lower() if argumente else None

    BILD_DIR.mkdir(parents=True, exist_ok=True)
    summe = {"vogel": 0, "nest": 0, "jung": 0}

    for pfad in sorted(SPECIES_DIR.glob("*.json")):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        if filter_ and filter_ not in d["name_de"].lower():
            continue

        haupt = d["name_wissenschaftlich"]
        nach_gruppe = {"vogel": [], "nest": [], "jung": []}
        gesehen = set()

        # 1. Hauptkategorie -- Motiv aus dem Dateinamen erraten
        dateien = kategorie_dateien(haupt)
        for name, info in dateien.items():
            g = gruppe_von(name)
            if g:
                gesehen.add(name)
                nach_gruppe[g].append((name, info, bewerte(name, info, d, g)))

        # 2. Unterkategorien -- hier steht das Motiv im Kategorienamen,
        #    das ist verlaesslicher als jeder Dateiname
        quellen = []
        for unter in unterkategorien(haupt):
            gruppe = gruppe_von_kategorie(unter, haupt)
            if not gruppe:
                continue
            quellen.append(f"{unter} -> {gruppe}")
            for name, info in kategorie_dateien(unter).items():
                if name in gesehen:
                    continue
                gesehen.add(name)
                # Ausschlussmuster trotzdem anwenden, aber die Gruppe
                # kommt aus der Kategorie, nicht aus dem Dateinamen
                if AUSSCHLUSS.search(PRAEFIX.sub("", name)):
                    continue
                nach_gruppe[gruppe].append(
                    (name, info, bewerte(name, info, d, gruppe)))
            time.sleep(0.2)

        if not gesehen:
            print(f"  {d['name_de']:17s} Kategorie leer oder unbekannt")
            continue
        for g in nach_gruppe:
            # Schwelle 25 statt 40: in Unterkategorien fehlt der Artname im
            # Dateinamen oft, weil die Kategorie ihn schon nennt. Die
            # Zuordnung kommt dort ohnehin aus dem Kategorienamen.
            nach_gruppe[g] = [x for x in nach_gruppe[g] if x[2] >= 25]
            nach_gruppe[g].sort(key=lambda x: -x[2])

        ergebnis = {}
        for gruppe, wieviele in ZIELMENGE.items():
            gewaehlt = []
            for nr, (name, info, _) in enumerate(nach_gruppe[gruppe][:wieviele]):
                ziel = BILD_DIR / f"{d['id']}_{gruppe}{nr}.jpg"
                if not ziel.exists():
                    r = hole(info["url"], timeout=90)
                    if r is None:
                        continue
                    ziel.write_bytes(r.content)
                    time.sleep(PAUSE)
                gewaehlt.append({
                    "datei": ziel.name, "urheber": info["urheber"],
                    "lizenz": info["lizenz"], "commons": name,
                })
            if gewaehlt:
                ergebnis[gruppe] = gewaehlt
                summe[gruppe] += len(gewaehlt)

        d["bildgruppen"] = ergebnis
        pfad.write_text(json.dumps(d, ensure_ascii=False, indent=2),
                        encoding="utf-8")
        print(f"  {d['name_de']:17s} "
              + "  ".join(f"{g}={len(ergebnis.get(g, []))}" for g in ZIELMENGE)
              + f"   (aus {len(gesehen)} Dateien, "
              + f"{len(quellen)} Unterkategorien)")

    schreibe_index()
    print(f"\nVogel {summe['vogel']}, Nest {summe['nest']}, "
          f"Jungvogel {summe['jung']}")


def schreibe_index():
    """Tabelle mit statischen require() -- anders findet RN die Bilder nicht."""
    zeilen = [
        "// Erzeugt von data/bilder_commons.py -- nicht von Hand aendern.",
        "// Bilder von Wikimedia Commons. Namensnennung ist Pflicht,",
        "// deshalb stehen Urheber und Lizenz mit in der Tabelle.",
        "",
        "export type VogelBild = {",
        "  quelle: number;",
        "  urheber: string;",
        "  lizenz: string;",
        "};",
        "",
        "/** Bilder je Art, aufgeteilt nach Motiv. */",
        "export type Bildgruppen = {",
        "  vogel?: VogelBild[];",
        "  nest?: VogelBild[];",
        "  jung?: VogelBild[];",
        "};",
        "",
        "export const bildgruppen: Record<string, Bildgruppen> = {",
    ]

    for pfad in sorted(SPECIES_DIR.glob("*.json")):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        gruppen = d.get("bildgruppen") or {}
        # Rueckfall: alte Einzelbilder, falls die Kategorie nichts hergab
        if not gruppen.get("vogel"):
            ersatz = [b for b in (d.get("bilder") or [])
                      if (BILD_DIR / b["datei"]).exists()]
            if not ersatz:
                einzeln = BILD_DIR / f"{d['id']}.jpg"
                if einzeln.exists():
                    ersatz = [{"datei": einzeln.name, "urheber": "",
                               "lizenz": "siehe Wikimedia Commons"}]
            if ersatz:
                gruppen = {**gruppen, "vogel": ersatz}
        if not gruppen:
            continue

        zeilen.append(f'  "{d["id"]}": {{')
        for gruppe in ("vogel", "nest", "jung"):
            liste = [b for b in gruppen.get(gruppe, [])
                     if (BILD_DIR / b["datei"]).exists()]
            if not liste:
                continue
            zeilen.append(f"    {gruppe}: [")
            for b in liste:
                zeilen.append(
                    f'      {{ quelle: require("./{b["datei"]}"), '
                    f'urheber: {json.dumps(b.get("urheber", ""), ensure_ascii=False)}, '
                    f'lizenz: {json.dumps(b.get("lizenz", ""), ensure_ascii=False)} }},')
            zeilen.append("    ],")
        zeilen.append("  },")

    zeilen += [
        "};", "",
        "/** Nur die Vogelbilder -- fuer Liste und Quiz. */",
        "export const vogelBilderAlle: Record<string, VogelBild[]> =",
        "  Object.fromEntries(",
        "    Object.entries(bildgruppen)",
        "      .filter(([, g]) => (g.vogel?.length ?? 0) > 0)",
        "      .map(([k, g]) => [k, g.vogel!]),",
        "  );", "",
        "/** Erstes Vogelbild je Art. */",
        "export const vogelBilder: Record<string, number> =",
        "  Object.fromEntries(",
        "    Object.entries(vogelBilderAlle).map(([k, v]) => [k, v[0].quelle]),",
        "  );", "",
    ]
    (BILD_DIR / "index.ts").write_text("\n".join(zeilen), encoding="utf-8")


if __name__ == "__main__":
    main()
