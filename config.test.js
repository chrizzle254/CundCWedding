// Test configuration file for demonstration purposes
// This file shows how the website will look with sample data
// DO NOT use this for production - create your own config.js instead

window.weddingConfig = {
  // Sample password for testing
  password: "test123",
  
  // Sample Spotify playlist ID
  spotifyPlaylistId: "37i9dQZF1DX5Vy6DFOcx00",
  
  // Sample Google Form URL for RSVP
  rsvpFormUrl: "https://forms.google.com/example-form",
  
  // Wedding details
  wedding: {
    date: "06.06.2026",
    location: "Schloss Bredeneek, Nähe Kiel",
    coupleNames: "Cathrin & Christoph"
  },
  
  // Sample agenda/timeline
  agenda: [
    {
      time: "14:00",
      title: "Ankunft & Begrüßung",
      description: "Empfang der Gäste mit Sekt und Canapés im Schlossgarten"
    },
    {
      time: "15:00",
      title: "Trauung",
      description: "Hochzeitszeremonie im historischen Schlossgarten mit Trauzeugen"
    },
    {
      time: "16:00",
      title: "Sektempfang",
      description: "Champagner, Fotoshooting und erste Glückwünsche"
    },
    {
      time: "18:00",
      title: "Abendessen",
      description: "Gemeinsames Abendessen im eleganten Schlossrestaurant"
    },
    {
      time: "20:00",
      title: "Tanz & Feier",
      description: "Party mit Live-Musik, DJ und Tanz bis in die Nacht"
    }
  ],
  
  // Sample FAQ section
  faq: [
    {
      question: "Was ist der Dresscode?",
      answer: "Festliche Kleidung erwünscht. Damen: Cocktailkleid oder elegante Abendgarderobe. Herren: Anzug oder Sakko mit Hemd. Wir freuen uns über festliche Outfits!"
    },
    {
      question: "Gibt es Parkplätze?",
      answer: "Ja, kostenlose Parkplätze sind auf dem Schlossgelände verfügbar. Bitte folgen Sie der Beschilderung 'Hochzeit'. Ein Parkplatzservice steht zur Verfügung."
    },
    {
      question: "Soll ich ein Geschenk mitbringen?",
      answer: "Ihre Anwesenheit ist das schönste Geschenk. Falls Sie dennoch etwas schenken möchten, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise oder einen persönlichen Wunsch."
    },
    {
      question: "Wo kann ich übernachten?",
      answer: "Wir haben Zimmerkontingente in Hotels in der Nähe reserviert. Bitte kontaktieren Sie uns für Details und Buchungscodes. Frühzeitige Buchung wird empfohlen."
    },
    {
      question: "Gibt es vegetarische/vegane Menüoptionen?",
      answer: "Ja, bitte geben Sie Ihre Ernährungsgewohnheiten bei der RSVP an. Wir sorgen für alle Gäste und berücksichtigen Allergien und besondere Wünsche."
    },
    {
      question: "Kann ich Kinder mitbringen?",
      answer: "Wir freuen uns über alle unsere Gäste! Bitte geben Sie bei der RSVP an, ob Sie Kinder mitbringen, damit wir entsprechend planen können."
    }
  ],
  
  // Sample important contacts
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
    },
    {
      role: "Fotograf",
      name: "Sarah",
      phone: "+49 123 456794",
      email: "fotografie@example.com"
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = weddingConfig;
} else {
  window.weddingConfig = weddingConfig;
}