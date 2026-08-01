/**
 * Offline-Paket: laedt die Medien ausgewaehlter Arten vorab in den Cache.
 *
 * Warum ueberhaupt noetig: Bilder und Rufe liegen als einzelne Dateien auf
 * dem Server und werden erst geholt, wenn man sie anschaut. Draussen im
 * Feld -- wo man Voegel hoert -- gibt es aber oft keinen Empfang. Wer
 * vorher ein Paket laedt, hat seine Arten offline dabei.
 *
 * WARUM EIN BUDGET: iOS Safari erlaubt einer PWA nur rund 50 MB Cache und
 * raeumt ihn ausserdem nach etwa einer Woche Nichtnutzung weg. Android
 * Chrome ist grosszuegiger (bis 60 % des freien Speichers). Wir bauen
 * bewusst NUR EINE Fassung und richten uns nach der strengeren Grenze --
 * zwei getrennte Wege waeren doppelte Pflege ohne Gegenwert.
 *
 * Deshalb nimmt das Paket je Art nur das Noetigste mit: ein bis zwei
 * Bilder und die ersten Rufe. Alles Weitere laedt online nach und bleibt
 * danach ebenfalls im Cache.
 */

import { Asset } from "expo-asset";

import { bildgruppen, vogelBilderAlle } from "./assets/voegel";
import { rufeZuVogel } from "./assets/rufe";
import { voegel } from "./daten/voegel";

/** Muss zum Namen im Service Worker passen. */
const CACHE_NAME = "vogelstimmen-medien-v1";

/** Zielgroesse. Unter der iOS-Grenze von ~50 MB, mit Luft fuer das Gerüst. */
export const BUDGET_MB = 40;

export type Umfang = "knapp" | "normal" | "alles";

export const UMFANG_BESCHREIBUNG: Record<Umfang, string> = {
  knapp: "1 Bild und 3 Rufe je Art — für viele Arten bei wenig Platz",
  normal: "3 Bilder und 5 Rufe je Art — guter Mittelweg",
  alles: "alle Bilder und Rufe — nur für wenige Arten sinnvoll",
};

const GRENZEN: Record<Umfang, { bilder: number; rufe: number }> = {
  knapp: { bilder: 1, rufe: 3 },
  normal: { bilder: 3, rufe: 5 },
  alles: { bilder: 99, rufe: 99 },
};

/**
 * Adressen der Medien einer Art.
 *
 * require() liefert eine Modulnummer, keine Adresse -- Asset.fromModule
 * loest sie auf. Ohne diesen Schritt wuesste man nicht, was vorzuladen ist.
 */
export function adressenEinerArt(artId: string, umfang: Umfang): string[] {
  const grenze = GRENZEN[umfang];
  const gruppen = bildgruppen[artId] ?? {};

  // Reihenfolge nach Nutzen: erst der Vogel selbst, dann Nest und Jungvögel
  const bilder = [
    ...(gruppen.vogel ?? []),
    ...(gruppen.nest ?? []),
    ...(gruppen.jung ?? []),
  ].slice(0, grenze.bilder);

  const rufe = (rufeZuVogel[artId] ?? []).slice(0, grenze.rufe);

  const adressen: string[] = [];
  for (const b of bilder) {
    const uri = Asset.fromModule(b.quelle)?.uri;
    if (uri) adressen.push(uri);
  }
  for (const r of rufe) {
    const uri = Asset.fromModule(r.quelle)?.uri;
    if (uri) adressen.push(uri);
  }
  return adressen;
}

export type Fortschritt = {
  fertig: number;
  gesamt: number;
  bytes: number;
  laeuft: boolean;
  fehler: number;
};

/**
 * Laedt die Medien der angegebenen Arten in den Cache des Service Workers.
 *
 * Bewusst nacheinander mit kleiner Parallelitaet: dutzende gleichzeitige
 * Anfragen bringen auf einer Mobilverbindung nichts und lassen die
 * Oberflaeche haengen.
 */
export async function paketLaden(
  artIds: string[],
  umfang: Umfang,
  melden: (f: Fortschritt) => void,
  abbruch?: AbortSignal,
): Promise<Fortschritt> {
  const adressen = artIds.flatMap((id) => adressenEinerArt(id, umfang));
  const stand: Fortschritt = {
    fertig: 0, gesamt: adressen.length, bytes: 0, laeuft: true, fehler: 0,
  };
  melden({ ...stand });

  if (!globalThis.caches) {
    // Ohne Cache-API (etwa in einem unsicheren Kontext) geht kein Offline.
    return { ...stand, laeuft: false, fehler: adressen.length };
  }

  const cache = await caches.open(CACHE_NAME);
  const GLEICHZEITIG = 4;

  for (let i = 0; i < adressen.length; i += GLEICHZEITIG) {
    if (abbruch?.aborted) break;
    const teil = adressen.slice(i, i + GLEICHZEITIG);
    await Promise.all(teil.map(async (adresse) => {
      try {
        // Schon vorhandene nicht erneut holen
        const da = await cache.match(adresse);
        if (da) {
          stand.bytes += Number(da.headers.get("content-length") ?? 0);
          return;
        }
        const antwort = await fetch(adresse);
        if (!antwort.ok) throw new Error(String(antwort.status));
        stand.bytes += Number(antwort.headers.get("content-length") ?? 0);
        await cache.put(adresse, antwort.clone());
      } catch {
        stand.fehler += 1;
      } finally {
        stand.fertig += 1;
      }
    }));
    melden({ ...stand });
  }

  const ergebnis = { ...stand, laeuft: false };
  melden(ergebnis);
  return ergebnis;
}

/** Wie viel belegt die App gerade, und wie viel darf sie? */
export async function speicherStand(): Promise<{
  belegt: number; erlaubt: number; verfuegbar: boolean;
}> {
  try {
    const s = await navigator.storage?.estimate?.();
    if (!s) return { belegt: 0, erlaubt: 0, verfuegbar: false };
    return {
      belegt: s.usage ?? 0,
      erlaubt: s.quota ?? 0,
      verfuegbar: true,
    };
  } catch {
    return { belegt: 0, erlaubt: 0, verfuegbar: false };
  }
}

/** Geschaetzte Groesse eines Pakets, ohne es zu laden. */
export function paketGroesseSchaetzen(anzahlArten: number, umfang: Umfang): number {
  // Aus den tatsaechlichen Dateien gemessen: im Schnitt 1,57 MB je Art bei
  // vollem Umfang, entsprechend weniger bei kleinerer Auswahl.
  const anteil = { knapp: 0.33, normal: 0.62, alles: 1 }[umfang];
  return anzahlArten * 1.57 * anteil;
}

/** Wie viele Arten passen ins Budget? */
export function passtInsBudget(umfang: Umfang): number {
  return Math.floor(BUDGET_MB / (1.57 * { knapp: 0.33, normal: 0.62, alles: 1 }[umfang]));
}

/** Alle Arten, die überhaupt Medien haben. */
export const artenMitMedien = voegel
  .filter((v) => (vogelBilderAlle[v.id]?.length ?? 0) > 0)
  .map((v) => v.id);

export async function paketLoeschen(): Promise<void> {
  try {
    await globalThis.caches?.delete(CACHE_NAME);
  } catch {
    /* egal */
  }
}
