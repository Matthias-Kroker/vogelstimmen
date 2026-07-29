# Work Journal — Vogelstimmen-Lern-App

Privates Projekt (nicht KDREI). Ziel: Vogelstimmen und Naturwissen sicher
am Gehör und am Bild erkennen.

---

## Aktueller Stand

| Bereich | Stand |
|---|---|
| **Lernaudio** | ✅ läuft — 177 Einträge, 42 min, Piper-Stimme „Thorsten", gemischt |
| **Artdaten** | ✅ 20 Arten: Text, Bild, Fressfeinde, Lebensraum, Nahrung, Zug |
| **Ruftyp-Analyse** | 🟡 automatische Zuordnung läuft, 41 von 131 Phrasen sicher |
| **App** | 🟡 Liste + Steckbriefe mit Bildern, noch kein Ton |

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
  **Matthias hört dasselbe** („teilweise extrem ähnlich"), und die
  automatische Zuordnung findet in beiden dieselbe Mischung. → *Ruf gegen
  Alarmruf ist keine echte akustische Unterscheidung* und wird in der App
  nicht gelehrt. Stattdessen die realen Typen, die quer dazu liegen.
- Nur 5 % sind als gemischt gekennzeichnet, gehört sind es viel mehr. Der
  Aufnehmende etikettiert die Absicht, das Mikrofon nimmt alles auf.
- → **Aufnahmeebene taugt nicht als Wahrheit. Phrasenebene schon.**

### Ruftypen der Amsel — Benennung nach der Fachliteratur

Quellen: **Messmer & Messmer 1956** (*Zeitschrift für Tierpsychologie*) als
Grundlagenarbeit, **Cramp, Birds of the Western Palearctic Bd. 5** — das
Werk, das Thomas Bergman bei seinen Aufnahmen zitiert — sowie ein
kuratiertes Klangportrait (AMPLE Edition; kommerziell, aber deckungsgleich).

Vollständiges Repertoire: Gesang, **Siih**, **Tixen**, **Zetern**,
**Djück-Rufe**, Bettelrufe, Jugendgesang, Herbstgesang.

| Ruf | Spitze | Bandbreite | Rate | Anlass |
|---|---|---|---|---|
| **Siih** | 7,9–8,2 kHz | **0,9–1,2 kHz** | einzeln, 0,3–0,9/s | Beutegreifer, meist aus der Luft |
| **Tixen** | 4,0–6,5 kHz | 2,2–3,4 kHz | 1,0–3,5/s | Bodenfeind |
| **Zetern** | 5,7 kHz | 2,6–2,9 kHz | bis 3,2/s | höchste Erregung, auch Revierstreit |
| **Djück** | 4,3–5,1 kHz | 2,5 kHz | 0,7–2,7/s | gedämpfte Unmutslaute, z.B. am Futterplatz |
| **Gesang** | 2,1 kHz | — | — | — |

**Tixen und Zetern sind ein Übergang, keine zwei Schubladen** — die
Literatur beschreibt Tixen, „das bei stärkerer Erregung in Zetern
übergeht". Die frühere selbstgebaute Kategorie *bodenalarm* ist deshalb
in Tixen aufgegangen: funktional dasselbe (Bodenfeind), nur erregter.

**Bandbreite höher gewichten als Spitzenfrequenz.** Hohe Frequenzen werden
über Entfernung stärker gedämpft — ein entfernter Siih rutscht scheinbar
nach unten (XC982288: 3,5 kHz), bleibt aber schmalbandig (1,67 kHz).
Matthias hatte die Entfernung selbst vermutet; das ist physikalisch stimmig.

### Alarmrufe: zwei unabhängige Achsen
- `stadium` — **was** erbeutet wird (Altvogel / Nest / beides)
- `alarmtyp` — **welcher** Alarm kommt (Warnruf / Hassruf)

Die Achsen laufen **nicht** parallel: der Waldkauz erbeutet Altvögel, wird
tagsüber am Schlafplatz aber gehasst. Zusammenlegen wäre falsch.

Nach Marler: Warnruf ~7 kHz, weich ein- und ausklingend, **schwer zu orten**
(Reaktion: Deckung). Hassruf breitbandig, hart, **leicht zu orten**
(Reaktion: hinfliegen und bedrängen).

---

## Automatische Zuordnung — Stand

Aus den belegten Rufen gebaute Vorlagen, angewandt auf die 131 Phrasen der
30 Referenzaufnahmen (`kalibrieren.py`):

- **41 zugeordnet, 90 unsicher (68 %).** Bewusst streng — lieber offen
  lassen als falsch zuordnen.
- **Selbstprüfung bestanden:** 13 von 15 Phrasen aus reinen `song`-Aufnahmen
  werden als Gesang erkannt (86 %).
- Fehler beim ersten Versuch: Normierung lief nur über die 39
  Vorlagenphrasen und wurde dann auf 131 fremde angewandt — alle lagen
  ausserhalb, 97 % galten als unsicher. Massstabsfehler, nicht Merkmalsfehler.
  Jetzt wird über Vorlagen und Zielphrasen gemeinsam normiert.

**Auffällig:** unter den 131 Phrasen wurde **kein einziger ssiih** gefunden.
Zwei Kandidaten über 6,5 kHz stecken in `merula_call_XC772744`, beide zu
breitbandig für die Vorlage (3,34 bzw. 2,46 kHz gegen 1,02 beim Beleg).

**Matthias' Einschätzung dazu (2026-07-29):** der schöne ssiih ist wirklich
außerordentlich selten — er meint, er sei in keiner unserer bisherigen
Aufnahmen vorgekommen. Das stützt „im Bestand selten" gegen „meine
Phrasenbildung zerlegt ihn falsch". Passt auch dazu, dass ausgerechnet
unser einziger Beleg aus **Schweden** stammt, nicht aus Deutschland.
Wenn das stimmt, ist der ssiih über Suche kaum zu beschaffen — dann müsste
gezielt nach Aufnahmen mit Greifvogel-Kontext in der Anmerkung gesucht
werden statt nach Ruftyp-Etiketten.

## Merkmale aus AVONET und EltonTraits

Beide Datensätze eingebunden (`traits_holen.py`), **20 von 20 Arten** ergänzt.

- **AVONET** (Tobias et al. 2022, 11.009 Arten): Lebensraum, Zugverhalten,
  Ernährungstyp, Nahrungsnische, Lebensweise, Masse, Flügellänge.
  Bezug über die figshare-API, `AVONET1_BirdLife`-Blatt.
- **EltonTraits 1.0** (Wilman et al. 2014, 9.993 Arten): Nahrung in Prozent
  und Nahrungsschicht. Direkter Download von esapubs.org.

Verknüpft über den wissenschaftlichen Namen; für abweichende Taxonomie gibt
es eine Ersatztabelle (`Cyanistes caeruleus` ↔ `Parus caeruleus`,
`Poecile palustris` ↔ `Parus palustris`).

Alles ins Deutsche übersetzt, weil die Datensätze englisch sind.

**Vorsicht bei groben Kategorien:** EltonTraits gibt dem Zaunkönig
„Fisch 10 %" — ein Artefakt der groben Einteilung, kein Befund. AVONET
setzt den Turmfalken auf „Gebüsch". Die Werte sind für 11.000 Arten
gemacht, nicht für die Feinheiten von zwanzig.

## Offene Punkte

- **Eulen-Aufnahme XC167956** passt in keine Schublade: schmalbandig wie ein
  ssiih (1,74 kHz), aber tief (4,25 kHz) und in Folge (2,6/s). Widerspricht
  der Annahme *Eule → Hassruf*. Eigener Ruftyp?
- **Amsel hat nur 1 Aufnahme mit Zeitmarken** — ausgerechnet dort, wo die
  Verwirrung am größten ist. Andere Arten (Buntspecht 10, Kolkrabe 9) sind
  besser versorgt.
- **Vorlagen nur an Amsel geeicht.** Andere Arten brauchen eigene Belege.
- **Kein Siih in den 131 Phrasen** — siehe oben. Nächster Ansatz: nach
  Greifvogel-Kontext in der Anmerkung suchen statt nach Ruftyp-Etikett.
- **„tsiirr"-Anlockruf** (5,1–9,9 kHz, 102–359 ms, auf dem Zug und in der
  Brutzeit) liegt im selben Band wie der Siih, hat aber andere Funktion.
  Verwechslungsgefahr, noch nicht eingearbeitet.
- **Phrasenerkennung filtert keine Nicht-Vogel-Geräusche.** Vier von
  Matthias markierte „neue Typen" waren mit 7 kHz Bandbreite bei 1,4 kHz
  Spitze fast sicher der röhrende Rothirsch aus dem Hintergrund
  (XC590275, laut Anmerkung „Rutting season of Red Deer").
- **Nicht zugänglich:** Messmer & Messmer 1956 (Wiley) und „Die
  Zeteraktivität der Amsel" (Springer) stehen hinter Bezahlschranken.
  Wären die belastbarsten Quellen; über eine Bibliothek zu holen.
- **Merkmale in der App noch nicht angezeigt** — stehen in den JSONs, aber
  `daten_bauen.py` und der Steckbrief kennen sie noch nicht.
- **90 unsichere Phrasen** warten auf ein Urteil
  (`unsichere_Amsel.html`, 19 Schnipsel in 7 Klanggruppen).

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

### 2026-07-29 — Merkmale und unsichere Phrasen
AVONET und EltonTraits eingebunden, 20 von 20 Arten ergänzt. Verkürzte
Abhörseite für die 90 unsicheren Phrasen: gruppiert nach Klang, je Gruppe
die typischsten Vertreter, sortiert nach Abstand zu den bekannten Vorlagen —
19 Entscheidungen statt 90.

### 2026-07-29 — Repertoire nach Literatur
Selbstgebaute Kategorien durch die Fachbenennung ersetzt. Matthias' als
„neuer Typ" markierte Laute vom Futterplatz sind **Djück-Rufe** — die
standen schlicht nicht auf meiner Liste. Vier weitere seiner Markierungen
waren vermutlich gar keine Amsel, sondern ein röhrender Hirsch im
Hintergrund; die Phrasenerkennung braucht einen Rauschfilter.
