import negocio from '../data/negocio.json';
import { getOpeningStatus } from '../lib/hours.mjs';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector<HTMLDialogElement>('#mobile-menu')!;
const notice = document.querySelector<HTMLDialogElement>('#notice-dialog')!;
let previousFocus: HTMLElement | null = null;
function openDialog(dialog: HTMLDialogElement) {
  previousFocus = document.activeElement as HTMLElement;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
document.querySelector('.menu-toggle')?.addEventListener('click', () => openDialog(menu));
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus({ preventScroll: true }); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
});
// Cada sección es una página: al elegir una, el menú se cierra antes de que cambie la vista.
menu.querySelectorAll<HTMLAnchorElement>('nav a').forEach(a => a.addEventListener('click', () => menu.close()));
// Los avisos legales llevan su texto, ya traducido, en el propio botón.
document.querySelectorAll<HTMLElement>('[data-notice]').forEach(button => button.addEventListener('click', () => {
  notice.querySelector('#notice-title')!.textContent = button.dataset.noticeTitle!;
  notice.querySelector('#notice-description')!.textContent = button.dataset.noticeText!;
  openDialog(notice);
}));

// Selector de idioma: se cierra al pulsar fuera o con Escape.
const langSwitch = document.querySelector<HTMLDetailsElement>('.lang-switch');
if (langSwitch) {
  document.addEventListener('click', event => { if (langSwitch.open && !langSwitch.contains(event.target as Node)) langSwitch.open = false; });
  langSwitch.addEventListener('keydown', event => {
    if (event.key === 'Escape' && langSwitch.open) { langSwitch.open = false; langSwitch.querySelector('summary')!.focus(); }
  });
}

// Los [data-hours] solo se pintan cuando el horario real está confirmado (negocio.json).
if (negocio.horario.confirmado && document.querySelector('[data-hours], [data-hours-state]')) {
  const updateHours = () => {
    const result = getOpeningStatus(new Date(), negocio.horario.semana, negocio.zonaHoraria, document.documentElement.lang);
    document.querySelectorAll('[data-hours]').forEach(el => { el.textContent = result.text; });
    // Cartel de la cabecera: el estado en la primera línea y, si está cerrado, cuándo abre en la segunda
    const [state, next = ''] = result.text.split(' · ');
    document.querySelectorAll('[data-hours-state]').forEach(el => { el.textContent = state; });
    document.querySelectorAll('[data-hours-next]').forEach(el => { el.textContent = next; });
    document.querySelectorAll('.status-dot').forEach(dot => { dot.classList.toggle('is-open', result.open); dot.classList.toggle('is-closed', !result.open); });
    const today = new Intl.DateTimeFormat('en-GB', { timeZone: negocio.zonaHoraria, weekday: 'short' }).format(new Date());
    const index = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(today);
    document.querySelectorAll('.hours-table tr').forEach(row => row.classList.toggle('is-today', Number((row as HTMLElement).dataset.day) === index));
  };
  updateHours();
  setInterval(updateHours, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateHours(); });
}

// Inicio: ¿café o matcha? Empieza con el café elegido (su foto y su lista, sin hueco vacío); con los botones se cambia al matcha y vuelta.
const teamGrid = document.querySelector<HTMLElement>('.team-grid');
const chooseTeam = (team: string) => {
  teamGrid!.dataset.choice = team;
  document.querySelectorAll<HTMLElement>('[data-team]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.team === team)));
};
document.querySelectorAll<HTMLElement>('[data-team], [data-team-pick]').forEach(el => el.addEventListener('click', () => chooseTeam(el.dataset.team ?? el.dataset.teamPick!)));

// Móvil: la barra de acciones se aparta al bajar y vuelve al subir, para dejar sitio al contenido.
const quickActions = document.querySelector<HTMLElement>('.mobile-bottom');
if (quickActions) {
  let lastY = scrollY;
  window.addEventListener('scroll', () => {
    const y = scrollY;
    if (Math.abs(y - lastY) < 8) return;
    quickActions.classList.toggle('is-tucked', y > lastY && y > 240);
    // En la carta también se aparta la cabecera, para dejar más pantalla a los platos (solo en móvil, por CSS).
    document.body.classList.toggle('header-tucked', y > lastY && y > 400);
    lastY = y;
  }, { passive: true });
}

document.querySelector<HTMLButtonElement>('#load-map')?.addEventListener('click', event => {
  const button = event.currentTarget as HTMLButtonElement;
  const container = document.querySelector('#map-container')!;
  const iframe = document.createElement('iframe');
  iframe.src = negocio.mapas.embed;
  iframe.title = button.dataset.mapTitle!;
  iframe.referrerPolicy = 'no-referrer';
  iframe.allowFullscreen = true;
  const status = document.createElement('p');
  status.className = 'map-loading';
  status.textContent = button.dataset.mapFallback!;
  container.replaceChildren(iframe, status);
  iframe.focus();
});

// Inicio: «Ver el local» abre el vídeo en una ventana; se descarga solo entonces.
const video = document.querySelector<HTMLVideoElement>('#interior-video');
const videoDialog = document.querySelector<HTMLDialogElement>('#video-dialog');
if (video && videoDialog) {
  document.querySelectorAll('.video-open').forEach(button => button.addEventListener('click', () => {
    if (!video.currentSrc) {
      video.querySelectorAll('source').forEach(source => { source.src = source.dataset.src!; });
      video.load();
    }
    openDialog(videoDialog);
    video.play().catch(() => {});
  }));
  videoDialog.addEventListener('close', () => video.pause());
}

// Carta: pestañas por menú, índice de secciones, vista previa de la foto y foto ampliada.
const tabs = [...document.querySelectorAll<HTMLAnchorElement>('[data-tab]')];
if (tabs.length) {
  const panels = [...document.querySelectorAll<HTMLElement>('[data-menu]')];
  const select = (id: string, focus = false) => {
    tabs.forEach(tab => {
      const on = tab.dataset.tab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.menu === id));
    document.querySelectorAll<HTMLElement>('[data-sections]').forEach(nav => nav.classList.toggle('is-active', nav.dataset.sections === id));
    history.replaceState(null, '', `#${id}`);
    dispatchEvent(new Event('scroll'));
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
    tab.addEventListener('click', event => {
      event.preventDefault();
      select(tab.dataset.tab!);
      // Si la barra ya está fija, el menú elegido empieza arriba.
      const panel = document.getElementById(`menu-${tab.dataset.tab}`)!;
      if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView();
    });
    tab.addEventListener('keydown', event => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      select(tabs[(i + step + tabs.length) % tabs.length].dataset.tab!, true);
    });
  });
  // Un enlace a #vegano abre ese menú; uno a una sección abre su menú y salta a ella.
  const target = decodeURIComponent(location.hash.slice(1));
  const group = target && document.getElementById(target)?.closest<HTMLElement>('[data-menu]');
  if (tabs.some(tab => tab.dataset.tab === target)) select(target);
  else if (group) { select(group.dataset.menu!); history.replaceState(null, '', `#${target}`); document.getElementById(target)!.scrollIntoView(); }

  // Resaltar en el índice la sección que se está leyendo. Se calcula al desplazar (no con un observador
  // de banda fina): en móvil, al pulsar un acceso la sección queda arriba y el observador no la veía.
  // La sección nueva se centra moviendo solo la barra, y solo cuando cambia: scrollIntoView movía también
  // la página y, llamado en cada fotograma, en móvil peleaba con el desplazamiento y la pantalla temblaba.
  const markCurrent = (menuId: string, id: string | null) => {
    const nav = document.querySelector<HTMLElement>(`[data-sections="${menuId}"]`)!;
    nav.querySelectorAll<HTMLAnchorElement>('[data-index]').forEach(link => {
      const current = link.dataset.index === id;
      const changed = link.classList.contains('is-current') !== current;
      link.classList.toggle('is-current', current);
      // En escritorio se desliza la fila de secciones; en móvil, la fila única de menús y secciones.
      const row = getComputedStyle(nav).overflowX === 'visible' ? nav.parentElement! : nav;
      // Hasta que la barra no se queda fija arriba, la fila se ve desde el principio («Todo», «Vegetariano»…):
      // al cargar en móvil, centrar «Brunch» escondía los menús.
      if (current && changed && barStuck() && row.scrollWidth > row.clientWidth) {
        const rowBox = row.getBoundingClientRect();
        const box = link.getBoundingClientRect();
        row.scrollTo({ left: row.scrollLeft + box.left - rowBox.left - (rowBox.width - box.width) / 2, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  };
  const bar = document.querySelector<HTMLElement>('.carta-index-bar');
  const barStuck = () => !!bar && bar.getBoundingClientRect().top <= (parseFloat(getComputedStyle(bar).top) || 0) + 1;
  let ticking = false;
  const updateCurrent = () => {
    ticking = false;
    const panel = document.querySelector<HTMLElement>('.carta-menu.is-active');
    if (!panel || !bar) return;
    const probe = bar.getBoundingClientRect().bottom + window.innerHeight * 0.25;
    const groups = [...panel.querySelectorAll<HTMLElement>('.carta-group')];
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const current = atEnd ? groups.at(-1) : groups.filter(g => g.getBoundingClientRect().top <= probe).at(-1);
    markCurrent(panel.dataset.menu!, current?.id ?? null);
  };
  const queueUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateCurrent); } };
  addEventListener('scroll', queueUpdate, { passive: true });
  addEventListener('resize', queueUpdate);
  document.querySelectorAll<HTMLAnchorElement>('[data-index]').forEach(link => link.addEventListener('click', () => markCurrent(link.closest<HTMLElement>('[data-sections]')!.dataset.sections!, link.dataset.index!)));
  queueUpdate();

  // Cada foto declara los tamaños que existen (algunas originales miden menos de 800 px).
  const webpSet = (dish: HTMLElement) => dish.dataset.photoWidths!.split(',').map(w => `${dish.dataset.photo}-${w}.webp ${w}w`).join(', ');
  // Al pasar por un plato, la foto en arco de su grupo cambia a ese plato.
  const canHover = window.matchMedia('(hover: hover)');
  const preview = (dish: HTMLElement) => {
    const figure = dish.closest('.carta-group')?.querySelector<HTMLElement>('[data-feature]');
    const src = dish.dataset.photo;
    if (!figure || !src || figure.dataset.current === src) return;
    figure.dataset.current = src;
    dish.closest('.carta-list')!.querySelectorAll('.is-previewed').forEach(el => el.classList.remove('is-previewed'));
    dish.classList.add('is-previewed');
    const arch = figure.querySelector('.carta-feature-arch')!;
    const img = new Image();
    img.className = 'is-incoming';
    img.alt = dish.dataset.name!;
    img.sizes = '(max-width: 999px) 38vw, 420px';
    img.srcset = webpSet(dish);
    img.decode().catch(() => {}).finally(() => {
      if (figure.dataset.current !== src) return;
      arch.append(img);
      requestAnimationFrame(() => img.classList.add('is-shown'));
      img.addEventListener('transitionend', () => [...arch.children].forEach(child => { if (child !== img) child.remove(); }), { once: true });
      if (reducedMotion.matches) [...arch.children].forEach(child => { if (child !== img) child.remove(); });
      figure.querySelector('[data-feature-caption]')!.textContent = dish.dataset.name!;
    });
  };
  document.querySelectorAll<HTMLElement>('.dish[data-photo]').forEach(dish => {
    dish.addEventListener('mouseenter', () => { if (canHover.matches) preview(dish); });
    dish.addEventListener('focusin', () => preview(dish));
  });

  // Foto ampliada con todos los detalles del plato.
  const dishDialog = document.querySelector<HTMLDialogElement>('#dish-dialog')!;
  document.querySelectorAll<HTMLButtonElement>('[data-dish-open]').forEach(button => button.addEventListener('click', () => {
    const dish = button.closest<HTMLElement>('.dish')!;
    const img = dishDialog.querySelector<HTMLImageElement>('[data-dish-img]')!;
    img.removeAttribute('src');
    img.sizes = '(max-width: 660px) 100vw, 620px';
    img.srcset = webpSet(dish);
    img.alt = dish.dataset.name!;
    dishDialog.querySelector('[data-dish-title]')!.textContent = dish.dataset.name!;
    dishDialog.querySelector('[data-dish-price]')!.textContent = dish.querySelector('.dish-price')!.textContent;
    const details = dishDialog.querySelector('[data-dish-details]')!;
    details.replaceChildren(...[...dish.children].filter(child => !child.classList.contains('dish-line')).map(child => child.cloneNode(true)));
    const diet = dish.querySelector('.dish-diet');
    if (diet) details.prepend(diet.cloneNode(true));
    openDialog(dishDialog);
  }));
}

// La firma caligráfica que queda fuera de pantalla espera a verse para escribirse.
const scriptObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.remove('script-wait'); scriptObserver.unobserve(entry.target); }
}), { threshold: 0.6 });
document.querySelectorAll<SVGSVGElement>('.script-word').forEach(word => {
  if (word.getBoundingClientRect().top > window.innerHeight * 0.9) { word.classList.add('script-wait'); scriptObserver.observe(word); }
});

// Historia (Calma): «Alma» se convierte en «Calma». Cada ranura guarda su ancho real (en em,
// para que valga con cualquier tamaño de letra) y el CSS las abre o estrecha al verse. La ranura
// de la A guarda también el ancho de la «a» minúscula (--wa), que es el que le queda al final.
document.querySelectorAll<HTMLElement>('[data-alma]').forEach(figure => {
  const word = figure.querySelector<HTMLElement>('.alma-word')!;
  document.fonts.ready.then(() => {
    const size = parseFloat(getComputedStyle(word).fontSize);
    word.querySelectorAll<HTMLElement>('.aw').forEach(letter => letter.style.setProperty('--w', `${letter.scrollWidth / size}em`));
    const swap = word.querySelector<HTMLElement>('.aw-swap')!;
    swap.style.setProperty('--w', `${swap.querySelector<HTMLElement>('.aw-A')!.offsetWidth / size}em`);
    swap.style.setProperty('--wa', `${swap.querySelector<HTMLElement>('.aw-a')!.offsetWidth / size}em`);
    figure.classList.add('alma-ready');
  });
  figure.querySelector('.alma-replay')!.addEventListener('click', () => figure.getAnimations({ subtree: true }).forEach(animation => { animation.cancel(); animation.play(); }));
});

const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal], .chalk-write');
if (!reducedMotion.matches) {
  const reveal = (minRatio: number, rootMargin: string) => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= minRatio) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: [0, minRatio || 0.01], rootMargin });
    return observer;
  };
  // Los bloques entran un poco antes de llegar a la pantalla (margen inferior): al bajar rápido no quedan huecos vacíos.
  const blocks = reveal(0.08, '0px 0px 25% 0px');
  // La pizarra se escribe a la vista: basta con que entre en pantalla (empieza recortada y su área visible es 0).
  const chalk = reveal(0, '0px');
  const belowFold = new Map([...revealElements].map(el => [el, el.getBoundingClientRect().top > window.innerHeight]));
  revealElements.forEach(el => {
    if (belowFold.get(el)) el.classList.add('will-reveal');
    (el.classList.contains('chalk-write') ? chalk : blocks).observe(el);
  });
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { revealElements.forEach(el => el.classList.add('is-visible')); }
});

// Inicio: el logo de la cabecera aparece cuando el logo del hero sale de la pantalla (en móvil lo oculta el CSS).
const heroLogo = document.querySelector('.hero-logo');
if (heroLogo) {
  new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('brand-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }, { rootMargin: '-80px 0px 0px 0px' }).observe(heroLogo);
}

// Franja «Propuesta de Aterna Studio»: aparece al llegar con ?propuesta (el enlace del mensaje al local) y se
// recuerda durante la visita. En la propia página de la propuesta no hace falta.
const proposalBanner = document.querySelector<HTMLElement>('.proposal-banner');
if (proposalBanner && !location.pathname.endsWith('/propuesta/')) {
  let show = new URLSearchParams(location.search).has('propuesta');
  try {
    if (show) sessionStorage.setItem('propuesta', '1');
    else show = sessionStorage.getItem('propuesta') === '1';
  } catch { /* sin almacenamiento: solo en la página con ?propuesta */ }
  proposalBanner.hidden = !show;
}

// Aviso de idioma: si el navegador prefiere inglés, alemán, neerlandés o español y la página está en otro, se ofrece
// la misma página en ese idioma (sin redirigir). Si se cierra, no vuelve a salir en esta visita ni en las siguientes.
const langHint = document.querySelector<HTMLElement>('.lang-hint');
if (langHint) {
  let dismissed = false;
  try { dismissed = localStorage.getItem('calma-lang-hint') === 'no'; } catch { /* sin almacenamiento */ }
  const pageLang = document.documentElement.lang;
  const wanted = navigator.languages.map(l => l.slice(0, 2).toLowerCase()).find(l => ['es', 'en', 'de', 'nl'].includes(l));
  const link = wanted && wanted !== pageLang ? langHint.querySelector<HTMLElement>(`[data-lang-hint="${wanted}"]`) : null;
  if (link && !dismissed) {
    link.hidden = false;
    langHint.hidden = false;
    langHint.querySelector('.lang-hint-close')!.addEventListener('click', () => {
      langHint.hidden = true;
      try { localStorage.setItem('calma-lang-hint', 'no'); } catch { /* sin almacenamiento */ }
    });
  }
}
