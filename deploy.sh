#!/bin/bash

# ==========================================================
# Cathrin & Christoph's Wedding Website Setup Script
# ==========================================================

echo "💒 Willkommen zur Einrichtung eurer Hochzeitswebsite!"
echo "======================================================"
echo ""

# --- Helper: exit if missing file ---
require_file() {
    if [ ! -f "$1" ]; then
        echo "❌ Fehler: '$1' nicht gefunden."
        exit 1
    fi
}

# --- Step 1: Check project structure ---
require_file "index.html"

# --- Step 2: Ensure config.js exists ---
if [ ! -f "config.js" ]; then
    echo "📋 config.js nicht gefunden — erstelle aus Vorlage..."
    require_file "config.example.js"
    cp config.example.js config.js
    echo "✅ config.js erstellt."
    echo ""
    echo "📝 Bitte bearbeite 'config.js' jetzt mit:"
    echo "   - Passwort für Website-Zugang"
    echo "   - Spotify Playlist ID"
    echo "   - Google Formular URL (RSVP)"
    echo "   - Kontaktdaten"
    echo ""
    read -p "Drücke Enter, wenn du fertig bist..."
else
    echo "✅ config.js gefunden."
fi

# --- Step 3: Test config.js for password ---
if ! grep -q "password" config.js; then
    echo "⚠️  Hinweis: In config.js wurde kein 'password' Eintrag gefunden."
    echo "   Ohne Passwortschutz funktioniert die Login-Seite nicht!"
fi

# --- Step 4: Offer local testing ---
echo ""
echo "🧪 Website lokal testen:"
echo "1) Lokaler Server starten (empfohlen)"
echo "2) Direkt im Browser öffnen"
echo "3) Abbrechen"
echo ""
read -p "Wähle eine Option (1-3): " choice

case $choice in
    1)
        if command -v python3 &> /dev/null; then
            echo "🚀 Starte Python HTTP Server auf http://localhost:8000"
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo "🚀 Starte Python HTTP Server auf http://localhost:8000"
            python -m http.server 8000
        elif command -v node &> /dev/null; then
            echo "🚀 Starte Node.js Server auf http://localhost:3000"
            npx serve . -p 3000
        else
            echo "❌ Weder Python noch Node.js gefunden."
            echo "💡 Installiere Python3 oder Node.js, oder wähle Option 2."
        fi
        ;;
    2)
        if command -v open &> /dev/null; then
            open index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open index.html
        else
            echo "💡 Öffne index.html manuell im Browser."
        fi
        ;;
    3)
        echo "❌ Abgebrochen."
        ;;
    *)
        echo "Ungültige Auswahl."
        ;;
esac

echo ""
echo "🎉 Setup abgeschlossen!"
echo "======================="
echo "💡 Zum Veröffentlichen auf GitHub Pages:"
echo "   - Dateien committen & pushen"
echo "   - GitHub Pages in den Repo-Einstellungen aktivieren"
