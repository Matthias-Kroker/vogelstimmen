"""Ergaenzt den Expo-Export um die PWA-Teile.

`npx expo export --platform web` liefert eine reine Web-Seite ohne
Manifest und ohne Service Worker. Beides wird hier nachgetragen, damit
sich die App aufs Handy installieren laesst und offline funktioniert --
genau dort, wo man Voegel hoert, ist der Empfang schlecht.

Ausserdem werden absolute Pfade (/_expo/...) in relative umgeschrieben.
Sonst laeuft die App nur im Wurzelverzeichnis einer Domain, nicht in
einem Unterordner wie bei GitHub Pages.

Aufruf:
  npx expo export --platform web --output-dir dist
  C:/Python314/python.exe data/pwa_bauen.py
"""
import re
import shutil
import sys
from pathlib import Path

BASIS = Path(__file__).resolve().parent.parent
DIST = BASIS / "dist"
WEB = BASIS / "web"
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

KOPF_ZUSATZ = """    <meta name="theme-color" content="#161616" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Vogelstimmen" />
    <link rel="manifest" href="./manifest.json" />
    <link rel="apple-touch-icon" href="./icon-192.png" />
"""

REGISTRIERUNG = """    <script>
      // Service Worker braucht einen sicheren Kontext: HTTPS oder localhost.
      // Ueber http://192.168.x.x wird er vom Browser abgelehnt -- dann laeuft
      // die App zwar, aber ohne Offline-Faehigkeit.
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("./sw.js").catch(function (e) {
            console.warn("Service Worker nicht registriert:", e.message);
          });
        });
      }
    </script>
"""


def symbole_bauen():
    """Zwei schlichte Symbole erzeugen, falls keine vorhanden sind."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        print("  Pillow fehlt -- keine Symbole erzeugt")
        return
    for groesse in (192, 512):
        ziel = DIST / f"icon-{groesse}.png"
        bild = Image.new("RGB", (groesse, groesse), "#161616")
        zeichnen = ImageDraw.Draw(bild)
        # schlichte Schallwelle in der Akzentfarbe
        mitte = groesse // 2
        for i, radius in enumerate((0.18, 0.30, 0.42)):
            r = int(groesse * radius)
            breite = max(2, groesse // 40)
            zeichnen.arc([mitte - r, mitte - r, mitte + r, mitte + r],
                         start=-55, end=55, fill="#7fd1c1", width=breite)
        p = int(groesse * 0.13)
        zeichnen.ellipse([mitte - p - int(groesse * 0.22), mitte - p,
                          mitte + p - int(groesse * 0.22), mitte + p],
                         fill="#7fd1c1")
        bild.save(ziel, "PNG")
    print("  Symbole erzeugt (192, 512)")


def main():
    if not DIST.exists():
        print("Kein dist/ -- erst 'npx expo export --platform web' laufen lassen.")
        sys.exit(1)

    for datei in ("manifest.json", "sw.js"):
        quelle = WEB / datei
        if quelle.exists():
            shutil.copy2(quelle, DIST / datei)
    print(f"  manifest.json und sw.js nach dist/ kopiert")

    symbole_bauen()

    index = DIST / "index.html"
    html = index.read_text(encoding="utf-8")

    # Absolute Pfade relativ machen -- sonst nur im Wurzelverzeichnis lauffaehig
    vorher = html
    html = html.replace('href="/favicon.ico"', 'href="./favicon.ico"')
    html = re.sub(r'src="/_expo/', 'src="./_expo/', html)
    html = re.sub(r'href="/_expo/', 'href="./_expo/', html)
    if html != vorher:
        print("  absolute Pfade auf relative umgestellt")

    html = html.replace("<title>app</title>", "<title>Vogelstimmen</title>")
    html = html.replace('<html lang="en">', '<html lang="de">')

    if "manifest.json" not in html:
        html = html.replace("</head>", KOPF_ZUSATZ + "  </head>")
    if "serviceWorker" not in html:
        html = html.replace("</body>", REGISTRIERUNG + "  </body>")

    index.write_text(html, encoding="utf-8")
    print("  index.html ergänzt (Manifest, Service Worker, Titel)")

    groesse = sum(f.stat().st_size for f in DIST.rglob("*") if f.is_file())
    print(f"\ndist/ fertig: {groesse/1048576:.1f} MB")


if __name__ == "__main__":
    main()
