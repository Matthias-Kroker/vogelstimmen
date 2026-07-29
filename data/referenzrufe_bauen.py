"""Baut eine kleine Sammlung BELEGTER Referenzrufe zum Kennenlernen.

Anders als der grosse Referenzsatz ist diese Liste handverlesen: jede
Aufnahme ist eine, bei der der Aufnehmende entweder den Ruf lautmalerisch
benannt ODER den Ausloeser dazugeschrieben hat. Damit steht nicht nur da
"alarm call", sondern WELCHER Alarm und WARUM.

Das ist der belastbarste Ausgangspunkt, den es ohne eigene Feldarbeit gibt:
keine Vermutung von mir, sondern eine Aussage der Person am Mikrofon.

Aufruf:
  C:/Python314/python.exe referenzrufe_bauen.py
"""
import json
import os
import sys
import time
from pathlib import Path

import requests
from pydub import AudioSegment

API_KEY = os.environ.get("XENO_CANTO_API_KEY", "")
BASIS = Path(__file__).resolve().parent
ZIEL_DIR = BASIS / "referenzrufe" / "Amsel"
SEITE = BASIS / "referenzrufe_Amsel.html"
UA = {"User-Agent": "Vogelstimmen-Lern-App/0.1 (privates Lernprojekt)"}

# Handverlesen. "stellen" = Sekunden, an denen der Ruf laut Anmerkung
# vorkommt; leer heisst: ganze Aufnahme nehmen (sie ist dann kurz genug).
REFERENZRUFE = [
    {
        "xc": "815414", "ruf": "ssiih — Warnruf Luftfeind",
        "beleg": "Aufnehmender beschreibt ihn wörtlich: „a thin, high and "
                 "descending tone, seee“ — mit Zeitangaben.",
        "stellen": [1.0, 15.4, 28.7], "fenster": 3.5,
        "hoeren_auf": "dünn, hoch, fallend. Klingt weich an und wieder ab — "
                      "genau das, was du als „wird leiser“ beschrieben hast.",
    },
    {
        "xc": "894642", "ruf": "Tixen — Bodenfeind",
        "beleg": "Aufnehmender nennt es „chink chink“ — die englische "
                 "Lautmalerei fürs Tixen.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "kurze harte Einzelklicks, gut zu orten. Kein Ton, "
                      "eher ein Anschlag.",
    },
    {
        "xc": "1161236", "ruf": "Zetern / Rattle",
        "beleg": "Aufnehmender: „rattle call“.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "schnelle Folge, überschlägt sich, rasselnd. Das ist "
                      "dein „keckern“.",
    },
    {
        "xc": "688992", "ruf": "Zetern / Rattle",
        "beleg": "Aufnehmender: „alarm rattle male“.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "wie oben — zum Vergleich, damit du die Bandbreite hörst.",
    },
    {
        "xc": "544297", "ruf": "Alarm auf Katze (Bodenfeind)",
        "beleg": "Aufnehmender: „Alarm call due to my cat's presence“ — "
                 "Auslöser bekannt.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "Bodenfeind-Alarm mit belegtem Anlass. Vergleiche mit "
                      "dem ssiih oben: anderer Feind, anderer Ruf.",
    },
    {
        "xc": "424175", "ruf": "Alarm auf Katzen, Jungvogel bedroht",
        "beleg": "Aufnehmender: „alarm calling as two cats tried to predate "
                 "its single fledged young“.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "höchste Erregungsstufe — hier sollte das Zetern "
                      "besonders deutlich sein.",
    },
    {
        "xc": "167956", "ruf": "Hassen auf Eule",
        "beleg": "Aufnehmender: „alarmed about the presence of a boreal owl“ "
                 "— die Eule ist bei 14,2 s selbst zu hören.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "Eule sitzt, wird gehasst. Laut und gut zu orten — das "
                      "Gegenteil des ssiih.",
    },
    {
        "xc": "1050351", "ruf": "Grenzfall: Luftfeind-Ruf ohne Luftfeind",
        "beleg": "Aufnehmender: „high-pitched alarm calls (usually used to "
                 "warn of aerial predators, in this case directed towards a "
                 "second male)“.",
        "stellen": [], "fenster": 0,
        "hoeren_auf": "klingt wie der Luftwarnruf, gilt aber einem Rivalen. "
                      "Zeigt: der Ruf sagt etwas über die FORM, nicht immer "
                      "über den Anlass.",
    },
]

FFMPEG = Path(r"C:\Users\kroker\Tools\ffmpeg\bin\ffmpeg.exe")
if FFMPEG.exists():
    AudioSegment.converter = str(FFMPEG)
    AudioSegment.ffmpeg = str(FFMPEG)
    AudioSegment.ffprobe = str(FFMPEG.parent / "ffprobe.exe")


def hole(url, params=None, versuche=4, timeout=60):
    warte = 3
    for versuch in range(versuche):
        try:
            r = requests.get(url, params=params, headers=UA, timeout=timeout)
            if r.status_code == 429:
                time.sleep(warte); warte *= 2; continue
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if versuch == versuche - 1:
                print(f"    fehlgeschlagen: {e}")
                return None
            time.sleep(warte); warte *= 2
    return None


def main():
    if not API_KEY:
        print("XENO_CANTO_API_KEY fehlt.")
        sys.exit(1)

    ZIEL_DIR.mkdir(parents=True, exist_ok=True)
    fertig = []

    for eintrag in REFERENZRUFE:
        xid = eintrag["xc"]
        r = hole("https://xeno-canto.org/api/3/recordings",
                 {"query": f"nr:{xid}", "key": API_KEY})
        if r is None:
            continue
        recs = r.json().get("recordings") or []
        if not recs:
            print(f"XC{xid}: nicht gefunden")
            continue
        rec = recs[0]

        suffix = Path(rec.get("file-name") or "x.mp3").suffix.lower() or ".mp3"
        roh = ZIEL_DIR / f"XC{xid}{suffix}"
        if not roh.exists():
            url = rec["file"]
            if not url.startswith("http"):
                url = "https:" + url
            d = hole(url, timeout=120)
            if d is None:
                continue
            roh.write_bytes(d.content)
            time.sleep(0.4)

        audio = AudioSegment.from_file(roh)
        schnipsel = []
        if eintrag["stellen"]:
            # Nur die Stellen, die in der Anmerkung genannt sind
            for nr, sek in enumerate(eintrag["stellen"]):
                start = max(0, (sek - 0.7) * 1000)
                ende = min(len(audio), start + eintrag["fenster"] * 1000)
                name = f"XC{xid}_t{nr}.wav"
                audio[start:ende].export(ZIEL_DIR / name, format="wav")
                schnipsel.append((name, f"bei {sek:g} s"))
        else:
            # Ganze Aufnahme, aber auf 20 s begrenzt
            name = f"XC{xid}_ganz.wav"
            audio[:20000].export(ZIEL_DIR / name, format="wav")
            schnipsel.append((name, rec.get("length") or ""))

        fertig.append({**eintrag, "schnipsel": schnipsel,
                       "xc_typ": rec.get("type"), "land": rec.get("cnt"),
                       "aufnehmer": rec.get("rec"), "lizenz": rec.get("lic"),
                       "laenge": rec.get("length")})
        print(f"XC{xid:9s} {eintrag['ruf'][:40]:42s} {len(schnipsel)} Schnipsel")

    baue_seite(fertig)
    print(f"\n{len(fertig)} Referenzrufe -> {SEITE}")


def baue_seite(eintraege):
    t = ["""<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Amsel — Referenzrufe</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#1a1a1a;color:#e8e8e8;line-height:1.55}
.kopf{padding:22px 28px;background:#111;border-bottom:1px solid #333}
h1{margin:0 0 6px;font-size:20px}
.hinweis{color:#aaa;font-size:14px;max-width:78ch}
.ruf{margin:20px 28px;background:#212121;border-radius:8px;padding:16px 20px;
border-left:3px solid #7fd1c1}
.ruf h2{margin:0 0 8px;font-size:17px;color:#7fd1c1}
.beleg{background:#191919;padding:10px 13px;border-radius:6px;font-size:13.5px;
color:#c8c8c8;margin-bottom:10px}
.beleg b{color:#e0a458}
.achten{font-size:14px;margin-bottom:12px}
.achten b{color:#7fd1c1}
.player{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.player figure{margin:0}
.player figcaption{font-size:11.5px;color:#888;margin-bottom:4px;font-family:ui-monospace,monospace}
audio{height:34px}
.quelle{margin-top:10px;font-size:11.5px;color:#777}
</style></head><body>
<div class="kopf"><h1>Amsel — Referenzrufe</h1>
<div class="hinweis">Handverlesen: bei jeder dieser Aufnahmen hat der
Aufnehmende entweder den Ruf selbst benannt oder den Auslöser
dazugeschrieben. Es steht also nicht nur „alarm call“ dran, sondern
welcher Alarm und warum. Zum Kennenlernen der Rufe, bevor du die
Zuordnung machst — nicht zum Beschriften.</div></div>"""]

    for e in eintraege:
        t.append(f'<div class="ruf"><h2>{e["ruf"]}</h2>')
        t.append(f'<div class="beleg"><b>Beleg:</b> {e["beleg"]}</div>')
        t.append(f'<div class="achten"><b>Worauf hören:</b> {e["hoeren_auf"]}</div>')
        t.append('<div class="player">')
        for name, bez in e["schnipsel"]:
            t.append(f'<figure><figcaption>{bez}</figcaption>'
                     f'<audio controls preload="none" '
                     f'src="referenzrufe/Amsel/{name}"></audio></figure>')
        t.append("</div>")
        t.append(f'<div class="quelle">xeno-canto XC{e["xc"]} · '
                 f'Etikett dort: „{e["xc_typ"]}“ · {e["land"]} · '
                 f'{e["laenge"]} · Aufnahme: {e["aufnehmer"]} · '
                 f'{e["lizenz"]}</div></div>')

    t.append("</body></html>")
    SEITE.write_text("".join(t), encoding="utf-8")


if __name__ == "__main__":
    main()
