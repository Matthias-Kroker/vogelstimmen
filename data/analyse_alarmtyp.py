"""Unterscheidet Warnruf von Hassruf -- rechnerisch, nicht nach Gehör.

Hintergrund: xeno-canto kennt nur EIN Etikett "alarm call". Darunter
stecken aber zwei akustisch voellig verschiedene Rufe (nach Marler):

  Warnruf  schmalbandiger, gleichbleibender Ton um 6-9 kHz. Absichtlich
           schwer zu orten. Amsel: das lange "ziiiiehhh".
  Hassruf  breitbandig, hart, abgehackt. Absichtlich leicht zu orten.
           Amsel: das "keckern".

Diese Beschreibung laesst sich direkt in Zahlen uebersetzen:

  Spektraler Schwerpunkt   wo liegt die Energie im Frequenzband
  Bandbreite               wie breit streut sie (schmal = Ton, breit = Rauschen)
  Spektrale Flachheit      Wiener-Entropie: 0 = reiner Ton, 1 = weisses Rauschen
  Modulationsrate          wie oft die Lautstaerke pro Sekunde umschlaegt
                           (gleichmaessig gehalten vs. abgehackt)

Aufruf:
  C:/Python314/python.exe analyse_alarmtyp.py <ordner_oder_datei> [...]
"""
import sys
from pathlib import Path

import numpy as np
from pydub import AudioSegment

FFMPEG = Path(r"C:\Users\kroker\Tools\ffmpeg\bin\ffmpeg.exe")
if FFMPEG.exists():
    AudioSegment.converter = str(FFMPEG)
    AudioSegment.ffmpeg = str(FFMPEG)
    AudioSegment.ffprobe = str(FFMPEG.parent / "ffprobe.exe")

MAX_MS = 8000          # gleicher Ausschnitt wie im Lernaudio
RAUSCHGRENZE = 0.12    # leise Rahmen ignorieren (Wind, Hintergrund)


def lade_mono(pfad, max_ms=MAX_MS):
    seg = AudioSegment.from_file(pfad)[:max_ms].set_channels(1)
    roh = np.array(seg.get_array_of_samples()).astype(np.float64)
    if roh.size == 0:
        return None, 0
    roh /= (np.abs(roh).max() or 1.0)
    return roh, seg.frame_rate


def merkmale(signal, sr, fenster=1024):
    """Spektrale Kennwerte, gemittelt ueber die lauten Abschnitte."""
    schritt = fenster // 2
    rahmen = [signal[i:i + fenster] for i in range(0, len(signal) - fenster, schritt)]
    if not rahmen:
        return None

    fenster_fkt = np.hanning(fenster)
    freqs = np.fft.rfftfreq(fenster, 1.0 / sr)

    lautstaerke = np.array([np.sqrt(np.mean(r ** 2)) for r in rahmen])
    if lautstaerke.max() <= 0:
        return None
    laut = lautstaerke / lautstaerke.max()
    aktiv = laut > RAUSCHGRENZE
    if aktiv.sum() < 3:
        return None

    schwerpunkte, bandbreiten, flachheiten, spitzen = [], [], [], []
    for r, ist_aktiv in zip(rahmen, aktiv):
        if not ist_aktiv:
            continue
        spektrum = np.abs(np.fft.rfft(r * fenster_fkt))
        summe = spektrum.sum()
        if summe <= 0:
            continue
        p = spektrum / summe
        schwerpunkt = float((freqs * p).sum())
        schwerpunkte.append(schwerpunkt)
        bandbreiten.append(float(np.sqrt(((freqs - schwerpunkt) ** 2 * p).sum())))
        # Wiener-Entropie: geometrisches / arithmetisches Mittel
        s = spektrum + 1e-12
        flachheiten.append(float(np.exp(np.mean(np.log(s))) / np.mean(s)))
        spitzen.append(float(freqs[int(np.argmax(spektrum))]))

    if not schwerpunkte:
        return None

    # Wie oft schlaegt die Lautstaerke um? Abgehacktes keckern moduliert
    # viel haeufiger als ein durchgehaltener Pfiff.
    schwelle = laut.mean()
    ueber = laut > schwelle
    wechsel = int(np.sum(ueber[1:] != ueber[:-1]))
    dauer_s = len(signal) / sr
    modulation = wechsel / dauer_s if dauer_s else 0.0

    return {
        "schwerpunkt_hz": float(np.median(schwerpunkte)),
        "bandbreite_hz": float(np.median(bandbreiten)),
        "flachheit": float(np.median(flachheiten)),
        "spitze_hz": float(np.median(spitzen)),
        "modulation_hz": float(modulation),
        "dauer_s": dauer_s,
    }


def ereignisse(signal, sr, fenster=512, schwelle=0.20, min_rahmen=3):
    """Einzelne Rufsilben finden.

    WICHTIG: Kennwerte ueber die ganzen 8 Sekunden zu mitteln funktioniert
    NICHT. Eine Aufnahme enthaelt oft mehrere Ruftypen plus Hintergrund; der
    Mittelwert landet dann in einem nichtssagenden Mittelfeld. Erster Versuch
    ergab 7 von 10 "unklar" und widerspruechliche Begruendungen wie
    "breitbandig, tonal". Vogelrufe sind einzelne Silben -- also silbenweise
    messen.
    """
    schritt = fenster // 2
    rms = np.array([np.sqrt(np.mean(signal[i:i + fenster] ** 2))
                    for i in range(0, len(signal) - fenster, schritt)])
    if rms.size == 0 or rms.max() <= 0:
        return []
    rms = rms / rms.max()
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


def silbe_messen(seg, sr):
    """Spitzenfrequenz und Hochband-Anteil einer einzelnen Silbe."""
    if len(seg) < 256:
        return None
    spektrum = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
    freqs = np.fft.rfftfreq(len(seg), 1.0 / sr)
    summe = spektrum.sum() + 1e-12
    return {
        "spitze_hz": float(freqs[int(np.argmax(spektrum))]),
        "anteil_ueber_5k": float(spektrum[freqs > 5000].sum() / summe),
    }


def einordnen(m):
    """Punktesystem -- NOCH NICHT KALIBRIERT.

    Die Schwellwerte sind aus der Literaturbeschreibung geraten, nicht an
    echten, gehoert bestaetigten Beispielen geeicht. Solange niemand ein paar
    Aufnahmen abgehoert und beschriftet hat, ist das Ergebnis ein Hinweis,
    kein Befund. Siehe README, Abschnitt "Alarmtyp-Analyse".
    """
    warn = hass = 0
    gruende = []

    if m["spitze_hz"] >= 5500:
        warn += 1; gruende.append(f"Spitze {m['spitze_hz']/1000:.1f} kHz hoch")
    elif m["spitze_hz"] <= 4000:
        hass += 1; gruende.append(f"Spitze {m['spitze_hz']/1000:.1f} kHz tief")

    if m["bandbreite_hz"] <= 1800:
        warn += 1; gruende.append("schmalbandig")
    elif m["bandbreite_hz"] >= 2600:
        hass += 1; gruende.append("breitbandig")

    if m["flachheit"] <= 0.10:
        warn += 1; gruende.append("tonal")
    elif m["flachheit"] >= 0.25:
        hass += 1; gruende.append("rauschig")

    if m["modulation_hz"] <= 3.0:
        warn += 1; gruende.append("gleichmäßig")
    elif m["modulation_hz"] >= 6.0:
        hass += 1; gruende.append("abgehackt")

    if warn > hass:
        return "Warnruf", warn, gruende
    if hass > warn:
        return "Hassruf", hass, gruende
    return "unklar", 0, gruende


def main():
    ziele = sys.argv[1:]
    if not ziele:
        print(__doc__)
        sys.exit(1)

    dateien = []
    for z in ziele:
        p = Path(z)
        if p.is_dir():
            dateien += sorted(x for x in p.iterdir()
                              if x.suffix.lower() in (".mp3", ".wav", ".flac"))
        elif p.exists():
            dateien.append(p)

    if not dateien:
        print("Keine Audiodateien gefunden.")
        sys.exit(1)

    kopf = (f"{'Datei':28s} {'Spitze':>8s} {'Bandbr':>8s} {'Flach':>6s} "
            f"{'Mod/s':>6s}  {'Einordnung':10s} Gründe")
    print(kopf)
    print("-" * len(kopf))

    zaehler = {}
    for f in dateien:
        try:
            signal, sr = lade_mono(f)
            if signal is None:
                print(f"{f.name:28s} (leer)")
                continue
            m = merkmale(signal, sr)
            if m is None:
                print(f"{f.name:28s} (zu leise / zu kurz)")
                continue
            urteil, _, gruende = einordnen(m)
            zaehler[urteil] = zaehler.get(urteil, 0) + 1
            print(f"{f.name:28s} {m['spitze_hz']:7.0f}  {m['bandbreite_hz']:7.0f} "
                  f"{m['flachheit']:6.3f} {m['modulation_hz']:6.1f}  "
                  f"{urteil:10s} {', '.join(gruende)}")
        except Exception as e:
            print(f"{f.name:28s} FEHLER: {e}")

    print("\nZusammenfassung:", ", ".join(f"{k}={v}" for k, v in sorted(zaehler.items())))


if __name__ == "__main__":
    main()
