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
  skip: string; ogImageAlt: string; homeLabel: string; nav: Record<Page, string>; navLabel: string; mobileNavLabel: string;
  language: string; directions: string; call: string; openMenu: string; closeMenu: string; menu: string;
  thanks: [string, string];
  whereWeAre: string; contact: string; backHome: string; backTop: string; legalNav: string; quickActions: string;
  legal: string; privacy: string; cookies: string; proposal: string; close: string; ok: string; onInstagram: string;
  notices: { legal: Notice; privacy: Notice; cookies: Notice };
  video: { label: string; play: string; playShort: string };
  /** Aviso para quien tiene el móvil en este idioma y está viendo la web en otro: «Also in English» */
  alsoIn: string;
  home: {
    title: string; description: string; place: string; h1: string; intro: string; seeMenu: string; pancakesAlt: string;
    /** Cinta de Inicio: datos útiles; el primero lleva el horario de cocina */
    strip: (from: string, to: string) => string[];
    /** «El local»: título, entradilla corta y enlace a la historia (las fotos y su texto salen de calma) */
    local: { eyebrow: string; title: string; text: string; link: string };
    drinksEyebrow: string; drinksTitle: string; drinksIntro: string; coffee: string; matcha: string; chooseDrink: string; drinksHint: string; allDrinks: string;
    wallEyebrow: string; wallNote: string; boardTitle: string; boardSub: string; boardLink: string; boardNote: string;
    tables: string; callNumber: string; reviews: string; rating: (nota: string) => string; reviewsCount: (n: number) => string; reviewsOnGoogle: (n: number) => string;
  };
  carta: {
    title: string; description: string; eyebrow: (n: number) => string; h1: string; aside: string; tabs: string; sections: (menu: string) => string;
    intros: Record<string, string>; groupIntros: Record<string, string>; allTab: string; seeIn: (grupo: string) => string; dish: (n: number) => string; drink: (n: number) => string; photo: string;
    vegan: string; vegetarian: string; choose: string; add: string; allergens: string;
    allergyTitle: string; allergyText: string; checked: (date: string) => string; source: string; translated?: string;
    /** Cierre de la página: título y horario de cocina (desde, hasta, día de cierre) */
    close: { title: string; text: (from: string, to: string, closed: string) => string };
  };
  calma: {
    title: string; description: string; h1: string; intro: string; chalkEyebrow: string; otherBoard: string;
    detailsEyebrow: string; detailsTitle: string; detailsText: string; captions: string[]; instagram: string;
    /** Cierre de la página: título y horario (desde, hasta, día de cierre) */
    close: { title: string; text: (from: string, to: string, closed: string) => string };
    gallery: { label: string; hint: string; previous: string; next: string; item: string };
    story: {
      eyebrow: string; title: string; lead: string;
      craft: { label: string; title: string; text: string; caption: string };
      search: { label: string; title: string; text: string; caption: string };
      name: { label: string; title: string; text: string; caption: string; replay: string };
      opening: { label: string; title: string; text: string; caption: string };
      today: { label: string; title: string; text: string; caption: string };
    };
  };
  visit: {
    title: string; description: string; eyebrow: string; h1: string; intro: string; address: string; hours: string; hoursLink: string; hoursView: string;
    contact: string; faqTitle: string; faq: [question: string, answer: string][]; loadMap: string; mapNote: string; mapCaption: string; mapTitle: string; mapFallback: string;
  };  notFound: { title: string; h1: string; intro: string };
}

export const ui: Record<Lang, UI> = {
  es: {
    skip: 'Saltar al contenido', ogImageAlt: 'Calma Café: la barra de madera con plantas y bombillas, y el logo de Calma', homeLabel: 'Calma Café, inicio',
    nav: { inicio: 'Inicio', carta: 'Carta', calma: 'Nosotros', visitanos: 'Visítanos' },
    navLabel: 'Navegación principal', mobileNavLabel: 'Navegación móvil', language: 'Idioma',
    directions: 'Cómo llegar', call: 'Llamar', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', menu: 'Menú',
    thanks: ['Gracias por pasarte.', 'Vuelve pronto.'],
    whereWeAre: 'Dónde estamos', contact: 'Contacto', backHome: 'Volver al inicio', backTop: 'Volver arriba',
    legalNav: 'Información legal', quickActions: 'Acciones rápidas', legal: 'Aviso legal', privacy: 'Privacidad', cookies: 'Cookies',
    proposal: 'Diseño web y SEO por', close: 'Cerrar', ok: 'Entendido', onInstagram: 'en Instagram',
    notices: {
      legal: ['Aviso legal', 'Esta es una demo. Los datos del titular y el aviso legal se incorporarán antes de publicar la web.'],
      privacy: ['Privacidad', 'Esta demo no contiene formularios ni analítica. La política de privacidad completa se incorporará cuando se confirmen los datos del titular. Los enlaces externos y el mapa cargado voluntariamente llevan a servicios de terceros.'],
      cookies: ['Cookies', 'Esta demo no utiliza cookies propias ni analítica. Google Maps solo se conecta cuando pulsas «Cargar mapa» y puede aplicar sus propias tecnologías y políticas. El texto definitivo de cookies se revisará antes de publicar.'],
    },
    video: { label: 'Recorrido sin sonido por la barra y el ventanal de Calma Café', play: 'Reproducir vídeo del local', playShort: 'Ver el local' },
    alsoIn: 'También en español',
    home: {
      title: 'Calma Café · Brunch y café en Maspalomas',
      description: 'Brunch dulce y salado, café Lavazza y matcha en la avenida de Tirajana, en Maspalomas. Mira la carta completa con precios y alérgenos.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch y café <br />en <em>Maspalomas.</em>',
      intro: 'Pancakes, tostas y brunch salado, con café Lavazza o un matcha. Te esperamos entre plantas, en la avenida de Tirajana.',
      seeMenu: 'Ver la carta', pancakesAlt: 'Pancakes de Calma Café con distintos acompañamientos',
      strip: (from, to) => [`Brunch de ${from} a ${to}`, 'Café Lavazza', 'Matcha y ube', 'Carta vegana', 'Mesas dentro y fuera'],
      local: { eyebrow: 'El local', title: 'Un local lleno de <em>plantas.</em>', text: 'Guro le dio vueltas unos quince años antes de abrirlo, en 2019.', link: 'Cómo empezó Calma' },
      drinksEyebrow: 'Para beber', drinksTitle: '¿Café o <em>matcha?</em>',
      drinksIntro: 'El café es Lavazza y el matcha, japonés. ¿Y el ube? Una batata morada de Filipinas que sabe un poco a vainilla. Pídelo en latte, frío o caliente.',
      coffee: 'Café', matcha: 'Matcha y ube', chooseDrink: 'Elige tu bebida', drinksHint: 'Elige el tuyo', allDrinks: 'Ver todas las bebidas',
      wallEyebrow: 'Escrito en nuestra pared', wallNote: 'Está escrita a tiza al lado de la mesa redonda.', boardTitle: 'Si es tu primera vez', boardSub: 'empieza por aquí', boardLink: 'Ver la carta entera', boardNote: 'en triassant, entre croissant y pan de cereales',
      tables: 'Hay mesas dentro y fuera.', callNumber: 'Llamar al {tel}', reviews: 'Leer las reseñas', rating: nota => `${nota} en Google`, reviewsCount: n => `más de ${n} reseñas`, reviewsOnGoogle: n => `Más de ${n} reseñas en Google`,
    },
    carta: {
      title: 'La carta · Calma Café, Maspalomas',
      description: 'La carta completa de Calma Café en Maspalomas: brunch, tostas, fajitas, ensaladas, dulces caseros, opciones vegetarianas y veganas, café, matcha y ube.',
      eyebrow: n => `Carta completa · ${n} platos y bebidas`, h1: 'Brunch, café y <em>algo dulce.</em>',
      aside: 'Con precios, extras y alérgenos. Los platos con foto se abren al tocarlos.',
      tabs: 'Menús de la carta', sections: menu => `Secciones: ${menu}`,
      intros: {
        carta: 'Brunch dulce o salado, tostas, fajitas, ensaladas y algo dulce para el final.',
        vegetariano: 'Sin carne ni pescado.', vegano: 'Sin ingredientes de origen animal.',
        bebidas: 'Café Lavazza, matcha, ube, smoothies y zumos. También mimosas y Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'Para los peques: sándwiches, gofres, tostas y yogur con fruta.' }, allTab: 'Todo', seeIn: grupo => `en ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'plato' : 'platos'}`, drink: n => `${n} ${n === 1 ? 'bebida' : 'bebidas'}`, photo: 'ver foto',
      vegan: 'Vegano', vegetarian: 'Vegetariano', choose: 'A elegir', add: 'Añade', allergens: 'Alérgenos',
      allergyTitle: '¿Alergias o intolerancias?',
      allergyText: 'Dínoslo antes de pedir. Los alérgenos vienen de nuestra carta digital y, donde faltaban, los hemos sacado de los ingredientes. Si un plato no muestra ninguno, pregúntanos igualmente.',
      checked: date => `Carta consultada el ${date}`, source: 'Carta digital de Calma',
      close: { title: '¿Ya sabes qué <em>vas a pedir?</em>', text: (from, to, closed) => `Cocina de ${from} a ${to}, todos los días menos el ${closed}.` },
    },
    calma: {
      title: 'Quiénes somos · Calma Café, Maspalomas',
      description: 'Calma es el café de una pareja noruega y neerlandesa en la avenida de Tirajana, en Maspalomas. Brunch, café y dulces caseros entre plantas y cuadros.',
      h1: 'De Noruega y los Países Bajos <br />a <em>Maspalomas.</em>',
      intro: 'Somos una pareja noruega y neerlandesa. Calma es nuestro café de la avenida de Tirajana: hacemos brunch, café y dulces caseros, y los servimos entre plantas, cojines mostaza y cuadros.',
      chalkEyebrow: 'La pizarra del local', otherBoard: 'Y en la otra pizarra: «A yawn is a silent scream for coffee».',
      detailsEyebrow: 'El local', detailsTitle: 'Por <em>dentro.</em>',
      detailsText: 'Hay cojines mostaza, un tapiz hecho de tazas y bombillas colgando sobre la barra de madera. <br />Y un ventanal que da a las palmeras.',
      captions: ['El ventanal', 'Los cojines', 'El tablero de notas', 'Las láminas de la pared', 'El tapiz de tazas', 'Los cuadros', 'Las bombillas', 'Una mesa junto al tablero'],
      instagram: 'Subimos más fotos del local y de la comida a Instagram.',
      close: { title: 'Ven a <em>conocernos.</em>', text: (from, to, closed) => `Abrimos de ${from} a ${to}, todos los días menos el ${closed}.` },
      gallery: { label: 'Fotos del local', hint: 'Arrastra el hilo o usa las flechas.', previous: 'Foto anterior', next: 'Foto siguiente', item: 'Foto {n} de {total}' },
      story: {
        eyebrow: 'Nuestra historia', title: 'Quince años <em>pensándolo.</em>',
        lead: 'Guro estuvo unos quince años imaginando su propia cafetería. Cuando por fin encontró el sitio, abrió Calma.',
        craft: { label: 'Noruega', title: 'Entre cafeterías y cocinas', text: 'Antes de venirse a Gran Canaria, Guro trabajó en cafeterías y cocinas de Noruega. Ya entonces tenía claro que quería un café propio.', caption: 'Años de cocina en cada plato.' },
        search: { label: 'Gran Canaria', title: 'Años buscando el local', text: 'Aquí tardó años en dar con el local. Hasta que apareció este, en la avenida de Tirajana, 3.', caption: 'Y al final, este ventanal.' },
        name: { label: 'El nombre', title: 'Una C delante de «Alma»', text: 'Al principio iba a llamarse Alma Café. Mientras se dibujaba el logo salió «Calma», con una C delante, y se quedó. Al fin y al cabo, eso es lo que Guro quería que se sintiera dentro.', caption: 'Casi se llamó Alma Café.', replay: 'Ver la animación otra vez' },
        opening: { label: '2019', title: 'Abrimos las puertas', text: 'El 6 de septiembre de 2019 abrimos la puerta por primera vez.', caption: 'El día que abrimos.' },
        today: { label: 'Hoy', title: 'Brunch, café y plantas', text: 'Seguimos en el mismo sitio, con el brunch, el café y los dulces de siempre. Más abajo tienes el local, foto a foto.', caption: 'La barra, hoy.' },
      },
    },
    visit: {
      title: 'Dónde estamos y horario · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café está en la Avda. de Tirajana, 3 (Apartamentos Aloe), Maspalomas. Teléfono 681 66 79 17, WhatsApp y cómo llegar.',
      eyebrow: 'Visítanos', h1: 'Dónde <em>estamos.</em>',
      intro: 'Hay mesas dentro y fuera. ¿Alguna duda antes de venir? Llámanos o escríbenos por WhatsApp.',
      address: 'Dirección', hours: 'Horario', hoursLink: 'Ver la ficha en Google Maps', hoursView: 'Ver horario', contact: 'Contacto', faqTitle: 'Preguntas frecuentes',
      faq: [
        ['¿Qué horario tenéis?', '{horario}'],
        ['¿Tenéis opciones veganas o vegetarianas?', 'Sí, y no son dos platos sueltos: hay un menú vegetariano y otro vegano completos, con precios y alérgenos.'],
        ['¿Hay menú para niños?', 'Sí. En la carta hay una sección para niños con sándwiches, gofres, tostas y yogur con fruta.'],
        ['¿Dónde estáis?', 'En la Avda. de Tirajana, 3, en los Apartamentos Aloe, 35100 Maspalomas (San Bartolomé de Tirajana).'],
      ],
      loadMap: 'Cargar mapa', mapNote: 'Al cargarlo conectarás con Google Maps.', mapCaption: 'Es un dibujo: el mapa de Google solo se carga si lo pides.',
      mapTitle: 'Calma Café en Google Maps', mapFallback: 'Si el mapa no aparece, usa el botón «Cómo llegar».',
    },
    notFound: { title: 'Página no encontrada', h1: 'Esta página no está <em>en la carta.</em>', intro: 'Puede que el enlace esté mal escrito o que la página ya no exista. Vuelve al inicio, echa un vistazo a la carta o mira cómo llegar.' },
  },
  en: {
    skip: 'Skip to content', ogImageAlt: 'Calma Café: the wooden counter with plants and light bulbs, and the Calma logo', homeLabel: 'Calma Café, home',
    nav: { inicio: 'Home', carta: 'Menu', calma: 'About', visitanos: 'Visit us' },
    navLabel: 'Main navigation', mobileNavLabel: 'Mobile navigation', language: 'Language',
    directions: 'Directions', call: 'Call', openMenu: 'Open menu', closeMenu: 'Close menu', menu: 'Menu',
    thanks: ['Thanks for stopping by.', 'Come back soon.'],
    whereWeAre: 'Find us', contact: 'Contact', backHome: 'Back to home', backTop: 'Back to top',
    legalNav: 'Legal information', quickActions: 'Quick actions', legal: 'Legal notice', privacy: 'Privacy', cookies: 'Cookies',
    proposal: 'Web design and SEO by', close: 'Close', ok: 'OK', onInstagram: 'on Instagram',
    notices: {
      legal: ['Legal notice', 'This is a demo. The owner’s details and the legal notice will be added before the website goes live.'],
      privacy: ['Privacy', 'This demo has no forms and no analytics. The full privacy policy will be added once the owner’s details are confirmed. External links and the map, if you choose to load it, lead to third-party services.'],
      cookies: ['Cookies', 'This demo uses no cookies of its own and no analytics. Google Maps only connects when you press “Load map”, and it may apply its own technologies and policies. The final cookie text will be reviewed before launch.'],
    },
    video: { label: 'Silent walk past the counter and the big window at Calma Café', play: 'Play video of the café', playShort: 'See the café' },
    alsoIn: 'Also in English',
    home: {
      title: 'Calma Café · Brunch and coffee in Maspalomas',
      description: 'Sweet and savoury brunch, Lavazza coffee and matcha on Avenida de Tirajana, Maspalomas. See the full menu with prices and allergens.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch and coffee <br />in <em>Maspalomas.</em>',
      intro: 'Pancakes, toasts and savoury brunch, with Lavazza coffee or a matcha. Come and find us among the plants on Avenida de Tirajana.',
      seeMenu: 'See the menu', pancakesAlt: 'Calma Café pancakes with different toppings',
      strip: (from, to) => [`Brunch ${from}–${to}`, 'Lavazza coffee', 'Matcha and ube', 'Vegan menu', 'Tables inside and out'],
      local: { eyebrow: 'The café', title: 'A café full of <em>plants.</em>', text: 'Guro had been dreaming about it for some fifteen years before opening it in 2019.', link: 'How Calma started' },
      drinksEyebrow: 'To drink', drinksTitle: 'Coffee or <em>matcha?</em>',
      drinksIntro: 'The coffee is Lavazza and the matcha is Japanese. And ube? A purple sweet potato from the Philippines that tastes a little like vanilla. Try it as a latte, hot or iced.',
      coffee: 'Coffee', matcha: 'Matcha and ube', chooseDrink: 'Choose your drink', drinksHint: 'Pick yours', allDrinks: 'See all drinks',
      wallEyebrow: 'Written on our wall', wallNote: 'It’s chalked on the wall next to the round table.', boardTitle: 'First time here?', boardSub: 'start here', boardLink: 'See the whole menu', boardNote: 'on a triassant, a cross between croissant and multigrain bread',
      tables: 'Tables inside and out.', callNumber: 'Call {tel}', reviews: 'Read the reviews', rating: nota => `${nota} on Google`, reviewsCount: n => `${n}+ reviews`, reviewsOnGoogle: n => `${n}+ reviews on Google`,
    },
    carta: {
      title: 'Menu · Calma Café, Maspalomas',
      description: 'The full Calma Café menu in Maspalomas: brunch, toasts, wraps, salads, homemade cakes, vegetarian and vegan options, coffee, matcha and ube.',
      eyebrow: n => `Full menu · ${n} dishes and drinks`, h1: 'Brunch, coffee and <em>something sweet.</em>',
      aside: 'With prices, extras and allergens. Dishes with a photo open when you tap them.',
      tabs: 'Menus', sections: menu => `Sections: ${menu}`,
      intros: {
        carta: 'Sweet or savoury brunch, toasts, wraps, salads and something sweet to finish.',
        vegetariano: 'No meat or fish.', vegano: 'No animal products.',
        bebidas: 'Lavazza coffee, matcha, ube, smoothies and juices. Mimosas and Aperol Spritz too.',
      },
      groupIntros: { 'carta-para-los-ninos': 'For little ones: sandwiches, waffles, toasts and yoghurt with fruit.' }, allTab: 'All', seeIn: grupo => `in ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'dish' : 'dishes'}`, drink: n => `${n} ${n === 1 ? 'drink' : 'drinks'}`, photo: 'see photo',
      vegan: 'Vegan', vegetarian: 'Vegetarian', choose: 'Choose', add: 'Add', allergens: 'Allergens',
      allergyTitle: 'Allergies or intolerances?',
      allergyText: 'Tell us before you order. The allergens come from our digital menu, and where some were missing we’ve worked them out from the ingredients. If a dish shows none, please ask anyway.',
      checked: date => `Menu checked on ${date}`, source: 'Calma’s digital menu',
      close: { title: 'Know what <em>you’re having?</em>', text: (from, to, closed) => `Kitchen open ${from}–${to}, every day except ${closed}.` },
      translated: 'Translated from the café’s Spanish menu. Prices and allergens are the same as in the original.',
    },
    calma: {
      title: 'About us · Calma Café, Maspalomas',
      description: 'Calma is a café run by a Norwegian and Dutch couple on Avenida de Tirajana, Maspalomas. Brunch, coffee and homemade cakes among plants and paintings.',
      h1: 'From Norway and the Netherlands <br />to <em>Maspalomas.</em>',
      intro: 'We’re a Norwegian and Dutch couple. Calma is our café on Avenida de Tirajana: we make brunch, coffee and homemade cakes, and serve them among plants, mustard cushions and paintings.',
      chalkEyebrow: 'Our chalkboard', otherBoard: 'And on the other chalkboard: “A yawn is a silent scream for coffee”.',
      detailsEyebrow: 'The café', detailsTitle: 'Take a look <em>inside.</em>',
      detailsText: 'There are mustard cushions, a wall hanging made of cups and light bulbs hanging over the wooden counter. <br />And a big window looking out onto palm trees.',
      captions: ['The window', 'The cushions', 'The noticeboard', 'The prints on the wall', 'The cup wall hanging', 'The paintings', 'The light bulbs', 'A table by the noticeboard'],
      instagram: 'We post more photos of the café and the food on Instagram.',
      close: { title: 'Come and <em>say hello.</em>', text: (from, to, closed) => `Open ${from}–${to}, every day except ${closed}.` },
      gallery: { label: 'Photos of the café', hint: 'Drag the string or use the arrows.', previous: 'Previous photo', next: 'Next photo', item: 'Photo {n} of {total}' },
      story: {
        eyebrow: 'Our story', title: 'Fifteen years <em>in the making.</em>',
        lead: 'Guro spent about fifteen years imagining a café. When the right place finally came along, Calma opened.',
        craft: { label: 'Norway', title: 'Cafés and kitchens', text: 'Before moving to Gran Canaria, Guro worked in cafés and kitchens in Norway. Even then, the plan was a café of Guro’s own.', caption: 'Years of kitchen work on every plate.' },
        search: { label: 'Gran Canaria', title: 'Years looking for the right place', text: 'Here it took years to find the right spot. Then this one came up, at Avenida de Tirajana, 3.', caption: 'And in the end, this window.' },
        name: { label: 'The name', title: 'A C in front of “Alma”', text: 'At first it was going to be called Alma Café (alma means soul in Spanish). While the logo was being drawn, “Calma” appeared, with a C in front, and it stuck. After all, calm is what Guro wanted people to feel inside.', caption: 'It was almost called Alma Café.', replay: 'Play the animation again' },
        opening: { label: '2019', title: 'Opening day', text: 'On 6 September 2019 we opened the door for the first time.', caption: 'The day we opened.' },
        today: { label: 'Today', title: 'Brunch, coffee and plants', text: 'We’re still in the same spot, with the same brunch, coffee and homemade cakes. Scroll down to see the café, photo by photo.', caption: 'The counter today.' },
      },
    },
    visit: {
      title: 'Location and opening hours · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café is at Avda. de Tirajana, 3 (Apartamentos Aloe), Maspalomas. Phone +34 681 66 79 17, WhatsApp and directions.',
      eyebrow: 'Visit us', h1: 'Where <em>to find us.</em>',
      intro: 'There are tables inside and out. Any questions before you come? Give us a call or send us a WhatsApp.',
      address: 'Address', hours: 'Opening hours', hoursLink: 'See our Google Maps listing', hoursView: 'See hours', contact: 'Contact', faqTitle: 'Frequently asked questions',
      faq: [
        ['What are your opening hours?', '{horario}'],
        ['Do you have vegan or vegetarian options?', 'Yes, and not just a couple of dishes: there’s a full vegetarian menu and a full vegan one, with prices and allergens.'],
        ['Do you have a kids’ menu?', 'Yes. The menu has a kids’ section with sandwiches, waffles, toasts and yoghurt with fruit.'],
        ['Where are you?', 'At Avda. de Tirajana, 3, in the Aloe apartments, 35100 Maspalomas (San Bartolomé de Tirajana).'],
      ],
      loadMap: 'Load map', mapNote: 'Loading it connects you to Google Maps.', mapCaption: 'It’s a drawing: the Google map only loads if you ask for it.',
      mapTitle: 'Calma Café on Google Maps', mapFallback: 'If the map does not appear, use the “Directions” button.',
    },
    notFound: { title: 'Page not found', h1: 'This page is not <em>on the menu.</em>', intro: 'The link may be mistyped, or the page may no longer exist. Head back home, have a look at the menu or see how to find us.' },
  },
  de: {
    skip: 'Zum Inhalt springen', ogImageAlt: 'Calma Café: die Holztheke mit Pflanzen und Glühbirnen und das Calma-Logo', homeLabel: 'Calma Café, Startseite',
    nav: { inicio: 'Start', carta: 'Speisekarte', calma: 'Über uns', visitanos: 'Anfahrt' },
    navLabel: 'Hauptnavigation', mobileNavLabel: 'Mobile Navigation', language: 'Sprache',
    directions: 'Route', call: 'Anrufen', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', menu: 'Menü',
    thanks: ['Danke für deinen Besuch.', 'Komm bald wieder.'],
    whereWeAre: 'So findest du uns', contact: 'Kontakt', backHome: 'Zur Startseite', backTop: 'Nach oben',
    legalNav: 'Rechtliche Hinweise', quickActions: 'Schnellzugriff', legal: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies',
    proposal: 'Webdesign und SEO von', close: 'Schließen', ok: 'Verstanden', onInstagram: 'auf Instagram',
    notices: {
      legal: ['Impressum', 'Dies ist eine Demo. Die Angaben zum Inhaber und das Impressum werden vor der Veröffentlichung ergänzt.'],
      privacy: ['Datenschutz', 'Diese Demo enthält keine Formulare und keine Analyse-Tools. Die vollständige Datenschutzerklärung folgt, sobald die Angaben zum Inhaber bestätigt sind. Externe Links und die Karte, wenn du sie lädst, führen zu Diensten Dritter.'],
      cookies: ['Cookies', 'Diese Demo verwendet keine eigenen Cookies und keine Analyse-Tools. Google Maps wird erst verbunden, wenn du auf „Karte laden“ tippst, und kann eigene Technologien und Richtlinien anwenden. Der endgültige Cookie-Text wird vor dem Start geprüft.'],
    },
    video: { label: 'Stummer Rundgang entlang der Theke bis zum großen Fenster von Calma Café', play: 'Video vom Café abspielen', playShort: 'Café ansehen' },
    alsoIn: 'Auch auf Deutsch',
    home: {
      title: 'Calma Café · Brunch und Kaffee in Maspalomas',
      description: 'Süßer und herzhafter Brunch, Lavazza-Kaffee und Matcha an der Avenida de Tirajana in Maspalomas. Die ganze Speisekarte mit Preisen und Allergenen.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch und Kaffee <br />in <em>Maspalomas.</em>',
      intro: 'Pancakes, Toasts und herzhafter Brunch, dazu Lavazza-Kaffee oder Matcha. Du findest uns zwischen Pflanzen an der Avenida de Tirajana.',
      seeMenu: 'Zur Speisekarte', pancakesAlt: 'Pancakes von Calma Café mit verschiedenen Toppings',
      strip: (from, to) => [`Brunch von ${from} bis ${to} Uhr`, 'Lavazza-Kaffee', 'Matcha und Ube', 'Vegane Karte', 'Tische drinnen und draußen'],
      local: { eyebrow: 'Das Café', title: 'Ein Café voller <em>Pflanzen.</em>', text: 'Rund fünfzehn Jahre hat Guro davon geträumt, 2019 ging es dann los.', link: 'Wie alles anfing' },
      drinksEyebrow: 'Zum Trinken', drinksTitle: 'Kaffee oder <em>Matcha?</em>',
      drinksIntro: 'Der Kaffee ist von Lavazza, der Matcha aus Japan. Und Ube? Eine violette Süßkartoffel von den Philippinen, die ein bisschen nach Vanille schmeckt. Probier sie als Latte, heiß oder auf Eis.',
      coffee: 'Kaffee', matcha: 'Matcha und Ube', chooseDrink: 'Wähle dein Getränk', drinksHint: 'Wähl deins', allDrinks: 'Alle Getränke ansehen',
      wallEyebrow: 'An unserer Wand', wallNote: 'Mit Kreide an die Wand geschrieben, gleich neben dem runden Tisch.', boardTitle: 'Zum ersten Mal hier?', boardSub: 'fang hier an', boardLink: 'Zur ganzen Karte', boardNote: 'im Triassant, aus Croissant und Mehrkornbrot',
      tables: 'Tische drinnen und draußen.', callNumber: '{tel} anrufen', reviews: 'Bewertungen lesen', rating: nota => `${nota} auf Google`, reviewsCount: n => `über ${n} Bewertungen`, reviewsOnGoogle: n => `Über ${n} Bewertungen auf Google`,
    },
    carta: {
      title: 'Speisekarte · Calma Café, Maspalomas',
      description: 'Die komplette Speisekarte von Calma Café in Maspalomas: Brunch, Toasts, Wraps, Salate, hausgemachter Kuchen, vegetarische und vegane Gerichte, Kaffee, Matcha und Ube.',
      eyebrow: n => `Komplette Speisekarte · ${n} Gerichte und Getränke`, h1: 'Brunch, Kaffee und <em>etwas Süßes.</em>',
      aside: 'Mit Preisen, Extras und Allergenen. Gerichte mit Foto öffnen sich beim Antippen.',
      tabs: 'Karten', sections: menu => `Bereiche: ${menu}`,
      intros: {
        carta: 'Süßer oder herzhafter Brunch, Toasts, Wraps, Salate und etwas Süßes zum Schluss.',
        vegetariano: 'Ohne Fleisch und Fisch.', vegano: 'Ohne tierische Zutaten.',
        bebidas: 'Lavazza-Kaffee, Matcha, Ube, Smoothies und Säfte. Dazu Mimosas und Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'Für die Kleinen: Sandwiches, Waffeln, Toasts und Joghurt mit Obst.' }, allTab: 'Alles', seeIn: grupo => `unter ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'Gericht' : 'Gerichte'}`, drink: n => `${n} ${n === 1 ? 'Getränk' : 'Getränke'}`, photo: 'Foto ansehen',
      vegan: 'Vegan', vegetarian: 'Vegetarisch', choose: 'Zur Auswahl', add: 'Extra', allergens: 'Allergene',
      allergyTitle: 'Allergien oder Unverträglichkeiten?',
      allergyText: 'Sag uns bitte vor dem Bestellen Bescheid. Die Allergene stammen aus unserer digitalen Speisekarte; wo welche fehlten, haben wir sie aus den Zutaten ergänzt. Steht bei einem Gericht nichts, frag trotzdem nach.',
      checked: date => `Speisekarte abgerufen am ${date}`, source: 'Digitale Speisekarte von Calma',
      close: { title: 'Schon <em>ausgesucht?</em>', text: (from, to, closed) => `Küche von ${from} bis ${to} Uhr, täglich außer ${closed}.` },
      translated: 'Übersetzt aus der spanischen Speisekarte des Cafés. Preise und Allergene entsprechen dem Original.',
    },
    calma: {
      title: 'Über uns · Calma Café, Maspalomas',
      description: 'Calma ist das Café eines norwegisch-niederländischen Paars an der Avenida de Tirajana in Maspalomas. Brunch, Kaffee und hausgemachter Kuchen zwischen Pflanzen und Bildern.',
      h1: 'Aus Norwegen und den Niederlanden <br />nach <em>Maspalomas.</em>',
      intro: 'Wir sind ein norwegisch-niederländisches Paar. Calma ist unser Café an der Avenida de Tirajana: Wir machen Brunch, Kaffee und hausgemachten Kuchen und servieren alles zwischen Pflanzen, senfgelben Kissen und Bildern.',
      chalkEyebrow: 'Unsere Kreidetafel', otherBoard: 'Und auf der anderen Tafel: „A yawn is a silent scream for coffee“.',
      detailsEyebrow: 'Das Café', detailsTitle: 'Ein Blick <em>hinein.</em>',
      detailsText: 'Senfgelbe Kissen, ein Wandteppich aus Tassen und Glühbirnen, die über der Holztheke hängen. <br />Und ein großes Fenster mit Blick auf die Palmen.',
      captions: ['Das Fenster', 'Die Kissen', 'Die Pinnwand', 'Die Drucke an der Wand', 'Der Tassen-Wandteppich', 'Die Bilder', 'Die Glühbirnen', 'Ein Tisch an der Pinnwand'],
      instagram: 'Mehr Fotos vom Café und vom Essen gibt’s auf Instagram.',
      close: { title: 'Komm <em>vorbei.</em>', text: (from, to, closed) => `Geöffnet von ${from} bis ${to} Uhr, täglich außer ${closed}.` },
      gallery: { label: 'Fotos vom Café', hint: 'Zieh an der Schnur oder nutze die Pfeile.', previous: 'Vorheriges Foto', next: 'Nächstes Foto', item: 'Foto {n} von {total}' },
      story: {
        eyebrow: 'Unsere Geschichte', title: 'Fünfzehn Jahre <em>lang geträumt.</em>',
        lead: 'Rund fünfzehn Jahre hat Guro sich ein eigenes Café ausgemalt. Als der richtige Ort endlich auftauchte, öffnete Calma.',
        craft: { label: 'Norwegen', title: 'Zwischen Cafés und Küchen', text: 'Bevor es nach Gran Canaria ging, hat Guro in Norwegen in Cafés und Küchen gearbeitet. Schon damals war klar: Irgendwann sollte es ein eigenes Café sein.', caption: 'Jahre in der Küche, auf jedem Teller.' },
        search: { label: 'Gran Canaria', title: 'Jahrelang auf der Suche', text: 'Hier dauerte es Jahre, bis der richtige Ort gefunden war. Dann tauchte dieser auf, in der Avenida de Tirajana 3.', caption: 'Und am Ende: dieses Fenster.' },
        name: { label: 'Der Name', title: 'Ein C vor „Alma“', text: 'Zuerst sollte es Alma Café heißen („alma“ heißt Seele). Beim Zeichnen des Logos kam „Calma“ heraus, mit einem C davor, und blieb. Ruhe („calma“) ist ja genau das, was du drinnen spüren sollst.', caption: 'Fast hätte es Alma Café geheißen.', replay: 'Animation noch einmal abspielen' },
        opening: { label: '2019', title: 'Die Eröffnung', text: 'Am 6. September 2019 haben wir zum ersten Mal die Tür aufgemacht.', caption: 'Der Tag, an dem wir eröffnet haben.' },
        today: { label: 'Heute', title: 'Brunch, Kaffee und Pflanzen', text: 'Wir sind immer noch am selben Ort, mit Brunch, Kaffee und hausgemachtem Kuchen wie am ersten Tag. Weiter unten siehst du das Café Foto für Foto.', caption: 'Die Theke heute.' },
      },
    },
    visit: {
      title: 'Anfahrt und Öffnungszeiten · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café, Avda. de Tirajana 3 (Apartamentos Aloe), Maspalomas. Telefon +34 681 66 79 17, WhatsApp und Anfahrt.',
      eyebrow: 'Anfahrt', h1: 'So findest du <em>uns.</em>',
      intro: 'Es gibt Tische drinnen und draußen. Noch Fragen, bevor du kommst? Ruf an oder schreib uns per WhatsApp.',
      address: 'Adresse', hours: 'Öffnungszeiten', hoursLink: 'Eintrag auf Google Maps ansehen', hoursView: 'Öffnungszeiten', contact: 'Kontakt', faqTitle: 'Häufige Fragen',
      faq: [
        ['Wann habt ihr geöffnet?', '{horario}'],
        ['Gibt es vegane oder vegetarische Gerichte?', 'Ja, und nicht nur ein, zwei Gerichte: Es gibt ein komplettes vegetarisches und ein komplettes veganes Menü, mit Preisen und Allergenen.'],
        ['Gibt es ein Kindermenü?', 'Ja, die Karte hat einen Bereich „Für Kinder“ mit Sandwiches, Waffeln, Toasts und Joghurt mit Obst.'],
        ['Wo seid ihr?', 'In der Avda. de Tirajana 3, in den Apartamentos Aloe, 35100 Maspalomas (San Bartolomé de Tirajana).'],
      ],
      loadMap: 'Karte laden', mapNote: 'Beim Laden wirst du mit Google Maps verbunden.', mapCaption: 'Das ist eine Zeichnung: Die Google-Karte lädt nur, wenn du sie anforderst.',
      mapTitle: 'Calma Café auf Google Maps', mapFallback: 'Wenn die Karte nicht erscheint, nutze die Schaltfläche „Route“.',
    },
    notFound: { title: 'Seite nicht gefunden', h1: 'Diese Seite steht nicht <em>auf der Karte.</em>', intro: 'Vielleicht ist der Link falsch geschrieben oder die Seite gibt es nicht mehr. Von hier aus kommst du zur Startseite, zur Speisekarte oder zur Anfahrt.' },
  },
  nl: {
    skip: 'Naar de inhoud', ogImageAlt: 'Calma Café: de houten bar met planten en lampjes, en het Calma-logo', homeLabel: 'Calma Café, home',
    nav: { inicio: 'Home', carta: 'Menukaart', calma: 'Over ons', visitanos: 'Bezoek ons' },
    navLabel: 'Hoofdnavigatie', mobileNavLabel: 'Mobiele navigatie', language: 'Taal',
    directions: 'Route', call: 'Bellen', openMenu: 'Menu openen', closeMenu: 'Menu sluiten', menu: 'Menu',
    thanks: ['Bedankt voor je bezoek.', 'Kom snel terug.'],
    whereWeAre: 'Waar we zitten', contact: 'Contact', backHome: 'Terug naar home', backTop: 'Terug naar boven',
    legalNav: 'Juridische informatie', quickActions: 'Snelle acties', legal: 'Juridische informatie', privacy: 'Privacy', cookies: 'Cookies',
    proposal: 'Webdesign en SEO door', close: 'Sluiten', ok: 'Oké', onInstagram: 'op Instagram',
    notices: {
      legal: ['Juridische informatie', 'Dit is een demo. De gegevens van de eigenaar en de juridische informatie worden toegevoegd voordat de website live gaat.'],
      privacy: ['Privacy', 'Deze demo heeft geen formulieren en geen analytics. Het volledige privacybeleid volgt zodra de gegevens van de eigenaar bevestigd zijn. Externe links en de kaart, als je die laadt, leiden naar diensten van derden.'],
      cookies: ['Cookies', 'Deze demo gebruikt geen eigen cookies en geen analytics. Google Maps maakt pas verbinding als je op ‘Kaart laden’ tikt en kan eigen technologieën en beleid toepassen. De definitieve cookietekst wordt voor de lancering nagekeken.'],
    },
    video: { label: 'Rondgang zonder geluid langs de bar en het grote raam van Calma Café', play: 'Video van het café afspelen', playShort: 'Bekijk het café' },
    alsoIn: 'Ook in het Nederlands',
    home: {
      title: 'Calma Café · Brunch en koffie in Maspalomas',
      description: 'Zoete en hartige brunch, Lavazza-koffie en matcha aan de Avenida de Tirajana in Maspalomas. Bekijk de hele kaart met prijzen en allergenen.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch en koffie <br />in <em>Maspalomas.</em>',
      intro: 'Pancakes, toast en hartige brunch, met Lavazza-koffie of een matcha. Je vindt ons tussen de planten aan de Avenida de Tirajana.',
      seeMenu: 'Bekijk de menukaart', pancakesAlt: 'Pancakes van Calma Café met verschillende toppings',
      strip: (from, to) => [`Brunch van ${from} tot ${to}`, 'Lavazza-koffie', 'Matcha en ube', 'Veganistische kaart', 'Tafels binnen en buiten'],
      local: { eyebrow: 'Het café', title: 'Een café vol <em>planten.</em>', text: 'Guro droomde er zo’n vijftien jaar van en opende het in 2019.', link: 'Hoe het begon' },
      drinksEyebrow: 'Om te drinken', drinksTitle: 'Koffie of <em>matcha?</em>',
      drinksIntro: 'De koffie is van Lavazza en de matcha komt uit Japan. En ube? Een paarse zoete aardappel uit de Filipijnen die een beetje naar vanille smaakt. Probeer hem als latte, warm of met ijs.',
      coffee: 'Koffie', matcha: 'Matcha en ube', chooseDrink: 'Kies je drankje', drinksHint: 'Kies de jouwe', allDrinks: 'Bekijk alle drankjes',
      wallEyebrow: 'Op onze muur', wallNote: 'Met krijt op de muur geschreven, naast de ronde tafel.', boardTitle: 'Voor het eerst hier?', boardSub: 'begin hier', boardLink: 'Bekijk de hele kaart', boardNote: 'op een triassant, een mix van croissant en meergranenbrood',
      tables: 'Tafels binnen en buiten.', callNumber: 'Bel {tel}', reviews: 'Lees de reviews', rating: nota => `${nota} op Google`, reviewsCount: n => `meer dan ${n} reviews`, reviewsOnGoogle: n => `Meer dan ${n} reviews op Google`,
    },
    carta: {
      title: 'Menukaart · Calma Café, Maspalomas',
      description: 'De volledige menukaart van Calma Café in Maspalomas: brunch, toast, wraps, salades, huisgemaakt gebak, vegetarische en veganistische gerechten, koffie, matcha en ube.',
      eyebrow: n => `Volledige menukaart · ${n} gerechten en drankjes`, h1: 'Brunch, koffie en <em>iets zoets.</em>',
      aside: 'Met prijzen, extra’s en allergenen. Gerechten met een foto gaan open als je erop tikt.',
      tabs: 'Kaarten', sections: menu => `Onderdelen: ${menu}`,
      intros: {
        carta: 'Zoete of hartige brunch, toast, wraps, salades en iets zoets als afsluiter.',
        vegetariano: 'Zonder vlees of vis.', vegano: 'Zonder dierlijke ingrediënten.',
        bebidas: 'Lavazza-koffie, matcha, ube, smoothies en sappen. En ook mimosa’s en Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'Voor de kleintjes: sandwiches, wafels, toast en yoghurt met fruit.' }, allTab: 'Alles', seeIn: grupo => `bij ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'gerecht' : 'gerechten'}`, drink: n => `${n} ${n === 1 ? 'drankje' : 'drankjes'}`, photo: 'bekijk foto',
      vegan: 'Veganistisch', vegetarian: 'Vegetarisch', choose: 'Keuze uit', add: 'Extra', allergens: 'Allergenen',
      allergyTitle: 'Allergieën of intoleranties?',
      allergyText: 'Laat het ons weten voordat je bestelt. De allergenen komen van onze digitale kaart; waar ze ontbraken, hebben we ze uit de ingrediënten afgeleid. Staat er bij een gerecht niets, vraag het dan toch even.',
      checked: date => `Menukaart geraadpleegd op ${date}`, source: 'Digitale menukaart van Calma',
      close: { title: 'Weet je al <em>wat je neemt?</em>', text: (from, to, closed) => `Keuken open van ${from} tot ${to}, elke dag behalve op ${closed}.` },
      translated: 'Vertaald uit de Spaanse menukaart van het café. Prijzen en allergenen zijn gelijk aan het origineel.',
    },
    calma: {
      title: 'Over ons · Calma Café, Maspalomas',
      description: 'Calma is het café van een Noors-Nederlands stel aan de Avenida de Tirajana in Maspalomas. Brunch, koffie en huisgemaakt gebak tussen planten en schilderijen.',
      h1: 'Van Noorwegen en Nederland <br />naar <em>Maspalomas.</em>',
      intro: 'We zijn een Noors-Nederlands stel. Calma is ons café aan de Avenida de Tirajana: we maken brunch, koffie en huisgemaakt gebak, en serveren dat tussen planten, mosterdgele kussens en schilderijen.',
      chalkEyebrow: 'Ons krijtbord', otherBoard: 'En op het andere krijtbord: ‘A yawn is a silent scream for coffee’.',
      detailsEyebrow: 'Het café', detailsTitle: 'Een kijkje <em>binnen.</em>',
      detailsText: 'Mosterdgele kussens, een wandkleed van kopjes en lampjes die boven de houten bar hangen. <br />En een groot raam met uitzicht op de palmbomen.',
      captions: ['Het raam', 'De kussens', 'Het prikbord', 'De prenten aan de muur', 'Het wandkleed van kopjes', 'De schilderijen', 'De lampjes', 'Een tafeltje bij het prikbord'],
      instagram: 'Meer foto’s van het café en het eten zetten we op Instagram.',
      close: { title: 'Kom <em>langs.</em>', text: (from, to, closed) => `Open van ${from} tot ${to}, elke dag behalve op ${closed}.` },
      gallery: { label: 'Foto’s van het café', hint: 'Sleep aan het touw of gebruik de pijlen.', previous: 'Vorige foto', next: 'Volgende foto', item: 'Foto {n} van {total}' },
      story: {
        eyebrow: 'Ons verhaal', title: 'Vijftien jaar <em>over nagedacht.</em>',
        lead: 'Guro heeft zo’n vijftien jaar van een eigen café gedroomd. Toen de juiste plek eindelijk opdook, ging Calma open.',
        craft: { label: 'Noorwegen', title: 'Tussen cafés en keukens', text: 'Voor de verhuizing naar Gran Canaria werkte Guro in cafés en keukens in Noorwegen. Toen al was het plan: ooit een eigen café.', caption: 'Jaren keukenervaring op elk bord.' },
        search: { label: 'Gran Canaria', title: 'Jaren zoeken naar de juiste plek', text: 'Hier duurde het jaren voor de juiste plek gevonden was. Tot deze opdook, aan de Avenida de Tirajana 3.', caption: 'En uiteindelijk: dit raam.' },
        name: { label: 'De naam', title: 'Een C voor ‘Alma’', text: 'Eerst zou het Alma Café heten (‘alma’ betekent ziel). Bij het tekenen van het logo kwam er ‘Calma’ uit, met een C ervoor, en dat bleef. Rust (‘calma’) is tenslotte wat Guro je binnen wil laten voelen.', caption: 'Het heette bijna Alma Café.', replay: 'Animatie opnieuw afspelen' },
        opening: { label: '2019', title: 'De opening', text: 'Op 6 september 2019 deden we voor het eerst de deur open.', caption: 'De dag dat we opengingen.' },
        today: { label: 'Vandaag', title: 'Brunch, koffie en planten', text: 'We zitten nog steeds op dezelfde plek, met dezelfde brunch, koffie en huisgemaakt gebak. Verderop zie je het café, foto voor foto.', caption: 'De bar nu.' },
      },
    },
    visit: {
      title: 'Locatie en openingstijden · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café zit aan de Avda. de Tirajana 3 (Apartamentos Aloe), Maspalomas. Telefoon +34 681 66 79 17, WhatsApp en routebeschrijving.',
      eyebrow: 'Bezoek ons', h1: 'Waar je ons <em>vindt.</em>',
      intro: 'Er zijn tafels binnen en buiten. Nog een vraag voor je komt? Bel ons of stuur een WhatsApp.',
      address: 'Adres', hours: 'Openingstijden', hoursLink: 'Bekijk ons Google Maps-profiel', hoursView: 'Openingstijden', contact: 'Contact', faqTitle: 'Veelgestelde vragen',
      faq: [
        ['Wat zijn jullie openingstijden?', '{horario}'],
        ['Hebben jullie veganistische of vegetarische opties?', 'Ja, en niet maar een paar gerechten: er is een volledig vegetarisch en een volledig veganistisch menu, met prijzen en allergenen.'],
        ['Is er een kindermenu?', 'Ja, de kaart heeft een onderdeel ‘Voor kinderen’ met sandwiches, wafels, toast en yoghurt met fruit.'],
        ['Waar zitten jullie?', 'Aan de Avda. de Tirajana 3, in de Apartamentos Aloe, 35100 Maspalomas (San Bartolomé de Tirajana).'],
      ],
      loadMap: 'Kaart laden', mapNote: 'Als je de kaart laadt, maak je verbinding met Google Maps.', mapCaption: 'Dit is een tekening: de kaart van Google laadt alleen als je dat wilt.',
      mapTitle: 'Calma Café op Google Maps', mapFallback: 'Verschijnt de kaart niet? Gebruik dan de knop ‘Route’.',
    },
    notFound: { title: 'Pagina niet gevonden', h1: 'Deze pagina staat niet <em>op de kaart.</em>', intro: 'Misschien is de link verkeerd getypt of bestaat de pagina niet meer. Vanaf hier kun je terug naar home, de menukaart bekijken of zien hoe je ons vindt.' },
  },
};

// Fuera de la versión española, el teléfono se muestra con el prefijo internacional.
export const phone = (lang: Lang, texto: string) => (lang === 'es' ? texto : `+34 ${texto}`);
