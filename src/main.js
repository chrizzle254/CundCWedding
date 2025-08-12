let authToken = null;

async function checkPassword() {
  console.log("checkPassword() called");
  const password = document.getElementById('password-input').value;

  try {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (!res.ok) {
      document.getElementById('login-error').classList.remove('hidden');
      return;
    }

    const data = await res.json();
    authToken = data.token;
    console.log("✅ Password correct, token received");
    await loadConfig();
  } catch (err) {
    console.error("❌ Login failed", err);
  }
}

async function loadConfig() {
  try {
    const res = await fetch('/.netlify/functions/get-config', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error("Failed to fetch config");
    const config = await res.json();
    console.log("Config loaded", config);

    // Hide login, show main content
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');

    // Set Spotify
    if (config.spotifyPlaylistId) {
      document.getElementById('spotify-player').src = 
        `https://open.spotify.com/embed/playlist/${config.spotifyPlaylistId}?utm_source=generator`;
    }

    // Agenda
    const agendaList = document.getElementById('agenda-list');
    config.agenda.forEach(item => {
      const div = document.createElement('div');
      div.className = "mb-2";
      div.innerHTML = `<strong>${item.time}</strong> - ${item.title}<br>${item.description}`;
      agendaList.appendChild(div);
    });

    // FAQ
    const faqList = document.getElementById('faq-list');
    config.faq.forEach(q => {
      const div = document.createElement('div');
      div.className = "mb-2";
      div.innerHTML = `<strong>${q.question}</strong><br>${q.answer}`;
      faqList.appendChild(div);
    });

    // Contacts
    const contactsList = document.getElementById('contacts-list');
    config.contacts.forEach(c => {
      const div = document.createElement('div');
      div.className = "mb-2";
      div.innerHTML = `<strong>${c.role}:</strong> ${c.name} – ${c.phone} – <a href="mailto:${c.email}" class="text-blue-500">${c.email}</a>`;
      contactsList.appendChild(div);
    });

    // RSVP
    if (config.rsvpFormUrl) {
      document.getElementById('rsvp-link').href = config.rsvpFormUrl;
    }
  } catch (err) {
    console.error("❌ Failed to load config", err);
  }
}
