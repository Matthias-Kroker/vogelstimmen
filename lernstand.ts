/**
 * Lernfortschritt je Vogelart -- lokal gespeichert, ohne Konto.
 *
 * Verfahren: abgestufte Wiederholung (spaced repetition), vereinfacht.
 * Jede Art hat eine Stufe von 0 bis 5. Richtig beantwortet steigt sie,
 * falsch faellt sie deutlich zurueck. Die Stufe bestimmt, wie lange die
 * Art pausiert, bevor sie wieder drankommt.
 *
 * Warum nicht einfach zufaellig fragen: dann kaeme die laengst sitzende
 * Amsel genauso oft wie die staendig verwechselte Sumpfmeise. Der Sinn
 * liegt gerade darin, die Luecken haeufiger zu treffen.
 *
 * Zusaetzlich wird gemerkt, WOMIT verwechselt wurde. Diese Paare kommen
 * bevorzugt wieder gegeneinander -- eine Verwechslung loest man am besten
 * am konkreten Gegenstueck auf, nicht an einem beliebigen dritten Vogel.
 */

const SCHLUESSEL = "vogelstimmen.lernstand.v1";

/** Pause je Stufe in Stunden. Stufe 0 heisst: sofort wieder. */
const PAUSE_STUNDEN = [0, 0.15, 1, 8, 48, 168];
export const MAX_STUFE = PAUSE_STUNDEN.length - 1;

export type ArtStand = {
  stufe: number;
  richtig: number;
  falsch: number;
  /** Zeitpunkt der letzten Antwort (ms seit 1970). */
  zuletzt: number;
  /** Wie oft mit welcher Art verwechselt: Art-ID -> Anzahl. */
  verwechseltMit: Record<string, number>;
};

export type Lernstand = Record<string, ArtStand>;

function leer(): ArtStand {
  return { stufe: 0, richtig: 0, falsch: 0, zuletzt: 0, verwechseltMit: {} };
}

export function laden(): Lernstand {
  try {
    const roh = globalThis.localStorage?.getItem(SCHLUESSEL);
    if (!roh) return {};
    const daten = JSON.parse(roh);
    return typeof daten === "object" && daten ? daten : {};
  } catch {
    // Kaputter oder nicht verfuegbarer Speicher darf das Quiz nicht
    // blockieren -- dann eben ohne Fortschritt weiterspielen.
    return {};
  }
}

export function speichern(stand: Lernstand): void {
  try {
    globalThis.localStorage?.setItem(SCHLUESSEL, JSON.stringify(stand));
  } catch {
    /* kein Speicher verfuegbar -- nicht schlimm */
  }
}

export function zuruecksetzen(): void {
  try {
    globalThis.localStorage?.removeItem(SCHLUESSEL);
  } catch {
    /* egal */
  }
}

/** Antwort verbuchen und den neuen Stand zurueckgeben. */
export function antwortVerbuchen(
  stand: Lernstand,
  artId: string,
  richtig: boolean,
  geratenId?: string,
  jetzt: number = Date.now(),
): Lernstand {
  const alt = stand[artId] ?? leer();
  const neu: ArtStand = {
    ...alt,
    verwechseltMit: { ...alt.verwechseltMit },
    zuletzt: jetzt,
  };

  if (richtig) {
    neu.richtig += 1;
    neu.stufe = Math.min(alt.stufe + 1, MAX_STUFE);
  } else {
    neu.falsch += 1;
    // Nicht auf 0 zuruecksetzen: wer schon viel richtig hatte, soll nicht
    // wegen eines Fehlers ganz von vorn anfangen. Zwei Stufen zurueck.
    neu.stufe = Math.max(alt.stufe - 2, 0);
    if (geratenId && geratenId !== artId) {
      neu.verwechseltMit[geratenId] =
        (alt.verwechseltMit[geratenId] ?? 0) + 1;
    }
  }

  return { ...stand, [artId]: neu };
}

/**
 * Wie dringend ist diese Art? Hoeher = eher abfragen.
 *
 * Noch nie gefragte Arten haben Vorrang, danach faellige, danach der Rest.
 */
export function dringlichkeit(
  stand: Lernstand,
  artId: string,
  jetzt: number = Date.now(),
): number {
  const a = stand[artId];
  if (!a || a.zuletzt === 0) return 1000;      // noch nie dran

  const pause = PAUSE_STUNDEN[Math.min(a.stufe, MAX_STUFE)] * 3600_000;
  const seither = jetzt - a.zuletzt;
  const ueberfaellig = seither - pause;

  // Faellige zuerst, je laenger ueberfaellig desto dringender.
  // Noch nicht faellige bekommen einen negativen Wert.
  const basis = ueberfaellig / 3600_000;

  // Fehlerquote draufschlagen: was oft schiefging, bleibt wichtig
  const versuche = a.richtig + a.falsch;
  const fehlerquote = versuche > 0 ? a.falsch / versuche : 0;
  return basis + fehlerquote * 24;
}

/** Arten nach Dringlichkeit sortiert. */
export function naechsteArten(
  stand: Lernstand,
  artIds: string[],
  jetzt: number = Date.now(),
): string[] {
  return [...artIds].sort(
    (a, b) => dringlichkeit(stand, b, jetzt) - dringlichkeit(stand, a, jetzt),
  );
}

/** Mit wem wurde diese Art am haeufigsten verwechselt? */
export function haeufigsteVerwechslungen(
  stand: Lernstand,
  artId: string,
): string[] {
  const v = stand[artId]?.verwechseltMit ?? {};
  return Object.entries(v)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}

export type Uebersicht = {
  gesehen: number;
  sitzt: number;          // Stufe >= 4
  wackelt: number;        // schon dran, aber Stufe < 2
  richtig: number;
  falsch: number;
};

export function uebersicht(stand: Lernstand): Uebersicht {
  const werte = Object.values(stand);
  return {
    gesehen: werte.length,
    sitzt: werte.filter((a) => a.stufe >= 4).length,
    wackelt: werte.filter((a) => a.zuletzt > 0 && a.stufe < 2).length,
    richtig: werte.reduce((s, a) => s + a.richtig, 0),
    falsch: werte.reduce((s, a) => s + a.falsch, 0),
  };
}
