/**
 * Service Worker -- macht die App im Feld offline nutzbar.
 *
 * Genau darum geht es: Vogelstimmen hoert man draussen, und dort ist der
 * Empfang schlecht. Beim ersten Aufruf wird das Geruest gecacht, Bilder und
 * Rufe wandern beim ersten Abspielen dazu.
 *
 * Zwei Strategien:
 *   Geruest (HTML, JS)  network-first  -- damit Aktualisierungen ankommen
 *   Medien (Bilder/Ton) cache-first    -- die aendern sich nie und sind gross
 */

const VERSION = "v1";
const GERUEST = `vogelstimmen-geruest-${VERSION}`;
const MEDIEN = `vogelstimmen-medien-${VERSION}`;

// Beim Installieren nur das Noetigste vorladen. Die 33 MB Medien werden
// NICHT vorab geholt -- das wuerde die erste Nutzung minutenlang blockieren.
const VORLADEN = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(GERUEST)
      .then((c) => c.addAll(VORLADEN))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),   // ein fehlender Eintrag darf nicht blockieren
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(
        namen.filter((n) => n.startsWith("vogelstimmen-")
                         && !n.endsWith(VERSION))
             .map((n) => caches.delete(n)),
      ))
      .then(() => self.clients.claim()),
  );
});

const istMedium = (url) =>
  /\.(jpg|jpeg|png|mp3|wav|m4a|ogg|woff2?|ttf)$/i.test(url);

self.addEventListener("fetch", (e) => {
  const anfrage = e.request;
  if (anfrage.method !== "GET") return;

  const url = new URL(anfrage.url);
  if (url.origin !== self.location.origin) return;

  if (istMedium(url.pathname)) {
    // cache-first: Bilder und Rufe aendern sich nicht
    e.respondWith(
      caches.match(anfrage).then((treffer) => treffer || fetch(anfrage)
        .then((antwort) => {
          if (antwort.ok) {
            const kopie = antwort.clone();
            caches.open(MEDIEN).then((c) => c.put(anfrage, kopie));
          }
          return antwort;
        })),
    );
    return;
  }

  // network-first fuers Geruest, damit neue Fassungen ankommen
  e.respondWith(
    fetch(anfrage)
      .then((antwort) => {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(GERUEST).then((c) => c.put(anfrage, kopie));
        }
        return antwort;
      })
      .catch(() => caches.match(anfrage)
        .then((treffer) => treffer || caches.match("./index.html"))),
  );
});
