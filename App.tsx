import { useMemo, useState } from "react";
import {
  FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, View,
} from "react-native";

import { useAudioPlayer } from "expo-audio";

import { voegel, type Anteil, type Fressfeind, type Vogel } from "./daten/voegel";
import { bildgruppen, vogelBilder, vogelBilderAlle } from "./assets/voegel";
import Quiz from "./Quiz";
import Offline from "./Offline";
import VogelspracheAnsicht from "./Vogelsprache";
import { rufeZuVogel, type Ruf } from "./assets/rufe";
import {
  ALARMPROFILE, AUSLOESER_HINWEIS, SIGNALBAU_INFO,
} from "./daten/vogelsprache";

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
  const [imQuiz, setImQuiz] = useState(false);
  const [imOffline, setImOffline] = useState(false);
  const [inSprache, setInSprache] = useState(false);
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
      {inSprache ? (
        <VogelspracheAnsicht zurueck={() => setInSprache(false)} />
      ) : imOffline ? (
        <Offline zurueck={() => setImOffline(false)} />
      ) : imQuiz ? (
        <Quiz zurueck={() => setImQuiz(false)} />
      ) : gewaehlt ? (
        <Steckbrief
          vogel={gewaehlt}
          zurueck={() => setGewaehlt(null)}
          spracheOeffnen={() => setInSprache(true)}
        />
      ) : (
        <Liste
          liste={gefiltert}
          suche={suche}
          setSuche={setSuche}
          waehlen={setGewaehlt}
          quizStarten={() => setImQuiz(true)}
          offlineOeffnen={() => setImOffline(true)}
          spracheOeffnen={() => setInSprache(true)}
        />
      )}
    </SafeAreaView>
  );
}

function Liste({
  liste, suche, setSuche, waehlen, quizStarten, offlineOeffnen, spracheOeffnen,
}: {
  liste: Vogel[];
  suche: string;
  setSuche: (s: string) => void;
  waehlen: (v: Vogel) => void;
  quizStarten: () => void;
  offlineOeffnen: () => void;
  spracheOeffnen: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={stile.kopf}>
        <Text style={stile.titel}>Vögel</Text>
        <Text style={stile.untertitel}>
          {liste.length} von {voegel.length} Arten
        </Text>
        <View style={stile.knopfreihe}>
          <Pressable
            onPress={quizStarten}
            style={({ pressed }) => [stile.quizKnopf, pressed && { opacity: 0.8 }]}
          >
            <Text style={stile.quizKnopfText}>Quiz starten</Text>
          </Pressable>
          <Pressable
            onPress={spracheOeffnen}
            style={({ pressed }) => [stile.spracheKnopf, pressed && { opacity: 0.8 }]}
          >
            <Text style={stile.spracheKnopfText}>Vogelsprache</Text>
          </Pressable>
          <Pressable
            onPress={offlineOeffnen}
            style={({ pressed }) => [stile.offlineKnopf, pressed && { opacity: 0.8 }]}
          >
            <Text style={stile.offlineKnopfText}>Offline</Text>
          </Pressable>
        </View>
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
            {/* contain statt cover: bei cover wird der Vogel angeschnitten,
                und gerade den will man sehen. */}
            <Image
              source={vogelBilder[item.id]}
              style={stile.vorschau}
              resizeMode="contain"
            />
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

function Steckbrief({ vogel, zurueck, spracheOeffnen }: {
  vogel: Vogel; zurueck: () => void; spracheOeffnen: () => void;
}) {
  // Nach Alarmtyp trennen -- das ist die Unterscheidung, um die es beim
  // Lernen geht: Warnruf gilt Greifvoegeln im Flug, Hassruf allem Sitzenden.
  const warnruf = vogel.fressfeinde.filter((f) => f.alarmtyp === "Warnruf");
  const hassruf = vogel.fressfeinde.filter((f) => f.alarmtyp === "Hassruf");

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable onPress={zurueck} style={stile.zurueck}>
        <Text style={stile.zurueckText}>‹ Alle Vögel</Text>
      </Pressable>

      <Galerie vogel={vogel} />

      <View style={{ paddingHorizontal: 18 }}>
        <Text style={stile.titelGross}>{vogel.name_de}</Text>
        <Text style={stile.lateinischGross}>{vogel.name_wissenschaftlich}</Text>

        <Rufe vogel={vogel} />

        <Vogelsprache vogel={vogel} spracheOeffnen={spracheOeffnen} />

        <Merkmale vogel={vogel} />

        <Text style={stile.text}>{vogel.beschreibung}</Text>

        <Abschnitte vogel={vogel} />

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
          {"\n"}Merkmale: AVONET (Tobias et al. 2022) und EltonTraits (Wilman
          et al. 2014) — grobe Kategorien für 11.000 Arten, im Einzelfall ungenau
        </Text>
      </View>
    </ScrollView>
  );
}

const BILDGRUPPE_TITEL: Record<string, string> = {
  vogel: "Der Vogel",
  nest: "Nest & Eier",
  jung: "Jungvögel",
};

function Galerie({ vogel }: { vogel: Vogel }) {
  const gruppen = bildgruppen[vogel.id] || {};
  const [gruppe, setGruppe] = useState<"vogel" | "nest" | "jung">("vogel");
  const [nr, setNr] = useState(0);

  const vorhanden = (["vogel", "nest", "jung"] as const).filter(
    (g) => (gruppen[g]?.length ?? 0) > 0,
  );
  const bilder = gruppen[gruppe] || [];
  const bild = bilder[Math.min(nr, bilder.length - 1)];
  if (!bild) return null;

  return (
    <View>
      {/* contain, nicht cover: sonst wird bei Hochformat der Vogel
          angeschnitten -- und gerade den will man sehen. */}
      <Image source={bild.quelle} style={stile.grossesBild} resizeMode="contain" />

      {/* Punkte zum Durchblättern innerhalb der Gruppe */}
      {bilder.length > 1 && (
        <View style={stile.punktreihe}>
          {bilder.map((_, i) => (
            <Pressable key={i} onPress={() => setNr(i)} hitSlop={8}>
              <View style={[stile.punkt, i === Math.min(nr, bilder.length - 1)
                && stile.punktAktiv]} />
            </Pressable>
          ))}
        </View>
      )}

      {vorhanden.length > 1 && (
        <View style={stile.gruppenreihe}>
          {vorhanden.map((g) => (
            <Pressable
              key={g}
              onPress={() => { setGruppe(g); setNr(0); }}
              style={({ pressed }) => [
                stile.gruppenknopf,
                g === gruppe && stile.gruppenknopfAktiv,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[stile.gruppenknopfText,
                g === gruppe && { color: "#fff" }]}>
                {BILDGRUPPE_TITEL[g]}
                <Text style={stile.gruppenAnzahl}> {gruppen[g]!.length}</Text>
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Commons verlangt Namensnennung je Bild */}
      <Text style={stile.bildquelle}>
        {bild.urheber ? `Foto: ${bild.urheber}` : "Wikimedia Commons"}
        {bild.lizenz ? ` · ${bild.lizenz}` : ""}
      </Text>
    </View>
  );
}

const KATEGORIE_TITEL: Record<string, string> = {
  gesang: "Gesang",
  rufe: "Rufe",
  trommeln: "Trommeln",
};

function Rufe({ vogel }: { vogel: Vogel }) {
  const alle = rufeZuVogel[vogel.id] || [];
  const [laeuft, setLaeuft] = useState<Ruf | null>(null);
  // Ein Spieler für alles: mehrere gleichzeitig wären nur Krach. Und der
  // Spieler wird EINMAL angelegt, danach nur die Quelle gewechselt --
  // sonst verwirft der Hook den alten mitten im Laden (AbortError).
  const spieler = useAudioPlayer();

  if (!alle.length) return null;

  const nachKategorie: Record<string, Ruf[]> = {};
  for (const r of alle) (nachKategorie[r.kategorie] ??= []).push(r);

  const abspielen = (r: Ruf) => {
    setLaeuft(r);
    try {
      if (r.id === laeuft?.id) {
        // Derselbe Ruf nochmal: nur zurueckspulen, nicht neu laden
        spieler.seekTo(0);
      } else {
        spieler.replace(r.quelle);
      }
      spieler.play();
    } catch {
      // Ein fehlgeschlagener Ton soll die Ansicht nicht stoeren
    }
  };

  return (
    <View style={stile.rufBlock}>
      {Object.entries(nachKategorie).map(([kat, liste]) => (
        <View key={kat} style={{ marginBottom: 10 }}>
          <Text style={stile.rufKategorie}>
            {KATEGORIE_TITEL[kat] ?? kat}
            <Text style={stile.rufAnzahl}> · {liste.length}</Text>
          </Text>
          <View style={stile.rufReihe}>
            {liste.map((r, i) => (
              <Pressable
                key={r.id}
                onPress={() => abspielen(r)}
                style={({ pressed }) => [
                  stile.rufKnopf,
                  laeuft?.id === r.id && stile.rufKnopfAktiv,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={stile.rufKnopfText}>▶ {i + 1}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {laeuft && (
        // Namensnennung ist bei BY-NC-SA Pflicht, nicht Höflichkeit.
        <Text style={stile.rufQuelle}>
          {laeuft.xcTyp} · {laeuft.land}
          {"\n"}Aufnahme: {laeuft.aufnehmer} · xeno-canto XC{laeuft.xcId}
          {"\n"}{laeuft.lizenz}
        </Text>
      )}
    </View>
  );
}

/** Reihenfolge bewusst: Stimme zuerst -- darum geht es in diesem Projekt. */
const ABSCHNITT_REIHENFOLGE = [
  "stimme", "merkmale", "lebensraum", "ernaehrung", "fortpflanzung", "verhalten",
];

function Abschnitte({ vogel }: { vogel: Vogel }) {
  const [offen, setOffen] = useState<string | null>("stimme");
  const vorhanden = ABSCHNITT_REIHENFOLGE.filter((k) => vogel.abschnitte?.[k]);
  if (!vorhanden.length) return null;

  return (
    <View style={{ marginTop: 16 }}>
      {vorhanden.map((k) => {
        const a = vogel.abschnitte[k];
        const auf = offen === k;
        return (
          <View key={k} style={stile.abschnitt}>
            <Pressable onPress={() => setOffen(auf ? null : k)}>
              <Text style={stile.abschnittTitel}>
                {auf ? "▾" : "▸"} {a.titel}
              </Text>
            </Pressable>
            {auf && <Text style={stile.abschnittText}>{a.text}</Text>}
          </View>
        );
      })}
    </View>
  );
}

/** Wie oft löst diese Art bei den anderen Arten Alarm aus? */
function ausloeserZaehlen(vogel: Vogel): { anzahl: number; typ: string } {
  let anzahl = 0;
  const typen = new Set<string>();
  for (const v of voegel) {
    const treffer = v.fressfeinde.find((f) => f.deutsch === vogel.name_de);
    if (treffer) { anzahl += 1; typen.add(treffer.alarmtyp); }
  }
  return { anzahl, typ: [...typen].join(" / ") };
}

function Vogelsprache({ vogel, spracheOeffnen }: {
  vogel: Vogel; spracheOeffnen: () => void;
}) {
  const profil = ALARMPROFILE[vogel.id];
  const ausloeser = ausloeserZaehlen(vogel);
  if (!profil && ausloeser.anzahl === 0) return null;

  return (
    <View style={stile.sprache}>
      <View style={stile.spracheKopf}>
        <Text style={stile.spracheTitel}>Vogelsprache</Text>
        <Pressable onPress={spracheOeffnen} hitSlop={8}>
          <Text style={stile.spracheLink}>Was heißt das? ›</Text>
        </Pressable>
      </View>

      {profil && (
        <>
          <View style={stile.spracheZeile}>
            {profil.leitart && (
              <Text style={stile.marke}>Alarm-Leitart</Text>
            )}
            {profil.besonders_in && (
              <Text style={stile.markeSchlicht}>
                v.a. {profil.besonders_in}
              </Text>
            )}
          </View>

          {profil.merksatz && (
            <Text style={stile.merksatz}>{profil.merksatz}</Text>
          )}

          {profil.signale.map((s, i) => (
            <View key={i} style={stile.signal}>
              <View style={stile.spracheZeile}>
                <Text style={stile.signalName}>{s.name}</Text>
                <Text style={stile.markeSchlicht}>
                  {SIGNALBAU_INFO[s.bau].titel}
                </Text>
                <Text style={s.beleg === "literatur"
                  ? stile.markeBeleg : stile.markeSchaetzung}>
                  {s.beleg === "literatur" ? "belegt" : "Einschätzung"}
                </Text>
                <Text style={stile.markeSchlicht}>
                  {s.auffaelligkeit
                    ? `hörbar ${s.auffaelligkeit}/5`
                    : "Hörbarkeit unbekannt"}
                </Text>
              </View>
              <Text style={stile.spracheText}>{s.beschreibung}</Text>
              {s.quelle && <Text style={stile.signalQuelle}>{s.quelle}</Text>}
            </View>
          ))}
        </>
      )}

      {ausloeser.anzahl > 0 && (
        <Text style={stile.ausloeser}>
          Löst bei {ausloeser.anzahl} unserer Arten Alarm aus ({ausloeser.typ}).
          {" "}{AUSLOESER_HINWEIS}
        </Text>
      )}
    </View>
  );
}

function Merkmale({ vogel }: { vogel: Vogel }) {
  const m = vogel.merkmale || {};
  const zeilen: [string, string][] = [];
  if (m.lebensraum) zeilen.push(["Lebensraum", m.lebensraum]);
  if (m.zugverhalten) zeilen.push(["Zugverhalten", m.zugverhalten]);
  if (m.ernaehrungstyp) zeilen.push(["Ernährung", m.ernaehrungstyp]);
  if (m.lebensweise) zeilen.push(["Lebensweise", m.lebensweise]);
  if (m.masse_g) zeilen.push(["Gewicht", `${m.masse_g} g`]);

  const liste = (a?: Anteil[]) =>
    (a || []).map((x) => `${x.was} ${x.prozent} %`).join(" · ");

  if (!zeilen.length && !m.nahrung?.length) return null;

  return (
    <View style={stile.merkmale}>
      {zeilen.map(([k, v]) => (
        <View key={k} style={stile.merkmalZeile}>
          <Text style={stile.merkmalName}>{k}</Text>
          <Text style={stile.merkmalWert}>{v}</Text>
        </View>
      ))}
      {!!m.nahrung?.length && (
        <View style={stile.merkmalZeile}>
          <Text style={stile.merkmalName}>Nahrung</Text>
          <Text style={stile.merkmalWert}>{liste(m.nahrung)}</Text>
        </View>
      )}
      {!!m.nahrungsschicht?.length && (
        <View style={stile.merkmalZeile}>
          <Text style={stile.merkmalName}>sucht in</Text>
          <Text style={stile.merkmalWert}>{liste(m.nahrungsschicht)}</Text>
        </View>
      )}
    </View>
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
  knopfreihe: { flexDirection: "row", gap: 8, marginTop: 12 },
  quizKnopf: {
    backgroundColor: "#0e639c", borderRadius: 8, paddingVertical: 12,
    alignItems: "center", flex: 1,
  },
  offlineKnopf: {
    backgroundColor: farben.karte, borderRadius: 8, paddingVertical: 12,
    paddingHorizontal: 16, alignItems: "center",
  },
  offlineKnopfText: { color: farben.akzent, fontSize: 15.5, fontWeight: "600" },
  quizKnopfText: { color: "#fff", fontSize: 15.5, fontWeight: "600" },
  suchfeld: {
    backgroundColor: farben.karte, color: farben.text, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 9, marginTop: 12, fontSize: 15,
  },
  karte: {
    flexDirection: "row", alignItems: "center", backgroundColor: farben.karte,
    borderRadius: 10, padding: 10, marginBottom: 10,
  },
  gedrueckt: { backgroundColor: farben.karteHell },
  vorschau: { width: 84, height: 84, borderRadius: 8, backgroundColor: "#0d0d0d" },
  name: { color: farben.text, fontSize: 17, fontWeight: "600" },
  lateinisch: { color: farben.gedaempft, fontSize: 13, fontStyle: "italic" },
  feindzahl: { color: farben.akzent, fontSize: 12, marginTop: 4 },
  leer: { color: farben.gedaempft, textAlign: "center", marginTop: 30 },

  zurueck: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 6 },
  zurueckText: { color: farben.akzent, fontSize: 15 },
  grossesBild: { width: "100%", height: 300, backgroundColor: "#0d0d0d" },
  punktreihe: {
    flexDirection: "row", justifyContent: "center", gap: 7, marginTop: 9,
  },
  punkt: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#3a3a3a",
  },
  punktAktiv: { backgroundColor: farben.akzent },
  gruppenreihe: {
    flexDirection: "row", flexWrap: "wrap", gap: 7,
    justifyContent: "center", marginTop: 11,
  },
  gruppenknopf: {
    backgroundColor: farben.karte, borderRadius: 7,
    paddingVertical: 7, paddingHorizontal: 12,
  },
  gruppenknopfAktiv: { backgroundColor: "#0e639c" },
  gruppenknopfText: { color: farben.gedaempft, fontSize: 13, fontWeight: "600" },
  gruppenAnzahl: { fontWeight: "400", opacity: 0.7 },
  bildquelle: {
    color: "#6e6e6e", fontSize: 10.5, textAlign: "center", marginTop: 9,
    paddingHorizontal: 18,
  },
  titelGross: {
    color: farben.text, fontSize: 27, fontWeight: "700", marginTop: 14,
  },
  lateinischGross: {
    color: farben.gedaempft, fontSize: 15, fontStyle: "italic", marginBottom: 12,
  },
  text: { color: farben.text, fontSize: 15, lineHeight: 22 },

  rufBlock: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 13,
    marginTop: 4, marginBottom: 12, borderLeftWidth: 3,
    borderLeftColor: farben.akzent,
  },
  rufKategorie: { color: farben.akzent, fontSize: 14, fontWeight: "600" },
  rufAnzahl: { color: farben.gedaempft, fontWeight: "400", fontSize: 12.5 },
  rufReihe: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 6 },
  rufKnopf: {
    backgroundColor: farben.karteHell, borderRadius: 6,
    paddingVertical: 7, paddingHorizontal: 11,
  },
  rufKnopfAktiv: { backgroundColor: "#0e639c" },
  rufKnopfText: { color: farben.text, fontSize: 13 },
  rufQuelle: {
    color: "#8a8a8a", fontSize: 11, lineHeight: 16, marginTop: 8,
    borderTopWidth: 1, borderTopColor: "#333", paddingTop: 8,
  },

  abschnitt: {
    backgroundColor: farben.karte, borderRadius: 8, padding: 12,
    marginBottom: 8,
  },
  abschnittTitel: { color: farben.akzent, fontSize: 15, fontWeight: "600" },
  abschnittText: {
    color: farben.text, fontSize: 14, lineHeight: 21, marginTop: 8,
  },

  sprache: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 13,
    marginBottom: 12, borderLeftWidth: 3, borderLeftColor: "#b08968",
  },
  spracheKopf: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 8,
  },
  spracheTitel: { color: "#d4a373", fontSize: 15, fontWeight: "700" },
  spracheLink: { color: "#d4a373", fontSize: 12.5 },
  spracheKnopf: {
    backgroundColor: "#4a3a2d", borderRadius: 8,
    paddingVertical: 9, paddingHorizontal: 14,
  },
  spracheKnopfText: { color: "#d4a373", fontSize: 14, fontWeight: "600" },
  spracheZeile: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 7 },
  marke: {
    backgroundColor: "#8a5a2b", color: "#fff", fontSize: 11.5,
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5,
    fontWeight: "700", overflow: "hidden",
  },
  markeSchlicht: {
    backgroundColor: farben.karteHell, color: farben.gedaempft, fontSize: 11.5,
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, overflow: "hidden",
  },
  spracheText: { color: farben.text, fontSize: 13.5, lineHeight: 19 },
  merksatz: {
    color: "#d4a373", fontSize: 13, lineHeight: 19, fontStyle: "italic",
    marginBottom: 10,
  },
  signal: {
    marginBottom: 10, paddingLeft: 9,
    borderLeftWidth: 2, borderLeftColor: "#3a3a3a",
  },
  signalName: {
    color: farben.text, fontSize: 13, fontWeight: "700",
    paddingVertical: 3, paddingRight: 2,
  },
  signalQuelle: {
    color: "#6e6e6e", fontSize: 10.5, lineHeight: 15, marginTop: 4,
  },
  markeBeleg: {
    backgroundColor: "#2d4a3e", color: "#9fd6bc", fontSize: 11.5,
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, overflow: "hidden",
  },
  markeSchaetzung: {
    backgroundColor: "#4a3a2d", color: "#d6b89f", fontSize: 11.5,
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, overflow: "hidden",
  },
  ausloeser: {
    color: farben.gedaempft, fontSize: 12.5, lineHeight: 18, marginTop: 8,
    borderTopWidth: 1, borderTopColor: "#333", paddingTop: 8,
  },

  merkmale: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 13,
    marginTop: 4, marginBottom: 16,
  },
  merkmalZeile: { flexDirection: "row", paddingVertical: 4 },
  merkmalName: { color: farben.gedaempft, fontSize: 13.5, width: 108 },
  merkmalWert: { color: farben.text, fontSize: 13.5, flex: 1 },

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
