# Work Journal — Vogelstimmen-Lern-App

Privates Projekt (nicht KDREI). Ziel: Vogelstimmen und Naturwissen sicher
am Gehör und am Bild erkennen.

---

## Aktueller Stand

| Bereich | Stand |
|---|---|
| **Lernaudio** | ✅ läuft — 177 Einträge, 42 min, Piper-Stimme „Thorsten", gemischt |
| **Artdaten** | ✅ 20 Arten mit Text, Bild, Fressfeinden (2 Achsen) |
| **Ruftyp-Analyse** | 🟡 Vorlagen für Amsel geeicht, andere Arten offen |
| **App** | 🔴 Grundgerüst steht, noch keine Oberfläche |

Repos: `Vogelstimmen-App` (diese App) und `Vogelstimmen` (Audio-Generator,
getrennt, weil unabhängig nutzbar).

---

## Referenzstellen — hier steht, was gerade gilt

| Was | Datei |
|---|---|
| Artdaten je Vogel | `data/species/<gattung>_<art>.json` |
| Ruftyp-Vorlagen (geeicht) | `data/ruftyp_vorlagen_Amsel.json` |
| Aufnahmen mit Zeitmarken | `data/annotierte_aufnahmen.json` |
| Belegte Referenzrufe | `data/referenzrufe_bauen.py` → `referenzrufe_Amsel.html` |
| Abhörseite zum Beschriften | `data/labelseite_bauen.py` → `labelseite_<Art>.html` |
| Lizenz- und Marktlage | `README.md` |

Erzeugte Ordner (`referenz/`, `referenzrufe/`, `silben/`) liegen in
`.gitignore` — sie sind jederzeit neu erzeugbar und teils lizenzgebunden.

---

## Gesicherte Erkenntnisse

### Lizenzen
- xeno-canto ist praktisch vollständig **NC** (nicht kommerziell). Von 1803
  Amsel-Aufnahmen aus Deutschland: **eine** unter schlichtem BY, **keine** CC0.
- **ND** wird ausgefiltert (`EXCLUDE_ND`), weil Ausschnitte Bearbeitungen sind.
  Kostet nichts — die Abdeckung bleibt bei 177 Einträgen.
- Referenzaufnahmen dürfen ND sein: sie werden **nie ausgeliefert**, nur
  gemessen. Messwerte sind keine Bearbeitung.
- Kommerziell ginge nur über direkte Anfrage bei den Aufnehmenden (~60
  Aufnahmen, einige Dutzend Personen). Vorher klären, nicht nachher.

### xeno-canto-Etiketten sind unzuverlässig
- `type:alarm` wird **still ignoriert** — die API liefert dann einfach alles.
  Gültig ist `type:"alarm call"` (in Anführungszeichen). Ebenso ignoriert:
  `type:seee`, `type:tix`, `type:rattle`.
- Das Typfeld ist teils **Freitext** — es gibt kein durchgesetztes Vokabular.
- `call` und `alarm call` überlappen akustisch zu 77 %: der `call`-Bereich
  (1,34–6,59 kHz) enthält den `alarm call`-Bereich (2,73–4,86 kHz) vollständig.
- Nur 5 % sind als gemischt gekennzeichnet, gehört sind es viel mehr. Der
  Aufnehmende etikettiert die Absicht, das Mikrofon nimmt alles auf.
- → **Aufnahmeebene taugt nicht als Wahrheit. Phrasenebene schon.**

### Ruftypen der Amsel (an belegten Beispielen geeicht, von Matthias gehört)

| Ruf | Spitze | Bandbreite | Rate | Anlass |
|---|---|---|---|---|
| **ssiih** | 7,9–8,2 kHz | **0,9–1,2 kHz** | einzeln, 0,3–0,9/s | Greifvogel im Flug |
| **Tixen** | 5,7 kHz | 2,5 kHz | 1,4/s | Bodenfeind |
| **Zetern** | 5,7 kHz | 2,6–2,9 kHz | bis 3,2/s | starke Erregung, auch Revierstreit |
| **Bodenalarm** | 4,3–4,6 kHz | 3,0 kHz | 2,8–3,0/s | Katze, belegt |
| **Gesang** | 2,1 kHz | — | — | — |

Stärkster Unterscheider ist die **Bandbreite**: ssiih 0,9–1,2 kHz gegen
2,5–3,1 kHz bei allem anderen. Faktor 2–3, keine Grauzone.

### Alarmrufe: zwei unabhängige Achsen
- `stadium` — **was** erbeutet wird (Altvogel / Nest / beides)
- `alarmtyp` — **welcher** Alarm kommt (Warnruf / Hassruf)

Die Achsen laufen **nicht** parallel: der Waldkauz erbeutet Altvögel, wird
tagsüber am Schlafplatz aber gehasst. Zusammenlegen wäre falsch.

Nach Marler: Warnruf ~7 kHz, weich ein- und ausklingend, **schwer zu orten**
(Reaktion: Deckung). Hassruf breitbandig, hart, **leicht zu orten**
(Reaktion: hinfliegen und bedrängen).

---

## Offene Punkte

- **Eulen-Aufnahme XC167956** passt in keine Schublade: schmalbandig wie ein
  ssiih (1,74 kHz), aber tief (4,25 kHz) und in Folge (2,6/s). Widerspricht
  der Annahme *Eule → Hassruf*. Eigener Ruftyp?
- **Amsel hat nur 1 Aufnahme mit Zeitmarken** — ausgerechnet dort, wo die
  Verwirrung am größten ist. Andere Arten (Buntspecht 10, Kolkrabe 9) sind
  besser versorgt.
- **Vorlagen nur an Amsel geeicht.** Andere Arten brauchen eigene Belege.
- **AVONET/EltonTraits** noch nicht eingebunden (Massen-CSV, andere Bauart
  als die Einzelabfragen).

---

## Was gut funktioniert hat

**Arbeitsteilung.** Matthias hört, Claude misst. Bei allen zehn
Referenzschnipseln deckten sich Gehör und Messung. Beispiele:
- „weniger hoch, mehrere hintereinander" (Katze) → 4,6 kHz bei 3,0/s
  gegen 7,9 kHz bei 0,6/s beim ssiih
- „wird leiser" (ssiih) → weicher Ein-/Ausklang, als *Kantigkeit* messbar
  gemacht; genau das, was Marler beschreibt
- „ein anderer Vogel weiter weg" → vom Aufnehmenden bestätigt: zwei Amseln

**Belegte Referenzen schlagen Etiketten.** Aufnahmen, bei denen der
Aufnehmende den Auslöser dazuschreibt („due to my cat's presence"), sind
die belastbarste Wahrheit ohne eigene Feldarbeit.

---

## Checkpoints

### 2026-07-28 — Lernaudio
Generator aus Downloads übernommen und repariert: Ausgabepfad absolut,
espeak-ng und ffmpeg portabel installiert, später auf Piper („Thorsten")
umgestellt. Zwei echte Fehler gefunden: `type:alarm` wurde still ignoriert
(14 von 20 Clips hatten den falschen Ruftyp), und 17 von 20 Aufnahmen sind
WAV, wurden aber als `.mp3` gespeichert und mit `from_mp3()` gelesen.

### 2026-07-28 — Projektstruktur
Getrennt in zwei Repos, privat unter `C:\Users\kroker\Projekte\`.
Artdaten für 20 Arten gesammelt (Wikidata, Wikipedia, Commons, GloBI).
GloBI brauchte Kuratierung — roh behauptete es einen Blauhai als
Amselfresser. Filter auf mitteleuropäische Arten plus Gegencheck gegen den
Wikipedia-Artikel: Amsel von 73 auf 15 bestätigte Fressfeinde.

### 2026-07-29 — Ruftypen
Silbenweise Analyse eingeführt, dann auf **Phrasen** umgestellt: die ersten
Schnipsel waren 30–400 ms und damit unbrauchbar zum Anhören. Dabei zwei
Fehler gefunden (Folgen über 6 s wurden abgeschnitten und der Rest
verworfen; Referenzverzeichnis wurde bei fehlgeschlagener Suche
überschrieben).

Belegte Referenzrufe zusammengestellt, von Matthias abgehört, Vorlagen
geeicht. Der von Marler beschriebene 7-kHz-Ton ist da — frühere Messungen
hatten über Mischaufnahmen gemittelt und ihn verwischt.

### 2026-07-29 — App-Gerüst
Expo SDK 57 (React 19.2, RN 0.86, TypeScript). Artdaten und Bilder werden
eingebacken, damit die App offline funktioniert.
