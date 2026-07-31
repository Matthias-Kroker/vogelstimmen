import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image, Pressable, ScrollView, StyleSheet, Text, View,
} from "react-native";
import { useAudioPlayer } from "expo-audio";

import { voegel, type Vogel } from "./daten/voegel";
import { vogelBilderAlle } from "./assets/voegel";
import { rufeZuVogel, type Ruf } from "./assets/rufe";
import {
  antwortVerbuchen, haeufigsteVerwechslungen, laden, naechsteArten,
  speichern, uebersicht, zuruecksetzen, MAX_STUFE,
  type Lernstand,
} from "./lernstand";

const farben = {
  hintergrund: "#161616",
  karte: "#212121",
  karteHell: "#2a2a2a",
  text: "#e8e8e8",
  gedaempft: "#9a9a9a",
  akzent: "#7fd1c1",
  richtig: "#2d6a4f",
  falsch: "#7f3838",
};

export type Stufe = 1 | 2 | 3;

export const STUFEN: { stufe: Stufe; titel: string; beschreibung: string }[] = [
  {
    stufe: 1, titel: "Leicht",
    beschreibung: "Auswahl aus deutlich verschiedenen Arten — Amsel gegen "
      + "Mäusebussard. Zum Einstieg.",
  },
  {
    stufe: 2, titel: "Mittel",
    beschreibung: "Gemischte Auswahl, teils ähnliche Arten.",
  },
  {
    stufe: 3, titel: "Schwer",
    beschreibung: "Nur ähnliche Arten — Meise gegen Meise, Rabenvogel gegen "
      + "Rabenvogel. Hier wird es ernst.",
  },
];

/** Nur Arten, für die es überhaupt Rufe gibt. */
const spielbar = voegel.filter((v) => (rufeZuVogel[v.id] || []).length > 0);

/** Wie ähnlich sind zwei Arten? Höher = leichter zu verwechseln.
 *  Gleiche Gattung wiegt am schwersten, dann Familie über den Lebensraum. */
function aehnlichkeit(a: Vogel, b: Vogel): number {
  if (a.id === b.id) return -1;
  let punkte = 0;
  const gattungA = a.name_wissenschaftlich.split(" ")[0];
  const gattungB = b.name_wissenschaftlich.split(" ")[0];
  if (gattungA === gattungB) punkte += 6;
  if (a.merkmale?.lebensraum && a.merkmale.lebensraum === b.merkmale?.lebensraum)
    punkte += 2;
  if (a.merkmale?.ernaehrungstyp === b.merkmale?.ernaehrungstyp) punkte += 1;
  // ähnliche Größe verwechselt man leichter
  const ma = a.merkmale?.masse_g ?? 0;
  const mb = b.merkmale?.masse_g ?? 0;
  if (ma && mb && Math.max(ma, mb) / Math.min(ma, mb) < 1.6) punkte += 2;
  return punkte;
}

function zufall<T>(liste: T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}

type Frage = {
  ruf: Ruf;
  richtig: Vogel;
  auswahl: Vogel[];
};

function frageBauen(stufe: Stufe, stand: Lernstand): Frage | null {
  if (spielbar.length < 4) return null;

  // Nicht zufaellig waehlen, sondern nach Dringlichkeit: was noch nie dran
  // war oder oft danebenging, kommt zuerst. Aus den obersten fuenf wird
  // gelost, damit es nicht stumpf immer dieselbe Reihenfolge ist.
  const reihenfolge = naechsteArten(stand, spielbar.map((v) => v.id));
  const vorne = reihenfolge.slice(0, 5);
  const gewaehlteId = zufall(vorne);
  const richtig = spielbar.find((v) => v.id === gewaehlteId) ?? zufall(spielbar);
  const rufe = rufeZuVogel[richtig.id] || [];
  if (!rufe.length) return null;

  const andere = spielbar.filter((v) => v.id !== richtig.id);
  const sortiert = [...andere].sort(
    (x, y) => aehnlichkeit(richtig, y) - aehnlichkeit(richtig, x),
  );

  // Wer schon einmal mit dieser Art verwechselt wurde, kommt bevorzugt
  // wieder dagegen -- eine Verwechslung loest man am Gegenstueck auf.
  const verwechselt = haeufigsteVerwechslungen(stand, richtig.id)
    .map((id) => andere.find((v) => v.id === id))
    .filter((v): v is Vogel => !!v);

  let falsche: Vogel[];
  if (stufe === 3) {
    // die drei ähnlichsten, Verwechslungspartner zuerst
    falsche = [...verwechselt, ...sortiert].slice(0, 3);
    falsche = [...new Map(falsche.map((v) => [v.id, v])).values()].slice(0, 3);
  } else if (stufe === 1) {
    // die drei unähnlichsten
    falsche = sortiert.slice(-3);
  } else {
    // einer ähnlich, zwei beliebig
    const rest = sortiert.slice(3);
    falsche = [sortiert[0], zufall(rest), zufall(rest)];
    // Doppelte vermeiden
    falsche = [...new Map(falsche.map((v) => [v.id, v])).values()];
    while (falsche.length < 3) {
      const kandidat = zufall(andere);
      if (!falsche.some((f) => f.id === kandidat.id)) falsche.push(kandidat);
    }
  }

  const auswahl = [...falsche.slice(0, 3), richtig]
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);

  return { ruf: zufall(rufe), richtig, auswahl };
}

export default function Quiz({ zurueck }: { zurueck: () => void }) {
  const [stufe, setStufe] = useState<Stufe | null>(null);
  const [frage, setFrage] = useState<Frage | null>(null);
  const [geraten, setGeraten] = useState<Vogel | null>(null);
  const [punkte, setPunkte] = useState({ richtig: 0, gesamt: 0 });
  const [stand, setStand] = useState<Lernstand>(() => laden());

  // EINEN Spieler anlegen und die Quelle wechseln, statt bei jeder Frage
  // einen neuen bauen zu lassen. Uebergibt man dem Hook wechselnde Quellen,
  // verwirft er den alten Spieler mitten im Laden -- daher der AbortError
  // "fetching process ... aborted by the user agent" im Protokoll.
  const spieler = useAudioPlayer();

  const neueFrage = useCallback((s: Stufe, aktuell: Lernstand) => {
    setGeraten(null);
    setFrage(frageBauen(s, aktuell));
  }, []);

  useEffect(() => {
    if (stufe) neueFrage(stufe, stand);
    // stand absichtlich NICHT in den Abhaengigkeiten: sonst waechselt die
    // Frage mitten in der Antwort, sobald der Fortschritt gespeichert wird.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stufe, neueFrage]);

  // Beim Erscheinen einer neuen Frage gleich abspielen -- man will hören,
  // nicht erst einen Knopf suchen.
  useEffect(() => {
    if (!frage) return;
    try {
      spieler.replace(frage.ruf.quelle);
      spieler.play();
    } catch {
      // Ein fehlgeschlagener Ton darf das Quiz nicht anhalten -- der Knopf
      // "Ruf nochmal hören" bleibt ja da.
    }
  }, [frage]);

  if (!stufe) {
    return (
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <Pressable onPress={zurueck} style={{ marginBottom: 14 }}>
          <Text style={stile.zurueck}>‹ Zurück</Text>
        </Pressable>
        <Text style={stile.titel}>Quiz — Schwierigkeit</Text>
        <Text style={stile.hinweis}>
          Ein Ruf wird abgespielt, du wählst den Vogel. Die Schwierigkeit
          bestimmt, wie ähnlich die falschen Antworten sind.
        </Text>
        {STUFEN.map((s) => (
          <Pressable
            key={s.stufe}
            onPress={() => setStufe(s.stufe)}
            style={({ pressed }) => [stile.stufe, pressed && stile.gedrueckt]}
          >
            <Text style={stile.stufeTitel}>{s.titel}</Text>
            <Text style={stile.stufeText}>{s.beschreibung}</Text>
          </Pressable>
        ))}
        <Fortschritt stand={stand} zuruecksetzenFn={() => {
          zuruecksetzen();
          setStand({});
        }} />

        <Text style={stile.fussnote}>
          {spielbar.length} von {voegel.length} Arten haben Rufe und sind
          spielbar.
        </Text>
      </ScrollView>
    );
  }

  if (!frage) {
    return (
      <View style={{ padding: 18 }}>
        <Text style={stile.hinweis}>Keine Frage möglich — zu wenige Rufe.</Text>
      </View>
    );
  }

  const antworten = (v: Vogel) => {
    if (geraten) return;
    const stimmt = v.id === frage.richtig.id;
    setGeraten(v);
    setPunkte((p) => ({
      richtig: p.richtig + (stimmt ? 1 : 0),
      gesamt: p.gesamt + 1,
    }));
    const neu = antwortVerbuchen(stand, frage.richtig.id, stimmt,
                                 stimmt ? undefined : v.id);
    setStand(neu);
    speichern(neu);
  };

  const eigenerStand = stand[frage.richtig.id];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={stile.kopfzeile}>
        {/* Zwei Wege hinaus: zurueck zur Stufenwahl oder ganz raus.
            Vorher ging es nur ueber zwei Schritte. */}
        <View style={stile.kopfLinks}>
          <Pressable onPress={zurueck} hitSlop={8}>
            <Text style={stile.zurueck}>‹ Vögel</Text>
          </Pressable>
          <Pressable onPress={() => setStufe(null)} hitSlop={8}>
            <Text style={stile.zurueckZweit}>Stufe wechseln</Text>
          </Pressable>
        </View>
        <Text style={stile.punkte}>
          {punkte.richtig} / {punkte.gesamt}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          try { spieler.seekTo(0); spieler.play(); } catch { /* egal */ }
        }}
        style={({ pressed }) => [stile.abspielen, pressed && stile.gedrueckt]}
      >
        <Text style={stile.abspielenText}>▶ Ruf nochmal hören</Text>
      </Pressable>

      <Text style={stile.frage}>Welcher Vogel ist das?</Text>

      <View style={stile.gitter}>
        {frage.auswahl.map((v) => {
          const istRichtig = v.id === frage.richtig.id;
          const gewaehlt = geraten?.id === v.id;
          return (
            <Pressable
              key={v.id}
              onPress={() => antworten(v)}
              style={({ pressed }) => [
                stile.kachel,
                geraten && istRichtig && stile.kachelRichtig,
                geraten && gewaehlt && !istRichtig && stile.kachelFalsch,
                pressed && !geraten && stile.gedrueckt,
              ]}
            >
              <Image
                source={vogelBilderAlle[v.id]?.[0]?.quelle}
                style={stile.kachelBild}
                resizeMode="contain"
              />
              {/* Namen erst nach der Antwort zeigen -- sonst ist es ein
                  Lesetest, kein Hörtest. */}
              <Text style={stile.kachelName}>
                {geraten ? v.name_de : "?"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {geraten && (
        <View style={stile.aufloesung}>
          <Text
            style={[
              stile.aufloesungTitel,
              { color: geraten.id === frage.richtig.id
                  ? farben.akzent : "#e08a8a" },
            ]}
          >
            {geraten.id === frage.richtig.id ? "Richtig" : "Leider nicht"} —
            {" "}{frage.richtig.name_de}
          </Text>
          <Text style={stile.aufloesungText}>
            {frage.ruf.xcTyp} · {frage.ruf.land}
            {"\n"}Aufnahme: {frage.ruf.aufnehmer} · XC{frage.ruf.xcId}
            {"\n"}{frage.ruf.lizenz}
          </Text>
          {frage.richtig.abschnitte?.stimme && (
            <Text style={stile.stimmeText} numberOfLines={6}>
              {frage.richtig.abschnitte.stimme.text}
            </Text>
          )}
          {/* Was die abgestufte Wiederholung gerade macht, sichtbar
              halten -- sonst wirkt die Auswahl willkuerlich. */}
          {eigenerStand && (
            <Text style={stile.stufenzeile}>
              {frage.richtig.name_de}: Stufe {eigenerStand.stufe} von {MAX_STUFE}
              {" · "}{eigenerStand.richtig} richtig, {eigenerStand.falsch} falsch
            </Text>
          )}
          <Pressable
            onPress={() => neueFrage(stufe, stand)}
            style={({ pressed }) => [stile.weiter, pressed && stile.gedrueckt]}
          >
            <Text style={stile.weiterText}>Nächster Ruf ›</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function Fortschritt({
  stand, zuruecksetzenFn,
}: { stand: Lernstand; zuruecksetzenFn: () => void }) {
  const u = uebersicht(stand);
  if (!u.gesehen) return null;
  const quote = u.richtig + u.falsch > 0
    ? Math.round((u.richtig / (u.richtig + u.falsch)) * 100) : 0;

  const schwach = Object.entries(stand)
    .filter(([, a]) => a.falsch > 0)
    .sort((a, b) => b[1].falsch - a[1].falsch)
    .slice(0, 5)
    .map(([id, a]) => {
      const v = voegel.find((x) => x.id === id);
      return v ? `${v.name_de} (${a.falsch}×)` : null;
    })
    .filter(Boolean);

  return (
    <View style={stile.fortschritt}>
      <Text style={stile.fortschrittTitel}>Dein Stand</Text>
      <Text style={stile.fortschrittZeile}>
        {u.gesehen} Arten geübt · {u.sitzt} sitzen · {u.wackelt} wackeln
      </Text>
      <Text style={stile.fortschrittZeile}>
        {u.richtig} richtig, {u.falsch} falsch ({quote} %)
      </Text>
      {schwach.length > 0 && (
        <Text style={stile.fortschrittSchwach}>
          Häufigste Fehler: {schwach.join(" · ")}
        </Text>
      )}
      <Pressable onPress={zuruecksetzenFn} hitSlop={6}>
        <Text style={stile.zuruecksetzen}>Fortschritt zurücksetzen</Text>
      </Pressable>
    </View>
  );
}

const stile = StyleSheet.create({
  kopfzeile: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  zurueck: { color: farben.akzent, fontSize: 15 },
  kopfLinks: { flexDirection: "row", alignItems: "center", gap: 14 },
  zurueckZweit: { color: farben.gedaempft, fontSize: 13.5 },
  punkte: { color: farben.gedaempft, fontSize: 15, fontVariant: ["tabular-nums"] },
  titel: { color: farben.text, fontSize: 22, fontWeight: "700", marginBottom: 6 },
  hinweis: { color: farben.gedaempft, fontSize: 14, marginBottom: 16, lineHeight: 20 },
  stufe: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 15, marginBottom: 10,
  },
  stufeTitel: { color: farben.akzent, fontSize: 17, fontWeight: "600" },
  stufeText: { color: farben.gedaempft, fontSize: 13.5, marginTop: 4, lineHeight: 19 },
  fussnote: { color: "#6e6e6e", fontSize: 12, marginTop: 14 },
  fortschritt: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 14,
    marginTop: 14, borderLeftWidth: 3, borderLeftColor: farben.akzent,
  },
  fortschrittTitel: {
    color: farben.akzent, fontSize: 15, fontWeight: "700", marginBottom: 6,
  },
  fortschrittZeile: { color: farben.text, fontSize: 13.5, lineHeight: 20 },
  fortschrittSchwach: {
    color: "#e0a458", fontSize: 12.5, marginTop: 6, lineHeight: 18,
  },
  zuruecksetzen: {
    color: "#6e6e6e", fontSize: 11.5, marginTop: 10,
    textDecorationLine: "underline",
  },
  stufenzeile: {
    color: farben.gedaempft, fontSize: 12, marginTop: 10,
    fontVariant: ["tabular-nums"],
  },
  gedrueckt: { opacity: 0.75 },

  abspielen: {
    backgroundColor: "#0e639c", borderRadius: 10, paddingVertical: 15,
    alignItems: "center",
  },
  abspielenText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  frage: {
    color: farben.text, fontSize: 17, fontWeight: "600",
    marginTop: 18, marginBottom: 10, textAlign: "center",
  },
  gitter: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kachel: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 8,
    flexGrow: 1, flexBasis: "45%", borderWidth: 2, borderColor: "transparent",
  },
  kachelRichtig: { borderColor: farben.richtig, backgroundColor: "#1c3129" },
  kachelFalsch: { borderColor: farben.falsch, backgroundColor: "#2f1f1f" },
  kachelBild: {
    width: "100%", height: 120, borderRadius: 6, backgroundColor: "#0d0d0d",
  },
  kachelName: {
    color: farben.text, fontSize: 14.5, textAlign: "center", marginTop: 7,
    fontWeight: "600",
  },

  aufloesung: {
    backgroundColor: farben.karte, borderRadius: 10, padding: 15, marginTop: 16,
  },
  aufloesungTitel: { fontSize: 17, fontWeight: "700" },
  aufloesungText: {
    color: "#8a8a8a", fontSize: 11.5, lineHeight: 16, marginTop: 8,
  },
  stimmeText: {
    color: farben.text, fontSize: 13, lineHeight: 19, marginTop: 10,
    borderTopWidth: 1, borderTopColor: "#333", paddingTop: 10,
  },
  weiter: {
    backgroundColor: farben.karteHell, borderRadius: 8, paddingVertical: 13,
    alignItems: "center", marginTop: 14,
  },
  weiterText: { color: farben.text, fontSize: 15.5, fontWeight: "600" },
});
