"""Baut eine Grundlagenseite: so klingt Gesang, so klingt Ruf.

Luecke, die vorher offen war: es gab Referenzen fuer die Alarmtypen, aber
keine fuer die Grundkategorien. Wer nicht weiss, wie Gesang und Ruf
klingen, kann auch die Feinheiten nicht einordnen.

Grundlage sind die bereits geladenen Referenzaufnahmen -- q:A und
eindeutig mit EINEM Typ gekennzeichnet. Kein neuer Download noetig.

Aufruf:
  C:/Python314/python.exe grundlagen_bauen.py
"""
import importlib.util
import json
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent
REF_ART = BASIS / "referenz" / "Amsel"
AUS_DIR = BASIS / "grundlagen" / "Amsel"
SEITE = BASIS / "grundlagen_Amsel.html"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

spec = importlib.util.spec_from_file_location("lb", BASIS / "labelseite_bauen.py")
lb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lb)

PRO_KATEGORIE = 4
MAX_MS = 25000

KATEGORIEN = [
    {
        "xc_typ": "song", "titel": "Gesang",
        "worauf": "Ganze Strophen, tief und flötend, mit Pausen dazwischen. "
                  "Klingt melodisch, nicht wie einzelne Rufe. Die Amsel singt "
                  "von erhöhten Warten, oft in der Dämmerung.",
        "messwert": "tief — Spitze um 2,1 kHz",
    },
    {
        "xc_typ": "call", "titel": "Ruf",
        "worauf": "Einzelne kurze Laute statt Strophen. Keine Melodie, kein "
                  "Aufbau. Dient der Verständigung, nicht dem Revier.",
        "messwert": "höher als Gesang — meist 4 bis 6 kHz",
    },
    {
        "xc_typ": "alarm call", "titel": "Alarmruf",
        "worauf": "Wie ein Ruf, aber dringlicher und meist in Folge. "
                  "ACHTUNG: unter diesem Etikett stecken mehrere "
                  "verschiedene Rufe — ssiih, Tixen, Zetern. Deshalb klingt "
                  "es hier nicht einheitlich.",
        "messwert": "uneinheitlich — das ist der Punkt",
    },
]


def main():
    if not REF_ART.exists():
        print("Keine Referenzaufnahmen."); sys.exit(1)

    verzeichnis = {}
    vpfad = BASIS / "referenz" / "verzeichnis.json"
    if vpfad.exists():
        for e in json.loads(vpfad.read_text(encoding="utf-8")):
            verzeichnis[e["datei"]] = e

    AUS_DIR.mkdir(parents=True, exist_ok=True)
    for alt in AUS_DIR.glob("*.wav"):
        alt.unlink()

    from pydub import AudioSegment
    ffmpeg = Path(r"C:\Users\kroker\Tools\ffmpeg\bin\ffmpeg.exe")
    if ffmpeg.exists():
        AudioSegment.converter = str(ffmpeg)
        AudioSegment.ffmpeg = str(ffmpeg)
        AudioSegment.ffprobe = str(ffmpeg.parent / "ffprobe.exe")

    ergebnis = []
    for kat in KATEGORIEN:
        passende = [(n, e) for n, e in verzeichnis.items()
                    if e.get("xc_typ") == kat["xc_typ"]
                    and (REF_ART / n).exists()]
        # kurze zuerst -- die enthalten am ehesten nur das Gemeinte
        def sek(paar):
            try:
                t = (paar[1].get("laenge") or "9:99").split(":")
                return int(t[0]) * 60 + int(t[1])
            except (ValueError, IndexError):
                return 999
        passende.sort(key=sek)

        beispiele = []
        for name, meta in passende[:PRO_KATEGORIE]:
            audio = AudioSegment.from_file(REF_ART / name)[:MAX_MS]
            ziel = AUS_DIR / f"{kat['xc_typ'].replace(' ', '_')}_{meta['xc_id']}.wav"
            audio.export(ziel, format="wav")
            beispiele.append({
                "wav": ziel.name, "laenge": meta.get("laenge"),
                "land": meta.get("land"), "aufnehmer": meta.get("aufnehmer"),
                "xc_id": meta.get("xc_id"),
                "anmerkung": (meta.get("anmerkung") or "")[:160],
            })
        ergebnis.append({**kat, "beispiele": beispiele})
        print(f"  {kat['titel']:12s} {len(beispiele)} Beispiele")

    baue_seite(ergebnis)
    print(f"\nSeite: {SEITE}")


def baue_seite(kategorien):
    t = ["""<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Amsel — Grundlagen: Gesang, Ruf, Alarm</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#1a1a1a;color:#e8e8e8;line-height:1.55}
.kopf{padding:22px 28px;background:#111;border-bottom:1px solid #333}
h1{margin:0 0 6px;font-size:20px}
.hinweis{color:#aaa;font-size:14px;max-width:80ch}
.kat{margin:20px 28px;background:#212121;border-radius:8px;padding:16px 20px;border-left:3px solid #7fd1c1}
.kat h2{margin:0 0 8px;font-size:18px;color:#7fd1c1}
.worauf{font-size:14.5px;margin-bottom:8px}
.mess{color:#e0a458;font-size:13px;font-family:ui-monospace,monospace;margin-bottom:12px}
.reihe{display:flex;flex-wrap:wrap;gap:12px}
.reihe figure{margin:0;background:#191919;padding:10px;border-radius:6px;width:250px}
.reihe figcaption{font-size:11.5px;color:#888;margin-bottom:5px;font-family:ui-monospace,monospace}
audio{height:34px;width:100%}
.anm{color:#777;font-size:11px;margin-top:5px;font-style:italic}
</style></head><body>
<div class="kopf"><h1>Amsel — Grundlagen</h1>
<div class="hinweis">Bevor es um die Feinheiten geht: so klingen die drei
Grundkategorien. Alle Aufnahmen sind Qualität A und mit <b>genau einem</b>
Typ gekennzeichnet — also so sauber, wie xeno-canto es hergibt.
Der Alarmruf unten ist absichtlich zuletzt: unter dem Etikett stecken
mehrere verschiedene Rufe, und das hört man.</div></div>"""]

    for k in kategorien:
        t.append(f'<div class="kat"><h2>{k["titel"]}</h2>')
        t.append(f'<div class="worauf">{k["worauf"]}</div>')
        t.append(f'<div class="mess">Messwert: {k["messwert"]}</div>')
        t.append('<div class="reihe">')
        for b in k["beispiele"]:
            t.append(f'<figure><figcaption>XC{b["xc_id"]} · {b["laenge"]} · '
                     f'{b["land"]}</figcaption>'
                     f'<audio controls preload="none" '
                     f'src="grundlagen/Amsel/{b["wav"]}"></audio>')
            if b["anmerkung"]:
                t.append(f'<div class="anm">{b["anmerkung"]}</div>')
            t.append("</figure>")
        t.append("</div></div>")

    t.append("</body></html>")
    SEITE.write_text("".join(t), encoding="utf-8")


if __name__ == "__main__":
    main()
