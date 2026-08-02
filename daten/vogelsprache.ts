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

  turdus_merula: {
    leitart: true,
    merksatz:
      "Ihr Zetern sagt nicht nur „Gefahr“, sondern auch, WO. Im Experiment "
      + "entnahmen Artgenossen dem Ruf die Richtung des Feindes. Beste "
      + "Hörzeit: die Zeteraktivität beginnt 20 bis 50 Minuten vor "
      + "Sonnenaufgang.",
    signale: [
      {
        bau: "hassruf",
        name: "Zetern / „tix-tix-tix“",
        auffaelligkeit: 5,
        beleg: "literatur",
        beschreibung:
          "Der am besten untersuchte Alarmruf unserer Arten. Drei Versuche "
          + "mit Amseln vor einer Eule zeigten: Der Ruf warnt Artgenossen "
          + "(und den Rufer selbst), er enthält eine Richtungsangabe zum "
          + "Feind, und er wird stärker, wenn sich der Feind bewegt. Die "
          + "Amsel ruft dabei von einer offenen Warte, mit gestelztem "
          + "Schwanz und hängenden Flügeln — sie will gesehen und geortet "
          + "werden. Anlässe: Eule, Turmfalke, Elster, Rabenkrähe; oft "
          + "gefolgt von Angriffen.",
        quelle: "Frankenberg, Z. Tierpsychol. 55 (1981): 97–118, Adaptive Significance of Avian Mobbing IV; Ruf und Haltung nach Snow, A Study of Blackbirds (1988)",
      },
      {
        bau: "luftalarm",
        name: "„siiih“",
        auffaelligkeit: 1,
        beleg: "literatur",
        beschreibung:
          "Dünner, abfallender Reinton gegen Sperber und überfliegende "
          + "Krähen, mit geöffnetem Schnabel und flach angelegtem Gefieder "
          + "vorgetragen. Gehört zu Marlers konvergenter Bauform — für uns "
          + "am Rand des Hörbaren und praktisch nicht zu orten.",
        quelle: "Marler, Nature 176 (1955): 6–8; Beschreibung nach Snow (1988)",
      },
      {
        bau: "hassruf",
        name: "„pook“ am Boden",
        auffaelligkeit: 3,
        beleg: "literatur",
        beschreibung:
          "Weicher, bellender Einzelruf gegen Bodenfeinde — Katze, Fuchs, "
          + "Mensch am Nest. Leiser als das Zetern und leicht zu überhören, "
          + "aber oft dessen Vorstufe.",
        quelle: "Snow, A Study of Blackbirds (1988), British Museum (Natural History)",
      },
    ],
  },

  cyanistes_caeruleus: {
    leitart: true,
    merksatz:
      "Überraschend: Von allen britischen Meisen verschlüsselt die "
      + "Blaumeise am meisten im Ruf — mehr als die Kohlmeise. Und ihr "
      + "Alarm hängt weniger daran, dass ein Sperber DA ist, als daran, "
      + "dass er sich BEWEGT.",
    signale: [
      {
        bau: "hassruf",
        name: "Zetern",
        auffaelligkeit: 4,
        beleg: "literatur",
        beschreibung:
          "Im Vergleich von sechs britischen Meisenarten nutzte die "
          + "Blaumeise alle vier untersuchten Wege, um die Gefährlichkeit "
          + "eines Feindes im Ruf zu unterscheiden — die Kohlmeise nur "
          + "einen. Ihr Ruf trägt also mehr Information, obwohl er leiser "
          + "ist. Ausgelöst wird er vor allem durch BEWEGUNG: ein bewegtes "
          + "Sperbermodell senkte die Nahrungsaufnahme und löste "
          + "Flügelzucken aus, während Sperberrufe allein kaum wirkten und "
          + "ein toter Artgenosse gar nicht.",
        quelle: "Carlson, Healy & Templeton, Animal Behaviour (2017); Carlson, Pargeter & Templeton, Behav. Ecol. Sociobiol. 71 (2017): 133",
      },
    ],
  },

  pica_pica: {
    leitart: true,
    merksatz:
      "Die Elster bricht unser Schema: Sie benutzt DENSELBEN Ruf für "
      + "Feindalarm und für Revierstreit. Am Ruftyp ist beides nicht zu "
      + "trennen — an der Länge schon.",
    signale: [
      {
        bau: "hassruf",
        name: "Schackern („chatter“)",
        auffaelligkeit: 5,
        beleg: "literatur",
        beschreibung:
          "Laute Triller aus deutlich abgesetzten Silben über ein breites "
          + "Frequenzband, 5 bis 14 Silben je Einheit. Wird sowohl gegen "
          + "Fuchs, Katze und Sperber eingesetzt als auch gegen "
          + "Artgenossen im Revierstreit — die Fünf-Stimmen-Trennung "
          + "zwischen Alarm und Territorialruf greift hier nicht. Was "
          + "stattdessen zählt, ist die Dauer: Auf lange Schackerreihen "
          + "antworteten Elstern nach 15,5 Sekunden, auf kurze erst nach "
          + "38,2. Länge signalisiert Dringlichkeit.",
        quelle: "Kuspiel et al., Animal Cognition (2025); vgl. Kuspiel et al., Ethology 130 (2024)",
      },
    ],
  },

  // ---- Einschaetzungen, nicht belegt ---------------------------------

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

  corvus_corax: {
    leitart: false,
    merksatz:
      "Über den Kolkraben ist viel bekannt — aber fast alles darüber, "
      + "was er HÖRT, nicht was er sendet. Er reagiert sogar auf "
      + "Alarmrufe fremder Rabenvögel, die er nie zuvor gehört hat.",
    signale: [
      {
        bau: "hassruf",
        name: "Rufreihen",
        auffaelligkeit: 4,
        beleg: "einschaetzung",
        beschreibung:
          "Wie die Rabenkrähe ein Corvus mit komplexem Repertoire; beide "
          + "sind akustisch schwer auseinanderzuhalten, auch für erfahrene "
          + "Beobachter. Wie auffällig sein eigener Alarm ist, haben wir "
          + "nicht belegt gefunden — die Rabenvogelforschung dreht sich um "
          + "Kognition und darum, wem sie zuhören (Nácarová et al., "
          + "Ethology 124, 2018; J. Ornithol. 161, 2020).",
      },
    ],
  },

  garrulus_glandarius: {
    leitart: false,
    besonders_in: "Wald",
    merksatz:
      "Der Häher ist nicht nur Sender, sondern auch Empfänger: Er reagiert "
      + "auf das Zetern der Amsel — untersucht, aber von uns nicht im "
      + "Volltext geprüft (Randler, acta ethologica 25, 2022: 101–106).",
    signale: [
      {
        bau: "hassruf",
        name: "Rätschen",
        auffaelligkeit: 5,
        beleg: "einschaetzung",
        beschreibung:
          "Rabenvogel mit eigener Kommunikation; sein Geschrei trägt weit "
          + "und gilt als klassischer Wächter des Waldes. Für seinen "
          + "EIGENEN Ruf haben wir keinen Beleg — belegt ist bisher nur, "
          + "dass er auf fremde Hassrufe hört.",
      },
    ],
  },
};

/**
 * Was NICHT an einer einzelnen Art hängt.
 *
 * Diese Sätze sind der eigentliche Ertrag der Belegsuche: Sie gelten über
 * Arten hinweg und erklären, warum die Einzeleintraege so aussehen, wie sie
 * aussehen. Bis 2026-08 hatten sie nirgends einen Platz -- FUENF_STIMMEN
 * war in App.tsx importiert und wurde nie angezeigt. Genau deshalb stehen
 * sie jetzt als eigene Datenstruktur hier und bekommen eine eigene Ansicht.
 */
export type Grundsatz = {
  titel: string;
  kurz: string;
  text: string;
  /** Was man im Feld damit anfängt. */
  praxis?: string;
  beleg: Beleg;
  quellen: string[];
};

export const GRUNDSAETZE: Grundsatz[] = [
  {
    titel: "Zwei Bauformen, entgegengesetzt gebaut",
    kurz: "Der eine Ruf will nicht geortet werden, der andere unbedingt.",
    text:
      "Alarmrufe zerfallen in zwei Gruppen mit gegensätzlicher Bauart. Der "
      + "Luftalarm ist ein hoher, schmalbandiger Dauerton um 6–9 kHz, der "
      + "weich ein- und ausblendet — so gebaut, dass ein Greifvogel den "
      + "Rufer nicht orten kann. Der Hassruf ist abrupt, tiefer und "
      + "breitbandig, mit vielen Ortungshinweisen, damit andere "
      + "zusammenkommen. Die Bauform folgt der Absicht.",
    praxis:
      "Wer draußen Alarm lesen lernen will, lernt Hassrufe. Luftalarme sind "
      + "konstruiert, um sich der Ortung zu entziehen — auch deiner.",
    beleg: "literatur",
    quellen: ["Marler, Nature 176 (1955): 6–8"],
  },
  {
    titel: "Arten verstehen einander",
    kurz: "Der Luftalarm klingt bei nicht verwandten Arten fast gleich.",
    text:
      "Buchfink, Meise und Amsel sind nicht näher verwandt, ihre "
      + "Luftalarme ähneln sich trotzdem. Vermutet wird konvergente "
      + "Entwicklung unter demselben Druck durch dieselben Greifvögel. "
      + "Die Folge: Arten können die Alarme anderer Arten nutzen. Häher "
      + "reagieren auf das Zetern der Amsel, Kolkraben sogar auf Rufe "
      + "fremder Rabenvögel, die sie nie gehört haben.",
    praxis:
      "Ein Alarm gilt selten nur einer Art. Wenn eine Art losgeht, lohnt "
      + "der Blick auf alle anderen in Hörweite.",
    beleg: "literatur",
    quellen: [
      "Marler, Nature 176 (1955): 6–8",
      "Randler, acta ethologica 25 (2022): 101–106 — Volltext ungeprüft",
      "Nácarová et al., J. Ornithol. 161 (2020)",
    ],
  },
  {
    titel: "Ein Hassruf sagt mehr als „Gefahr“",
    kurz: "Richtung, Art des Feindes, Dringlichkeit — alles steckt drin.",
    text:
      "Im Versuch entnahmen Amseln dem Zetern ihrer Artgenossen, WO der "
      + "Feind sitzt. Kohlmeisen zetern gegen den Sperber länger und mit "
      + "mehr Elementen als gegen den Waldkauz. Elstern antworten auf "
      + "lange Schackerreihen mehr als doppelt so schnell wie auf kurze. "
      + "Und die Blaumeise nutzt von allen untersuchten britischen Meisen "
      + "die meisten Wege, Bedrohung zu verschlüsseln — mehr als die "
      + "Kohlmeise.",
    praxis:
      "Länger und dichter heißt gefährlicher. Das ist die erste "
      + "Unterscheidung, die man ohne Artkenntnis hört.",
    beleg: "literatur",
    quellen: [
      "Frankenberg, Z. Tierpsychol. 55 (1981): 97–118",
      "Scientific Reports 9 (2019) — Kohlmeise",
      "Kuspiel et al., Animal Cognition (2025) — Elster",
      "Carlson, Healy & Templeton, Animal Behaviour (2017) — Meisen",
    ],
  },
  {
    titel: "Bewegung löst aus, nicht Anwesenheit",
    kurz: "Eine sitzende Katze erzeugt weniger Alarm als eine laufende.",
    text:
      "Zwei unabhängige Versuche, 36 Jahre auseinander und an "
      + "verschiedenen Arten: Bei der Amsel verstärkte sich das Zetern, "
      + "wenn sich die Eule bewegte. Bei der Blaumeise war ein bewegtes "
      + "Sperbermodell der mit Abstand stärkste Auslöser — Sperberrufe "
      + "allein wirkten kaum, ein toter Artgenosse gar nicht.",
    praxis:
      "Bleibt der Alarm aus, heißt das nicht, dass nichts da ist. Es "
      + "kann heißen, dass es sich nicht bewegt.",
    beleg: "literatur",
    quellen: [
      "Frankenberg, Z. Tierpsychol. 55 (1981): 97–118",
      "Carlson, Pargeter & Templeton, Behav. Ecol. Sociobiol. 71 (2017): 133",
    ],
  },
  {
    titel: "Rufen kostet etwas",
    kurz: "Wer sich sicher fühlt, flieht lieber stumm.",
    text:
      "Stare rufen im hohen Gras, wo sie wenig sehen, deutlich häufiger "
      + "als auf kurz gefressenem Gras — dort fliegen sie stumm und steil "
      + "ab. Ein Alarmruf verrät den Rufer und wird deshalb nicht "
      + "verschwendet.",
    beleg: "literatur",
    quellen: ["Devereux et al., Ibis 150 Suppl. 1 (2008): 191–198"],
  },
  {
    titel: "Vier von fünf Stimmen bedeuten gar nichts Schlimmes",
    kurz: "Nur die fünfte ist Alarm. Der Rest ist Normalzustand.",
    text:
      "Gesang, Begleitrufe, Territorialrufe und Bettelrufe gehören zur "
      + "Baseline — dem Normalzustand eines Ortes. Nur die fünfte Stimme "
      + "meldet Gefahr. Wer das nicht trennt, hält jeden Revierstreit für "
      + "einen Alarm. Genau das ist uns passiert: eine Aufnahme zweier "
      + "streitender Amselmännchen war bei xeno-canto als „alarm call“ "
      + "eingetragen.",
    praxis:
      "Erkennungsmerkmal für Baseline: andere Arten in der Nähe reagieren "
      + "kaum. Bei echtem Alarm reagieren sie mit.",
    beleg: "literatur",
    quellen: ["Jon Young, Bird Language / What the Robin Knows"],
  },
  {
    titel: "Das Schema hat Ausnahmen — und die sind belegt",
    kurz: "Bei der Elster ist Alarm und Revierstreit derselbe Ruf.",
    text:
      "Die Fünf Stimmen sind ein Raster, keine Naturkonstante. Die Elster "
      + "benutzt ihr Schackern gegen Fuchs und Katze ebenso wie gegen "
      + "Artgenossen im Revierstreit — am Ruftyp ist beides nicht zu "
      + "trennen. Der Zilpzalp wiederum hat gar keinen eigenen Alarmruf, "
      + "sondern trägt seinen Kontaktruf nur schneller vor. Und die "
      + "Ringeltaube ruft überhaupt nicht, sondern klatscht mit den "
      + "Flügeln.",
    praxis:
      "Nicht jede Art passt ins Raster. Wo sie nicht passt, steht es beim "
      + "Vogel dabei.",
    beleg: "literatur",
    quellen: [
      "Kuspiel et al., Animal Cognition (2025)",
      "Cramp (Hrsg.), Birds of the Western Palearctic",
      "Hingee & Magrath, Proc. R. Soc. B (2009)",
    ],
  },
  {
    titel: "Es gibt eine beste Hörzeit",
    kurz: "Die Zeteraktivität beginnt vor Sonnenaufgang.",
    text:
      "Über vier Jahre automatisch aufgezeichnet: Die Zeteraktivität der "
      + "Amsel folgt einem Tagesrhythmus. Der Beginn schwankt zwischen "
      + "Individuen stark — 50 bis 20 Minuten vor Sonnenaufgang —, das "
      + "Ende dagegen kaum.",
    praxis: "Wer Zetern hören will, ist vor Sonnenaufgang draußen.",
    beleg: "literatur",
    quellen: [
      "Haarhaus, Die Zeteraktivität der Amsel, J. Ornithol. — "
      + "Volltext hinter Bezahlschranke",
    ],
  },
  {
    titel: "Etiketten sind keine Belege",
    kurz: "Die Herkunftsangabe einer Aufnahme sagt wenig über den Ruf.",
    text:
      "Die Ruftyp-Angaben bei xeno-canto sind nachweislich unzuverlässig: "
      + "„call“ und „alarm call“ überlappen bei unserem Material zu 77 %. "
      + "Sie beschreiben außerdem die ganze Aufnahme, während wir "
      + "Ausschnitte von wenigen Sekunden hören. Deshalb tauchen sie in "
      + "dieser App als Herkunftsangabe auf, nie als Wahrheit.",
    beleg: "einschaetzung",
    quellen: ["Eigene Auswertung, 131 Phrasen"],
  },
];

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
  "Frankenberg, E. (1981): The adaptive significance of avian mobbing IV — "
  + "„Alerting others“ and „Perception advertisement“ in blackbirds facing "
  + "an owl. Z. Tierpsychol. 55: 97–118.",
  "Snow, D. W. (1988): A Study of Blackbirds. British Museum (Natural "
  + "History).",
  "Haarhaus, D.: Die Zeteraktivität der Amsel (Turdus merula). "
  + "J. Ornithol. — Tagesrhythmik, nicht Ruf-Akustik.",
  "McGowan, K., Cornell Lab of Ornithology: Crow FAQ — Ruftypen und "
  + "Reichweite.",
  "birdsoftheworld.org: House Sparrow, Sounds and Vocal Behavior.",
];

export const QUELLE =
  "Fünf Stimmen nach Jon Young. Die Signalbauformen folgen Marler (1955): "
  + "Luftalarm ist absichtlich schwer zu orten, der Hassruf absichtlich "
  + "leicht. Wo „Einschätzung“ steht, ist der Eintrag nicht belegt — im "
  + "Feld zu prüfen.";
