# Vogelstimmen

Eine kleine Lern-App für 20 heimische Vogelarten: Rufe hören, Bilder
ansehen, im Quiz abfragen lassen. Privates Lernprojekt, keine
Gewinnabsicht.

**→ [matthias-kroker.github.io/vogelstimmen](https://matthias-kroker.github.io/vogelstimmen/)**

Auf dem Handy über „Zum Startbildschirm hinzufügen" installierbar. Danach
läuft sie offline — praktisch, weil man Vögel meist dort hört, wo der
Empfang schlecht ist.

## Was drin ist

- **20 Arten** — Amsel, Meisen, Rabenvögel, Greifvögel und weitere
- **191 Rufe** aus xeno-canto, nach Gesang / Rufe / Trommeln sortiert
- **246 Bilder**, aufgeteilt in *Der Vogel*, *Nest & Eier*, *Jungvögel*
- **Steckbriefe** mit Lebensraum, Nahrung, Zugverhalten und den
  Wikipedia-Abschnitten, allen voran **Stimme**
- **Fressfeinde** je Art, getrennt nach *Warnruf* (Greifvogel im Flug)
  und *Hassruf* (sitzender Feind) — die beiden Alarmtypen klingen
  unterschiedlich und werden von unterschiedlichen Feinden ausgelöst
- **Quiz** mit drei Schwierigkeitsgraden und abgestufter Wiederholung:
  was sitzt, kommt seltener; was verwechselt wurde, kommt bald wieder,
  und zwar gegen genau die verwechselte Art

## Quellen und Lizenzen

Alle Inhalte stammen aus offenen Quellen. Die App selbst ist
nicht-kommerziell — das ist keine Wahl, sondern Bedingung: die Aufnahmen
stehen fast durchweg unter *NonCommercial*.

| Was | Woher | Lizenz |
|---|---|---|
| Rufe | [xeno-canto.org](https://xeno-canto.org) | überwiegend CC BY-NC-SA, Aufnehmende je Ruf genannt |
| Bilder | [Wikimedia Commons](https://commons.wikimedia.org) | CC, Fotograf und Lizenz je Bild genannt |
| Texte | [Wikipedia (de)](https://de.wikipedia.org) | CC BY-SA |
| Taxonomie | [Wikidata](https://www.wikidata.org) | CC0 |
| Lebensraum, Zug, Größe | [AVONET](https://doi.org/10.1111/ele.13898) (Tobias et al. 2022) | offen |
| Nahrung, Nahrungsschicht | [EltonTraits 1.0](https://esapubs.org/archive/ecol/E095/178/) (Wilman et al. 2014) | offen |
| Fressfeinde | [GloBI](https://www.globalbioticinteractions.org/) | offen |

Aufnahmen unter *NoDerivatives* sind ausgeschlossen, weil die App
Ausschnitte verwendet und ein Ausschnitt eine Bearbeitung ist.

## Einschränkungen

Ehrlichkeitshalber, weil eine Lern-App sonst mehr Sicherheit vortäuscht,
als sie hat:

- Die **Ruftyp-Feinheiten** (Siih, Tixen, Zetern, Djück) sind noch nicht
  durchgängig zugeordnet. Die App unterscheidet deshalb nur Gesang,
  Rufe und Trommeln.
- Die xeno-canto-Etiketten `call` und `alarm call` **überlappen
  akustisch zu 77 %** — sie werden als Herkunftsangabe gezeigt, aber
  nicht als Lernkategorie verwendet.
- **AVONET und EltonTraits** sind grobe Kategorien für 11.000 Arten und
  können im Einzelfall danebenliegen. Nahrungsanteile unter 20 % werden
  deshalb verworfen.
- Die **Fressfeind-Listen** stammen aus GloBI und wurden gegen den
  jeweiligen Wikipedia-Artikel gegengeprüft; ungeprüfte Treffer sind
  ausgeschlossen.

## Selbst bauen

```
npm install
npx expo start --web          # Entwicklung
npx expo export --platform web --output-dir dist
python data/pwa_bauen.py      # Manifest, Service Worker, relative Pfade
```

Die Skripte unter `data/` holen und pflegen die Inhalte. Für xeno-canto
wird ein kostenloser API-Schlüssel benötigt
(`XENO_CANTO_API_KEY` als Umgebungsvariable).
