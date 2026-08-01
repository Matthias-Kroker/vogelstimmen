/**
 * Vogelsprache: die Fuenf Stimmen und die Alarm-Leitarten.
 *
 * HERKUNFT -- WICHTIG:
 * Das Tracking-Dokument, aus dem das hier stammt, wurde groesstenteils von
 * Claude selbst verfasst (frueher, auf dem Handy). Es ist also KEINE
 * unabhaengige Quelle. Was daraus belegt ist und was blosse Einschaetzung,
 * steht bei jedem Eintrag dabei:
 *
 *   BELEGT    Jon Youngs Fuenf Stimmen (Bird Language, Schueler von Tom
 *             Brown); das Fluegelklatschen der Tauben (science.org,
 *             PMC2821341); das Krähen-Repertoire (Kevin McGowan, Cornell);
 *             die Sperlingsrufe (birdsoftheworld.org)
 *   SCHAETZUNG Welche Arten "Leitarten" sind und die Auffaelligkeit 1-5.
 *             Das ist Claudes Einordnung, nicht aus der Literatur belegt.
 *             Entsprechend behandeln: brauchbar als Vorschlag, nicht als
 *             Tatsache.
 *
 * Der Rahmen selbst unterscheidet sich von den xeno-canto-Etiketten
 * grundlegend:
 *
 * Vier der fuenf Stimmen sind BASELINE, also Normalzustand. Nur die
 * fuenfte bedeutet Gefahr. Wer das nicht trennt, haelt jeden Revierstreit
 * fuer einen Alarm -- ein Fehler, den das Dokument ausdruecklich benennt
 * und der uns bei einer Amsel-Aufnahme auch tatsaechlich unterlaufen ist
 * (XC123588: zwei Maennchen im Streit, von xeno-canto als "alarm call"
 * gefuehrt).
 */

export type Stimme =
  | "gesang" | "begleitruf" | "territorial" | "bettelruf" | "alarm";

export type StimmeInfo = {
  titel: string;
  baseline: boolean;
  beschreibung: string;
  /** Woran man sie erkennt bzw. wovor man sich hüten muss. */
  hinweis?: string;
};

export const FUENF_STIMMEN: Record<Stimme, StimmeInfo> = {
  gesang: {
    titel: "Gesang",
    baseline: true,
    beschreibung:
      "Reiner Ruhezustand. Wird auch zur Reviermarkierung genutzt, aber "
      + "ohne akute Bedrohung.",
  },
  begleitruf: {
    titel: "Begleitrufe",
    baseline: true,
    beschreibung:
      "Das „Gespräch“ eines Paares, das beim Fressen Kontakt hält.",
    hinweis:
      "Antwortet der Partner nicht, wird der Ruf zunehmend hektischer — "
      + "das kann wie beginnender Alarm klingen.",
  },
  territorial: {
    titel: "Territorial- und Aggressionsrufe",
    baseline: true,
    beschreibung:
      "Streit zweier Vögel derselben Art um Reviergrenzen, oft im Frühjahr.",
    hinweis:
      "Klingt oft wie ein Alarmruf, ist aber Baseline. Erkennbar daran, "
      + "dass andere Arten in der Nähe kaum reagieren.",
  },
  bettelruf: {
    titel: "Bettelrufe",
    baseline: true,
    beschreibung: "Jungvögel, die Eltern um Futter anbetteln.",
    hinweis:
      "Unerfahrene Jungvögel betteln manchmal sogar weiter, während ein "
      + "Fressfeind in der Nähe ist.",
  },
  alarm: {
    titel: "Alarm",
    baseline: false,
    beschreibung:
      "Die Notfall-Stimme. Signalisiert, dass sich etwas bewegt, das nicht "
      + "ins Bild passt — ein Mensch, eine Katze, ein Habicht.",
    hinweis:
      "Nur wer den Normalzustand eines Ortes kennt, bemerkt die Abweichung. "
      + "Genau dafür ist der Sit Spot da.",
  },
};

export type Alarmprofil = {
  /** Als Alarm-Leitart eingeordnet. ACHTUNG: Einschätzung, nicht belegt. */
  leitart: boolean;
  art: "vokal" | "mechanisch" | "beides";
  /** 1 = kaum wahrnehmbar, 5 = unüberhörbar.
   *  SCHAETZUNG -- nirgends gemessen oder belegt. */
  auffaelligkeit: 1 | 2 | 3 | 4 | 5;
  /** Wo das Signal besonders trägt. */
  besonders_in?: string;
  hinweis: string;
  /** Woher der Hinweis stammt. */
  beleg: "literatur" | "einschaetzung";
};

/**
 * Nur belegte Eintraege. Arten ohne Eintrag bekommen bewusst KEINE
 * geschaetzte Auffaelligkeit -- lieber eine Luecke als eine erfundene Zahl.
 */
export const ALARMPROFILE: Record<string, Alarmprofil> = {
  turdus_merula: {
    leitart: true, art: "vokal", auffaelligkeit: 5, beleg: "einschaetzung",
    hinweis:
      "Extrem lauter, unverkennbarer Alarmruf — als Einstiegsart für die "
      + "Alarm-Praxis eingeordnet.",
  },
  erithacus_rubecula: {
    leitart: true, art: "vokal", auffaelligkeit: 4, beleg: "einschaetzung",
    hinweis: "Als Einstiegsart für die Alarm-Praxis eingeordnet.",
  },
  cyanistes_caeruleus: {
    leitart: true, art: "vokal", auffaelligkeit: 4, beleg: "einschaetzung",
    hinweis: "Als Einstiegsart für die Alarm-Praxis eingeordnet.",
  },
  pica_pica: {
    leitart: true, art: "vokal", auffaelligkeit: 5, beleg: "einschaetzung",
    hinweis:
      "Einstiegsart. Rabenvogel — hält sich laut Young nicht ans "
      + "Fünf-Stimmen-Schema, sondern hat eine eigene, komplexere "
      + "Kommunikation.",
  },
  passer_domesticus: {
    leitart: true, art: "vokal", auffaelligkeit: 4, beleg: "literatur",
    besonders_in: "Siedlung",
    hinweis:
      "Der kollektive Alarmausbruch der Gruppe ist eines der am leichtesten "
      + "wahrnehmbaren Signale überhaupt: alle reagieren synchron und laut. "
      + "Flügelzucken zeigt Erregung oft schon vor dem Ruf.",
  },
  corvus_corone: {
    leitart: true, art: "vokal", auffaelligkeit: 5, beleg: "literatur",
    hinweis:
      "Verlässlichste und am weitesten hörbare Alarmquelle im Feld — der "
      + "Standardruf trägt 0,5 bis 1 km. Über 20 Ruftypen katalogisiert; "
      + "der Alarm-Caw wird lauter und schneller, je größer die Gefahr.",
  },
  corvus_corax: {
    leitart: false, art: "vokal", auffaelligkeit: 4, beleg: "einschaetzung",
    hinweis:
      "Wie die Rabenkrähe ein Corvus mit komplexem Repertoire; beide sind "
      + "akustisch schwer auseinanderzuhalten, auch für erfahrene Birder.",
  },
  columba_palumbus: {
    leitart: false, art: "mechanisch", auffaelligkeit: 3, beleg: "literatur",
    besonders_in: "Offenland",
    hinweis:
      "Kein vokaler Alarmruf. Beim erschreckten Auffliegen erzeugen die "
      + "Flügel ein lauteres, schnelleres Klatschen als beim gemächlichen "
      + "Abflug — ein rein mechanisches Signal, auf das andere Tauben sofort "
      + "mit aufliegen. Im Offenland gut wahrnehmbar, im dichten Wald weniger.",
  },
  garrulus_glandarius: {
    leitart: false, art: "vokal", auffaelligkeit: 5, beleg: "einschaetzung",
    besonders_in: "Wald",
    hinweis:
      "Rabenvogel mit eigener Kommunikation; sein Geschrei trägt weit und "
      + "gilt als klassischer Wächter des Waldes.",
  },
};

/** Arten, die als Auslöser wirken — abgeleitet aus den Fressfeind-Daten. */
export const AUSLOESER_HINWEIS =
  "Diese Art löst bei anderen Alarm aus. Beim Tracking ist sie damit nicht "
  + "das, was man hört, sondern der Grund, warum man etwas hört.";

export const QUELLE =
  "Fünf Stimmen nach Jon Young (Bird Language). Flügelklatschen der Tauben, "
  + "Krähen-Repertoire und Sperlingsrufe sind belegt. Die Einordnung als "
  + "Leitart und die Auffälligkeit 1–5 sind Einschätzungen, keine "
  + "Messwerte — im Feld zu prüfen.";
