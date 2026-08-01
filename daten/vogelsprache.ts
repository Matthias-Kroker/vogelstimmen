/**
 * Vogelsprache: die Fuenf Stimmen und die Alarmsignale der Arten.
 *
 * HERKUNFT -- WICHTIG:
 * Das Tracking-Dokument, aus dem der erste Entwurf stammte, wurde
 * groesstenteils von Claude selbst verfasst (frueher, auf dem Handy). Es ist
 * KEINE unabhaengige Quelle. Deshalb traegt jedes Signal hier einen
 * ausdruecklichen Beleg-Vermerk, und wo es keinen gibt, steht die Luecke
 * offen da -- lieber eine Luecke als eine erfundene Zahl.
 *
 * WARUM DIE STRUKTUR SICH GEAENDERT HAT (2026-08):
 * Der erste Entwurf gab jeder Art EINE "Auffaelligkeit 1-5". Das ist
 * nachweislich falsch konstruiert. Marler (1955) hat gerade gezeigt, dass
 * viele Arten ZWEI Alarmrufe mit GEGENSAETZLICHEM Bau haben:
 *
 *   Luftalarm ("seeet")  hoher Dauerton um 6-9 kHz, schmalbandig, weich
 *                        ein- und ausgeblendet. ABSICHTLICH schwer zu orten
 *                        -- der Habicht soll den Rufer nicht finden.
 *                        Fuer uns heisst das: kaum wahrnehmbar.
 *
 *   Hassruf (mobbing)    abrupt, tiefer, breitbandig, mit vielen
 *                        Ortungshinweisen. SOLL geortet werden, damit
 *                        andere zusammenkommen und den Feind bedraengen.
 *                        Fuer uns: das, was man realistisch lernen kann.
 *
 * Eine einzige Zahl je Art mittelt genau die Unterscheidung weg, um die es
 * beim Lernen geht. Deshalb haengt die Auffaelligkeit jetzt am Signal, nicht
 * an der Art.
 *
 * Der Rahmen selbst unterscheidet sich von den xeno-canto-Etiketten
 * grundlegend: Vier der fuenf Stimmen sind BASELINE, also Normalzustand.
 * Nur die fuenfte bedeutet Gefahr. Wer das nicht trennt, haelt jeden
 * Revierstreit fuer einen Alarm -- ein Fehler, der uns bei einer
 * Amsel-Aufnahme tatsaechlich unterlaufen ist (XC123588: zwei Maennchen im
 * Streit, von xeno-canto als "alarm call" gefuehrt).
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

/**
 * Die Bauform eines Alarmsignals. Bestimmt, ob man es im Feld überhaupt
 * bemerken kann.
 */
export type Signalbau =
  /** Hoher schmalbandiger Dauerton, absichtlich schwer zu orten. */
  | "luftalarm"
  /** Abrupt, breitbandig, gut zu orten — ruft andere herbei. */
  | "hassruf"
  /** Kein Ruf: Flügelschlag, Trommeln, Schnabelklappern. */
  | "mechanisch"
  /** Der normale Kontaktruf, nur schneller oder schärfer vorgetragen. */
  | "tempo";

export const SIGNALBAU_INFO: Record<Signalbau, { titel: string; erklaerung: string }> = {
  luftalarm: {
    titel: "Luftalarm",
    erklaerung:
      "Hoher, dünner Dauerton um 6–9 kHz mit weichem Ein- und Ausblenden. "
      + "Nach Marler (1955) so gebaut, dass ein Greifvogel den Rufer nicht "
      + "orten kann — was bedeutet, dass auch du ihn kaum orten wirst. "
      + "Gilt einem fliegenden Angreifer; die Reaktion ist Deckung suchen, "
      + "nicht hinschauen.",
  },
  hassruf: {
    titel: "Hassruf",
    erklaerung:
      "Abrupt einsetzend, tiefer, breitbandig, meist in schneller Folge "
      + "wiederholt. Absichtlich leicht zu orten: andere Vögel sollen "
      + "zusammenkommen. Gilt einem sitzenden oder am Boden laufenden Feind. "
      + "Das ist das Signal, das man im Feld tatsächlich lesen lernen kann.",
  },
  mechanisch: {
    titel: "Mechanisches Signal",
    erklaerung:
      "Kein Ruf, sondern ein Geräusch aus Bewegung — etwa Flügelklatschen "
      + "beim erschreckten Auffliegen. Funktioniert auch dort, wo der Vogel "
      + "selbst nicht zu sehen ist.",
  },
  tempo: {
    titel: "Beschleunigter Kontaktruf",
    erklaerung:
      "Manche Arten haben gar keinen eigenen Alarmruf. Sie tragen ihren "
      + "gewohnten Ruf nur schneller und schärfer vor. Nicht der Klang "
      + "verrät die Erregung, sondern der Rhythmus — deutlich schwerer zu "
      + "bemerken, weil man den Normalzustand kennen muss.",
  },
};

export type Beleg = "literatur" | "einschaetzung";

export type Alarmsignal = {
  bau: Signalbau;
  /** Wie man es nennt, wenn man es hört. */
  name: string;
  /**
   * 1 = kaum wahrnehmbar, 5 = unüberhörbar. Bewusst OPTIONAL:
   * fehlt der Beleg, bleibt das Feld leer statt geraten zu werden.
   */
  auffaelligkeit?: 1 | 2 | 3 | 4 | 5;
  beschreibung: string;
  beleg: Beleg;
  /** Kurzzitat, nur bei beleg === "literatur". */
  quelle?: string;
};

export type Alarmprofil = {
  /**
   * Als Alarm-Leitart eingeordnet — eine Art, an der man sich beim
   * Mithören zuerst orientiert. ACHTUNG: durchweg Einschätzung.
   */
  leitart: boolean;
  /** Wo die Signale dieser Art besonders tragen. */
  besonders_in?: string;
  signale: Alarmsignal[];
  /** Was diese Art fürs Lernen besonders macht. */
  merksatz?: string;
};

/**
 * Nur was belegt oder ausdruecklich als Einschaetzung markiert ist.
 * Arten ohne Eintrag bekommen bewusst KEINE geratene Zahl.
 */
export const ALARMPROFILE: Record<string, Alarmprofil> = {
  // ---- belegte Profile ----------------------------------------------

  fringilla_coelebs: {
    leitart: false,
    merksatz:
      "Die Lehrbuchart. An ihr wurde der Unterschied zwischen Luftalarm "
      + "und Hassruf überhaupt erst beschrieben — beide kommen bei ihr vor "
      + "und könnten unterschiedlicher nicht klingen.",
    signale: [
      {
        bau: "hassruf",
        name: "„pink“ / „chink“",
        auffaelligkeit: 4,
        beleg: "literatur",
        beschreibung:
          "Kurzer, klarer Ruf aus etwa drei gleichzeitigen, steil "
          + "ansteigenden Tönen, von denen der tiefste als kurzer, "
          + "gleichbleibender Ton weiterläuft. Wird beharrlich wiederholt "
          + "und ist gut zu orten — der Ruf, an dem man den erregten "
          + "Buchfink erkennt.",
        quelle: "Marler, Ibis 98 (1956): The voice of the Chaffinch and its function as a language",
      },
      {
        bau: "luftalarm",
        name: "„siiih“ / seeet",
        auffaelligkeit: 1,
        beleg: "literatur",
        beschreibung:
          "Gleichbleibender hoher Ton um 6–9 kHz, schmalbandig, weich ein- "
          + "und ausgeblendet. Marler beschrieb ihn 1955 als Bauform, die "
          + "den Rufer vor dem Habicht verbirgt — entsprechend schwer ist "
          + "er auch für uns zu bemerken und fast unmöglich zu orten.",
        quelle: "Marler, Nature 176 (1955): 6–8, Characteristics of some animal calls",
      },
    ],
  },

  parus_major: {
    leitart: true,
    besonders_in: "Siedlung und Wald",
    merksatz:
      "Der Hassruf verrät sogar, WER da sitzt: gegenüber dem Sperber ruft "
      + "die Kohlmeise länger und mit mehr Elementen als gegenüber dem "
      + "Waldkauz.",
    signale: [
      {
        bau: "hassruf",
        name: "Zetern / „Tsi-tsi-tsi-därrr“",
        auffaelligkeit: 5,
        beleg: "literatur",
        beschreibung:
          "Schnelle Folge rauer Elemente über ein sehr breites "
          + "Frequenzband. Ein Ruf dauert grob eine halbe Sekunde und "
          + "enthält im Mittel sechs bis sieben Elemente in dichter Folge. "
          + "Gegenüber dem Sperber messbar länger und elementreicher als "
          + "gegenüber dem Waldkauz — die Meise sagt also mit, wie ernst "
          + "die Lage ist.",
        quelle: "Subtle variations in mobbing calls are predator-specific in great tits, Scientific Reports 9 (2019)",
      },
      {
        bau: "luftalarm",
        name: "„siiih“",
        auffaelligkeit: 1,
        beleg: "literatur",
        beschreibung:
          "Gehört zur selben konvergenten Bauform wie beim Buchfink: hoher "
          + "schmalbandiger Ton, gegen einen im Flug angreifenden Greifvogel. "
          + "Für uns am Rand des Hörbaren.",
        quelle: "Marler, Nature 176 (1955): 6–8",
      },
    ],
  },

  phylloscopus_collybita: {
    leitart: false,
    merksatz:
      "Lehrt etwas, das keine andere unserer Arten so klar zeigt: Alarm "
      + "steckt nicht immer im Klang, sondern manchmal nur im Tempo.",
    signale: [
      {
        bau: "tempo",
        name: "beschleunigtes „huit“",
        auffaelligkeit: 2,
        beleg: "literatur",
        beschreibung:
          "Der Zilpzalp hat keinen eigenen Alarmruf im engeren Sinn. Sein "
          + "aufwärts gezogenes „huit“ ist ganzjährig Kontaktruf; ein "
          + "schnellerer Vortrag zeigt Erregung an. Bei Störung kommt ein "
          + "schärferes, lauteres „fiet“ von beiden Geschlechtern, das sich "
          + "im Herbst auf Nachbarvögel überträgt.",
        quelle: "Cramp (Hrsg.), Birds of the Western Palearctic, zitiert nach deanar.org.uk",
      },
    ],
  },

  sturnus_vulgaris: {
    leitart: false,
    besonders_in: "Offenland mit hoher Vegetation",
    merksatz:
      "Ob der Star überhaupt ruft, hängt davon ab, ob er etwas sieht. Auf "
      + "kurzem Gras flieht er stumm und steil, im hohen Gras ruft er.",
    signale: [
      {
        bau: "hassruf",
        name: "Alarmruf im Trupp",
        beleg: "literatur",
        beschreibung:
          "Stare rufen bei eingeschränkter Sicht — in hohem Gras — deutlich "
          + "häufiger als auf kurz gefressenem Gras, wo sie stattdessen steil "
          + "und ohne Ruf abfliegen. Rufen kostet den Rufer also etwas. Wie "
          + "auffällig der Ruf selbst ist, haben wir nicht belegt gefunden — "
          + "die Zahl fehlt deshalb bewusst.",
        quelle: "Devereux et al., Ibis 150 Suppl. 1 (2008): 191–198, Habitat affects escape behaviour and alarm calling in Common Starlings",
      },
    ],
  },

  passer_domesticus: {
    leitart: true,
    besonders_in: "Siedlung",
    signale: [
      {
        bau: "hassruf",
        name: "kollektiver Alarmausbruch",
        auffaelligkeit: 4,
        beleg: "literatur",
        beschreibung:
          "Pulsierend, rau und kratzig statt melodisch, mehrere gleiche "
          + "Elemente in schneller Folge. Der Ausbruch der ganzen Gruppe ist "
          + "eines der am leichtesten wahrnehmbaren Signale überhaupt: alle "
          + "reagieren gleichzeitig und laut. Flügelzucken zeigt die Erregung "
          + "oft schon vor dem Ruf.",
        quelle: "birdsoftheworld.org, House Sparrow, Sounds and Vocal Behavior",
      },
    ],
  },

  corvus_corone: {
    leitart: true,
    merksatz:
      "Die verlässlichste Alarmquelle im Feld — weil sie am weitesten trägt.",
    signale: [
      {
        bau: "hassruf",
        name: "Alarm-Krähen",
        auffaelligkeit: 5,
        beleg: "literatur",
        beschreibung:
          "Der Standardruf trägt 0,5 bis 1 km weit. Über 20 Ruftypen sind "
          + "katalogisiert; der Alarmruf wird lauter und schneller, je größer "
          + "die Gefahr ist.",
        quelle: "Kevin McGowan, Cornell Lab of Ornithology, Crow FAQ",
      },
    ],
  },

  columba_palumbus: {
    leitart: false,
    besonders_in: "Offenland",
    merksatz:
      "Zeigt, dass Alarm nicht immer ein Ruf sein muss.",
    signale: [
      {
        bau: "mechanisch",
        name: "Flügelklatschen beim Auffliegen",
        auffaelligkeit: 3,
        beleg: "literatur",
        beschreibung:
          "Kein vokaler Alarmruf. Beim erschreckten Auffliegen erzeugen die "
          + "Flügel ein lauteres und schnelleres Klatschen als beim "
          + "gemächlichen Abflug — ein rein mechanisches Signal, auf das "
          + "andere Tauben sofort mit Auffliegen reagieren. Im Offenland gut "
          + "wahrnehmbar, im dichten Wald weniger.",
        quelle: "Hingee & Magrath, Proc. R. Soc. B (2009) / PMC2821341",
      },
    ],
  },

  // ---- Einschaetzungen, nicht belegt ---------------------------------

  turdus_merula: {
    leitart: true,
    signale: [
      {
        bau: "hassruf",
        name: "Tixen / Zetern",
        auffaelligkeit: 5,
        beleg: "einschaetzung",
        beschreibung:
          "Sehr lauter, unverkennbarer Alarmruf — als Einstiegsart für die "
          + "Alarm-Praxis eingeordnet.",
      },
    ],
  },

  erithacus_rubecula: {
    leitart: true,
    signale: [
      {
        bau: "hassruf",
        name: "„tick-tick-tick“",
        auffaelligkeit: 4,
        beleg: "einschaetzung",
        beschreibung: "Als Einstiegsart für die Alarm-Praxis eingeordnet.",
      },
    ],
  },

  cyanistes_caeruleus: {
    leitart: true,
    signale: [
      {
        bau: "hassruf",
        name: "Zetern",
        auffaelligkeit: 4,
        beleg: "einschaetzung",
        beschreibung:
          "Als Einstiegsart eingeordnet. Vermutlich wie bei der Kohlmeise "
          + "ein breitbandiger Hassruf plus hoher Luftalarm — für die "
          + "Blaumeise haben wir das aber nicht belegt.",
      },
    ],
  },

  pica_pica: {
    leitart: true,
    signale: [
      {
        bau: "hassruf",
        name: "Schackern",
        auffaelligkeit: 5,
        beleg: "einschaetzung",
        beschreibung:
          "Einstiegsart. Rabenvogel — hält sich laut Young nicht ans "
          + "Fünf-Stimmen-Schema, sondern hat eine eigene, komplexere "
          + "Kommunikation.",
      },
    ],
  },

  corvus_corax: {
    leitart: false,
    signale: [
      {
        bau: "hassruf",
        name: "Rufreihen",
        auffaelligkeit: 4,
        beleg: "einschaetzung",
        beschreibung:
          "Wie die Rabenkrähe ein Corvus mit komplexem Repertoire; beide "
          + "sind akustisch schwer auseinanderzuhalten, auch für erfahrene "
          + "Beobachter.",
      },
    ],
  },

  garrulus_glandarius: {
    leitart: false,
    besonders_in: "Wald",
    signale: [
      {
        bau: "hassruf",
        name: "Rätschen",
        auffaelligkeit: 5,
        beleg: "einschaetzung",
        beschreibung:
          "Rabenvogel mit eigener Kommunikation; sein Geschrei trägt weit "
          + "und gilt als klassischer Wächter des Waldes.",
      },
    ],
  },
};

/** Höchste belegte oder geschätzte Auffälligkeit einer Art, für Ranglisten. */
export function auffaelligkeitMax(profil: Alarmprofil | undefined): number {
  if (!profil) return 0;
  return profil.signale.reduce(
    (m, s) => Math.max(m, s.auffaelligkeit ?? 0), 0);
}

/** Hat die Art mindestens ein belegtes Signal? */
export function istBelegt(profil: Alarmprofil | undefined): boolean {
  return !!profil?.signale.some((s) => s.beleg === "literatur");
}

/** Arten, die als Auslöser wirken — abgeleitet aus den Fressfeind-Daten. */
export const AUSLOESER_HINWEIS =
  "Diese Art löst bei anderen Alarm aus. Beim Tracking ist sie damit nicht "
  + "das, was man hört, sondern der Grund, warum man etwas hört.";

export const QUELLEN = [
  "Young, Jon: What the Robin Knows / Bird Language — die Fünf Stimmen.",
  "Marler, P. (1955): Characteristics of some animal calls. Nature 176: 6–8.",
  "Marler, P. (1956): The voice of the Chaffinch and its function as a "
  + "language. Ibis 98.",
  "Subtle variations in mobbing calls are predator-specific in great tits "
  + "(Parus major). Scientific Reports 9 (2019).",
  "Devereux, C. et al. (2008): Habitat affects escape behaviour and alarm "
  + "calling in Common Starlings. Ibis 150 (Suppl. 1): 191–198.",
  "Hingee, M. & Magrath, R. (2009): Flights of fear — a mechanical wing "
  + "whistle sounds the alarm in a flocking bird. Proc. R. Soc. B.",
  "Cramp, S. (Hrsg.): Handbook of the Birds of the Western Palearctic — "
  + "Zilpzalp-Rufe.",
  "McGowan, K., Cornell Lab of Ornithology: Crow FAQ — Ruftypen und "
  + "Reichweite.",
  "birdsoftheworld.org: House Sparrow, Sounds and Vocal Behavior.",
];

export const QUELLE =
  "Fünf Stimmen nach Jon Young. Die Signalbauformen folgen Marler (1955): "
  + "Luftalarm ist absichtlich schwer zu orten, der Hassruf absichtlich "
  + "leicht. Wo „Einschätzung“ steht, ist der Eintrag nicht belegt — im "
  + "Feld zu prüfen.";
