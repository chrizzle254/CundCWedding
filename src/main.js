// === Wedding Website Main Script ===
// Cathrin & Christoph | 06.06.2026

console.log('main.js script start');



let config = null; // declare once
//window.config = window.config || null;
let isAuthenticated = false;

async function serverLogin(password) {
  try {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Unauthorized');
    const cfg = await res.json();
    config = cfg;
    showMainContent();
  } catch (err) {
    console.error('Login failed', err);
    document.getElementById('passwordError').classList.remove('hidden');
  }
}

async function tryRestoreSession() {
  try {
    const res = await fetch('https://cundcwedding.netlify.app/netlify/functions/get-config', {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) return;
    const cfg = await res.json();
    config = cfg;
    showMainContent();
  } catch (err) {
    console.error('Session restore failed', err);
  }
}

function showMainContent() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
  document.getElementById('configOutput').textContent = JSON.stringify(config, null, 2);
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('loginButton').addEventListener('click', () => {
    const pw = document.getElementById('passwordInput').value;
    serverLogin(pw);
  });
  document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('loginButton').click();
  });
  await tryRestoreSession();
});


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

    if (!window.weddingConfig || !window.weddingConfig.password) {
        console.error("❌ Config (config.js) not loaded or password missing");
        alert("Error: Configuration not loaded.");
        return;
    }

    if (enteredPassword === window.weddingConfig.password) {
        console.log("✅ Password correct, showing main content");
        isAuthenticated = true;
        config = window.weddingConfig;

        // Save auth token for session persistence
        localStorage.setItem("weddingAuthToken", generateAuthToken());

        showMainContent();
    } else {
        console.warn("❌ Incorrect password");
        // Show error message on screen instead of alert for better UX
        const errorMsg = document.getElementById("passwordError");
        if (errorMsg) {
            errorMsg.classList.remove("hidden");
        }
        // Optional: clear input
        input.value = "";
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
    if (!window.weddingConfig) {
        showConfigError();
        return;
    }

    config = window.weddingConfig;

    const authToken = localStorage.getItem("weddingAuthToken");
    if (authToken && authToken === generateAuthToken()) {
        console.log("User already authenticated.");
        isAuthenticated = true;
        showMainContent();
    } else {
        console.log("User not authenticated.");
        // Show password screen
        const ps = document.getElementById("passwordScreen");
        const mc = document.getElementById("mainContent");
        if (ps) ps.style.display = "flex";
        if (mc) mc.style.display = "none";
    }
}

/**
 * Generate a simple auth token (not secure, just casual protection)
 */
function generateAuthToken() {
    // Token changes daily to require fresh login each day
    return btoa(config.password + "_" + new Date().toDateString());
}

/**
 * Show main content and hide password screen with animation
 */
function showMainContent() {
    const passwordScreen = document.getElementById("passwordScreen");
    const mainContent = document.getElementById("mainContent");

    if (passwordScreen) {
        passwordScreen.style.opacity = "0";
        passwordScreen.style.transform = "scale(0.95)";
        setTimeout(() => {
            passwordScreen.style.display = "none";
            if (mainContent) mainContent.classList.remove("hidden");
            mainContent.style.display = "block";

            initializeWebsite();
            setTimeout(addFadeInAnimations, 100);
        }, 300);
    }
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

    if (window.weddingConfig) {
        config = window.weddingConfig;
        console.log("🔧 weddingConfig loaded:", window.weddingConfig);
        checkAuthenticationStatus();
    } else {
        console.error("❌ weddingConfig not available. Please check config.js.");
        showConfigError();
    }
});

// Export globals for HTML inline calls
window.checkPassword = checkPassword;
window.toggleFAQ = toggleFAQ;
