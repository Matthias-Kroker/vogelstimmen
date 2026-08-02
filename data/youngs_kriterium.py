"""Prueft Youngs Kriterium rechnerisch: reagieren ANDERE Arten mit?

Die Idee dahinter (Jon Young, Bird Language): Ein Territorialstreit klingt
oft wie Alarm, aber die Umgebung bleibt ruhig. Bei echtem Alarm reagieren
Nachbarn -- auch anderer Arten. Wenn das stimmt, muessten Alarmaufnahmen
akustisch VIELFAELTIGER sein als Gesangsaufnahmen derselben Art: mehr
Silben, die nicht zum Rufer passen.

Messgroesse: Wie viele Silben einer Aufnahme liegen ausserhalb des
Frequenzbandes, in dem die Art selbst ruft? Dazu je Art aus IHREN eigenen
Silben ein Band bestimmen (Median der Spitzenfrequenz +/- Streuung) und
zaehlen, was rausfaellt.

ERGEBNIS 2026-08-02 -- DIE MESSUNG TRAEGT NICHT. Vorher lesen, bevor
jemand die Zahlen weiterverwendet:

  Erster Durchgang sah ueberzeugend aus: Alarmaufnahmen 16 % Fremdsilben
  gegen 3 % beim Gesang, Faktor 5, und das trotz der Morgenchor-Verzerrung,
  die das Gegenteil beguenstigt haette.

  Zwei Gegentests haben das zerlegt:

  1. Liegen die Fremdsilben ueber oder unter dem Artband? Waeren es die
     hohen Luftalarme des Rufers selbst, muessten sie DARUEBER liegen.
     Tatsaechlich lagen 218 darunter und nur 26 darueber. Der eine
     Verdacht war damit aus dem Weg -- aber der naechste kam sofort.
  2. Unterhalb etwa 1,2 kHz singt kein heimischer Singvogel. Dort sitzen
     Wind, Schritte, Kleidung am Mikrofon. Genau dorthin fiel der Grossteil
     der "Fremdsilben". Nach Ausschluss dieses Bereichs bleibt:
     Gesang 4 %, Alarm 8 %, unbestimmt 9 %.

  "Unbestimmt" liegt damit VOR Alarm. Wenn Fremdsilben eine
  Gemeinschaftsreaktion auf Alarm anzeigen wuerden, duerfte das nicht
  passieren. Mehr als die Haelfte des scheinbaren Effekts war
  Aufnahmerauschen: Alarm wird haeufiger hastig und aus der Hand
  aufgenommen als Gesang.

  Das ist KEIN Gegenbeleg gegen Young. Es heisst nur, dass dieser Test zu
  schwach war -- 8-Sekunden-Ausschnitte, 64 kbit/s, und vor allem: die
  zeitliche Reihenfolge wird gar nicht gemessen. "Reaktion" hiesse, dass
  die Fremdsilben NACH dem Alarm einsetzen. Genau das muesste ein
  brauchbarer Test zeigen, und dafuer braucht es die ganzen Aufnahmen
  statt unserer Ausschnitte.

WAS DIESE MESSUNG NICHT KANN -- vorher lesen:

  * Unsere Ausschnitte sind 8 Sekunden lang, das Feld `also` beschreibt
    aber die GANZE Originalaufnahme. Eine als "mit anderen Arten"
    gefuehrte Aufnahme kann in unserem Ausschnitt allein sein.
  * 64 kbit/s Mono. Leise Hintergrundvoegel ueberleben das teilweise nicht.
  * SCHWERWIEGEND: Gesang wird oft im Morgenchor aufgenommen -- da singen
    zwangslaeufig viele Arten mit. Der Vergleich Alarm gegen Gesang ist
    also von vornherein zugunsten des Gesangs verzerrt. Faellt das
    Ergebnis trotzdem fuer Alarm aus, ist es umso belastbarer; faellt es
    fuer Gesang aus, beweist es nichts.
  * Fremdsilben heissen nicht "Reaktion". Wer da ruft, kann schon vorher
    gerufen haben. Zeitliche Reihenfolge misst dieses Skript NICHT.

Aufruf:
  C:/Python314/python.exe youngs_kriterium.py
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import numpy as np

BASIS = Path(__file__).resolve().parent
RUFE = BASIS.parent / "assets" / "rufe"
STIMMEN = BASIS.parent / "daten" / "stimmen.json"
META = BASIS / "rufe_metadaten.json"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from analyse_alarmtyp import ereignisse, lade_mono  # noqa: E402

# Unterhalb dieser Grenze singt kein heimischer Singvogel. Was hier
# auftaucht, ist Wind, Schritte oder Kleidung am Mikrofon. Ohne diesen
# Ausschluss misst man die Aufnahmesituation statt der Voegel -- und
# Alarmaufnahmen entstehen haeufiger hastig und aus der Hand.
VOGEL_MIN_HZ = 1200


def silben_spitzen(pfad, fenster=512):
    """Spitzenfrequenz je Silbe."""
    signal, sr = lade_mono(pfad)
    if signal is None or not sr:
        return []
    freqs = np.fft.rfftfreq(fenster, 1.0 / sr)
    fkt = np.hanning(fenster)
    raus = []
    for start, ende in ereignisse(signal, sr):
        stueck = signal[start:ende]
        if len(stueck) < fenster:
            continue
        # Mittleres Spektrum der Silbe
        schritt = fenster // 2
        spektren = [np.abs(np.fft.rfft(stueck[i:i + fenster] * fkt))
                    for i in range(0, len(stueck) - fenster, schritt)]
        if not spektren:
            continue
        mittel = np.mean(spektren, axis=0)
        spitze = float(freqs[int(np.argmax(mittel))])
        if spitze >= VOGEL_MIN_HZ:
            raus.append(spitze)
    return raus


def main():
    if not STIMMEN.exists():
        print("Erst stimmen_zuordnen.py --schreiben laufen lassen."); sys.exit(1)
    zuordnung = json.loads(STIMMEN.read_text(encoding="utf-8"))["zuordnung"]
    meta = json.loads(META.read_text(encoding="utf-8"))

    muster = re.compile(r"^(?P<art>[a-z_]+)_XC(?P<nr>\d+)\.mp3$", re.I)
    dateien = []
    for f in sorted(RUFE.glob("*.mp3")):
        m = muster.match(f.name)
        if m and m.group("nr") in zuordnung:
            dateien.append((f, m.group("art"), m.group("nr")))

    print(f"{len(dateien)} Aufnahmen werden vermessen...\n")

    # 1. Durchgang: Silben sammeln
    silben = {}
    je_art = defaultdict(list)
    for i, (pfad, art, nr) in enumerate(dateien, 1):
        s = silben_spitzen(pfad)
        silben[nr] = (art, s)
        # Fuer das Artband nur Aufnahmen heranziehen, bei denen der Rufer
        # sicher die Hauptquelle ist: Gesang, sicher zugeordnet.
        z = zuordnung[nr]
        if z["stimme"] == "gesang" and z["sicherheit"] == "sicher":
            je_art[art].extend(s)
        if i % 40 == 0:
            print(f"  {i}/{len(dateien)}")

    # 2. Artband bestimmen
    band = {}
    for art, s in je_art.items():
        if len(s) < 12:
            continue
        a = np.array(s)
        band[art] = (float(np.percentile(a, 5)), float(np.percentile(a, 95)))
    print(f"\nFrequenzband fuer {len(band)} Arten bestimmt "
          f"(aus sicher zugeordnetem Gesang)\n")

    # 3. Fremdanteil je Aufnahme
    ergebnis = defaultdict(list)
    for nr, (art, s) in silben.items():
        if art not in band or not s:
            continue
        tief, hoch = band[art]
        fremd = sum(1 for f in s if f < tief * 0.75 or f > hoch * 1.3)
        ergebnis[zuordnung[nr]["stimme"]].append({
            "nr": nr, "art": art, "silben": len(s),
            "fremdanteil": fremd / len(s),
            "als_mit_anderen": zuordnung[nr]["andere_arten"],
        })

    print(f"{'Stimme':13s} {'Aufn.':>6s} {'Silben':>7s} "
          f"{'Fremdanteil':>12s}  {'laut Archiv mit':>16s}")
    print("-" * 62)
    for stimme in ("gesang", "alarm", "unbestimmt", "territorial",
                   "bettelruf", "begleitruf"):
        e = ergebnis.get(stimme) or []
        if not e:
            continue
        anteile = [x["fremdanteil"] for x in e]
        silbenzahl = np.mean([x["silben"] for x in e])
        mit = sum(1 for x in e if x["als_mit_anderen"])
        print(f"{stimme:13s} {len(e):6d} {silbenzahl:7.1f} "
              f"{np.mean(anteile)*100:11.0f} %  {mit:10d} / {len(e)}")

    # Der eigentliche Test: NUR innerhalb der Aufnahmen, die das Archiv als
    # "mit anderen Arten" fuehrt. Sonst vergleicht man Aufnahmesituationen,
    # nicht Rufe.
    print("\nNur Aufnahmen, die das Archiv als „mit anderen Arten“ fuehrt:")
    print(f"{'Stimme':13s} {'Aufn.':>6s} {'Fremdanteil':>12s}")
    print("-" * 34)
    for stimme in ("gesang", "alarm", "unbestimmt"):
        e = [x for x in (ergebnis.get(stimme) or []) if x["als_mit_anderen"]]
        if not e:
            continue
        print(f"{stimme:13s} {len(e):6d} "
              f"{np.mean([x['fremdanteil'] for x in e])*100:11.0f} %")

    alarm = [x["fremdanteil"] for x in (ergebnis.get("alarm") or [])]
    gesang = [x["fremdanteil"] for x in (ergebnis.get("gesang") or [])]
    unbest = [x["fremdanteil"] for x in (ergebnis.get("unbestimmt") or [])]
    if alarm and gesang:
        print(f"\nAlarm {np.mean(alarm)*100:.0f} %, "
              f"Gesang {np.mean(gesang)*100:.0f} %, "
              f"unbestimmt {np.mean(unbest)*100:.0f} % Fremdsilben.")
        print("BEWERTUNG: Solange „unbestimmt“ nicht deutlich unter Alarm "
              "liegt, misst dieser Test die Aufnahmesituation und nicht "
              "die Vögel. Siehe Kopf der Datei.")

    (BASIS / "youngs_kriterium.json").write_text(
        json.dumps({"band": band, "ergebnis": dict(ergebnis)},
                   ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n-> {BASIS / 'youngs_kriterium.json'}")


if __name__ == "__main__":
    main()
