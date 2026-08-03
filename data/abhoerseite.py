"""Abhoerseite mit Beschreibung -- was man an jeder Stelle hoeren sollte.

WARUM ES DIESE ZWEITE FASSUNG GIBT: In matthias_urteile.json steht als
Vorbehalt zur ersten Runde: "Matthias merkt an, dass ihm die Referenz fuer
Grundkategorien fehlte. Urteile entsprechend mit Vorsicht." Er sollte
Ruftypen benennen, ohne je gehoert zu haben, wie die Kategorien klingen
sollen. Das ist wie Farben sortieren ohne Farbmuster.

Diese Seite hat deshalb zwei Dinge, die der ersten fehlten:

  1. ANKER ganz oben. Die belegten Referenzrufe je Ruftyp, zum Anhoeren,
     mit ihrer Beschreibung. Erst zuhoeren, dann urteilen.
  2. Zu JEDEM Schnipsel eine Beschreibung dessen, was die Messung dort
     findet.

WICHTIG ZUR FORM DIESER BESCHREIBUNG: Sie benennt nur den KLANGCHARAKTER
-- Tonhoehe, Ton oder Rauschen, Rhythmus, Anschlag -- und NICHT den
vermuteten Ruftyp. Sonst laege die Antwort in der Frage, und wir wuerden
statt Matthias' Gehoer nur unsere eigene Vermutung zurueckbekommen. Die
Maschinenvermutung steht in einem zugeklappten Feld, ausdruecklich erst
NACH dem eigenen Urteil zu oeffnen.

Aufruf:
  C:/Python314/python.exe abhoerseite.py [anzahl_gruppen]
"""
import html
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from scipy.cluster.vq import kmeans2, whiten

BASIS = Path(__file__).resolve().parent
REF_ART = BASIS / "referenz" / "Amsel"
AUS_DIR = BASIS / "abhoeren" / "Amsel"
SEITE = BASIS / "abhoeren_Amsel.html"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

spec = importlib.util.spec_from_file_location("lb", BASIS / "labelseite_bauen.py")
lb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lb)

PRO_GRUPPE = 3
POLSTER_MS = 250
FELDER = ["spitze_hz", "bandbreite_hz", "flachheit", "modulation",
          "kantigkeit", "rate_hz"]

# Wie die Ruftypen klingen SOLLEN. Aus labelseite_bauen uebernommen, damit
# es eine einzige Beschreibung gibt und nicht zwei, die auseinanderlaufen.
RUFTYPEN = lb.RUFTYPEN


# --- Beschreibung aus den Messwerten ------------------------------------
# Bewusst in Alltagssprache. "4289 Hz, Flachheit 0.09" sagt beim Hoeren
# nichts; "hoch, fast reiner Ton" schon.

# Die Schwellen sind an der TATSAECHLICHEN Verteilung unserer 131 Phrasen
# geeicht (Drittelgrenzen), nicht aus dem Bauch gegriffen. Erster Versuch
# hatte Lehrbuchwerte -- Ergebnis: fast jede Phrase wurde als "rau und
# breitbandig" beschrieben, weil unsere Flachheiten zwischen 0,01 und 0,10
# liegen und nicht zwischen 0 und 1. Eine Beschreibung, die fuer alles
# dasselbe sagt, hilft beim Sortieren nicht.
GRENZEN = {
    "spitze_hz": (2400, 3500, 4300),
    "bandbreite_hz": (1600, 2130, 2520),
    "flachheit": (0.04, 0.06, 0.10),
    "kantigkeit": (0.24, 0.33, 0.48),
    "rate_hz": (2.0, 3.3, 4.0),
}


def stufe(wert, feld):
    """0 bis 3 -- in welchem Viertel der Verteilung liegt der Wert?"""
    a, b, c = GRENZEN[feld]
    return 0 if wert < a else 1 if wert < b else 2 if wert < c else 3


def tonhoehe(hz):
    return ["tief", "mitteltief", "hoch", "sehr hoch"][stufe(hz, "spitze_hz")]


def klangfarbe(flachheit):
    # Wiener-Entropie: klein = reiner Ton, gross = Rauschen
    return [
        "sehr klar, fast ein gepfiffener Ton",
        "klar und tonal",
        "tonal, aber mit rauem Beiklang",
        "rau und kratzig, mehr Geräusch als Ton",
    ][stufe(flachheit, "flachheit")]


def breite(hz):
    return [
        "schmal — die Energie sitzt eng um eine Tonhöhe",
        "eher schmal",
        "eher breit",
        "breit gestreut über viele Tonhöhen",
    ][stufe(hz, "bandbreite_hz")]


def rhythmus(rate):
    wort = ["Einzeln stehend oder sehr langsam", "Gemächliche Folge",
            "Zügige Folge", "Schnelle, dichte Folge"][stufe(rate, "rate_hz")]
    return f"{wort}, etwa {rate:.0f} je Sekunde" if rate >= 2 else wort


def anschlag(kantigkeit):
    return [
        "weich ein- und ausklingend",
        "eher weich angesetzt",
        "deutlich angeschlagen",
        "hart angeschlagen, abgehackt",
    ][stufe(kantigkeit, "kantigkeit")]


def beschreiben(e):
    """Ein Satz, der beschreibt WAS zu hoeren ist -- nicht WELCHER Typ."""
    return (f"{tonhoehe(e['spitze_hz']).capitalize()} (etwa "
            f"{e['spitze_hz']/1000:.1f} kHz), {klangfarbe(e['flachheit'])}. "
            f"Bandbreite {breite(e['bandbreite_hz'])}. "
            f"{rhythmus(e['rate_hz'])}, "
            f"{anschlag(e['kantigkeit'])}. "
            f"Dauer {e['dauer_s']:.1f} s.")


def worauf_achten(e):
    """Ein Hinweis, was die Entscheidung an DIESER Stelle schwer macht."""
    hinweise = []
    if e["bandbreite_hz"] > 5000:
        hinweise.append("Sehr breitbandig — das ist erfahrungsgemäß fast "
                        "immer Störgeräusch und kein Ruf.")
    if e["spitze_hz"] > 5500 and e["flachheit"] < 0.12:
        hinweise.append("Hoch und rein zugleich — falls es dünn und schwer "
                        "zu orten wirkt, ist das die Bauform, die vor "
                        "Greifvögeln warnt.")
    if e["rate_hz"] > 8:
        hinweise.append("Sehr dichte Folge — hier ist die Frage, ob es sich "
                        "steigert oder gleichmäßig bleibt.")
    if e.get("luecke", 9) < 0.4:
        hinweise.append("Die Messung liegt zwischen zwei Vorlagen fast "
                        "gleich weit entfernt — hier hilft nur das Ohr.")
    return hinweise


# --- Seite ---------------------------------------------------------------

def kopf_html(gesamt, anzahl_gruppen, anker):
    t = [f"""<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Amsel — abhören</title><style>
body{{font-family:system-ui,sans-serif;margin:0;background:#1a1a1a;
color:#e8e8e8;line-height:1.55}}
.kopf{{padding:22px 28px;background:#111;border-bottom:1px solid #333}}
h1{{margin:0 0 6px;font-size:20px}}
h2{{font-size:16px;color:#d4a373;margin:30px 0 4px}}
.hinweis{{color:#aaa;font-size:14px;max-width:80ch}}
.inhalt{{padding:20px 28px 60px}}
.anker{{background:#212121;border-radius:9px;padding:13px;margin-bottom:9px;
border-left:3px solid #6e8b7a}}
.ankerTitel{{font-weight:700;font-size:15px}}
.ankerText{{color:#aaa;font-size:13.5px;margin:3px 0 8px}}
.karte{{background:#212121;border-radius:9px;padding:15px;margin-bottom:14px;
border-left:3px solid #444}}
.beschreibung{{background:#1b2b25;border-radius:7px;padding:11px;margin:9px 0;
font-size:14px;color:#cfe3d8}}
.marke{{color:#6e8b7a;font-size:11px;font-weight:700;letter-spacing:.5px}}
.achtung{{color:#e0a458;font-size:13px;margin-top:6px}}
.zahlen{{color:#777;font-size:11.5px;margin-top:8px;font-family:monospace}}
audio{{width:100%;max-width:460px;margin:5px 0;height:34px}}
details{{margin-top:9px}}
summary{{color:#8a8a8a;font-size:12.5px;cursor:pointer}}
.wahl{{margin-top:10px}}
.wahl button{{background:#2a2a2a;color:#ddd;border:1px solid #444;
border-radius:6px;padding:6px 11px;margin:3px 4px 3px 0;cursor:pointer;
font-size:13px}}
.wahl button:hover{{background:#3a3a3a}}
.wahl button.an{{background:#0e639c;border-color:#0e639c;color:#fff}}
textarea{{width:100%;height:150px;background:#111;color:#9fd6bc;
border:1px solid #333;border-radius:6px;font-family:monospace;font-size:12px;
padding:9px}}
</style></head><body>
<div class="kopf"><h1>Amsel — abhören</h1>
<div class="hinweis">
{gesamt} unsichere Phrasen, zu {anzahl_gruppen} Gruppen zusammengefasst;
je Gruppe die typischsten Vertreter. Wer die entscheidet, entscheidet die
ähnlichen mit.<br><br>
<b>Neu gegenüber der ersten Runde:</b> Zu jedem Schnipsel steht, was die
Messung dort findet — Tonhöhe, Klang, Rhythmus. Absichtlich <i>ohne</i>
Ruftyp-Vermutung, damit die Antwort nicht in der Frage steckt. Die
Maschinenvermutung ist zugeklappt und gehört erst <i>nach</i> deinem Urteil
geöffnet.<br><br>
Wenn Beschreibung und Gehörtes auseinandergehen: <b>das ist die
wertvollste Rückmeldung überhaupt</b> — dann stimmt die Messung nicht.
</div></div>
<div class="inhalt">
<h2>Erst hier hineinhören — so klingen die Kategorien</h2>
<div class="hinweis" style="margin-bottom:12px">Belegte Referenzrufe.
In der ersten Runde fehlten sie, und du hast zu Recht angemerkt, dass dir
damit die Grundlage fehlte.</div>"""]

    for schluessel, titel, beschreibung in RUFTYPEN:
        dateien = anker.get(schluessel) or []
        if not dateien:
            continue
        t.append(f'<div class="anker"><div class="ankerTitel">{titel}</div>'
                 f'<div class="ankerText">{html.escape(beschreibung)}</div>')
        for w in dateien:
            t.append(f'<audio controls preload="none" src="Amsel/{w}"></audio>')
        t.append("</div>")
    return t


def baue(gruppen, gesamt, anker):
    t = kopf_html(gesamt, len(gruppen), anker)
    t.append("<h2>Zu beurteilen</h2>")

    knoepfe = [(s, ti) for s, ti, _ in RUFTYPEN]
    nr = 0
    for g in gruppen:
        for e in g["vertreter"]:
            nr += 1
            t.append(f'<div class="karte"><b>#{nr}</b> '
                     f'<span style="color:#777;font-size:12.5px">'
                     f'Gruppe {g["nr"]} — steht für {g["anzahl"]} ähnliche '
                     f'Phrasen · xeno-canto nennt das '
                     f'„{html.escape(e["xc_typ"] or "?")}“</span>')
            t.append(f'<audio controls preload="none" '
                     f'src="Amsel/{e["wav"]}"></audio>')
            t.append(f'<div class="beschreibung">'
                     f'<div class="marke">WAS DIE MESSUNG DORT FINDET</div>'
                     f'{beschreiben(e)}</div>')
            for h in worauf_achten(e):
                t.append(f'<div class="achtung">{h}</div>')

            t.append('<div class="wahl" data-datei="' + e["wav"] + '">')
            for s, ti in knoepfe:
                t.append(f'<button onclick="waehle(this)" data-typ="{s}">'
                         f'{html.escape(ti.split(" — ")[0])}</button>')
            t.append("</div>")

            t.append('<details><summary>Maschinenvermutung — erst nach '
                     'deinem Urteil öffnen</summary>'
                     f'<div class="zahlen">nächste Vorlage in {e["abstand"]:.2f} '
                     f'Einheiten Abstand, Vorsprung vor der zweitnächsten '
                     f'{e.get("luecke", 0):.2f}. '
                     f'spitze={e["spitze_hz"]:.0f} Hz · '
                     f'bandbreite={e["bandbreite_hz"]:.0f} Hz · '
                     f'flachheit={e["flachheit"]:.3f} · '
                     f'kantigkeit={e["kantigkeit"]:.3f} · '
                     f'rate={e["rate_hz"]:.1f}/s</div></details>')
            t.append("</div>")

    t.append("""<h2>Ergebnis</h2>
<div class="hinweis">Kopieren und mir schicken.</div>
<textarea id="raus"></textarea>
<div class="wahl"><button onclick="navigator.clipboard.writeText(
document.getElementById('raus').value)">kopieren</button></div>
<script>
const urteile={};
function waehle(b){
  const box=b.parentElement;
  box.querySelectorAll('button').forEach(x=>x.classList.remove('an'));
  b.classList.add('an');
  urteile[box.dataset.datei]=b.dataset.typ;
  document.getElementById('raus').value=JSON.stringify(urteile,null,1);
}
</script></div></body></html>""")
    SEITE.write_text("".join(t), encoding="utf-8")


def main():
    anzahl = int(sys.argv[1]) if len(sys.argv) > 1 else 7
    quelle = BASIS / "phrasen_zugeordnet.json"
    daten = json.loads(quelle.read_text(encoding="utf-8"))
    unsicher = daten["unsicher"]
    vorlagen_aus = daten["vorlagen_aus"]

    AUS_DIR.mkdir(parents=True, exist_ok=True)
    for alt in AUS_DIR.glob("*.wav"):
        alt.unlink()

    geladen = {}
    def hole(name):
        if name not in geladen:
            treffer = list(REF_ART.glob(Path(name).stem + ".*"))
            geladen[name] = lb.lade_mono(treffer[0])[2] if treffer else None
        return geladen[name]

    def schneide(datei, start_s, dauer_s, name):
        seg = hole(datei)
        if seg is None:
            return None
        a = max(0, start_s * 1000 - POLSTER_MS)
        b = min(len(seg), (start_s + dauer_s) * 1000 + POLSTER_MS)
        seg[a:b].export(AUS_DIR / name, format="wav")
        return name

    # 1. Anker: die belegten Referenzrufe je Typ.
    #
    # Die liegen bereits fertig geschnitten in referenzrufe/Amsel/ und
    # heissen genau wie die Belegschluessel ("XC815414_t0.wav"). Der erste
    # Versuch hat sie in referenz/Amsel/ gesucht und nur 2 von 9 gefunden --
    # weshalb die Seite fast ohne Anker herauskam, also mit genau dem
    # Mangel, den sie beheben soll.
    #
    # Wo es eine _umfeld-Fassung gibt, kommt sie dazu: der Ruf im
    # Zusammenhang ist zum Einhoeren oft nuetzlicher als der nackte
    # Schnipsel.
    REFRUFE = BASIS / "referenzrufe" / "Amsel"
    # Zwei alte Namen auf die heutigen Kategorien abbilden. "bodenalarm"
    # wurde mit "tixen" verschmolzen (die Literatur kennt nur eine
    # Kategorie mit fliessendem Uebergang), "ssiih" heisst jetzt "siih".
    UMBENANNT = {"bodenalarm": "tixen", "ssiih": "siih"}
    anker, fehlend = {}, []
    for beleg, typ in vorlagen_aus.items():
        ziel_typ = UMBENANNT.get(typ, typ)
        quelle_wav = REFRUFE / f"{beleg}.wav"
        if not quelle_wav.exists():
            fehlend.append(beleg)
            continue
        for zusatz, marke in (("", ""), ("_umfeld", "_umfeld")):
            q = REFRUFE / f"{beleg}{zusatz}.wav"
            if not q.exists():
                continue
            name = f"anker_{ziel_typ}_{beleg}{marke}.wav"
            (AUS_DIR / name).write_bytes(q.read_bytes())
            anker.setdefault(ziel_typ, []).append(name)
    if fehlend:
        print("Ohne Audio: " + ", ".join(fehlend))

    # 2. Unsichere gruppieren
    X = whiten(np.array([[e[f] for f in FELDER] for e in unsicher]))
    _, zuordnung = kmeans2(X, anzahl, minit="++", seed=7)
    for e, g in zip(unsicher, zuordnung):
        e["gruppe"] = int(g)

    gruppen = []
    for g in range(anzahl):
        drin = [e for e in unsicher if e["gruppe"] == g]
        if not drin:
            continue
        mitte = np.array([[e[f] for f in FELDER] for e in drin]).mean(axis=0)
        drin.sort(key=lambda e: np.linalg.norm(
            np.array([e[f] for f in FELDER]) - mitte))
        vertreter = []
        for e in drin[:PRO_GRUPPE]:
            name = f"{Path(e['datei']).stem}_{int(e['start_s']*1000)}.wav"
            if schneide(e["datei"], e["start_s"], e["dauer_s"], name):
                vertreter.append({**e, "wav": name})
        if vertreter:
            gruppen.append({"nr": g, "anzahl": len(drin),
                            "vertreter": vertreter,
                            "abstand": float(np.mean(
                                [e["abstand"] for e in drin]))})

    gruppen.sort(key=lambda g: -g["abstand"])
    baue(gruppen, len(unsicher), anker)

    print(f"{len(unsicher)} unsichere Phrasen -> {len(gruppen)} Gruppen")
    print(f"{sum(len(g['vertreter']) for g in gruppen)} Schnipsel zu beurteilen")
    print(f"Ankerbeispiele: " + ", ".join(
        f"{k} ({len(v)})" for k, v in sorted(anker.items())))
    print(f"\nSeite: {SEITE}")


if __name__ == "__main__":
    main()
