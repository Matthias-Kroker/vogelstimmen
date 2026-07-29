import { useMemo, useState } from "react";
import {
  FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, View,
} from "react-native";

import { voegel, type Fressfeind, type Vogel } from "./daten/voegel";
import { vogelBilder } from "./assets/voegel";

const farben = {
  hintergrund: "#161616",
  karte: "#212121",
  karteHell: "#2a2a2a",
  text: "#e8e8e8",
  gedaempft: "#9a9a9a",
  akzent: "#7fd1c1",
  warnruf: "#e0a458",
  hassruf: "#8fa8c8",
};

export default function App() {
  const [gewaehlt, setGewaehlt] = useState<Vogel | null>(null);
  const [suche, setSuche] = useState("");

  const gefiltert = useMemo(() => {
    const s = suche.trim().toLowerCase();
    if (!s) return voegel;
    return voegel.filter(
      (v) =>
        v.name_de.toLowerCase().includes(s) ||
        v.name_wissenschaftlich.toLowerCase().includes(s),
    );
  }, [suche]);

  return (
    <SafeAreaView style={stile.flaeche}>
      <StatusBar barStyle="light-content" />
      {gewaehlt ? (
        <Steckbrief vogel={gewaehlt} zurueck={() => setGewaehlt(null)} />
      ) : (
        <Liste
          liste={gefiltert}
          suche={suche}
          setSuche={setSuche}
          waehlen={setGewaehlt}
        />
      )}
    </SafeAreaView>
  );
}

function Liste({
  liste, suche, setSuche, waehlen,
}: {
  liste: Vogel[];
  suche: string;
  setSuche: (s: string) => void;
  waehlen: (v: Vogel) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={stile.kopf}>
        <Text style={stile.titel}>Vögel</Text>
        <Text style={stile.untertitel}>
          {liste.length} von {voegel.length} Arten
        </Text>
        <TextInput
          style={stile.suchfeld}
          placeholder="Suchen…"
          placeholderTextColor={farben.gedaempft}
          value={suche}
          onChangeText={setSuche}
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={liste}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [stile.karte, pressed && stile.gedrueckt]}
            onPress={() => waehlen(item)}
          >
            <Image source={vogelBilder[item.id]} style={stile.vorschau} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={stile.name}>{item.name_de}</Text>
              <Text style={stile.lateinisch}>{item.name_wissenschaftlich}</Text>
              <Text style={stile.feindzahl}>
                {item.fressfeinde.length} Fressfeinde
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={stile.leer}>Nichts gefunden.</Text>}
      />
    </View>
  );
}

function Steckbrief({ vogel, zurueck }: { vogel: Vogel; zurueck: () => void }) {
  // Nach Alarmtyp trennen -- das ist die Unterscheidung, um die es beim
  // Lernen geht: Warnruf gilt Greifvoegeln im Flug, Hassruf allem Sitzenden.
  const warnruf = vogel.fressfeinde.filter((f) => f.alarmtyp === "Warnruf");
  const hassruf = vogel.fressfeinde.filter((f) => f.alarmtyp === "Hassruf");

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable onPress={zurueck} style={stile.zurueck}>
        <Text style={stile.zurueckText}>‹ Alle Vögel</Text>
      </Pressable>

      <Image source={vogelBilder[vogel.id]} style={stile.grossesBild} />

      <View style={{ paddingHorizontal: 18 }}>
        <Text style={stile.titelGross}>{vogel.name_de}</Text>
        <Text style={stile.lateinischGross}>{vogel.name_wissenschaftlich}</Text>

        <Text style={stile.text}>{vogel.beschreibung}</Text>

        {warnruf.length > 0 && (
          <FeindListe
            titel="Warnruf — Feind aus der Luft"
            erklaerung="Hoher dünner Ton, weich ein- und ausklingend. Schwer zu orten. Reaktion: Deckung suchen."
            farbe={farben.warnruf}
            feinde={warnruf}
          />
        )}

        {hassruf.length > 0 && (
          <FeindListe
            titel="Hassruf — sitzender Feind"
            erklaerung="Breitbandig, hart, abgehackt. Leicht zu orten. Reaktion: hinfliegen und bedrängen."
            farbe={farben.hassruf}
            feinde={hassruf}
          />
        )}

        <Text style={stile.quelle}>
          Text: {vogel.quelle_text?.name} ({vogel.quelle_text?.lizenz})
          {vogel.wikidata_id ? ` · Wikidata ${vogel.wikidata_id}` : ""}
          {"\n"}Bild: Wikimedia Commons · Fressfeinde: GloBI, gegengeprüft mit
          Wikipedia
        </Text>
      </View>
    </ScrollView>
  );
}

function FeindListe({
  titel, erklaerung, farbe, feinde,
}: {
  titel: string;
  erklaerung: string;
  farbe: string;
  feinde: Fressfeind[];
}) {
  return (
    <View style={[stile.block, { borderLeftColor: farbe }]}>
      <Text style={[stile.blockTitel, { color: farbe }]}>{titel}</Text>
      <Text style={stile.blockErklaerung}>{erklaerung}</Text>
      {feinde.map((f) => (
        <View key={f.wissenschaftlich} style={stile.feindZeile}>
          <Text style={stile.feindName}>{f.deutsch}</Text>
          <Text style={stile.feindStadium}>
            {f.stadium === "Altvogel"
              ? "erbeutet Altvögel"
              : f.stadium === "Nest"
                ? "plündert Nester"
                : f.stadium === "beides"
                  ? "beides"
                  : "unbekannt"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const stile = StyleSheet.create({
  flaeche: { flex: 1, backgroundColor: farben.hintergrund },
  kopf: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  titel: { color: farben.text, fontSize: 26, fontWeight: "700" },
  untertitel: { color: farben.gedaempft, fontSize: 13, marginTop: 2 },
  suchfeld: {
    backgroundColor: farben.karte, color: farben.text, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 9, marginTop: 12, fontSize: 15,
  },
  karte: {
    flexDirection: "row", alignItems: "center", backgroundColor: farben.karte,
    borderRadius: 10, padding: 10, marginBottom: 10,
  },
  gedrueckt: { backgroundColor: farben.karteHell },
  vorschau: { width: 78, height: 78, borderRadius: 8, backgroundColor: "#000" },
  name: { color: farben.text, fontSize: 17, fontWeight: "600" },
  lateinisch: { color: farben.gedaempft, fontSize: 13, fontStyle: "italic" },
  feindzahl: { color: farben.akzent, fontSize: 12, marginTop: 4 },
  leer: { color: farben.gedaempft, textAlign: "center", marginTop: 30 },

  zurueck: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 6 },
  zurueckText: { color: farben.akzent, fontSize: 15 },
  grossesBild: { width: "100%", height: 260, backgroundColor: "#000" },
  titelGross: {
    color: farben.text, fontSize: 27, fontWeight: "700", marginTop: 14,
  },
  lateinischGross: {
    color: farben.gedaempft, fontSize: 15, fontStyle: "italic", marginBottom: 12,
  },
  text: { color: farben.text, fontSize: 15, lineHeight: 22 },

  block: {
    backgroundColor: farben.karte, borderRadius: 10, borderLeftWidth: 3,
    padding: 14, marginTop: 18,
  },
  blockTitel: { fontSize: 16, fontWeight: "700" },
  blockErklaerung: {
    color: farben.gedaempft, fontSize: 13, marginTop: 4, marginBottom: 10,
    lineHeight: 18,
  },
  feindZeile: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 5, borderTopWidth: 1, borderTopColor: "#333",
  },
  feindName: { color: farben.text, fontSize: 14.5 },
  feindStadium: { color: farben.gedaempft, fontSize: 12.5 },

  quelle: {
    color: "#6e6e6e", fontSize: 11.5, marginTop: 22, lineHeight: 17,
  },
});
