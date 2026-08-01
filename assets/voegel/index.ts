// Erzeugt von data/bilder_commons.py -- nicht von Hand aendern.
// Bilder von Wikimedia Commons. Namensnennung ist Pflicht,
// deshalb stehen Urheber und Lizenz mit in der Tabelle.

export type VogelBild = {
  quelle: number;
  urheber: string;
  lizenz: string;
};

/** Bilder je Art, aufgeteilt nach Motiv. */
export type Bildgruppen = {
  vogel?: VogelBild[];
  nest?: VogelBild[];
  jung?: VogelBild[];
};

export const bildgruppen: Record<string, Bildgruppen> = {
  "accipiter_gentilis": {
    vogel: [
      { quelle: require("./accipiter_gentilis_vogel0.jpg"), urheber: "Bengt Nyman from Vaxholm, Sweden", lizenz: "CC BY 2.0" },
      { quelle: require("./accipiter_gentilis_vogel1.jpg"), urheber: "Jevgenijs Slihto from Riga, Latvia", lizenz: "CC BY 2.0" },
      { quelle: require("./accipiter_gentilis_vogel2.jpg"), urheber: "Jerzy Strzelecki", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./accipiter_gentilis_vogel3.jpg"), urheber: "Afr.1994", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./accipiter_gentilis_vogel4.jpg"), urheber: "harum.koh from Kobe city, Japan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./accipiter_gentilis_vogel5.jpg"), urheber: "Imran Shah from Islamabad, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./accipiter_gentilis_vogel6.jpg"), urheber: "Imran Shah from Islamabad, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./accipiter_gentilis_vogel7.jpg"), urheber: "Imran Shah from Islamabad, Pakistan", lizenz: "CC BY-SA 2.0" },
    ],
    nest: [
      { quelle: require("./accipiter_gentilis_nest0.jpg"), urheber: "Elke Brüser, Flügelschlag und Leisetreter", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./accipiter_gentilis_jung0.jpg"), urheber: "Kudaibergen Amirekul", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./accipiter_gentilis_jung1.jpg"), urheber: "unbekannt", lizenz: "CC BY-SA 3.0" },
    ],
  },
  "accipiter_nisus": {
    vogel: [
      { quelle: require("./accipiter_nisus_vogel0.jpg"), urheber: "YCapelle", lizenz: "Public domain" },
      { quelle: require("./accipiter_nisus_vogel1.jpg"), urheber: "Хомелка", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./accipiter_nisus_vogel2.jpg"), urheber: "Père Igor", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./accipiter_nisus_vogel3.jpg"), urheber: "Père Igor", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./accipiter_nisus_vogel4.jpg"), urheber: "Père Igor", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./accipiter_nisus_vogel5.jpg"), urheber: "Père Igor", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./accipiter_nisus_vogel6.jpg"), urheber: "Père Igor", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./accipiter_nisus_vogel7.jpg"), urheber: "Père Igor", lizenz: "CC BY-SA 3.0" },
    ],
  },
  "buteo_buteo": {
    vogel: [
      { quelle: require("./buteo_buteo_vogel0.jpg"), urheber: "Hans Hillewaert", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./buteo_buteo_vogel1.jpg"), urheber: "Brian Eager from Livno, Bosnia and Herzegovina", lizenz: "CC BY 2.0" },
      { quelle: require("./buteo_buteo_vogel2.jpg"), urheber: "Konstantinos Ntougkas", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./buteo_buteo_vogel3.jpg"), urheber: "Notafly", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./buteo_buteo_vogel4.jpg"), urheber: "Frank Vassen from Brussels, Belgium", lizenz: "CC BY 2.0" },
      { quelle: require("./buteo_buteo_vogel5.jpg"), urheber: "Vera Buhl", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./buteo_buteo_vogel6.jpg"), urheber: "Vera Buhl", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./buteo_buteo_vogel7.jpg"), urheber: "Vera Buhl", lizenz: "CC BY-SA 3.0" },
    ],
    nest: [
      { quelle: require("./buteo_buteo_nest0.jpg"), urheber: "Dominicus Johannes Bergsma", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./buteo_buteo_nest1.jpg"), urheber: "Dominicus Johannes Bergsma", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./buteo_buteo_nest2.jpg"), urheber: "Seebohm", lizenz: "Public domain" },
    ],
    jung: [
      { quelle: require("./buteo_buteo_jung0.jpg"), urheber: "Fischer.H", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./buteo_buteo_jung1.jpg"), urheber: "FrooiOhnesorg", lizenz: "CC BY-SA 2.0" },
    ],
  },
  "columba_palumbus": {
    vogel: [
      { quelle: require("./columba_palumbus_vogel0.jpg"), urheber: "MPF", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./columba_palumbus_vogel1.jpg"), urheber: "MPF", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./columba_palumbus_vogel2.jpg"), urheber: "Donald Hobern from Copenhagen, Denmark", lizenz: "CC BY 2.0" },
      { quelle: require("./columba_palumbus_vogel3.jpg"), urheber: "Donald Hobern from Copenhagen, Denmark", lizenz: "CC BY 2.0" },
      { quelle: require("./columba_palumbus_vogel4.jpg"), urheber: "Donald Hobern from Copenhagen, Denmark", lizenz: "CC BY 2.0" },
      { quelle: require("./columba_palumbus_vogel5.jpg"), urheber: "Donald Hobern from Copenhagen, Denmark", lizenz: "CC BY 2.0" },
      { quelle: require("./columba_palumbus_vogel6.jpg"), urheber: "Donald Hobern from Copenhagen, Denmark", lizenz: "CC BY 2.0" },
      { quelle: require("./columba_palumbus_vogel7.jpg"), urheber: "Donald Hobern from Copenhagen, Denmark", lizenz: "CC BY 2.0" },
    ],
    nest: [
      { quelle: require("./columba_palumbus_nest0.jpg"), urheber: "Hannes Grobe", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./columba_palumbus_nest1.jpg"), urheber: "VSchagow", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./columba_palumbus_nest2.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./columba_palumbus_jung0.jpg"), urheber: "Walter Baxter", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./columba_palumbus_jung1.jpg"), urheber: "Adrian Pingstone (Arpingstone)", lizenz: "Public domain" },
    ],
  },
  "corvus_corax": {
    vogel: [
      { quelle: require("./corvus_corax_vogel0.jpg"), urheber: "Charles J. Sharp", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corax_vogel1.jpg"), urheber: "Bailey Duncan", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corax_vogel2.jpg"), urheber: "Bailey Duncan", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corax_vogel3.jpg"), urheber: "Rene Nueesch", lizenz: "CC BY 3.0" },
      { quelle: require("./corvus_corax_vogel4.jpg"), urheber: "Joshua Tree National Park", lizenz: "Public domain" },
      { quelle: require("./corvus_corax_vogel5.jpg"), urheber: "Joshua Tree National Park", lizenz: "Public domain" },
      { quelle: require("./corvus_corax_vogel6.jpg"), urheber: "Joshua Tree National Park", lizenz: "Public domain" },
      { quelle: require("./corvus_corax_vogel7.jpg"), urheber: "Joshua Tree National Park", lizenz: "Public domain" },
    ],
    nest: [
      { quelle: require("./corvus_corax_nest0.jpg"), urheber: "Віщун", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corax_nest1.jpg"), urheber: "Tamdikatamdikabalebale", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corax_nest2.jpg"), urheber: "User:XRiffRaffx", lizenz: "CC BY-SA 3.0" },
    ],
    jung: [
      { quelle: require("./corvus_corax_jung0.jpg"), urheber: "xulescu_g", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./corvus_corax_jung1.jpg"), urheber: "Ciaran Lee from Ireland", lizenz: "CC BY-SA 2.0" },
    ],
  },
  "corvus_corone": {
    vogel: [
      { quelle: require("./corvus_corone_vogel0.jpg"), urheber: "José Véron-Durand", lizenz: "CC0" },
      { quelle: require("./corvus_corone_vogel1.jpg"), urheber: "M J Richardson", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./corvus_corone_vogel2.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corone_vogel3.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corone_vogel4.jpg"), urheber: "pete beard", lizenz: "CC BY 2.0" },
      { quelle: require("./corvus_corone_vogel5.jpg"), urheber: "Charles J. Sharp", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./corvus_corone_vogel6.jpg"), urheber: "AnemoneProjectors (talk)", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./corvus_corone_vogel7.jpg"), urheber: "KPFC", lizenz: "CC BY-SA 3.0" },
    ],
    nest: [
      { quelle: require("./corvus_corone_nest0.jpg"), urheber: "Marie-Lan Taÿ Pamart", lizenz: "CC BY 4.0" },
      { quelle: require("./corvus_corone_nest1.jpg"), urheber: "Marie-Lan Taÿ Pamart", lizenz: "CC BY 4.0" },
      { quelle: require("./corvus_corone_nest2.jpg"), urheber: "Marie-Lan Taÿ Pamart", lizenz: "CC BY 4.0" },
    ],
    jung: [
      { quelle: require("./corvus_corone_jung0.jpg"), urheber: "Gzen92", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./corvus_corone_jung1.jpg"), urheber: "Marie-Lan Taÿ Pamart", lizenz: "CC BY 4.0" },
    ],
  },
  "cyanistes_caeruleus": {
    vogel: [
      { quelle: require("./cyanistes_caeruleus_vogel0.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel1.jpg"), urheber: "Daniel Schiersner", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel2.jpg"), urheber: "Daniel Schiersner", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel3.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel4.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel5.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel6.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./cyanistes_caeruleus_vogel7.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
    ],
    nest: [
      { quelle: require("./cyanistes_caeruleus_nest0.jpg"), urheber: "Dellex", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./cyanistes_caeruleus_nest1.jpg"), urheber: "Oskila", lizenz: "CC BY-SA 2.5 se" },
      { quelle: require("./cyanistes_caeruleus_nest2.jpg"), urheber: "Rüdiger Stehn from Kiel, Deutschland", lizenz: "CC BY-SA 2.0" },
    ],
    jung: [
      { quelle: require("./cyanistes_caeruleus_jung0.jpg"), urheber: "Powerhauer", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./cyanistes_caeruleus_jung1.jpg"), urheber: "losch", lizenz: "CC BY-SA 3.0" },
    ],
  },
  "dendrocopos_major": {
    vogel: [
      { quelle: require("./dendrocopos_major_vogel0.jpg"), urheber: "JoachimKohler-HB", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./dendrocopos_major_vogel1.jpg"), urheber: "Արարատ Թրվանց", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./dendrocopos_major_vogel2.jpg"), urheber: "Արարատ Թրվանց", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./dendrocopos_major_vogel3.jpg"), urheber: "Արարատ Թրվանց", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./dendrocopos_major_vogel4.jpg"), urheber: "hedera.baltica from Wrocław, Poland", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./dendrocopos_major_vogel5.jpg"), urheber: "Ксения Волянская", lizenz: "CC BY 4.0" },
      { quelle: require("./dendrocopos_major_vogel6.jpg"), urheber: "Михаил Малышев", lizenz: "CC BY 4.0" },
      { quelle: require("./dendrocopos_major_vogel7.jpg"), urheber: "Francesco Cecere", lizenz: "CC BY 4.0" },
    ],
    nest: [
      { quelle: require("./dendrocopos_major_nest0.jpg"), urheber: "Acabashi", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./dendrocopos_major_nest1.jpg"), urheber: "Beentree", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./dendrocopos_major_nest2.jpg"), urheber: "Andy  Vernon", lizenz: "CC BY 2.0" },
    ],
    jung: [
      { quelle: require("./dendrocopos_major_jung0.jpg"), urheber: "Ein Dahmer", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./dendrocopos_major_jung1.jpg"), urheber: "Mucki", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "erithacus_rubecula": {
    vogel: [
      { quelle: require("./erithacus_rubecula_vogel0.jpg"), urheber: "JoachimKohler-HB", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./erithacus_rubecula_vogel1.jpg"), urheber: "Freddy2001", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./erithacus_rubecula_vogel2.jpg"), urheber: "Jaramo81", lizenz: "CC BY 4.0" },
      { quelle: require("./erithacus_rubecula_vogel3.jpg"), urheber: "JoachimKohler-HB", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./erithacus_rubecula_vogel4.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./erithacus_rubecula_vogel5.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./erithacus_rubecula_vogel6.jpg"), urheber: "DarkConny94", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./erithacus_rubecula_vogel7.jpg"), urheber: "David Dixon", lizenz: "CC BY-SA 2.0" },
    ],
    nest: [
      { quelle: require("./erithacus_rubecula_nest0.jpg"), urheber: "Notafly", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./erithacus_rubecula_nest1.jpg"), urheber: "Yerpo", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./erithacus_rubecula_nest2.jpg"), urheber: "Charles J. Sharp", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./erithacus_rubecula_jung0.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./erithacus_rubecula_jung1.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "falco_tinnunculus": {
    vogel: [
      { quelle: require("./falco_tinnunculus_vogel0.jpg"), urheber: "Fabian Horst", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./falco_tinnunculus_vogel1.jpg"), urheber: "Fabian Horst", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./falco_tinnunculus_vogel2.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./falco_tinnunculus_vogel3.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./falco_tinnunculus_vogel4.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./falco_tinnunculus_vogel5.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./falco_tinnunculus_vogel6.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./falco_tinnunculus_vogel7.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
    ],
    nest: [
      { quelle: require("./falco_tinnunculus_nest0.jpg"), urheber: "Marie-Lan Taÿ Pamart", lizenz: "CC BY 4.0" },
      { quelle: require("./falco_tinnunculus_nest1.jpg"), urheber: "Notafly", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./falco_tinnunculus_nest2.jpg"), urheber: "Oberheimbach", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./falco_tinnunculus_jung0.jpg"), urheber: "Oberheimbach", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./falco_tinnunculus_jung1.jpg"), urheber: "Roman Eisele", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "fringilla_coelebs": {
    vogel: [
      { quelle: require("./fringilla_coelebs_vogel0.jpg"), urheber: "HKokopelli", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./fringilla_coelebs_vogel1.jpg"), urheber: "blondinrikard", lizenz: "CC BY 2.0" },
      { quelle: require("./fringilla_coelebs_vogel2.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./fringilla_coelebs_vogel3.jpg"), urheber: "Kathy Büscher from Rinteln, Deutschland", lizenz: "CC BY 2.0" },
      { quelle: require("./fringilla_coelebs_vogel4.jpg"), urheber: "Membeth", lizenz: "CC0" },
      { quelle: require("./fringilla_coelebs_vogel5.jpg"), urheber: "Membeth", lizenz: "CC0" },
      { quelle: require("./fringilla_coelebs_vogel6.jpg"), urheber: "Membeth", lizenz: "CC0" },
      { quelle: require("./fringilla_coelebs_vogel7.jpg"), urheber: "Membeth", lizenz: "CC0" },
    ],
    nest: [
      { quelle: require("./fringilla_coelebs_nest0.jpg"), urheber: "Sciencia58", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./fringilla_coelebs_nest1.jpg"), urheber: "Ensahequ", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./fringilla_coelebs_nest2.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./fringilla_coelebs_jung0.jpg"), urheber: "Andreas Eichler", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./fringilla_coelebs_jung1.jpg"), urheber: "Andreas Eichler", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "garrulus_glandarius": {
    vogel: [
      { quelle: require("./garrulus_glandarius_vogel0.jpg"), urheber: "Donfredo-sl", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./garrulus_glandarius_vogel1.jpg"), urheber: "zoetnet", lizenz: "CC BY 2.0" },
      { quelle: require("./garrulus_glandarius_vogel2.jpg"), urheber: "Michel Langeveld", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./garrulus_glandarius_vogel3.jpg"), urheber: "Birkenpilz", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./garrulus_glandarius_vogel4.jpg"), urheber: "Crusier", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./garrulus_glandarius_vogel5.jpg"), urheber: "Boksi", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./garrulus_glandarius_vogel6.jpg"), urheber: "Lotte76", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./garrulus_glandarius_vogel7.jpg"), urheber: "Lotte76", lizenz: "CC BY-SA 4.0" },
    ],
    nest: [
      { quelle: require("./garrulus_glandarius_nest0.jpg"), urheber: "User:XRiffRaffx", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./garrulus_glandarius_nest1.jpg"), urheber: "nottsexminer", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./garrulus_glandarius_nest2.jpg"), urheber: "nottsexminer", lizenz: "CC BY-SA 2.0" },
    ],
    jung: [
      { quelle: require("./garrulus_glandarius_jung0.jpg"), urheber: "Jannis Lehmann", lizenz: "CC0" },
      { quelle: require("./garrulus_glandarius_jung1.jpg"), urheber: "Soldier of Wasteland", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "parus_major": {
    vogel: [
      { quelle: require("./parus_major_vogel0.jpg"), urheber: "Bärbel Miemietz", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_vogel1.jpg"), urheber: "https://vogelskijken.store/", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_vogel2.jpg"), urheber: "WikiPokos", lizenz: "CC0" },
      { quelle: require("./parus_major_vogel3.jpg"), urheber: "Salvatore De Castro", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_vogel4.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_vogel5.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_vogel6.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_vogel7.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
    ],
    nest: [
      { quelle: require("./parus_major_nest0.jpg"), urheber: "unbekannt", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./parus_major_nest1.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./parus_major_nest2.jpg"), urheber: "Zeynel Cebeci", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./parus_major_jung0.jpg"), urheber: "Bernd Thaller from Graz, Austria", lizenz: "CC BY 2.0" },
      { quelle: require("./parus_major_jung1.jpg"), urheber: "4028mdk09", lizenz: "CC BY-SA 3.0" },
    ],
  },
  "passer_domesticus": {
    vogel: [
      { quelle: require("./passer_domesticus_vogel0.jpg"), urheber: "Elke Brüser", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./passer_domesticus_vogel1.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./passer_domesticus_vogel2.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./passer_domesticus_vogel3.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./passer_domesticus_vogel4.jpg"), urheber: "Birds of Gilgit-Baltistan from Aliabad, Hunza, Pakistan", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./passer_domesticus_vogel5.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./passer_domesticus_vogel6.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./passer_domesticus_vogel7.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
    ],
    nest: [
      { quelle: require("./passer_domesticus_nest0.jpg"), urheber: "Elke Brüser", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./passer_domesticus_nest1.jpg"), urheber: "Notafly", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./passer_domesticus_nest2.jpg"), urheber: "Zeynel Cebeci", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./passer_domesticus_jung0.jpg"), urheber: "BlueBreezeWiki", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./passer_domesticus_jung1.jpg"), urheber: "BlueBreezeWiki", lizenz: "CC BY-SA 3.0" },
    ],
  },
  "phylloscopus_collybita": {
    vogel: [
      { quelle: require("./phylloscopus_collybita_vogel0.jpg"), urheber: "Zeynel Cebeci", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./phylloscopus_collybita_vogel1.jpg"), urheber: "gailhampshire from Cradley, Malvern, U.K", lizenz: "CC BY 2.0" },
      { quelle: require("./phylloscopus_collybita_vogel2.jpg"), urheber: "gailhampshire from Cradley, Malvern, U.K", lizenz: "CC BY 2.0" },
      { quelle: require("./phylloscopus_collybita_vogel3.jpg"), urheber: "gailhampshire from Cradley, Malvern, U.K", lizenz: "CC BY 2.0" },
      { quelle: require("./phylloscopus_collybita_vogel4.jpg"), urheber: "Andreas Eichler", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./phylloscopus_collybita_vogel5.jpg"), urheber: "Andreas Eichler", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./phylloscopus_collybita_vogel6.jpg"), urheber: "Andreas Eichler", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./phylloscopus_collybita_vogel7.jpg"), urheber: "Andreas Eichler", lizenz: "CC BY-SA 4.0" },
    ],
    nest: [
      { quelle: require("./phylloscopus_collybita_nest0.jpg"), urheber: "unbekannt", lizenz: "CC BY 4.0" },
      { quelle: require("./phylloscopus_collybita_nest1.jpg"), urheber: "unbekannt", lizenz: "CC BY 4.0" },
      { quelle: require("./phylloscopus_collybita_nest2.jpg"), urheber: "unbekannt", lizenz: "CC BY 4.0" },
    ],
  },
  "pica_pica": {
    vogel: [
      { quelle: require("./pica_pica_vogel0.jpg"), urheber: "4028mdk09", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./pica_pica_vogel1.jpg"), urheber: "Charles J. Sharp", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./pica_pica_vogel2.jpg"), urheber: "Konstantin Lukas", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./pica_pica_vogel3.jpg"), urheber: "Fischer.H", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./pica_pica_vogel4.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./pica_pica_vogel5.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./pica_pica_vogel6.jpg"), urheber: "blondinrikard", lizenz: "CC BY 2.0" },
      { quelle: require("./pica_pica_vogel7.jpg"), urheber: "gailhampshire from Cradley, Malvern, U.K", lizenz: "CC BY 2.0" },
    ],
    nest: [
      { quelle: require("./pica_pica_nest0.jpg"), urheber: "W.carter", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./pica_pica_nest1.jpg"), urheber: "Leo Johannes", lizenz: "Public domain" },
      { quelle: require("./pica_pica_nest2.jpg"), urheber: "W.carter", lizenz: "CC0" },
    ],
    jung: [
      { quelle: require("./pica_pica_jung0.jpg"), urheber: "Ragnar76149", lizenz: "CC BY 4.0" },
      { quelle: require("./pica_pica_jung1.jpg"), urheber: "Ulilil", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "poecile_palustris": {
    vogel: [
      { quelle: require("./poecile_palustris_vogel0.jpg"), urheber: "Georgi.petrov66", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./poecile_palustris_vogel1.jpg"), urheber: "Georgi.petrov66", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./poecile_palustris_vogel2.jpg"), urheber: "gailhampshire", lizenz: "CC BY 2.0" },
      { quelle: require("./poecile_palustris_vogel3.jpg"), urheber: "gailhampshire", lizenz: "CC BY 2.0" },
      { quelle: require("./poecile_palustris_vogel4.jpg"), urheber: "gailhampshire", lizenz: "CC BY 2.0" },
      { quelle: require("./poecile_palustris_vogel5.jpg"), urheber: "gailhampshire from Cradley, Malvern, U.K", lizenz: "CC BY 2.0" },
      { quelle: require("./poecile_palustris_vogel6.jpg"), urheber: "David Merrett from Daventry, England", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./poecile_palustris_vogel7.jpg"), urheber: "Ken Billington", lizenz: "CC BY-SA 3.0" },
    ],
  },
  "prunella_modularis": {
    vogel: [
      { quelle: require("./prunella_modularis_vogel0.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./prunella_modularis_vogel1.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./prunella_modularis_vogel2.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./prunella_modularis_vogel3.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./prunella_modularis_vogel4.jpg"), urheber: "Holger Uwe Schmitt", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./prunella_modularis_vogel5.jpg"), urheber: "Bernard DUPONT from FRANCE", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./prunella_modularis_vogel6.jpg"), urheber: "Frank Vassen from Brussels, Belgium", lizenz: "CC BY 2.0" },
      { quelle: require("./prunella_modularis_vogel7.jpg"), urheber: "AnemoneProjectors (talk)", lizenz: "CC BY-SA 2.0" },
    ],
    nest: [
      { quelle: require("./prunella_modularis_nest0.jpg"), urheber: "Walcoford", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./prunella_modularis_nest1.jpg"), urheber: "Walcoford", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./prunella_modularis_nest2.jpg"), urheber: "unbekannt", lizenz: "CC BY 4.0" },
    ],
    jung: [
      { quelle: require("./prunella_modularis_jung0.jpg"), urheber: "caroline legg", lizenz: "CC BY 2.0" },
      { quelle: require("./prunella_modularis_jung1.jpg"), urheber: "Ralf Hüsges", lizenz: "CC BY 4.0" },
    ],
  },
  "sturnus_vulgaris": {
    vogel: [
      { quelle: require("./sturnus_vulgaris_vogel0.jpg"), urheber: "Gemiwala", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./sturnus_vulgaris_vogel1.jpg"), urheber: "Mike Prince from Bangalore, India", lizenz: "CC BY 2.0" },
      { quelle: require("./sturnus_vulgaris_vogel2.jpg"), urheber: "Mike Prince from Bangalore, India", lizenz: "CC BY 2.0" },
      { quelle: require("./sturnus_vulgaris_vogel3.jpg"), urheber: "hedera.baltica from Wrocław, Poland", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./sturnus_vulgaris_vogel4.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./sturnus_vulgaris_vogel5.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./sturnus_vulgaris_vogel6.jpg"), urheber: "Ryan Hodnett", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./sturnus_vulgaris_vogel7.jpg"), urheber: "Si Griffiths", lizenz: "CC BY-SA 3.0" },
    ],
    nest: [
      { quelle: require("./sturnus_vulgaris_nest0.jpg"), urheber: "Simon Mannweiler", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./sturnus_vulgaris_nest1.jpg"), urheber: "Joris Egger", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./sturnus_vulgaris_nest2.jpg"), urheber: "Franzfoto", lizenz: "CC BY-SA 3.0" },
    ],
    jung: [
      { quelle: require("./sturnus_vulgaris_jung0.jpg"), urheber: "Airwolfhound from Hertfordshire, UK", lizenz: "CC BY-SA 2.0" },
      { quelle: require("./sturnus_vulgaris_jung1.jpg"), urheber: "Charles J. Sharp", lizenz: "CC BY-SA 4.0" },
    ],
  },
  "troglodytes_troglodytes": {
    vogel: [
      { quelle: require("./troglodytes_troglodytes_vogel0.jpg"), urheber: "Nikola Veljković", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./troglodytes_troglodytes_vogel1.jpg"), urheber: "Sonnenscheinsusi", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./troglodytes_troglodytes_vogel2.jpg"), urheber: "Frank Vassen from Brussels, Belgium", lizenz: "CC BY 2.0" },
      { quelle: require("./troglodytes_troglodytes_vogel3.jpg"), urheber: "Frank Vassen from Brussels, Belgium", lizenz: "CC BY 2.0" },
      { quelle: require("./troglodytes_troglodytes_vogel4.jpg"), urheber: "Frank Vassen from Brussels, Belgium", lizenz: "CC BY 2.0" },
      { quelle: require("./troglodytes_troglodytes_vogel5.jpg"), urheber: "Frank Vassen from Brussels, Belgium", lizenz: "CC BY 2.0" },
      { quelle: require("./troglodytes_troglodytes_vogel6.jpg"), urheber: "Joefrei", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./troglodytes_troglodytes_vogel7.jpg"), urheber: "Blondinrikard Fröberg", lizenz: "CC BY 2.0" },
    ],
  },
  "turdus_merula": {
    vogel: [
      { quelle: require("./turdus_merula_vogel0.jpg"), urheber: "Federlesen", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./turdus_merula_vogel1.jpg"), urheber: "Glitzerli", lizenz: "CC BY 4.0" },
      { quelle: require("./turdus_merula_vogel2.jpg"), urheber: "Niklas Vogel Experte", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./turdus_merula_vogel3.jpg"), urheber: "Vera Buhl", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./turdus_merula_vogel4.jpg"), urheber: "Romate", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./turdus_merula_vogel5.jpg"), urheber: "Kolforn (Kolforn)\nI'd appreciate if you could mail me (Kolforn@gmail.com) if you want to use this picture out of the Wik", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./turdus_merula_vogel6.jpg"), urheber: "Kolforn (Kolforn)\nI'd appreciate if you could mail me (Kolforn@gmail.com) if you want to use this picture out of the Wik", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./turdus_merula_vogel7.jpg"), urheber: "Vera Buhl", lizenz: "CC BY-SA 3.0" },
    ],
    nest: [
      { quelle: require("./turdus_merula_nest0.jpg"), urheber: "Reinhold Möller Ermell", lizenz: "CC BY-SA 4.0" },
      { quelle: require("./turdus_merula_nest1.jpg"), urheber: "ThomasKrude", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./turdus_merula_nest2.jpg"), urheber: "Fred Stinnen", lizenz: "CC BY-SA 4.0" },
    ],
    jung: [
      { quelle: require("./turdus_merula_jung0.jpg"), urheber: "Drahreg01", lizenz: "CC BY-SA 3.0" },
      { quelle: require("./turdus_merula_jung1.jpg"), urheber: "Niklas Vogel Experte", lizenz: "CC BY-SA 4.0" },
    ],
  },
};

/** Nur die Vogelbilder -- fuer Liste und Quiz. */
export const vogelBilderAlle: Record<string, VogelBild[]> =
  Object.fromEntries(
    Object.entries(bildgruppen)
      .filter(([, g]) => (g.vogel?.length ?? 0) > 0)
      .map(([k, g]) => [k, g.vogel!]),
  );

/** Erstes Vogelbild je Art. */
export const vogelBilder: Record<string, number> =
  Object.fromEntries(
    Object.entries(vogelBilderAlle).map(([k, v]) => [k, v[0].quelle]),
  );
