import type { PresetConfig } from '../../types/preset';

export const educationPreset: PresetConfig = {
  id: 'education',
  businessName: 'TinyKeys Playhouse',
  tagline: 'A bright keyboard music playground where kids can mash keys and hear cheerful piano notes.',
  brand: {
    mark: 'TK',
    kicker: 'AGES 2-7',
    accentPhrase: 'A light-or-dark musical background, floating key bubbles, and zero reading required so little kids can play safely on their own.'
  },
  hero: {
    title: 'Turn any computer keyboard into a playful mini piano for curious little hands.',
    subtitle:
      'TinyKeys Playhouse gives kids a full-screen music playground with floating letter bubbles, gentle piano-like sounds, and simple press-any-key freedom that works without menus, scores, or complicated setup.',
    primaryCta: 'Ask about family packs',
    secondaryCta: 'Explore play modes'
  },
  homeExperience: {
    type: 'keyboard-playground',
    title: 'Smash keys, make music, watch bubbles float',
    description:
      'Every keyboard tap triggers a bright piano-style note and a floating bubble that shows the pressed character, so children can experiment freely without typing into a form or opening the wrong screen.',
    helperText: 'Designed for independent play with a clean background, full-keyboard note mapping, and parent-only exit controls.',
    keyboardHint: 'Letters, numbers, punctuation, arrows, tab, enter, backspace, and space all trigger happy sounds.',
    locales: {
      it: {
        title: 'Schiaccia i tasti, fai musica, guarda le bolle salire',
        description:
          'Ogni tocco della tastiera attiva una nota luminosa in stile piano e una bolla con il carattere premuto, cosi i bambini possono sperimentare liberamente senza finire in moduli o schermate sbagliate.',
        helperText: 'Pensato per il gioco indipendente con sfondo pulito, tastiera completa e uscita riservata ai genitori.',
        keyboardHint: 'Lettere, numeri, punteggiatura, frecce, tab, invio, backspace e spazio fanno tutti suoni felici.',
        pads: [
          { label: 'Bagliore', hint: 'Rintocco caldo', accent: '#ff8f5a' },
          { label: 'Fiore', hint: 'Ping solare', accent: '#ffca45' },
          { label: 'Onda', hint: 'Cerchio morbido', accent: '#4fb3ff' },
          { label: 'Salto', hint: 'Pizzico elastico', accent: '#63d27c' },
          { label: 'Vortice', hint: 'Scintilla leggera', accent: '#ff6fa8' },
          { label: 'Brezza', hint: 'Tono arioso', accent: '#8f7cff' },
          { label: 'Scintilla', hint: 'Campanella piccola', accent: '#00c1b6' },
          { label: 'Pop', hint: 'Ping giocoso', accent: '#ff7c43' }
        ]
      }
    },
    pads: [
      { label: 'Glow', hint: 'Warm chime', accent: '#ff8f5a' },
      { label: 'Bloom', hint: 'Sunny ping', accent: '#ffca45' },
      { label: 'Ripple', hint: 'Soft ring', accent: '#4fb3ff' },
      { label: 'Hop', hint: 'Bouncy pluck', accent: '#63d27c' },
      { label: 'Twirl', hint: 'Light sparkle', accent: '#ff6fa8' },
      { label: 'Drift', hint: 'Airy tone', accent: '#8f7cff' },
      { label: 'Zing', hint: 'Tiny bell', accent: '#00c1b6' },
      { label: 'Pop', hint: 'Playful ping', accent: '#ff7c43' }
    ]
  },
  about: {
    headline: 'A low-friction music toy built for kids who love pressing every key they can reach.',
    story:
      'TinyKeys Playhouse was shaped around a simple parent need: let young children explore cause and effect on a real keyboard without opening chats, forms, or distracting apps. The experience rewards every press with colorful motion and friendly piano-like tones, making free play feel fun instead of stressful.',
    founder: 'Nora Bell',
    yearsInBusiness: 4,
    values: ['Independent exploration first', 'Safe, forgiving interactions', 'Joyful sound and color over screen clutter']
  },
  services: [
    {
      name: 'Rainbow Piano',
      blurb: 'Any key on the keyboard becomes a bright, piano-style note with a floating on-screen bubble showing what was pressed.',
      duration: 'Free play',
      priceHint: 'Full keyboard support'
    },
    {
      name: 'Floating Key Bubbles',
      blurb: 'The screen stays clean while letters, arrows, punctuation, and special-key symbols rise across the background like a musical screensaver.',
      duration: 'Visual mode',
      priceHint: 'Light or dark themes'
    },
    {
      name: 'Quiet-Friendly Tone Design',
      blurb: 'Notes stay cheerful and soft instead of harsh, so repeated key mashing feels playful rather than overwhelming.',
      duration: 'Sound-safe',
      priceHint: 'Gentle piano mix'
    },
    {
      name: 'No Reading Needed',
      blurb: 'Children can start immediately because the experience uses color, motion, and instant cause-and-effect instead of instructions-heavy menus.',
      duration: 'Self-directed',
      priceHint: 'Kid-ready UI'
    },
    {
      name: 'Parent Setup Support',
      blurb: 'Families, daycares, and play cafes can request help with fullscreen setup, device recommendations, and simple branded packaging.',
      duration: 'Launch help',
      priceHint: 'Family and venue packs'
    }
  ],
  testimonials: [
    {
      quote: 'My son just wants to hear sounds and see colors. This lets him do exactly that without ending up in random browser tabs.',
      name: 'Mina R.',
      role: 'Parent of a 3-year-old'
    },
    {
      quote: 'The floating key bubbles make it easy for classroom free time because the kids understand it instantly and stay engaged.',
      name: 'Coach Elena P.',
      role: 'Early learning studio owner'
    },
    {
      quote: 'It feels like a toy, not a lesson, which is why the kids keep coming back to it.',
      name: 'Jordan S.',
      role: 'Play cafe operator'
    }
  ],
  contact: {
    phone: '',
    phoneLink: '',
    email: 'hello@tinykeysplayhouse.com',
    address: '214 Clement Street, San Francisco, CA 94118',
    serviceArea: 'Used at home, in kids corners, early-learning rooms, and play cafes across the U.S.',
    hours: [
      'Family support: Mon-Fri, 9:00 AM - 5:00 PM PT',
      'Studio and venue demos: Tue-Thu, 10:00 AM - 4:00 PM PT',
      'Setup replies: usually within one business day'
    ]
  },
  seo: {
    title: 'TinyKeys Playhouse | Kids Keyboard Piano Playground Template',
    description:
      'Education preset for a kid-safe keyboard music web app with colorful piano-style sounds, large tap targets, and simple independent play.',
    keywords: ['kids keyboard game', 'piano toy app', 'toddler music web app', 'safe keyboard play', 'music playground template']
  },
  designTokens: {
    '--color-bg': '#fff7ea',
    '--color-surface': '#ffffff',
    '--color-surface-alt': '#eef8ff',
    '--color-text': '#23335d',
    '--color-text-muted': '#60719a',
    '--color-accent': '#ff9f45',
    '--color-accent-strong': '#ff6f5f',
    '--color-outline': '#d9e5f8',
    '--font-display': '"Bricolage Grotesque", "Trebuchet MS", sans-serif',
    '--font-body': '"Manrope", "Segoe UI", sans-serif',
    '--radius-sm': '16px',
    '--radius-md': '24px',
    '--radius-lg': '34px',
    '--shadow-soft': '0 22px 50px rgba(71, 113, 192, 0.16)'
  },
  formProvider: {
    type: 'custom',
    successMessage: 'Thanks. We received your message and will send setup details shortly.',
    errorMessage: 'We could not submit your request right now. Please email our team directly.'
  },
  pageCopy: {
    navigation: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      contact: 'Contact'
    },
    home: {
      metrics: [
        { value: 'Any key works', label: 'Letters, numbers, space, and arrows all make music' },
        { value: 'Key bubbles', label: 'Pressed characters float across a clean light or dark stage' },
        { value: 'Ages 2-7', label: 'Made for free play, sensory corners, and parent-light moments' }
      ],
      featuredTitle: 'Play modes included in the preset',
      featuredDescription:
        'Use the built-in keyboard playground as-is or adapt the surrounding copy for family subscriptions, play cafes, daycare corners, or event installs.',
      featuredCtaLabel: 'See every play mode',
      testimonialsTitle: 'Why families keep it open',
      testimonialsDescription:
        'The experience is intentionally simple: every press gets a reward, the screen stays calm, and kids can keep exploring without needing reading support.'
    },
    services: {
      badge: 'Play Modes',
      title: 'Ways kids can play inside TinyKeys',
      intro:
        'Start with free keyboard smashing, then layer in floating character bubbles, soft piano tones, and simple setup options for homes or kid-focused spaces.',
      journeyTitle: 'How the experience works',
      journeySteps: [
        'Open the app and put it in fullscreen if you want a more focused play session.',
        'Kids press any key to trigger a soft piano-style note and a floating bubble showing what they pressed.',
        'Adults can tune the surrounding copy and packaging for family subscriptions, classrooms, or venue installs.'
      ],
      ctaLabel: 'Ask about setup help'
    },
    about: {
      badge: 'Why It Works',
      featureTitle: 'Built for low-supervision joy',
      featureParagraphs: [
        'TinyKeys removes the fragile parts of typical computer use and replaces them with one simple loop: press a key, hear a note, see a color, repeat.',
        'That keeps very young users engaged while helping adults feel more comfortable handing over the keyboard for a few independent minutes of play.'
      ],
      valuesTitle: 'Design principles',
      serviceAreaTitle: 'Where people use it'
    },
    contact: {
      badge: 'Get Setup Help',
      title: 'Talk with the TinyKeys team',
      intro:
        'Tell us whether you are setting up for a home, classroom, daycare, event, or play cafe and we will point you to the best next step.',
      formTitle: 'Ask for setup, pricing, or branding details',
      formDescription:
        'We can help with fullscreen guidance, family-pack questions, venue licensing, and lightweight customization options.',
      directTitle: 'Reach TinyKeys',
      hoursTitle: 'Support hours'
    },
    form: {
      nameLabel: 'Parent, school, or venue name',
      serviceLabel: 'What do you need help with?',
      servicePlaceholder: 'Select a play mode or setup need',
      messageLabel: 'Tell us about your setup',
      messagePlaceholder: 'Share device type, child ages, venue details, and any packaging or branding questions.',
      consentLabel: 'I consent to being contacted about TinyKeys setup, pricing, and customization options.',
      submitLabel: 'Send request',
      submittingLabel: 'Sending...'
    }
  },
  locales: {
    it: {
      tagline: 'Un luminoso parco musicale da tastiera dove i bambini possono premere tasti e sentire allegre note di piano.',
      brand: {
        kicker: 'ETA 2-7',
        accentPhrase:
          'Uno sfondo musicale chiaro o scuro, bolle con i tasti premuti e zero lettura necessaria, cosi i piu piccoli possono giocare in sicurezza anche da soli.'
      },
      hero: {
        title: 'Trasforma qualsiasi tastiera del computer in un mini piano giocoso per piccole mani curiose.',
        subtitle:
          'TinyKeys Playhouse offre ai bambini un parco musicale a schermo intero con bolle fluttuanti, suoni morbidi simili al piano e la semplice liberta di premere qualsiasi tasto senza menu, punteggi o configurazioni complicate.',
        primaryCta: 'Chiedi i pacchetti famiglia',
        secondaryCta: 'Esplora le modalita di gioco'
      },
      about: {
        headline: 'Un gioco musicale semplice e immediato, pensato per i bambini che vogliono premere ogni tasto che trovano.',
        story:
          'TinyKeys Playhouse nasce da un bisogno molto concreto dei genitori: lasciare ai bambini piccoli la liberta di esplorare una vera tastiera senza aprire chat, moduli o schermate distraenti. Ogni pressione riceve un premio fatto di colore, movimento e suoni dolci, cosi il gioco libero resta divertente invece che stressante.',
        values: [
          'Esplorazione indipendente al primo posto',
          'Interazioni sicure e tolleranti',
          'Gioia fatta di suono e colore, non di schermo affollato'
        ]
      },
      services: [
        {
          name: 'Piano Arcobaleno',
          blurb:
            'Ogni tasto della tastiera diventa una nota luminosa in stile piano con una bolla sullo schermo che mostra cosa e stato premuto.',
          duration: 'Gioco libero',
          priceHint: 'Supporto per tutta la tastiera'
        },
        {
          name: 'Bolle dei Tasti',
          blurb:
            'Lo schermo resta pulito mentre lettere, frecce, punteggiatura e simboli dei tasti speciali salgono sullo sfondo come un salvaschermo musicale.',
          duration: 'Modalita visiva',
          priceHint: 'Tema chiaro o scuro'
        },
        {
          name: 'Suoni Delicati',
          blurb:
            'Le note restano allegre e morbide invece di essere dure, cosi anche i colpi ripetuti sulla tastiera risultano giocosi e non invadenti.',
          duration: 'Suono soft',
          priceHint: 'Mix piano delicato'
        },
        {
          name: 'Nessuna Lettura Necessaria',
          blurb:
            'I bambini possono iniziare subito grazie a colori, movimento e causa-effetto immediato, senza menu pieni di istruzioni.',
          duration: 'Autonomia',
          priceHint: 'Interfaccia pronta per i piccoli'
        },
        {
          name: 'Supporto per i Genitori',
          blurb:
            'Famiglie, asili e play cafe possono chiedere aiuto per fullscreen, consigli sui dispositivi e semplici opzioni di personalizzazione.',
          duration: 'Avvio guidato',
          priceHint: 'Pacchetti famiglia e spazi gioco'
        }
      ],
      testimonials: [
        {
          quote:
            'Mio figlio vuole solo sentire suoni e vedere colori. Qui puo farlo davvero senza finire in schede del browser a caso.',
          name: 'Mina R.',
          role: 'Genitore di un bimbo di 3 anni'
        },
        {
          quote:
            'Le bolle che mostrano i tasti rendono il tempo libero in classe semplicissimo: i bambini capiscono subito e restano coinvolti.',
          name: 'Coach Elena P.',
          role: 'Responsabile di uno studio per la prima infanzia'
        },
        {
          quote: 'Sembra un giocattolo, non una lezione, ed e proprio per questo che i bambini ci tornano.',
          name: 'Jordan S.',
          role: 'Gestore di un play cafe'
        }
      ],
      contact: {
        serviceArea:
          'Usato a casa, negli angoli bimbo, nelle aule per la prima infanzia e nei play cafe in tutti gli Stati Uniti.',
        hours: [
          'Supporto famiglie: lun-ven, 9:00 - 17:00 PT',
          'Demo per studi e spazi gioco: mar-gio, 10:00 - 16:00 PT',
          'Risposte setup: di solito entro un giorno lavorativo'
        ]
      },
      formProvider: {
        successMessage: 'Grazie. Abbiamo ricevuto il tuo messaggio e ti invieremo presto i dettagli di configurazione.',
        errorMessage: 'Non siamo riusciti a inviare la richiesta in questo momento. Scrivi direttamente al nostro team via email.'
      },
      pageCopy: {
        navigation: {
          home: 'Home',
          services: 'Modalita',
          about: 'Chi siamo',
          contact: 'Contatti'
        },
        home: {
          metrics: [
            { value: 'Ogni tasto funziona', label: 'Lettere, numeri, spazio e frecce fanno tutti musica' },
            { value: 'Bolle dei tasti', label: 'I caratteri premuti galleggiano su uno sfondo chiaro o scuro' },
            { value: 'Eta 2-7', label: 'Pensato per gioco libero, angoli sensoriali e momenti con poca supervisione' }
          ],
          featuredTitle: 'Modalita di gioco incluse nel preset',
          featuredDescription:
            'Usa il playground da tastiera gia pronto oppure adatta i testi per abbonamenti famiglia, play cafe, angoli nido o installazioni per eventi.',
          featuredCtaLabel: 'Vedi tutte le modalita',
          testimonialsTitle: 'Perche le famiglie lo tengono aperto',
          testimonialsDescription:
            'L esperienza e volutamente semplice: ogni pressione riceve una ricompensa, lo schermo resta calmo e i bambini possono continuare a esplorare senza supporto alla lettura.'
        },
        services: {
          badge: 'Modalita di gioco',
          title: 'Come i bambini possono giocare con TinyKeys',
          intro:
            'Si parte dal premere liberamente la tastiera, poi si aggiungono bolle con i caratteri, suoni morbidi di piano e opzioni semplici per case o spazi dedicati ai bambini.',
          journeyTitle: 'Come funziona',
          journeySteps: [
            'Apri l app e attiva lo schermo intero se vuoi una sessione di gioco piu concentrata.',
            'I bambini premono qualsiasi tasto per sentire una nota morbida in stile piano e vedere una bolla con il carattere premuto.',
            'Gli adulti possono adattare testi e confezione per famiglie, classi, eventi o installazioni in spazi gioco.'
          ],
          ctaLabel: 'Chiedi aiuto per la configurazione'
        },
        about: {
          badge: 'Perche funziona',
          featureTitle: 'Progettato per la gioia con poca supervisione',
          featureParagraphs: [
            'TinyKeys elimina le parti fragili dell uso tipico del computer e le sostituisce con un solo ciclo semplice: premi un tasto, senti una nota, vedi un colore, ripeti.',
            'Cosi i bambini piu piccoli restano coinvolti e gli adulti si sentono piu tranquilli nel lasciare la tastiera per qualche minuto di gioco indipendente.'
          ],
          valuesTitle: 'Principi di design',
          serviceAreaTitle: 'Dove viene usato'
        },
        contact: {
          badge: 'Aiuto per l avvio',
          title: 'Parla con il team TinyKeys',
          intro:
            'Raccontaci se stai preparando il gioco per casa, scuola, asilo, evento o play cafe e ti indicheremo il passo migliore.',
          formTitle: 'Chiedi dettagli su setup, prezzi o personalizzazione',
          formDescription:
            'Possiamo aiutarti con fullscreen, pacchetti famiglia, licenze per spazi e piccole personalizzazioni.',
          directTitle: 'Contatta TinyKeys',
          hoursTitle: 'Orari di supporto'
        },
        form: {
          nameLabel: 'Nome del genitore, della scuola o dello spazio',
          emailLabel: 'Email',
          serviceLabel: 'Per cosa ti serve aiuto?',
          servicePlaceholder: 'Seleziona una modalita o un esigenza',
          messageLabel: 'Raccontaci il tuo setup',
          messagePlaceholder:
            'Condividi il tipo di dispositivo, l eta dei bambini, i dettagli dello spazio e qualsiasi domanda su packaging o personalizzazione.',
          consentLabel:
            'Acconsento a essere ricontattato per setup, prezzi e opzioni di personalizzazione TinyKeys.',
          submitLabel: 'Invia richiesta',
          submittingLabel: 'Invio in corso...',
          reviewErrorMessage: 'Controlla i campi evidenziati e riprova.',
          nameError: 'Inserisci il tuo nome.',
          emailError: 'Inserisci un indirizzo email valido.',
          serviceError: 'Seleziona un opzione.',
          messageError: 'Aggiungi un breve messaggio per aiutarci a capire di cosa hai bisogno.',
          consentError: 'Conferma il consenso per essere ricontattato.'
        }
      }
    }
  }
};
