// Textos de la interfaz en los cuatro idiomas y rutas de cada página.
// La carta se traduce aparte, en src/i18n/carta.json.
import cartaTraducida from './carta.json';

export const langs = ['es', 'en', 'de', 'nl'] as const;
export type Lang = (typeof langs)[number];
export type Page = 'inicio' | 'carta' | 'calma' | 'visitanos';

export const routes: Record<Lang, Record<Page, string>> = {
  es: { inicio: '/', carta: '/carta/', calma: '/calma/', visitanos: '/visitanos/' },
  en: { inicio: '/en/', carta: '/en/menu/', calma: '/en/about/', visitanos: '/en/visit/' },
  de: { inicio: '/de/', carta: '/de/speisekarte/', calma: '/de/ueber-uns/', visitanos: '/de/besuch/' },
  nl: { inicio: '/nl/', carta: '/nl/menukaart/', calma: '/nl/over-ons/', visitanos: '/nl/bezoek/' },
};

export const locale: Record<Lang, { html: string; og: string; intl: string; name: string }> = {
  es: { html: 'es', og: 'es_ES', intl: 'es-ES', name: 'Español' },
  en: { html: 'en', og: 'en_GB', intl: 'en-GB', name: 'English' },
  de: { html: 'de', og: 'de_DE', intl: 'de-DE', name: 'Deutsch' },
  nl: { html: 'nl', og: 'nl_NL', intl: 'nl-NL', name: 'Nederlands' },
};

// Traduce un texto de la carta; en español lo devuelve tal cual.
const glosario = cartaTraducida as unknown as Record<string, Record<Exclude<Lang, 'es'>, string>>;
export const tc = (lang: Lang, es: string) => (lang === 'es' ? es : glosario[es]?.[lang] ?? es);

// «8,00 €» de la carta → formato de precio de cada idioma.
export const price = (lang: Lang, es: string) => {
  const value = Number(es.replace(/[^\d,]/g, '').replace(',', '.'));
  return new Intl.NumberFormat(locale[lang].intl, { style: 'currency', currency: 'EUR' }).format(value);
};

type Notice = [title: string, text: string];
export interface UI {
  skip: string; homeLabel: string; nav: Record<Page, string>; navLabel: string; mobileNavLabel: string;
  language: string; directions: string; call: string; openMenu: string; closeMenu: string; menu: string;
  whereWeAre: string; contact: string; backHome: string; backTop: string; legalNav: string; quickActions: string;
  legal: string; privacy: string; cookies: string; proposal: string; close: string; ok: string; onInstagram: string;
  notices: { legal: Notice; privacy: Notice; cookies: Notice };
  video: { label: string; play: string; playShort: string };
  home: {
    title: string; description: string; place: string; h1: string; intro: string; seeMenu: string; pancakesAlt: string;
    strip: [string, string, string, string]; doorsTitle: string;
    doors: { carta: [string, string, string]; calma: [string, string, string]; visit: [string, string, string] };
    drinksEyebrow: string; drinksTitle: string; drinksIntro: string; coffee: string; matcha: string; chooseDrink: string; allDrinks: string;
    tables: string; callNumber: string; reviews: string;
  };
  carta: {
    title: string; description: string; eyebrow: (n: number) => string; h1: string; aside: string; tabs: string; sections: (menu: string) => string;
    intros: Record<string, string>; dish: (n: number) => string; drink: (n: number) => string; photo: string;
    vegan: string; vegetarian: string; choose: string; add: string; allergens: string;
    allergyTitle: string; allergyText: string; checked: (date: string) => string; source: string; translated?: string;
  };
  calma: {
    title: string; description: string; h1: string; intro: string; chalkEyebrow: string; otherBoard: string;
    detailsEyebrow: string; detailsTitle: string; detailsText: string; captions: string[]; instagram: string;
    story: {
      eyebrow: string; title: string; lead: string;
      dream: { label: string; title: string; text: string; caption: string };
      name: { label: string; title: string; text: string; caption: string; replay: string };
    };
  };
  visit: {
    title: string; description: string; eyebrow: string; h1: string; intro: string; address: string; hours: string; hoursLink: string; hoursView: string;
    contact: string; loadMap: string; mapNote: string; mapCaption: string; mapTitle: string; mapFallback: string;
  };  notFound: { title: string; h1: string; intro: string };
}

export const ui: Record<Lang, UI> = {
  es: {
    skip: 'Saltar al contenido', homeLabel: 'Calma Café, inicio',
    nav: { inicio: 'Inicio', carta: 'Carta', calma: 'Calma', visitanos: 'Visítanos' },
    navLabel: 'Navegación principal', mobileNavLabel: 'Navegación móvil', language: 'Idioma',
    directions: 'Cómo llegar', call: 'Llamar', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', menu: 'Menú',
    whereWeAre: 'Dónde estamos', contact: 'Contacto', backHome: 'Volver al inicio', backTop: 'Volver arriba',
    legalNav: 'Información legal', quickActions: 'Acciones rápidas', legal: 'Aviso legal', privacy: 'Privacidad', cookies: 'Cookies',
    proposal: 'Propuesta de diseño web · octubre de 2026', close: 'Cerrar', ok: 'Entendido', onInstagram: 'en Instagram',
    notices: {
      legal: ['Aviso legal', 'Esta es una demo. Los datos del titular y el aviso legal se incorporarán antes de publicar la web.'],
      privacy: ['Privacidad', 'Esta demo no contiene formularios ni analítica. La política de privacidad completa se incorporará cuando se confirmen los datos del titular. Los enlaces externos y el mapa cargado voluntariamente llevan a servicios de terceros.'],
      cookies: ['Cookies', 'Esta demo no utiliza cookies propias ni analítica. Google Maps solo se conecta cuando pulsas «Cargar mapa» y puede aplicar sus propias tecnologías y políticas. El texto definitivo de cookies se revisará antes de publicar.'],
    },
    video: { label: 'Recorrido sin sonido por la barra y el ventanal de Calma Café', play: 'Reproducir vídeo del local', playShort: 'Ver el local' },
    home: {
      title: 'Calma Café · Brunch y café en Maspalomas',
      description: 'Brunch, café Lavazza, matcha y opciones veganas en la avenida de Tirajana, Maspalomas. Carta completa con precios y alérgenos.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch y café<br />en <em>Maspalomas.</em>',
      intro: 'Granola, pancakes, tostas y el Calma Especial en triassant. Café Lavazza, matcha y ube latte. En la avenida de Tirajana, con mesas dentro y fuera.',
      seeMenu: 'Ver la carta', pancakesAlt: 'Pancakes de Calma Café con distintos acompañamientos',
      strip: ['Brunch', 'Café Lavazza', 'Matcha y ube', 'Vegano y vegetariano'],
      doorsTitle: 'La carta, el local y <em>cómo llegar.</em>',
      doors: {
        carta: ['La carta', '{n} platos y bebidas con precio y alérgenos, también en versión vegetariana y vegana.', 'Ver la carta'],
        calma: ['Calma', 'Quiénes somos, la pizarra y el local por dentro.', 'Conócenos'],
        visit: ['Visítanos', '{calle}, en Maspalomas. Teléfono, WhatsApp y mapa.', 'Cómo llegar'],
      },
      drinksEyebrow: 'Para beber', drinksTitle: '¿Café o <em>matcha?</em>',
      drinksIntro: 'Café Lavazza, matcha japonés y ube, una batata lila de Filipinas que sabe a vainilla.',
      coffee: 'Café', matcha: 'Matcha y ube', chooseDrink: 'Elige tu bebida', allDrinks: 'Todas las bebidas',
      tables: 'Mesas dentro y fuera.', callNumber: 'Llamar al {tel}', reviews: 'Reseñas en Google',
    },
    carta: {
      title: 'La carta · Calma Café, Maspalomas',
      description: 'La carta completa de Calma Café en Maspalomas: brunch, tostas, fajitas, ensaladas, dulces caseros, opciones vegetarianas y veganas, café, matcha y ube.',
      eyebrow: n => `Carta completa · ${n} platos y bebidas`, h1: 'Brunch, café y <em>algo dulce.</em>',
      aside: 'Precios, extras y alérgenos de cada plato, igual que en la carta del local. Pulsa el nombre de un plato para ver la foto.',
      tabs: 'Menús de la carta', sections: menu => `Secciones: ${menu}`,
      intros: {
        carta: 'Brunch dulce o salado, tostas, fajitas, ensaladas y algo dulce para terminar.',
        vegetariano: 'Sin carne ni pescado.', vegano: 'Sin ingredientes de origen animal.',
        bebidas: 'Café Lavazza, matcha, ube, smoothies, zumos, mimosas y Aperol Spritz.',
      },
      dish: n => `${n} ${n === 1 ? 'propuesta' : 'propuestas'}`, drink: n => `${n} ${n === 1 ? 'bebida' : 'bebidas'}`, photo: 'ver foto',
      vegan: 'Vegano', vegetarian: 'Vegetariano', choose: 'A elegir', add: 'Añade', allergens: 'Alérgenos',
      allergyTitle: '¿Alergias o intolerancias?',
      allergyText: 'Cuéntaselo a nuestro equipo antes de pedir. Los alérgenos que ves son los que indica la carta digital del local; si un plato no muestra ninguno, pregúntanos.',
      checked: date => `Carta consultada el ${date}`, source: 'Carta digital de Calma',
    },
    calma: {
      title: 'Calma · Calma Café, Maspalomas',
      description: 'Calma Café es el café de una pareja noruega y neerlandesa en la avenida de Tirajana, Maspalomas: brunch, café y dulces caseros en un local lleno de plantas y cuadros.',
      h1: 'De Noruega y los Países Bajos<br />a <em>Maspalomas.</em>',
      intro: 'Calma es el café de una pareja noruega y neerlandesa en la avenida de Tirajana, 3. Servimos brunch, café y dulces caseros en un local con plantas, cojines mostaza y cuadros en las paredes.',
      chalkEyebrow: 'La pizarra del local', otherBoard: 'La otra pizarra.',
      detailsEyebrow: 'El local', detailsTitle: 'Por <em>dentro.</em>',
      detailsText: 'Cojines mostaza, un tapiz hecho de tazas, bombillas sobre la barra de madera<br />y un ventanal que da a las palmeras.',
      captions: ['El ventanal', 'Los cojines', 'El tablero de notas', 'La barra', 'El tapiz de tazas', 'Los cuadros', 'Las bombillas', 'Una mesa junto al tablero'],
      instagram: 'Más fotos del local y de la carta en Instagram.',
      story: {
        eyebrow: 'Nuestra historia', title: 'Todo empezó con <em>un sueño.</em>',
        lead: 'Durante unos quince años, Guro imaginó su propia cafetería. Calma es lo que pasó cuando por fin encontró el sitio.',
        dream: { label: 'El sueño', title: 'Un sueño de quince años abre sus puertas', text: 'Guro había trabajado en cafeterías y cocinas en Noruega antes de instalarse en Gran Canaria. Buscó durante años el espacio adecuado, y el 6 de septiembre de 2019 Calma abrió en Maspalomas.', caption: 'El día que abrimos.' },
        name: { label: 'El nombre', title: 'De «Alma» nació «Calma»', text: 'Guro buscaba una palabra con alma, y al principio el proyecto iba a llamarse Alma Café. Mientras trabajaban en el logotipo apareció «Calma», y encajaba mejor con todo lo que quería transmitir.', caption: 'Casi se llamó Alma Café.', replay: 'Ver la animación otra vez' },
      },
    },
    visit: {
      title: 'Visítanos · Calma Café, Maspalomas',
      description: 'Calma Café está en la Avda. de Tirajana, 3 (Apartamentos Aloe), Maspalomas. Teléfono 681 66 79 17, WhatsApp y cómo llegar.',
      eyebrow: 'Visítanos', h1: 'Dónde <em>estamos.</em>',
      intro: 'Tenemos mesas dentro y fuera. Si quieres preguntar algo antes de venir, llámanos o escríbenos por WhatsApp.',
      address: 'Dirección', hours: 'Horario', hoursLink: 'Ver la ficha en Google Maps', hoursView: 'Ver horario', contact: 'Contacto',
      loadMap: 'Cargar mapa', mapNote: 'Al cargarlo conectarás con Google Maps.', mapCaption: 'Ilustración · el mapa de Google se carga solo si lo pides.',
      mapTitle: 'Calma Café en Google Maps', mapFallback: 'Si el mapa no aparece, usa el botón «Cómo llegar».',
    },
    notFound: { title: 'Página no encontrada', h1: 'Esta página no está <em>en la carta.</em>', intro: 'Puede que el enlace esté mal escrito o que la página ya no exista. Desde aquí puedes volver al inicio, ver la carta o saber cómo llegar.' },
  },
  en: {
    skip: 'Skip to content', homeLabel: 'Calma Café, home',
    nav: { inicio: 'Home', carta: 'Menu', calma: 'About', visitanos: 'Visit us' },
    navLabel: 'Main navigation', mobileNavLabel: 'Mobile navigation', language: 'Language',
    directions: 'Directions', call: 'Call', openMenu: 'Open menu', closeMenu: 'Close menu', menu: 'Menu',
    whereWeAre: 'Find us', contact: 'Contact', backHome: 'Back to home', backTop: 'Back to top',
    legalNav: 'Legal information', quickActions: 'Quick actions', legal: 'Legal notice', privacy: 'Privacy', cookies: 'Cookies',
    proposal: 'Website design proposal · October 2026', close: 'Close', ok: 'OK', onInstagram: 'on Instagram',
    notices: {
      legal: ['Legal notice', 'This is a demo. The owner’s details and the legal notice will be added before the website goes live.'],
      privacy: ['Privacy', 'This demo has no forms and no analytics. The full privacy policy will be added once the owner’s details are confirmed. External links and the map, if you choose to load it, lead to third-party services.'],
      cookies: ['Cookies', 'This demo uses no cookies of its own and no analytics. Google Maps only connects when you press “Load map”, and it may apply its own technologies and policies. The final cookie text will be reviewed before launch.'],
    },
    video: { label: 'Silent walk past the counter and the big window at Calma Café', play: 'Play video of the café', playShort: 'See the café' },
    home: {
      title: 'Calma Café · Brunch and coffee in Maspalomas',
      description: 'Brunch, Lavazza coffee, matcha and vegan options on Avenida de Tirajana, Maspalomas. Full menu with prices and allergens.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch and coffee<br />in <em>Maspalomas.</em>',
      intro: 'Granola, pancakes, toasts and the Calma Special on a triassant. Lavazza coffee, matcha and ube latte. On Avenida de Tirajana, with tables inside and out.',
      seeMenu: 'See the menu', pancakesAlt: 'Calma Café pancakes with different toppings',
      strip: ['Brunch', 'Lavazza coffee', 'Matcha and ube', 'Vegan and vegetarian'],
      doorsTitle: 'The menu, the café and <em>how to find us.</em>',
      doors: {
        carta: ['The menu', '{n} dishes and drinks with prices and allergens, including vegetarian and vegan menus.', 'See the menu'],
        calma: ['About', 'Who we are, the chalkboard and the café inside.', 'Meet us'],
        visit: ['Visit us', '{calle}, Maspalomas. Phone, WhatsApp and map.', 'Directions'],
      },
      drinksEyebrow: 'To drink', drinksTitle: 'Coffee or <em>matcha?</em>',
      drinksIntro: 'Lavazza coffee, Japanese matcha and ube, a purple sweet potato from the Philippines that tastes of vanilla.',
      coffee: 'Coffee', matcha: 'Matcha and ube', chooseDrink: 'Choose your drink', allDrinks: 'All drinks',
      tables: 'Tables inside and out.', callNumber: 'Call {tel}', reviews: 'Reviews on Google',
    },
    carta: {
      title: 'Menu · Calma Café, Maspalomas',
      description: 'The full Calma Café menu in Maspalomas: brunch, toasts, wraps, salads, homemade cakes, vegetarian and vegan options, coffee, matcha and ube.',
      eyebrow: n => `Full menu · ${n} dishes and drinks`, h1: 'Brunch, coffee and <em>something sweet.</em>',
      aside: 'Prices, extras and allergens for every dish, as on the café’s own menu. Tap a dish name to see the photo.',
      tabs: 'Menus', sections: menu => `Sections: ${menu}`,
      intros: {
        carta: 'Sweet or savoury brunch, toasts, wraps, salads and something sweet to finish.',
        vegetariano: 'No meat or fish.', vegano: 'No animal products.',
        bebidas: 'Lavazza coffee, matcha, ube, smoothies, juices, mimosas and Aperol Spritz.',
      },
      dish: n => `${n} ${n === 1 ? 'dish' : 'dishes'}`, drink: n => `${n} ${n === 1 ? 'drink' : 'drinks'}`, photo: 'see photo',
      vegan: 'Vegan', vegetarian: 'Vegetarian', choose: 'Choose', add: 'Add', allergens: 'Allergens',
      allergyTitle: 'Allergies or intolerances?',
      allergyText: 'Please tell our team before you order. The allergens shown are the ones listed on the café’s digital menu; if a dish shows none, please ask us.',
      checked: date => `Menu checked on ${date}`, source: 'Calma’s digital menu',
      translated: 'Translated from the café’s Spanish menu. Prices and allergens are the same as in the original.',
    },
    calma: {
      title: 'About · Calma Café, Maspalomas',
      description: 'Calma Café is run by a Norwegian and Dutch couple on Avenida de Tirajana, Maspalomas: brunch, coffee and homemade cakes in a café full of plants and paintings.',
      h1: 'From Norway and the Netherlands<br />to <em>Maspalomas.</em>',
      intro: 'Calma is the café of a Norwegian and Dutch couple at Avenida de Tirajana, 3. We serve brunch, coffee and homemade cakes in a room with plants, mustard cushions and paintings on the walls.',
      chalkEyebrow: 'Our chalkboard', otherBoard: 'The other chalkboard.',
      detailsEyebrow: 'The café', detailsTitle: 'Take a look <em>inside.</em>',
      detailsText: 'Mustard cushions, a wall hanging made of cups, light bulbs over the wooden counter<br />and a big window looking out onto palm trees.',
      captions: ['The window', 'The cushions', 'The noticeboard', 'The counter', 'The cup wall hanging', 'The paintings', 'The light bulbs', 'A table by the noticeboard'],
      instagram: 'More photos of the café and the food on Instagram.',
      story: {
        eyebrow: 'Our story', title: 'It all started with <em>a dream.</em>',
        lead: 'For about fifteen years, Guro dreamed of opening a café. Calma is what happened when the right place finally came along.',
        dream: { label: 'The dream', title: 'A fifteen-year dream opens its doors', text: 'Guro had worked in cafés and kitchens in Norway before settling in Gran Canaria. The search for the right space took years, and on 6 September 2019 Calma opened in Maspalomas.', caption: 'The day we opened.' },
        name: { label: 'The name', title: 'From “Alma” came “Calma”', text: 'Guro was looking for a word with soul (alma means soul in Spanish), and at first the project was going to be called Alma Café. While the logo was being designed, “Calma” came up, and it fitted everything Guro wanted to get across even better.', caption: 'It was almost called Alma Café.', replay: 'Play the animation again' },
      },
    },
    visit: {
      title: 'Visit us · Calma Café, Maspalomas',
      description: 'Calma Café is at Avda. de Tirajana, 3 (Apartamentos Aloe), Maspalomas. Phone +34 681 66 79 17, WhatsApp and directions.',
      eyebrow: 'Visit us', h1: 'Where <em>to find us.</em>',
      intro: 'We have tables inside and out. If you have a question before you come, give us a call or send us a WhatsApp.',
      address: 'Address', hours: 'Opening hours', hoursLink: 'See our Google Maps listing', hoursView: 'See hours', contact: 'Contact',
      loadMap: 'Load map', mapNote: 'Loading it connects you to Google Maps.', mapCaption: 'Illustration · the Google map only loads if you ask for it.',
      mapTitle: 'Calma Café on Google Maps', mapFallback: 'If the map does not appear, use the “Directions” button.',
    },
    notFound: { title: 'Page not found', h1: 'This page is not <em>on the menu.</em>', intro: 'The link may be mistyped, or the page may no longer exist. From here you can go back home, see the menu or find out how to get here.' },
  },
  de: {
    skip: 'Zum Inhalt springen', homeLabel: 'Calma Café, Startseite',
    nav: { inicio: 'Start', carta: 'Speisekarte', calma: 'Über uns', visitanos: 'Besuch' },
    navLabel: 'Hauptnavigation', mobileNavLabel: 'Mobile Navigation', language: 'Sprache',
    directions: 'Route', call: 'Anrufen', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', menu: 'Menü',
    whereWeAre: 'So findest du uns', contact: 'Kontakt', backHome: 'Zur Startseite', backTop: 'Nach oben',
    legalNav: 'Rechtliche Hinweise', quickActions: 'Schnellzugriff', legal: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies',
    proposal: 'Website-Entwurf · Oktober 2026', close: 'Schließen', ok: 'Verstanden', onInstagram: 'auf Instagram',
    notices: {
      legal: ['Impressum', 'Dies ist eine Demo. Die Angaben zum Inhaber und das Impressum werden vor der Veröffentlichung ergänzt.'],
      privacy: ['Datenschutz', 'Diese Demo enthält keine Formulare und keine Analyse-Tools. Die vollständige Datenschutzerklärung folgt, sobald die Angaben zum Inhaber bestätigt sind. Externe Links und die Karte, wenn du sie lädst, führen zu Diensten Dritter.'],
      cookies: ['Cookies', 'Diese Demo verwendet keine eigenen Cookies und keine Analyse-Tools. Google Maps wird erst verbunden, wenn du auf „Karte laden“ tippst, und kann eigene Technologien und Richtlinien anwenden. Der endgültige Cookie-Text wird vor dem Start geprüft.'],
    },
    video: { label: 'Stummer Rundgang entlang der Theke bis zum großen Fenster von Calma Café', play: 'Video vom Café abspielen', playShort: 'Café ansehen' },
    home: {
      title: 'Calma Café · Brunch und Kaffee in Maspalomas',
      description: 'Brunch, Lavazza-Kaffee, Matcha und vegane Gerichte in der Avenida de Tirajana, Maspalomas. Komplette Speisekarte mit Preisen und Allergenen.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch und Kaffee<br />in <em>Maspalomas.</em>',
      intro: 'Granola, Pancakes, Toasts und das Calma Special im Triassant. Lavazza-Kaffee, Matcha und Ube Latte. In der Avenida de Tirajana, mit Tischen drinnen und draußen.',
      seeMenu: 'Zur Speisekarte', pancakesAlt: 'Pancakes von Calma Café mit verschiedenen Toppings',
      strip: ['Brunch', 'Lavazza-Kaffee', 'Matcha und Ube', 'Vegan und vegetarisch'],
      doorsTitle: 'Speisekarte, Café und <em>Anfahrt.</em>',
      doors: {
        carta: ['Speisekarte', '{n} Gerichte und Getränke mit Preisen und Allergenen, auch vegetarisch und vegan.', 'Zur Speisekarte'],
        calma: ['Über uns', 'Wer wir sind, unsere Kreidetafel und das Café von innen.', 'Lern uns kennen'],
        visit: ['Besuch', '{calle}, Maspalomas. Telefon, WhatsApp und Karte.', 'Route'],
      },
      drinksEyebrow: 'Zum Trinken', drinksTitle: 'Kaffee oder <em>Matcha?</em>',
      drinksIntro: 'Lavazza-Kaffee, japanischer Matcha und Ube, eine violette Süßkartoffel von den Philippinen, die nach Vanille schmeckt.',
      coffee: 'Kaffee', matcha: 'Matcha und Ube', chooseDrink: 'Wähle dein Getränk', allDrinks: 'Alle Getränke',
      tables: 'Tische drinnen und draußen.', callNumber: '{tel} anrufen', reviews: 'Bewertungen auf Google',
    },
    carta: {
      title: 'Speisekarte · Calma Café, Maspalomas',
      description: 'Die komplette Speisekarte von Calma Café in Maspalomas: Brunch, Toasts, Wraps, Salate, hausgemachter Kuchen, vegetarische und vegane Gerichte, Kaffee, Matcha und Ube.',
      eyebrow: n => `Komplette Speisekarte · ${n} Gerichte und Getränke`, h1: 'Brunch, Kaffee und <em>etwas Süßes.</em>',
      aside: 'Preise, Extras und Allergene zu jedem Gericht, wie auf der Karte im Café. Tippe auf einen Namen, um das Foto zu sehen.',
      tabs: 'Karten', sections: menu => `Bereiche: ${menu}`,
      intros: {
        carta: 'Süßer oder herzhafter Brunch, Toasts, Wraps, Salate und etwas Süßes zum Schluss.',
        vegetariano: 'Ohne Fleisch und Fisch.', vegano: 'Ohne tierische Zutaten.',
        bebidas: 'Lavazza-Kaffee, Matcha, Ube, Smoothies, Säfte, Mimosas und Aperol Spritz.',
      },
      dish: n => `${n} ${n === 1 ? 'Gericht' : 'Gerichte'}`, drink: n => `${n} ${n === 1 ? 'Getränk' : 'Getränke'}`, photo: 'Foto ansehen',
      vegan: 'Vegan', vegetarian: 'Vegetarisch', choose: 'Zur Auswahl', add: 'Extra', allergens: 'Allergene',
      allergyTitle: 'Allergien oder Unverträglichkeiten?',
      allergyText: 'Sag unserem Team bitte vor der Bestellung Bescheid. Die angezeigten Allergene stammen aus der digitalen Speisekarte des Cafés; wenn bei einem Gericht keine stehen, frag uns bitte.',
      checked: date => `Speisekarte abgerufen am ${date}`, source: 'Digitale Speisekarte von Calma',
      translated: 'Übersetzt aus der spanischen Speisekarte des Cafés. Preise und Allergene entsprechen dem Original.',
    },
    calma: {
      title: 'Über uns · Calma Café, Maspalomas',
      description: 'Calma Café wird von einem norwegisch-niederländischen Paar in der Avenida de Tirajana in Maspalomas geführt: Brunch, Kaffee und hausgemachter Kuchen in einem Café voller Pflanzen und Bilder.',
      h1: 'Aus Norwegen und den Niederlanden<br />nach <em>Maspalomas.</em>',
      intro: 'Calma ist das Café eines norwegisch-niederländischen Paares in der Avenida de Tirajana 3. Wir servieren Brunch, Kaffee und hausgemachten Kuchen, zwischen Pflanzen, senfgelben Kissen und Bildern an den Wänden.',
      chalkEyebrow: 'Unsere Kreidetafel', otherBoard: 'Die andere Tafel.',
      detailsEyebrow: 'Das Café', detailsTitle: 'Ein Blick <em>hinein.</em>',
      detailsText: 'Senfgelbe Kissen, ein Wandteppich aus Tassen, Glühbirnen über der Holztheke<br />und ein großes Fenster mit Blick auf Palmen.',
      captions: ['Das Fenster', 'Die Kissen', 'Die Pinnwand', 'Die Theke', 'Der Tassen-Wandteppich', 'Die Bilder', 'Die Glühbirnen', 'Ein Tisch an der Pinnwand'],
      instagram: 'Mehr Fotos vom Café und vom Essen auf Instagram.',
      story: {
        eyebrow: 'Unsere Geschichte', title: 'Alles begann mit <em>einem Traum.</em>',
        lead: 'Rund fünfzehn Jahre lang träumte Guro von einem eigenen Café. Calma ist das, was passierte, als sich endlich der richtige Ort fand.',
        dream: { label: 'Der Traum', title: 'Ein Traum von fünfzehn Jahren öffnet seine Türen', text: 'Guro hatte in Norwegen in Cafés und Küchen gearbeitet und sich dann auf Gran Canaria niedergelassen. Die Suche nach dem passenden Raum dauerte Jahre, und am 6. September 2019 öffnete Calma in Maspalomas.', caption: 'Der Tag, an dem wir eröffnet haben.' },
        name: { label: 'Der Name', title: 'Aus „Alma“ wurde „Calma“', text: 'Guro suchte ein Wort mit Seele (auf Spanisch „alma“), und anfangs sollte das Projekt Alma Café heißen. Bei der Arbeit am Logo tauchte „Calma“ auf, und das passte noch besser zu allem, was Guro vermitteln wollte.', caption: 'Fast hätte es Alma Café geheißen.', replay: 'Animation noch einmal abspielen' },
      },
    },
    visit: {
      title: 'Besuch · Calma Café, Maspalomas',
      description: 'Calma Café, Avda. de Tirajana 3 (Apartamentos Aloe), Maspalomas. Telefon +34 681 66 79 17, WhatsApp und Anfahrt.',
      eyebrow: 'Besuch', h1: 'So findest du <em>uns.</em>',
      intro: 'Wir haben Tische drinnen und draußen. Wenn du vorher eine Frage hast, ruf uns an oder schreib uns per WhatsApp.',
      address: 'Adresse', hours: 'Öffnungszeiten', hoursLink: 'Eintrag auf Google Maps ansehen', hoursView: 'Öffnungszeiten', contact: 'Kontakt',
      loadMap: 'Karte laden', mapNote: 'Beim Laden wirst du mit Google Maps verbunden.', mapCaption: 'Illustration · die Google-Karte lädt nur, wenn du es möchtest.',
      mapTitle: 'Calma Café auf Google Maps', mapFallback: 'Wenn die Karte nicht erscheint, nutze die Schaltfläche „Route“.',
    },
    notFound: { title: 'Seite nicht gefunden', h1: 'Diese Seite steht nicht <em>auf der Karte.</em>', intro: 'Vielleicht ist der Link falsch geschrieben oder die Seite gibt es nicht mehr. Von hier aus kommst du zur Startseite, zur Speisekarte oder zur Anfahrt.' },
  },
  nl: {
    skip: 'Naar de inhoud', homeLabel: 'Calma Café, home',
    nav: { inicio: 'Home', carta: 'Menukaart', calma: 'Over ons', visitanos: 'Bezoek' },
    navLabel: 'Hoofdnavigatie', mobileNavLabel: 'Mobiele navigatie', language: 'Taal',
    directions: 'Route', call: 'Bellen', openMenu: 'Menu openen', closeMenu: 'Menu sluiten', menu: 'Menu',
    whereWeAre: 'Waar we zitten', contact: 'Contact', backHome: 'Terug naar home', backTop: 'Terug naar boven',
    legalNav: 'Juridische informatie', quickActions: 'Snelle acties', legal: 'Juridische informatie', privacy: 'Privacy', cookies: 'Cookies',
    proposal: 'Ontwerpvoorstel website · oktober 2026', close: 'Sluiten', ok: 'Oké', onInstagram: 'op Instagram',
    notices: {
      legal: ['Juridische informatie', 'Dit is een demo. De gegevens van de eigenaar en de juridische informatie worden toegevoegd voordat de website live gaat.'],
      privacy: ['Privacy', 'Deze demo heeft geen formulieren en geen analytics. Het volledige privacybeleid volgt zodra de gegevens van de eigenaar bevestigd zijn. Externe links en de kaart, als je die laadt, leiden naar diensten van derden.'],
      cookies: ['Cookies', 'Deze demo gebruikt geen eigen cookies en geen analytics. Google Maps maakt pas verbinding als je op ‘Kaart laden’ tikt en kan eigen technologieën en beleid toepassen. De definitieve cookietekst wordt voor de lancering nagekeken.'],
    },
    video: { label: 'Rondgang zonder geluid langs de bar en het grote raam van Calma Café', play: 'Video van het café afspelen', playShort: 'Bekijk het café' },
    home: {
      title: 'Calma Café · Brunch en koffie in Maspalomas',
      description: 'Brunch, Lavazza-koffie, matcha en veganistische gerechten aan de Avenida de Tirajana, Maspalomas. Volledige menukaart met prijzen en allergenen.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch en koffie<br />in <em>Maspalomas.</em>',
      intro: 'Granola, pancakes, toast en de Calma Special op een triassant. Lavazza-koffie, matcha en ube latte. Aan de Avenida de Tirajana, met tafels binnen en buiten.',
      seeMenu: 'Bekijk de menukaart', pancakesAlt: 'Pancakes van Calma Café met verschillende toppings',
      strip: ['Brunch', 'Lavazza-koffie', 'Matcha en ube', 'Veganistisch en vegetarisch'],
      doorsTitle: 'De menukaart, het café en <em>de route.</em>',
      doors: {
        carta: ['Menukaart', '{n} gerechten en drankjes met prijzen en allergenen, ook vegetarisch en veganistisch.', 'Bekijk de menukaart'],
        calma: ['Over ons', 'Wie we zijn, ons krijtbord en het café vanbinnen.', 'Leer ons kennen'],
        visit: ['Bezoek', '{calle}, Maspalomas. Telefoon, WhatsApp en kaart.', 'Route'],
      },
      drinksEyebrow: 'Om te drinken', drinksTitle: 'Koffie of <em>matcha?</em>',
      drinksIntro: 'Lavazza-koffie, Japanse matcha en ube, een paarse zoete aardappel uit de Filipijnen die naar vanille smaakt.',
      coffee: 'Koffie', matcha: 'Matcha en ube', chooseDrink: 'Kies je drankje', allDrinks: 'Alle drankjes',
      tables: 'Tafels binnen en buiten.', callNumber: 'Bel {tel}', reviews: 'Reviews op Google',
    },
    carta: {
      title: 'Menukaart · Calma Café, Maspalomas',
      description: 'De volledige menukaart van Calma Café in Maspalomas: brunch, toast, wraps, salades, huisgemaakt gebak, vegetarische en veganistische gerechten, koffie, matcha en ube.',
      eyebrow: n => `Volledige menukaart · ${n} gerechten en drankjes`, h1: 'Brunch, koffie en <em>iets zoets.</em>',
      aside: 'Prijzen, extra’s en allergenen van elk gerecht, zoals op de kaart in het café. Tik op een gerecht om de foto te zien.',
      tabs: 'Kaarten', sections: menu => `Onderdelen: ${menu}`,
      intros: {
        carta: 'Zoete of hartige brunch, toast, wraps, salades en iets zoets als afsluiter.',
        vegetariano: 'Zonder vlees of vis.', vegano: 'Zonder dierlijke ingrediënten.',
        bebidas: 'Lavazza-koffie, matcha, ube, smoothies, sappen, mimosa’s en Aperol Spritz.',
      },
      dish: n => `${n} ${n === 1 ? 'gerecht' : 'gerechten'}`, drink: n => `${n} ${n === 1 ? 'drankje' : 'drankjes'}`, photo: 'bekijk foto',
      vegan: 'Veganistisch', vegetarian: 'Vegetarisch', choose: 'Keuze uit', add: 'Extra', allergens: 'Allergenen',
      allergyTitle: 'Allergieën of intoleranties?',
      allergyText: 'Laat het ons team weten voordat je bestelt. De allergenen die je ziet, staan op de digitale menukaart van het café; staat er bij een gerecht niets, vraag het ons dan.',
      checked: date => `Menukaart geraadpleegd op ${date}`, source: 'Digitale menukaart van Calma',
      translated: 'Vertaald uit de Spaanse menukaart van het café. Prijzen en allergenen zijn gelijk aan het origineel.',
    },
    calma: {
      title: 'Over ons · Calma Café, Maspalomas',
      description: 'Calma Café is het café van een Noors-Nederlands stel aan de Avenida de Tirajana in Maspalomas: brunch, koffie en huisgemaakt gebak in een café vol planten en schilderijen.',
      h1: 'Van Noorwegen en Nederland<br />naar <em>Maspalomas.</em>',
      intro: 'Calma is het café van een Noors-Nederlands stel aan de Avenida de Tirajana 3. We serveren brunch, koffie en huisgemaakt gebak, tussen planten, mosterdgele kussens en schilderijen aan de muur.',
      chalkEyebrow: 'Ons krijtbord', otherBoard: 'Het andere krijtbord.',
      detailsEyebrow: 'Het café', detailsTitle: 'Een kijkje <em>binnen.</em>',
      detailsText: 'Mosterdgele kussens, een wandkleed van kopjes, lampjes boven de houten bar<br />en een groot raam met uitzicht op palmbomen.',
      captions: ['Het raam', 'De kussens', 'Het prikbord', 'De bar', 'Het wandkleed van kopjes', 'De schilderijen', 'De lampjes', 'Een tafeltje bij het prikbord'],
      instagram: 'Meer foto’s van het café en het eten op Instagram.',
      story: {
        eyebrow: 'Ons verhaal', title: 'Het begon allemaal met <em>een droom.</em>',
        lead: 'Zo’n vijftien jaar lang droomde Guro van een eigen café. Calma is wat er gebeurde toen de juiste plek eindelijk gevonden was.',
        dream: { label: 'De droom', title: 'Een droom van vijftien jaar opent zijn deuren', text: 'Guro had in Noorwegen in cafés en keukens gewerkt en vestigde zich daarna op Gran Canaria. Het zoeken naar de juiste ruimte duurde jaren, en op 6 september 2019 ging Calma open in Maspalomas.', caption: 'De dag dat we opengingen.' },
        name: { label: 'De naam', title: 'Uit ‘Alma’ ontstond ‘Calma’', text: 'Guro zocht een woord met ziel (‘alma’ in het Spaans), en eerst zou het project Alma Café heten. Tijdens het werk aan het logo dook ‘Calma’ op, en dat paste nog beter bij alles wat Guro wilde uitstralen.', caption: 'Het heette bijna Alma Café.', replay: 'Animatie opnieuw afspelen' },
      },
    },
    visit: {
      title: 'Bezoek · Calma Café, Maspalomas',
      description: 'Calma Café zit aan de Avda. de Tirajana 3 (Apartamentos Aloe), Maspalomas. Telefoon +34 681 66 79 17, WhatsApp en routebeschrijving.',
      eyebrow: 'Bezoek', h1: 'Waar je ons <em>vindt.</em>',
      intro: 'We hebben tafels binnen en buiten. Heb je vooraf een vraag? Bel ons of stuur een WhatsApp.',
      address: 'Adres', hours: 'Openingstijden', hoursLink: 'Bekijk ons Google Maps-profiel', hoursView: 'Openingstijden', contact: 'Contact',
      loadMap: 'Kaart laden', mapNote: 'Als je de kaart laadt, maak je verbinding met Google Maps.', mapCaption: 'Illustratie · de kaart van Google laadt alleen als je dat wilt.',
      mapTitle: 'Calma Café op Google Maps', mapFallback: 'Verschijnt de kaart niet? Gebruik dan de knop ‘Route’.',
    },
    notFound: { title: 'Pagina niet gevonden', h1: 'Deze pagina staat niet <em>op de kaart.</em>', intro: 'Misschien is de link verkeerd getypt of bestaat de pagina niet meer. Vanaf hier kun je terug naar home, de menukaart bekijken of zien hoe je ons vindt.' },
  },
};

// Fuera de la versión española, el teléfono se muestra con el prefijo internacional.
export const phone = (lang: Lang, texto: string) => (lang === 'es' ? texto : `+34 ${texto}`);
