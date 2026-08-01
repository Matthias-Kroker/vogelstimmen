"""Stellt fuer einen Standort eine Artenliste zusammen.

Die Idee: nicht jede Region von Hand kuratieren, sondern die REGELN
festschreiben. Dann ist das Ergebnis fuer jeden Ort gleich hergeleitet und
jederzeit nachrechenbar -- und man sieht, warum eine Art drin ist.

Zwei Bestandteile:

  Haeufigkeit   aus GBIF, ohne Schluessel abrufbar. Wie viele Beobachtungen
                der Art gibt es im Umkreis? Rein datengetrieben.

  Alarmnutzen   aus unseren eigenen Daten: ist die Art als Leitart
                eingeordnet, und bei wie vielen anderen Arten loest sie
                Alarm aus (aus den Fressfeind-Listen abgeleitet)?

Je nach Lernziel werden beide unterschiedlich gewichtet -- deshalb kommt
beim Ziel "Vogelsprache" der Sperber mit, obwohl er in den
Beobachtungszahlen weit unten steht.

WICHTIG zur Belastbarkeit: die Haeufigkeit ist gemessen, der Alarmnutzen
teils geschaetzt (siehe daten/vogelsprache.ts). Das Skript vermischt beides
bewusst nicht stillschweigend, sondern weist es getrennt aus.

Aufruf:
  C:/Python314/python.exe region_bauen.py --lat 50.11 --lon 8.68 --umkreis 30
  C:/Python314/python.exe region_bauen.py --land DE --ziel vogelsprache
"""
import argparse
import json
import sys
import time
from pathlib import Path

import requests

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
ZIEL_DIR = BASIS.parent / "daten" / "regionen"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

GBIF = "https://api.gbif.org/v1/occurrence/search"
VOEGEL_TAXON = 212          # Klasse Aves
UA = {"User-Agent": "Vogelstimmen-Lernprojekt/0.1 (privat)"}

LERNZIELE = {
    "artenkunde": {
        "titel": "Artenkunde",
        "beschreibung": "Die häufigsten Arten deiner Umgebung kennenlernen.",
        "gewicht_haeufigkeit": 1.0,
        "gewicht_alarm": 0.0,
    },
    "vogelsprache": {
        "titel": "Vogelsprache",
        "beschreibung": "Alarmrufe lesen lernen — wer warnt, und wovor. "
                        "Auslöser kommen mit, auch wenn sie selten sind.",
        "gewicht_haeufigkeit": 0.35,
        "gewicht_alarm": 1.0,
    },
    "gemischt": {
        "titel": "Gemischt",
        "beschreibung": "Häufige Arten, Alarm-Leitarten etwas bevorzugt.",
        "gewicht_haeufigkeit": 0.7,
        "gewicht_alarm": 0.5,
    },
}


def hole(url, params, versuche=4, timeout=60):
    warte = 2
    for versuch in range(versuche):
        try:
            r = requests.get(url, params=params, headers=UA, timeout=timeout)
            if r.status_code == 429:
                time.sleep(warte); warte *= 2; continue
            r.raise_for_status()
            return r.json()
        except requests.RequestException as e:
            if versuch == versuche - 1:
                print(f"    Abruf fehlgeschlagen: {e}")
                return None
            time.sleep(warte); warte *= 2
    return None


def umkreis_polygon(lat, lon, km):
    """Grobes Rechteck um einen Punkt. Fuer die Rangfolge genau genug."""
    d_lat = km / 111.0
    d_lon = km / (111.0 * max(0.2, abs(__import__("math").cos(
        __import__("math").radians(lat)))))
    return (f"POLYGON(({lon-d_lon} {lat-d_lat},{lon+d_lon} {lat-d_lat},"
            f"{lon+d_lon} {lat+d_lat},{lon-d_lon} {lat+d_lat},"
            f"{lon-d_lon} {lat-d_lat}))")


def haeufigkeiten(filter_, jahre="2020,2026", wieviele=60):
    """Beobachtungszahlen je Art, absteigend."""
    p = {"taxonKey": VOEGEL_TAXON, "year": jahre, "limit": 0,
         "facet": "speciesKey", "facetLimit": wieviele, **filter_}
    d = hole(GBIF, p)
    if not d:
        return [], 0
    raus = []
    for f in d.get("facets", []):
        for c in f.get("counts", []):
            art = hole(f"https://api.gbif.org/v1/species/{c['name']}", {})
            if art and art.get("canonicalName"):
                raus.append((art["canonicalName"], c["count"]))
            time.sleep(0.05)
    return raus, d.get("count", 0)


def eigene_arten():
    """Was wir an Daten haben -- inklusive abgeleitetem Alarmnutzen."""
    arten, ausloeser = {}, {}
    for pfad in SPECIES_DIR.glob("*.json"):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        arten[d["name_wissenschaftlich"]] = d
    # Wer taucht in den Fressfeind-Listen der anderen auf?
    for d in arten.values():
        for f in d.get("fressfeinde", []):
            ausloeser[f["deutsch"]] = ausloeser.get(f["deutsch"], 0) + 1
    for d in arten.values():
        d["_ausloeser_bei"] = ausloeser.get(d["name_de"], 0)
    return arten


# Aus daten/vogelsprache.ts gespiegelt, damit das Skript ohne TypeScript
# auskommt. Bei Aenderungen dort mitziehen.
#   (Leitart, Auffaelligkeit 1-5)
ALARMPROFILE = {
    "Turdus merula": (True, 5),
    "Erithacus rubecula": (True, 4),
    "Cyanistes caeruleus": (True, 4),
    "Pica pica": (True, 5),
    "Passer domesticus": (True, 4),
    "Corvus corone": (True, 5),
    "Corvus corax": (False, 4),
    "Columba palumbus": (False, 3),      # mechanisch, Fluegelklatschen
    "Garrulus glandarius": (False, 5),
}


def alarmnutzen(wissenschaftlich, daten):
    """0 bis 1 aus drei Anteilen.

    Erster Entwurf schaute nur auf "Leitart" und "Ausloeser" -- dabei fielen
    Arten mit dokumentiertem Alarm durchs Raster, die keines von beidem sind.
    Die Ringeltaube bekam 0,00, obwohl ihr Fluegelklatschen ein belegtes
    Alarmsignal ist. Deshalb geht jetzt auch die Auffaelligkeit ein.
    """
    leitart, auffaelligkeit = ALARMPROFILE.get(wissenschaftlich, (False, 0))
    punkte = 0.0
    if leitart:
        punkte += 0.4
    # Auffaelligkeit 1-5 -> bis 0,35 Punkte
    punkte += (auffaelligkeit / 5) * 0.35
    if daten:
        # bei bis zu 10 Arten Ausloeser -> bis 0,25 Punkte
        punkte += min(daten.get("_ausloeser_bei", 0) / 10, 1.0) * 0.25
    return min(punkte, 1.0)


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--lat", type=float)
    a.add_argument("--lon", type=float)
    a.add_argument("--umkreis", type=float, default=30)
    a.add_argument("--land", help="Laendercode wie DE, statt Koordinaten")
    a.add_argument("--ziel", default="gemischt", choices=list(LERNZIELE))
    a.add_argument("--name", help="Name der Region für die Ausgabedatei")
    a.add_argument("--anzahl", type=int, default=25)
    args = a.parse_args()

    if args.lat is not None and args.lon is not None:
        filter_ = {"geometry": umkreis_polygon(args.lat, args.lon, args.umkreis)}
        bezeichnung = args.name or f"{args.lat:.2f},{args.lon:.2f} ({args.umkreis:.0f} km)"
    elif args.land:
        filter_ = {"country": args.land}
        bezeichnung = args.name or args.land
    else:
        print("Entweder --lat/--lon oder --land angeben.")
        sys.exit(1)

    ziel = LERNZIELE[args.ziel]
    print(f"Region: {bezeichnung}   Lernziel: {ziel['titel']}\n")

    liste, gesamt = haeufigkeiten(filter_)
    if not liste:
        print("Keine Daten von GBIF erhalten."); sys.exit(1)
    print(f"{gesamt:,} Beobachtungen, {len(liste)} Arten in der Auswertung\n")

    arten = eigene_arten()
    hoechste = liste[0][1] if liste else 1

    bewertet = []
    for wissenschaftlich, anzahl in liste:
        d = arten.get(wissenschaftlich)
        h = anzahl / hoechste                       # 0..1, gemessen
        al = alarmnutzen(wissenschaftlich, d)       # 0..1, teils geschaetzt
        punkte = (h * ziel["gewicht_haeufigkeit"]
                  + al * ziel["gewicht_alarm"])
        bewertet.append({
            "wissenschaftlich": wissenschaftlich,
            "name_de": d["name_de"] if d else None,
            "beobachtungen": anzahl,
            "haeufigkeit": round(h, 3),
            "alarmnutzen": round(al, 3),
            "punkte": round(punkte, 3),
            "haben_wir": bool(d),
        })
    bewertet.sort(key=lambda x: -x["punkte"])

    print(f"{'#':>3} {'Art':28s} {'Beob.':>8s} {'Häuf':>5s} {'Alarm':>6s} "
          f"{'Punkte':>6s}  Daten")
    print("-" * 74)
    for i, e in enumerate(bewertet[:args.anzahl], 1):
        name = e["name_de"] or e["wissenschaftlich"]
        marke = "ja" if e["haben_wir"] else "FEHLT"
        print(f"{i:3d} {name[:28]:28s} {e['beobachtungen']:8,} "
              f"{e['haeufigkeit']:5.2f} {e['alarmnutzen']:6.2f} "
              f"{e['punkte']:6.2f}  {marke}")

    fehlen = [e for e in bewertet[:args.anzahl] if not e["haben_wir"]]
    if fehlen:
        print(f"\n{len(fehlen)} Arten ohne Daten -- waeren zu ergaenzen:")
        for e in fehlen:
            print(f"  {e['wissenschaftlich']:30s} {e['beobachtungen']:8,} Beob.")

    ZIEL_DIR.mkdir(parents=True, exist_ok=True)
    dateiname = (args.name or args.land or f"{args.lat}_{args.lon}")
    dateiname = "".join(c if c.isalnum() or c in "-_" else "_"
                        for c in str(dateiname))
    ziel_datei = ZIEL_DIR / f"{dateiname}_{args.ziel}.json"
    ziel_datei.write_text(json.dumps({
        "region": bezeichnung,
        "lernziel": args.ziel,
        "lernziel_titel": ziel["titel"],
        "beobachtungen_gesamt": gesamt,
        "hinweis": "haeufigkeit ist gemessen (GBIF), alarmnutzen teils "
                   "geschaetzt (siehe daten/vogelsprache.ts)",
        "arten": bewertet[:args.anzahl],
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n-> {ziel_datei}")


if __name__ == "__main__":
    main()
