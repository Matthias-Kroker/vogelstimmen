/**
 * Die Vogelsprache-Ansicht: alles, was NICHT an einer einzelnen Art haengt.
 *
 * Warum es diese Ansicht gibt: Bis 2026-08 waren FUENF_STIMMEN und QUELLE
 * in App.tsx zwar importiert, wurden aber nirgends angezeigt. Das Wissen,
 * das die Einzeleintraege ueberhaupt erst erklaert -- warum ein Luftalarm
 * unhoerbar sein SOLL, warum Bewegung mehr ausloest als Anwesenheit --
 * existierte nur im Quelltext. Genau das ist der Teil, den man einmal
 * verstehen muss und danach bei jeder Art wiedererkennt.
 *
 * Aufbau von oben nach unten: erst die Grundsaetze (was gilt ueberall),
 * dann die Fuenf Stimmen (das Raster), dann die Bauformen (das Vokabular
 * der Steckbriefe), zuletzt die Quellen.
 */
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  FUENF_STIMMEN, GRUNDSAETZE, QUELLEN, SIGNALBAU_INFO, type Signalbau,
  type Stimme,
} from "./daten/vogelsprache";

const farben = {
  karte: "#212121",
  karteHell: "#2a2a2a",
  text: "#e8e8e8",
  gedaempft: "#9a9a9a",
  akzent: "#d4a373",
  baseline: "#6e8b7a",
  alarm: "#c1666b",
};

export default function Vogelsprache({ zurueck }: { zurueck: () => void }) {
  const [offen, setOffen] = useState<number | null>(0);

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 44 }}>
      <Pressable onPress={zurueck} style={{ marginBottom: 14 }}>
        <Text style={stile.zurueck}>‹ Zurück</Text>
      </Pressable>

      <Text style={stile.titel}>Vogelsprache</Text>
      <Text style={stile.vorspann}>
        Was hier steht, gilt nicht für eine Art, sondern für alle. Es
        erklärt, warum die Rufe bei den einzelnen Vögeln so beschrieben
        sind, wie sie beschrieben sind — und warum manche davon kaum zu
        hören sind, obwohl sie laut genug wären.
      </Text>

      {/* ---- Grundsätze ------------------------------------------------ */}
      <Text style={stile.abschnitt}>Was überall gilt</Text>
      {GRUNDSAETZE.map((g, i) => {
        const auf = offen === i;
        return (
          <Pressable
            key={g.titel}
            onPress={() => setOffen(auf ? null : i)}
            style={({ pressed }) => [
              stile.satz, auf && stile.satzOffen, pressed && { opacity: 0.85 },
            ]}
          >
            <View style={stile.satzKopf}>
              <Text style={stile.satzTitel}>{g.titel}</Text>
              <Text style={stile.pfeil}>{auf ? "−" : "+"}</Text>
            </View>
            <Text style={stile.satzKurz}>{g.kurz}</Text>

            {auf && (
              <>
                <Text style={stile.satzText}>{g.text}</Text>
                {g.praxis && (
                  <View style={stile.praxis}>
                    <Text style={stile.praxisMarke}>Im Feld</Text>
                    <Text style={stile.praxisText}>{g.praxis}</Text>
                  </View>
                )}
                <Text style={g.beleg === "literatur"
                  ? stile.belegJa : stile.belegNein}>
                  {g.beleg === "literatur" ? "belegt" : "Einschätzung"}
                </Text>
                {g.quellen.map((q) => (
                  <Text key={q} style={stile.quelle}>{q}</Text>
                ))}
              </>
            )}
          </Pressable>
        );
      })}

      {/* ---- Fünf Stimmen ---------------------------------------------- */}
      <Text style={stile.abschnitt}>Die Fünf Stimmen</Text>
      <Text style={stile.abschnittHinweis}>
        Das Raster, nach dem sich alles ordnet. Entscheidend ist, wie wenig
        davon Gefahr bedeutet.
      </Text>
      {(Object.keys(FUENF_STIMMEN) as Stimme[]).map((s) => {
        const info = FUENF_STIMMEN[s];
        return (
          <View
            key={s}
            style={[stile.stimme, {
              borderLeftColor: info.baseline ? farben.baseline : farben.alarm,
            }]}
          >
            <View style={stile.stimmeKopf}>
              <Text style={stile.stimmeTitel}>{info.titel}</Text>
              <Text style={info.baseline ? stile.markeBaseline : stile.markeAlarm}>
                {info.baseline ? "Normalzustand" : "Gefahr"}
              </Text>
            </View>
            <Text style={stile.stimmeText}>{info.beschreibung}</Text>
            {info.hinweis && (
              <Text style={stile.stimmeHinweis}>{info.hinweis}</Text>
            )}
          </View>
        );
      })}

      {/* ---- Bauformen -------------------------------------------------- */}
      <Text style={stile.abschnitt}>Die vier Bauformen</Text>
      <Text style={stile.abschnittHinweis}>
        Diese Begriffe stehen bei jedem Vogel an seinen Rufen. Sie sagen
        voraus, wie gut du das Signal überhaupt wahrnehmen kannst.
      </Text>
      {(Object.keys(SIGNALBAU_INFO) as Signalbau[]).map((b) => (
        <View key={b} style={stile.bauform}>
          <Text style={stile.bauformTitel}>{SIGNALBAU_INFO[b].titel}</Text>
          <Text style={stile.bauformText}>{SIGNALBAU_INFO[b].erklaerung}</Text>
        </View>
      ))}

      {/* ---- Quellen ---------------------------------------------------- */}
      <Text style={stile.abschnitt}>Woher das stammt</Text>
      <Text style={stile.abschnittHinweis}>
        Wo bei einem Vogel „Einschätzung“ steht, ist der Eintrag nicht
        belegt — dann ist es meine Einordnung und im Feld zu prüfen.
      </Text>
      {QUELLEN.map((q) => (
        <Text key={q} style={stile.quellenZeile}>• {q}</Text>
      ))}
    </ScrollView>
  );
}

const stile = StyleSheet.create({
  zurueck: { color: "#7fd1c1", fontSize: 15 },
  titel: { color: farben.text, fontSize: 24, fontWeight: "700", marginBottom: 7 },
  vorspann: {
    color: farben.gedaempft, fontSize: 14, lineHeight: 20, marginBottom: 22,
  },

  abschnitt: {
    color: farben.akzent, fontSize: 16, fontWeight: "700",
    marginTop: 26, marginBottom: 4,
  },
  abschnittHinweis: {
    color: farben.gedaempft, fontSize: 12.5, lineHeight: 18, marginBottom: 11,
  },

  satz: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 13,
    marginBottom: 8, borderWidth: 1.5, borderColor: "transparent",
  },
  satzOffen: { borderColor: farben.akzent, backgroundColor: farben.karteHell },
  satzKopf: { flexDirection: "row", justifyContent: "space-between" },
  satzTitel: {
    color: farben.text, fontSize: 15, fontWeight: "600", flex: 1, paddingRight: 8,
  },
  pfeil: { color: farben.akzent, fontSize: 17, fontWeight: "700" },
  satzKurz: { color: farben.gedaempft, fontSize: 13, marginTop: 3 },
  satzText: {
    color: farben.text, fontSize: 13.5, lineHeight: 20, marginTop: 11,
  },

  praxis: {
    backgroundColor: "#1b2b25", borderRadius: 7, padding: 10, marginTop: 11,
  },
  praxisMarke: {
    color: farben.baseline, fontSize: 11, fontWeight: "700",
    letterSpacing: 0.5, marginBottom: 3,
  },
  praxisText: { color: "#cfe3d8", fontSize: 13, lineHeight: 19 },

  belegJa: {
    color: "#9fd6bc", backgroundColor: "#2d4a3e", fontSize: 11,
    alignSelf: "flex-start", paddingVertical: 3, paddingHorizontal: 8,
    borderRadius: 5, marginTop: 12, overflow: "hidden",
  },
  belegNein: {
    color: "#d6b89f", backgroundColor: "#4a3a2d", fontSize: 11,
    alignSelf: "flex-start", paddingVertical: 3, paddingHorizontal: 8,
    borderRadius: 5, marginTop: 12, overflow: "hidden",
  },
  quelle: { color: "#6e6e6e", fontSize: 10.5, lineHeight: 15, marginTop: 4 },

  stimme: {
    backgroundColor: farben.karte, borderRadius: 9, padding: 12,
    marginBottom: 8, borderLeftWidth: 3,
  },
  stimmeKopf: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4,
  },
  stimmeTitel: { color: farben.text, fontSize: 14.5, fontWeight: "600" },
  markeBaseline: {
    color: "#b9d4c5", backgroundColor: "#2a3b33", fontSize: 10.5,
    paddingVertical: 2, paddingHorizontal: 7, borderRadius: 4, overflow: "hidden",
  },
  markeAlarm: {
    color: "#e8b9bb", backgroundColor: "#3b2a2b", fontSize: 10.5,
    paddingVertical: 2, paddingHorizontal: 7, borderRadius: 4, overflow: "hidden",
  },
  stimmeText: { color: farben.text, fontSize: 13, lineHeight: 19 },
  stimmeHinweis: {
    color: farben.gedaempft, fontSize: 12.5, lineHeight: 18, marginTop: 6,
    fontStyle: "italic",
  },

  bauform: {
    borderLeftWidth: 2, borderLeftColor: "#3a3a3a", paddingLeft: 11,
    marginBottom: 13,
  },
  bauformTitel: { color: farben.text, fontSize: 14, fontWeight: "700" },
  bauformText: {
    color: farben.gedaempft, fontSize: 13, lineHeight: 19, marginTop: 3,
  },

  quellenZeile: {
    color: "#7a7a7a", fontSize: 11.5, lineHeight: 17, marginBottom: 5,
  },
});
