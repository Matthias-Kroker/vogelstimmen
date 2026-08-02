# Work Journal — Vogelstimmen-Lern-App

Privates Projekt (nicht KDREI). Ziel: Vogelstimmen und Naturwissen sicher
am Gehör und am Bild erkennen.

---

## ⚠ Was NICHT sattelfest ist

Zuerst lesen. Alles hier ist entweder unbelegt, nur teilweise geprüft oder
bekanntermaßen ungenau — beim Weiterbauen nicht als gesichert behandeln.

### Ruftypen
- **Zuordnung steckt bei 41 von 131 Phrasen (31 %).** Der Rest ist unsicher
  und wartet auf ein Urteil per Gehör (`unsichere_Amsel.html`).
- **Vorlagen nur an der Amsel geeicht.** Für alle anderen Arten gibt es
  keine geprüften Werte — die Zahlen dürfen nicht übertragen werden.
- **Kein einziger Siih unter 131 Phrasen.** Matthias bestätigt, dass der
  Ruf sehr selten ist; unser einziger Beleg stammt aus Schweden. Ob er im
  deutschen Bestand fehlt oder meine Phrasenbildung ihn zerlegt, ist
  ungeklärt.
- **Die Eulen-Aufnahme XC167956 passt in keine Schublade** (schmalbandig
  wie ein Siih, aber tief und in Folge). Möglicherweise ein entfernter
  Siih, möglicherweise ein eigener Typ. Widerspricht der Annahme
  *Eule → Hassruf*.
- **Der „tsiirr"-Anlockruf** (5,1–9,9 kHz) liegt im selben Band wie der
  Siih, hat aber andere Funktion. Nicht eingearbeitet — ein Teil dessen,
  was wir für Siih halten, könnte dieser Ruf sein.
- **Bandbreite müsste höher gewichtet werden als Spitzenfrequenz** (die ist
  entfernungsabhängig). Erkannt, aber in `kalibrieren.py` noch nicht
  umgesetzt.

### Messung
- **Die Phrasenerkennung filtert keine Nicht-Vogel-Geräusche.** Vier
  vermeintliche Rufe waren ein röhrender Rothirsch aus dem Hintergrund.
  Sehr breitbandige Phrasen (über 5 kHz) sind fast immer Störgeräusch.
- **Die Schwellwerte in `analyse_alarmtyp.py` sind geraten**, nicht an
  gehört bestätigten Beispielen geeicht. Im Code als unkalibriert markiert.

### Daten
- **AVONET und EltonTraits sind grobe Kategorien für 11.000 Arten.**
  EltonTraits gibt dem Zaunkönig „Fisch 10 %", AVONET setzt den Turmfalken
  auf „Gebüsch". Anteile unter 20 % werden deshalb verworfen — die
  verbleibenden sind trotzdem nur Näherungen.
- **Bilder verlassen sich auf fremde Einordnung bei Commons.** Einzelne
  Fehler kommen durch: „Amsel Weibchen.jpg" steckt dort in der
  Jungvogel-Kategorie.
- **Die xeno-canto-Etiketten sind nachweislich unzuverlässig** (`call` und
  `alarm call` überlappen zu 77 %). Sie werden nirgends als Wahrheit
  verwendet, tauchen in der Oberfläche aber als Herkunftsangabe auf.
- **Messmer & Messmer 1956 und „Die Zeteraktivität der Amsel" sind NICHT
  die belastbarsten Quellen zum Ruf-Repertoire** — das stand hier lange
  falsch. Beide sind weiter hinter Bezahlschranken, aber inzwischen ist
  bekannt, was drinsteht, und keine der beiden beantwortet unsere Frage:
  Messmer & Messmer (*Z. Tierpsychol.* 13, 1956: 341–441) untersuchen die
  **Entwicklung** der Lautäußerungen bei einzeln aufgezogenen Amseln in
  schalldichten Räumen — Ontogenese, nicht Akustik im Feld. Haarhaus'
  „Zeteraktivität" (*J. Ornithol.*) untersucht die **Tagesrhythmik** des
  Zeterns nach Aschoffs Regeln. Die Quelle, die tatsächlich trägt, stand
  auf keiner Liste: **Frankenberg 1981**.
- **Der Volltext von Randler (2022)** zum Häher, der auf Amselzetern hört,
  ist nicht geprüft — Springer-Bezahlschranke. Der Befund steht in der App
  ausdrücklich als ungeprüft.

### Vogelsprache
- **Das Tracking-Dokument ist KEINE unabhängige Quelle** — es wurde
  größtenteils von Claude selbst verfasst. Wer daraus zitiert, zitiert
  Claude. Deshalb trägt jeder Eintrag in `daten/vogelsprache.ts` ein Feld
  `beleg` (`literatur` oder `einschaetzung`), das auch in der Oberfläche
  sichtbar ist.
- **Belegt** sind inzwischen 7 von 13 Arten: Buchfink und Kohlmeise
  (Marler 1955/1956; Sci. Rep. 9, 2019), Zilpzalp (Cramp/BWP), Star
  (Devereux et al. 2008 — allerdings nur das Rufverhalten, nicht die
  Lautstärke), dazu wie bisher Haussperling, Rabenkrähe und Ringeltaube.
  Grundlage bleibt Jon Youngs Fünf-Stimmen-Schema.
- **Geschätzt** sind noch: Rotkehlchen, Blaumeise, Elster, Kolkrabe,
  Eichelhäher. Der Rang, den sie in der Regionsliste bekommen, beruht auf
  nichts als meiner Einordnung. Die Amsel ist seit 2026-08-02 belegt
  (Frankenberg 1981, Snow 1988) und damit die am besten dokumentierte Art.
- **Die Blaumeise ist der unangenehmste Fall:** Für die Kohlmeise ist der
  Hassruf jetzt belegt, für ihre nächste Verwandte nicht. Es ist
  verlockend, das eine aufs andere zu übertragen — im Eintrag steht
  ausdrücklich, dass das *nicht* belegt ist.
- **Der Star hat bewusst KEINE Hörbarkeitszahl.** Belegt ist nur, dass er
  bei schlechter Sicht häufiger ruft. Wie auffällig der Ruf klingt, war
  nicht zu finden — das Feld bleibt leer statt geraten.
- **Das Dokument selbst enthält den Fehler `type:alarm`** in seinen
  xeno-canto-Beispielen — denselben, der uns anfangs 14 von 20 falsche
  Clips beschert hat.

### Werkzeuge, die stillschweigend Daten zerstören
- **`bilder_commons.py` ohne Artnamen überschreibt ALLE Bildmanifeste.**
  Am 2026-08-01 versehentlich passiert: ein Lauf ohne Filter hat 582 Zeilen
  Nest- und Jungvogelbilder aus 18 Steckbriefen entfernt, weil Commons in
  dem Moment die passenden Unterkategorien nicht auswarf. Das Skript meldete
  dabei „Fertig" — der Verlust fiel nur durch `git status` auf.
  Wiederhergestellt per `git checkout`; seitdem verlangt der Gesamtlauf
  ausdrücklich `--alle`. **Vor jedem Datenlauf committen**: die Skripte
  schreiben ohne Rückfrage und ohne Sicherung.
- Ungeklärt bleibt, **warum** Commons diesmal keine Nest-Unterkategorien
  lieferte, obwohl die Kategorien selbst gefunden wurden (Kohlmeise: 137
  Dateien, 3 Unterkategorien, davon 0 als Nest erkannt). Entweder eine
  Regression in `gruppe_von()` oder eine Änderung bei Commons. Solange das
  offen ist, ist ein Gesamtlauf nicht sicher.

### App
- **Das Ähnlichkeitsmaß im Quiz ist ökologisch, nicht optisch.** Amsel und
  Rabenkrähe landen bei „leicht" gegeneinander, obwohl beide schwarz sind.
  Richtig wäre eine gepflegte Verwechslungstabelle.
- **Sumpfmeise** hat keine Nest- und Jungvogelbilder (Commons hat für sie
  keine Unterkategorien), **Heckenbraunelle** keinen Stimme-Abschnitt
  (Lücke bei Wikipedia).
- **Die App unterscheidet nur Gesang / Rufe / Trommeln**, nicht die Fünf
  Stimmen. Die xeno-canto-Etiketten geben mehr nicht her.

---

## Aktueller Stand

| Bereich | Stand |
|---|---|
| **Lernaudio** | ✅ läuft — 177 Einträge, 42 min, Piper-Stimme „Thorsten", gemischt |
| **Artdaten** | ✅ 20 Arten: Text, Bild, Fressfeinde, Lebensraum, Nahrung, Zug |
| **Ruftyp-Analyse** | 🟡 automatische Zuordnung läuft, 41 von 131 Phrasen sicher |
| **App** | 🟢 veröffentlicht: https://matthias-kroker.github.io/vogelstimmen/ |

Repos: `Vogelstimmen-App` (diese App, öffentlich auf GitHub als
`Matthias-Kroker/vogelstimmen`) und `Vogelstimmen` (Audio-Generator, lokal,
getrennt weil unabhängig nutzbar).

**Veröffentlicht:** https://matthias-kroker.github.io/vogelstimmen/ — bei
jedem Push auf `main` baut GitHub Actions neu und stellt online. Öffentlich,
weil GitHub Pages auf dem kostenlosen Plan nur aus öffentlichen Repos
funktioniert; ein privates Repo ginge erst mit Pro, und selbst dann bliebe
die Seite öffentlich. Lizenzrechtlich unbedenklich: BY-NC-SA erlaubt
nicht-kommerzielle Weitergabe mit Namensnennung, die bei jedem Bild und
jedem Ruf steht.

---

## Referenzstellen — hier steht, was gerade gilt

| Was | Datei |
|---|---|
| Artdaten je Vogel | `data/species/<gattung>_<art>.json` |
| Vogelsprache, Fünf Stimmen, Alarmprofile | `daten/vogelsprache.ts` |
| Standortlisten bauen | `data/region_bauen.py` → `daten/regionen/` |
| Offline-Paket, Speicherbudget | `regionspaket.ts`, `Offline.tsx` |
| Lernfortschritt (abgestufte Wiederholung) | `lernstand.ts` |
| Quiz mit Schwierigkeitsgraden | `Quiz.tsx` |
| PWA-Teile (Manifest, Service Worker) | `web/`, `data/pwa_bauen.py` |
| Bilder aus Commons holen | `data/bilder_commons.py` |
| Rufe komprimiert einbacken | `data/rufe_einbacken.py` |
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

## Vogelsprache — der eigentliche Lernrahmen

Aus Matthias' Tracking-Dokument: **Jon Youngs Fünf Stimmen.** Entscheidend
ist, dass **vier davon Baseline sind** und nur die fünfte Gefahr bedeutet.

| Stimme | Zustand |
|---|---|
| Gesang | Baseline |
| Begleitrufe | Baseline |
| **Territorial-/Aggressionsrufe** | **Baseline** — klingt wie Alarm, ist keiner |
| Bettelrufe | Baseline |
| Alarm | Gefahr |

**Das löst rückwirkend ein Rätsel:** XC123588 („two males had trouble with
each other"), von xeno-canto als `alarm call` geführt und von Matthias als
Keckern gehört, ist Stimme 3 — Territorialruf, also Baseline. Die
Literatur benennt genau diese Verwechslung und nennt ein Erkennungsmerkmal:
*andere Arten reagieren kaum darauf.*

**Nicht-vokale Alarme sind eine eigene Kategorie.** Die Ringeltaube hat
keinen vokalen Alarmruf; ihr Flügelklatschen beim erschreckten Auffliegen
ist ein belegtes mechanisches Signal (schneller und lauter als der normale
Abflug), auf das andere Tauben reagieren. Im Offenland auffällig, im
dichten Wald weniger.

**Rollen aus unseren eigenen Daten abgeleitet:** 8 der 20 Arten lösen
selbst Alarm aus. Habicht bei 9 Arten (Warnruf), Rabenkrähe bei 8
(Hassruf). Der **Sperber** stand auf Platz 6 der Auslöser und fehlte —
**seit 2026-08-01 ist er die 21. Art.** Nach Häufigkeit wäre er nie
aufgetaucht: GBIF führt ihn im Rhein-Main-Gebiet nicht einmal in den
Top 60.

### Ein Signal, zwei Bauformen — und warum eine Zahl je Art falsch war

Die gezielte Suche nach Belegen hat einen Konstruktionsfehler im eigenen
Datenmodell aufgedeckt. Der erste Entwurf gab jeder Art **eine**
„Auffälligkeit 1–5". Genau das ist nach Marler (1955, *Nature* 176: 6–8)
nicht haltbar: Viele Arten haben **zwei** Alarmrufe mit gegensätzlichem
Bau, und der Gegensatz ist der Sinn der Sache.

| | Luftalarm („siiih") | Hassruf (mobbing) |
|---|---|---|
| Bau | hoher Dauerton 6–9 kHz, schmalbandig, weich ein-/ausgeblendet | abrupt, tiefer, breitbandig |
| Absicht | **nicht** ortbar sein — der Habicht soll den Rufer nicht finden | ortbar sein — andere sollen zusammenkommen |
| Anlass | Greifvogel im Anflug | sitzender Feind, Katze, Eule |
| Reaktion | Deckung suchen | hinfliegen und bedrängen |
| Für uns | am Rand des Hörbaren | **das, was man lernen kann** |

Ein Mittelwert aus beidem beschreibt keinen der beiden Rufe. Deshalb hängt
die Hörbarkeit jetzt am **Signal**, nicht an der Art — und in der
Regionsliste zählt das **Maximum**, nicht das Mittel.

Belegt gefunden:

- **Buchfink** — die Lehrbuchart schlechthin: An ihr hat Marler den
  Unterschied überhaupt erst beschrieben (Nature 1955, ausführlich *Ibis*
  98, 1956). Sein „pink" ist ein kurzer, klarer Ruf aus etwa drei
  gleichzeitigen, steil ansteigenden Tönen, beharrlich wiederholt und gut
  zu orten. Sein „siiih" ist das genaue Gegenteil.
- **Kohlmeise** — das Zetern ist breitbandig und dicht; ein Ruf dauert
  grob eine halbe Sekunde und enthält sechs bis sieben Elemente. Und er
  sagt mit, **wer** da sitzt: gegenüber dem Sperber messbar länger
  (0,53 s) und elementreicher als gegenüber dem Waldkauz (0,42 s)
  — *Scientific Reports* 9 (2019). Das verbindet die Meise direkt mit dem
  neu aufgenommenen Sperber.
- **Zilpzalp** — hat **gar keinen** eigenen Alarmruf. Sein „huit" ist
  ganzjährig Kontaktruf; Erregung zeigt sich nur an schnellerem Vortrag,
  bei Störung an einem schärferen „fiet" (Cramp, BWP). Damit lehrt er
  etwas, das sonst keine unserer Arten so klar zeigt: **Alarm kann im
  Tempo stecken statt im Klang.** Dafür gibt es jetzt eine eigene
  Signalbauform.
- **Star** — belegt ist nur, *ob* er ruft, nicht wie laut: Im hohen Gras,
  wo er wenig sieht, ruft er deutlich häufiger als auf kurz gefressenem
  Gras, wo er stumm und steil abfliegt (Devereux et al., *Ibis* 150
  Suppl. 1, 2008: 191–198). Rufen kostet den Rufer also etwas. Die
  Hörbarkeitszahl bleibt leer.

Was das für die Praxis heißt: **Wer draußen Alarm lesen will, lernt
Hassrufe.** Die Luftalarme sind so gebaut, dass sie sich der Ortung
entziehen — dass wir bei 131 Phrasen keinen einzigen Siih gefunden haben,
passt ins Bild und ist womöglich weniger ein Messfehler als erwartet.

## Standortbezogene Artenlisten

`data/region_bauen.py` stellt für einen Ort eine Liste zusammen — als
nachrechenbares Regelwerk, nicht als Sprachmodell-Aufruf, damit jede
Region gleich hergeleitet wird.

- **Häufigkeit** aus GBIF (ohne Schlüssel, Umkreis oder Land)
- **Alarmnutzen** aus Leitart, Auffälligkeit und Auslöser-Rolle

Dieselbe Region, zwei Lernziele:

```
Vogelsprache            Artenkunde
1 Rabenkrähe            1 Ringeltaube
2 Elster                2 Kohlmeise
3 Amsel                 3 Amsel
9 Kolkrabe (3.054)      9 Buchfink (11.483)
```

Der Kolkrabe kommt bei „Vogelsprache" trotz geringer Beobachtungszahl mit —
genau der Fall, den reine Häufigkeit verfehlt.

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

### 2026-07-31 — Bilder aus Commons, Quiz, Lernfortschritt
Bilder aus den Commons-Kategorien statt nur aus dem Artikel: 246 statt 78,
mit Nestern und Jungvögeln als eigenen Gruppen (Idee von Matthias — Nester
sind Lernstoff, gehören nur nicht unter „so sieht der Vogel aus"). Der
Durchbruch war, dass Commons seine Unterkategorien nach Motiv **benennt**;
damit entfällt das Raten an Dateinamen.

Quiz mit drei Schwierigkeitsgraden (Matthias' Vorschlag statt getrennter
Modi), Lernfortschritt mit abgestufter Wiederholung. Verwechslungen werden
paarweise gemerkt und kommen bevorzugt wieder gegeneinander.

### 2026-07-31 — Veröffentlicht
Bilder von 82 auf 21 MB verkleinert (103 verwaiste Dateien aus früheren
Verfahren entfernt, Rest auf 720 px). Kompletter Export: 32 MB.

PWA-Teile ergänzt, die Expo nicht liefert: Manifest, Service Worker
(Gerüst network-first, Medien cache-first), relative Pfade, Symbole.
GitHub Actions baut bei jedem Push und veröffentlicht.

Vor der Veröffentlichung geprüft: kein API-Schlüssel im Repo oder im
Verlauf, `__pycache__` aus der Versionsverwaltung entfernt.

### 2026-08-01 — Veröffentlichung, Offline, Vogelsprache

**Veröffentlicht** auf https://matthias-kroker.github.io/vogelstimmen/ —
öffentlich, weil GitHub Pages auf dem freien Plan nur aus öffentlichen
Repos baut (privates Repo erst mit Pro, und selbst dann bliebe die Seite
öffentlich). Vor dem Push geprüft: kein API-Schlüssel im Repo oder Verlauf.

**Zwei echte Fehler behoben:**
- `baseUrl` fehlte. Expo schrieb absolute Pfade `/assets/...` ins Bundle,
  die unter `/vogelstimmen/` ins Leere zeigten — Bilder schwarz, Rufe
  stumm. Nachgewiesen mit HTTP 404 vorher, 200 nachher.
- Der Tonspieler bekam bei jedem Ruf eine neue Quelle und verwarf den
  alten mitten im Laden (`AbortError`). Jetzt einmal anlegen und
  `player.replace()`.

**Eine falsche Annahme korrigiert.** Ich wollte die Medien „aus dem Bundle
auslagern". Nachgemessen: das JS-Bundle ist **808 KB**, die Medien liegen
längst als 246 + 191 **einzelne Dateien** daneben und werden erst beim
Anzeigen geholt. Der Umbau war überflüssig und wurde gestrichen.

**Der echte Engpass** ist der Cache auf dem Gerät: iOS Safari erlaubt einer
PWA rund **50 MB** und räumt nach etwa einer Woche Nichtnutzung auf,
Android bis 60 % des freien Speichers. Deshalb **eine** Fassung nach der
strengeren Grenze und ein Offline-Paket mit 40-MB-Budget (gemessen: 1,57 MB
je Art bei vollem Umfang, also bis 77 Arten bei knappem Umfang).

**Vogelsprache eingeführt** — siehe eigener Abschnitt oben. Dabei fiel auf,
dass ich beinahe mich selbst als Quelle zitiert hätte.

### Checkpoint 2026-08-01 — gezielte Belegsuche

Vier Arten gesucht, vier belegt: **Buchfink** und **Kohlmeise** über
Marler (1955/1956) und *Scientific Reports* 9 (2019), **Zilpzalp** über
Cramp/BWP, **Star** über Devereux et al. (2008). Beim Star nur teilweise —
das Rufverhalten ist belegt, die Lautstärke nicht, und die Zahl bleibt
deshalb leer.

**Der eigentliche Ertrag war kein Wert, sondern ein Strukturfehler.** Eine
einzige „Auffälligkeit" je Art mittelt genau die Unterscheidung weg, um die
es beim Alarm-Lernen geht (Luftalarm vs. Hassruf, siehe Abschnitt oben).
`daten/vogelsprache.ts` hat jetzt eine Signalliste je Art; die Hörbarkeit
ist optional, damit eine Lücke als Lücke sichtbar bleibt statt als Null.

**Sperber ist die 21. Art.** Dabei kam heraus, dass `region_bauen.py` im
Kopfkommentar versprach, Auslöser beim Ziel „Vogelsprache" mitzunehmen —
und es nicht tat. Sperber und Habicht stehen so weit unten, dass sie gar
nicht erst in die GBIF-Auswertung geraten. Jetzt werden sie ausdrücklich
nachgetragen und als solche gekennzeichnet, statt über Punkte
hereinzukommen.

**Ein Fehlgriff mit Datenverlust:** `bilder_commons.py` ohne Artnamen
gestartet (es hat kein `--help`, der Schalter wurde wegfiltert) — der
Gesamtlauf entfernte 582 Zeilen Nest- und Jungvogelbilder aus 18
Steckbriefen und meldete „Fertig". Über `git checkout` wiederhergestellt,
Sperber danach einzeln nachgeholt. Das Skript verlangt für den Gesamtlauf
jetzt `--alle`. Siehe den neuen Warnabschnitt ganz oben.

### Checkpoint 2026-08-02 — Amsel belegt, über einen Umweg

Die beiden Quellen, die ich hier als „die belastbarsten" geführt hatte,
waren die falschen. Messmer & Messmer 1956 ist eine **Ontogenese**-Studie
(Handaufzucht in schalldichten Räumen), Haarhaus' „Zeteraktivität" eine
Arbeit zur **Tagesrhythmik**. Beide hätten unsere Frage nie beantwortet,
egal wie oft man gegen die Bezahlschranke läuft.

Getragen hat stattdessen **Frankenberg (1981)**, *Z. Tierpsychol.* 55:
97–118 — drei Experimente mit Amseln vor einer Eule:

- Das Zetern **warnt Artgenossen** (und den Rufer selbst).
- Es enthält eine **Richtungsangabe** zum Feind — der Ruf sagt nicht nur
  „Gefahr", sondern „dort".
- Es **verstärkt sich, wenn der Feind sich bewegt**.

Das ist genau die Eigenschaft, die einen Hassruf im Feld brauchbar macht,
und sie ist hier für unsere wichtigste Art **experimentell** gezeigt statt
aus Marlers allgemeinem Bauprinzip abgeleitet. Dazu **Snow (1988)**,
*A Study of Blackbirds*, für die Ruftypen und die Haltung: offene Warte,
gestelzter Schwanz, hängende Flügel — die Amsel *will* geortet werden.

Nebenbefund mit Feldwert aus Haarhaus: Die Zeteraktivität beginnt je nach
Individuum **20 bis 50 Minuten vor Sonnenaufgang**. Das ist keine
Ruf-Eigenschaft, aber eine Hörzeit — steht jetzt im Merksatz der Amsel.

Ungeprüft bleibt **Randler (2022)**, *acta ethologica* 25: 101–106, wonach
Eichelhäher auf Amselzetern reagieren. Wäre der schönste Beleg dafür, dass
die Amsel Leitart ist — Volltext hinter Springer. In der App als ungeprüft
markiert, nicht als Beleg gezählt.

---

## Als Nächstes vorgemerkt

1. **Belege für die restlichen fünf Arten** — Rotkehlchen, Blaumeise,
   Elster, Kolkrabe, Eichelhäher. Für die Blaumeise dürfte am ehesten
   etwas zu finden sein (die Paridae sind gut untersucht); die drei
   Rabenvögel sind schwierig, weil ihr Repertoire nicht ins
   Fünf-Stimmen-Schema passt. **Lehre aus der Amsel: nicht nach der Art
   suchen, sondern nach dem Experiment** — „mobbing" plus Artname bringt
   mehr als „Alarmruf" plus Artname.
2. **Warum lieferte Commons keine Nest-Unterkategorien?** Ungeklärt, und
   solange das offen ist, ist `--alle` nicht sicher.
3. **Artenzahl erweitern**, sobald die Alarm-Bewertung steht. Das
   Offline-Budget trägt bei knappem Umfang bis zu 77 Arten.
4. **Regionsauswahl in die App** — bisher nur als Skript.
5. **90 unsichere Phrasen** warten weiter auf ein Urteil per Gehör.
