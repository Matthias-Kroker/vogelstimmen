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
