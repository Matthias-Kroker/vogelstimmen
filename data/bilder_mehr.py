"""Holt mehrere Bilder je Vogelart -- verschiedene Perspektiven statt immer dasselbe.

Quelle sind die Bilder des deutschen Wikipedia-Artikels: die sind fuer den
Artikel ausgesucht worden, zeigen also meist brauchbare Ansichten. Reine
Commons-Kategorien waeren groesser, aber ungefiltert (Praeparate,
Verbreitungskarten, Nahaufnahmen von Federn).

Aussortiert werden Karten, Grafiken, Tondateien und Symbole -- die tauchen
in Artikeln regelmaessig auf und waeren im Quiz irrefuehrend.

Wikimedia verlangt Namensnennung: zu jedem Bild werden Urheber und Lizenz
mitgeholt und in die App uebernommen.

Aufruf:
  C:/Python314/python.exe bilder_mehr.py [Artname]
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

BREITE = 800          # zulaessige Wikimedia-Vorschaubreite
MAX_PRO_ART = 5
PAUSE = 1.0

# Was in Artikeln haeufig mitkommt, aber kein brauchbares Vogelfoto ist.
UNERWUENSCHT = re.compile(
    r"(map|karte|verbreitung|distribution|range|logo|icon|symbol|wappen|"
    r"\.svg$|\.ogg$|\.oga$|\.wav$|\.mid$|sonagram|spektrogramm|"
    r"stamp|briefmarke|coat.of.arms|disambig|commons|wiki)", re.I)

# Eier, Praeparate und Skelette zeigen den Vogel nicht so, wie man ihn sieht.
#
# ACHTUNG beim Aendern: hier stand einmal "ei\b" fuer Eier. Da jeder
# Wikipedia-Dateiname mit "Datei:" beginnt und der Doppelpunkt eine
# Wortgrenze ist, traf das AUSNAHMSLOS jedes Bild -- Ergebnis: null
# Kandidaten bei allen zwanzig Arten. Deshalb wird der Praefix jetzt vorher
# entfernt, und "Ei" nur noch als eigenstaendiges Wort gesucht.
UNGEEIGNET = re.compile(r"(\begg|\beier?\b|\bnest|skelet|skull|schädel|schaedel|"
                        r"museum|specimen|präparat|praeparat|mounted|"
                        r"\bfeder\b|feather)", re.I)

PRAEFIX = re.compile(r"^(datei|file|image):\s*", re.I)


# Was ein Bild fuers Quiz untauglich macht. Punktabzug statt Ausschluss,
# damit bei duenner Auswahl trotzdem etwas uebrig bleibt.
ABZUEGE = [
    (re.compile(r"(figurine|figur|statue|zeichnung|drawing|illustration|"
                r"gemälde|painting|kunst|briefmarke)", re.I), 100),
    (re.compile(r"(mwnh|museum|specimen|präparat|praeparat|balg|skelet)", re.I), 100),
    (re.compile(r"(\bei\b|\beier\b|gelege|clutch|egg)", re.I), 80),
    (re.compile(r"(nestling|nistkasten|nest\b|nistplatz|brutkasten)", re.I), 60),
    (re.compile(r"(jungvogel|juvenil|juvenile|\bjunge[rns]?\b|days old|"
                r"küken|kueken|chick|fledgling)", re.I), 50),
    (re.compile(r"(symptom|krank|disease|usutu|tot\b|dead|verletzt)", re.I), 90),
    (re.compile(r"(feder|feather|schädel|skull|fuß|foot|kralle|schnabel)", re.I), 40),
    (re.compile(r"(schwarm|flock|gruppe|viele)", re.I), 20),
]


def bewerte(dateiname, info, vogel):
    """Wie brauchbar ist das Bild fuers Wiedererkennen? Hoeher = besser."""
    name = PRAEFIX.sub("", dateiname)
    punkte = 0

    for muster, abzug in ABZUEGE:
        if muster.search(name):
            punkte -= abzug

    # Wer die Art im Namen traegt, zeigt sie meist auch
    for begriff in (vogel["name_de"], vogel["gattung"], vogel["art"]):
        if begriff and begriff.lower() in name.lower():
            punkte += 25

    # Mittlere Groessen bevorzugen: sehr grosse Dateien sind oft
    # Detailaufnahmen, sehr kleine unbrauchbar
    breite = info.get("breite") or 0
    if 1000 <= breite <= 4000:
        punkte += 15
    elif breite > 6000:
        punkte -= 10

    # Querformat zeigt Voegel meist ganz
    hoehe = info.get("hoehe") or 1
    if breite / max(hoehe, 1) >= 1.2:
        punkte += 10

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


def artikel_bilder(titel):
    """Dateinamen aller Bilder eines Artikels, grob vorgefiltert."""
    r = hole("https://de.wikipedia.org/w/api.php",
             {"action": "query", "prop": "images", "imlimit": 60,
              "format": "json", "titles": titel, "redirects": 1})
    if r is None:
        return []
    try:
        seite = list(r.json()["query"]["pages"].values())[0]
    except (KeyError, IndexError, ValueError):
        return []
    namen = [b["title"] for b in seite.get("images", [])]
    # Ohne "Datei:"-Praefix filtern, sonst greifen die Muster daneben
    return [n for n in namen
            if not UNERWUENSCHT.search(PRAEFIX.sub("", n))
            and not UNGEEIGNET.search(PRAEFIX.sub("", n))]


def bild_infos(dateinamen):
    """Vorschau-URL, Urheber und Lizenz -- in einer Abfrage fuer alle."""
    if not dateinamen:
        return {}
    r = hole("https://de.wikipedia.org/w/api.php",
             {"action": "query", "prop": "imageinfo",
              "iiprop": "url|extmetadata|size", "iiurlwidth": BREITE,
              "format": "json", "titles": "|".join(dateinamen[:20])})
    if r is None:
        return {}
    raus = {}
    try:
        for seite in r.json()["query"]["pages"].values():
            info = (seite.get("imageinfo") or [{}])[0]
            if not info.get("thumburl"):
                continue
            meta = info.get("extmetadata") or {}
            def feld(k):
                wert = (meta.get(k) or {}).get("value", "")
                return re.sub(r"<[^>]+>", "", wert).strip()
            raus[seite["title"]] = {
                "url": info["thumburl"],
                "breite": info.get("width"), "hoehe": info.get("height"),
                "urheber": feld("Artist") or "unbekannt",
                "lizenz": feld("LicenseShortName") or "siehe Dateiseite",
            }
    except (KeyError, ValueError):
        pass
    return raus


def main():
    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    filter_ = argumente[0].lower() if argumente else None

    BILD_DIR.mkdir(parents=True, exist_ok=True)
    gesamt, eintraege = 0, {}

    for pfad in sorted(SPECIES_DIR.glob("*.json")):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        if filter_ and filter_ not in d["name_de"].lower():
            continue

        kandidaten = artikel_bilder(d["name_de"]) or \
            artikel_bilder(d["name_wissenschaftlich"])
        infos = bild_infos(kandidaten)

        # Nach EIGNUNG bewerten, nicht nach Aufloesung. Erster Ansatz
        # sortierte nach Bildbreite -- prompt gewannen Museumspraeparate,
        # Nestlinge, ein Ei und eine Porzellanfigur, weil die in hoher
        # Aufloesung vorliegen. Gross heisst nicht brauchbar.
        brauchbar = [(n, i) for n, i in infos.items()
                     if (i.get("breite") or 0) >= 640]
        brauchbar.sort(key=lambda x: -bewerte(x[0], x[1], d))

        bilder = []
        for nr, (name, info) in enumerate(brauchbar[:MAX_PRO_ART]):
            ziel = BILD_DIR / f"{d['id']}_{nr}.jpg"
            if not ziel.exists():
                r = hole(info["url"], timeout=90)
                if r is None:
                    continue
                ziel.write_bytes(r.content)
                time.sleep(PAUSE)
            bilder.append({
                "datei": ziel.name,
                "urheber": info["urheber"][:120],
                "lizenz": info["lizenz"],
                "commons": name,
            })

        if bilder:
            d["bilder"] = bilder
            pfad.write_text(json.dumps(d, ensure_ascii=False, indent=2),
                            encoding="utf-8")
            eintraege[d["id"]] = bilder
            gesamt += len(bilder)
        print(f"  {d['name_de']:17s} {len(bilder)} Bilder "
              f"(von {len(kandidaten)} Kandidaten)")

    schreibe_index()
    print(f"\n{gesamt} Bilder insgesamt")


def schreibe_index():
    """Tabelle neu bauen -- React Native braucht statische require()."""
    alle = {}
    for pfad in sorted(SPECIES_DIR.glob("*.json")):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        liste = d.get("bilder") or []
        if not liste:
            # Rueckfall auf das eine Bild aus dem ersten Durchlauf
            einzeln = BILD_DIR / f"{d['id']}.jpg"
            if einzeln.exists():
                liste = [{"datei": einzeln.name, "urheber": "",
                          "lizenz": "siehe Wikimedia Commons", "commons": ""}]
        if liste:
            alle[d["id"]] = liste

    zeilen = [
        "// Erzeugt von data/bilder_mehr.py -- nicht von Hand aendern.",
        "// Bilder von Wikimedia Commons. Namensnennung ist Pflicht,",
        "// deshalb stehen Urheber und Lizenz mit in der Tabelle.",
        "",
        "export type VogelBild = {",
        "  quelle: number;",
        "  urheber: string;",
        "  lizenz: string;",
        "};",
        "",
        "export const vogelBilderAlle: Record<string, VogelBild[]> = {",
    ]
    for art_id, liste in alle.items():
        zeilen.append(f'  "{art_id}": [')
        for b in liste:
            zeilen.append(
                f'    {{ quelle: require("./{b["datei"]}"), '
                f'urheber: {json.dumps(b["urheber"], ensure_ascii=False)}, '
                f'lizenz: {json.dumps(b["lizenz"], ensure_ascii=False)} }},')
        zeilen.append("  ],")
    zeilen += ["};", "",
               "/** Erstes Bild je Art -- fuer Liste und Steckbrief-Kopf. */",
               "export const vogelBilder: Record<string, number> =",
               "  Object.fromEntries(",
               "    Object.entries(vogelBilderAlle).map(([k, v]) => [k, v[0].quelle]),",
               "  );", ""]
    (BILD_DIR / "index.ts").write_text("\n".join(zeilen), encoding="utf-8")


if __name__ == "__main__":
    main()
