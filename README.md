# 💒 Hochzeit Cathrin & Christoph - Wedding Website

Eine elegante, responsive Hochzeitswebsite für Cathrin & Christoph, erstellt mit modernen Webtechnologien.

## 🌟 Features

- **Passwortschutz** - Nur eingeladene Gäste können die Website betreten
- **Spotify Playlist Integration** - Eingebetteter Musikplayer für die Hochzeitsfeier
- **Responsive Design** - Optimiert für alle Geräte (Mobile-First)
- **Elegante Animationen** - Sanfte Übergänge und Hover-Effekte
- **Deutsche Sprache** - Alle Texte und Benutzeroberflächen auf Deutsch
- **Statische Website** - Perfekt für GitHub Pages ohne Backend-Abhängigkeiten

## 📁 Projektstruktur

```
CundCWedding/
├── index.html              # Haupt-HTML-Datei
├── config.example.js       # Konfigurationsvorlage
├── config.js               # Ihre private Konfiguration (nicht in Git)
├── .gitignore              # Git-Ausschlüsse
├── README.md               # Diese Datei
├── public/                 # Statische Assets
│   └── favicon.ico        # Website-Icon
└── src/                    # JavaScript-Code
    └── main.js            # Haupt-JavaScript-Datei
```

## 🚀 Schnellstart

### 1. Repository klonen

```bash
git clone https://github.com/ihr-username/CundCWedding.git
cd CundCWedding
```

### 2. Konfiguration einrichten

```bash
# Konfigurationsvorlage kopieren
cp config.example.js config.js

# Konfigurationsdatei bearbeiten
nano config.js  # oder mit Ihrem bevorzugten Editor
```

### 3. Private Informationen eintragen

Öffnen Sie `config.js` und füllen Sie alle Felder aus:

```javascript
window.weddingConfig = {
  // Passwort für den Website-Zugang
  password: "ihr-echtes-passwort-hier",
  
  // Spotify Playlist ID (aus der Playlist-URL extrahieren)
  spotifyPlaylistId: "ihre-echte-playlist-id",
  
  // Google Formular URL für RSVP
  rsvpFormUrl: "https://forms.google.com/ihre-echte-form-url",
  
  // Weitere Konfiguration...
};
```

### 4. Lokal testen

Öffnen Sie `index.html` in Ihrem Browser oder starten Sie einen lokalen Server:

```bash
# Mit Python 3
python3 -m http.server 8000

# Mit Node.js (falls installiert)
npx serve .

# Mit PHP (falls installiert)
php -S localhost:8000
```

Besuchen Sie dann `http://localhost:8000` in Ihrem Browser.

## ⚙️ Konfiguration

### Passwort

Das Passwort schützt den Zugang zur Website. Wählen Sie ein sicheres, aber für Ihre Gäste leicht zu merkendes Passwort.

### Spotify Playlist

1. Erstellen Sie eine Playlist in Spotify
2. Kopieren Sie die Playlist-URL
3. Extrahieren Sie die Playlist-ID (der Teil nach `/playlist/` und vor `?`)

**Beispiel:**
- URL: `https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00`
- ID: `37i9dQZF1DX5Vy6DFOcx00`

### Google Formular für RSVP

1. Erstellen Sie ein Google Formular mit den gewünschten Feldern
2. Teilen Sie das Formular (öffentlich zugänglich)
3. Kopieren Sie die Teilen-URL

**Empfohlene Formularfelder:**
- Name
- E-Mail
- Anzahl der Begleitpersonen (+1)
- Ernährungsgewohnheiten (vegetarisch, vegan, Allergien)
- Nachrichten für das Brautpaar

### Kontakte

Fügen Sie alle wichtigen Kontakte hinzu:
- Braut und Bräutigam
- Trauzeugen
- Hochzeitsplaner
- Weitere wichtige Ansprechpartner

## 🎨 Anpassungen

### Farben

Die Website verwendet ein elegantes Farbschema mit:
- **Hauptfarben**: Cremeweiß, Blush-Pink, Gold
- **Akzente**: Sanfte Pastelltöne
- **Schriften**: Dunkelgrau für bessere Lesbarkeit

### Schriftarten

- **Überschriften**: Playfair Display (elegant, serif)
- **Fließtext**: Crimson Text (lesbar, serif)

### Bilder

Ersetzen Sie Platzhalterbilder durch Ihre eigenen:
- Favicon (16x16, 32x32, 48x48 Pixel)
- Hintergrundbilder für Sektionen
- Hochzeitsfotos (optional)

## 🌐 GitHub Pages Deployment

### 1. Repository auf GitHub hochladen

```bash
git add .
git commit -m "Initial commit: Wedding website"
git push origin main
```

### 2. GitHub Pages aktivieren

1. Gehen Sie zu Ihrem Repository auf GitHub
2. Klicken Sie auf **Settings**
3. Scrollen Sie zu **Pages**
4. Wählen Sie **Source: Deploy from a branch**
5. Wählen Sie **Branch: main** und **Folder: / (root)**
6. Klicken Sie **Save**

### 3. Website ist live

Ihre Website ist nach wenigen Minuten unter `https://ihr-username.github.io/CundCWedding` verfügbar.

## 🔒 Sicherheit

- **Passwortschutz**: Client-seitig implementiert (für einfache Websites ausreichend)
- **Keine Backend-Daten**: Alle Informationen werden lokal im Browser gespeichert
- **Konfigurationsdatei**: `config.js` ist in `.gitignore` ausgeschlossen

**Wichtiger Hinweis**: Der Passwortschutz ist client-seitig implementiert und bietet grundlegenden Schutz. Für höhere Sicherheitsanforderungen sollten Sie einen Backend-Service verwenden.

## 📱 Responsive Design

Die Website ist für alle Geräte optimiert:

- **Mobile**: 320px+ (Smartphones)
- **Tablet**: 768px+ (iPads, Tablets)
- **Desktop**: 1024px+ (Computer, Laptops)
- **Große Bildschirme**: 1440px+ (4K, große Monitore)

## 🎯 Browser-Unterstützung

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Browser (iOS Safari, Chrome Mobile)

## 🛠️ Technische Details

- **HTML5**: Semantische Struktur
- **CSS3**: Moderne Styles mit Tailwind CSS
- **JavaScript ES6+**: Vanilla JS ohne Frameworks
- **Responsive Images**: Optimiert für verschiedene Bildschirmgrößen
- **Progressive Enhancement**: Funktioniert auch ohne JavaScript

## 📞 Support

Bei Fragen oder Problemen:

1. Überprüfen Sie die Browser-Konsole auf Fehlermeldungen
2. Stellen Sie sicher, dass `config.js` korrekt eingerichtet ist
3. Testen Sie die Website in verschiedenen Browsern
4. Überprüfen Sie die GitHub Pages-Einstellungen

## 📝 Lizenz

Dieses Projekt ist für den privaten Gebrauch von Cathrin & Christoph erstellt. Alle Rechte vorbehalten.

## 🙏 Danksagung

Vielen Dank an alle, die diese Website möglich gemacht haben. Wir freuen uns darauf, mit Ihnen unseren besonderen Tag zu feiern!

---

**Viel Glück für Ihre Hochzeit! 🥂💕** 