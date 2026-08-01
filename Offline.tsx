import { useCallback, useEffect, useState } from "react";
import {
  Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";

import { voegel } from "./daten/voegel";
import {
  artenMitMedien, BUDGET_MB, paketGroesseSchaetzen, paketLaden,
  paketLoeschen, passtInsBudget, speicherStand,
  UMFANG_BESCHREIBUNG, type Fortschritt, type Umfang,
} from "./regionspaket";

const farben = {
  karte: "#212121",
  karteHell: "#2a2a2a",
  text: "#e8e8e8",
  gedaempft: "#9a9a9a",
  akzent: "#7fd1c1",
  warnung: "#e0a458",
};

const mb = (bytes: number) => (bytes / 1048576).toFixed(1);

export default function Offline({ zurueck }: { zurueck: () => void }) {
  const [umfang, setUmfang] = useState<Umfang>("normal");
  const [fortschritt, setFortschritt] = useState<Fortschritt | null>(null);
  const [speicher, setSpeicher] = useState<{
    belegt: number; erlaubt: number; verfuegbar: boolean;
  } | null>(null);

  const speicherHolen = useCallback(async () => {
    setSpeicher(await speicherStand());
  }, []);

  useEffect(() => { speicherHolen(); }, [speicherHolen]);

  const arten = artenMitMedien;
  const passt = passtInsBudget(umfang);
  const geschaetzt = paketGroesseSchaetzen(arten.length, umfang);
  const zuGross = geschaetzt > BUDGET_MB;

  const laden = async () => {
    setFortschritt({ fertig: 0, gesamt: 0, bytes: 0, laeuft: true, fehler: 0 });
    await paketLaden(arten, umfang, setFortschritt);
    speicherHolen();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
      <Pressable onPress={zurueck} style={{ marginBottom: 14 }}>
        <Text style={stile.zurueck}>‹ Zurück</Text>
      </Pressable>

      <Text style={stile.titel}>Offline verfügbar machen</Text>
      <Text style={stile.hinweis}>
        Bilder und Rufe werden sonst erst geladen, wenn du sie anschaust —
        draußen also womöglich gar nicht. Ein Paket legt sie vorher ab.
      </Text>

      <View style={stile.budgetKasten}>
        <Text style={stile.budgetTitel}>Warum ein Budget von {BUDGET_MB} MB</Text>
        <Text style={stile.budgetText}>
          iPhones erlauben einer solchen App nur rund 50 MB Speicher und
          räumen ihn nach etwa einer Woche ohne Nutzung wieder weg. Android
          ist großzügiger. Damit es nur eine Fassung gibt, richtet sich die
          App nach der strengeren Grenze.
        </Text>
      </View>

      <Text style={stile.abschnitt}>Wie ausführlich?</Text>
      {(["knapp", "normal", "alles"] as Umfang[]).map((u) => (
        <Pressable
          key={u}
          onPress={() => setUmfang(u)}
          style={({ pressed }) => [
            stile.wahl, u === umfang && stile.wahlAktiv, pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={[stile.wahlTitel, u === umfang && { color: farben.akzent }]}>
            {u === "knapp" ? "Knapp" : u === "normal" ? "Normal" : "Alles"}
            <Text style={stile.wahlPasst}>
              {"  "}bis {passtInsBudget(u)} Arten
            </Text>
          </Text>
          <Text style={stile.wahlText}>{UMFANG_BESCHREIBUNG[u]}</Text>
        </Pressable>
      ))}

      <View style={stile.zusammenfassung}>
        <Text style={stile.zeile}>
          {arten.length} Arten · geschätzt{" "}
          <Text style={zuGross ? stile.zuviel : stile.gut}>
            {geschaetzt.toFixed(1)} MB
          </Text>
        </Text>
        {zuGross && (
          <Text style={stile.warnung}>
            Über dem Budget. Auf einem iPhone würde das Paket vermutlich
            nicht vollständig erhalten bleiben — knapperen Umfang wählen
            oder damit rechnen, dass Teile später nachgeladen werden.
          </Text>
        )}
        {speicher?.verfuegbar && (
          <Text style={stile.zeileKlein}>
            Belegt derzeit {mb(speicher.belegt)} MB
            {speicher.erlaubt > 0
              ? ` von rund ${mb(speicher.erlaubt)} MB erlaubt`
              : ""}
          </Text>
        )}
      </View>

      {fortschritt?.laeuft ? (
        <View style={stile.laufend}>
          <Text style={stile.laufendText}>
            {fortschritt.fertig} von {fortschritt.gesamt} Dateien
            {fortschritt.bytes > 0 ? ` · ${mb(fortschritt.bytes)} MB` : ""}
          </Text>
          <View style={stile.balken}>
            <View style={[stile.balkenFuellung, {
              width: `${fortschritt.gesamt
                ? (fortschritt.fertig / fortschritt.gesamt) * 100 : 0}%`,
            }]} />
          </View>
        </View>
      ) : (
        <Pressable
          onPress={laden}
          style={({ pressed }) => [stile.knopf, pressed && { opacity: 0.85 }]}
        >
          <Text style={stile.knopfText}>Paket laden</Text>
        </Pressable>
      )}

      {fortschritt && !fortschritt.laeuft && (
        <Text style={stile.ergebnis}>
          {fortschritt.fertig - fortschritt.fehler} Dateien abgelegt
          {fortschritt.bytes > 0 ? ` (${mb(fortschritt.bytes)} MB)` : ""}
          {fortschritt.fehler > 0
            ? ` · ${fortschritt.fehler} fehlgeschlagen`
            : " · vollständig"}
        </Text>
      )}

      <Pressable
        onPress={async () => { await paketLoeschen(); speicherHolen(); setFortschritt(null); }}
        hitSlop={6}
      >
        <Text style={stile.loeschen}>Abgelegte Medien löschen</Text>
      </Pressable>

      <Text style={stile.fussnote}>
        Was du im Quiz oder in den Steckbriefen anschaust, bleibt ohnehin
        gespeichert — das Paket nimmt es nur vorweg.
      </Text>
    </ScrollView>
  );
}

const stile = StyleSheet.create({
  zurueck: { color: farben.akzent, fontSize: 15 },
  titel: { color: farben.text, fontSize: 22, fontWeight: "700", marginBottom: 6 },
  hinweis: { color: farben.gedaempft, fontSize: 14, lineHeight: 20, marginBottom: 16 },

  budgetKasten: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 13,
    borderLeftWidth: 3, borderLeftColor: farben.warnung, marginBottom: 18,
  },
  budgetTitel: { color: farben.warnung, fontSize: 14, fontWeight: "700" },
  budgetText: {
    color: farben.gedaempft, fontSize: 13, lineHeight: 19, marginTop: 5,
  },

  abschnitt: {
    color: farben.text, fontSize: 15.5, fontWeight: "600", marginBottom: 8,
  },
  wahl: {
    backgroundColor: farben.karte, borderRadius: 9, padding: 12,
    marginBottom: 8, borderWidth: 1.5, borderColor: "transparent",
  },
  wahlAktiv: { borderColor: farben.akzent, backgroundColor: farben.karteHell },
  wahlTitel: { color: farben.text, fontSize: 15, fontWeight: "600" },
  wahlPasst: { color: farben.gedaempft, fontSize: 12.5, fontWeight: "400" },
  wahlText: { color: farben.gedaempft, fontSize: 12.5, marginTop: 3 },

  zusammenfassung: { marginTop: 12, marginBottom: 14 },
  zeile: { color: farben.text, fontSize: 14.5 },
  zeileKlein: { color: farben.gedaempft, fontSize: 12.5, marginTop: 5 },
  gut: { color: farben.akzent, fontWeight: "700" },
  zuviel: { color: farben.warnung, fontWeight: "700" },
  warnung: {
    color: farben.warnung, fontSize: 12.5, lineHeight: 18, marginTop: 6,
  },

  knopf: {
    backgroundColor: "#0e639c", borderRadius: 9, paddingVertical: 14,
    alignItems: "center",
  },
  knopfText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  laufend: { marginTop: 4 },
  laufendText: { color: farben.text, fontSize: 14, marginBottom: 8 },
  balken: {
    height: 8, backgroundColor: farben.karte, borderRadius: 4, overflow: "hidden",
  },
  balkenFuellung: { height: "100%", backgroundColor: farben.akzent },

  ergebnis: { color: farben.akzent, fontSize: 13.5, marginTop: 12 },
  loeschen: {
    color: "#6e6e6e", fontSize: 12, marginTop: 18,
    textDecorationLine: "underline",
  },
  fussnote: {
    color: "#6e6e6e", fontSize: 11.5, marginTop: 16, lineHeight: 17,
  },
});
