"""Holt die ausfuehrlichen Abschnitte aus dem deutschen Wikipedia-Artikel.

Bisher steckte nur der Einleitungstext in den Artdaten. Die Artikel haben
aber Abschnitte zu Merkmalen, Lebensraum, Ernaehrung, Fortpflanzung -- und
vor allem zur STIMME. Letzteres ist fuer dieses Projekt das Wertvollste:
dort beschreibt jemand in Worten, was wir muehsam messen.

Wikipedia ist CC BY-SA -- Namensnennung und gleiche Lizenz bei Weitergabe.
Deshalb wandert der Artikel-Link mit in die Daten.

Aufruf:
  C:/Python314/python.exe abschnitte_holen.py [Artname]
"""
import json
import re
import sys
import time
from pathlib import Path

import requests

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
UA = {"User-Agent": "Vogelstimmen-Lernprojekt/0.1 (privat; kroker.matthias@googlemail.com)"}
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Welche Abschnitte uns interessieren, und unter welchem Namen sie in der
# App erscheinen sollen. Die Artikel benennen sie unterschiedlich, deshalb
# je Ziel mehrere moegliche Ueberschriften.
GESUCHT = [
    ("stimme", "Stimme", ["stimme", "lautäußerungen", "gesang", "rufe",
                          "lautäusserungen"]),
    ("merkmale", "Merkmale", ["merkmale", "aussehen", "beschreibung",
                              "erscheinungsbild", "kennzeichen"]),
    ("lebensraum", "Lebensraum", ["lebensraum", "habitat", "verbreitung und lebensraum"]),
    ("ernaehrung", "Ernährung", ["ernährung", "nahrung", "nahrungserwerb",
                                 "ernährung und nahrungserwerb"]),
    ("fortpflanzung", "Fortpflanzung", ["fortpflanzung", "brut", "brutbiologie",
                                        "fortpflanzung und brutpflege"]),
    ("verhalten", "Verhalten", ["verhalten", "lebensweise"]),
]

MAX_ZEICHEN = 1400      # laenger liest niemand auf dem Handy


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


def kuerzen(text, grenze=MAX_ZEICHEN):
    """Auf Satzgrenze kuerzen, nicht mitten im Wort."""
    text = re.sub(r"\n{2,}", "\n\n", text.strip())
    if len(text) <= grenze:
        return text
    schnitt = text[:grenze]
    letzter = max(schnitt.rfind(". "), schnitt.rfind(".\n"))
    if letzter > grenze * 0.5:
        return schnitt[:letzter + 1]
    return schnitt.rstrip() + " …"


def abschnitte_zerlegen(volltext):
    """Den Klartext an den Ueberschriften aufteilen.

    Ueberschriften kommen als "== Titel ==" bzw. "=== Untertitel ===".

    WICHTIG: Manche Abschnitte haben gar keinen eigenen Text, sondern nur
    Unterabschnitte -- beim Rotkehlchen etwa "Stimme und Gesang" mit den
    Unterpunkten "Rufe und Kommunikation" und "Gesang und Gesangsverhalten".
    Der erste Ansatz hat solche Abschnitte verworfen, weil nichts direkt
    darunter stand. Deshalb wird der Text der Unterabschnitte an den
    Elternabschnitt angehaengt.
    """
    roh = []          # (ebene, titel, text)
    ebene, aktuell, gesammelt = None, None, []
    for zeile in volltext.split("\n"):
        treffer = re.match(r"^(={2,6})\s*(.+?)\s*\1$", zeile.strip())
        if treffer:
            if aktuell is not None:
                roh.append((ebene, aktuell, "\n".join(gesammelt).strip()))
            ebene = len(treffer.group(1))
            aktuell = treffer.group(2).strip()
            gesammelt = []
        elif aktuell is not None:
            gesammelt.append(zeile)
    if aktuell is not None:
        roh.append((ebene, aktuell, "\n".join(gesammelt).strip()))

    teile = {}
    for i, (stufe, titel, text) in enumerate(roh):
        gesamt = [text] if text else []
        # alles Untergeordnete dazunehmen, bis wieder eine gleich- oder
        # hoeherrangige Ueberschrift kommt
        for tiefer, untertitel, untertext in roh[i + 1:]:
            if tiefer <= stufe:
                break
            if untertext:
                gesamt.append(f"{untertitel}: {untertext}")
        if gesamt:
            teile[titel.lower()] = "\n\n".join(gesamt).strip()
    return teile


def main():
    argumente = [a for a in sys.argv[1:] if not a.startswith("--")]
    filter_ = argumente[0].lower() if argumente else None

    dateien = sorted(SPECIES_DIR.glob("*.json"))
    ohne_stimme = []

    for pfad in dateien:
        d = json.loads(pfad.read_text(encoding="utf-8"))
        if filter_ and filter_ not in d["name_de"].lower():
            continue

        # Der deutsche Name ist nicht immer eindeutig: "Star" fuehrt auf eine
        # Begriffsklaerung, der Vogel steht unter "Star (Art)". Der
        # wissenschaftliche Name leitet dagegen zuverlaessig weiter.
        volltext, benutzt = "", None
        for titel in (d["name_de"], d["name_wissenschaftlich"]):
            r = hole("https://de.wikipedia.org/w/api.php",
                     {"action": "query", "prop": "extracts", "explaintext": 1,
                      "format": "json", "titles": titel, "redirects": 1})
            if r is None:
                continue
            try:
                seite = list(r.json()["query"]["pages"].values())[0]
            except (KeyError, IndexError, ValueError):
                continue
            text = seite.get("extract") or ""
            # Begriffsklaerungen sind kurz und haben keine Abschnitte
            if len(text) > 4000 and "==" in text:
                volltext, benutzt = text, seite.get("title")
                break
        if not volltext:
            print(f"  {d['name_de']:17s} kein brauchbarer Artikel"); continue
        if benutzt and benutzt != d["name_de"]:
            print(f"  {d['name_de']:17s} (Artikel: „{benutzt}“)")

        vorhanden = abschnitte_zerlegen(volltext)
        gefunden = {}
        for schluessel, titel, kandidaten in GESUCHT:
            # exakte Ueberschrift zuerst, dann Teiltreffer
            quelle = next((vorhanden[k] for k in kandidaten if k in vorhanden), None)
            if quelle is None:
                quelle = next((t for ueber, t in vorhanden.items()
                               if any(k in ueber for k in kandidaten)), None)
            if quelle:
                gefunden[schluessel] = {"titel": titel, "text": kuerzen(quelle)}

        d["abschnitte"] = gefunden
        pfad.write_text(json.dumps(d, ensure_ascii=False, indent=2),
                        encoding="utf-8")

        namen = ", ".join(g["titel"] for g in gefunden.values())
        if "stimme" not in gefunden:
            ohne_stimme.append(d["name_de"])
        print(f"  {d['name_de']:17s} {len(gefunden)} Abschnitte: {namen}")
        time.sleep(1.0)

    if ohne_stimme:
        print("\nOHNE Abschnitt „Stimme“: " + ", ".join(ohne_stimme))


if __name__ == "__main__":
    main()
