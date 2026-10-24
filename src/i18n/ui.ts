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
  home: {
    title: string; description: string; place: string; h1: string; intro: string; seeMenu: string; pancakesAlt: string; teamNote: string;
    strip: [string, string, string, string]; doorsTitle: string;
    doors: { carta: [string, string, string]; calma: [string, string, string]; visit: [string, string, string] };
    drinksEyebrow: string; drinksTitle: string; drinksIntro: string; coffee: string; matcha: string; chooseDrink: string; drinksHint: string; allDrinks: string;
    wallEyebrow: string; wallNote: string; boardTitle: string; boardSub: string; boardLink: string;
    tables: string; callNumber: string; reviews: string; rating: (nota: string) => string;
  };
  carta: {
    title: string; description: string; eyebrow: (n: number) => string; h1: string; aside: string; tabs: string; sections: (menu: string) => string;
    intros: Record<string, string>; groupIntros: Record<string, string>; allTab: string; seeIn: (grupo: string) => string; dish: (n: number) => string; drink: (n: number) => string; photo: string;
    vegan: string; vegetarian: string; choose: string; add: string; allergens: string;
    allergyTitle: string; allergyText: string; checked: (date: string) => string; source: string; translated?: string;
  };
  calma: {
    title: string; description: string; h1: string; intro: string; chalkEyebrow: string; otherBoard: string;
    detailsEyebrow: string; detailsTitle: string; detailsText: string; captions: string[]; instagram: string;
    /** Huecos de foto: etiqueta y nota para el local («aquí podríamos poner…») */
    slotLabel: string; ownersNote: string;
    gallery: { label: string; hint: string; previous: string; next: string; item: string };
    story: {
      eyebrow: string; title: string; lead: string;
      craft: { label: string; title: string; text: string; note: string };
      search: { label: string; title: string; text: string; note: string };
      name: { label: string; title: string; text: string; caption: string; replay: string };
      opening: { label: string; title: string; text: string; caption: string; note: string };
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
    nav: { inicio: 'Inicio', carta: 'Carta', calma: 'Calma', visitanos: 'Visítanos' },
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
    home: {
      title: 'Calma Café · Brunch y café en Maspalomas',
      description: 'Brunch, café Lavazza, matcha y opciones veganas en la avenida de Tirajana, Maspalomas. Carta completa con precios y alérgenos.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch y café <br />en <em>Maspalomas.</em>',
      intro: 'Granola, pancakes, tostas o el Calma Especial, que servimos en triassant (una mezcla de croissant y pan de cereales). Para beber, café Lavazza, matcha o ube latte. Estamos en la avenida de Tirajana y hay mesas dentro y fuera.',
      seeMenu: 'Ver la carta', pancakesAlt: 'Pancakes de Calma Café con distintos acompañamientos', teamNote: 'Aquí podríamos poner una foto del equipo enseñando el local.',
      strip: ['Brunch', 'Café Lavazza', 'Matcha y ube', 'Vegano y vegetariano'],
      doorsTitle: 'La carta, el local y <em>cómo llegar.</em>',
      doors: {
        carta: ['La carta', '{n} platos y bebidas, con precios y alérgenos. También hay carta vegetariana y vegana.', 'Ver la carta'],
        calma: ['Calma', 'Quiénes somos y cómo es el local por dentro.', 'Conócenos'],
        visit: ['Visítanos', 'Estamos en {calle}, Maspalomas. Aquí tienes el teléfono, el WhatsApp y el mapa.', 'Cómo llegar'],
      },
      drinksEyebrow: 'Para beber', drinksTitle: '¿Café o <em>matcha?</em>',
      drinksIntro: 'Café Lavazza, matcha japonés y ube. Si no conoces el ube, es una batata morada de Filipinas que recuerda a la vainilla.',
      coffee: 'Café', matcha: 'Matcha y ube', chooseDrink: 'Elige tu bebida', drinksHint: 'Elige el tuyo', allDrinks: 'Todas las bebidas',
      wallEyebrow: 'La pared del local', wallNote: 'Lo tenemos escrito a tiza en la pared negra del local, junto a la mesa redonda.', boardTitle: 'Hoy en la pizarra', boardSub: 'platos de la carta de hoy', boardLink: 'Ver la carta entera',
      tables: 'Mesas dentro y fuera.', callNumber: 'Llamar al {tel}', reviews: 'Reseñas en Google', rating: nota => `${nota} en Google`,
    },
    carta: {
      title: 'La carta · Calma Café, Maspalomas',
      description: 'La carta completa de Calma Café en Maspalomas: brunch, tostas, fajitas, ensaladas, dulces caseros, opciones vegetarianas y veganas, café, matcha y ube.',
      eyebrow: n => `Carta completa · ${n} platos y bebidas`, h1: 'Brunch, café y <em>algo dulce.</em>',
      aside: 'Cada plato con su precio, sus extras y sus alérgenos, igual que en la carta del local. Si un plato tiene foto, pulsa su nombre para verla.',
      tabs: 'Menús de la carta', sections: menu => `Secciones: ${menu}`,
      intros: {
        carta: 'Brunch dulce o salado, tostas, fajitas, ensaladas y algo dulce para terminar.',
        vegetariano: 'Sin carne ni pescado.', vegano: 'Sin ingredientes de origen animal.',
        bebidas: 'Café Lavazza, matcha, ube, smoothies, zumos, mimosas y Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'Para los más pequeños: sándwiches, gofres, tostas y yogur con fruta.' }, allTab: 'Todo', seeIn: grupo => `en ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'propuesta' : 'propuestas'}`, drink: n => `${n} ${n === 1 ? 'bebida' : 'bebidas'}`, photo: 'ver foto',
      vegan: 'Vegano', vegetarian: 'Vegetariano', choose: 'A elegir', add: 'Añade', allergens: 'Alérgenos',
      allergyTitle: '¿Alergias o intolerancias?',
      allergyText: 'Avísanos antes de pedir. Los alérgenos salen de la carta digital del local, y aquí hemos añadido los que se deducen de los ingredientes de cada plato. Si un plato no muestra ninguno, pregúntanos.',
      checked: date => `Carta consultada el ${date}`, source: 'Carta digital de Calma',
    },
    calma: {
      title: 'Café de brunch con plantas en Maspalomas · Calma Café',
      description: 'Calma Café es el café de una pareja noruega y neerlandesa en la avenida de Tirajana, Maspalomas: brunch, café y dulces caseros en un local lleno de plantas y cuadros.',
      h1: 'De Noruega y los Países Bajos <br />a <em>Maspalomas.</em>',
      intro: 'Somos una pareja noruega y neerlandesa, y Calma es nuestro café en la avenida de Tirajana, 3. Hacemos brunch, café y dulces caseros, y los servimos en un local lleno de plantas, con cojines mostaza y cuadros en las paredes.',
      chalkEyebrow: 'La pizarra del local', otherBoard: 'Y en la otra pizarra: «A yawn is a silent scream for coffee».',
      detailsEyebrow: 'El local', detailsTitle: 'Por <em>dentro.</em>',
      detailsText: 'Cojines mostaza, un tapiz hecho de tazas, bombillas sobre la barra de madera <br />y un ventanal que da a las palmeras.',
      captions: ['El ventanal', 'Los cojines', 'El tablero de notas', 'Las láminas de la pared', 'El tapiz de tazas', 'Los cuadros', 'Las bombillas', 'Una mesa junto al tablero'],
      instagram: 'Más fotos del local y de la carta en Instagram.',
      slotLabel: 'Foto pendiente', ownersNote: 'Aquí podríamos poner una foto de la pareja en la barra.',
      gallery: { label: 'Fotos del local', hint: 'Arrastra el hilo o usa las flechas.', previous: 'Foto anterior', next: 'Foto siguiente', item: 'Foto {n} de {total}' },
      story: {
        eyebrow: 'Nuestra historia', title: 'Quince años <em>pensándolo.</em>',
        lead: 'Guro pasó unos quince años imaginando su propia cafetería. Cuando por fin apareció el local, abrió Calma.',
        craft: { label: 'Noruega', title: 'Entre cafeterías y cocinas', text: 'Antes de instalarse en Gran Canaria, Guro trabajó en cafeterías y cocinas en Noruega. El sueño de tener un café propio venía de lejos.', note: 'Aquí podríamos poner una foto de Guro de sus años en Noruega.' },
        search: { label: 'Gran Canaria', title: 'Años buscando el local', text: 'Ya en Gran Canaria, encontrar el local adecuado llevó años. Al final apareció en la avenida de Tirajana, 3, en Maspalomas.', note: 'Si tenéis fotos del local antes de abrir, irían aquí.' },
        name: { label: 'El nombre', title: 'Una C delante de «Alma»', text: 'Guro quería un nombre con alma, así que al principio el café iba a llamarse Alma Café. Mientras se diseñaba el logotipo apareció «Calma», y gustó más: encajaba mejor con lo que Guro quería transmitir.', caption: 'Casi se llamó Alma Café.', replay: 'Ver la animación otra vez' },
        opening: { label: '2019', title: 'Abrimos las puertas', text: 'El 6 de septiembre de 2019 Calma abrió en Maspalomas.', caption: 'El día que abrimos.', note: 'Una foto de la inauguración quedaría genial junto al sello.' },
        today: { label: 'Hoy', title: 'Brunch, café y plantas', text: 'Hoy Calma es nuestro café de brunch en Maspalomas, con mesas dentro y fuera. Más abajo puedes recorrer el local foto a foto.', caption: 'La barra, hoy.' },
      },
    },
    visit: {
      title: 'Dónde estamos y horario · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café está en la Avda. de Tirajana, 3 (Apartamentos Aloe), Maspalomas. Teléfono 681 66 79 17, WhatsApp y cómo llegar.',
      eyebrow: 'Visítanos', h1: 'Dónde <em>estamos.</em>',
      intro: 'Tenemos mesas dentro y fuera. Si quieres preguntar algo antes de venir, llámanos o escríbenos por WhatsApp.',
      address: 'Dirección', hours: 'Horario', hoursLink: 'Ver la ficha en Google Maps', hoursView: 'Ver horario', contact: 'Contacto', faqTitle: 'Preguntas frecuentes',
      faq: [
        ['¿Qué horario tenéis?', '{horario}'],
        ['¿Tenéis opciones veganas o vegetarianas?', 'Sí: la carta tiene un menú vegetariano y otro vegano completos, con precios y alérgenos.'],
        ['¿Hay menú para niños?', 'Sí, la carta tiene una sección «Para los niños» con sándwiches, gofres, tostas y yogur con fruta.'],
        ['¿Dónde estáis?', 'En la Avda. de Tirajana, 3, en los Apartamentos Aloe, 35100 Maspalomas (San Bartolomé de Tirajana). Tenemos mesas dentro y fuera.'],
      ],
      loadMap: 'Cargar mapa', mapNote: 'Al cargarlo conectarás con Google Maps.', mapCaption: 'Ilustración · el mapa de Google se carga solo si lo pides.',
      mapTitle: 'Calma Café en Google Maps', mapFallback: 'Si el mapa no aparece, usa el botón «Cómo llegar».',
    },
    notFound: { title: 'Página no encontrada', h1: 'Esta página no está <em>en la carta.</em>', intro: 'Puede que el enlace esté mal escrito o que la página ya no exista. Desde aquí puedes volver al inicio, ver la carta o saber cómo llegar.' },
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
    home: {
      title: 'Calma Café · Brunch and coffee in Maspalomas',
      description: 'Brunch, Lavazza coffee, matcha and vegan options on Avenida de Tirajana, Maspalomas. Full menu with prices and allergens.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch and coffee <br />in <em>Maspalomas.</em>',
      intro: 'Granola, pancakes, toasts or the Calma Special, which we serve on a triassant (a cross between a croissant and multigrain bread). To drink, Lavazza coffee, matcha or an ube latte. We’re on Avenida de Tirajana, with tables inside and out.',
      seeMenu: 'See the menu', pancakesAlt: 'Calma Café pancakes with different toppings', teamNote: 'A photo of the team showing you around could go here.',
      strip: ['Brunch', 'Lavazza coffee', 'Matcha and ube', 'Vegan and vegetarian'],
      doorsTitle: 'The menu, the café and <em>how to find us.</em>',
      doors: {
        carta: ['The menu', '{n} dishes and drinks, with prices and allergens. There’s a vegetarian and a vegan menu too.', 'See the menu'],
        calma: ['About', 'Who we are and what the café looks like inside.', 'Meet us'],
        visit: ['Visit us', 'We’re at {calle}, Maspalomas. Here’s our phone number, WhatsApp and a map.', 'Directions'],
      },
      drinksEyebrow: 'To drink', drinksTitle: 'Coffee or <em>matcha?</em>',
      drinksIntro: 'Lavazza coffee, Japanese matcha and ube. If you haven’t tried ube, it’s a purple sweet potato from the Philippines that tastes a little like vanilla.',
      coffee: 'Coffee', matcha: 'Matcha and ube', chooseDrink: 'Choose your drink', drinksHint: 'Pick yours', allDrinks: 'All drinks',
      wallEyebrow: 'Our café wall', wallNote: 'It’s chalked on the black wall inside the café, right by the round table.', boardTitle: 'On the board today', boardSub: 'dishes from today’s menu', boardLink: 'See the whole menu',
      tables: 'Tables inside and out.', callNumber: 'Call {tel}', reviews: 'Reviews on Google', rating: nota => `${nota} on Google`,
    },
    carta: {
      title: 'Menu · Calma Café, Maspalomas',
      description: 'The full Calma Café menu in Maspalomas: brunch, toasts, wraps, salads, homemade cakes, vegetarian and vegan options, coffee, matcha and ube.',
      eyebrow: n => `Full menu · ${n} dishes and drinks`, h1: 'Brunch, coffee and <em>something sweet.</em>',
      aside: 'Every dish with its price, extras and allergens, just like the café’s own menu. If a dish has a photo, tap its name to see it.',
      tabs: 'Menus', sections: menu => `Sections: ${menu}`,
      intros: {
        carta: 'Sweet or savoury brunch, toasts, wraps, salads and something sweet to finish.',
        vegetariano: 'No meat or fish.', vegano: 'No animal products.',
        bebidas: 'Lavazza coffee, matcha, ube, smoothies, juices, mimosas and Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'For little ones: sandwiches, waffles, toasts and yoghurt with fruit.' }, allTab: 'All', seeIn: grupo => `in ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'dish' : 'dishes'}`, drink: n => `${n} ${n === 1 ? 'drink' : 'drinks'}`, photo: 'see photo',
      vegan: 'Vegan', vegetarian: 'Vegetarian', choose: 'Choose', add: 'Add', allergens: 'Allergens',
      allergyTitle: 'Allergies or intolerances?',
      allergyText: 'Let us know before you order. The allergens come from the café’s digital menu, and we’ve added the ones that follow from each dish’s ingredients. If a dish shows none, please ask us.',
      checked: date => `Menu checked on ${date}`, source: 'Calma’s digital menu',
      translated: 'Translated from the café’s Spanish menu. Prices and allergens are the same as in the original.',
    },
    calma: {
      title: 'Brunch café full of plants in Maspalomas · Calma Café',
      description: 'Calma Café is run by a Norwegian and Dutch couple on Avenida de Tirajana, Maspalomas: brunch, coffee and homemade cakes in a café full of plants and paintings.',
      h1: 'From Norway and the Netherlands <br />to <em>Maspalomas.</em>',
      intro: 'We’re a Norwegian and Dutch couple, and Calma is our café at Avenida de Tirajana, 3. We make brunch, coffee and homemade cakes, and serve them in a room full of plants, with mustard cushions and paintings on the walls.',
      chalkEyebrow: 'Our chalkboard', otherBoard: 'And on the other chalkboard: “A yawn is a silent scream for coffee”.',
      detailsEyebrow: 'The café', detailsTitle: 'Take a look <em>inside.</em>',
      detailsText: 'Mustard cushions, a wall hanging made of cups, light bulbs over the wooden counter <br />and a big window looking out onto palm trees.',
      captions: ['The window', 'The cushions', 'The noticeboard', 'The prints on the wall', 'The cup wall hanging', 'The paintings', 'The light bulbs', 'A table by the noticeboard'],
      instagram: 'More photos of the café and the food on Instagram.',
      slotLabel: 'Photo to come', ownersNote: 'A photo of the couple at the counter could go here.',
      gallery: { label: 'Photos of the café', hint: 'Drag the string or use the arrows.', previous: 'Previous photo', next: 'Next photo', item: 'Photo {n} of {total}' },
      story: {
        eyebrow: 'Our story', title: 'Fifteen years <em>in the making.</em>',
        lead: 'Guro spent about fifteen years imagining a café. When the right place finally turned up, Calma opened.',
        craft: { label: 'Norway', title: 'Cafés and kitchens', text: 'Before settling in Gran Canaria, Guro worked in cafés and kitchens in Norway. The dream of opening a café went back a long way.', note: 'A photo of Guro from the Norway years could go here.' },
        search: { label: 'Gran Canaria', title: 'Years looking for the right place', text: 'Once in Gran Canaria, finding the right space took years. In the end it turned up at Avenida de Tirajana, 3, in Maspalomas.', note: 'If you have photos of the place before it opened, they’d go here.' },
        name: { label: 'The name', title: 'A C in front of “Alma”', text: 'Guro wanted a name with soul (alma means soul in Spanish), so at first the café was going to be called Alma Café. While the logo was being designed, “Calma” came up, and it won: it fitted better with what Guro wanted to get across.', caption: 'It was almost called Alma Café.', replay: 'Play the animation again' },
        opening: { label: '2019', title: 'Opening day', text: 'On 6 September 2019 Calma opened its doors in Maspalomas.', caption: 'The day we opened.', note: 'A photo from opening day would look great next to the stamp.' },
        today: { label: 'Today', title: 'Brunch, coffee and plants', text: 'Today Calma is our brunch café in Maspalomas, with tables inside and out. Further down you can look around the café photo by photo.', caption: 'The counter today.' },
      },
    },
    visit: {
      title: 'Location and opening hours · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café is at Avda. de Tirajana, 3 (Apartamentos Aloe), Maspalomas. Phone +34 681 66 79 17, WhatsApp and directions.',
      eyebrow: 'Visit us', h1: 'Where <em>to find us.</em>',
      intro: 'We have tables inside and out. If you have a question before you come, give us a call or send us a WhatsApp.',
      address: 'Address', hours: 'Opening hours', hoursLink: 'See our Google Maps listing', hoursView: 'See hours', contact: 'Contact', faqTitle: 'Frequently asked questions',
      faq: [
        ['What are your opening hours?', '{horario}'],
        ['Do you have vegan or vegetarian options?', 'Yes: the menu has a full vegetarian menu and a full vegan menu, with prices and allergens.'],
        ['Do you have a kids’ menu?', 'Yes, the menu has a “For kids” section with sandwiches, waffles, toasts and yoghurt with fruit.'],
        ['Where are you?', 'At Avda. de Tirajana, 3, in the Aloe apartments, 35100 Maspalomas (San Bartolomé de Tirajana). We have tables inside and out.'],
      ],
      loadMap: 'Load map', mapNote: 'Loading it connects you to Google Maps.', mapCaption: 'Illustration · the Google map only loads if you ask for it.',
      mapTitle: 'Calma Café on Google Maps', mapFallback: 'If the map does not appear, use the “Directions” button.',
    },
    notFound: { title: 'Page not found', h1: 'This page is not <em>on the menu.</em>', intro: 'The link may be mistyped, or the page may no longer exist. From here you can go back home, see the menu or find out how to get here.' },
  },
  de: {
    skip: 'Zum Inhalt springen', ogImageAlt: 'Calma Café: die Holztheke mit Pflanzen und Glühbirnen und das Calma-Logo', homeLabel: 'Calma Café, Startseite',
    nav: { inicio: 'Start', carta: 'Speisekarte', calma: 'Über uns', visitanos: 'Besuch' },
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
    home: {
      title: 'Calma Café · Brunch und Kaffee in Maspalomas',
      description: 'Brunch, Lavazza-Kaffee, Matcha und vegane Gerichte in der Avenida de Tirajana, Maspalomas. Komplette Speisekarte mit Preisen und Allergenen.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch und Kaffee <br />in <em>Maspalomas.</em>',
      intro: 'Granola, Pancakes, Toasts oder das Calma Special, das wir im Triassant servieren (einer Mischung aus Croissant und Mehrkornbrot). Dazu Lavazza-Kaffee, Matcha oder Ube Latte. Du findest uns in der Avenida de Tirajana, mit Tischen drinnen und draußen.',
      seeMenu: 'Zur Speisekarte', pancakesAlt: 'Pancakes von Calma Café mit verschiedenen Toppings', teamNote: 'Hier passt ein Foto vom Team, das das Café zeigt.',
      strip: ['Brunch', 'Lavazza-Kaffee', 'Matcha und Ube', 'Vegan und vegetarisch'],
      doorsTitle: 'Speisekarte, Café und <em>Anfahrt.</em>',
      doors: {
        carta: ['Speisekarte', '{n} Gerichte und Getränke mit Preisen und Allergenen. Es gibt auch eine vegetarische und eine vegane Karte.', 'Zur Speisekarte'],
        calma: ['Über uns', 'Wer wir sind und wie es bei uns drinnen aussieht.', 'Lern uns kennen'],
        visit: ['Besuch', '{calle}, Maspalomas. Hier findest du Telefon, WhatsApp und Karte.', 'Route'],
      },
      drinksEyebrow: 'Zum Trinken', drinksTitle: 'Kaffee oder <em>Matcha?</em>',
      drinksIntro: 'Lavazza-Kaffee, japanischer Matcha und Ube. Falls du Ube nicht kennst: eine violette Süßkartoffel von den Philippinen, die ein bisschen nach Vanille schmeckt.',
      coffee: 'Kaffee', matcha: 'Matcha und Ube', chooseDrink: 'Wähle dein Getränk', drinksHint: 'Wähl deins', allDrinks: 'Alle Getränke',
      wallEyebrow: 'Unsere Wand im Café', wallNote: 'So steht es mit Kreide an der schwarzen Wand im Café, gleich beim runden Tisch.', boardTitle: 'Heute an der Tafel', boardSub: 'Gerichte von der heutigen Karte', boardLink: 'Zur ganzen Karte',
      tables: 'Tische drinnen und draußen.', callNumber: '{tel} anrufen', reviews: 'Bewertungen auf Google', rating: nota => `${nota} auf Google`,
    },
    carta: {
      title: 'Speisekarte · Calma Café, Maspalomas',
      description: 'Die komplette Speisekarte von Calma Café in Maspalomas: Brunch, Toasts, Wraps, Salate, hausgemachter Kuchen, vegetarische und vegane Gerichte, Kaffee, Matcha und Ube.',
      eyebrow: n => `Komplette Speisekarte · ${n} Gerichte und Getränke`, h1: 'Brunch, Kaffee und <em>etwas Süßes.</em>',
      aside: 'Jedes Gericht mit Preis, Extras und Allergenen, wie auf der Karte im Café. Wenn es ein Foto gibt, tippe auf den Namen.',
      tabs: 'Karten', sections: menu => `Bereiche: ${menu}`,
      intros: {
        carta: 'Süßer oder herzhafter Brunch, Toasts, Wraps, Salate und etwas Süßes zum Schluss.',
        vegetariano: 'Ohne Fleisch und Fisch.', vegano: 'Ohne tierische Zutaten.',
        bebidas: 'Lavazza-Kaffee, Matcha, Ube, Smoothies, Säfte, Mimosas und Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'Für die Kleinen: Sandwiches, Waffeln, Toasts und Joghurt mit Obst.' }, allTab: 'Alles', seeIn: grupo => `unter ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'Gericht' : 'Gerichte'}`, drink: n => `${n} ${n === 1 ? 'Getränk' : 'Getränke'}`, photo: 'Foto ansehen',
      vegan: 'Vegan', vegetarian: 'Vegetarisch', choose: 'Zur Auswahl', add: 'Extra', allergens: 'Allergene',
      allergyTitle: 'Allergien oder Unverträglichkeiten?',
      allergyText: 'Sag uns bitte vor der Bestellung Bescheid. Die Allergene stammen aus der digitalen Speisekarte des Cafés; dazu haben wir die ergänzt, die sich aus den Zutaten der Gerichte ergeben. Steht bei einem Gericht nichts, frag uns bitte.',
      checked: date => `Speisekarte abgerufen am ${date}`, source: 'Digitale Speisekarte von Calma',
      translated: 'Übersetzt aus der spanischen Speisekarte des Cafés. Preise und Allergene entsprechen dem Original.',
    },
    calma: {
      title: 'Brunch-Café voller Pflanzen in Maspalomas · Calma Café',
      description: 'Calma Café wird von einem norwegisch-niederländischen Paar in der Avenida de Tirajana in Maspalomas geführt: Brunch, Kaffee und hausgemachter Kuchen in einem Café voller Pflanzen und Bilder.',
      h1: 'Aus Norwegen und den Niederlanden <br />nach <em>Maspalomas.</em>',
      intro: 'Wir sind ein norwegisch-niederländisches Paar, und Calma ist unser Café in der Avenida de Tirajana 3. Wir machen Brunch, Kaffee und hausgemachten Kuchen und servieren alles in einem Raum voller Pflanzen, mit senfgelben Kissen und Bildern an den Wänden.',
      chalkEyebrow: 'Unsere Kreidetafel', otherBoard: 'Und auf der anderen Tafel: „A yawn is a silent scream for coffee“.',
      detailsEyebrow: 'Das Café', detailsTitle: 'Ein Blick <em>hinein.</em>',
      detailsText: 'Senfgelbe Kissen, ein Wandteppich aus Tassen, Glühbirnen über der Holztheke <br />und ein großes Fenster mit Blick auf Palmen.',
      captions: ['Das Fenster', 'Die Kissen', 'Die Pinnwand', 'Die Drucke an der Wand', 'Der Tassen-Wandteppich', 'Die Bilder', 'Die Glühbirnen', 'Ein Tisch an der Pinnwand'],
      instagram: 'Mehr Fotos vom Café und vom Essen auf Instagram.',
      slotLabel: 'Foto folgt', ownersNote: 'Hier passt ein Foto des Paares an der Theke.',
      gallery: { label: 'Fotos vom Café', hint: 'Zieh an der Schnur oder nutze die Pfeile.', previous: 'Vorheriges Foto', next: 'Nächstes Foto', item: 'Foto {n} von {total}' },
      story: {
        eyebrow: 'Unsere Geschichte', title: 'Fünfzehn Jahre <em>lang geträumt.</em>',
        lead: 'Rund fünfzehn Jahre stellte sich Guro ein eigenes Café vor. Als sich endlich der passende Ort fand, öffnete Calma.',
        craft: { label: 'Norwegen', title: 'Zwischen Cafés und Küchen', text: 'Vor dem Umzug nach Gran Canaria hat Guro in Norwegen in Cafés und Küchen gearbeitet. Der Traum vom eigenen Café war schon lange da.', note: 'Hier könnte ein Foto von Guro aus der Zeit in Norwegen stehen.' },
        search: { label: 'Gran Canaria', title: 'Jahrelang auf der Suche', text: 'Auf Gran Canaria dauerte es Jahre, den passenden Raum zu finden. Am Ende war es die Avenida de Tirajana 3 in Maspalomas.', note: 'Falls ihr Fotos vom Raum vor der Eröffnung habt, kämen sie hierher.' },
        name: { label: 'Der Name', title: 'Ein C vor „Alma“', text: 'Guro wollte einen Namen mit Seele (auf Spanisch „alma“), deshalb sollte das Café zuerst Alma Café heißen. Bei der Arbeit am Logo kam „Calma“ auf, und das gefiel besser: Es passte mehr zu dem, was Guro vermitteln wollte.', caption: 'Fast hätte es Alma Café geheißen.', replay: 'Animation noch einmal abspielen' },
        opening: { label: '2019', title: 'Die Eröffnung', text: 'Am 6. September 2019 hat Calma in Maspalomas eröffnet.', caption: 'Der Tag, an dem wir eröffnet haben.', note: 'Ein Foto vom Eröffnungstag würde neben dem Stempel toll aussehen.' },
        today: { label: 'Heute', title: 'Brunch, Kaffee und Pflanzen', text: 'Heute ist Calma unser Brunch-Café in Maspalomas, mit Tischen drinnen und draußen. Weiter unten kannst du dich Foto für Foto im Café umsehen.', caption: 'Die Theke heute.' },
      },
    },
    visit: {
      title: 'Anfahrt und Öffnungszeiten · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café, Avda. de Tirajana 3 (Apartamentos Aloe), Maspalomas. Telefon +34 681 66 79 17, WhatsApp und Anfahrt.',
      eyebrow: 'Besuch', h1: 'So findest du <em>uns.</em>',
      intro: 'Wir haben Tische drinnen und draußen. Wenn du vorher eine Frage hast, ruf uns an oder schreib uns per WhatsApp.',
      address: 'Adresse', hours: 'Öffnungszeiten', hoursLink: 'Eintrag auf Google Maps ansehen', hoursView: 'Öffnungszeiten', contact: 'Kontakt', faqTitle: 'Häufige Fragen',
      faq: [
        ['Wann habt ihr geöffnet?', '{horario}'],
        ['Gibt es vegane oder vegetarische Gerichte?', 'Ja: Die Karte hat ein komplettes vegetarisches und ein komplettes veganes Menü, mit Preisen und Allergenen.'],
        ['Gibt es ein Kindermenü?', 'Ja, die Karte hat einen Bereich „Für Kinder“ mit Sandwiches, Waffeln, Toasts und Joghurt mit Obst.'],
        ['Wo seid ihr?', 'In der Avda. de Tirajana 3, in den Apartamentos Aloe, 35100 Maspalomas (San Bartolomé de Tirajana). Wir haben Tische drinnen und draußen.'],
      ],
      loadMap: 'Karte laden', mapNote: 'Beim Laden wirst du mit Google Maps verbunden.', mapCaption: 'Illustration · die Google-Karte lädt nur, wenn du es möchtest.',
      mapTitle: 'Calma Café auf Google Maps', mapFallback: 'Wenn die Karte nicht erscheint, nutze die Schaltfläche „Route“.',
    },
    notFound: { title: 'Seite nicht gefunden', h1: 'Diese Seite steht nicht <em>auf der Karte.</em>', intro: 'Vielleicht ist der Link falsch geschrieben oder die Seite gibt es nicht mehr. Von hier aus kommst du zur Startseite, zur Speisekarte oder zur Anfahrt.' },
  },
  nl: {
    skip: 'Naar de inhoud', ogImageAlt: 'Calma Café: de houten bar met planten en lampjes, en het Calma-logo', homeLabel: 'Calma Café, home',
    nav: { inicio: 'Home', carta: 'Menukaart', calma: 'Over ons', visitanos: 'Bezoek' },
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
    home: {
      title: 'Calma Café · Brunch en koffie in Maspalomas',
      description: 'Brunch, Lavazza-koffie, matcha en veganistische gerechten aan de Avenida de Tirajana, Maspalomas. Volledige menukaart met prijzen en allergenen.',
      place: 'Maspalomas, Gran Canaria', h1: 'Brunch en koffie <br />in <em>Maspalomas.</em>',
      intro: 'Granola, pancakes, toast of de Calma Special, die we op een triassant serveren (een mix van croissant en meergranenbrood). Om te drinken: Lavazza-koffie, matcha of ube latte. Je vindt ons aan de Avenida de Tirajana, met tafels binnen en buiten.',
      seeMenu: 'Bekijk de menukaart', pancakesAlt: 'Pancakes van Calma Café met verschillende toppings', teamNote: 'Hier zou een foto van het team dat het café laat zien mooi staan.',
      strip: ['Brunch', 'Lavazza-koffie', 'Matcha en ube', 'Veganistisch en vegetarisch'],
      doorsTitle: 'De menukaart, het café en <em>de route.</em>',
      doors: {
        carta: ['Menukaart', '{n} gerechten en drankjes met prijzen en allergenen. Er is ook een vegetarische en een veganistische kaart.', 'Bekijk de menukaart'],
        calma: ['Over ons', 'Wie we zijn en hoe het café er vanbinnen uitziet.', 'Leer ons kennen'],
        visit: ['Bezoek', '{calle}, Maspalomas. Hier vind je ons telefoonnummer, WhatsApp en de kaart.', 'Route'],
      },
      drinksEyebrow: 'Om te drinken', drinksTitle: 'Koffie of <em>matcha?</em>',
      drinksIntro: 'Lavazza-koffie, Japanse matcha en ube. Ken je ube nog niet? Het is een paarse zoete aardappel uit de Filipijnen die een beetje naar vanille smaakt.',
      coffee: 'Koffie', matcha: 'Matcha en ube', chooseDrink: 'Kies je drankje', drinksHint: 'Kies de jouwe', allDrinks: 'Alle drankjes',
      wallEyebrow: 'Onze muur in het café', wallNote: 'Zo staat het met krijt op de zwarte muur in het café, vlak bij de ronde tafel.', boardTitle: 'Vandaag op het bord', boardSub: 'gerechten van de kaart van vandaag', boardLink: 'Bekijk de hele kaart',
      tables: 'Tafels binnen en buiten.', callNumber: 'Bel {tel}', reviews: 'Reviews op Google', rating: nota => `${nota} op Google`,
    },
    carta: {
      title: 'Menukaart · Calma Café, Maspalomas',
      description: 'De volledige menukaart van Calma Café in Maspalomas: brunch, toast, wraps, salades, huisgemaakt gebak, vegetarische en veganistische gerechten, koffie, matcha en ube.',
      eyebrow: n => `Volledige menukaart · ${n} gerechten en drankjes`, h1: 'Brunch, koffie en <em>iets zoets.</em>',
      aside: 'Elk gerecht met prijs, extra’s en allergenen, net als op de kaart in het café. Heeft een gerecht een foto, tik dan op de naam.',
      tabs: 'Kaarten', sections: menu => `Onderdelen: ${menu}`,
      intros: {
        carta: 'Zoete of hartige brunch, toast, wraps, salades en iets zoets als afsluiter.',
        vegetariano: 'Zonder vlees of vis.', vegano: 'Zonder dierlijke ingrediënten.',
        bebidas: 'Lavazza-koffie, matcha, ube, smoothies, sappen, mimosa’s en Aperol Spritz.',
      },
      groupIntros: { 'carta-para-los-ninos': 'Voor de kleintjes: sandwiches, wafels, toast en yoghurt met fruit.' }, allTab: 'Alles', seeIn: grupo => `bij ${grupo}`,
      dish: n => `${n} ${n === 1 ? 'gerecht' : 'gerechten'}`, drink: n => `${n} ${n === 1 ? 'drankje' : 'drankjes'}`, photo: 'bekijk foto',
      vegan: 'Veganistisch', vegetarian: 'Vegetarisch', choose: 'Keuze uit', add: 'Extra', allergens: 'Allergenen',
      allergyTitle: 'Allergieën of intoleranties?',
      allergyText: 'Laat het ons weten voordat je bestelt. De allergenen komen van de digitale menukaart van het café, aangevuld met wat uit de ingrediënten van elk gerecht volgt. Staat er bij een gerecht niets, vraag het ons dan.',
      checked: date => `Menukaart geraadpleegd op ${date}`, source: 'Digitale menukaart van Calma',
      translated: 'Vertaald uit de Spaanse menukaart van het café. Prijzen en allergenen zijn gelijk aan het origineel.',
    },
    calma: {
      title: 'Brunchcafé vol planten in Maspalomas · Calma Café',
      description: 'Calma Café is het café van een Noors-Nederlands stel aan de Avenida de Tirajana in Maspalomas: brunch, koffie en huisgemaakt gebak in een café vol planten en schilderijen.',
      h1: 'Van Noorwegen en Nederland <br />naar <em>Maspalomas.</em>',
      intro: 'We zijn een Noors-Nederlands stel, en Calma is ons café aan de Avenida de Tirajana 3. We maken brunch, koffie en huisgemaakt gebak en serveren het in een ruimte vol planten, met mosterdgele kussens en schilderijen aan de muur.',
      chalkEyebrow: 'Ons krijtbord', otherBoard: 'En op het andere krijtbord: ‘A yawn is a silent scream for coffee’.',
      detailsEyebrow: 'Het café', detailsTitle: 'Een kijkje <em>binnen.</em>',
      detailsText: 'Mosterdgele kussens, een wandkleed van kopjes, lampjes boven de houten bar <br />en een groot raam met uitzicht op palmbomen.',
      captions: ['Het raam', 'De kussens', 'Het prikbord', 'De prenten aan de muur', 'Het wandkleed van kopjes', 'De schilderijen', 'De lampjes', 'Een tafeltje bij het prikbord'],
      instagram: 'Meer foto’s van het café en het eten op Instagram.',
      slotLabel: 'Foto volgt', ownersNote: 'Hier zou een foto van het stel aan de bar mooi staan.',
      gallery: { label: 'Foto’s van het café', hint: 'Sleep aan het touw of gebruik de pijlen.', previous: 'Vorige foto', next: 'Volgende foto', item: 'Foto {n} van {total}' },
      story: {
        eyebrow: 'Ons verhaal', title: 'Vijftien jaar <em>over nagedacht.</em>',
        lead: 'Guro heeft zo’n vijftien jaar over een eigen café nagedacht. Toen eindelijk de juiste plek opdook, ging Calma open.',
        craft: { label: 'Noorwegen', title: 'Tussen cafés en keukens', text: 'Voor de verhuizing naar Gran Canaria werkte Guro in Noorwegen in cafés en keukens. De droom van een eigen café bestond al lang.', note: 'Hier zou een foto van Guro uit de tijd in Noorwegen kunnen komen.' },
        search: { label: 'Gran Canaria', title: 'Jaren zoeken naar de juiste plek', text: 'Op Gran Canaria duurde het jaren om de juiste ruimte te vinden. Uiteindelijk werd het de Avenida de Tirajana 3 in Maspalomas.', note: 'Hebben jullie foto’s van de ruimte van vóór de opening? Die passen hier.' },
        name: { label: 'De naam', title: 'Een C voor ‘Alma’', text: 'Guro wilde een naam met ziel (‘alma’ in het Spaans), dus eerst zou het café Alma Café heten. Tijdens het werk aan het logo kwam ‘Calma’ voorbij, en dat beviel beter: het paste meer bij wat Guro wilde uitstralen.', caption: 'Het heette bijna Alma Café.', replay: 'Animatie opnieuw afspelen' },
        opening: { label: '2019', title: 'De opening', text: 'Op 6 september 2019 ging Calma open in Maspalomas.', caption: 'De dag dat we opengingen.', note: 'Een foto van de openingsdag zou mooi staan naast het stempel.' },
        today: { label: 'Vandaag', title: 'Brunch, koffie en planten', text: 'Vandaag is Calma ons brunchcafé in Maspalomas, met tafels binnen en buiten. Verderop kun je foto voor foto rondkijken in het café.', caption: 'De bar nu.' },
      },
    },
    visit: {
      title: 'Locatie en openingstijden · Calma Café, Avda. de Tirajana (Maspalomas)',
      description: 'Calma Café zit aan de Avda. de Tirajana 3 (Apartamentos Aloe), Maspalomas. Telefoon +34 681 66 79 17, WhatsApp en routebeschrijving.',
      eyebrow: 'Bezoek', h1: 'Waar je ons <em>vindt.</em>',
      intro: 'We hebben tafels binnen en buiten. Heb je vooraf een vraag? Bel ons of stuur een WhatsApp.',
      address: 'Adres', hours: 'Openingstijden', hoursLink: 'Bekijk ons Google Maps-profiel', hoursView: 'Openingstijden', contact: 'Contact', faqTitle: 'Veelgestelde vragen',
      faq: [
        ['Wat zijn jullie openingstijden?', '{horario}'],
        ['Hebben jullie veganistische of vegetarische opties?', 'Ja: de kaart heeft een volledig vegetarisch en een volledig veganistisch menu, met prijzen en allergenen.'],
        ['Is er een kindermenu?', 'Ja, de kaart heeft een onderdeel ‘Voor kinderen’ met sandwiches, wafels, toast en yoghurt met fruit.'],
        ['Waar zitten jullie?', 'Aan de Avda. de Tirajana 3, in de Apartamentos Aloe, 35100 Maspalomas (San Bartolomé de Tirajana). We hebben tafels binnen en buiten.'],
      ],
      loadMap: 'Kaart laden', mapNote: 'Als je de kaart laadt, maak je verbinding met Google Maps.', mapCaption: 'Illustratie · de kaart van Google laadt alleen als je dat wilt.',
      mapTitle: 'Calma Café op Google Maps', mapFallback: 'Verschijnt de kaart niet? Gebruik dan de knop ‘Route’.',
    },
    notFound: { title: 'Pagina niet gevonden', h1: 'Deze pagina staat niet <em>op de kaart.</em>', intro: 'Misschien is de link verkeerd getypt of bestaat de pagina niet meer. Vanaf hier kun je terug naar home, de menukaart bekijken of zien hoe je ons vindt.' },
  },
};

// Fuera de la versión española, el teléfono se muestra con el prefijo internacional.
export const phone = (lang: Lang, texto: string) => (lang === 'es' ? texto : `+34 ${texto}`);
