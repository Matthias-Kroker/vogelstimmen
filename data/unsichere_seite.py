"""Baut eine verkuerzte Abhoerseite aus den unsicheren Phrasen.

Statt alle 90 vorzulegen: sie werden im Merkmalsraum gruppiert und je Gruppe
nur die typischsten Vertreter gezeigt. Wer die entscheidet, entscheidet
implizit auch ueber die aehnlichen -- ein Dutzend Urteile deckt damit den
groessten Teil ab.

Reihenfolge nach Nutzen: zuerst die Gruppen, die am weitesten von allen
Vorlagen entfernt liegen. Dort steckt das, was die bisherigen fuenf
Ruftypen nicht abdecken -- moeglicherweise ein eigener Typ.

Aufruf:
  C:/Python314/python.exe unsichere_seite.py [anzahl_gruppen]
"""
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from scipy.cluster.vq import kmeans2, whiten

BASIS = Path(__file__).resolve().parent
REF_ART = BASIS / "referenz" / "Amsel"
AUS_DIR = BASIS / "unsicher" / "Amsel"
SEITE = BASIS / "unsichere_Amsel.html"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

spec = importlib.util.spec_from_file_location("lb", BASIS / "labelseite_bauen.py")
lb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lb)

PRO_GRUPPE = 3          # so viele Vertreter je Gruppe zum Anhoeren
POLSTER_MS = 250

RUFTYPEN = lb.RUFTYPEN


def main():
    anzahl = int(sys.argv[1]) if len(sys.argv) > 1 else 7
    quelle = BASIS / "phrasen_zugeordnet.json"
    if not quelle.exists():
        print("Erst kalibrieren.py laufen lassen."); sys.exit(1)

    daten = json.loads(quelle.read_text(encoding="utf-8"))
    unsicher = daten["unsicher"]
    if not unsicher:
        print("Nichts unsicher — nichts zu tun."); return

    felder = ["spitze_hz", "bandbreite_hz", "flachheit",
              "modulation", "kantigkeit", "rate_hz"]
    matrix = np.array([[e[f] for f in felder] for e in unsicher])
    n = min(anzahl, len(unsicher))
    zentren, zuordnung = kmeans2(whiten(matrix), n, minit="++", seed=7)
    for e, g in zip(unsicher, zuordnung):
        e["gruppe"] = int(g)

    AUS_DIR.mkdir(parents=True, exist_ok=True)
    for alt in AUS_DIR.glob("*.wav"):
        alt.unlink()

    # Quelldateien einmal laden, nicht je Phrase
    geladen = {}
    def hole_audio(name):
        if name not in geladen:
            treffer = list(REF_ART.glob(Path(name).stem + ".*"))
            if not treffer:
                geladen[name] = None
            else:
                _, _, seg = lb.lade_mono(treffer[0])
                geladen[name] = seg
        return geladen[name]

    gruppen = []
    for g in range(n):
        drin = [e for e in unsicher if e["gruppe"] == g]
        if not drin:
            continue
        mitte = np.array([[e[f] for f in felder] for e in drin]).mean(axis=0)
        # typischste zuerst: die nahe am Gruppenmittel
        drin.sort(key=lambda e: np.linalg.norm(
            np.array([e[f] for f in felder]) - mitte))

        vertreter = []
        for e in drin[:PRO_GRUPPE]:
            seg = hole_audio(e["datei"])
            if seg is None:
                continue
            start = max(0, e["start_s"] * 1000 - POLSTER_MS)
            ende = min(len(seg), (e["start_s"] + e["dauer_s"]) * 1000 + POLSTER_MS)
            name = f"{Path(e['datei']).stem}_{int(e['start_s']*1000)}.wav"
            seg[start:ende].export(AUS_DIR / name, format="wav")
            vertreter.append({**e, "wav": name})

        if vertreter:
            gruppen.append({
                "nr": g, "anzahl": len(drin), "vertreter": vertreter,
                "abstand": float(np.mean([e["abstand"] for e in drin])),
                "mitte": {f: float(np.median([e[f] for e in drin]))
                          for f in felder},
                "xc": {},
            })
            for e in drin:
                gruppen[-1]["xc"][e["xc_typ"]] = gruppen[-1]["xc"].get(e["xc_typ"], 0) + 1

    # Nutzen zuerst: was am weitesten von allen Vorlagen weg ist
    gruppen.sort(key=lambda g: -g["abstand"])
    baue_seite(gruppen, len(unsicher))
    print(f"{len(unsicher)} unsichere Phrasen in {len(gruppen)} Gruppen")
    print(f"{sum(len(g['vertreter']) for g in gruppen)} Schnipsel zum Anhören")
    print(f"Seite: {SEITE}")


def baue_seite(gruppen, gesamt):
    t = ["""<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Amsel — unsichere Phrasen</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#1a1a1a;color:#e8e8e8;line-height:1.55}
.kopf{padding:22px 28px;background:#111;border-bottom:1px solid #333}
h1{margin:0 0 6px;font-size:20px}
.hinweis{color:#aaa;font-size:14px;max-width:80ch}
.legende{display:flex;flex-wrap:wrap;gap:10px;padding:14px 28px;background:#161616;border-bottom:1px solid #333}
.legende div{background:#222;padding:8px 12px;border-radius:6px;font-size:12.5px;max-width:28ch}
.legende b{color:#7fd1c1}
.gruppe{margin:20px 28px;background:#212121;border-radius:8px;padding:15px 18px}
.gruppe h2{margin:0 0 4px;font-size:16px;color:#7fd1c1}
.werte{color:#999;font-size:12.5px;margin-bottom:10px;font-family:ui-monospace,monospace}
.schnipsel{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px}
.schnipsel figure{margin:0;background:#191919;padding:9px;border-radius:6px;width:215px}
.schnipsel figcaption{font-size:11px;color:#888;margin-bottom:5px;font-family:ui-monospace,monospace}
audio{height:32px;width:100%}
select{background:#2c2c2c;color:#eee;border:1px solid #444;padding:6px 9px;border-radius:5px;font-size:13px;width:100%;margin-top:6px}
.ausgabe{margin:22px 28px 40px}
textarea{width:100%;height:140px;background:#111;color:#8ee;border:1px solid #333;border-radius:6px;padding:11px;font-family:ui-monospace,monospace;font-size:12px}
button{background:#0e639c;color:#fff;border:0;padding:9px 16px;border-radius:5px;font-size:14px;cursor:pointer;margin-top:9px}
.klein{color:#888;font-size:12px}
</style></head><body>
<div class="kopf"><h1>Amsel — unsichere Phrasen</h1>
<div class="hinweis">Diese Phrasen konnte die automatische Zuordnung nicht
sicher einordnen. Statt aller """ + str(gesamt) + """ siehst du nur die
typischsten Vertreter je Klanggruppe — wer die entscheidet, entscheidet
implizit über die ähnlichen mit. <b>Die oberste Gruppe liegt am weitesten
von allen bekannten Ruftypen entfernt</b> — dort steckt am ehesten etwas,
das unsere fünf Typen nicht abdecken. Ruhig leer lassen, was unklar ist.</div></div>
<div class="legende">"""]

    for _, titel, beschreibung in RUFTYPEN:
        t.append(f"<div><b>{titel}</b><br>{beschreibung}</div>")
    t.append("</div>")

    for rang, g in enumerate(gruppen, 1):
        m = g["mitte"]
        xc = ", ".join(f"{k}×{v}" for k, v in
                       sorted(g["xc"].items(), key=lambda kv: -kv[1]))
        t.append(f'<div class="gruppe"><h2>{rang}. Klanggruppe — '
                 f'{g["anzahl"]} Phrasen, Abstand {g["abstand"]:.1f}</h2>')
        t.append(f'<div class="werte">Spitze {m["spitze_hz"]/1000:.2f} kHz &nbsp; '
                 f'Bandbreite {m["bandbreite_hz"]/1000:.2f} kHz &nbsp; '
                 f'Flachheit {m["flachheit"]:.3f} &nbsp; '
                 f'Modulation {m["modulation"]:.2f} &nbsp; '
                 f'Kantigkeit {m["kantigkeit"]:.2f} &nbsp; '
                 f'Rate {m["rate_hz"]:.1f}/s<br>xeno-canto: {xc}</div>')
        t.append('<div class="schnipsel">')
        for v in g["vertreter"]:
            t.append(
                f'<figure><figcaption>{v["spitze_hz"]/1000:.1f} kHz · '
                f'{v["dauer_s"]:.1f} s · <span style="color:#6a8caf">'
                f'{v["xc_typ"]}</span></figcaption>'
                f'<audio controls preload="none" src="unsicher/Amsel/{v["wav"]}"></audio>'
                f'<select data-wav="{v["wav"]}">'
                '<option value="">— zuordnen —</option>')
            for schluessel, titel, _ in RUFTYPEN:
                t.append(f'<option value="{schluessel}">{titel}</option>')
            t.append('<option value="neuer_typ">etwas anderes — neuer Typ</option>')
            t.append("</select></figure>")
        t.append("</div></div>")

    t.append("""<div class="ausgabe"><h2>Ergebnis</h2>
<div id="zaehler" class="klein">noch nichts zugeordnet</div>
<textarea id="raus" readonly></textarea>
<button onclick="navigator.clipboard.writeText(document.getElementById('raus').value)">kopieren</button></div>
<script>
const f=[...document.querySelectorAll('select[data-wav]')];
function akt(){const o={};f.forEach(x=>{if(x.value)o[x.dataset.wav]=x.value});
document.getElementById('raus').value=JSON.stringify(o,null,2);
document.getElementById('zaehler').textContent=Object.keys(o).length+' von '+f.length+' zugeordnet';
f.forEach(x=>{x.closest('figure').style.outline=x.value?'2px solid #2d6a4f':'none'});}
f.forEach(x=>x.addEventListener('change',akt));akt();
</script></body></html>""")

    SEITE.write_text("".join(t), encoding="utf-8")


if __name__ == "__main__":
    main()
