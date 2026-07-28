"""Schneidet Silben aus den Referenzen und baut eine Abhoer-Seite.

Warum silbenweise: eine Aufnahme ist fast nie sauber. Der Aufnehmende
vergibt EIN Etikett, das Mikrofon nimmt aber auf, was der Vogel gerade
macht. Nur 5 % der Amsel-Aufnahmen sind als gemischt gekennzeichnet --
gehoert sind es viel mehr. Auf Aufnahmeebene laesst sich deshalb nichts
sauber lernen, auf Silbenebene schon.

Ablauf:
  1. Silben finden und einzeln als kurzes WAV ablegen
  2. Merkmale messen und nach Aehnlichkeit gruppieren (k-means)
  3. HTML-Seite bauen: je Gruppe ein paar Beispiele zum Anhoeren,
     daneben die Ruftyp-Beschreibung und ein Auswahlfeld

Zum Beschriften reicht es, pro Gruppe zwei, drei Schnipsel zu hoeren --
nicht alle. Die Zuordnung laesst sich am Seitenende als JSON kopieren.

Aufruf:
  C:/Python314/python.exe labelseite_bauen.py [anzahl_gruppen]
"""
import json
import sys
from pathlib import Path

import numpy as np
from pydub import AudioSegment
from scipy.cluster.vq import kmeans2, whiten

BASIS = Path(__file__).resolve().parent
REF_DIR = BASIS / "referenz"
SILBEN_DIR = BASIS / "silben"
SEITE = BASIS / "labelseite.html"

FFMPEG = Path(r"C:\Users\kroker\Tools\ffmpeg\bin\ffmpeg.exe")
if FFMPEG.exists():
    AudioSegment.converter = str(FFMPEG)
    AudioSegment.ffmpeg = str(FFMPEG)
    AudioSegment.ffprobe = str(FFMPEG.parent / "ffprobe.exe")

MIN_HZ = 1200          # darunter ist Wind und Verkehr, nicht Vogel
POLSTER_MS = 60        # etwas Luft vor und nach der Silbe, sonst klickt es
BEISPIELE_PRO_GRUPPE = 6

# Aus der ornithologischen Literatur -- steht in der Seite neben den Knoepfen,
# damit man nicht raten muss, sondern weiss, worauf zu achten ist.
RUFTYPEN = [
    ("ssiih", "Warnruf Luftfeind",
     "hoher, dünner, abfallender Ton. Durchgehalten, OHNE schnelle Modulation. "
     "Schwer zu orten — das ist Absicht."),
    ("sozialruf", "Sozialruf",
     "ebenfalls hoch, aber mit „grillenhafter“ schneller Modulation im Ton. "
     "Frühmorgens, keine Gefahr. Verwechslungsgefahr mit ssiih!"),
    ("tixen", "Tixen — Bodenfeind",
     "kurze, harte Klicks „tix-tix-tix“, wiederholt. Leicht zu orten."),
    ("zetern", "Zetern / Keckern",
     "gesteigertes Tixen, überschlägt sich. Starke Erregung, Mobbing, "
     "auch Revierstreit zwischen Männchen."),
    ("gesang", "Gesang",
     "tief, melodisch, flötend. Ganze Strophen statt einzelner Rufe."),
    ("unklar", "unklar / Störgeräusch",
     "nicht zuzuordnen, zu leise, oder gar kein Vogel."),
]


def lade_mono(pfad, max_ms=30000):
    seg = AudioSegment.from_file(pfad)[:max_ms].set_channels(1)
    roh = np.array(seg.get_array_of_samples()).astype(np.float64)
    if roh.size == 0:
        return None, 0, None
    roh /= (np.abs(roh).max() or 1.0)
    return roh, seg.frame_rate, seg


def silben_finden(signal, sr, fenster=512, schwelle=0.20, min_rahmen=3):
    schritt = fenster // 2
    rms = np.array([np.sqrt(np.mean(signal[i:i + fenster] ** 2))
                    for i in range(0, len(signal) - fenster, schritt)])
    if rms.size == 0 or rms.max() <= 0:
        return []
    rms /= rms.max()
    aktiv = rms > schwelle
    gefunden, start = [], None
    for i, a in enumerate(aktiv):
        if a and start is None:
            start = i
        elif not a and start is not None:
            if i - start >= min_rahmen:
                gefunden.append((start * schritt, i * schritt + fenster))
            start = None
    if start is not None:
        gefunden.append((start * schritt, len(signal)))
    return gefunden


def merkmale(seg, sr):
    """Kennwerte einer Silbe. Unterhalb MIN_HZ wird nicht gemessen."""
    if len(seg) < 256:
        return None
    spektrum = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
    freqs = np.fft.rfftfreq(len(seg), 1.0 / sr)
    maske = freqs >= MIN_HZ
    if not maske.any() or spektrum[maske].sum() <= 0:
        return None

    sp, fr = spektrum[maske], freqs[maske]
    p = sp / sp.sum()
    schwerpunkt = float((fr * p).sum())
    bandbreite = float(np.sqrt(((fr - schwerpunkt) ** 2 * p).sum()))
    flachheit = float(np.exp(np.mean(np.log(sp + 1e-12))) / (np.mean(sp) + 1e-12))

    # Modulation INNERHALB der Silbe -- das unterscheidet den gehaltenen
    # Warnruf vom grillenhaft flirrenden Sozialruf.
    huelle = np.abs(seg)
    kern = max(8, len(huelle) // 40)
    glatt = np.convolve(huelle, np.ones(kern) / kern, mode="same")
    modulation = float(np.std(glatt) / (np.mean(glatt) + 1e-9))

    return {
        "spitze_hz": float(fr[int(np.argmax(sp))]),
        "schwerpunkt_hz": schwerpunkt,
        "bandbreite_hz": bandbreite,
        "flachheit": flachheit,
        "modulation": modulation,
        "dauer_ms": len(seg) / sr * 1000.0,
    }


def main():
    anzahl_gruppen = int(sys.argv[1]) if len(sys.argv) > 1 else 8
    if not REF_DIR.exists():
        print("Kein referenz/ -- erst referenz_holen.py laufen lassen.")
        sys.exit(1)

    verzeichnis = {}
    vpfad = REF_DIR / "verzeichnis.json"
    if vpfad.exists():
        for e in json.loads(vpfad.read_text(encoding="utf-8")):
            verzeichnis[e["datei"]] = e

    SILBEN_DIR.mkdir(parents=True, exist_ok=True)
    for alt in SILBEN_DIR.glob("*.wav"):
        alt.unlink()

    silben = []
    dateien = sorted(f for f in REF_DIR.iterdir()
                     if f.suffix.lower() in (".mp3", ".wav", ".flac"))
    print(f"{len(dateien)} Referenzaufnahmen\n")

    for f in dateien:
        signal, sr, seg = lade_mono(f)
        if signal is None:
            continue
        gefunden = silben_finden(signal, sr)
        info = verzeichnis.get(f.name, {})
        behalten = 0
        for nr, (a, b) in enumerate(gefunden):
            m = merkmale(signal[a:b], sr)
            if m is None or m["dauer_ms"] < 25:
                continue
            start_ms = max(0, a / sr * 1000 - POLSTER_MS)
            ende_ms = min(len(seg), b / sr * 1000 + POLSTER_MS)
            name = f"{f.stem}_s{nr:03d}.wav"
            seg[start_ms:ende_ms].export(SILBEN_DIR / name, format="wav")
            m.update({"datei": name, "quelle": f.name,
                      "art": info.get("art", "?"),
                      "xc_typ": info.get("xc_typ", "?")})
            silben.append(m)
            behalten += 1
        print(f"  {f.name:42s} {behalten:3d} Silben")

    if len(silben) < anzahl_gruppen:
        print("\nZu wenige Silben für eine Gruppierung.")
        sys.exit(1)

    felder = ["spitze_hz", "schwerpunkt_hz", "bandbreite_hz",
              "flachheit", "modulation", "dauer_ms"]
    matrix = np.array([[s[f] for f in felder] for s in silben])
    # whiten: alle Merkmale auf vergleichbare Streuung bringen, sonst
    # dominieren die Hertz-Werte allein durch ihre Groessenordnung.
    zentren, zuordnung = kmeans2(whiten(matrix), anzahl_gruppen,
                                 minit="++", seed=42)
    for s, g in zip(silben, zuordnung):
        s["gruppe"] = int(g)

    baue_seite(silben, anzahl_gruppen)
    print(f"\n{len(silben)} Silben in {anzahl_gruppen} Gruppen")
    print(f"Seite: {SEITE}")
    print("Im Browser öffnen, pro Gruppe 2-3 Schnipsel hören, zuordnen.")


def baue_seite(silben, anzahl_gruppen):
    teile = ["""<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Vogelstimmen — Silben beschriften</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#1a1a1a;color:#e8e8e8;line-height:1.5}
.kopf{padding:20px 28px;background:#111;border-bottom:1px solid #333}
h1{margin:0 0 6px;font-size:19px}
.hinweis{color:#aaa;font-size:14px;max-width:70ch}
.legende{display:flex;flex-wrap:wrap;gap:10px;padding:16px 28px;background:#161616;border-bottom:1px solid #333}
.legende div{background:#222;padding:9px 13px;border-radius:6px;font-size:13px;max-width:30ch}
.legende b{color:#7fd1c1}
.gruppe{margin:22px 28px;background:#212121;border-radius:8px;padding:16px 18px}
.gruppe h2{margin:0 0 4px;font-size:16px;color:#7fd1c1}
.werte{color:#999;font-size:12.5px;margin-bottom:12px;font-family:ui-monospace,monospace}
.schnipsel{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px}
.schnipsel figure{margin:0;background:#191919;padding:9px;border-radius:6px}
.schnipsel figcaption{font-size:11px;color:#888;margin-bottom:5px;font-family:ui-monospace,monospace}
audio{height:32px;display:block}
select{background:#2c2c2c;color:#eee;border:1px solid #444;padding:7px 10px;border-radius:5px;font-size:14px}
.ausgabe{margin:22px 28px 40px}
textarea{width:100%;height:150px;background:#111;color:#8ee;border:1px solid #333;
border-radius:6px;padding:11px;font-family:ui-monospace,monospace;font-size:12px}
button{background:#0e639c;color:#fff;border:0;padding:9px 16px;border-radius:5px;
font-size:14px;cursor:pointer;margin-top:9px}
</style></head><body>
<div class="kopf"><h1>Silben beschriften</h1>
<div class="hinweis">Pro Gruppe zwei, drei Schnipsel anhören — nicht alle.
Die Gruppen sind nach akustischer Ähnlichkeit gebildet, nicht nach den
xeno-canto-Etiketten. Passt eine Gruppe nicht zusammen, ruhig „unklar“
wählen; dann wird feiner unterteilt.</div></div>
<div class="legende">"""]

    for _, titel, beschreibung in RUFTYPEN:
        teile.append(f"<div><b>{titel}</b><br>{beschreibung}</div>")
    teile.append("</div>")

    for g in range(anzahl_gruppen):
        drin = [s for s in silben if s["gruppe"] == g]
        if not drin:
            continue
        mit = lambda f: np.median([s[f] for s in drin])
        typen = {}
        for s in drin:
            typen[s["xc_typ"]] = typen.get(s["xc_typ"], 0) + 1
        herkunft = ", ".join(f"{k}×{v}" for k, v in
                             sorted(typen.items(), key=lambda kv: -kv[1]))

        teile.append(f'<div class="gruppe"><h2>Gruppe {g + 1} — {len(drin)} Silben</h2>')
        teile.append(
            f'<div class="werte">Spitze {mit("spitze_hz")/1000:.2f} kHz &nbsp; '
            f'Bandbreite {mit("bandbreite_hz")/1000:.2f} kHz &nbsp; '
            f'Flachheit {mit("flachheit"):.3f} &nbsp; '
            f'Modulation {mit("modulation"):.2f} &nbsp; '
            f'Dauer {mit("dauer_ms"):.0f} ms<br>'
            f'xeno-canto sagt dazu: {herkunft}</div>')

        teile.append('<div class="schnipsel">')
        schritt = max(1, len(drin) // BEISPIELE_PRO_GRUPPE)
        for s in drin[::schritt][:BEISPIELE_PRO_GRUPPE]:
            teile.append(
                f'<figure><figcaption>{s["spitze_hz"]/1000:.1f} kHz · '
                f'{s["dauer_ms"]:.0f} ms</figcaption>'
                f'<audio controls preload="none" src="silben/{s["datei"]}"></audio>'
                f'</figure>')
        teile.append("</div>")

        teile.append(f'<select data-gruppe="{g}"><option value="">— zuordnen —</option>')
        for schluessel, titel, _ in RUFTYPEN:
            teile.append(f'<option value="{schluessel}">{titel}</option>')
        teile.append("</select></div>")

    teile.append("""<div class="ausgabe"><h2>Ergebnis</h2>
<textarea id="raus" readonly placeholder="Zuordnungen erscheinen hier"></textarea>
<button onclick="navigator.clipboard.writeText(document.getElementById('raus').value)">
kopieren</button></div>
<script>
const felder=[...document.querySelectorAll('select[data-gruppe]')];
function aktualisieren(){
  const o={};
  felder.forEach(f=>{if(f.value)o['gruppe_'+f.dataset.gruppe]=f.value});
  document.getElementById('raus').value=JSON.stringify(o,null,2);
}
felder.forEach(f=>f.addEventListener('change',aktualisieren));
</script></body></html>""")

    SEITE.write_text("".join(teile), encoding="utf-8")


if __name__ == "__main__":
    main()
