#!/bin/bash

# Setup script for Cathrin & Christoph's wedding website
# This script helps you get started quickly

echo "💒 Willkommen zur Einrichtung der Hochzeitswebsite!"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Fehler: Bitte führen Sie dieses Skript im Projektverzeichnis aus"
    exit 1
fi

echo "📋 Schritt 1: Konfigurationsdatei erstellen"
echo "-------------------------------------------"

if [ -f "config.js" ]; then
    echo "✅ config.js existiert bereits"
    read -p "Möchten Sie sie überschreiben? (j/n): " overwrite
    if [[ $overwrite =~ ^[Jj]$ ]]; then
        echo "🔄 Überschreibe config.js..."
    else
        echo "⏭️  Überspringe Erstellung der Konfigurationsdatei"
        goto_test
    fi
fi

if [ ! -f "config.js" ] || [[ $overwrite =~ ^[Jj]$ ]]; then
    if [ -f "config.example.js" ]; then
        cp config.example.js config.js
        echo "✅ config.js aus config.example.js erstellt"
        echo ""
        echo "📝 Bitte bearbeiten Sie jetzt config.js mit Ihren echten Daten:"
        echo "   - Passwort für den Website-Zugang"
        echo "   - Spotify Playlist ID"
        echo "   - Google Formular URL für RSVP"
        echo "   - Kontaktdaten und weitere Informationen"
        echo ""
        read -p "Drücken Sie Enter, wenn Sie fertig sind..."
    else
        echo "❌ config.example.js nicht gefunden"
        exit 1
    fi
fi

echo ""
echo "🧪 Schritt 2: Website testen"
echo "----------------------------"

goto_test() {
    echo ""
    echo "🌐 Möchten Sie die Website jetzt testen?"
    echo "1) Lokaler Server starten (empfohlen)"
    echo "2) Direkt im Browser öffnen"
    echo "3) Später testen"
    echo ""
    read -p "Wählen Sie eine Option (1-3): " choice
    
    case $choice in
        1)
            echo ""
            echo "🚀 Starte lokalen Server..."
            if command -v python3 &> /dev/null; then
                echo "✅ Python 3 gefunden - starte Server..."
                echo "🌐 Öffnen Sie http://localhost:8000 in Ihrem Browser"
                echo "⏹️  Drücken Sie Ctrl+C zum Beenden"
                python3 -m http.server 8000
            elif command -v python &> /dev/null; then
                echo "✅ Python gefunden - starte Server..."
                echo "🌐 Öffnen Sie http://localhost:8000 in Ihrem Browser"
                echo "⏹️  Drücken Sie Ctrl+C zum Beenden"
                python -m http.server 8000
            elif command -v node &> /dev/null; then
                echo "✅ Node.js gefunden - starte Server..."
                echo "🌐 Öffnen Sie http://localhost:3000 in Ihrem Browser"
                echo "⏹️  Drücken Sie Ctrl+C zum Beenden"
                npx serve . -p 3000
            else
                echo "❌ Weder Python noch Node.js gefunden"
                echo "💡 Installieren Sie Python 3 oder Node.js, oder wählen Sie Option 2"
                goto_test
            fi
            ;;
        2)
            echo ""
            echo "🌐 Öffne Website im Standard-Browser..."
            if command -v open &> /dev/null; then
                open index.html
            elif command -v xdg-open &> /dev/null; then
                xdg-open index.html
            else
                echo "💡 Bitte öffnen Sie index.html manuell in Ihrem Browser"
            fi
            echo "✅ Website geöffnet"
            ;;
        3)
            echo ""
            echo "⏭️  Sie können die Website später testen, indem Sie:"
            echo "   - index.html direkt im Browser öffnen"
            echo "   - Einen lokalen Server starten (siehe README.md)"
            echo "   - Das setup.sh Skript erneut ausführen"
            ;;
        *)
            echo "❌ Ungültige Auswahl"
            goto_test
            ;;
    esac
}

goto_test

echo ""
echo "🎉 Einrichtung abgeschlossen!"
echo "============================="
echo ""
echo "📚 Nächste Schritte:"
echo "   1. Testen Sie die Website mit dem Passwort aus config.js"
echo "   2. Passen Sie alle Texte und Informationen an"
echo "   3. Fügen Sie Ihre echten Kontaktdaten hinzu"
echo "   4. Erstellen Sie Ihre Spotify Playlist"
echo "   5. Erstellen Sie Ihr Google Formular für RSVP"
echo ""
echo "🚀 Für die Bereitstellung auf GitHub Pages:"
echo "   - Führen Sie ./deploy.sh aus"
echo "   - Oder folgen Sie den Anweisungen in README.md"
echo ""
echo "💕 Viel Glück für Ihre Hochzeit! 💕" 