"""Ergaenzt die Artdaten um Lebensraum, Nahrung und Zugverhalten.

Zwei offene Datensaetze:

  AVONET       Tobias et al. 2022, alle 11.009 Vogelarten. Liefert Habitat,
               Zugverhalten, trophische Ebene und Nische, Lebensweise,
               dazu Groesse und Gewicht.
               https://doi.org/10.6084/m9.figshare.16586228

  EltonTraits  Wilman et al. 2014, Nahrung in Prozent (Wirbellose, Samen,
               Fruechte, ...) und Nahrungsschicht (Boden, Unterholz,
               Kronendach, Luft).
               https://esapubs.org/archive/ecol/E095/178/

Beide sind zur freien Nutzung freigegeben. Verknuepft wird ueber den
wissenschaftlichen Namen; wo die Taxonomie abweicht, greift eine kleine
Ersatztabelle.

Aufruf:
  C:/Python314/python.exe traits_holen.py <avonet.xlsx> <BirdFuncDat.txt>
"""
import csv
import json
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent
SPECIES_DIR = BASIS / "species"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Wo die Datensaetze eine andere Taxonomie verwenden als Wikidata/xeno-canto.
ERSATZNAMEN = {
    "Cyanistes caeruleus": ["Parus caeruleus"],
    "Poecile palustris": ["Parus palustris"],
    "Corvus corone": ["Corvus corone", "Corvus cornix"],
    "Troglodytes troglodytes": ["Troglodytes troglodytes"],
}

# Uebersetzungen -- die Datensaetze sind englisch, die App ist deutsch.
HABITAT_DE = {
    "Forest": "Wald", "Woodland": "lichter Wald", "Shrubland": "Gebüsch",
    "Grassland": "Grasland", "Human Modified": "Siedlungsraum",
    "Wetland": "Feuchtgebiet", "Riverine": "Flussufer", "Rock": "Felsen",
    "Coastal": "Küste", "Marine": "Meer", "Desert": "Wüste",
    "Tundra": "Tundra", "Mountain": "Gebirge",
}
MIGRATION_DE = {1: "Standvogel", 2: "Teilzieher", 3: "Zugvogel"}
TROPHIC_DE = {
    "Herbivore": "Pflanzenfresser", "Omnivore": "Allesfresser",
    "Carnivore": "Fleischfresser", "Scavenger": "Aasfresser",
    "Invertivore": "Insektenfresser", "Granivore": "Körnerfresser",
    "Frugivore": "Fruchtfresser", "Nectarivore": "Nektarfresser",
    "Aquatic predator": "Wasserjäger", "Vertivore": "Wirbeltierjäger",
    "Herbivore terrestrial": "Pflanzenfresser (Boden)",
    "Herbivore aquatic": "Pflanzenfresser (Wasser)",
}
LIFESTYLE_DE = {
    "Insessorial": "sitzend/ansitzend", "Terrestrial": "bodenlebend",
    "Aerial": "in der Luft jagend", "Aquatic": "wassergebunden",
    "Generalist": "vielseitig",
}
NAHRUNG_DE = {
    "Diet-Inv": "Wirbellose", "Diet-Vend": "Wirbeltiere",
    "Diet-Vect": "Aas/Wirbeltiere", "Diet-Vfish": "Fisch",
    "Diet-Vunk": "Wirbeltiere (unbestimmt)", "Diet-Scav": "Aas",
    "Diet-Fruit": "Früchte", "Diet-Nect": "Nektar",
    "Diet-Seed": "Samen", "Diet-PlantO": "sonstige Pflanzenteile",
}
SCHICHT_DE = {
    "ForStrat-ground": "Boden", "ForStrat-understory": "Unterholz",
    "ForStrat-midhigh": "mittlere Höhe", "ForStrat-canopy": "Kronendach",
    "ForStrat-aerial": "Luft",
    "ForStrat-watbelowsurf": "unter Wasser",
    "ForStrat-wataroundsurf": "Wasseroberfläche",
}


def namen_fuer(wissenschaftlich):
    return ERSATZNAMEN.get(wissenschaftlich, []) + [wissenschaftlich]


def avonet_lesen(pfad):
    import openpyxl
    wb = openpyxl.load_workbook(pfad, read_only=True)
    ws = wb["AVONET1_BirdLife"]
    zeilen = ws.iter_rows(values_only=True)
    kopf = list(next(zeilen))
    idx = {k: i for i, k in enumerate(kopf)}
    daten = {}
    for z in zeilen:
        if not z or not z[idx["Species1"]]:
            continue
        daten[str(z[idx["Species1"]]).strip()] = {
            "habitat": z[idx["Habitat"]],
            "habitat_dichte": z[idx["Habitat.Density"]],
            "zugverhalten": z[idx["Migration"]],
            "trophische_ebene": z[idx["Trophic.Level"]],
            "nahrungsnische": z[idx["Trophic.Niche"]],
            "lebensweise": z[idx["Primary.Lifestyle"]],
            "masse_g": z[idx["Mass"]],
            "fluegellaenge_mm": z[idx["Wing.Length"]],
        }
    return daten


def elton_lesen(pfad):
    daten = {}
    with open(pfad, encoding="latin-1", newline="") as f:
        for zeile in csv.DictReader(f, delimiter="\t"):
            name = (zeile.get("Scientific") or "").strip()
            if name:
                daten[name] = zeile
    return daten


def anteile(zeile, schluessel_map, mindest=10):
    """Nur nennenswerte Anteile, absteigend."""
    raus = []
    for k, bez in schluessel_map.items():
        try:
            wert = float(zeile.get(k) or 0)
        except ValueError:
            continue
        if wert >= mindest:
            raus.append({"was": bez, "prozent": int(wert)})
    return sorted(raus, key=lambda d: -d["prozent"])


def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    avonet = avonet_lesen(sys.argv[1])
    elton = elton_lesen(sys.argv[2])
    print(f"AVONET {len(avonet)} Arten, EltonTraits {len(elton)} Arten\n")

    fehlend = []
    for pfad in sorted(SPECIES_DIR.glob("*.json")):
        d = json.loads(pfad.read_text(encoding="utf-8"))
        wiss = d["name_wissenschaftlich"]

        a = next((avonet[n] for n in namen_fuer(wiss) if n in avonet), None)
        e = next((elton[n] for n in namen_fuer(wiss) if n in elton), None)
        if not a and not e:
            fehlend.append(d["name_de"]); print(f"  {d['name_de']:17s} KEIN TREFFER"); continue

        merkmale = {}
        if a:
            merkmale.update({
                "lebensraum": HABITAT_DE.get(a["habitat"], a["habitat"]),
                "zugverhalten": MIGRATION_DE.get(int(a["zugverhalten"] or 0),
                                                 str(a["zugverhalten"])),
                "ernaehrungstyp": TROPHIC_DE.get(a["trophische_ebene"],
                                                 a["trophische_ebene"]),
                "nahrungsnische": TROPHIC_DE.get(a["nahrungsnische"],
                                                 a["nahrungsnische"]),
                "lebensweise": LIFESTYLE_DE.get(a["lebensweise"], a["lebensweise"]),
                "masse_g": round(float(a["masse_g"]), 1) if a["masse_g"] else None,
                "fluegellaenge_mm": round(float(a["fluegellaenge_mm"]), 1)
                if a["fluegellaenge_mm"] else None,
                "quelle_avonet": "AVONET (Tobias et al. 2022)",
            })
        if e:
            merkmale["nahrung"] = anteile(e, NAHRUNG_DE)
            merkmale["nahrungsschicht"] = anteile(e, SCHICHT_DE)
            merkmale["quelle_elton"] = "EltonTraits 1.0 (Wilman et al. 2014)"

        d["merkmale"] = merkmale
        pfad.write_text(json.dumps(d, ensure_ascii=False, indent=2),
                        encoding="utf-8")

        nahrung = ", ".join(f"{x['was']} {x['prozent']}%"
                            for x in merkmale.get("nahrung", [])[:3])
        print(f"  {d['name_de']:17s} {merkmale.get('lebensraum','?'):16s} "
              f"{merkmale.get('zugverhalten','?'):13s} {nahrung}")

    print(f"\n{20 - len(fehlend)} von 20 Arten ergänzt")
    if fehlend:
        print("OHNE MERKMALE: " + ", ".join(fehlend))


if __name__ == "__main__":
    main()
