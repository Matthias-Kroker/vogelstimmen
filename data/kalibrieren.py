"""Ordnet Phrasen automatisch einem Ruftyp zu -- ausgehend von den belegten Rufen.

Grundlage sind die acht Referenzrufe, deren Identitaet feststeht: entweder
hat der Aufnehmende sie benannt (\"a thin, high and descending tone, seee\")
oder den Ausloeser dazugeschrieben (\"due to my cat's presence\"), und
Matthias hat sie abgehoert und bestaetigt.

Daraus werden Vorlagen (Mittelpunkte im Merkmalsraum) gebildet. Jede Phrase
aus den Referenzaufnahmen bekommt dann den Typ der naechstgelegenen Vorlage --
zusammen mit einem Abstand als Mass fuer die Sicherheit.

Selbstpruefung: Phrasen aus rein als \"song\" gekennzeichneten Aufnahmen
MUESSEN ueberwiegend als Gesang herauskommen. Tun sie das nicht, taugen
die Merkmale nicht und man darf dem Rest auch nicht glauben.

Aufruf:
  C:/Python314/python.exe kalibrieren.py
"""
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np

BASIS = Path(__file__).resolve().parent
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

spec = importlib.util.spec_from_file_location("lb", BASIS / "labelseite_bauen.py")
lb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lb)

# Von Matthias abgehoert und bestaetigt (2026-07-29). Das ist die Wahrheit,
# auf der alles Weitere steht -- entsprechend klein und handverlesen.
BELEGT = {
    "XC815414_t0": "ssiih", "XC815414_t1": "ssiih", "XC815414_t2": "ssiih",
    "XC894642_ganz": "tixen",
    "XC1161236_ganz": "zetern", "XC688992_ganz": "zetern",
    "XC544297_ganz": "bodenalarm", "XC424175_ganz": "bodenalarm",
    "XC1050351_ganz": "gesang",
}

MERKMALE = ["spitze_hz", "bandbreite_hz", "flachheit",
            "modulation", "kantigkeit", "rate_hz"]

# Ab diesem Abstand (in normierten Einheiten) gilt die Zuordnung als unsicher
# und wandert zum Abhoeren, statt stillschweigend uebernommen zu werden.
GRENZE_UNSICHER = 1.6


def phrasen_messen(pfad):
    """Alle Phrasen einer Datei mit ihren Kennwerten."""
    signal, sr, seg = lb.lade_mono(pfad)
    if signal is None:
        return []
    ergebnis = []
    for start, ende, gruppe in lb.phrasen_bilden(
            lb.silben_finden(signal, sr), sr, len(signal)):
        einzeln = [lb.merkmale(signal[a:b], sr) for a, b in gruppe]
        einzeln = [m for m in einzeln if m and m["dauer_ms"] >= 25]
        if not einzeln:
            continue
        phrase_ms = (ende - start) / sr * 1000
        m = {f: float(np.median([e[f] for e in einzeln]))
             for f in ("spitze_hz", "bandbreite_hz", "flachheit",
                       "modulation", "kantigkeit")}
        m["rate_hz"] = len(einzeln) / (phrase_ms / 1000.0) if phrase_ms else 0.0
        m["datei"] = pfad.name
        m["start_s"] = start / sr
        m["dauer_s"] = phrase_ms / 1000.0
        ergebnis.append(m)
    return ergebnis


def vektor(m):
    return np.array([m[f] for f in MERKMALE], dtype=float)


def main():
    ref_rufe = BASIS / "referenzrufe" / "Amsel"
    ref_art = BASIS / "referenz" / "Amsel"
    if not ref_rufe.exists() or not ref_art.exists():
        print("Referenzen fehlen -- erst referenzrufe_bauen.py und "
              "referenz_holen.py laufen lassen.")
        sys.exit(1)

    # ---- 1. Vorlagen aus den belegten Rufen ----
    print("Vorlagen aus belegten Rufen:\n")
    nach_typ = {}
    for stem, typ in BELEGT.items():
        treffer = list(ref_rufe.glob(stem + ".wav"))
        if not treffer:
            print(f"  FEHLT: {stem}")
            continue
        for m in phrasen_messen(treffer[0]):
            nach_typ.setdefault(typ, []).append(m)

    if len(nach_typ) < 3:
        print("Zu wenige Vorlagen."); sys.exit(1)

    # ---- 1b. Zielphrasen einlesen, BEVOR normiert wird ----
    #
    # Wichtig: die Normierung muss ueber Vorlagen UND Zielphrasen zusammen
    # laufen. Erster Versuch normierte nur ueber die 39 Vorlagenphrasen --
    # deren Streuung ist eng, also landeten die 131 fremden Phrasen alle
    # weit ausserhalb und 97 % galten als "unsicher". Das war kein Problem
    # der Merkmale, sondern ein Massstabsfehler.
    verzeichnis = {}
    vpfad = BASIS / "referenz" / "verzeichnis.json"
    if vpfad.exists():
        for e in json.loads(vpfad.read_text(encoding="utf-8")):
            verzeichnis[e["datei"]] = e

    ziele = []
    for pfad in sorted(ref_art.iterdir()):
        if pfad.suffix.lower() not in (".mp3", ".wav", ".flac"):
            continue
        xc_typ = verzeichnis.get(pfad.name, {}).get("xc_typ", "?")
        for m in phrasen_messen(pfad):
            m["xc_typ"] = xc_typ
            ziele.append(m)

    alle = [m for liste in nach_typ.values() for m in liste] + ziele
    matrix = np.array([vektor(m) for m in alle])
    mittel, streuung = matrix.mean(axis=0), matrix.std(axis=0)
    streuung[streuung == 0] = 1.0

    vorlagen = {}
    for typ, liste in sorted(nach_typ.items()):
        norm = np.array([(vektor(m) - mittel) / streuung for m in liste])
        vorlagen[typ] = norm.mean(axis=0)
        roh = np.array([vektor(m) for m in liste]).mean(axis=0)
        print(f"  {typ:11s} {len(liste):2d} Phrasen   "
              f"Spitze {roh[0]/1000:5.2f} kHz  Bandbr {roh[1]/1000:4.2f} kHz  "
              f"Rate {roh[5]:4.1f}/s")

    # ---- 2. Zielphrasen zuordnen ----
    print(f"\nOrdne {len(ziele)} Phrasen zu...\n")

    zuordnung, unsicher = [], []
    for m in ziele:
        v = (vektor(m) - mittel) / streuung
        abstaende = {t: float(np.linalg.norm(v - z)) for t, z in vorlagen.items()}
        beste = min(abstaende, key=abstaende.get)
        sortiert = sorted(abstaende.values())
        # Abstand zum Zweitbesten sagt, wie eindeutig die Sache ist
        luecke = (sortiert[1] - sortiert[0]) if len(sortiert) > 1 else 9.9
        eintrag = {**{k: round(m[k], 3) for k in MERKMALE},
                   "datei": m["datei"], "start_s": round(m["start_s"], 2),
                   "dauer_s": round(m["dauer_s"], 2),
                   "xc_typ": m["xc_typ"], "typ": beste,
                   "abstand": round(abstaende[beste], 2),
                   "luecke": round(luecke, 2)}
        if abstaende[beste] > GRENZE_UNSICHER or luecke < 0.25:
            eintrag["typ"] = None
            unsicher.append(eintrag)
        else:
            zuordnung.append(eintrag)

    gesamt = len(zuordnung) + len(unsicher)
    print(f"{gesamt} Phrasen: {len(zuordnung)} zugeordnet, "
          f"{len(unsicher)} unsicher ({len(unsicher)*100//max(gesamt,1)} %)\n")

    verteilung = {}
    for e in zuordnung:
        verteilung[e["typ"]] = verteilung.get(e["typ"], 0) + 1
    for t, n in sorted(verteilung.items(), key=lambda kv: -kv[1]):
        print(f"  {t:11s} {n:4d}")

    # ---- 3. Selbstpruefung ----
    print("\nSelbstprüfung — Phrasen aus rein als 'song' gekennzeichneten Aufnahmen:")
    aus_song = [e for e in zuordnung if e["xc_typ"] == "song"]
    if aus_song:
        als_gesang = sum(1 for e in aus_song if e["typ"] == "gesang")
        quote = als_gesang * 100 // len(aus_song)
        print(f"  {als_gesang} von {len(aus_song)} als Gesang erkannt ({quote} %)")
        andere = {}
        for e in aus_song:
            if e["typ"] != "gesang":
                andere[e["typ"]] = andere.get(e["typ"], 0) + 1
        if andere:
            print("  abweichend: " + ", ".join(f"{t}×{n}" for t, n in
                                               sorted(andere.items(), key=lambda kv: -kv[1])))
        print(f"  -> {'brauchbar' if quote >= 70 else 'NICHT brauchbar, Merkmale reichen nicht'}")
    else:
        print("  keine song-Aufnahmen zugeordnet")

    ziel = BASIS / "phrasen_zugeordnet.json"
    ziel.write_text(json.dumps(
        {"vorlagen_aus": BELEGT, "zugeordnet": zuordnung, "unsicher": unsicher},
        ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n-> {ziel.name}")


if __name__ == "__main__":
    main()
