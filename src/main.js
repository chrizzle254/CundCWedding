// === Wedding Website Main Script ===
// Cathrin & Christoph | 06.06.2026

console.log('main.js script start');

// Game state
const game = {
    isActive: false,
    startTime: null,
    waitTimeout: null,
    reactionTime: null,
    isWaiting: false
};

let config = null; // declare once
let configLoaded = false;
let isAuthenticated = false;

/**
 * Password check
 * Called from button click or Enter key in input
 */
function checkPassword() {
    console.log("🔑 checkPassword() called");
    const input = document.getElementById("passwordInput");
    if (!input) {
        console.error("❌ Password input field not found in DOM");
        return;
    }
    const enteredPassword = input.value.trim();
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        // Local: check password directly
        if (config && enteredPassword === config.password) {
            console.log("✅ Password correct, showing main content (local mode)");
            isAuthenticated = true;
            configLoaded = true;
            localStorage.setItem("weddingAuthToken", btoa(enteredPassword));
            showMainContent();
        } else {
            console.warn("❌ Incorrect password");
            const errorMsg = document.getElementById("passwordError");
            if (errorMsg) errorMsg.classList.remove("hidden");
            input.value = "";
        }
    } else {
        // Production: use Netlify Function
        fetch('/.netlify/functions/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: enteredPassword })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("✅ Password correct test, showing main content");
                console.log("Config received:", data.config);
                isAuthenticated = true;
                console.log("1");
                config = data.config;
                console.log("2");
                configLoaded = true;
                console.log("3");
                const token = btoa(enteredPassword);
                console.log("4");
                localStorage.setItem("weddingAuthToken", token);
                console.log("5");
                console.log("Auth token set:", token);
                showMainContent();
            } else {
                console.warn("❌ Incorrect password");
                const errorMsg = document.getElementById("passwordError");
                if (errorMsg) errorMsg.classList.remove("hidden");
                input.value = "";
            }
        })
        .catch(err => {
            console.error("❌ Error during authentication", err);
            alert("Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.");
        });
    }
}

/**
 * Attach event listeners to input and button
 */
function setupEventListeners() {
    const passwordInput = document.getElementById("passwordInput");
    const loginButton = document.getElementById("loginButton");

    if (passwordInput) {
        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") checkPassword();
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", checkPassword);
    }
}

/**
 * Restore authentication status from localStorage
 */
function checkAuthenticationStatus() {
    console.log("🔒 Starting authentication check...");
    const authToken = localStorage.getItem("weddingAuthToken");
    console.log("🔑 Auth token status:", {
        exists: !!authToken,
        length: authToken ? authToken.length : 0
    });
    
    if (authToken) {
        try {
            const decodedPassword = atob(authToken);
            console.log("🔓 Token decoded, length:", decodedPassword.length);
            
            // Try to auto-login with stored token
            console.log("🔄 Attempting auto-login with stored token...");
            fetch('/.netlify/functions/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: decodedPassword })
            })
            .then(res => {
                console.log("🌐 Auth response received:", {
                    status: res.status,
                    ok: res.ok,
                    statusText: res.statusText
                });
                return res.json();
            })
            .then(data => {
                console.log("📦 Auth response data:", {
                    success: data.success,
                    hasConfig: !!data.config,
                    configKeys: data.config ? Object.keys(data.config) : []
                });
                if (data.success) {
                    console.log("✅ Auto-login successful");
                    isAuthenticated = true;
                    config = data.config;
                    configLoaded = true;
                    showMainContent();
                } else {
                    console.warn("❌ Auto-login failed: incorrect password");
                    localStorage.removeItem("weddingAuthToken"); // Clear invalid token
                    showPasswordScreen();
                }
            })
            .catch(err => {
                console.error("Auto-login fetch error:", err);
                showPasswordScreen();
            });
        } catch (err) {
            console.error("Token decode error:", err);
            showPasswordScreen();
        }
    } else {
        showPasswordScreen();
    }
}

function showPasswordScreen() {
    const ps = document.getElementById("passwordScreen");
    const mc = document.getElementById("mainContent");
    if (ps) ps.style.display = "flex";
    if (mc) mc.style.display = "none";
}

/**
 * Generate a simple auth token (not secure, just casual protection)
 */
// No longer needed, token is just btoa(password)

/**
 * Show main content and hide password screen with animation
 */
function showMainContent() {
    console.log("🔄 Showing main content...");
    const passwordScreen = document.getElementById("passwordScreen");
    const mainContent = document.getElementById("mainContent");

    if (!passwordScreen || !mainContent) {
        console.error("❌ Required elements not found:", {
            passwordScreen: !!passwordScreen,
            mainContent: !!mainContent
        });
        return;
    }

    passwordScreen.style.opacity = "0";
    passwordScreen.style.transform = "scale(0.95)";
    
    setTimeout(() => {
        console.log("🔄 Animating content transition...");
        passwordScreen.style.display = "none";
        mainContent.classList.remove("hidden");
        mainContent.style.display = "block";

        console.log("🔄 Initializing website components...");
        try {
            initializeWebsite();
            console.log("✅ Website components initialized");
        } catch (error) {
            console.error("❌ Error initializing website:", error);
        }
        
        console.log("🎮 Initializing game...");
        try {
            initializeGame();
            console.log("✅ Game initialized successfully");
        } catch (error) {
            console.error("❌ Error initializing game:", error);
        }
        
        console.log("✨ Adding animations...");
        setTimeout(addFadeInAnimations, 100);
        
        console.log("✅ Main content fully initialized");
    }, 300);
}

/**
 * Initialize all website sections from config
 */
function initializeWebsite() {
    updateSpotifyPlaylist();
    populateAgenda();
    populateFAQ();
    populateContacts();
    updateRSVPButton();
    updateWeddingDetails();
}

/**
 * Update Spotify playlist iframe src from config
 */
function updateSpotifyPlaylist() {
    if (config.spotifyPlaylistId) {
        const spotifyPlayer = document.getElementById("spotifyPlayer");
        if (spotifyPlayer) {
            spotifyPlayer.src = `https://open.spotify.com/embed/playlist/${config.spotifyPlaylistId}?utm_source=generator`;
        }
    }
}

/**
 * Populate agenda items from config.agenda
 */
function populateAgenda() {
    const agendaContainer = document.getElementById("agendaItems");
    if (!agendaContainer || !config.agenda) return;

    agendaContainer.innerHTML = "";
    config.agenda.forEach((item) => {
        const div = document.createElement("div");
        div.className = "timeline-item bg-white rounded-2xl p-8 shadow-lg border-l-4 border-gold-400 ml-8";
        div.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="flex-1">
                    <div class="text-3xl font-bold text-gold-600 mb-2">${item.time}</div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-3">${item.title}</h3>
                    <p class="text-gray-600 text-lg leading-relaxed">${item.description}</p>
                </div>
            </div>
        `;
        agendaContainer.appendChild(div);
    });
}

/**
 * Populate FAQ items from config.faq
 */
function populateFAQ() {
    const faqContainer = document.getElementById("faqItems");
    if (!faqContainer || !config.faq) return;

    faqContainer.innerHTML = "";
    config.faq.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "faq-item bg-white rounded-2xl p-6 shadow-lg cursor-pointer";
        div.innerHTML = `
            <div class="flex items-center justify-between" onclick="toggleFAQ(${index})">
                <h3 class="text-xl font-semibold text-gray-800 pr-4">${item.question}</h3>
                <span class="text-2xl text-gold-500 transform transition-transform duration-300" id="faqArrow${index}">▼</span>
            </div>
            <div class="mt-4 text-gray-600 leading-relaxed hidden" id="faqAnswer${index}">
                ${item.answer}
            </div>
        `;
        faqContainer.appendChild(div);
    });
}

/**
 * Toggle FAQ answer visibility
 */
function toggleFAQ(index) {
    const answer = document.getElementById(`faqAnswer${index}`);
    const arrow = document.getElementById(`faqArrow${index}`);
    if (answer && arrow) {
        answer.classList.toggle("hidden");
        arrow.style.transform = answer.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
    }
}

/**
 * Populate contact cards from config.contacts
 */
function populateContacts() {
    const contactsContainer = document.getElementById("contactItems");
    if (!contactsContainer || !config.contacts) return;

    contactsContainer.innerHTML = "";
    config.contacts.forEach((c) => {
        const card = document.createElement("div");
        card.className = "contact-card bg-white rounded-2xl p-6 shadow-lg text-center";
        card.innerHTML = `
            <div class="mb-4">
                <div class="w-16 h-16 bg-gradient-to-br from-pink-200 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-2xl">👤</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">${c.role}</h3>
                <p class="text-xl font-bold text-gray-900">${c.name}</p>
            </div>
            <div class="space-y-2">
                <a href="tel:${c.phone}" class="block text-gold-600 hover:text-gold-700 font-medium transition-colors">
                    📞 ${c.phone}
                </a>
                <a href="mailto:${c.email}" class="block text-gold-600 hover:text-gold-700 font-medium transition-colors">
                    ✉️ ${c.email}
                </a>
            </div>
        `;
        contactsContainer.appendChild(card);
    });
}

/**
 * Update RSVP button link from config
 */
function updateRSVPButton() {
    const rsvpButton = document.getElementById("rsvpButton");
    if (rsvpButton && config.rsvpFormUrl) {
        rsvpButton.href = config.rsvpFormUrl;
    }
}

/**
 * Update wedding details such as page title
 */
function updateWeddingDetails() {
    if (config.wedding && config.wedding.coupleNames) {
        document.title = `Hochzeit ${config.wedding.coupleNames}`;
    }
}

/**
 * Add fade-in animation to sections on scroll
 */
function addFadeInAnimations() {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    sections.forEach((section) => {
        section.classList.add("section-fade-in");
        observer.observe(section);
    });
}

/**
 * Show configuration error screen
 */
function showConfigError() {
    const ps = document.getElementById("passwordScreen");
    if (ps) {
        ps.innerHTML = `
            <div class="text-center max-w-md w-full">
                <h1 class="text-4xl md:text-6xl font-bold text-red-600 mb-4">⚠️</h1>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Konfigurationsfehler</h2>
                <p class="text-gray-600 text-lg">Die Konfigurationsdatei wurde nicht gefunden.</p>
            </div>
        `;
    }
}


// Wait for DOM ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 DOMContentLoaded — Initializing...");
    setupEventListeners();
    // Use local config.js if running on localhost
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        if (window.weddingConfig) {
            config = window.weddingConfig;
            configLoaded = true;
            console.log("🔧 Config loaded from local config.js:", config);
            checkAuthenticationStatus();
        } else {
            console.error("❌ Local config.js not available.");
            showConfigError();
        }
    } else {
        fetch('/.netlify/functions/config')
            .then(res => res.json())
            .then(cfg => {
                config = cfg;
                configLoaded = true;
                console.log("🔧 Config loaded from Netlify Function:", config);
                checkAuthenticationStatus();  // handles showing password or main content
            })
            .catch(err => {
                console.error("❌ Config not available from Netlify Function.", err);
                showConfigError();
            });
    }
});

/**
 * Game Functions
 */

function setLightState(state) {
    const light = document.getElementById('light');
    if (!light) return;
    
    switch(state) {
        case 'waiting':
            light.style.backgroundColor = '#ef4444';
            light.textContent = 'Warten...';
            break;
        case 'ready':
            light.style.backgroundColor = '#22c55e';
            light.textContent = 'JETZT!';
            break;
        case 'idle':
            light.style.backgroundColor = '#d1d5db';
            light.textContent = '';
            break;
        case 'early':
            light.style.backgroundColor = '#eab308';
            light.textContent = 'Zu früh!';
            break;
    }
}

function startGame() {
    const startButton = document.getElementById('startGame');
    const instructions = document.getElementById('instructions');
    if (!startButton || !instructions) return;

    game.isActive = true;
    game.isWaiting = true;
    startButton.disabled = true;
    setLightState('waiting');
    instructions.textContent = 'Warte auf grün...';
    
    const waitTime = Math.random() * 9000 + 1000;
    game.waitTimeout = setTimeout(() => {
        if (game.isActive) {
            game.startTime = Date.now();
            game.isWaiting = false;
            setLightState('ready');
            instructions.textContent = 'KLICK!';
        }
    }, waitTime);
}

function handleGameClick() {
    const startButton = document.getElementById('startGame');
    const instructions = document.getElementById('instructions');
    if (!startButton || !instructions) return;
    
    if (!game.isActive) return;
    
    if (game.isWaiting) {
        clearTimeout(game.waitTimeout);
        game.isActive = false;
        setLightState('early');
        instructions.textContent = 'Zu früh geklickt! Versuche es noch mal.';
        startButton.disabled = false;
        return;
    }

    game.reactionTime = Date.now() - game.startTime;
    game.isActive = false;
    endGame();
}

function endGame() {
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreDisplay = document.getElementById('finalScore');
    const startButton = document.getElementById('startGame');
    const instructions = document.getElementById('instructions');
    
    if (!gameOverModal || !finalScoreDisplay || !startButton || !instructions) return;

    finalScoreDisplay.textContent = game.reactionTime;
    gameOverModal.classList.remove('hidden');
    setLightState('idle');
    instructions.textContent = 'Klicke auf das Licht sobald es grün wird!';
    startButton.disabled = false;
}

async function saveScore() {
    const playerNameInput = document.getElementById('playerName');
    const gameOverModal = document.getElementById('gameOverModal');
    if (!playerNameInput || !gameOverModal) return;

    const name = playerNameInput.value.trim() || 'Anonym';
    
    try {
        console.log('Saving score:', { name, score: game.reactionTime });
        const response = await fetch('/.netlify/functions/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                score: game.reactionTime
            })
        });
        
        console.log('Save score response:', response);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        
        const updatedLeaderboard = await response.json();
        console.log('Updated leaderboard:', updatedLeaderboard);
        updateLeaderboardDisplay(updatedLeaderboard);
        gameOverModal.classList.add('hidden');
        playerNameInput.value = '';
    } catch (error) {
        console.error('Error saving score:', error);
        alert('Fehler beim Speichern des Scores. Bitte versuche es später noch einmal.');
    }
}

async function fetchLeaderboard() {
    try {
        console.log('Fetching leaderboard...');
        const response = await fetch('/.netlify/functions/leaderboard');
        console.log('Leaderboard response:', response);
        const leaderboard = await response.json();
        console.log('Leaderboard data:', leaderboard);
        updateLeaderboardDisplay(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

function updateLeaderboardDisplay(leaderboard = []) {
    const leaderboardDiv = document.getElementById('leaderboard');
    if (!leaderboardDiv) return;

    leaderboardDiv.innerHTML = leaderboard
        .map((entry, index) => `
            <div class="flex items-center justify-between py-2 px-4 ${index === 0 ? 'bg-[rgba(200,169,107,0.2)]' : 'bg-[rgba(27,56,50,0.05)]'} rounded-lg">
                <span class="font-medium">${entry.name}</span>
                <span>${entry.score}ms</span>
            </div>
        `)
        .join('');
}

function initializeGame() {
    console.log("🎮 Starting game initialization...");
    const light = document.getElementById('light');
    const startButton = document.getElementById('startGame');
    const saveScoreButton = document.getElementById('saveScore');
    
    console.log("🔍 Game elements found:", {
        light: !!light,
        startButton: !!startButton,
        saveScoreButton: !!saveScoreButton
    });

    if (light && startButton && saveScoreButton) {
        // Load initial leaderboard
        fetchLeaderboard();

        // Remove any existing event listeners (just in case)
        light.removeEventListener('click', handleGameClick);
        startButton.removeEventListener('click', startGame);
        saveScoreButton.removeEventListener('click', saveScore);

        // Add event listeners
        light.addEventListener('click', handleGameClick);
        startButton.addEventListener('click', startGame);
        saveScoreButton.addEventListener('click', saveScore);
    }
}

// Export globals for HTML inline calls
window.checkPassword = checkPassword;
window.toggleFAQ = toggleFAQ;
