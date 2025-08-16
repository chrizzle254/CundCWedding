// Configuration file for Cathrin & Christoph's wedding website
// Copy this file to config.js and fill in your private information
// DO NOT commit config.js to Git!

window.weddingConfig = {
  // Password for website access
  password: "your-wedding-password-here",
  
  // Spotify playlist ID (extract from playlist URL)
  spotifyPlaylistId: "your-spotify-playlist-id-here",

  // Supabase configuration (for local development)
  supabaseUrl: "your-supabase-project-url",
  supabaseAnonKey: "your-supabase-anon-key",
  
  // Google Form URL for RSVP
  rsvpFormUrl: "https://forms.google.com/your-form-url-here",
  
  // Wedding details
  wedding: {
    date: "06.06.2026",
    location: "Schloss Bredeneek, Nähe Kiel",
    coupleNames: "Cathrin & Christoph"
  },
  
  // Agenda/timeline
  agenda: [
    {
      time: "14:00",
      title: "Ankunft & Begrüßung",
      description: "Empfang der Gäste mit Sekt und Canapés"
    },
    {
      time: "15:00",
      title: "Trauung",
      description: "Hochzeitszeremonie im Schlossgarten"
    },
    {
      time: "16:00",
      title: "Sektempfang",
      description: "Champagner und Fotoshooting"
    },
    {
      time: "18:00",
      title: "Abendessen",
      description: "Gemeinsames Abendessen im Schloss"
    },
    {
      time: "20:00",
      title: "Tanz & Feier",
      description: "Party mit Live-Musik und DJ"
    }
  ],
  
  // FAQ section
  faq: [
    {
      question: "Was ist der Dresscode?",
      answer: "Festliche Kleidung erwünscht. Damen: Cocktailkleid oder elegante Abendgarderobe. Herren: Anzug oder Sakko mit Hemd."
    },
    {
      question: "Gibt es Parkplätze?",
      answer: "Ja, kostenlose Parkplätze sind auf dem Schlossgelände verfügbar. Bitte folgen Sie der Beschilderung."
    },
    {
      question: "Soll ich ein Geschenk mitbringen?",
      answer: "Ihre Anwesenheit ist das schönste Geschenk. Falls Sie dennoch etwas schenken möchten, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise."
    },
    {
      question: "Wo kann ich übernachten?",
      answer: "Wir haben Zimmerkontingente in Hotels in der Nähe reserviert. Bitte kontaktieren Sie uns für Details und Buchungscodes."
    },
    {
      question: "Gibt es vegetarische/vegane Menüoptionen?",
      answer: "Ja, bitte geben Sie Ihre Ernährungsgewohnheiten bei der RSVP an. Wir sorgen für alle Gäste."
    }
  ],
  
  // Important contacts
  contacts: [
    {
      role: "Braut",
      name: "Cathrin",
      phone: "+49 123 456789",
      email: "cathrin@example.com"
    },
    {
      role: "Bräutigam",
      name: "Christoph",
      phone: "+49 123 456790",
      email: "christoph@example.com"
    },
    {
      role: "Trauzeugin",
      name: "Anna",
      phone: "+49 123 456791",
      email: "anna@example.com"
    },
    {
      role: "Trauzeuge",
      name: "Michael",
      phone: "+49 123 456792",
      email: "michael@example.com"
    },
    {
      role: "Organisation",
      name: "Hochzeitsplaner",
      phone: "+49 123 456793",
      email: "planung@example.com"
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = weddingConfig;
} else {
  window.weddingConfig = weddingConfig;
}