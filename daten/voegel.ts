// Erzeugt von data/daten_bauen.py -- nicht von Hand aendern.

export type Fressfeind = {
  deutsch: string;
  wissenschaftlich: string;
  /** Was erbeutet wird -- unabhaengig vom Alarmtyp. */
  stadium: "Altvogel" | "Nest" | "beides" | "unbekannt";
  /** Welchen Alarm der Feind ausloest. Eine Eule erbeutet Altvoegel,
   *  wird tagsueber aber gehasst -- die Achsen laufen nicht parallel. */
  alarmtyp: "Warnruf" | "Hassruf";
  /** Im Wikipedia-Artikel der Art namentlich bestaetigt. */
  bestaetigt: boolean;
};

export type Anteil = { was: string; prozent: number };

/** Aus AVONET (Tobias et al. 2022) und EltonTraits (Wilman et al. 2014).
 *  Vorsicht: grobe Kategorien fuer 11.000 Arten -- einzelne Werte koennen
 *  fuer eine bestimmte Art unpassend sein. */
export type Merkmale = {
  lebensraum?: string;
  zugverhalten?: string;
  ernaehrungstyp?: string;
  nahrungsnische?: string;
  lebensweise?: string;
  masse_g?: number | null;
  fluegellaenge_mm?: number | null;
  nahrung?: Anteil[];
  nahrungsschicht?: Anteil[];
};

export type Abschnitt = { titel: string; text: string };

export type Vogel = {
  id: string;
  name_de: string;
  name_wissenschaftlich: string;
  kurzbeschreibung: string;
  beschreibung: string;
  wikidata_id: string | null;
  quelle_text: { name: string; url: string | null; lizenz: string };
  fressfeinde: Fressfeind[];
  merkmale: Merkmale;
  /** Ausschnitte aus dem deutschen Wikipedia-Artikel (CC BY-SA).
   *  "stimme" ist fuer dieses Projekt der wichtigste. */
  abschnitte: Record<string, Abschnitt>;
};

export const voegel: Vogel[] = [
  {
    "id": "turdus_merula",
    "name_de": "Amsel",
    "name_wissenschaftlich": "Turdus merula",
    "kurzbeschreibung": "species of thrush",
    "beschreibung": "Die Amsel oder Schwarzdrossel, manchmal Kohlamsel oder Schwarzamsel, ist eine Vogelart aus der Familie der Drosseln (Turdidae). In Europa ist die Amsel der am weitesten verbreitete Vertreter dieser Familie und zugleich einer der bekanntesten Vögel überhaupt. Ihre Körperlänge liegt zwischen 24 und 27 Zentimetern. Die Männchen sind schwarz gefärbt und haben einen gelben Schnabel, das Gefieder der Weibchen ist größtenteils dunkelbraun. Der melodiöse und laut vorgetragene Reviergesang der Männchen ist in Mitteleuropa hauptsächlich zwischen Anfang März und Ende Juli zu hören und kann bereits vor der Morgendämmerung beginnen.",
    "wikidata_id": "Q25234",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Amsel",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "vielseitig",
      "masse_g": 102.7,
      "fluegellaenge_mm": 128.4,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 50
        },
        {
          "was": "Früchte",
          "prozent": 20
        },
        {
          "was": "Samen",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 60
        },
        {
          "was": "Unterholz",
          "prozent": 20
        },
        {
          "was": "mittlere Höhe",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der im Frühjahr weithin hörbare Reviergesang der Amselmännchen ist vielen Menschen vertraut. Die Amsel gilt als besonders kreativ in der Erfindung, Kombination und Variation von Motiven. Die melodiösen Strophen klingen für menschliche Ohren eingängig und gefällig, ganz im Gegensatz zu dem von beiden Geschlechtern bei Erregung zu hörenden Zetern („dackderrigigigi duck duck“) oder „Tixen“ – einer Aneinanderreihung hoher „tix“-Laute.\n\nReviergesang: Der Reviergesang wird vom Männchen gewöhnlich von zwei bis drei verschiedenen, exponierten Singwarten vorgetragen, die hin und wieder gewechselt werden. Eine Strophe dieses Gesangs dauert im Mittel etwas mehr als zwei Sekunden. In der Brutsaison geben Amseln während der Morgendämmerung für 20 bis 30 Minuten eine nahezu ununterbrochene Folge solcher Strophen von sich, wobei die Pausen zwischen den Strophen im Mittel etwa drei Sekunden lang sind. Beim abendlichen Gesang sind die Pausen etwas länger.\nEine Strophe kann in einen Motivteil und ein leiseres, mehr zwitscherndes und geräuschhaftes „Anhängsel“ unterteilt werden. Der Motivteil ist etwas länger, das Anhängsel kann auch fehlen. Der Motivteil wiederum kann in Elemente untergliedert werden, in der Regel sind es zwei bis fünf, manchmal bis zu neun. Die Pausen zwischen den ungefähr 0,2 Sekunden langen Elementen sind hörbar."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Adulte Amseln weisen einen deutlichen Geschlechtsdimorphismus auf: Das Gefieder der Männchen ist einfarbig schwarz, der Schnabel auffällig hellgelb bis orange. Zudem zeigen Männchen einen deutlichen Ring um die Augen, dessen Farbe der des Schnabels ähnelt, jedoch etwas ins Bräunliche gehen kann. Dieser Augenring kontrastiert stark mit der dunkelbraunen Iris. Weniger deutlich ist dieser Augenring beim Weibchen, auch der Schnabel ist weniger auffällig und hell hornfarben statt gelb. Die Gefiederfärbung des Weibchens ist viel variabler und vorwiegend dunkelbraun, teilweise ins Grau gehend oder rötlichbraun. Bei beiden Geschlechtern sind Lauf und Zehen dunkelbraun. Im Vergleich zum kleineren, ebenfalls dunkel befiederten und sich häufig auf dem Boden aufhaltenden Star hat die Amsel einen deutlich längeren Schwanz.\n\nGefieder adulter Amseln: Das Gefieder der adulten Männchen ist recht einheitlich schwarz. Vor allem an der Unterseite, aber auch an Rücken und Schulterregion zeigen die Federn nicht selten einen grauen bis bronzefarbenen Endsaum, was aber recht unauffällig ist und nur bei günstigen Lichtverhältnissen einen leicht schuppigen Eindruck macht. Die Schwungfedern können im Frühjahr ausgebleicht wirken.\nDie Oberseite der Weibchen ist dunkel olivbraun bis olivgrau gefärbt, die Stirn oft etwas weniger dunkel."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Die Amsel, die Drosselart mit dem dunkelsten Gefieder, bewohnte ursprünglich bevorzugt den Innenbereich feuchter, dichter Wälder. Auch heute noch brütet sie an den dunklen Standorten unterholzreicher Wälder und sucht auf vegetationsfreien oder kurzrasigen Böden nach Nahrung. In einem solchen Habitat ist das bei Dämmerlicht für Singvögel außergewöhnlich gute Sehvermögen der Amsel sicher von Vorteil. Am anderen Ende des außerordentlich breiten Habitatsspektrums stehen die belebten Zentren von Großstädten, so dass sich aufgrund dieser Gegensätzlichkeit die Bezeichnungen Wald- und Stadtamsel eingebürgert haben.\nDie Amsel kommt in nahezu allen Arten von Kulturlandschaft vor. Ihre Habitate umfassen dabei Vorgärten, Parks und parkähnliche Anlagen, Baum- und Strauchgruppen in Industriegebieten, Streuobstwiesen, buschbestandene Heiden sowie die weitgehend offene Feldflur, sofern diese mit Feldgehölzen oder Sträuchern aufgelockert ist. Neben naturnahen, alten Wäldern werden auch monokulturell bewirtschaftete Forste besiedelt, wobei Laubwälder gegenüber Nadelwäldern bevorzugt werden. Auch in Schilfröhrichten brütet die Amsel. Die am Boden nach Nahrung suchenden Vögel entfernen sich in allen Lebensräumen nicht allzu weit von Deckung bietender Vegetation. Bis auf wenige Ausnahmen liegt die Niederschlagsmenge in den von der Amsel besiedelten Lebensräumen über 300 mm pro Jahr."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Amseln sind flexible und anpassungsfähige Allesfresser, aber während des ganzen Jahres zumindest auf geringe Mengen tierischer Nahrung angewiesen. Wenn Letztere knapp oder nur mit unverhältnismäßigem Aufwand zu beschaffen ist, spielen Beeren und andere Früchte eine größere Rolle.\nHauptbestandteile der tierischen Nahrung sind Regenwürmer und Käfer bis zur Größe des Maikäfers, regelmäßig werden auch Schnecken, Blutegel, Tausendfüßer, Spinnen sowie verschiedene Insektenstadien verwertet. Neben zahlreichen weiteren Wirbellosen zählen auch kleinere Wirbeltiere zum Nahrungsspektrum, darunter Eidechsen, Schwanz- und Froschlurche, Mäuse und Spitzmäuse sowie in Ausnahmefällen auch Schlangen. Auch fischende Amseln sind schon beobachtet worden. Bei Nahrungsmangel werden als Ersatznahrung auch kleinere Insekten wie beispielsweise Blattläuse verwertet.\n\nWährend Amseln sich zu Beginn der Brutzeit fast ausschließlich tierisch ernähren, nimmt in Mitteleuropa ab Mitte Mai der Anteil von Beeren und Früchten an der Nahrung zu. Die Amsel ist dabei der vielseitigste Früchtefresser unter den Drosseln; sie meidet allerdings rigoros die Früchte der Weißbeerigen Mistel mit ihrem zähschleimigen Inhalt. Der Anteil an Beeren und Früchten von Ziergehölzen ist vergleichsweise hoch. Die Früchte werden vorwiegend nach der Reihenfolge des Heranreifens und nach dem Zuckergehalt gewählt."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Im Regelfall werden Amseln im Frühjahr, am Ende des ersten Lebensjahres, geschlechtsreif. Innerhalb einer Brutsaison führen Amselpaare größtenteils eine monogame Beziehung. Bei Standvögeln, insbesondere auf den Britischen Inseln, scheint der Zusammenhalt der Paare fester und auch mehrere Brutperioden zu überdauern, dennoch sind bei etwa 18 Prozent der Jungen die aufziehenden Amselmännchen nicht die Väter. Bigynie wurde nachgewiesen, ist aber selten.\nAmseln gehören zu den Frühbrütern. In Mitteleuropa gibt es die ersten Bruten Ende Februar oder Anfang März. Zwei bis drei Jahresbruten sind hier die Regel, letzte Bruten sind bis Ende August möglich. In manchen Teilen des Verbreitungsgebiets gibt es nur zwei Jahresbruten. Schachtelbruten sind häufig. In Australien und Neuseeland liegt die Brutzeit hauptsächlich zwischen August und Dezember. Im Siedlungsgebiet gibt es insbesondere in milden Wintern gelegentlich Brutversuche und auch erfolgreiche Bruten.\n\nPaarbildung und Balz: In Mitteleuropa kann bereits im November die Neuformierung von Revieren durch die im Brutgebiet verbliebenen Männchen beginnen. Zu dieser Zeit gibt es vor allem bei Stadtamseln auch bereits erste Anzeichen der Paarbildung. Vor allem erwachsene Männchen verfolgen bereits im Winter bestimmte Weibchen und versuchen Konkurrenten fernzuhalten. Auch ziehende Vögel können bereits verpaart im Brutgebiet eintreffen."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Der Aktivitätsbeginn liegt während der meisten Jahreszeiten während der Morgendämmerung, das Aktivitätsende während der Abenddämmerung.\nZwischen Februar und Ende Juni ist allerdings von mitteleuropäischen Amseln schon weit vor Beginn der Morgendämmerung ihr Gesang zu vernehmen; im Juli und Juni sowie mitten im Winter endet die Aktivität bereits bei oder sogar vor Sonnenuntergang. Witterungsabhängige Helligkeitsunterschiede sowie künstliche Lichtquellen beeinflussen die Aktivitätsdauer.\n\nRuhe und Komfortverhalten: Amseln suchen während des gesamten Jahres spezielle Schlafplätze auf, obschon während der Brutzeit neben den brütenden Weibchen auch häufig die Männchen nachts im Revier bleiben. Die Schlafplätze liegen typischerweise in Nadelbäumen sowie dicht belaubten Laubbäumen oder Sträuchern, meist 1 bis 2,5 Meter über dem Boden. Die Übernachtung erfolgt manchmal einzeln, aber auch gesellig: In stadtnahen Wäldern können sich 700 Vögel oder mehr versammeln. Im Siedlungsgebiet werden häufig Friedhöfe oder Parks zur Nächtigung genutzt. Die zum Schlafplatz zurückzulegende Distanz liegt normalerweise unter einem Kilometer, kann aber auch bis zu vier Kilometer betragen, insbesondere im Siedlungsgebiet sind die zurückzulegenden Distanzen oft größer. Dabei verwenden die Vögel häufig dieselben Routen, ein Individuum nutzt aber nicht jeden Tag denselben Schlafplatz."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Elster",
        "wissenschaftlich": "Pica pica",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Hauskatze",
        "wissenschaftlich": "Felis catus",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Kreuzotter",
        "wissenschaftlich": "Vipera berus",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Mäusebussard",
        "wissenschaftlich": "Buteo buteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rotfuchs",
        "wissenschaftlich": "Vulpes vulpes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rotmilan",
        "wissenschaftlich": "Milvus milvus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Steinmarder",
        "wissenschaftlich": "Martes foina",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Uhu",
        "wissenschaftlich": "Bubo bubo",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Waldkauz",
        "wissenschaftlich": "Strix aluco",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Waldohreule",
        "wissenschaftlich": "Asio otus",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "cyanistes_caeruleus",
    "name_de": "Blaumeise",
    "name_wissenschaftlich": "Cyanistes caeruleus",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Blaumeise ist eine Vogelart der Gattung Cyanistes aus der Familie Meisen (Paridae). Der Kleinvogel ist mit seinem blau-gelben Gefieder einfach zu bestimmen und in Mitteleuropa sehr häufig anzutreffen. Bevorzugte Lebensräume sind Laub- und Mischwälder mit hohem Eichenanteil; die Blaumeise ist auch häufig in Parkanlagen und Gärten zu finden. Außer in Europa kommt sie in einigen angrenzenden Gebieten Asiens vor, in Nordafrika und auf den Kanarischen Inseln. Die Population der Kanaren wird oft auch als eigene Art angesehen.",
    "wikidata_id": "Q25404",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Blaumeise",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 11.1,
      "fluegellaenge_mm": 65.6,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 50
        },
        {
          "was": "Früchte",
          "prozent": 20
        },
        {
          "was": "Samen",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Unterholz",
          "prozent": 30
        },
        {
          "was": "mittlere Höhe",
          "prozent": 30
        },
        {
          "was": "Kronendach",
          "prozent": 30
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der typische Reviergesang der Blaumeise beginnt mit zwei bis drei hohen, bei einer Frequenz von etwa 8 kHz liegenden, sehr ähnlichen Lauten, die meist mit „zizi“ oder „zizizi“ transkribiert werden. Diesen folgt ein Triller in etwas tieferer Tonlage, der aus 5 bis 15, in Ausnahmefällen sogar bis zu 25 kürzeren Elementen besteht. Diese Strophenteile sind im Vergleich zu denen anderer Meisen ziemlich gleichförmig. Allerdings existiert auch eine Strophenform, die mit dem Gesang der Kohlmeise verwechselt werden kann. Zwischen der Einleitung und dem Triller wird gelegentlich noch ein aus wenigen, aber sehr variablen Elementen bestehender Mittelteil eingeschaltet. Manchmal werden diese aus zwei oder drei Phrasen bestehenden Strophen unmittelbar aneinandergereiht, die abschließende Lautreihe wird dann oft verkürzt.\nEin Männchen verfügt über drei bis acht verschiedene derartige Strophentypen. Auch bei Weibchen tritt gelegentlich Reviergesang auf, etwa wenn sie in territoriale Auseinandersetzungen verwickelt werden. Der typische Triller am Ende der Strophe kommt bei den Vögeln im Mittelmeerraum seltener vor. Dies hängt offensichtlich damit zusammen, dass dort im Gegensatz zu Nord- und Mitteleuropa keine so starke Konkurrenz mit der Kohlmeise besteht."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Die Blaumeise ist mit einer Körperlänge von knapp zwölf Zentimetern deutlich kleiner als die Kohlmeise. Die hellblauen Gefiederpartien am Kopf und auf der Oberseite treten in Mitteleuropa bei keinem anderen Singvogel auf und erlauben so eine einfache Bestimmung. Der dunkel hornbraune Schnabel ist verglichen mit dem verwandter Arten kurz und hoch. Die Iris ist braun, die Füße sind dunkel blaugrau, die Krallen grau.\n\nFederkleid und Mauser: Im Kopfbereich zeigt das Gefieder der Blaumeise ein sehr typisches Muster, das durch das Fehlen schwarzer Gefiederpartien weniger kontrastreich wirkt als bei den Schwesterarten. Die vom Schnabelansatz bis zum vorderen Augenwinkel weiße Stirn geht oben in die charakteristische hellblaue Kopfplatte über. Die Federn im Scheitelbereich können zu einer niedrigen, stumpfen Haube aufgestellt werden. Von der hellblauen Kopfplatte durch einen weißen Streifen abgesetzt zieht ein schmaler schwarzer Augenstreif vom Schnabelansatz bis zum dunkelblauen Nackenband. Die weißen Wangen sind vorn durch einen schwarzen Kehlfleck und brustwärts durch einen schwarzblauen Halsring begrenzt.\n\nRücken und Schultern sind dumpf grünlich, wobei der Farbton zwischen einzelnen Populationen variiert. Der Bürzel ist graublau und geht fließend in die Oberschwanzdecken über."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Ihrer weiten Verbreitung entsprechend besiedeln Blaumeisen verschiedene Lebensräume. In Mitteleuropa werden in eichenreichen Laub- und Laubmischwäldern die höchsten Siedlungsdichten und Bruterfolge erreicht.\nDabei sind die in Mitteleuropa sehr seltenen reinen Eichenwälder trotz ihrer geringen Flächenausdehnung sehr attraktiv. Wesentlich häufiger sind verschiedene Typen der Eichen-Hainbuchenmischwälder, die der Art ebenfalls sehr gute Lebensbedingungen bieten, wie auch Hartholzauen mit hohem Eichenanteil. Etwas ungünstiger sind Buchen- und Buchenmischwälder, die aber auch noch recht dicht besiedelt sind. In Nadelmischwäldern hängt die Anzahl der Blaumeisenreviere stark vom Vorhandensein einzelner Laubbäume ab. In reinen Nadelwäldern fehlt die Blaumeise oder besiedelt allenfalls die Waldränder. Sowohl in den Alpen ab der montanen Höhenstufe als auch an der Nordgrenze des Verbreitungsgebiets in Skandinavien werden Mischwälder mit vergleichsweise hohem Laubholzanteil weitgehend gemieden. Die Siedlungsdichte, für die ein Maximalwert von 1,85 Brutpaaren pro Hektar ermittelt wurde, ist weitgehend unabhängig von der Reviergröße, die zwischen 0,16 und 0,84 Hektar liegt. Bei hohen Siedlungsdichten grenzen die Reviere direkt aneinander."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Ernährungsweise der Blaumeise gleicht prinzipiell der ihrer nahen Verwandten; in der Fortpflanzungsperiode und insbesondere während der Jungenaufzucht dominiert tierische Nahrung, vor allem verschiedene Insekten und Spinnen. Im Herbst und Winter nimmt die Bedeutung der pflanzlichen Kost zu. Bei der Nahrungssuche ist die Blaumeise geschickter als alle näher verwandten Meisen, kann sich dabei an die äußersten Blätter und Zweige klammern, hängt häufiger kopfüber und setzt die Füße auf vielfältige Weise als Werkzeug ein. Der kurze Schnabel eignet sich besonders zum Hämmern und Spalten sowie zum Hervorholen kleiner Objekte und Tiere.\n\nNahrungsspektrum der Altvögel: Im gesamten Jahresverlauf macht der Anteil der tierischen Nahrung ungefähr 80 Prozent der Gesamtnahrung aus. Dabei überwiegen sehr kleine Beutetiere unter zwei Millimetern Länge. Neben den Schmetterlingen und deren Entwicklungsstadien sind Hemipteren – dabei insbesondere Blattläuse – eine ganzjährig wichtige Beute. Weiter finden sich in Nahrungsproben sehr regelmäßig verschiedene Vertreter der Hautflügler und Käfer. Für einen kurzen Zeitraum im Spätwinter spielen ebenfalls Larven von Fliegen und Mücken eine wichtige Rolle. Neben Insekten werden auch Spinnen regelmäßig gefressen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Die Brutbiologie ist der am besten untersuchte Aspekt der allgemein sehr gut erforschten Art. Dabei ist zu beachten, dass meistens nistkastenbrütende Populationen untersucht wurden. Es ist umstritten, inwieweit so gewonnene Daten auf in Naturhöhlen brütende Vögel übertragbar sind. Während einige der auf diese Weise ermittelten Befunde sicherlich von der Art der Bruthöhle unabhängig sind, dürfte der Bruterfolg in den Nistkästen über dem in den Naturhöhlen liegen.\n\nBalz und Paarbildung: Wie die meisten Kleinvögel erreichen Blaumeisen die Geschlechtsreife noch vor Vollendung des ersten Lebensjahres. Einerseits wird berichtet, dass aus Spätbruten stammende Weibchen schon im Alter von zehn Monaten ihre ersten Eier legen, andererseits brüten zumindest in manchen Untersuchungsgebieten rund 30 Prozent der Einjährigen nicht.\nBereits ab Mitte Januar beginnt mit der Auflösung der gemischten Winterschwärme das Revierverhalten, und einige Männchen verdrängen schon potentielle Konkurrenten aus der Nähe eines von ihnen begleiteten Weibchens. Der zu dieser Zeit bereits einsetzende Reviergesang des Männchens richtet sich nicht nur an Konkurrenten, sondern auch an die Partnerin. Manche der Weibchen, die bei der Partnerwahl allgemein die aktiveren sind, sind noch bis in den März hinein unverpaart, wählen aber bis zum eigentlichen Brutbeginn noch einen Partner."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Blaumeisen beginnen den Tag früher als Kohlmeisen und bleiben auch am Abend länger aktiv. Sowohl in der Brutsaison als auch im Winter verbringen Blaumeisen einen Großteil ihrer Zeit mit der Nahrungssuche, im Mittwinter sind es ungefähr 85 Prozent der aktiven Zeit.\n\nRuhe und Komfortverhalten: Blaumeisen übernachten im Regelfall einzeln, vom Spätsommer bis zum Frühjahr in Baumhöhlen, sonstigen Nischen und auch Nistkästen. Im Sommer wird vermutlich außerdem auf Zweigen im Freien übernachtet. Auch bei den Schlafplätzen ist der Hauptkonkurrent wie bei der Nahrungssuche die Kohlmeise. Der für die Gefiederpflege aufgewendete Zeitanteil wird auf 6 Prozent der Gesamtaktivität geschätzt. Blaumeisen baden häufig und intensiv, neben Wasserbädern sind auch Bäder im Schnee zu beobachten.\n\nBewegung: Blaumeisen legen fliegend meist nur kurze Strecken zurück, zwischen Bäumen oder von Zweig zu Zweig. Beim Flug über längere Distanzen meiden sie wenn möglich das Überfliegen von Freiflächen, der Flug ist bogenförmig und relativ langsam. Die Blaumeise kann sich mit ihren kurzen, kräftigen Zehen viel besser hängend an Zweige und Blätter klammern als alle anderen Meisenarten.\n\nSoziales und antagonistisches Verhalten: Nach der Brutsaison lösen sich Paar- und Familienverbände allmählich auf."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Buntspecht",
        "wissenschaftlich": "Dendrocopos major",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Turmfalke",
        "wissenschaftlich": "Falco tinnunculus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "fringilla_coelebs",
    "name_de": "Buchfink",
    "name_wissenschaftlich": "Fringilla coelebs",
    "kurzbeschreibung": "species of small passerine bird",
    "beschreibung": "Der Buchfink ist ein zur Familie der Finken (Fringillidae) gehöriger Singvogel. Er kommt in ganz Europa mit Ausnahme Islands und des nördlichsten Skandinaviens vor, sein Verbreitungsgebiet erstreckt sich in östlicher Richtung bis nach Mittelsibirien. Er ist außerdem ein Brutvogel in Nordafrika und Vorderasien bis einschließlich des Irans. In Neuseeland und in der Südafrikanischen Republik ist der Buchfink vom Menschen eingeführt worden.",
    "wikidata_id": "Q25383",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Buchfink",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Teilzieher",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "vielseitig",
      "masse_g": 23.8,
      "fluegellaenge_mm": 85.9,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 60
        },
        {
          "was": "Samen",
          "prozent": 20
        },
        {
          "was": "sonstige Pflanzenteile",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 40
        },
        {
          "was": "Unterholz",
          "prozent": 30
        },
        {
          "was": "mittlere Höhe",
          "prozent": 30
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der Kontakt- und Alarmruf des Buchfinken ist ein lautes „pink, pink“, sein Flugruf ein gedämpftes „jüp, jüp“. Laut und durchdringend singt er ab März etwa wie „zizizizjazjazoritiu-zip“ oder zipzipzip. In unterschiedlichen Lebensräumen sind abweichende Rufe, so genannte regionale Dialekte, zu vernehmen. Neben dem namensgebenden Lockruf „pink“ (oder „fink“) gibt es noch das in manchen Gegenden Deutschlands und Großbritanniens als Regen verkündend angesehene „trürr“ (oder „trüb“). Dieser „Regenruf“ kann manchmal auch zweisilbig vorgetragen werden. Anderen Quellen zufolge wird dieser Ruf nur als „Regenruf“ bezeichnet, weil er lautmalerisch als „trief“ gedeutet wird.\nBei Streitigkeiten und Revierkämpfen ist ein lautes Klickern zu hören, welches offenbar als Drohlaut dient. Zugleich wird, wie auch bei einigen anderen Singvögeln (z. B. männlichen Rabenkrähen), die Befiederung des Kopfes (Scheitel) aufgestellt.\nDer Gesang männlicher Buchfinken (auch Finkenschlag genannt) wird in dem jahrhundertealten Brauchtum und seit 2014 als Immaterielles Kulturerbe anerkannten Finkenmanöver im Harz in Wettbewerben bewertet. Zu Ende des 19. und Anfang des 20. Jahrhunderts waren diese Wettbewerbe auch in anderen Gegenden sehr beliebt. In Wien hießen die Fänger und Halter Vogelbucker, ausgetragen wurden die Wettbewerbe hier meist in Gaststätten."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Buchfink erreicht eine Körperlänge von 14 bis 18 Zentimeter. Die Individuen der Nominatform wiegen zwischen 18 und 25 Gramm. Unabhängig vom Geschlecht weisen Buchfinken einen auffallenden weißen Schulterfleck, eine weiße Flügelbinde und weiße äußere Steuerfedern auf. Ansonsten besteht ein auffälliger Sexualdimorphismus.\nBei den Männchen sind die Körperunterseite und die Kopfseiten bräunlichrosa bis rotbraun. Der Oberkopf, der Nacken und die Halsseiten sind im Sommerhalbjahr auffällig graublau, im Winterhalbjahr mehr bräunlichgrau. Die Stirn ist schwarz, der Rücken ist kastanienbraun und der Bürzel ist grünlich. Der Schnabel ist beim Männchen im Frühjahr stahlblau, ansonsten hornfarben. Die Weibchen sind auf der Körperoberseite olivgrau und auf der Körperunterseite etwas heller. Der Schnabel des Weibchens ist ganzjährig hellbraun bis hornfarben.\nFrisch geschlüpfte Buchfinken weisen auf der Körperoberseite, den Flügeln, Schenkeln und dem Bauch zunächst blass rauchgraue Dunen auf. Die Haut ist fleischfarben rosa. Der Rachen ist tiefrosa, die Schnabelwülste sind weiß oder rahmfarben bis gelblich getönt. Jungvögel ähneln adulten Weibchen, jedoch sind bei ihnen die Federn am Kopf und Körper etwas kürzer und weicher, die Steuerfedern sind schmäler und laufen spitzer aus.\nBuchfinken laufen auf dem Boden unter rhythmischem Kopfnicken. Der Flug ist wellenartig."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Der Buchfink ist in Europa und Nordafrika, aber auch in Westasien verbreitet, wo er vor allem in Wäldern, aber auch in Parkanlagen und großen Gärten bis in etwa 1500 Meter Höhe lebt. Er zählt zu den häufigsten Singvogelarten in Europa.\nDer Lebensraum des Buchfinken sind Wälder, Dickichte, Hecken, Gärten und große Obstanbauflächen. In Afrika ist er am häufigsten in Wäldern mit Korkeichen, Zedern, Aleppo-Kiefern, Thuja-, Eukalyptus-, Walnuss-, Sandarak- und Arganbeständen sowie in Olivenhainen anzutreffen. In der Kyrenaika kommt er besonders häufig in Wacholderwäldern vor.\nIn Mitteleuropa sind Buchfinken Teilzieher, in Ost- und Nordeuropa dagegen Zugvögel. Ein großer Teil der Population verbleibt ganzjährig im Brutgebiet – und hier besonders die Männchen, sodass der Eindruck entsteht, dass diese im Winter zölibatär leben, weswegen Carl von Linné der Art auch diesen lateinischen Namenszusatz gab. Buchfinken, die während des Winterhalbjahres in klimatisch günstigere Regionen abwandern, ziehen sowohl bei Tag als auch bei Nacht. Sie folgen dabei zum Teil der Küstenlinie, Flusstälern oder Bergpässen. In Marokko sind die von Europa herziehenden Vögel insbesondere vom späten August bis November zu beobachten. An der Meerenge von Gibraltar lassen sich zurückziehende europäische Buchfinken bereits ab Januar beobachten, der Zug setzt sich bis in den April fort."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Nahrung der Buchfinken besteht aus Beeren, Samen aller Art, Insekten und Spinnen. Die Nestlinge werden mit Insekten und deren Larven gefüttert.\nSeine Nahrung sucht der Buchfink überwiegend auf dem Erdboden und nutzt vor allem die Stellen, die nur spärlich mit Vegetation bewachsen sind. Die Nahrung wird mit schnellen, pickenden Bewegungen vom Erdboden aufgenommen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Der Buchfink brütet bevorzugt in lichten Laub- und Mischwäldern sowie in Hecken, Parks und Gärten. In Mitteleuropa beginnt die Brutperiode frühestens ab Ende März, gewöhnlich schreiten Buchfinken aber von Mitte April bis Juni zur Brut. In Marokko und Algerien brüten Buchfinken von Ende März bis Anfang Juni. Im Südwesten der Kapprovinz dagegen von September bis November. Je nach Klima und Lage ziehen sie ein bis zwei Jahresbruten pro Jahr groß.\nZu Beginn der Fortpflanzungszeit kennzeichnet das Männchen sein Brutrevier durch lautstarken Gesang. Die Größe des Brutreviers variiert abhängig vom Verbreitungsgebiet beträchtlich und ist in Europa umso größer, je höher im Norden der Buchfink brütet. In der marokkanischen Macchie haben die Brutreviere eine durchschnittliche Größe von 270 Quadratmetern. Das Brutrevier wird von beiden Vögeln eines Paares energisch verteidigt, Eindringlinge werden verjagt.\nDas sorgfältig, ausschließlich vom Weibchen gebaute, dickwandige Nest besteht aus Wurzeln, Rindenfasern, Halmen, Moosen und Flechten. Innen wird es mit Haaren und einzelnen Federn gepolstert. Das Nest wird meistens in einer Höhe von zwei bis zehn Metern auf Sträuchern oder in Bäumen in einer Astgabel gebaut und ist durch die Moose und Flechten gut getarnt."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "dendrocopos_major",
    "name_de": "Buntspecht",
    "name_wissenschaftlich": "Dendrocopos major",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Buntspecht ist eine Vogelart aus der Familie der Spechte (Picidae). Buntspechte besiedeln große Teile des nördlichen Eurasiens sowie Nordafrika und bewohnen Wälder fast jeder Art sowie Parks und baumreiche Gärten. Die Nahrung wird in allen Strata des Waldes gesucht, jedoch vor allem in den Baumkronen. Sie besteht sowohl aus tierischen Anteilen als auch, vor allem im Winter, aus pflanzlichem Material. Das Nahrungsspektrum ist sehr breit und umfasst verschiedenste Insekten und andere Wirbellose ebenso wie kleine Wirbeltiere und Vogeleier, Samen, Beeren und andere Früchte sowie Baumsäfte.",
    "wikidata_id": "Q26209",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Buntspecht",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "lichter Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 74.9,
      "fluegellaenge_mm": 136.2,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 50
        },
        {
          "was": "Samen",
          "prozent": 30
        }
      ],
      "nahrungsschicht": [
        {
          "was": "mittlere Höhe",
          "prozent": 40
        },
        {
          "was": "Kronendach",
          "prozent": 30
        },
        {
          "was": "Unterholz",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Dem Anlocken der Weibchen in der Balzzeit und der Revierabgrenzung dient das „Trommeln“, eine sehr schnelle, bis 2 Sekunden dauernde Folge von etwa 10 bis 15 Schnabelschlägen. Das Trommeln ist bereits im ausgehenden Winter und vor allem im zeitigen Frühjahr zu hören. Die Männchen beginnen mit dem Trommeln, sobald die von ihnen gezimmerte Höhle bezugsfertig ist, und nutzen dabei alle verfügbaren Resonanzkörper. Typisch sind hohle Baumstämme oder tote Äste. Buntspechte lassen ihre Wirbel jedoch auch an Regenrinnen und anderen metallischen Konstruktionen erklingen.\nWährend das Hacken und Hämmern des Buntspechts an Baumstämmen das ganze Jahr über zu hören ist, sind die intensiven Trommelwirbel typisch für die Fortpflanzungszeit ab Dezember. Auch die Weibchen trommeln und demonstrieren so ihre Anwesenheit. Grünspecht und Mittelspecht trommeln weniger als der Buntspecht, sie setzen bei der Balz mehr Rufe ein.\nDie Balz des Buntspechtes und anderer Spechte enthält auch Drohgesten wie das Aufreißen des Schnabels oder das Aufstellen der Scheitelfedern. Es wird daher auch von einer „Drohbalz“ gesprochen.\n\nEine weitere Lautäußerung ist ein kurzes hartes „kick“ oder „kix“."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Buntspecht ist etwa 23 Zentimeter groß. Seine Flügelspannweite beträgt zwischen 34 und 39 Zentimeter. Er ist zwischen 60 und 90 Gramm schwer. Sein Gefieder ist oberseits schwarz gefärbt mit zwei großen weißen Flügelflecken und unterseits gelblich-grau. Die Unterschwanzdecken sind lebhaft rot gefärbt. Nur das Männchen hat einen roten Genickfleck und Jungtiere haben einen roten Scheitel. Die Wangen sind weiß gefärbt, die Partie oberhalb des Schnabels eher grau. An den Halsseiten befinden sich schwarze Bartstreifen.\nDie Buntspechte haben spitze, gebogene Krallen an ihren Kletterfüßen, mit denen sie sich an der Borke festhalten. Zwei Krallen zeigen dabei nach vorne und zwei nach hinten. Ungewöhnlich dick ist ihre Haut, die sie vor Insektenstichen schützt. Eine federnde, gelenkartige Verbindung zwischen der breiten Schnabelbasis und dem Schädel federt die Erschütterung ab, die beim Zimmern der Spechthöhle entsteht. Die dabei aufrechte und stabile Haltung am Baum wird durch starke Muskeln unterstützt, die die stützenden Schwanzfedern kontrollieren. Um das Einatmen des entstehenden Holzmehls zu verhindern, sind die Nasenlöcher des Buntspechts mit feinen Federn überwachsen."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Der Buntspecht ist die am wenigsten spezialisierte heimische Spechtart und deshalb auch die am häufigsten vorkommende. Man kann ihn sowohl in Laub- als auch in Nadelwäldern finden, aber auch in Parks und in der Kulturlandschaft, sofern dort Alleen, Windschutzstreifen oder kleine Baumgruppen vorhanden sind. Eichen- und Buchenmischwälder mit viel Alt- und Totholz sind für ihn optimale Lebensräume. Einförmige Fichten­reinbestände weisen nur geringe Spechtvorkommen auf."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Der Buntspecht ernährt sich während der überwiegenden Zeit des Jahres hauptsächlich von Insekten und ihren Larven, die er mit kräftigen Schnabelhieben unter der Borke hervorholt. Während der Winterzeit ist er in der Lage, seine Ernährung umzustellen. In dieser Zeit, in der Insekten knapp sind, frisst er Nüsse, Beeren und Samen. Viele der fettreichen Samen, die ihm im Winter zur Ernährung dienen, müssen erst geknackt werden. Während Rabenvögel, wie etwa der Eichelhäher, Haselnüsse mit dem Fuß festhalten, klemmt der Buntspecht Nüsse oder Kiefernzapfen in Baumspalten ein. Zur Gewinnung der letzteren hackt er oft in einen Ast ein Loch, um den Zapfen darin festzuklemmen. Dies sind die sogenannten Spechtschmieden, die der Buntspecht auch nutzt, um hartschalige Käfer zu knacken. Hat der Buntspecht einen neuen verwertbaren Zapfen gefunden, so fliegt er seine „Schmiede“ an und hält dort den neuen Zapfen im Brust-/Rumpfbereich eingeklemmt, während er den alten Zapfen zunächst entfernen muss. Danach wird der neue Zapfen in den als „Amboss“ dienenden Spalt geschoben und anschließend schrittweise aufgehackt, um die Samen mit der Zunge aufzunehmen. Als weitere pflanzliche Nahrungsergänzung dient dem Buntspecht vor allem im Frühjahr das Saftlecken an Ringelbäumen. Dabei werden auch vom Pflanzensaft angelockte Insekten mit aufgenommen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Der Buntspecht ist wie alle Spechte ein Höhlenbrüter. Die Bruthöhlen zimmert er selbst und bevorzugt dazu weiche Holzarten und morsche alte Bäume. Er beginnt viele Höhlungen auszuarbeiten, bevor er eine einzige vollendet.\nDas Weibchen legt vier bis sieben weiße Eier, die etwa 11–13 Tage lang bebrütet werden. Die Jungvögel werden etwa drei bis vier Wochen lang gefüttert, bis sie ausfliegen. In der zweiten Hälfte der Fütterungsphase sind die Nester wegen des ununterbrochenen lauten Gezeters der Jungvögel leicht zu entdecken.\nBis zu 20 % der Weibchen leben in Polyandrie. Ältere erfahrene Weibchen beginnen mit einem älteren erfahrenen Männchen eine Erstbrut. Mit einem meist jüngeren Männchen folgt dann eine Zweitbrut. Das Weibchen beteiligt sich an Brut-, Schlupf- und Huderphase beider Bruten. Später überlässt sie die Aufzucht der Zweitbrut dem Männchen der Zweitbrut."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Gartenschläfer",
        "wissenschaftlich": "Eliomys quercinus",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Haselmaus",
        "wissenschaftlich": "Muscardinus avellanarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Merlin",
        "wissenschaftlich": "Falco columbarius",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      }
    ]
  },
  {
    "id": "garrulus_glandarius",
    "name_de": "Eichelhäher",
    "name_wissenschaftlich": "Garrulus glandarius",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Eichelhäher ist ein Singvogel aus der Familie der Rabenvögel (Corvidae).",
    "wikidata_id": "Q25354",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Eichelh%C3%A4her",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Teilzieher",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 159.5,
      "fluegellaenge_mm": 181.1,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 40
        },
        {
          "was": "Früchte",
          "prozent": 30
        },
        {
          "was": "Samen",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 60
        },
        {
          "was": "Unterholz",
          "prozent": 20
        },
        {
          "was": "mittlere Höhe",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der Alarmruf ist ein lautes, raues und charakteristisches Rätschen (). Der üblichere Ruf ist dchää-dchää und bisweilen ist ein bussardartiges, reines piüü zu vernehmen. Der Gesang ist leise schwätzend. Der Eichelhäher ist in der Lage, Stimmen anderer Vögel oder Geräusche nachzuahmen."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Eichelhäher gehört mit 32 bis 35 cm Körperlänge zu den mittelgroßen Rabenvögeln, seine Flügelspannweite beträgt etwa 53 Zentimeter und sein Gewicht etwa 170 Gramm. Der kräftige Schnabel ist grauschwarz bis schwarz. Die Füße sind graubraun bis braun fleischfarben mit gelblichen oder weißlichen Sohlen. Die Iris ist bläulichgrau mit rötlichem Innen- und Außenring und einer ebensolchen, feinen Sprenkelung.\nDie Geschlechter unterscheiden sich nicht in der Gefiederfärbung. Der Kopf ist je nach Unterart mehr oder weniger auffällig gezeichnet. Die Nominatform G. g. glandarius, die in Mittel-, Ost- und Nordeuropa vorkommt, zeigt an Stirn und Scheitel weiße Partien, deren schmale, verlängerte Federn schwarz gestreift sind und die bei Erregung zu einer Haube aufgestellt werden können. Auch die Region um das Auge ist, oft bis auf die vorderen Ohrdecken, weiß mit schwarzer Strichelung. Auffällig ist zudem ein deutlich abgesetzter, schwarzer Bartstreif, der etwa die Ausmaße des Schnabels hat. Kinn und Kehle sind weiß. Hintere Ohrdecken, Halsseiten und Nacken sind rötlich beige bis matt fuchsfarben. Diese Färbung setzt sich auf Rücken, Schultern und Unterseite fort, wobei sie auf dem Rücken eher ins graubräunliche schlägt und auf der Unterseite etwas heller ist. Bauchmitte und Unterschwanzdecken sind wie der hintere Rücken und der Bürzel weiß."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Der Eichelhäher besiedelt in Mitteleuropa zur Brutzeit Laub-, Misch- und Nadelwälder. Bevorzugt kommt er in lichten Beständen vor, die eine reiche untere Baumschicht oder eine hohe Strauchschicht aufweisen oder aber in reichstrukturierten Wäldern, in denen sich kleinflächig verschiedene Altersstufen, Lichtungen, Dichtungen oder Schläge abwechseln. In monotonen Waldformen wie Fichten- oder Kiefernforsten, aber auch beispielsweise Buchenhallenwäldern, kommt er in geringer Dichte, nur in Randbereichen oder im Bereich von Lichtungen und Schlägen vor.\nIn entsprechend waldähnlichen Habitaten brütet er auch in Siedlungsnähe, etwa in Parks, ausgedehnten Gärten oder auf Friedhöfen. In der offenen Landschaft ist der Eichelhäher zur Brutzeit nur selten zu finden. Zur Fruchtreife nach der Brutzeit sucht er aber gezielt einzeln stehende Eichen oder Haselsträucher in der offenen Landschaft auf.\nIm Mittelmeerraum und in Kleinasien besiedelt der Eichelhäher bewaldete Hänge, Trockenwald, Bergwälder, Pinienbestände, Olivenhaine und andere Pflanzungen. Auch hier kommt er bisweilen in Stadtnähe vor. In der skandinavischen Nadelwaldzone werden vor allem besonders nahrungsreiche Waldstandorte besiedelt, bevorzugt Kiefern-Fichtenwälder mit möglichst hohem Fichtenanteil. In Sibirien lebt die Art offenbar hauptsächlich in Nadelwäldern."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Nahrungsspektrum: Das Nahrungsspektrum des Eichelhähers ist sehr umfangreich, wobei meist das jahreszeitliche Angebot ausgenutzt wird. Von Frühjahr bis Herbst überwiegt daher der tierische Anteil, was zum Teil am Angebot, zum Teil daran liegt, dass die Nestlinge hauptsächlich mit tierischer Nahrung versorgt werden. Im Spätherbst und im Winter nimmt der pflanzliche Anteil stark zu. Dieser besteht zu einem guten Teil aus Vorräten, die ganzjährig, aber vor allem vor dem Winter angelegt werden.\nAls pflanzliche Nahrung werden Eicheln bevorzugt, aber auch andere Nussfrüchte wie Bucheckern, Haselnüsse und Edelkastanien werden genutzt. Sind diese nicht in ausreichendem Maße vorhanden, wird auf Ackerfrüchte ähnlicher Beschaffenheit wie vor allem Mais, aber auch Getreide und Buchweizen ausgewichen. Vor allem in Osteuropa wurde in Eichelfehljahren eine verstärkte Nutzung von Mais beobachtet. Neben dieser Hauptkost werden bei Gelegenheit auch zahlreiche Baumsamen, Nüsse, Beeren und Steinfrüchte, Kernobst, Hülsenfrüchte und Kartoffeln, Pilze, Knospen oder Pflanzengallen verzehrt. Obst wird offenbar bei schlechtem Insektenangebot auch als Nestlingsnahrung genutzt.\nZur tierischen Nahrung zählen vor allem Raupen von Schmetterlingen und Blattwespen sowie Käfer. Raupen und Engerlinge spielen besonders zur Brutzeit und als Nestlingsnahrung eine Rolle."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Eichelhäher führen eine monogame Saisonehe und tätigen eine Jahresbrut. Bei Verlust des Geleges kommen Nachgelege vor. Junge Eichelhäher sind vermutlich bereits ab dem ersten Jahr geschlechtsreif, ein großer Teil brütet aber erst im zweiten Jahr.\n\nRevierverhalten: Der Eichelhäher verbringt in Mitteleuropa meist das ganze Jahr in einem Revier, dessen Grenzen nur relativ grob festgelegt sind und das nur zur Brutzeit verteidigt wird. Außerhalb der Brutzeit ist die Art eher gesellig, aber auch während derselben wird das Revier nur gegen offensichtliche Rivalen verteidigt. Andere, subdominante Vögel werden oft geduldet.\nDie Revierabgrenzung und die Nistplatzwahl erfolgen bei Stand- und Strichvögeln ab Februar, bei Zugvögeln gleich nach der Rückkehr, die manchmal recht spät liegen kann.\n\nFrühjahrsversammlungen: Wie bei anderen Rabenvogelarten kommt es beim Eichelhäher im Frühjahr oft zu zeremoniellen Versammlungen, die bei dieser Art besonders häufig und lautstark ablaufen. Sie bestehen aus 3 bis 30, seltener bis zu 50 Vögeln und sind ab März, manchmal bis Mitte Mai oder bis in den Juni hinein zu beobachten. Bisweilen entstehen sie schon innerhalb heimziehender Trupps. Bereits verpaarte Vögel nehmen daran teil oder ignorieren das Treiben, was allerdings bisher nur durch Beobachtungen an Volierenvögeln festgestellt werden konnte."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Der tagaktive Eichelhäher verhält sich während der Brutzeit zumeist sehr unauffällig, fällt aber durch sein ausgeprägtes, lautes Warnverhalten auf. Außerhalb der Brutzeit sieht man ihn oft in kleinen, zerstreuten Trupps, ziehend oder auf der Nahrungssuche. Sehr charakteristisch und auffällig ist der Flug der Art, der durch die unregelmäßigen Flügelschläge leicht unbeholfen wirkt und bei dem die auffällige Färbung besonders deutlich zur Geltung kommt. Meist werden nur kurze Strecken überflogen und geschickt die Deckung von Waldrändern und Gebüschen ausgenutzt, wobei weitere Vögel eines Trupps meist mit deutlichem Abstand folgen. Im Wald fliegt der Vogel sehr geschickt und wendig auch in geschlossenen Beständen. Auf dem Boden und im Geäst bewegt er sich meist hüpfend, wobei oft der Schwanz kurz aufgespreizt wird."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Mäusebussard",
        "wissenschaftlich": "Buteo buteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Turmfalke",
        "wissenschaftlich": "Falco tinnunculus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "pica_pica",
    "name_de": "Elster",
    "name_wissenschaftlich": "Pica pica",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Elster ist eine Vogelart aus der Familie der Rabenvögel. Sie besiedelt weite Teile Europas und Asiens sowie das nördliche Nordafrika. In Europa ist sie vor allem im Siedlungsraum häufig. Aufgrund ihres charakteristischen schwarz-weißen Gefieders mit den auffallend langen Schwanzfedern ist sie in Europa auch für den vogelkundlichen Laien unverwechselbar, ansonsten sieht sie dem Schildraben und der Elsterdohle ähnlich.",
    "wikidata_id": "Q25307",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Elster",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Siedlungsraum",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "bodenlebend",
      "masse_g": 217.5,
      "fluegellaenge_mm": 194.5,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 20
        },
        {
          "was": "Wirbeltiere",
          "prozent": 20
        },
        {
          "was": "Aas/Wirbeltiere",
          "prozent": 20
        },
        {
          "was": "Aas",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 70
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Am häufigsten lässt die Elster das „Schackern“ oder „Schäckern“ hören. Es besteht aus mehr oder weniger schnell aufeinander folgenden Rufreihen mit leicht krächzendem „schäck-schäck-schäck“. Das Schäckern ist ein Warn- und Alarmruf und dient der Verteidigung des Reviers. Nichtbrütende Elstern gebrauchen ihn nur, wenn Gefahr droht. Die Erregung der Tiere ist besonders groß, wenn das Schäckern schnell und abgehackt ist. So stellen sie sich bei langsamem Schäckern der Gefahr, fliehen aber bei schnellem Rufen.\nZur Festigung der Partnerschaft lassen Paare einen leisen Plaudergesang hören. Dieser variiert zeitlich und individuell sehr stark. Er kann sowohl rhythmisch als auch arhythmisch sein. Oft sind weiche Trillerlaute und hohes Pfeifen darin enthalten. Einzelne Vögel imitieren andere Tiere. Meist besteht der Gesang jedoch aus einem gurgelnden, bauchrednerischen Schwätzen mit Pfeiflauten.\n\nZur Reviermarkierung lassen Paare einen nach „kia“, „kjää“ oder „kik“ klingenden Ruf hören. Oft zeigen sie sich dabei in der Mitte des Reviers auf den höchsten Zweigen eines Baumes.\nNestlinge betteln mit einem hohen kreischenden „twiit“. Drei bis vier Wochen alte Jungvögel melden sich bei den Altvögeln durch einen zweisilbigen Ruf. Er klingt wie „jschiejäk“, „tschjuk“ oder „tschjuk-juk“. Der Kontaktruf des Weibchens ähnelt dem Standortruf der Jungvögel."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Die Grundfarben von Elstern der Nominatform sind Schwarz und Weiß. Der Schwanz ist gestuft und häufig so lang wie der gesamte Rest des Körpers, auf jeden Fall aber länger als die Flügel. Bauch, Flanken und Schultern sind weiß, auch die Handschwingen sind überwiegend weiß. Das restliche Gefieder ist schwarz mit irisierendem Glanz: Die Schwanzfedern und die Außenfahnen der Schwungfedern schimmern je nach Reflexionswinkeln – meist nur aus der Nähe erkennbar – metallisch grün, blau oder purpurfarben. Im Frühling werden die Farben matter und weniger schillernd. Auf den Außenfahnen der Handschwingen gehen sie fast ganz verloren. Am schillerndsten sind mehrere Jahre alte Vögel, insbesondere die Männchen, kurz nach der Mauser. Die männlichen und weiblichen Elstern unterscheiden sich äußerlich nicht voneinander, Männchen sind mit im Mittel 233 g jedoch etwas schwerer als Weibchen (im Mittel 203 g). Elstern können eine Körperlänge von etwa 46 cm erreichen, die Flügelspannweite beträgt etwa 48–53 cm.\nJunge Elstern, die einen leuchtend roten Rachen haben, sind fast ebenso gefärbt wie Altvögel, die Unterschiede sind sehr gering. Der Schwanz ist glanzlos und kürzer. Die äußeren Schulterfedern sind oft nicht reinweiß, sondern etwas grau. Die weißen Bereiche auf den Innenfahnen der äußeren Handschwingen reichen nicht so weit zur Federspitze wie bei den adulten Elstern."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Die Elster kommt sowohl im Flachland wie im Gebirge vor. Sie ist weltweit in Höhen bis 2500 m zu finden. Die Unterarten P. p. asirensis, P. p. bottanensis, P. p. hemileucoptera bilden Ausnahmen. So lebt P. p. bottanensis bis in 4000 Meter Höhe und sucht ihre Nahrung noch bis in über 5500 Meter Höhe.\nDie Elster besiedelt vor allem gut strukturierte, teilweise offene Landschaften mit Wiesen, Hecken, Büschen und einzelnen Baumgruppen. Sie lebt auch an Waldrändern, in der Nähe von Gewässern und in Sümpfen mit Röhricht, Weidengebüschen und Gestrüpp. Selten ist sie in schmalen Waldstreifen, kleinen Waldparzellen, ausgedehnten Wäldern und in gehölzfreien Wiesen- und Ackerlandschaften zu finden. Auch Steilhänge, schmale, tief eingeschnittene Täler sowie fels- und schneereiche Regionen werden gemieden. Nur die oben genannten Ausnahmen leben im Gebirge, teilweise auch jenseits der Schneegrenze.\nMehr als die Hälfte des Bestandes in Europa brütet heute Schätzungen zufolge in und am Rand von bebauten Bereichen. Sie besiedelt insbesondere Einfamilienhausbereiche mit kurz geschnittenen Rasenflächen, daneben Parkanlagen, Alleen, Friedhöfe und große Hausgärten. Früher war sie dagegen auch in Europa ein charakteristischer Vogel der Agrarlandschaft mit Hecken und Feldgehölzen, Alleen oder alten Obstgärten."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Grundsätzliches: Elstern nehmen das ganze Jahr über sowohl tierische als auch pflanzliche Nahrung auf. Die Nahrung besteht aus Insekten sowie deren Larven, Würmern, Spinnen und Schnecken. Darüber hinaus gehören kleine Wirbeltiere bis zu der Größe einer Feldmaus, beispielsweise Amphibien, Echsen, Kleinsäuger, Nestlinge und Eier sowie kleinere Vögel zu ihrer Speise. Außerdem fressen sie das ganze Jahr über Aas. Früchte, Sämereien und Pilze bilden insbesondere im Herbst und im Frühling Bestandteile ihrer Nahrung. Unverdauliches wird in Form von Speiballen ausgeschieden.\nDie Hälfte der Nahrung europäischer Elstern ist tierischen Ursprungs. In der Brutzeit decken sie damit 95 Prozent ihres Nahrungsbedarfs. Im Frühjahr und Sommerhalbjahr leben die Vögel in Europa vorwiegend oder ausschließlich von tierischer Nahrung. Im Herbst und Winter besteht die Nahrung dort zunehmend aus pflanzlichen Bestandteilen. In Europa befinden sich in den Speiballen zu einem Anteil von fünf bis zehn Prozent auch Reste von Wirbeltieren.\nDie Elster sucht ihre Nahrung meistens auf dem Boden. Bei Insekten- und Spinnenjagd in niedrigem Bewuchs läuft sie ein Stück, bleibt stehen, reckt sich hoch auf und hält Umschau. Ist eine Beute entdeckt, läuft oder hüpft sie rasch darauf zu und packt mit dem Schnabel zu."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Die Elster wird im ersten Herbst ihres Lebens geschlechtsreif. Sie wird dann Mitglied einer Gemeinschaft aus anderen Nichtbrütern. Im darauf folgenden Frühling brüten nur knapp die Hälfte der Männchen und gut die Hälfte der Weibchen.\n\nPaarbildung und Nistplatzwahl: Die Elster lebt in lebenslanger Monogamie, stirbt einer der Partner, ersetzt ihn der andere meistens schnell durch einen einjährigen Vogel. Wiederholen sich erfolglose Bruten zu häufig, trennen sich Paare in der Regel auch. Im Herbst verbringt ein zukünftiges Paar zunehmend mehr Zeit miteinander, bis sich beide aneinander gebunden fühlen (Umpaarungen). Sie gehen aber nach wie vor allein auf Nahrungssuche. Hat ein junges Elsternpaar ein Revier erobert, finden manchmal balzartige Handlungen statt.\nDie Inspektion der möglichen Nistplätze durch Herumstochern findet von Oktober bis Januar statt, in Mitteleuropa bis Februar. Männchen scheinen insbesondere durch Trockenheit und Temperaturen unter −4 °C aktiviert zu werden. Das Weibchen zeigt mögliche Nistplätze häufig durch Flügelzittern („Betteln“) an. Beide Vögel bekunden ihr Interesse an einem Nest manchmal durch Schackern oder einen speziellen Nestruf, durch Schwanzzittern, Blinken oder Flaggen."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Der Aktivitätsbeginn der Art liegt in der Regel etwa eine halbe Stunde vor Sonnenaufgang, variiert aber je nach Jahreszeit. Während der Stunde vor Sonnenuntergang nähern sich Elstern immer mehr ihrem Schlafplatz, den sie kurz darauf einnehmen.\nDie Elster lebt in zwei verschiedenen Sozialformen. In der Brutzeit leben Brutpaare allein in ihren Revieren, während sich Nichtbrüter zu Gruppen zusammenschließen. Im Winter bilden Elstern Scharen von einem Dutzend bis zu einigen hundert Vögeln.\n\nFortpflanzung: Die Elster wird im ersten Herbst ihres Lebens geschlechtsreif. Sie wird dann Mitglied einer Gemeinschaft aus anderen Nichtbrütern. Im darauf folgenden Frühling brüten nur knapp die Hälfte der Männchen und gut die Hälfte der Weibchen.\n\nPaarbildung und Nistplatzwahl: Die Elster lebt in lebenslanger Monogamie, stirbt einer der Partner, ersetzt ihn der andere meistens schnell durch einen einjährigen Vogel. Wiederholen sich erfolglose Bruten zu häufig, trennen sich Paare in der Regel auch. Im Herbst verbringt ein zukünftiges Paar zunehmend mehr Zeit miteinander, bis sich beide aneinander gebunden fühlen (Umpaarungen). Sie gehen aber nach wie vor allein auf Nahrungssuche. Hat ein junges Elsternpaar ein Revier erobert, finden manchmal balzartige Handlungen statt.\nDie Inspektion der möglichen Nistplätze durch Herumstochern findet von Oktober bis Januar statt, in Mitteleuropa bis Februar."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baumfalke",
        "wissenschaftlich": "Falco subbuteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Elster",
        "wissenschaftlich": "Pica pica",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Mäusebussard",
        "wissenschaftlich": "Buteo buteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Neuntöter",
        "wissenschaftlich": "Lanius collurio",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rotfuchs",
        "wissenschaftlich": "Vulpes vulpes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Steinmarder",
        "wissenschaftlich": "Martes foina",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Uhu",
        "wissenschaftlich": "Bubo bubo",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Waldohreule",
        "wissenschaftlich": "Asio otus",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "accipiter_gentilis",
    "name_de": "Habicht",
    "name_wissenschaftlich": "Accipiter gentilis",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Habicht ist ein Greifvogel, der zur Familie der Habichtartigen (Accipitridae) gehört. Das Verbreitungsgebiet der Art umfasst die arktischen bis subtropischen Zonen der Paläarktis. Habichte ernähren sich überwiegend von kleinen bis mittelgroßen Vögeln und Säugetieren bis zu einem Gewicht von etwa 1,0 kg. Die Art ist nicht gefährdet.",
    "wikidata_id": "Q25353",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Habicht",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Teilzieher",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Wirbeltierjäger",
      "lebensweise": "vielseitig",
      "masse_g": 866.0,
      "fluegellaenge_mm": 337.6,
      "nahrung": [
        {
          "was": "Wirbeltiere",
          "prozent": 90
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 100
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Habichte rufen fast ausschließlich in Horstnähe. Häufigster Ruf ist ein scharfes, oft gereihtes „gik, gik, gik“ („Gickern“), das allgemein bei Erregung, z. B. bei Störungen geäußert wird und besonders häufig während der Balz von Januar bis März zu hören ist. Diese Rufe sind bei ruhigem Wetter mehrere Hundert Meter weit hörbar. Der Kontaktruf zwischen den Brutpartnern ist ein kurzes, nicht sehr auffallendes „gjak“, das zum Beispiel einer Beuteübergabe oder der Ablösung bei der Brut vorausgeht. Falls der Partner nicht sofort reagiert, wird leise „gegickert“ oder ähnlich wie die Jungvogel langgezogen „hiiäh“ gerufen. Bei der Kopulation rufen beide Partner ein relativ hohes, gereihtes „wirr, wirr, wirr“. Sehr auffallend sind auch die lauten Bettelrufe der Jungvögel nach dem Ausfliegen, die wie „hiiiiääh“ oder „klijäh“ klingen („lahnen“) und ebenfalls häufig wiederholt werden."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Habichte sind mittelgroße Greifvögel; die Körperlänge beträgt 46–63 cm, die Spannweite 89–122 cm. Das Gewicht liegt zwischen 0,52 kg bei den kleinsten Männchen und 2,2 kg bei den größten Weibchen. Die große Spanne ist auf die deutliche Größen- und Gewichtszunahme von Südwesten nach Nordosten und den starken reversen Geschlechtsdimorphismus bezüglich der Körpergröße zurückzuführen. Das Weibchen ist etwa so groß wie ein Mäusebussard, das Männchen (in der Jägersprache Terzel) ist deutlich kleiner. So wogen beispielsweise im Osten Deutschlands adulte Männchen im Mittel 724 g, adulte Weibchen 1133 g, die Flügellänge betrug bei adulten Männchen aus demselben Gebiet im Mittel 314 mm, bei Weibchen 353 mm.\nDie Flügel sind relativ kurz, breit und an ihren Spitzen gerundet, der Schwanz ist relativ lang. Diese Merkmale sind typisch für die überwiegend waldbewohnenden Vertreter der Gattung Accipiter, sie ermöglichen keine extremen Fluggeschwindigkeiten, jedoch eine hohe Wendigkeit auf engem Raum.\nAusgewachsene (adulte) Habichte sind auf der Oberseite schiefergraubraun, auf der Unterseite weiß mit einer dunkelbraunen Querbänderung. Jungvögel sind bis zur ersten Mauser oberseits bräunlich, auf der Unterseite hellgelb, gelb, beige, orange oder lachsfarben mit einer senkrechten Tropfen- oder Strichzeichnung."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Habichte besiedeln in mehreren Unterarten die Nadelwälder der Taiga und der Gebirge (die sogenannten boreomontanen Wälder) sowie die Wälder der gemäßigten und der mediterranen Zone der gesamten Paläarktis. Im Norden fällt die Verbreitungsgrenze mit der nördlichen Grenze der borealen Nadelwälder (Taiga) in Skandinavien, Finnland und Russland zusammen, im Süden reicht die Verbreitung im Westen bis Nordafrika, weiter östlich bis Griechenland, Kleinasien und den Norden Irans.\nDer Amerikanische Habicht (Astur atricapillus) in Nordamerika wird seit 2023 als eigene Art betrachtet.\nDie für ein Vorkommen des Habichts zwingend erforderlichen Habitatvoraussetzungen beschränken sich in Europa auf einen für die Horstanlage geeigneten (über ca. 60 Jahre alten) Baumbestand und ein ausreichendes Angebot mittelgroßer Vögel und Säugetiere. Innerhalb ihres europäischen Verbreitungsgebietes besiedeln Habichte daher Wälder aller Art und Größe. Der Habicht kommt hier sowohl in großen, geschlossenen Waldgebieten wie auch in der offenen Kulturlandschaft vor, wenn dort zumindest einzelne Feldgehölze vorhanden sind.\n\nUrbane Populationen\nDer Habicht ist eine von zurzeit weltweit mindestens 20 Greifvogelarten, die auch in oder im Umfeld von Städten (urbanen Habitaten) leben."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Habichte erjagen ihre Beutetiere überwiegend aus dem bodennahen Flug oder vom Ansitz aus in einem kurzen, schnellen und sehr wendigen Verfolgungsflug direkt auf dem Boden oder im bodennahen Luftraum. Dabei werden natürliche Strukturen wie Hecken, Bäume, im Siedlungsraum aber auch Häuser sehr geschickt für einen gedeckten Anflug genutzt. Seltener werden aus dem hohen Kreisen heraus im Sturzflug Vögel im freien Luftraum oder in Bodennähe angejagt. Im Frühjahr und Sommer suchen Habichte systematisch in höherer Vegetation und auf Bäumen nach Nestern und erbeuten so zahlreiche nestjunge Vögel. Bei kleineren Vogelarten wird dabei häufig das ganze Nest mit Inhalt gegriffen, die leeren Nester sind dann häufig an den Rupfplätzen zu finden. Auch die Jagd zu Fuß wurde bei Habichten beobachtet, dabei werden zum Beispiel Maulwürfe erbeutet, auf dicht bewachsenen Inseln werden so auch brütende Stockenten geschlagen.\nDie Beute wird mit den Füßen gegriffen und getötet, indem sie insbesondere größere Tiere (Kaninchen, Fasane u. a.) durch einen „Kopfgriff“, bei dem sie den Kopf und auch oft den Hals mit den Zehen fest umschließen, ersticken bzw. strangulieren, wobei die Krallen der sehr kräftigen ersten und zweiten Zehe  die Beute fixieren, bis diese aufhört, sich zu bewegen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Territorialverhalten: Habichte sind monogam und streng territorial. Das Revier wird durch häufiges „gickern“ (vgl. Lautäußerungen) und durch Schauflüge markiert. Bei diesen Schauflügen werden in geradem Flug die Flügel langsam tief nach unten und wieder nach oben geschlagen. Dringen fremde Artgenossen in das Revier ein, wird zuerst durch Rufe versucht, den Eindringling zu vertreiben, anschließend durch Annäherung und weitere Rufe. Im Gegensatz zu anderen Greifvögeln erfolgen direkte Angriffe mit Körperkontakt bei Habichten im Rahmen territorialer Auseinandersetzungen offenbar nur als allerletztes Mittel. Vermutlich ist dies darauf zurückzuführen, dass eine solche Auseinandersetzung wegen der auf die schnelle Tötung von relativ großen Wirbeltieren spezialisierten Füße und Krallen für beide Parteien mit einem erheblichen Risiko verbunden ist.\n\nBrutbiologie: Habichte bauen große, voluminöse Nester (Horste) ausschließlich auf Bäumen. Das Mindestalter der für den Horstbau genutzten Bäume liegt bei etwa 60 Jahren. Innerhalb größerer Waldgebiete bevorzugt der Habicht Altholzbestände mit fast 100 % Kronenschluss, diese Bestände sind im Sommer in Bodennähe wegen des geringen Lichteinfalls oft sehr dunkel. Für den Horstbau werden meist die dominanten Bäume eines Bestandes genutzt, bevorzugt an einer kleinen Schneise oder an einem Weg."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Habichte sind monogam und streng territorial. Das Revier wird durch häufiges „gickern“ (vgl. Lautäußerungen) und durch Schauflüge markiert. Bei diesen Schauflügen werden in geradem Flug die Flügel langsam tief nach unten und wieder nach oben geschlagen. Dringen fremde Artgenossen in das Revier ein, wird zuerst durch Rufe versucht, den Eindringling zu vertreiben, anschließend durch Annäherung und weitere Rufe. Im Gegensatz zu anderen Greifvögeln erfolgen direkte Angriffe mit Körperkontakt bei Habichten im Rahmen territorialer Auseinandersetzungen offenbar nur als allerletztes Mittel. Vermutlich ist dies darauf zurückzuführen, dass eine solche Auseinandersetzung wegen der auf die schnelle Tötung von relativ großen Wirbeltieren spezialisierten Füße und Krallen für beide Parteien mit einem erheblichen Risiko verbunden ist."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "passer_domesticus",
    "name_de": "Haussperling",
    "name_wissenschaftlich": "Passer domesticus",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Haussperling – auch Spatz oder Hausspatz genannt – ist eine Vogelart aus der Familie der Sperlinge (Passeridae) und einer der bekanntesten und am weitesten verbreiteten Singvögel. Der Spatz hat sich vor über 10.000 Jahren als Kulturfolger dem Menschen angeschlossen. Nach zahlreichen absichtlichen oder versehentlichen Einbürgerungen ist er mit Ausnahme weniger Gebiete fast überall anzutreffen, wo Menschen sich das ganze Jahr aufhalten.",
    "wikidata_id": "Q14683",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Haussperling",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Siedlungsraum",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Pflanzenfresser",
      "nahrungsnische": "Körnerfresser",
      "lebensweise": "bodenlebend",
      "masse_g": 26.5,
      "fluegellaenge_mm": 74.9,
      "nahrung": [
        {
          "was": "Samen",
          "prozent": 60
        },
        {
          "was": "sonstige Pflanzenteile",
          "prozent": 30
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 50
        },
        {
          "was": "Unterholz",
          "prozent": 50
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Als gesellige Vögel verfügen Haussperlinge über viele Rufe. Der übliche Warnruf bei Luftfeinden ist strukturell abweichend gegenüber anderen Sperlingsvögeln ein weiches, getrillertes „drüüü“, wobei dieser Ruf auch gelegentlich gegenüber größeren Nahrungskonkurrenten wie Möwen verwendet wird. Vor Bodenfeinden wird mit anhaltendem nasalen Rufen wie „kew kew“ oder auch „terrettett“ gewarnt.\nDer Gesang des Haussperlings wird nur vom Männchen vorgetragen und besteht aus einem monotonen, relativ lauten, rhythmischen „Tschilpen“ (meist einsilbig, auch „schielp“, „tschuip“, „tschirp“, manchmal auch zweisilbig wie „tschirrip“ oder „tschirrep“). Die Tonhöhe und die Anordnung der Elemente variieren von Vogel zu Vogel erheblich. Während des Singens vergrößert sich der Kehllatz. Analysen haben ergeben, dass diese Lautäußerungen komplex komponiert sind und sowohl individuelle Merkmale als auch Stimmungen darin codiert sein können.\nZur Kopulation fordern Männchen und Weibchen mit leisen, gezogenen und nasalen Lauten auf, Weibchen verwenden dabei ein wiederholtes „djie“, der Kopulationsruf des Männchens ist ein wisperndes „iag iag“. Daneben gibt es einige weitere situationsabhängige Rufe, deren Dauer, Obertonstaffelung und -modulation recht verschieden gestaltet sein können (Stimmbeispiel).\nFreilebende Haussperlinge sind auch in der Lage, Alarmrufe von Staren und Amseln zu kopieren."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Haussperling ist ein kräftiger und etwas gedrungener Singvogel. Er wiegt rund 30 Gramm und erreicht eine Körperlänge von 14 bis 16 Zentimetern – er ist wenig größer als der nah verwandte Feldsperling. Der Haussperling fällt besonders durch seinen großen Kopf und den kräftigen, konischen Schnabel auf. Die Länge der Flügel beträgt 71 bis 82 Millimeter, die Spannweite misst etwa 23 Zentimeter. Männchen und Weibchen unterscheiden sich deutlich in ihrer Färbung: Die Männchen sind deutlich kontrastreicher gezeichnet als die Weibchen, sie haben eine schwarze oder dunkelgraue Kehle und einen schwarzen Brustlatz, der aber im Herbst nach der Mauser von helleren Federrändern verdeckt sein kann. Der Scheitel ist bleigrau und von einem kastanienbraunen Feld begrenzt, das vom Auge bis in den Nacken reicht. Die Wangen sind hellgrau bis weißlich. Der Rücken ist braun mit schwarzen Längsstreifen. Die Flügel sind ebenso gefärbt; eine weiße Flügelbinde ist deutlich erkennbar, eine zweite nur angedeutet. Brust und Bauch sind aschgrau. In Stadtzentren und Industriegebieten ist das Gefieder infolge von Verschmutzung meist weit weniger kontrastreich. Relativ häufig treten teilalbinotische Individuen auf.\n\nDie Weibchen sind unscheinbarer als die Männchen und matter braun, aber sehr fein gezeichnet. Die Oberseite ist hell graubraun, der Rücken schwarzbraun und gelbbraun gestreift."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Als ursprüngliches Biotop vor dem Anschluss an den Menschen werden trockenwarme, lockere Baumsavannen vermutet, dies bleibt jedoch mangels gesicherter Daten spekulativ. Beim Vordringen nach Mitteleuropa war der Haussperling bereits Kulturfolger mit einer ausgeprägten Bindung an den Menschen. Deutlich wurde dies beispielsweise während der Devastierung Helgolands nach dem Zweiten Weltkrieg, während der mit den Menschen auch die Haussperlinge verschwanden und erst nach der Neubesiedlung ab 1952 wieder zurückkehrten. In milden Zonen werden allerdings auch menschenferne Habitate genutzt.\nVoraussetzungen für Brutvorkommen sind die ganzjährige Verfügbarkeit von Sämereien und Getreideprodukten und geeignete Nistplätze. Optimal sind Dörfer mit Landwirtschaft, Vorstadtbezirke, Stadtzentren mit großen Parkanlagen, zoologische Gärten, Vieh- oder Geflügelfarmen und Einkaufszentren. Es werden aber auch außergewöhnliche Lebensräume besiedelt, wie beispielsweise von der Außenwelt abgeschlossene klimatisierte Flughafengebäude. Das höchstgelegene Brutvorkommen findet sich bei ungefähr 4.500 m im Himalaya, das tiefste bei -86 m im Death Valley in Nordamerika."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Der Haussperling ernährt sich hauptsächlich von Sämereien und dabei vor allem von den Samen kultivierter Getreidearten, die in ländlichen Gebieten 75 Prozent der Gesamtnahrung ausmachen können. Bevorzugt werden Weizen vor Hafer und Gerste. Regional und saisonal kann der Anteil der Samen von Wildgräsern und -kräutern den Getreideanteil erreichen oder übertreffen. Von Frühjahr bis Sommer spielt auch tierische Nahrung eine wichtige Rolle und kann bis zu 30 Prozent der Gesamtnahrung ausmachen. Dabei handelt es sich um Insekten in allen Entwicklungsstadien sowie andere Wirbellose. Vor allem in der Stadt zeigen Spatzen ein opportunistisches Verhalten und werden zu Allesfressern, was sie besonders an Imbissständen und in Freiluftlokalen unter Beweis stellen.\nDie Jungen füttert der Haussperling in den ersten Tagen fast ausschließlich mit Raupen und anderen zerkleinerten Insekten. Wenn zu wenig tierische Nahrung zur Verfügung steht und beispielsweise ausschließlich Brot an die Nestlinge verfüttert wird, kann das Verdauungsstörungen verursachen, die zum Tod der Nestlinge führen können. Mit zunehmendem Alter der Jungen verfüttern die Eltern dann mehr und mehr auch Sämereien, wobei der vegetarische Anteil auf ein Drittel steigt."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Die Geschlechtsreife tritt bei Haussperlingen am Ende des ersten Lebensjahres ein. Spatzen führen in der Regel eine lebenslange Dauerehe. Wenn ein Partner stirbt, finden Neuverpaarungen jedoch schnell statt. Vereinzelt kommt auch Bigynie (Polygynie) vor.\nIn Mitteleuropa beginnt die hauptsächliche Brutzeit Ende April und reicht bis August. Die auf der Südhalbkugel beheimateten Haussperlinge haben ihre Brutperiode an die dortigen Jahreszeiten angepasst. In diesem Zeitraum werden zwei bis drei, selten sogar vier Bruten aufgezogen. Bei den Erst- und Zweitbruten werden aus gut einem Drittel der gelegten Eier flügge Jungvögel, bei den späteren Bruten ist es nur noch ein Fünftel. Darüber hinaus ist die Mortalität der Jungvögel nach dem Ausfliegen in den ersten Wochen gravierend. Nach einem Jahr leben in ländlichen Gebieten nur noch 20 Prozent, in Stadthabitaten immerhin bis zu 40 Prozent der Jungvögel. Für die hohe Sterblichkeit dürften vor allem Schwierigkeiten bei der selbstständigen Nahrungsbeschaffung und hohe Predation maßgeblich sein.\n\nNeststandort und Nest: Der Haussperling ist Nischen-, Höhlen- und Freibrüter mit starker Neigung zum gemeinschaftlichen Brüten. Er nistet manchmal auch allein, oft aber in lockeren Verbänden oder Kolonien, wobei die Nester dabei meist einen Mindestabstand von 50 Zentimetern aufweisen."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Der Haussperling zeigt das ganze Jahr über ein geselliges und soziales Verhalten. Viele Verhaltensweisen des Haussperlings sind auf das Leben in der Gruppe ausgerichtet, und der Tagesablauf ist stark synchronisiert.\n\nAktivität: Haussperlinge werden während der bürgerlichen Dämmerung aktiv. Der Gesang beginnt im Mittel etwa 18 Minuten vor Sonnenaufgang, wobei durch Bewölkung verursachte Helligkeitsunterschiede weitgehend ohne Einfluss bleiben. Das Ende der Aktivität liegt auch im Winter noch vor Sonnenuntergang.\nIn mittleren Breiten werden gelegentlich nächtliche Aktivitäten beobachtet, zum Beispiel beim Insektenfang im Flutlicht von Industrieanlagen. Auch auf dem Empire State Building kann man mehr als 300 Meter über dem Erdboden nachts jagende Spatzen entdecken.\n\nNahrungserwerb: Die Nahrungsaufnahme erfolgt fast immer gesellig, auch während der Aufzucht der Jungen. Hierzu finden sich oft Schwärme, kleinere Trupps oder zumindest lose Verbände zusammen. In Getreidefeldern ist bei Trupps von etwa 20 Vögeln die Nahrungsaufnahme am effizientesten, da die für das Sicherungsverhalten verwendete Zeit in größeren Gemeinschaften kürzer wird, jedoch der Zeitaufwand für Auseinandersetzungen mit Artgenossen bei noch größeren Verbänden diese Zeitersparnis mehr als aufwiegt."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Hauskatze",
        "wissenschaftlich": "Felis catus",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Schleiereule",
        "wissenschaftlich": "Tyto alba",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Steinmarder",
        "wissenschaftlich": "Martes foina",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Turmfalke",
        "wissenschaftlich": "Falco tinnunculus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "prunella_modularis",
    "name_de": "Heckenbraunelle",
    "name_wissenschaftlich": "Prunella modularis",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Heckenbraunelle ist eine Vogelart aus der Gattung Braunellen, der einzigen Gattung in der gleichnamigen Familie Braunellen (Prunellidae). Die Heckenbraunelle ist in Mitteleuropa ein weit verbreiteter und häufiger Brut- und Sommervogel, der wegen des unauffälligen Gefieders aber meist nur durch seine Lautäußerungen auffällt. In einigen Gebieten Mitteleuropas ist sie sogar ein Jahresvogel. Heckenbraunellen sind besonders in jungen Fichtenbeständen anzutreffen. Im Gebirge kommen sie bis in die Knieholzregion vor.",
    "wikidata_id": "Q26698",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Heckenbraunelle",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "bodenlebend",
      "masse_g": 20.2,
      "fluegellaenge_mm": 69.1,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 50
        },
        {
          "was": "Samen",
          "prozent": 50
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 100
        }
      ]
    },
    "abschnitte": {
      "merkmale": {
        "titel": "Merkmale",
        "text": "Die Heckenbraunelle ist knapp 15 cm lang und damit etwas kleiner als ein Sperling. Sie wiegt durchschnittlich 20 Gramm. Brust und Kopf sind bleigrau bis schiefergrau; Rücken und Flügel sind satt dunkelbraun und schwarz gestreift. Der dunkle, dünne Schnabel ist charakteristisch. Männchen und Weibchen sehen gleich aus.\n\nDer Ruf ist ein dünnes, hohes „ziht“; der Gesang besteht aus einem eiligen, schlichten, nicht lauten, auf- und absteigenden Klirren ()."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Die Heckenbraunelle lebt an Waldrändern, in Gärten, Parks und Gebüschen, in den Alpen auch in der Krummholzzone. Ihre höchste Siedlungsdichte erreicht sie auf Flächen, die sehr dicht mit Jungfichten bestanden sind. Hier können je 10 Hektar zwischen fünf bis fünfzehn Brutpaare vorkommen. Auf Nadelwaldflächen mit höherem Nadelbaumbestand sinkt die Siedlungsdichte auf zwei Paare ab. Vergleichbare Werte werden auch für Misch- und Laubwälder erreicht."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Nahrung besteht im Sommer aus kleinen Raupen, Käfern, Larven, Puppen und Spinnen. Im Winter ernährt sie sich von feinen Samen. Zu den besonders stark genutzten Nahrungspflanzen zählen Brennnessel sowie Ampfer, Holunder, Mohn, Miere, Vogelknöterich, Gauchheil, Portulak sowie Gräser und Seggen. Im Frühjahr frisst sie auch Samen der Erle."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Heckenbraunellen haben sehr komplexe Paarbeziehungen. Da auch die Weibchen Reviere besetzen und diese sich mit den Revieren von zwei Männchen überlappen können, haben Heckenbraunellenweibchen gelegentlich zwei Männchen als Partner. Genauso häufig haben Männchen mehrere Weibchen oder ein dominantes Paar besetzt ein Territorium, bei dem unterlegene, aber ebenfalls verpaarte Männchen bei der Brutpflege helfen.\nMännchen benötigen nur eine Zehntelsekunde für die Kopulation und können sich mehr als 100 Mal am Tag paaren.\nDas Nest wird niedrig über dem Boden im Dickicht versteckt gebaut. Es befindet sich in der Regel zwischen 60 Zentimetern und drei Metern auf der Schattenseite eines Baumes, Strauches oder niedrigen Busches. Es besteht aus einem Napf aus Halmen, über die Moose verbracht werden. Dann wird es mit Haaren und Federn ausgepolstert. Es gibt zwei Jahresbruten im April und im Juli. Die erste Brut geht oft verloren. Die auffallend gefärbten Eier sind im April in der noch spärlich ausgebildeten Vegetation eine leichte Beute für Nesträuber. Das Gelege besteht aus drei bis sechs grünblauen Eiern und wird 13 bis 14 Tage vorwiegend vom Weibchen bebrütet. Die Jungen werden dann von beiden Eltern noch 11 bis 14 Tage gefüttert.\nDie Neuseeländischen Heckenbraunellen brüten in der Zeit von August bis Januar und ziehen in dieser Zeit zwei bis drei Gelege auf."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baumfalke",
        "wissenschaftlich": "Falco subbuteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Gartenschläfer",
        "wissenschaftlich": "Eliomys quercinus",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      }
    ]
  },
  {
    "id": "parus_major",
    "name_de": "Kohlmeise",
    "name_wissenschaftlich": "Parus major",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Kohlmeise ist eine Vogelart aus der Familie der Meisen (Paridae). Sie ist die größte und am weitesten verbreitete Meisenart in Europa. Darüber hinaus erstreckt sich ihr Verbreitungsgebiet über den Nahen Osten und durch die gemäßigte Zone Asiens bis nach Fernost.",
    "wikidata_id": "Q25485",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Kohlmeise",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "lichter Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 16.2,
      "fluegellaenge_mm": 70.9,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 40
        },
        {
          "was": "Früchte",
          "prozent": 20
        },
        {
          "was": "Samen",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "mittlere Höhe",
          "prozent": 60
        },
        {
          "was": "Unterholz",
          "prozent": 20
        },
        {
          "was": "Kronendach",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Die Kohlmeise verfügt über ein außerordentlich reiches, variables und differenziertes Repertoire an Lautäußerungen, das sehr gut untersucht ist.\n\nGesang: Der Reviergesang der Männchen ist eine Reihe metallisch reiner, hoher und lauter Motive aus typischerweise zwei, manchmal aber bis zu vier Silben verschiedener Tonhöhe, die beispielsweise als tsi-da … tsi-da … tsi-da oder zi-da-tit … zi-da-tit … zi-da-tit wiedergegeben werden kann. Selten sind Mischstrophen aus z. B. abwechselnd zwei- und dreisilbigen Motiven oder unterschiedlichen Rhythmen. Die Motive werden jeweils bis zu zehnmal wiederholt. Mit längeren Pausen dazwischen wird die ganze Reihe mehrfach, bei intensivem Reviergesang im Frühjahr auch dauerhaft und nahezu ununterbrochen vorgetragen. Nach mehreren Wiederholungen folgt oft ein Wechsel in ein anderes Motiv, wobei jedes Männchen ein Repertoire von 3–7, seltener von bis zu 18 verschiedenen Strophentypen hat. Neben der Anzahl der Silben variieren Tempo, Lautstärke, Rhythmus und Betonung, Tonhöhe oder -folge sowie Anzahl und Abstand der Wiederholungen. Weitere Variationen sind für das menschliche Ohr kaum oder nur als „Unreinheiten“ wahrnehmbar, könnten aber die individuellen Haupterkennungsmerkmale sein."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Die Kohlmeise zählt mit 13–15 cm Körperlänge zu den größeren Meisenarten und ist die größte Meise in Europa. Die Flügellänge beträgt bei Männchen etwa zwischen 71 und 82 mm, bei Weibchen etwa zwischen 69 und 81 mm. Die Schwanzlänge des Männchens liegt bei 59–66, die des Weibchens bei 55–63 mm. Das Gewicht liegt zwischen 14 und 22 g. Der 11,5–13,5 mm lange Schnabel ist verhältnismäßig kräftig und schwärzlich hornfarben mit etwas helleren Kanten. Die Iris ist lebhaft rötlichbraun bis schwarzbraun. Die Beine und Füße sind blaugrau bis schiefergrau. Die Geschlechter sind sich sehr ähnlich, lassen sich aber unter anderem aufgrund der Ausprägung des schwarzen Brustbands unterscheiden.\n\nAdulte Vögel: Bei adulten Männchen der Nominatform sind der Oberkopf, der obere Nacken, die Halsseiten, die Kehle und ein Band auf der Brustmitte glänzend blauschwarz. Wangen und Ohrdecken sind rein weiß und werden von den schwarzen Partien sauber eingefasst. Die Brust- und Bauchseiten sind schwefel- bis zitronengelb. Das schwarze Band in der Mitte erweitert sich zwischen den Beinen zu einem tiefschwarzen Fleck. Ein weißliches Band im Nacken trennt das Schwarz des Hinterkopfs vom Rücken und läuft nach hinten hin in ein grünliches Gelb aus. Rücken- und Schulterfedern sind sonst olivgrün mit gräulichem Anflug."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Die Kohlmeise brütet primär in Laub- und Mischwäldern, deren Baumbestand mit 60 oder mehr Jahren alt genug ist, um ein genügendes Angebot an Nisthöhlen zu gewährleisten, wobei sie auffallend häufiger in morschen Baumstubben als in Spechthöhlen nistet. In jüngeren Waldbeständen kommt sie nur vereinzelt vor, in geschlossenen Waldgebieten besiedelt sie nur die Randbereiche, Tallagen werden Bergwäldern vorgezogen. Die bevorzugte Waldzusammensetzung kann regional variieren, so finden sich im westlichen Mitteleuropa die höchsten Bestandsdichten in Eichenwäldern, weiter östlich hingegen in Nadelmischwäldern. Relativ niedrige Bestandsdichten werden in reinen Buchenwäldern erreicht; Kiefern- und Fichtenforste sind im Allgemeinen nur sehr dünn besiedelt. In Sibirien zieht die Art Birken-, Weiden- und Mischwälder den reinen Nadelwäldern aus Fichten und Tannen vor. In Zentralasien besiedelt sie vor allem flussnahe Wälder.\nAufgrund ihrer großen Anpassungsfähigkeit ist die Kohlmeise aber auch in zahlreichen anderen Habitaten mit altem Baumbestand oder künstlichen Nisthöhlen zu finden. Sie besiedelt neben Feldgehölzen, Baumgruppen, Hecken mit eingestreuten Bäumen, Parks, Friedhöfen, Olivenhainen und Obstgärten auch Gärten oder Grünflächen mit Einzelbäumen inmitten von Städten."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Kohlmeise ist in ihrer Ernährung wenig spezialisiert. Das Nahrungsspektrum ist daher sehr umfangreich, jedoch liegt der Schwerpunkt deutlich auf Insekten sowie deren Larven und Eiern. Ergänzend kommen regelmäßig andere Arthropoden – vor allem Spinnen und Weberknechte – hinzu. Je nach Verfügbarkeit, geografischer Lage und Jahreszeit werden aber auch teils ausgiebig andere Nahrungsquellen genutzt wie Sämereien, Nussfrüchte, Obst, vom Menschen zur Verfügung gestelltes Vogelfutter, Abfälle oder gelegentlich auch Aas. Vor allem in den nördlichen Teilen des Verbreitungsgebiets können Sämereien, Bucheckern und Haselnüsse im Winter eine wichtige Nahrungsgrundlage bilden. Um den Calciumbedarf zu decken, werden Teile von Schneckenhäusern und Eierschalen gefressen und auch an Nestlinge verfüttert.\nDie tierische Nahrung besteht zur Brutzeit vorwiegend aus Raupen von Eulenfaltern und Spannern. In Mitteleuropa sind dies beispielsweise je nach Lebensraum insbesondere die häufigen Arten Eichenwickler, Kleiner Frostspanner oder Kieferneule. An die Jungen werden meist besonders große Raupen verfüttert. Bei geringem Angebot an Raupen können Spinnentiere eine größere Rolle als Nestlingsnahrung einnehmen. Bedeutend sind zudem auch Imagines und Larven von Zweiflüglern, Käfern und Hautflüglern."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Kohlmeisen werden gegen Ende des ersten Lebensjahres geschlechtsreif; es schreiten jedoch nicht alle Einjährigen zur Brut. Da der Anteil an Männchen in den meisten Populationen überwiegt, finden insbesondere junge Männchen oft keine Partnerin. Es gibt jedoch auch einen zunehmenden Anteil an Nichtbrütern unter mehrjährigen Vögeln.\nKohlmeisen führen eine monogame Saisonehe. In Fällen, in denen bei einer zweiten Jahresbrut der Partner ein anderer ist, ist dies meist auf den Verlust des vorigen Partners zurückzuführen. Aufgrund der hohen Ortstreue kommt es in mehreren aufeinanderfolgenden Jahren oft zu Wiederverpaarungen und langjährige Dauerehen wurden nachgewiesen. Außerhalb der Brutzeit besteht jedoch kaum Zusammenhalt zwischen Partnern.\nZwei Jahresbruten sind nicht selten. In Südengland finden eher in Nadel- und Mischwäldern Zweitbruten statt. In Eichenwäldern, in denen früh im Jahr ein Überangebot an Insektennahrung, später jedoch ein Mangel herrscht, brütet die Art jedoch meist nur einmal. Drittbruten kommen vor, sind aber selten. Ausnahmsweise kommt es in Israel zu Bruten im Winterhalbjahr.\nDie Brutzeit liegt zwischen März und Juli. In Israel wurden teils bereits ab Ende Januar Gelege festgestellt."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Die Kohlmeise verhält sich meist recht auffällig und ist wenig scheu. Sie bewegt sich überwiegend hüpfend und kletternd im Geäst oder auf dem Boden. Oft wird dies durch Flügelschläge oder kurze Gleitphasen unterstützt. Seltener als andere Meisen hängt sie kurzzeitig kopfüber an Zweigen. Sie ist auch in der Lage, wie ein Kleiber kopfüber an einem Stamm abwärts zu klettern. Aufgrund der relativ kurzen, runden Flügel und der langen Steuerfedern fliegt sie wendig und schnell durch das Geäst von Bäumen oder Unterholz. Freies Gelände wird meist nur zögerlich in recht langsamem, bogenförmigem Flug überflogen.\nDie Kohlmeise ist tagaktiv und zeigt ganzjährig in den frühen Morgenstunden die höchste Aktivität. Außerhalb der Brutzeit gibt es zudem abends ein zweites Aktivitätsmaximum. Der Gesang setzt kurz nach der bürgerlichen Dämmerung ein und erreicht seine höchste Intensität etwa eine Viertel- bis halbe Stunde später. Im Winterhalbjahr, teils auch schon vermehrt nach der Mauser, nächtigen Kohlmeisen in Höhlen. Der Schlaf ist sehr fest, wobei der Vogel an den Höhlenboden gekauert oder an eine Nistkastenwand angeschmiegt ist und den Kopf bei eingezogenem Hals schräg in die Höhe richtet. Sehr kalte Nächte überstehen Kohlmeisen, indem sie ihre Körpertemperatur von üblicherweise 41,8 °C auf 32 °C absenken und so wenig Energie verbrauchen."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Buntspecht",
        "wissenschaftlich": "Dendrocopos major",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Kreuzotter",
        "wissenschaftlich": "Vipera berus",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "corvus_corax",
    "name_de": "Kolkrabe",
    "name_wissenschaftlich": "Corvus corax",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Kolkrabe ist eine Singvogelart aus der Familie der Rabenvögel (Corvidae). Durch menschliche Verfolgung waren Kolkraben bis 1940 in weiten Teilen Mitteleuropas ausgerottet und haben sich danach durch nachlassende Verfolgung wieder ausgebreitet. Der wissenschaftliche Name Corvus corax setzt sich aus dem lateinischen Corvus und dem griechischen Corax zusammen, beides bedeutet „Rabe“. Kolk, die erste Silbe seines seit dem 16. Jahrhundert bezeugten deutschen Namens, ist vermutlich lautmalerischen Ursprungs, ahmt also den Ruf des Vogels nach.",
    "wikidata_id": "Q25357",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Kolkrabe",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Teilzieher",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "bodenlebend",
      "masse_g": 928.0,
      "fluegellaenge_mm": 419.7,
      "nahrung": [
        {
          "was": "Wirbeltiere",
          "prozent": 20
        },
        {
          "was": "Aas",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 80
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der am häufigsten zu hörende Ruf ist ein lautes und scharfes „kraa“, das bei Bedrohung geäußert wird; bei starker Bedrohung wird gereiht „kraa, kraa, kraa, kraa“ oder „rak, rak, rak, rak“ gerufen. Beim paarweisen Gleit- oder Schlagflug über weitere Strecken sowie bei mit der Balz in Verbindung stehenden Flugmanövern wie Luftrollen oder Wellenflügen wird häufig einzeln „klong“, „raok“ oder „oang“ gerufen. Darüber hinaus verfügen Kolkraben über eine große Vielfalt von Lautäußerungen; ihr Repertoire umfasst „mehrsilbige, an Kolken, Grunzen, Rülpsen, Knarren, Sirren bis zu hellen Xylophonklängen erinnernde Laute“, bei mitteleuropäischen Raben wurden mindestens 34 verschiedene Ruftypen gefunden. Schließlich imitieren Kolkraben gern Geräusche und Rufe anderer Tierarten: Rufe von Krähen, den Balzgesang des Auerhahns, Hundegebell.\nKolkraben können ihre Stimmlage je nach Art der Bekanntschaft mit einem Artgenossen verändern: Auf fremde Artgenossen reagieren sie mit deutlich tieferer und rauerer Stimme als auf ihnen vertraute Raben, und ihnen aus früheren Begegnungen als „freundlich“ bekannte Raben werden mit höherer Stimme begrüßt als ihnen als „unfreundlich“ bekannte Individuen."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Kolkrabe ist mit einer Körperlänge von 54 bis 67 cm und einer Flügelspannweite von 115 bis 130 cm größer als ein Mäusebussard und der mit Abstand größte europäische Rabenvogel. Der Unterschied zwischen männlichen und weiblichen Tieren ist bezüglich der Größe gering, Männchen sind im Mittel etwas größer und schwerer als Weibchen. In einer Untersuchung in Polen hatten adulte Männchen eine Flügellänge von 388–442 mm, im Mittel 423,3 mm und wogen 1080–1370 g, im Mittel 1254 g, Weibchen hatten eine Flügellänge von 395–433 mm, im Mittel 413,8 mm, und wogen 1070–1235 g, im Mittel 1147 g. Der Schnabel ist sehr groß und kräftig, der First des Oberschnabels ist deutlich nach unten gebogen.\nBei adulten Vögeln ist das Gefieder einfarbig schwarz und je nach Lichteinfall metallisch grün oder blauviolett glänzend. Die Iris ist dunkelbraun, Beine und Schnabel sind schwarz. Die Federn an der Kehle sind verlängert und lanzettlich zugespitzt; vor allem wenn die Vögel rufen, stehen diese Federn deutlich ab. Der Schwanz ist am Ende deutlich keilförmig. Im Flug sind neben dem keilförmigen Schwanz die langen und im Handflügel deutlich verschmälerten Flügel sowie der kräftige Hals mit dem großen Kopf und dem großen Schnabel kennzeichnend.\nIm Jugendkleid fehlt dem Gefieder fast völlig der Metallglanz, es ist oberseits braunschwarz, auf der Unterseite braun."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Der Kolkrabe ist hinsichtlich der besiedelten Lebensräume sehr anpassungsfähig und bewohnt Hochgebirge, Wälder sowie offene und halboffene Landschaften aller Art von der Tundra im Norden über die mitteleuropäische Kultursteppe bis zu Halbwüsten im Süden des Verbreitungsgebietes. Mit abnehmender menschlicher Verfolgung werden zunehmend siedlungsnahe Bereiche bewohnt – so gab es in Berlin Ende der 1990er Jahre bereits mindestens 15 Brutpaare."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Wie viele Rabenvögel ist der Kolkrabe Allesfresser, wobei tierische Anteile meist überwiegen. Das Nahrungsspektrum umfasst kleine Wirbeltiere aller Art sowie deren Entwicklungsstadien (z. B. Vogeleier), größere Insekten, Regenwürmer und weitere Wirbellose, Aas jeder Größe, Früchte, landwirtschaftliche Produkte wie Mais sowie menschliche Nahrungsabfälle jeder Art."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Der Eintritt der Geschlechtsreife bei Männchen ist bisher nicht bekannt, Weibchen sind im Alter von 3 Jahren geschlechtsreif, brüten meist erst im Alter von vier Jahren. Kolkraben leben in monogamer Dauerehe, revierbesitzende Paare sind ganzjährig in den Revieren anzutreffen. Die Partner erkennen sich an der Stimme. Die Balz erfolgt in Mitteleuropa überwiegend im Spätwinter. Sie besteht aus paarweisen Flugspielen über dem Revier wie gemeinsamem Kreisen, halben Flugrollen und Wellenflügen, wobei oft gerufen wird. Zur Balz gehören weiterhin gegenseitige Gefiederpflege, Kraulen mit dem Schnabel und gegenseitiges Füttern.\nDas Nest wird je nach Angebot variabel auf Bäumen, in Felswänden oder auf künstlichen Unterlagen errichtet, in Mitteleuropa in den letzten Jahrzehnten zunehmend auf Hochspannungsmasten, vereinzelt an exponierten Gebäuden. In Norddeutschland werden die Nester überwiegend auf Rotbuchen gebaut, in Ostdeutschland am häufigsten auf Waldkiefern. Beide Partner bauen; das meist runde Nest besteht aus recht groben, toten Ästen; die Mulde wird mit Erdklumpen, Wolle, Fellfetzen, Haaren, Bindegarn und ähnlichem ausgelegt. Die Nester werden oft mehrfach genutzt, viele Paare haben ein oder mehrere Wechselnester."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Wie andere Rabenvögel spielen Kolkraben oft. Typische Spiele, vor allem mit Artgenossen, sind „Rodeln“ oder herunterrollen lassen im Schnee, auf Sanddünen oder an sonstigen glatten Strukturen, das Kopfunterhängen oder Schaukeln, letzteres gelegentlich bis zur Riesenfelge, auch Balancieren und Spiele mit Gegenständen."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Kolkrabe",
        "wissenschaftlich": "Corvus corax",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "buteo_buteo",
    "name_de": "Mäusebussard",
    "name_wissenschaftlich": "Buteo buteo",
    "kurzbeschreibung": "species of bird of prey",
    "beschreibung": "Der Mäusebussard ist ein Greifvogel aus der Familie der Habichtartigen und der häufigste Vertreter dieser Familie in Mitteleuropa. Er ist mittelgroß und kompakt, das Gefieder variiert von Dunkelbraun bis fast Weiß. Er kann oft bei seinen kreisenden Segelflügen oder bei der Ansitzjagd beobachtet werden. Den Hauptteil der Nahrung machen Kleinsäuger aus. Lebensraum sind offene Landschaften wie Wiesen, Äcker und Heide mit angrenzenden Waldgebieten, in denen das Nest gebaut wird.",
    "wikidata_id": "Q25385",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/M%C3%A4usebussard",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Grasland",
      "zugverhalten": "Teilzieher",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Wirbeltierjäger",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 759.1,
      "fluegellaenge_mm": 382.9,
      "nahrung": [
        {
          "was": "Wirbeltiere",
          "prozent": 90
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 100
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der Mäusebussard ist ein vergleichsweise viel rufender Greifvogel. Der oft im Flug zu hörende, laute Ruf klingt abfallend miauend und wird gerne vom Eichelhäher imitiert. Es ist der bekannte Bussardruf „hiääh“, der während des ganzen Jahres, meistens jedoch während der Brutsaison, zu hören ist. Der sehr ähnliche Alarmruf beginnt mit platzendem „pi“, auf das ein weniger grelles „-jää“ folgt. Er kann auch von den Jungvögeln ab etwa 20 Tagen Lebensalter zu hören sein. Es gibt keine geschlechtsspezifischen Rufmerkmale. Der Alarmruf wirkt meist „ärgerlicher“ als der öfter zu hörende, mehr „miauende“ Ruf.\nDie Jungvögel betteln ab dem ersten Lebenstag mit „piij piij“, was ab etwa zwölf Tagen tiefer und kräftiger klingt. Die Einzellaute bestehen dann aus einer betonten Vorsilbe und einer tieferen zweiten Silbe: „biijüüi biijüüi …“. Wenn das Nest verlassen wird, also etwa ab dem 40. Lebenstag, besteht dieser Laut oft nur noch aus der zweiten Hälfte. Je nach Hunger der Jungvögel können diese dann in Serien in Abständen von wenigen Sekunden bis zu langen Pausen gerufen werden. Ab Juli sind diese besonders auffälligen Bettelrufe vor allem als Standortrufe abseits vom Nest zu hören."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Mäusebussard ist ein mittelgroßer, kompakter Greifvogel. Er ist 51 bis 57 Zentimeter lang und hat 113 bis 128 Zentimeter Flügelspannweite. Die Flügel sind relativ breit, der relativ kurze Schwanz ist am Ende abgerundet. Während des kreisenden Segelfluges werden die Flügel flach v-förmig aufgestellt. Die Handschwingenspitzen sind immer dunkel, der Schwanz meist durchgehend eng gebändert. Der Kropfbereich (Brustlatz) ist meist längsgestreift, seltener einfarbig weiß bis schwarzbraun und auch bei sonst heller Unterseite meist dunkel. Das oft hellere Brustband ist dunkel längsgestreift bei Jungvögeln und quergebändert bei Altvögeln. Die Unterschwanzdecken sind einfarbig, gefleckt oder gebändert. Die Federn an den Unterschenkeln, die sogenannten Hosen, sind einfarbig, gebändert oder längsgestreift. Die beiden zuletzt genannten Gefiederpartien können heller bei dunklen und dunkler bei hellen Unterseiten sein. Der Schwanz ist das sicherste Merkmal, um die Nominatform des Mäusebussards von seinen Unterarten und vom Raufußbussard zu unterscheiden. Bei der Nominatform des Mäusebussards sind die Schwanzfedern grau, braun oder rostrot mit acht bis zwölf dunklen Querbinden. Die weitere Färbung und Zeichnung ist sehr variabel."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Der Mäusebussard bewohnt vor allem kleine Waldgebiete mit angrenzenden, offenen Landschaften, wo er fast ausschließlich seine Nahrung sucht. Im Umfeld des Waldes bevorzugt er Weiden, Wiesen, Heide und Feuchtgebiete oder durch Menschen kurzgehaltene Vegetation. Bruten in Höhen über 1000 Meter über dem Meeresspiegel sind selten. Oft sind Mäusebussarde entlang von Autobahnen auf Pfosten sitzend zu sehen, da sie diese und andere Wege bei der Jagd absuchen. Bei der Nistplatzwahl werden Waldkanten kleinerer Altholzbestände bevorzugt, seltener wird das Innere geschlossener Wälder oder schmale Grenzstreifen zwischen Feldern oder Einzelbäume besiedelt. Zunehmende Besiedlungen baumarmer Landschaften wurden auf Kontrollflächen in der Nähe von Potsdam und im Westen von Schleswig-Holstein beobachtet. Dabei wurde auch ein hoher Anteil von Bruten in Pappelreihen festgestellt, aber auch auf Einzelbäumen und in Kleingehölzen im Abstand von unter hundert Metern zu Einzelgehöften. Diese Neubesiedlungen wurden schon davor als nicht selten bezeichnet. Es gibt erfolgreiche Bruten in direkter Nähe zu Häusern im Siedlungsbereich.\nDie Wahl der Art des Nistbaums, der meistens an der Basis mindestens 20 Zentimeter Durchmesser hat, ist vom lokalen Angebot abhängig."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Hauptnahrung des Mäusebussards sind Kleinsäuger, in Mitteleuropa vor allem Feldmäuse, wobei auch größere Tiere, wie verletzte oder geschwächte Hasen oder Kaninchen erlegt werden. Weiterhin jagt er Vögel, meistens Jungvögel, Reptilien, z. B. Eidechsen, Blindschleichen und Ringelnattern, sowie Amphibien, meistens Frösche und Kröten. Insekten und deren Larven können genauso wie Regenwürmer teilweise einen kleinen Anteil an der Beute ausmachen. Auch Fische sind in einigen Fällen als Nahrung nachgewiesen worden, werden jedoch meist tot oder verendend eingesammelt. Gleiches gilt für größere Vögel, wie z. B. Tauben, die verletzt, bereits verendet oder von anderen Greifvögeln schmarotzt zur Nahrung des Mäusebussards werden. Oft nehmen Mäusebussarde Aas von überfahrenen Tieren von Verkehrswegen auf und werden dabei mitunter selbst überfahren. Zuverlässige Daten zum Nahrungsspektrum konnten bisher nur in einzelnen Untersuchungen aus den aufgesammelten Beuteresten am Nest oder aus der Analyse von Mageninhalten gewonnen werden. Die Analyse von Gewöllen gibt dabei nur unzureichend Aufschluss über die Zusammensetzung der Nahrung."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Ab einem Alter von zwei bis drei Jahren sind Mäusebussarde geschlechtsreif, was durch Beobachtung von mit Flügelmarken versehenen Individuen in Wales ermittelt wurde.\nWegen ihrer verhältnismäßig großen Reviertreue können Brutpaare ein Leben lang zusammenbleiben. Mäusebussarde können bis zu 26 Jahre alt werden.\nDie Eiablage beginnt in Mitteleuropa ab Mitte März, im Durchschnitt findet sie Mitte April statt. Die Eier sind durchschnittlich 56 × 45 mm groß und wiegen 50–60 g. Sie sind mehr oder weniger stark rotbraun und graubraun gefleckt auf weißem Grund. Das Gelege besteht meistens aus zwei bis drei Eiern, Gelege mit einem oder vier Eiern kommen auch vor. Die Eier werden im Abstand von zwei bis drei Tagen gelegt. Die Brutdauer beträgt 33 bis 35 Tage und hängt von der Gelegegröße ab, da bei Dreier- und Vierergelegen später mit dem Brüten angefangen wird als bei Einer- und Zweiergelegen. Nach dem Schlupf bleiben die jungen Mäusebussarde 42 bis 49 Tage im Nest und sind dann zwar flügge, halten sich aber noch auf den Ästen und Nachbarbäumen um das Nest herum auf. Diese Bettelflugphase im Anschluss an die Nestlingszeit kann sechs bis zehn Wochen dauern. Hier fliegen die Jungen den Eltern zunehmend hinterher und werden solange von ihnen versorgt, bis sie selbständig sind. Anschließend streichen die jungen Mäusebussarde aus dem Brutrevier ab."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Während der Brutsaison verteidigen Mäusebussarde – ein territoriales Verhalten – ihr Brutrevier um den Horstbaum. Während der Balz ab Mitte Februar vollführen die Brutpaare Balzflüge über dem Brutrevier. Sie bestehen aus gemeinsamem, segelnden Kreisen, bei dem viel gerufen wird. Dann folgt ein sinusähnliches Fallen und Steigen, welches meistens mit einem Sturzflug zum Nest beendet wird.\nFremde Mäusebussarde werden durch schnellen Anflug mit kräftigen Flügelschlägen aus dem Luftraum über dem Brutrevier vertrieben. Während der Brut und Jungenaufzucht werden diese Grenzstreitigkeiten zwischen Nachbarpaaren seltener. Mit einzelnen fremden Mäusebussarden kann es gelegentlich noch zu Auseinandersetzungen kommen.\nMäusebussarde sind außerhalb der Brutsaison eher in losen, weit verteilten Gruppen anzutreffen. Dies betrifft vor allem Flächen mit entsprechend hohem Nahrungsangebot, also Wiesen, Felder und feuchte Niederungen. Sie werden im Winter vermehrt von Mäusebussarden (auch Wintergästen) genutzt. Diese halten sich dann meist den ganzen Tag dort auf, nur zum Schlafen werden Bäume aufgesucht. Besonders an Fallwild und bei Nahrungsmangel in strengen Wintern kann es zur Bildung von Gruppen mit entsprechenden Rangordnungen kommen, d. h., es gibt einzelne Individuen, die gegenüber ihren Artgenossen den Vorrang haben, der auch erkämpft und verteidigt wird."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Mäusebussard",
        "wissenschaftlich": "Buteo buteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "corvus_corone",
    "name_de": "Rabenkrähe",
    "name_wissenschaftlich": "Corvus corone",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Rabenkrähe ist eine Vogelart aus der Familie der Rabenvögel (Corvidae). Sie ist eng mit der grau-schwarzen Nebelkrähe verwandt, mit der sie sich auch verpaart. Beide Arten wurden früher als zwei Unterarten oder Morphen derselben Art aufgefasst, die traditionell als Aaskrähe bezeichnet wurde – eine Auffassung, die von einigen Autoren weiterhin vertreten wird. Aufgrund der engen Verwandtschaft beider Schwesterarten, bzw. Unterarten, wird in der folgenden Darstellung das traditionelle Bild der Unterarten verwendet und der Artname „Aaskrähe“ für die gemeinsame Klade verwendet. Die Forschungsdiskussion zur Aufteilung beider Arten wird unten im Abschnitt „Systematik und Taxonomie“ dargestellt.",
    "wikidata_id": "Q26198",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Rabenkr%C3%A4he",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Siedlungsraum",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "bodenlebend",
      "masse_g": 570.0,
      "fluegellaenge_mm": 323.9,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 30
        },
        {
          "was": "Wirbeltiere",
          "prozent": 20
        },
        {
          "was": "Aas/Wirbeltiere",
          "prozent": 20
        },
        {
          "was": "Aas",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 90
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Die Rufe von Aaskrähen sind sehr charakteristisch und über weite Entfernungen zu hören. Häufigster Ruf der Vögel ist ein raues, kraftvolles Krah in verschiedenen Varianten und unterschiedlicher Intensität. Es wird von den Vögeln in der Regel zur Stimmfühlung genutzt und oft ein- bis viermal wiederholt. Eine häufige Abwandlung dieses Stimmfühlungslautes wird von Aaskrähenmännchen im Rahmen von Imponiergehabe verwendet. Das Krah wird dabei zu einem schnarrenden, langgezogenen Kraar, das rhythmisch wiederholt wird. Dabei nehmen die Vögel eine typische Pose ein, bei der der Schwanz gespreizt, der Rücken gekrümmt und der Kopf auf- und abgeworfen wird. Hasslaute reichen von kehligen, quarrenden Krährufen für eher ungefährliche Greifvögel bis hin zu einem scharfen, hastigen arr, arr für den von den Aaskrähen gefürchteten Habicht (Accipiter gentilis). Das restliche Lautrepertoire umfasst eine Reihe von knarrenden, krähenden und ratternden Rufen sowie hohe, kurze Bettellaute. Jung- wie Altvögel lassen bisweilen einen unmelodiösen Subsong vernehmen, der sich aus verschiedenen sehr unterschiedlichen Lauten zusammensetzt, zu denen aus ihrem üblichen Kontext befreite Rufe, Umgebungsgeräusche oder auch die Laute anderer Tiere zählen. Er ist für gewöhnlich sehr leise und wird von Jungvögeln nur in Abwesenheit von Artgenossen gesungen. Altvögel singen allein auf hohen Wipfeln oder im Nest."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Körperbau und Gefieder: Aaskrähen erreichen ausgewachsen eine Körperlänge von 45 bis 47 cm und eine Spannweite von 93 bis 104 cm. Ihr hoher, etwas gebogener und kräftiger Schnabel, ihre kurzen, anliegenden Schenkelfedern und ihr voluminöses Körpergefieder verleihen ihnen ein kompaktes, gedrungenes Erscheinungsbild. Ihre Flügel sind relativ lang und moderat gefingert, ihr Schwanz breit und leicht gerundet. Die Flügelspitzen ragen im angelegten Zustand knapp über die Schwanzspitze hinaus. Zwischen Männchen und Weibchen besteht statistisch ein Geschlechtsdimorphismus: Weibliche Aaskrähen bleiben im Mittel geringfügig kleiner und sind etwas schlanker gebaut. Das Körpergewicht adulter männlicher Tiere liegt bei 418–740 g, das weiblicher Tiere bei 370–670 g. Der männliche Flügel misst zwischen 292 und 387 mm, weibliche Tiere erreichen Flügellängen von 283 bis 370 mm. Der Schwanz der Männchen wird 173–202 mm lang, der der Weibchen 170–191 mm. Der Lauf misst 57–68 mm bei männlichen, 53–62 mm bei weiblichen Aaskrähen. Der Schnabel der Vögel erreicht Längen von 52–65 mm (Männchen) beziehungsweise von 50–57 mm (Weibchen). Aufgrund ihrer Größe hat die Aaskrähe nur wenige Fressfeinde, nur spezialisierte Vogeljäger wie Habicht (Accipiter gentilis), Wanderfalke (Falco peregrinus) oder Uhu (Bubo bubo) sind in der Lage, ausgewachsene Tiere zu schlagen."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Offene und halboffene Landschaftsformen kennzeichnen die bevorzugten Lebensräume von Aaskrähen. Die Vögel sind auf Bäume, hohe Sträucher oder vergleichbare anthropogene Strukturen als Schlaf- und Nistplätze sowie Sitzwarten angewiesen. Regional können auch Felsklippen diese Funktion übernehmen. Für die Nahrungssuche nutzen sie weitflächige, kurzrasige Flächen, die gut überschaubar sind, beide Elemente müssen also in einer gewissen Nähe zueinander vorkommen. In Waldgebieten ist die Art deshalb auf Uferbereiche, Moore und Lichtungen beschränkt; die Entwaldung weiter Teile Eurasiens im Holozän eröffnete ihr hingegen neue Habitate wie Acker- und Weideland, Dörfer und Städte. Die Begrünung der europäischen Großstädte durch Parks und Alleen ließ sie ab dem 19. Jahrhundert auch in deren Zentren vordringen. Die moderne Verstädterung setzte bei der Aaskrähe in Europa aber zunächst nur zögerlich ein. Erst mit zunehmendem Wohlstand und flächendeckender Verfügbarkeit von menschlichen Abfällen in der zweiten Hälfte des 20. Jahrhunderts konnten sich die Tiere in größerer Zahl in den Städten etablieren. Mittlerweile kommt sie dort wegen besseren Nahrungsangebotes und geringeren Druckes durch Jagd und Fressfeinde meist in höheren Bestandsdichten vor als in ländlichen Gebieten."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Aaskrähen sind Allesfresser und ernähren sich sehr vielseitig. Die Hauptnahrungsquellen der Art sind Getreidesamen und Wirbellose, hinzu kommen kleine Wirbeltiere, Vogeleier, Aas und Abfälle. Die Zusammensetzung des Nahrungsspektrums variiert stark nach Angebot, Lebensraum und Jahreszeit. Getreide ist im britischen Oxfordshire das ganze Jahr über, vor allem aber im Herbst und Winter von Bedeutung. Kleinfrüchte und Obst werden gegen Herbst wichtig, spielen im Rest des Jahres aber meist eine untergeordnete Rolle. Auf den windgeschorenen Wipfelflächen beerentragender weiblicher Sanddornbäumchen an der Ostseeküste kann man Nebelkrähen gruppenweise die reifen, sehr sauren Früchte picken sehen. Im Frühjahr nimmt die Zahl gefressener Regenwürmer und Käfer stark zu, gefolgt von einem Anstieg an vertilgten anderen Insekten. Vogeleier werden im Frühjahr und Frühsommer von Aaskrähen gefressen, wenn sie ausreichend zur Verfügung stehen. Kleinsäuger rücken etwas später, gegen Sommer, in das Zentrum der Aufmerksamkeit. Anderenorts können sich deutlich andere Akzente im Nahrungsspektrum ergeben: In Weideregionen ist Aas im Winter eine wichtige Nahrungsquelle."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Die Brutzeit der Art beginnt abhängig von regionalem Klima, Nahrungsangebot und Erfahrung der Brutpartner zwischen Ende Februar und Ende Mai. Das Nest wird meist hoch in Bäumen, aber auch hoch auf Masten oder in Gebäude- und Felsnischen von beiden Partnern gemeinsam gebaut. Wichtig sind dabei vor allem Deckung und in Siedlungen die Nähe zu Häusern. Es besteht aus einer massiven, vierschichtigen Konstruktion, deren äußerste Lage aus dicken Zweigen besteht und nach innen hin mit immer feineren Materialien bis hin zu Wolle, Federn, Pflanzenfasern oder Stoff ausgekleidet wird. Es misst in der Regel 23–47 cm im Durchmesser und wird in Folgejahren meist nicht wiederverwendet. Dafür nutzen andere Vogelarten gern die verlassenen Nester, darunter Eulen wie die Waldohreule, aber auch Falken.\nIn das Nest legt das Weibchen zwei bis sechs Eier von bläulich-grünlicher Farbe, die sie allein bebrütet. Aus ihnen schlüpfen nach rund 20 Tagen die Jungen, die nach weiteren 28–38 Tagen flügge werden. Während der einzigen Jahresbrut sind Gelege und Nestlinge vor allem durch Artgenossen und Echte Marder (Martes spp.) bedroht. Die Gelegeverluste liegen je nach Jahr und Region zwischen 40 und 93 %, wobei Waldbrüter in der Regel am stärksten betroffen sind.\nDas in freier Wildbahn erreichbare Höchstalter liegt bei über 19 Jahren."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Ernährung: Aaskrähen sind Allesfresser und ernähren sich sehr vielseitig. Die Hauptnahrungsquellen der Art sind Getreidesamen und Wirbellose, hinzu kommen kleine Wirbeltiere, Vogeleier, Aas und Abfälle. Die Zusammensetzung des Nahrungsspektrums variiert stark nach Angebot, Lebensraum und Jahreszeit. Getreide ist im britischen Oxfordshire das ganze Jahr über, vor allem aber im Herbst und Winter von Bedeutung. Kleinfrüchte und Obst werden gegen Herbst wichtig, spielen im Rest des Jahres aber meist eine untergeordnete Rolle. Auf den windgeschorenen Wipfelflächen beerentragender weiblicher Sanddornbäumchen an der Ostseeküste kann man Nebelkrähen gruppenweise die reifen, sehr sauren Früchte picken sehen. Im Frühjahr nimmt die Zahl gefressener Regenwürmer und Käfer stark zu, gefolgt von einem Anstieg an vertilgten anderen Insekten. Vogeleier werden im Frühjahr und Frühsommer von Aaskrähen gefressen, wenn sie ausreichend zur Verfügung stehen. Kleinsäuger rücken etwas später, gegen Sommer, in das Zentrum der Aufmerksamkeit. Anderenorts können sich deutlich andere Akzente im Nahrungsspektrum ergeben: In Weideregionen ist Aas im Winter eine wichtige Nahrungsquelle."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Kolkrabe",
        "wissenschaftlich": "Corvus corax",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Saatkrähe",
        "wissenschaftlich": "Corvus frugilegus",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Uhu",
        "wissenschaftlich": "Bubo bubo",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Waldohreule",
        "wissenschaftlich": "Asio otus",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Wanderfalke",
        "wissenschaftlich": "Falco peregrinus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "columba_palumbus",
    "name_de": "Ringeltaube",
    "name_wissenschaftlich": "Columba palumbus",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Ringeltaube ist eine Vogelart aus der Familie der Tauben (Columbidae). Sie ist die größte Taubenart Mitteleuropas und besiedelt weite Teile der Paläarktis von Nordafrika, Portugal und Irland nach Osten bis Ostsibirien und Kaschmir. Auffällige Merkmale sind die weißen Flügelbänder und der weiße Halsstreifen. Ringeltauben, im deutschsprachigen Raum auch Waldtauben genannt, bewohnen bewaldete Landschaften aller Art, aber auch Alleen, Parks und Friedhöfe, begrünte Wohngebiete, heute auch bis in die Zentren der Städte. Die Ernährung erfolgt wie bei den meisten Arten der Familie fast ausschließlich pflanzlich. Die Ringeltaube ist je nach geografischer Verbreitung Standvogel, Teilzieher oder überwiegend Kurzstreckenzieher und verbringt den Winter vor allem in West- und Südwesteuropa. Die Art ist trotz der starken Bejagung in vielen Ländern ein häufiger Brutvogel und in Europa nicht gefährdet.",
    "wikidata_id": "Q26026",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Ringeltaube",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "lichter Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Pflanzenfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "bodenlebend",
      "masse_g": 490.0,
      "fluegellaenge_mm": 246.4,
      "nahrung": [
        {
          "was": "sonstige Pflanzenteile",
          "prozent": 40
        },
        {
          "was": "Früchte",
          "prozent": 30
        },
        {
          "was": "Samen",
          "prozent": 30
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 80
        },
        {
          "was": "Unterholz",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der Reviergesang ist ein dumpfes, heiseres und nicht sehr lautes Gurren, das mit einem „rúhgu, gugu“ beginnt. Danach folgt ein 2- bis 13-mal, meist aber 4- bis 5-mal wiederholtes fünfsilbiges „rugúgu, gugu“ und schließlich am Ende meist ein kurzes „gu!“. Der Balzruf ist ein kürzeres „grrugu-rú“. Der Revierruf des Taubers wird in der Jägersprache als „Rucksen“ bezeichnet."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Ringeltauben sind große, kräftig gebaute Tauben mit relativ langem Schwanz und recht kleinem Kopf. Mit einer Körperlänge von 38–43 cm und einer Flügelspannweite von 68–77 cm sind sie die größten Tauben Mitteleuropas. Der Geschlechtsdimorphismus ist bezüglich Größe und Gewicht schwach ausgeprägt, Männchen sind etwas größer und schwerer als Weibchen. So hatten frischtote Männchen aus Ostdeutschland eine Flügellänge von 240–267 mm, im Mittel 254 mm; Weibchen erreichten 238–260 mm, im Mittel 249 mm. Das Gewicht unterliegt saisonalen Schwankungen und ist im Herbst und frühen Winter durch die Anlage von Depotfett am höchsten. Zum Beispiel wogen in Südschweden von August bis September gesammelte adulte Männchen 465–613 g, im Mittel 539 g; Weibchen wogen 420–600 g, im Mittel 498 g; von Dezember bis März dort gesammelte Männchen wogen im Mittel 498 g; Weibchen im Mittel 478 g.\nBei adulten Ringeltauben der Nominatform sind der vordere Rücken und der Schulterbereich schiefergrau bis graubraun, der übrige Rumpf ist oberseits blaugrau. Kropfbereich und Brust sind diffus gräulich weinrot, zum Bauch hin wird die Färbung heller und ist vor den Unterschwanzdecken sehr hell grau. Der Kopf ist blaugrau."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Die Art besiedelt weite Teile der Paläarktis von Nordafrika, Portugal und Irland nach Nordosten bis Westsibirien sowie nach Südosten über Kleinasien bis zum Tian Shan und bis Kaschmir. Sie kommt in fast ganz Europa vor und fehlt hier nur im äußersten Norden etwa ab 67 °N.\nRingeltauben bewohnen bewaldete Landschaften aller Art; gegebenenfalls reichen für eine Ansiedlung aber auch einzelne Bäume oder Büsche. Wenn auch diese fehlen, brüten die Tiere z. B. in Dünen, auf Strandwiesen oder in Getreidefeldern auch auf dem Boden. Bruten im besiedelten Bereich sind in Europa mindestens seit 1821 bekannt; heute brüten Ringeltauben in Alleen, Parks und auf Friedhöfen vielfach auch bis in die Zentren der Städte. Die Brutplätze dürfen nicht zu weit von geeigneten Nahrungshabitaten entfernt sein; das sind in Europa heute vor allem landwirtschaftlich genutzte Bereiche wie Grünland und Äcker, aber auch die zur Brut genutzten Wälder und Grünanlagen. Die Nahrungsflüge können sich je nach Angebot auf die Nestumgebung beschränken, aber auch regelmäßig über Entfernungen von 10 bis 15 Kilometer erfolgen."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Nahrungssuche erfolgt sowohl auf dem Boden als auch, im Gegensatz zu den anderen mitteleuropäischen Tauben, zu erheblichen Teilen auf Bäumen und Sträuchern. Die Art ist bei der Nahrungssuche außerhalb der Reviere gesellig und bildet hier oft kleine Schwärme. Die Nahrung ist wie bei den meisten Arten der Familie fast ausschließlich pflanzlich. Hauptnahrung sind in Europa Eicheln, Bucheckern und Getreidesamen. Daneben wird jedoch je nach dem lokalen Angebot ein sehr breites Spektrum weiterer Vegetabilien gefressen, dazu zählen grüne Blätter, Knospen und Blüten verschiedener Pflanzen, Beeren und andere Früchte, Wurzelknollen (z. B. Kartoffeln oder Rüben) sowie Eichengallen. Städtische Populationen können sich hauptsächlich von Brot und anderen Backwaren ernähren. Tierische Nahrung wird gelegentlich aufgenommen, am häufigsten offenbar Schildläuse sowie Schmetterlingsraupen und -puppen, vereinzelt auch andere Gliederfüßer und Regenwürmer. Offenbar zur Deckung des Kalkbedarfs werden manchmal kleine Weichtiere, also Muscheln und Schnecken, gefressen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Ringeltauben werden im Mai oder Juni des Jahres nach dem Jahr, in dem sie geschlüpft sind, geschlechtsreif. Die Tiere leben überwiegend in einer monogamen Saisonehe, zumindest bei nicht ziehenden Populationen kommen offenbar auch Dauerehen vor. Allerdings nur, wenn aus der vorhergegangenen Brutsaison gemeinsame Jungtiere hervorgegangen sind. Bleibt die Verbindung ohne Nachwuchs, so suchen sich 100 Prozent der Ringeltauben für das nächste Jahr einen neuen Partner. Paare, die erfolgreich gemeinsam gebrütet haben, bleiben dagegen mitunter über Jahre zusammen.\nDie Reviergründung erfolgt durch die Männchen. Gegen Artgenossen wird nur die Nestumgebung als Revier verteidigt. Die Größe des Reviers ist in Abhängigkeit von der Siedlungsdichte sehr variabel; bei sehr hoher Siedlungsdichte kann das Revier nur aus dem zur Brut genutzten Baum bestehen. Die Balz beginnt im März oder April, bei städtischen Populationen jedoch oft schon im Winter. Mit dem Beginn der Eiablage geht die Balzaktivität zurück, bedingt durch die sehr lange Brutsaison sind balzende Tiere jedoch bis in den September hinein häufig zu beobachten. Die Balz umfasst neben den häufigen Rufen auch einen Balzflug des Männchens. Dabei fliegt das Männchen von einer hohen Warte 20 bis 30 m steil nach oben und klatscht dabei oft laut mehrfach mit den Flügeln."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Habicht",
        "wissenschaftlich": "Accipiter gentilis",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Kolkrabe",
        "wissenschaftlich": "Corvus corax",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Mäusebussard",
        "wissenschaftlich": "Buteo buteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      }
    ]
  },
  {
    "id": "erithacus_rubecula",
    "name_de": "Rotkehlchen",
    "name_wissenschaftlich": "Erithacus rubecula",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Das Rotkehlchen ist eine Vogelart aus der Familie der Fliegenschnäpper (Muscicapidae). Es besiedelt Nordafrika, Europa und Kleinasien sowie die Mittelmeerinseln. Seine Nahrung besteht vor allem aus Insekten, kleinen Spinnen, Würmern und Schnecken. Sein Gesang beginnt etwa eine Stunde vor Sonnenaufgang und ist bis in die Dämmerung fast das ganze Jahr über zu hören. Die Art gilt derzeit als ungefährdet.",
    "wikidata_id": "Q25334",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Rotkehlchen",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Zugvogel",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "vielseitig",
      "masse_g": 17.7,
      "fluegellaenge_mm": 71.6,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 40
        },
        {
          "was": "Früchte",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 50
        },
        {
          "was": "Unterholz",
          "prozent": 50
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Rufe und Kommunikation: Das Rotkehlchen fällt am häufigsten durch seinen Alarm- und Störungsruf, das „Schnickern“ oder „Ticksen“, auf. Es handelt sich um eine Reihe von kräftigen, schnell wiederholten „Zik“-Elementen. Vor Luftfeinden warnt der Vogel mit einem gedehnten „Ziih“, bei einem Angriff auch mit dem trillernden Schreckruf „Zib“. Erkennt er eine Eule in seiner Nähe, ertönt der Warnruf „Ziib“. Ausgewachsene Vögel erhalten die Kommunikation untereinander mit dem Stimmfühlungsruf „Dib“ aufrecht, auf dem Zug auch mit einem Laut, der wie „Trietsch“ klingt. Aggressionen werden durch Schnabelklappen (Instrumentallaut) ausgedrückt.\nAuch bei der Jungenaufzucht spielen Rufe eine wichtige Rolle. Da die Nestlinge sich bei Erschütterungen des Nestes nicht rühren, löst erst ein leise schnatternder Fütterruf des Altvogels das Aufsperren der Schnäbel aus. Ab dem siebten Tag geben die Jungvögel zwitschernde Bettellaute von sich. Flügge Junge betteln mit einem lauten „Zit“.\n\nGesang und Gesangsverhalten: Der Gesang des Rotkehlchens ist mit 275 nachgewiesenen, sich fortlaufend ändernden Motiven äußerst variabel. Er wird mit vorgestreckter, das Rot betonender Brust, in der Regel von einer hohen Singwarte aus, vorgetragen. Er beginnt etwa eine Stunde vor Sonnenaufgang und ist noch eine gute Zeit nach Sonnenuntergang zu hören, hauptsächlich jedoch während der Dämmerung."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Die orangerote Färbung der adulten Vögel reicht von Vorderstirn und Kehle bis zur Vorderbrust und umfasst auch die Kopf- und Halsseiten, am ausgeprägtesten zeigt sich der Fleck auf der Brust. An der Stirn ist die Orangefärbung weniger deutlich und aschgrau gesäumt. Die Oberseite ist olivbraun, im Frühjahr jedoch durch Abnutzung der äußeren Federsäume gräulich gefärbt. Die weiße Unterseite wird von den hellolivbraunen Körperseiten eingefasst. Während die Oberschwanzdecken eine gelbbraune Färbung haben, sind die Unterschwanzdecken rahmfarben. Die Steuerfedern sind dunkelbraun mit gelbgrauem Außenfahnensaum. Hand- und Armdecken sind groß mit rostbraunen Spitzen. Die Unterflügeldecken sind gräulichweiß bis hellbraun gefärbt.\nBei etwa der Hälfte der Altvögel tragen die zentralen großen Armdecken auf der Außenfahne einen kleinen gelben Spitzenfleck, der sich auf die Aufhellung der Schaftspitze beschränken kann. Weder stellen diese gelben Spitzenflecken Reste des Jugendkleides dar noch lässt sich mit ihnen auf einen Alters- oder Geschlechtsunterschied schließen. Sie werden sowohl bei der Nominatform als auch bei anderen geographischen Unterarten des Rotkehlchens festgestellt. Beim Rotkehlchen gibt es keinen Geschlechtsdimorphismus.\n\nDas dunkelbraune, rahmfarben gefleckte Gefieder der Jungvögel ist ohne Rot."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Das Rotkehlchen ist in der borealen, gemäßigten und mediterranen Zone der westlichen Paläarktis, das heißt in Nordafrika, Europa und Kleinasien und auf den Mittelmeerinseln verbreitet. Es fehlt im nördlichen Skandinavien, in Island, auf der Halbinsel Krim und einigen Gebieten Spaniens, teilweise auch an der französischen Mittelmeerküste. Selten ist es im Kaukasus, in Turkestan und im westlichen Sibirien zu finden. In wärmeren Teilen des Verbreitungsgebiets, also in West-, Süd- und Mitteleuropa sowie auf den britischen Inseln, ist das Rotkehlchen ein Standvogel. In West- und Mitteleuropa ziehen einige Exemplare der Population jedoch als Kurzstreckenzieher und Teilzieher im Winterhalbjahr über kurze und mittlere Strecken.\n\nDie Rotkehlchen-Populationen im Norden und im Osten Europas sind Zugvögel, die im Mittelmeerraum und im Nahen Osten überwintern. Sie ziehen im Oktober fort und kehren im März zurück. Der Durchzugsgipfel liegt in der Schweiz, am Bodensee, in Norddeutschland und in Ostösterreich Ende September / Anfang Oktober. Danach nehmen die Fangzahlen bis Anfang November kontinuierlich ab.\nDas Rotkehlchen lebt ursprünglich in Auwäldern, Laub-, Misch- und Nadelwäldern, sofern die Krautschicht nicht zu dicht und eine reichhaltige Bodenfauna vorhanden ist. Es ist auch im Gebüsch, in Hecken und im Unterholz zu finden. Häufig lebt es in einem wassernahen Gebiet."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Das Rotkehlchen ernährt sich hauptsächlich von Insekten, kleinen Spinnen und kleinen Regenwürmern. Ergänzend nimmt es Früchte und weiche Samen zu sich, darunter das Rotkehlchenbrot, Beeren (beispielsweise Mehlbeeren), Seidelbast und Liguster. Dabei behalten etwa 80 Prozent der aufgenommenen Beerensamen ihre Keimfähigkeit. Während der Brutzeit ist die Nahrung fast ausnahmslos aus tierischen Bestandteilen zusammengesetzt. Im Spätsommer, Herbst und Winter wird sie durch pflanzliche Nahrung ergänzt. Während der Zugzeit geht der Anteil pflanzlicher Nahrung jedoch stark zurück.\nZur Nahrungssuche bewegt sich das Rotkehlchen in kleinen Sprüngen auf der Erde vorwärts, selten werden kurze Schritte gemacht. Durch Umdrehen und Ablesen des Laubes, seltener von Stämmen oder Ästen, oder durch die Ansitzjagd mit anschließendem Hinunterstoßen kann es Insekten erreichen. Das Rotkehlchen ergreift auch gern die Beute, wenn Nahrungstiere von anderen Tieren freigelegt oder aufgescheucht werden oder andere Vögel sie von Bäumen herunterfallen lassen. Kleine Steine werden zur Verdauungsförderung aufgenommen, unverdauliche Teile wie Chitin als Gewölle in länglichen Ballen hervorgewürgt.\nIm Winter ernährt sich das Rotkehlchen häufig an Futterhäuschen, wo es Fettnahrung wie Fettfutter und Körner vorzieht. Zudem versuchen urbane Rotkehlchen, offen gelagerte Lebensmittel zu erreichen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Das Rotkehlchen erreicht die Geschlechtsreife im ersten Lebensjahr. Es führt eine monogame Brutehe. In West-, Süd- und Mitteleuropa finden ziehende Männchen nur halb so oft ein Weibchen wie Überwinterer. Der Legebeginn fällt frühestens in die erste Märzhälfte, in Mitteleuropa aber meistens in den April. Zwei bis drei Jahresbruten sind möglich, wobei Drittbruten eine seltene Ausnahme bilden. Die Brutzeit zieht sich somit von Mitte März/Anfang April bis Juli/August hin.\n\nPaarbildung und Balz: Nachdem ein Weibchen im Winter sein Revier verlassen hat, fliegt es in das Revier eines von ihm ausgewählten Männchens ein und sucht seine Nähe. Anfänglich stößt das Weibchen auf die Abwehr des Männchens, das es durch sein Imponiergehabe einschüchtern will. Dazu zeigt es mit angehobenem Kopf die rote Brust und schaukelt seinen Körper hin und her. Zudem trippelt es mit hochgestelltem Schwanz zur Seite und lässt einen heftigen Gesang hören. Daraufhin zeigt das Weibchen Infantilismus, um das Männchen durch Betteln, aber auch Zittern des Schwanzes und der Flügel zu beruhigen. Dabei lässt es mit gebeugtem Kopf einen leisen Gesang hören, bis es schließlich ins Gebüsch fliegt. Dieses Ritual wiederholt sich oft tagelang. Nachdem das Imponiergehabe nachgelassen und schließlich ganz aufgehört hat, verteidigt das Paar sein Revier gemeinsam."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Nahrung und Nahrungserwerb: Das Rotkehlchen ernährt sich hauptsächlich von Insekten, kleinen Spinnen und kleinen Regenwürmern. Ergänzend nimmt es Früchte und weiche Samen zu sich, darunter das Rotkehlchenbrot, Beeren (beispielsweise Mehlbeeren), Seidelbast und Liguster. Dabei behalten etwa 80 Prozent der aufgenommenen Beerensamen ihre Keimfähigkeit. Während der Brutzeit ist die Nahrung fast ausnahmslos aus tierischen Bestandteilen zusammengesetzt. Im Spätsommer, Herbst und Winter wird sie durch pflanzliche Nahrung ergänzt. Während der Zugzeit geht der Anteil pflanzlicher Nahrung jedoch stark zurück.\nZur Nahrungssuche bewegt sich das Rotkehlchen in kleinen Sprüngen auf der Erde vorwärts, selten werden kurze Schritte gemacht. Durch Umdrehen und Ablesen des Laubes, seltener von Stämmen oder Ästen, oder durch die Ansitzjagd mit anschließendem Hinunterstoßen kann es Insekten erreichen. Das Rotkehlchen ergreift auch gern die Beute, wenn Nahrungstiere von anderen Tieren freigelegt oder aufgescheucht werden oder andere Vögel sie von Bäumen herunterfallen lassen. Kleine Steine werden zur Verdauungsförderung aufgenommen, unverdauliche Teile wie Chitin als Gewölle in länglichen Ballen hervorgewürgt.\nIm Winter ernährt sich das Rotkehlchen häufig an Futterhäuschen, wo es Fettnahrung wie Fettfutter und Körner vorzieht."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Hauskatze",
        "wissenschaftlich": "Felis catus",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rotfuchs",
        "wissenschaftlich": "Vulpes vulpes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Steinmarder",
        "wissenschaftlich": "Martes foina",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Waldkauz",
        "wissenschaftlich": "Strix aluco",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "accipiter_nisus",
    "name_de": "Sperber",
    "name_wissenschaftlich": "Accipiter nisus",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Sperber ist ein Greifvogel und gehört zur Familie der Habichtartigen (Accipitridae). Die Weibchen sind deutlich größer als die Männchen und fast doppelt so schwer. In der Jägersprache werden die Männchen Sprinz genannt.",
    "wikidata_id": "Q25380",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Sperber_(Art)",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {},
    "abschnitte": {},
    "fressfeinde": [
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "sturnus_vulgaris",
    "name_de": "Star",
    "name_wissenschaftlich": "Sturnus vulgaris",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Star, auch als Gemeiner Star bezeichnet, ist der in Eurasien am weitesten verbreitete und häufigste Vertreter der Familie der Stare (Sturnidae). Durch zahlreiche Einbürgerungen auf anderen Kontinenten ist der Star heute einer der häufigsten Vögel der Welt. Im Niederdeutschen werden Stare Spreen genannt.",
    "wikidata_id": "Q25469",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Star_(Art)",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Siedlungsraum",
      "zugverhalten": "Teilzieher",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Allesfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 77.1,
      "fluegellaenge_mm": 128.3,
      "nahrung": [
        {
          "was": "Früchte",
          "prozent": 30
        },
        {
          "was": "Wirbellose",
          "prozent": 20
        },
        {
          "was": "Samen",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 80
        },
        {
          "was": "Unterholz",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der Gesang wird ganzjährig meist von einer exponierten Warte vorgetragen, während der Brutzeit meist in unmittelbarer Nähe zur Bruthöhle. Intensiv singende Stare sträuben das Gefieder und flattern mit den gespreizten Flügeln. Der Star ist für sein „Spotten“ berühmt, also für seine Fähigkeit, Tierstimmen und Laute zu imitieren. Der anhaltende, schwätzende Gesang besteht aus einer Vielzahl von ansteigenden oder abfallenden Pfeiftönen, Schnalz-, Zisch- und Rätschlauten sowie Imitationen von Vogel- und anderen Tierstimmen oder technischen Geräuschen. Häufig werden zum Beispiel Rufe von Wachtel, Mäusebussard oder Kiebitz nachgeahmt, daneben auch Hundegebell, das Geräusch von Rasenmähern oder neuerdings auch Klingeltöne von Mobiltelefonen. Die Warnrufe sind je nach Bedrohung unterschiedlich. Vor Flugfeinden (Krähen, Greifvögeln usw.) wird mit einem schnell gereihten, scharfen, sehr kurzen „spett, spett“ gewarnt, vor Bodenfeinden mit einem wiederholten, langgezogenen „brrrrrrrt“ oder „tschrrr“."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Star ist mit einer Körperlänge von 19 bis 22 cm etwas kleiner als die Amsel. Der Schwanz ist im Vergleich zur Amsel deutlich kürzer. Die Flügel wirken im Flug dreieckig und spitz. Männliche Stare des nominotypischen Taxons wiegen im Mittel 81 g, Weibchen sind mit im Mittel 76 g etwas leichter.\nIm Schlichtkleid sind die Körperfedern schwärzlich mit metallisch grünem oder purpurnem Glanz und haben weiße bis beigefarbene Spitzen. Der ganze Körper erscheint dadurch hell gepunktet. Daher rührt der Begriff Perlstar. Die Schwingen und Steuerfedern sind schwarzbraun mit hellbräunlichen Säumen, die Armschwingen sind außerdem breit metallisch glänzend gesäumt. Das Prachtkleid entsteht im Frühjahr durch Abnutzung der hellen Spitzenflecken des Körpergefieders, der Körper ist dann insgesamt schwärzlich und metallisch glänzend. Der Schnabel ist im Prachtkleid gelb, im Schlichtkleid schwärzlich. Die Beine sind rotbraun, die Iris der Augen ist dunkelbraun.\nDie Geschlechter unterscheiden sich nur geringfügig, Weibchen sind etwas weniger intensiv metallisch glänzend gefärbt als Männchen, und die Punktzeichnung auf dem Körper bleibt bei Weibchen im Prachtkleid meist deutlicher erhalten. Die Basis des Unterschnabels ist bei Männchen im Prachtkleid blaugrau, bei Weibchen weißlich.\nFrisch ausgeflogenen Staren fehlt der Metallglanz, der Körper ist erdbraun, nur die Kehle ist weißlich aufgehellt."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Generell ist der Star Allesfresser, die Ernährung ist jahreszeitlich aber sehr unterschiedlich. Im Frühjahr und Frühsommer werden vor allem bodenlebende Wirbellose genutzt, überwiegend Insekten, aber auch Regenwürmer und kleine Schnecken. Im übrigen Jahr frisst der Star überwiegend Obst und Beeren aller Art, in Mitteleuropa vor allem Kirschen und Äpfel, in West- und Südeuropa vor allem Weintrauben und Oliven. Daneben nutzt der Star auch Nahrungsabfälle des Menschen in Siedlungen und auf Müllkippen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Das Nest baut der Star leicht unstrukturiert aus trockenen Blättern, Halmen, Wurzeln, Stroh, Haaren, Wolle und Federn in den unterschiedlichsten Arten von Höhlen. Überwiegend werden Baumhöhlen, aber auch Felsspalten und im Siedlungsbereich Nistkästen und Hohlräume an Gebäuden aller Art als Brutplatz angenommen.\nWenn es einen geeigneten Nistplatz gefunden hat, beginnt zuerst das Männchen den Nestbau mit grobem Baumaterial. Sobald das Weibchen das Nest akzeptiert hat, baut es dieses mit feinerem Pflanzenmaterial aus.\nStare führen eine Brutehe. Männchen können während einer Brutperiode monogam sein, häufig sind jedoch auch die gleichzeitige Verpaarung mit mehreren Weibchen (simultane Polygynie) oder aufeinanderfolgende Bruten mit verschiedenen Weibchen (sukzessive Polygynie). Bei einer Studie in Belgien waren 20 bis 60 Prozent aller Männchen polygyn, bei Frankfurt am Main mindestens 50 Prozent. In Extremfällen wurden bei Frankfurt am Main bei einem Männchen in einer Brutperiode fünf Bruten mit vier verschiedenen Weibchen nachgewiesen; bei Antwerpen brütete ein Männchen mit zwei Weibchen gleichzeitig und mit drei weiteren sukzessiv. Echte Zweitbruten sind hingegen selten, ihr Anteil liegt vermutlich selten über 10 Prozent. Bei den Erstbruten erfolgt die Eiablage in Mitteleuropa hochsynchronisiert meist zwischen dem 10. und 30. April."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Sozialverhalten: Stare bewegen sich ganzjährig in Trupps und zum Teil riesigen Schwärmen. Nur am Brutplatz ist der Star territorial, meist wird ein kleiner Radius bis ca. 10 m um die Bruthöhle verteidigt. Nahrungsflächen werden nicht verteidigt, sondern gemeinsam genutzt. Nichtbrüter leben auch in der Brutzeit in Trupps. Die ab Mitte Juni selbstständigen Jungvögel bilden sofort Schwärme, die sich in nahrungsreichen Gebieten konzentrieren. Diese Schwärme werden durch den Zwischenzug der Jungvögel nordöstlicher Populationen (siehe Wanderungen) immer größer mit einem Maximum im Juli.\nNachts werden gemeinsame Schlafplätze genutzt, diese Schlafplätze liegen vor allem in größeren Schilfgebieten, aber auch in Baum- und dichten Strauchgruppen, häufig auch in Stadtzentren. So besteht am Berliner Dom von Juni bis Ende Oktober ein Schlafplatz von bis zu 40.000 Staren. Im Winterquartier können diese Schlafgemeinschaften mehr als 1 Million Individuen umfassen. Die Stare sammeln sich an Vorsammelplätzen, meist auf exponierten Strukturen wie hohen Bäumen oder Stromleitungen. Von dort fliegen sie dann in Trupps oder größeren Schwärmen geschlossen zum eigentlichen Schlafplatz. Kleinere Trupps fliegen den Schlafplatz meist niedrig an."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baumfalke",
        "wissenschaftlich": "Falco subbuteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Buntspecht",
        "wissenschaftlich": "Dendrocopos major",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Elster",
        "wissenschaftlich": "Pica pica",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      }
    ]
  },
  {
    "id": "poecile_palustris",
    "name_de": "Sumpfmeise",
    "name_wissenschaftlich": "Poecile palustris",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Die Sumpfmeise oder Nonnenmeise ist eine Singvogelart aus der Familie der Meisen (Paridae). Die Art ist in Mitteleuropa ein verbreiteter und häufiger Brut- und Jahresvogel. Ihr Verbreitungsgebiet zerfällt in zwei Teile, die durch eine fast 2000 km große Lücke getrennt sind. Der westliche Teil umfasst die Eichen-Mischwälder Europas bis hin zum Ural, der östliche Teil die Gebirgstaiga und die sommergrünen Laubwälder Ostasiens; er reicht bis nach Japan und ins östliche China. Die Sumpfmeise besiedelt – anders als ihr Name vermuten lässt – vor allem Laub- und Mischwälder mit altem Baumbestand und Totholz, in denen sie ein ausreichendes Höhlenangebot vorfindet. Sie ernährt sich vor allem von Insekten und Spinnentieren, aber auch viel von Sämereien. Sind diese in ausreichender Menge vorhanden, legt die Sumpfmeise Vorräte an, indem sie einzelne Samen in Rindenspalten und unter Moos versteckt.",
    "wikidata_id": "Q207838",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Sumpfmeise",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Standvogel",
      "ernaehrungstyp": "Allesfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 11.1,
      "fluegellaenge_mm": 64.0,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 50
        },
        {
          "was": "Früchte",
          "prozent": 20
        },
        {
          "was": "Samen",
          "prozent": 20
        }
      ],
      "nahrungsschicht": [
        {
          "was": "mittlere Höhe",
          "prozent": 80
        },
        {
          "was": "Unterholz",
          "prozent": 20
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Die markanteste und charakteristische Lautäußerung der Sumpfmeise ist ein „explosives“ Pjiet-scha (Hörbeispiel). Dieser Ruf ersetzt außerhalb der Brutzeit einen Reviergesang und ist häufiger vom Männchen als vom Weibchen zu hören. Zur Brutzeit vernimmt man ihn eher selten. Das Rufrepertoire ist ansonsten wie bei allen Meisen recht groß. Ebenfalls häufig zu hörender Stimmfühlungslaut ist ein spitzes hohes tzie oder szie. In Erregung folgt darauf (oder auf das Pjiet-scha) eine dä-dä-dä Reihe, die sich deutlich vom nasalen däh der Weidenmeise unterscheidet und eher an entsprechende Blaumeisenrufe erinnert (Hörbeispiele). Das erregte „Schnarren“ (Hörbeispiel) ähnelt dem der Kohlmeise.\nDer Gesang ist individuell recht variabel. Das menschliche Ohr kann etwa 6 bis 7 Varianten unterscheiden; mit Hilfe von Sonagrammen ließen sich hingegen nahezu 40 ermitteln. Er setzt sich aus etwa 15 Sekunden langen Strophen zusammen, auf die eine längere Pause folgt und besteht im einfachsten Fall aus einer simplen Wiederholung der gleichen, recht hohen Silbe wie etwa sijep sijep sijep sijep … (Hörbeispiel) oder djep djep djep djep … (Hörbeispiel). Die Geschwindigkeit kann sehr unterschiedlich sein. Schneller Gesang kann an das „Trillern“ des Grünfinken erinnern. Der teils ähnlich aufgebaute Gesang der Weidenmeise ist hingegen immer flötend melodisch (Hörbeispiel)."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Die Sumpfmeise steht mit 11,5 bis 13 cm Körperlänge in der Größe zwischen Kohl- und Blaumeise.\nDer Schnabel ist schwärzlich mit (möglicherweise im Unterschied zur Weidenmeise) aufgehellten Kanten. Die Iris ist dunkel- bis schwarzbraun. Die bei adulten Vögeln glänzend schwarze Kopfkappe reicht über Stirn und Scheitel, abwärts bis zur Mitte des Auges und nach hinten in den Nacken. Dazu kontrastieren die weißen Wangen und Ohrdecken. Die Halsseiten sind bräunlich weiß. Kinn und Kehlmitte sind schwarz, wobei die Federn zum Teil fein weiß bespitzt sind. Die Oberseite ist bei der Nominatform braungrau, am Bürzel jedoch oft etwas heller und wärmer beige gefärbt. Die schmutzigweiße Unterseite ist vor allem zu den Flanken und Unterschwanzdecken hin fahl beige getönt. Die dunkel braungrauen Hand- und Armschwingen sind an der Außenfahne schmal braun und auf der Innenfahne weiß gesäumt. Die Handdecken sind ebenfalls dunkel braungrau, die Schirmfedern matt braungrau. Achselfedern und Unterflügeldecken sind weiß mit beiger Tönung. Die Steuerfedern sind dunkelbraun mit olivbraunem Saum auf der Außenfahne; der Außensaum der äußeren ist weißlich aufgehellt. Beine und Füße sind bläulich grau bis schieferfarben.\nVögel im Jugendkleid sind an der matt rußschwarzen Kappe, dem braunschwarzen Kehlfleck, der graueren Oberseite und der weißeren, kaum beige getönten Unterseite erkenntlich."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Die Sumpfmeise besiedelt bevorzugt abwechslungs- und grenzlinienreiche Laubwälder oder laubholzreiche Mischwälder, die einen großen Altholzbestand, ausreichend Totholz und lichten Unterwuchs aufweisen. In Mitteleuropa kommt sie typischerweise in Mischwäldern aus Eichen und Buchen, aber auch in Au- und Bruchwäldern, Feldgehölzen, auf Obstanbauflächen, in Parks, größeren Gärten mit altem Baumbestand oder auf Friedhöfen vor. In reinen Nadel- oder Buchenwäldern ist sie meist nur selten oder in Randbereichen zu finden.\nWenn die Art auch in Ostasien stellenweise in Röhrichtsümpfen vorkommt, so ist doch der Name „Sumpfmeise“ irreführend, denn sie ist keineswegs an sumpfige Habitate gebunden. Zwar erreicht sie in feuchten Wäldern hohe Siedlungsdichten, aber allzu nasse Standorte werden – ebenso wie zu trockene oder nährstoffarme – gemieden. Ist die Weidenmeise in den Gehölzen und halboffenen Landschaften der Flussniederungen meist häufiger, so überwiegt die Sumpfmeise in den geschlossenen Waldformen der Niederungen und des Hügellandes. Sie ist im Unterschied zur Weidenmeise bisweilen in geeigneten Habitaten auch innerhalb von Städten zu finden.\nAm Südrand der Verbreitung besiedelt die Sumpfmeise in Europa die mediterran geprägten Eichen- (z. B. Pyrenäen-Eiche), Buchen- und Kastanienwälder."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Die Nahrungszusammensetzung der Sumpfmeise ändert sich mit der Jahreszeit. Während im Frühjahr und Sommer bevorzugt Insekten und Spinnentiere gefressen werden, stellen Sämereien ab dem Spätsommer einen Großteil der Nahrung dar und sind vor allem im Herbst und Winter wichtig.\nZu den als Nahrung festgestellten Insekten zählen neben Zwei-, Haut- und Netzflüglern, Stein- und Köcherfliegen, Wanzen, Käfern und Ohrwürmern auch besonders kleine Beutetiere wie Springschwänze und Pflanzenläuse. Bei den Schmetterlingen spielen hauptsächlich die Raupen eine größere Rolle – vor allem als Nestlingsnahrung. Bei Gradationen kann diese auch überwiegend aus Blattläusen bestehen. Auch Webspinnen, Milben und Weichtiere gehören zum Nahrungsspektrum.\nSämereien sind für die Sumpfmeise wichtiger als für andere Meisenarten. Dazu zählen Samen von Gräsern, Kräutern und Stauden, besonders im Winter aber auch härtere Baumsamen und Nussfrüchte wie beispielsweise Bucheckern. Aus Beeren wie beispielsweise denen von Geißblatt, Holunder oder Eberesche werden eher die Samen herausgeschält, als das Fruchtfleisch verzehrt. Gelegentlich werden aber auch größere Früchte wie beispielsweise Kernobst angepickt. Eine geringere Rolle als Sämereien spielen Blüten, Weidenkätzchen und Knospen, Pollen und Baumsaft, können aber zeitweise auch als Nahrung von Belang sein."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Sumpfmeisen sind spätestens nach Abschluss des ersten Lebensjahres geschlechtsreif. Sie führen eine monogame Dauerehe. Bei einem Paar wurde der Zusammenhalt über sechs Jahre nachgewiesen. Junge Paare gehen oft bereits im ersten Herbst und Winter eine temporäre Bindung ein. Eine dauerhafte Paarbindung ergibt sich jedoch erst, wenn ein Männchen ein Revier besetzen kann. Sie besteht dann das ganze Jahr über. Außerhalb der Brutzeit können die Reviere etwas ausgedehnter sein. Trupps von jungen Vögel werden dann noch geduldet. Sie versuchen zu Beginn der Brutzeit in angrenzenden Bereichen Reviere zu gründen oder gegebenenfalls verstorbene Partner etablierter Paare zu ersetzen.\nBalzhandlungen setzen schon sehr früh im Jahr ein und deuten sich durch erregtes Flügelzittern an. Hochfrequenter Gesang des Männchens wird vom Weibchen erwidert. Es nähert sich unter Flügelzittern dem Männchen, das in einem schmetterlingsartigen Singflug herüberfliegt und zur Kopulation auf dem Rücken des Weibchens landet. Ein wichtiges Element ist auch das Balzfüttern des Weibchens durch das Männchen. Dieses setzt in der Zeit vor Legebeginn ein und trägt entscheidend zum Gelingen der Brut bei.\nZur Nistplatzwahl durchstreift das Paar ab Spätherbst, intensiver aber erst im März das Revier und begutachtet vorhandene Höhlungen."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baumfalke",
        "wissenschaftlich": "Falco subbuteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Buntspecht",
        "wissenschaftlich": "Dendrocopos major",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Elster",
        "wissenschaftlich": "Pica pica",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      }
    ]
  },
  {
    "id": "falco_tinnunculus",
    "name_de": "Turmfalke",
    "name_wissenschaftlich": "Falco tinnunculus",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Turmfalke ist der am häufigsten vorkommende Falke Mitteleuropas. Der Öffentlichkeit ist er relativ vertraut, da er sich auch Städte und Stadträume als Lebensraum erobert hat und öfter beim „Rüttelflug“ zu beobachten ist.",
    "wikidata_id": "Q26490",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Turmfalke",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Gebüsch",
      "zugverhalten": "Zugvogel",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Wirbeltierjäger",
      "lebensweise": "in der Luft jagend",
      "masse_g": 183.2,
      "fluegellaenge_mm": 241.0,
      "nahrung": [
        {
          "was": "Wirbeltiere",
          "prozent": 90
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 80
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Untersuchungen haben gezeigt, dass sich bei Weibchen elf und bei Männchen über neun unterschiedliche Lautäußerungen differenzieren lassen. Die Rufe lassen sich in wenige Grundmuster unterteilen, deren Lautstärke, Tonhöhe und Frequenz je nach Situation variiert. Sowohl das Weibchen als auch das Männchen variieren dabei unter anderem den Bettelruf der Jungvögel, der auch als Lahnen bezeichnet wird. Besonders von Weibchen ist dieses Lahnen während der Balz zu hören oder wenn sie ihre Männchen während der Brutzeit um Futter anbetteln.\nDas ti, ti, ti, das von manchen Autoren auch lautsprachlich als kikiki umschrieben wird, ist ein Erregungslaut, der vor allem dann zu hören ist, wenn die Vögel am Nest gestört werden. Varianten dieses Rufes treten auch kurz bevor das Männchen die Beute am Nest übergibt auf.\nDie Lautäußerungen des Turmfalken sind auf einer Seite von lbv.de zu hören."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Gefieder: Turmfalken zeigen in ihrem Gefieder einen ausgeprägten Geschlechtsdimorphismus. Das auffälligste Unterscheidungsmerkmal zwischen männlichen und weiblichen Turmfalken ist die Kopffärbung. Bei Männchen ist der Kopf grau, während Weibchen einheitlich rotbraun gefärbt sind. Männchen haben außerdem auf ihrem rotbraunen Rücken kleine schwarze und zum Teil rautenförmige Flecken. Ihre Oberschwanzdecken sowie der Hinterrücken und die Schwanzfedern – der so genannte Stoß – sind gleichfalls hellgrau. Das Stoßende weist eine deutliche schwarze Endbinde mit einem weißen Saum auf. Die Unterseite ist hell cremefarben und nur sehr leicht bräunlich gefleckt oder gestreift. Der Unterbauch und die Unterflügeldecken sind fast weiß.\nDas ausgewachsene Weibchen ist am Rücken dunkel quer gebändert. Im Unterschied zum Männchen ist der Stoß braun und zeigt zudem mehrere Querstreifen und eine deutliche Endbinde. Auch die Unterseite ist dunkler als beim Männchen und weist eine stärkere Fleckung auf. Jungvögel gleichen in ihrem Gefieder den Weibchen. Allerdings wirken ihre Flügel runder und kürzer als bei adulten Turmfalken. Außerdem weisen die Spitzen der Handschwingen hellere Säume auf. Wachshaut und Augenring, die bei ausgewachsenen Vögeln gelb sind, sind bei Jungvögeln hellblau bis grüngelblich."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Typische Lebensräume des Turmfalken: Der Turmfalke ist eine anpassungsfähige Art, die in unterschiedlichen Lebensräumen zu finden ist. Generell meiden Turmfalken sowohl dichte geschlossene Waldbestände als auch völlig baumlose Steppen. In Mitteleuropa ist er ein häufiger Vogel der Kulturlandschaft, der überall dort leben kann, wo Feldgehölze oder Waldränder vorhanden sind. Grundsätzlich benötigt er zum Jagen freie Flächen mit niedrigem Bewuchs. Dort, wo Bäume fehlen, nutzt er die Masten von Starkstromleitungen als Nistplatz. Aus den 1950er Jahren ist ein Fall von den Orkneyinseln belegt, wo er sogar auf vegetationslosem Boden brütete.\nNeben dem Vorhandensein von Nistgelegenheiten ist es vor allem das Vorhandensein von Beutetieren, das beeinflusst, welche Lebensräume vom Turmfalken besetzt werden. Sofern Beutetiere ausreichend vorhanden sind, zeigt er eine große Anpassung an unterschiedliche Höhen. So besteht im Harz und im Erzgebirge ein Zusammenhang zwischen dem Auftreten seines dortigen Hauptbeutetiers, der Feldmaus, und den Höhenlagen, bis zu denen Turmfalken zu beobachten sind. Im Harz ist er in Höhenlagen über 600 Meter über NN zunehmend seltener zu beobachten und tritt ab 900 Meter kaum noch auf. In den Alpen dagegen, wo er ein anderes Beutespektrum nutzt, kann man ihn auf den Bergweiden noch in 2000 Meter Höhe bei der Jagd beobachten."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Beutetiere: Im offenen Kulturland lebende Turmfalken ernähren sich überwiegend von Kleinsäugern wie Wühlmäusen und anderen Mäusen. In Städten lebende Turmfalken nehmen daneben auch kleine Singvögel, meist Haussperlinge. Welche Tiere den Hauptteil der Beute ausmachen, ist abhängig von den lokalen Gegebenheiten. Untersuchungen auf der Insel Amrum haben gezeigt, dass Turmfalken dort bevorzugt Schermäuse jagen. Anders als in europäischen Großstädten kann die Feldmaus in kleineren Städten den Hauptanteil an der Beute ausmachen. Der Turmfalke nimmt auch mitunter Eidechsen (mit größerem Anteil in südeuropäischen Ländern), teilweise Regenwürmer und einen deutlichen Anteil an Insekten wie Heuschrecken und Käfer als Nahrung. Auf diese Beutetiere greifen brütende Turmfalken zurück, wenn die Kleinsäugerbestände zusammenbrechen. Auch ausgeflogene Jungvögel ernähren sich zuerst von Insekten und größeren Wirbellosen und wechseln erst mit zunehmender Jagderfahrung zu Kleinsäugern.\nEin frei fliegender Turmfalke benötigt täglich etwa 25 % seines Körpergewichts als Nahrungsmenge. An verunfallten Vögeln durchgeführte Untersuchungen haben gezeigt, dass Turmfalken im Schnitt etwa zwei anverdaute Mäuse im Magen haben.\n\nAnsitzjagd, Rüttelflug und Luftjagd: Der Turmfalke ist ein sogenannter Griffhalter, der seine Beute mit den Fängen packt und durch einen Biss in den Nacken tötet."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Balz: Die Balzflüge der Turmfalken lassen sich in Mitteleuropa von März bis April beobachten. Die Männchen vollführen dabei ruckartige Flügelschläge, drehen sich halb um die Längsachse und gleiten danach in raschem Gleitflug nach unten. Während dieser Flüge, die vor allem der Revierabgrenzung dienen, ist ein erregtes Rufen zu hören.\nDie Aufforderung zur Paarung geht überwiegend vom Weibchen aus, das sich in der Nähe des Männchens niederlässt und ein vom Bettelruf der Jungen abgeleitetes Lahnen hören lässt. Nach der Begattung fliegt das Männchen zu dem von ihm ausgewählten Brutplatz und lockt das Weibchen mit hellen zick-Rufen. In der Horstmulde zeigt das Männchen zwei unterschiedliche Balzverhalten, die ineinander übergehen. Unter lauten zick-Rufen legt sich das Männchen in die Horstmulde, als wolle es brüten, scharrt mit den Fängen und vertieft dabei die Brutmulde. Erscheint das Weibchen am Horstrand, richtet sich das Männchen wieder auf und zeigt ein erregtes Auf- und Niederwippen. Normalerweise bietet er dabei eine in der Horstmulde zuvor platzierte Beute mit dem Schnabel an.\n\nBrutplatz: Turmfalken sind vor allem Felsbrüter, die in entsprechend felsigen Regionen bevorzugt in Spalten und Höhlen brüten. Wie alle Falken bauen auch Turmfalken keine Nester. In felsarmen Regionen nutzt der Turmfalke die Nester anderer Vogelarten wie beispielsweise von Krähen."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Turmfalken sind sogenannte Breitfrontzieher, die keinen traditionellen Zugrouten folgen und überwiegend einzeln ziehen. So zogen über die Meerenge von Gibraltar unter 210.000 Greifvögeln und Falkenartigen im Jahre 1973 fast 121.000 Wespenbussarde, aber nur 1237 Turmfalken. In dieser Zahl zeigt sich zum einen, dass die in Mitteleuropa so häufigen Vögel nur zu einem kleinen Teil in Afrika überwintern, und zum anderen, dass sie in breiter Front das Mittelmeer überqueren.\nWährend des Zuges fliegen Turmfalken relativ niedrig und halten sich meist in einer Flughöhe von 45 bis 100 Metern auf. Sie setzen ihren Zug auch bei schlechtem Wetter fort und sind anders als viele Greifvögel nicht auf gute Thermik angewiesen. Sie überqueren daher auch die Alpen, die von auf Thermik angewiesenen Greifvögeln wie dem Mäusebussard nur selten überquert werden. Bei ihrer Alpenüberquerung nutzen sie überwiegend Pässe, sie überfliegen aber auch Gipfel und Gletscher."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Mäusebussard",
        "wissenschaftlich": "Buteo buteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Rabenkrähe",
        "wissenschaftlich": "Corvus corone",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Turmfalke",
        "wissenschaftlich": "Falco tinnunculus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Wanderfalke",
        "wissenschaftlich": "Falco peregrinus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      }
    ]
  },
  {
    "id": "troglodytes_troglodytes",
    "name_de": "Zaunkönig",
    "name_wissenschaftlich": "Troglodytes troglodytes",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Zaunkönig ist die einzige in Eurasien vorkommende Art aus der Vogelfamilie der Zaunkönige (Troglodytidae). Er ist nach Winter- und Sommergoldhähnchen der drittkleinste Vogel Europas. Lange Zeit wurde er Schneekönig genannt, da er auch im Winter lebhaft singt. Der Zaunkönig besiedelt Europa, Nordafrika, Vorder-, Zentral- und Ostasien. Seine Nahrung setzt sich aus Spinnen, Weberknechten und Insekten, wie beispielsweise Nachtfaltern und Fliegen, sowie deren Eiern und Larven zusammen. Die Art gilt derzeit als nicht gefährdet.",
    "wikidata_id": "Q25740",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Zaunk%C3%B6nig",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Zugvogel",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 9.7,
      "fluegellaenge_mm": 48.5,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 60
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 50
        },
        {
          "was": "Unterholz",
          "prozent": 50
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der Stimmfühlungsruf des Zaunkönigs äußert sich in einem lauten, harten „tek“ „tek“. Bei Erregung wird laut „dzrr-dzrr“ gerufen, das zu einem langen »drrrrr« gedehnt werden kann.\nDer  ist schmetternd laut mit Trillern und Rollern und endet abrupt. Er setzt sich aus etwa 130 verschiedenen Lauten zusammen. Von höheren Singwarten vorgetragen, ist er bei einer Quell-Lautstärke von 40 bis zu 90 Dezibel auf eine Distanz von bis zu 500 Metern zu hören. Eine vollständige Strophe ist in der Regel vier bis fünf Sekunden lang, kann jedoch bis zu sieben Sekunden andauern. Sie wird in die Bestandteile „Einleitung – Schmettertour – Zwischentöne – Schmettertour – Zwischentöne – Roller“ unterteilt. Weibchen singen weniger laute, einfache Lieder. Der Gesang kann sowohl aus der unteren Krautschicht als auch von erhöhten Singwarten aus vorgetragen werden. Dabei wechselt der Zaunkönig häufig durch hüpfende Bewegungen die Position. Während der Brutzeit beginnen die Männchen ihren Gesang bereits in den frühen Morgenstunden, häufig um kurz nach vier Uhr, erreichen am Vormittag ihren Höhepunkt, ehe der Gesang am Nachmittag deutlich abnimmt. In den frühen Abendstunden ist eine erneute Spitze zu beobachten. Die Gesangsaktivitäten enden am späten Abend."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Der Zaunkönig ist – wie alle Vertreter der Gattung – von runder Gestalt mit meist hochgestelltem Schwanz. Der spitze, leicht gebogene Schnabel ist im oberen Teil schwarzbraun und im unteren Teil gelblich gefärbt. Die Iris des Auges ist nussbraun. Das Gefieder ist an der Oberseite rotbraun und an der Unterseite fahlbraun gefärbt. Ein undeutlicher cremefarbiger Überaugenstrich endet an den dunklen Ohrdecken. An Schwanz, Flügeln und Flanken befinden sich dunkelbraune Wellenlinien. Männchen und Weibchen sehen gleich aus. Während die Flügel beim Weibchen eine Länge von 45 bis 48 Millimetern aufweisen, sind sie beim Männchen zwischen 49 und 53 Millimeter lang. Die Füße sind fleischfarben bis bräunlich. Zaunkönige haben eine Körperlänge von 9,5 bis 11 Zentimetern. Die Flügelspannweite beträgt 14 bis 15 Zentimeter und das Körpergewicht liegt meist zwischen 7,5 und 11 Gramm.\nDie Jungvögel gleichen den Altvögeln, die dunkle Bänderung ist jedoch nicht so ausgeprägt. Die Nestlinge haben an Kopf und Rücken kurze, schüttere dunkelgraue Daunen. Der Rachen ist leuchtend gelb, und die Randwülste sind blassgelb. Die Jugendmauser findet je nach Schlupf in Mitteleuropa zwischen Ende Juli und Ende Oktober statt. Die Zeit der Brutmauser, eine Vollmauser der Altvögel, liegt im August bis Oktober. Die Ruhemauser als Teilmauser findet von Januar bis April statt."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Der Zaunkönig besiedelt Europa, Nordafrika, Vorder-, Zentral- und Ostasien. In Europa fehlt er im Norden Fennoskandiens und im nördlichen Russland. Er lebt in Gebieten von der Ebene bis zur Höhe von 4.000 Metern. Der Zaunkönig ist in Nordafrika Standvogel, in Mittel- und Südeuropa sowie in Asien Teilzieher und in Skandinavien, den baltischen Staaten sowie Russland Zugvogel. Jungvögel, die noch kein eigenes Revier haben, schließen sich größtenteils ziehenden Populationen an, um beliebig weit nach Süden mitzuziehen. Im Winter fehlt der Zaunkönig in den Bergwäldern der Alpen und im Mittelgebirge.\nDer Zaunkönig lebt in Büschen, Hecken und im Dickicht von Wäldern, Gärten und Parks. Bei entsprechendem Angebot an Schlupfwinkeln ist er in der offenen Kulturlandschaft anzutreffen. Zu seinen bevorzugten Lebensräumen zählen Bachauen mit freigespültem Wurzelwerk und Schling- und Kletterpflanzen sowie unterholz­reiche Wälder und Feldgehölze. Er besiedelt oft auch Gebiete in der Nähe von Gewässern. Der Zaunkönig überwintert in Wäldern, Parks und Gärten mit deckenden Sträuchern und einer Krautschicht, oft in der Nähe großer Gewässer. Er ist einzeln oft in Ställen und Scheunen zu finden, in naturnahen Gärten auch an berankten Hauswänden, meistens Gärten mit Gartenteich. Dort ist er auch nicht besonders scheu."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Der Zaunkönig ernährt sich ganzjährig hauptsächlich von tierischer Nahrung. Er frisst bevorzugt Spinnen, Weberknechte, Milben, kleine Krebstiere, Asseln, Tausendfüßer und Insekten sowie deren Eier und Larven. An Insekten vertilgt er vor allem kleine Nachtfalter, kleine Libellen, den Gemeinen Ohrwurm (Forficula auricularia), Geradflügler, Wanzen, Ameisen, Hautflügler, Netzflügler, Stechmücken, Schmetterlinge, Fliegen und Mücken. Zu seiner Nahrung zählen auch Kaulquappen und andere im flachen Wasser lebende Kleintiere, Weichtiere und kleine Pflanzensamen. Gelegentlich frisst er Brom-, Him-, Holunder- und Weinbeeren.\nEr kann dazu auch Obstschutznetze durchschlüpfen.\nDie Beutesuche findet überwiegend in Bodennähe, im Wurzelwerk, im Reisig und am Gewässerrand statt. Seltener wird die Beute im Geäst von Bäumen oder Sträuchern aufgelesen. Nahrungshabitate liegen gewöhnlich in unmittelbarer Nähe zu einem Gewässer, da das Nahrungsangebot dort höher als an anderer Stelle ausfällt und selbst in der Winterzeit gegeben ist. Der Zaunkönig schlüpft dabei durch das Unterholz, dringt mit seinem langen und schlanken Schnabel in kleinste Ritzen und Fugen der Rinde sowie in Astlöcher vor und stöbert dort Insekten, Spinnen und Larven auf. Die unverdaulichen Chitin­teile werden als Speiballen herausgewürgt. Am Gewässerrand nimmt der Zaunkönig Kleintiere aus dem Wasser auf."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Der Zaunkönig erreicht die Geschlechtsreife im ersten Lebensjahr. In Mitteleuropa findet die erste Brut Ende April/Mai und meist eine zweite im Juni/Juli statt. In der Regel lebt das Männchen mit mehreren Weibchen, selten monogam.\n\nNestbau: Im Frühjahr sucht das Männchen ein Brutrevier. Dort beginnt es bei der Ankunft sogleich mehrere Nester im Rohbau zu fertigen. Die Wahl der Neststandorte hängt sowohl vom Gelände als auch von der Vegetation ab. Die Nester befinden sich meist in einer Höhe von maximal zwei Metern unter Bruchholz und Baumwurzeln, unter ausgespülten Bachufern oder im dichten Buschwerk. Weiterhin stellen Verstecke in Hecken, unter Stegen, in alten Mauern oder in Stallungen geeignete Nistplätze dar. Nester werden aber auch in vertrockneten Tierleichen, in zum Trocknen aufgehängter Wäsche, in Brutröhren des Eisvogels und der Uferschwalbe, in Nestern der Wasseramsel, Beutelmeise oder anderer Vögel gebaut. Auch im Gebälk von Dächern oder in zusagenden Nistkästen sind sie zu finden. Oft duldet der Zaunkönig die Nester von Rotkehlchen, Heckenbraunelle, Dorngrasmücke, Haussperling und Rotflügelstärling in unmittelbarer Nähe zu seinem Nistplatz.\nDas Nest ist oval und kugelförmig geschlossen mit seitlichem Eingang; Größe und Material variieren je nach Standort."
      },
      "verhalten": {
        "titel": "Verhalten",
        "text": "Der Zaunkönig ist am Tag und in der Dämmerung aktiv. Der Zug in die Winterquartiere kann jedoch auch nachts erfolgen. Der Zaunkönig verlässt seinen Schlafplatz meist mit dem ersten Tageslicht am Morgen und sucht ihn kurz nach Einbruch der Dunkelheit wieder auf. Während der Ruhephasen hält sich der Zaunkönig in der Regel allein in dichter Bodenvegetation auf, selten in einem seiner Wahlnester. Weibchen übernachten während der Brutzeit jedoch im Nest. Der Zaunkönig hält sich meistens in der dichten Vegetation von Sträuchern verborgen. Häufig hüpft er lebhaft und geschickt von einem Gebüsch zur nächsten Deckung. Er meidet meist das Fliegen größerer Strecken. In der Regel überwindet er Wasserflächen im Tiefflug.\nDer Zaunkönig putzt sein Gefieder in der Regel in dichter Vegetation am Boden. Dabei wird es mit dem Schnabel geputzt und mit einem Sekret aus der Bürzeldrüse eingefettet. Der Schnabel wird meist an kleinen Ästen gewetzt und so gereinigt. Zum Baden sucht er feuchtes Gras auf oder nimmt ein Staub-, Sand- oder Sonnenbad. Selten geht er dazu ins Wasser.\nDer Zaunkönig ist ganzjährig ein territorialer Einzelgänger. Während Männchen im Allgemeinen untereinander nicht verträglich sind, können Weibchen weitgehend konfliktfrei in unmittelbarer Nähe zueinander brüten. Jungvögel im ersten Lebensjahr können sich zu kleineren Gruppen zusammenschließen."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Baumfalke",
        "wissenschaftlich": "Falco subbuteo",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Baummarder",
        "wissenschaftlich": "Martes martes",
        "stadium": "beides",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Buntspecht",
        "wissenschaftlich": "Dendrocopos major",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichelhäher",
        "wissenschaftlich": "Garrulus glandarius",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Eichhörnchen",
        "wissenschaftlich": "Sciurus vulgaris",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      },
      {
        "deutsch": "Elster",
        "wissenschaftlich": "Pica pica",
        "stadium": "Nest",
        "alarmtyp": "Hassruf",
        "bestaetigt": false
      }
    ]
  },
  {
    "id": "phylloscopus_collybita",
    "name_de": "Zilpzalp",
    "name_wissenschaftlich": "Phylloscopus collybita",
    "kurzbeschreibung": "species of bird",
    "beschreibung": "Der Zilpzalp oder Weidenlaubsänger ist eine Vogelart aus der Familie der Laubsängerartigen (Phylloscopidae). Dieser Laubsänger besiedelt große Teile der Paläarktis vom Nordosten Spaniens und Irland nach Osten bis zur Kolyma in Sibirien. Zilpzalpe sind klein, ohne auffallende Zeichnungen und bewegen sich meist gedeckt in höherer Vegetation. Sie fallen daher am ehesten durch den markanten Gesang auf, dem die Art ihren lautmalenden deutschen Namen verdankt. Die Tiere bewohnen ein weites Spektrum bewaldeter Habitate und kommen auch häufig in Parks und den durchgrünten Randbereichen von Städten vor. Die Nahrung besteht vor allem aus kleinen und weichhäutigen Insekten. Der Zilpzalp ist je nach geografischer Verbreitung Kurz- bis Langstreckenzieher. Europäische Vögel überwintern im Bereich des Persischen Golfs, im Mittelmeerraum, in den Oasen der Sahara, in der Trockensavanne südlich der Sahara sowie im ostafrikanischen Hochland. Die Art ist in Europa ein sehr häufiger Brutvogel und nicht gefährdet.",
    "wikidata_id": "Q185784",
    "quelle_text": {
      "name": "Wikipedia (de)",
      "url": "https://de.wikipedia.org/wiki/Zilpzalp",
      "lizenz": "CC BY-SA 4.0"
    },
    "merkmale": {
      "lebensraum": "Wald",
      "zugverhalten": "Zugvogel",
      "ernaehrungstyp": "Fleischfresser",
      "nahrungsnische": "Insektenfresser",
      "lebensweise": "sitzend/ansitzend",
      "masse_g": 8.3,
      "fluegellaenge_mm": 58.8,
      "nahrung": [
        {
          "was": "Wirbellose",
          "prozent": 80
        }
      ],
      "nahrungsschicht": [
        {
          "was": "Boden",
          "prozent": 25
        },
        {
          "was": "Unterholz",
          "prozent": 25
        },
        {
          "was": "mittlere Höhe",
          "prozent": 25
        },
        {
          "was": "Kronendach",
          "prozent": 25
        }
      ]
    },
    "abschnitte": {
      "stimme": {
        "titel": "Stimme",
        "text": "Der markante, recht eintönige Gesang, auf den sich der deutsche Name bezieht, klingt wie „zilp-zalp-zelp-zilp-zalp“, wobei die einzelnen Elemente in der Tonhöhe wechseln. Dazwischen werden oft 2 bis 5 harte, etwa wie „trrt“ klingende Laute eingebaut (). Der Gesang erfolgt von Warten, häufig von noch unbelaubten Zweigen im inneren Randbereich der Krone größerer Bäume oder während der Bewegung in den Baumkronen. Der auch im Herbst häufig zu hörende Lockruf ist ein einfaches, weiches, pfeifendes und am Schluss betontes „huid“.\nAggressives Verhalten wird oft von schnellen Trillern „ditztz...“ begleitet. Außerhalb der Brutzeit kommt ein verwaschenes „sfië“ vor.\nDer Gesang sibirischer Zilpzalpe (Unterarten P. c. tristis bzw. P. c. fulvescens, vgl. Abschnitt Systematik) weicht deutlich vom Gesang der westlichen Unterarten ab. Er besteht nach den einleitenden „trrt“-Lauten aus einem lauten, weichen und melodischen Triller wie „wi-di wii-di wii-di wii widi wii“, „tschiwi tschiwi tschiiwi...“, „tschiwet tschiwit...“ oder „ip-tschip ip-tschiip tschip-tschiiep tschip tschiiep“. Dieser Gesang wird von den westlichen Unterarten nicht mehr als arteigen erkannt und löst daher auch keine Gesangsantwort mehr aus."
      },
      "merkmale": {
        "titel": "Merkmale",
        "text": "Zilpzalpe sind kleine, kompakte und kurzflügelige Laubsänger mit recht großem Kopf und ohne auffallende Zeichnungen. Die Körperlänge beträgt 10–12 cm, das Gewicht 6–10 g. Die Geschlechter unterscheiden sich äußerlich und bezüglich des Gewichts nicht, Männchen sind jedoch etwas langflügeliger als Weibchen. So hatten zur Brutzeit in Sachsen-Anhalt gefangene Männchen der Nominatform eine mittlere Flügellänge von 60,8 mm und ein mittleres Gewicht von 8,2 g; Weibchen erreichten im Mittel nur 54,5 mm und ein mittleres Gewicht von 8,4 g.\nDie Oberseite ist graubräunlich grün, der Bürzel ist häufig etwas heller grün. Kehle, Unterseite des Rumpfes und Unterschwanzdecken sind schmutzig weiß mit individuell sehr variablen Anteilen von Gelb und Beige auf Kehle und Brust. Vor allem im Herbst sind die Flanken häufig beigebraun überhaucht. Schwungfedern und Steuerfedern sind graubraun, die Säume der Außenfahnen sind schmal gelbgrün gesäumt. Ein gelblicher Überaugenstreif ist vor dem Auge deutlich, hinter dem Auge meist nur undeutlich ausgeprägt. Der dunkle Augenstreif teilt den hellen Augenring durchgehend in eine untere und eine obere Hälfte. Der Bereich unterhalb der Augen und die Ohrdecken sind recht dunkel, so dass der untere Teil des hellen Augenrings dazu deutlich kontrastiert."
      },
      "lebensraum": {
        "titel": "Lebensraum",
        "text": "Dieser Laubsänger besiedelt große Teile der Paläarktis vom Nordosten Spaniens und Irland nach Osten bis zur Kolyma in Sibirien. Die Nordgrenze der Verbreitung liegt recht einheitlich bei 66° bis 70° N in Skandinavien und Finnland, bei 69° N im europäischen Russland und bei 69° bis 72° N in Sibirien. Die Südgrenze der geschlossenen Verbreitung verläuft durch Nordostspanien, Nordgriechenland, die Ukraine und Südrussland, Nordkasachstan und durch Sibirien bei 62° N. Südlich davon gibt es räumlich isolierte Vorkommen auf der Krim sowie in einem Areal vom südlichen Turkmenien über Armenien bis zum Kaukasus und dem Norden der Türkei.\nIn Europa hat die Art ihr Verbreitungsgebiet in den letzten etwa 200 Jahren deutlich nach Norden und Nordwesten ausgedehnt. Schleswig-Holstein wurde erst um 1850 besiedelt, Dänemark ab 1872. In den Niederlanden hat die Art ihr Areal bis in die 1990er Jahre ausgedehnt. In Irland hat sich die Art ebenfalls etwa seit 1850 stark ausgebreitet und auch in Schottland hat der Zilpzalp seine Verbreitungsgrenze nach 1950 weit nach Norden verschoben. Als Hauptgrund dieser Arealerweiterungen wird recht einheitlich die Zunahme und Ausdehnung geeigneter Lebensräume durch die Zerstörung und Trockenlegung der Moore und die anschließende Waldentwicklung sowie generell durch Aufforstungen betrachtet."
      },
      "ernaehrung": {
        "titel": "Ernährung",
        "text": "Zilpzalpe suchen ihre Nahrung überwiegend in den mittleren und oberen Teilen der Baumkronen in Höhen ab 10 m, seltener auch in den unteren Teilen der Baumkronen sowie in der Kraut- und Strauchschicht und nur ausnahmsweise auf dem Boden. Sie sind dabei fast pausenlos in Bewegung und suchen Blätter und Zweige in flatternden Sprüngen und durch Hängen an Zweigen ab, machen aber auch kurze Rüttelflüge in den freien Luftraum über der Vegetation oder über kleinen Tümpeln. Sie schlagen dabei häufig mit dem Schwanz abwärts.\nHauptnahrung sind ein breites Spektrum kleiner Insekten und deren Entwicklungsstadien, seltener kleine Spinnen, Asseln und Schnecken. Die Nestlinge werden überwiegend mit kleinen und weichhäutigen Wirbellosen gefüttert. Daneben werden in der Brutzeit in geringem Umfang, auf dem Zug im Spätsommer und Herbst hingegen etwas stärker auch Beeren und andere Früchte gefressen. Mageninhalte von zwischen August und Oktober in der Schweiz gefangenen Zilpzalpen bestanden zu 22 % aus Blattläusen, zu 18,6 % aus Larven holometaboler Insekten, zu 13,9 % aus Hymenopteren (davon knapp 1/5 Ameisen), zu 13,4 % aus Zweiflüglern, zu 12,1 % aus Wanzen und zu 11 % aus Käfern, der Rest bestand aus Zikaden, Blattflöhen, Springschwänzen, Spinnen und Schnecken. Im Frühjahr verzehren die Tiere gelegentlich auch Nektar und Pollen."
      },
      "fortpflanzung": {
        "titel": "Fortpflanzung",
        "text": "Zilpzalpe sind am Ende des ersten Lebensjahres geschlechtsreif. Die Tiere leben überwiegend in einer monogamen Saisonehe. Bigynie, also die Verpaarung eines Männchens mit zwei Weibchen, ist jedoch nicht selten. Offenbar findet meist auch dann eine Neuverpaarung statt, wenn beide Partner in die Nähe des vorjährigen Brutplatzes zurückkehren. Männchen treffen einige Tage bis Wochen vor den Weibchen in den Revieren ein, die Balz beginnt mit der Rückkehr der Weibchen. Männchen singen in Mitteleuropa dementsprechend von Mitte oder Ende März bis Mitte oder Ende Juli.\nDas Nest wird nicht selten auf, aber überwiegend niedrig über dem Boden errichtet. Es findet sich meist in Höhen zwischen 10 und 40 cm und je nach Angebot variierend zum Beispiel in Brombeeren, hohem Gras, Brennnesseln, Jungfichten, jungen Laubbäumen und ähnlichem. Der Nistplatz wird vom Weibchen ausgewählt. Das mehr oder weniger runde und meist etwas unordentliche, geschlossene Nest hat einen seitlichen, ovalen Eingang und ist 7–13 cm breit und 8–15 cm hoch. Es besteht außen aus trockenen Halmen, Grasblättern und Moossprossen. Die Innenauskleidung erfolgt mit ähnlichem, aber feinerem Material, zusätzlich werden hierzu auch fast immer kleine Federn verwendet."
      }
    },
    "fressfeinde": [
      {
        "deutsch": "Schleiereule",
        "wissenschaftlich": "Tyto alba",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperber",
        "wissenschaftlich": "Accipiter nisus",
        "stadium": "Altvogel",
        "alarmtyp": "Warnruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Sperlingskauz",
        "wissenschaftlich": "Glaucidium passerinum",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      },
      {
        "deutsch": "Waldohreule",
        "wissenschaftlich": "Asio otus",
        "stadium": "Altvogel",
        "alarmtyp": "Hassruf",
        "bestaetigt": true
      }
    ]
  }
];
