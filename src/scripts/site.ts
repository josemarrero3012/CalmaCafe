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
if (negocio.horario.confirmado && document.querySelector('[data-hours]')) {
  const updateHours = () => {
    const result = getOpeningStatus(new Date(), negocio.horario.semana, negocio.zonaHoraria, document.documentElement.lang);
    document.querySelectorAll('[data-hours]').forEach(el => { el.textContent = result.text; });
    document.querySelector('.status-dot')?.classList.toggle('is-open', result.open);
    const today = new Intl.DateTimeFormat('en-GB', { timeZone: negocio.zonaHoraria, weekday: 'short' }).format(new Date());
    const index = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(today);
    document.querySelectorAll('.hours-table tr').forEach(row => row.classList.toggle('is-today', Number((row as HTMLElement).dataset.day) === index));
  };
  updateHours();
  setInterval(updateHours, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateHours(); });
}

// Inicio: ¿café o matcha? Cada botón muestra su lista de bebidas de la carta.
document.querySelectorAll<HTMLButtonElement>('[data-team]').forEach(button => button.addEventListener('click', () => {
  const team = button.dataset.team!;
  document.querySelectorAll('[data-team]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  document.querySelectorAll<HTMLElement>('[data-team-panel]').forEach(panel => { panel.hidden = panel.dataset.teamPanel !== team; });
  document.querySelector('.team-photos')?.classList.toggle('matcha-selected', team === 'matcha');
}));

// Móvil: la barra de acciones se aparta al bajar y vuelve al subir, para dejar sitio al contenido.
const quickActions = document.querySelector<HTMLElement>('.mobile-bottom');
if (quickActions) {
  let lastY = scrollY;
  window.addEventListener('scroll', () => {
    const y = scrollY;
    if (Math.abs(y - lastY) < 8) return;
    quickActions.classList.toggle('is-tucked', y > lastY && y > 240);
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
      if (current && changed && nav.scrollWidth > nav.clientWidth) {
        const navBox = nav.getBoundingClientRect();
        const box = link.getBoundingClientRect();
        nav.scrollTo({ left: nav.scrollLeft + box.left - navBox.left - (navBox.width - box.width) / 2, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  };
  const bar = document.querySelector<HTMLElement>('.carta-index-bar');
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

// Historia (Calma): «Alma» se convierte en «Calma». Cada letra guarda su ancho real (en em,
// para que valga con cualquier tamaño de letra) y el CSS abre o cierra las ranuras al verse.
document.querySelectorAll<HTMLElement>('[data-alma]').forEach(figure => {
  const word = figure.querySelector<HTMLElement>('.alma-word')!;
  document.fonts.ready.then(() => {
    const size = parseFloat(getComputedStyle(word).fontSize);
    word.querySelectorAll<HTMLElement>('.aw').forEach(letter => letter.style.setProperty('--w', `${letter.scrollWidth / size}em`));
    figure.classList.add('alma-ready');
  });
  figure.querySelector('.alma-replay')!.addEventListener('click', () => figure.getAnimations({ subtree: true }).forEach(animation => { animation.cancel(); animation.play(); }));
});

const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal], .chalk-write');
if (!reducedMotion.matches) {
  // La pizarra empieza recortada (clip-path) y su área visible es 0: basta con que entre en pantalla.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const enough = entry.intersectionRatio >= 0.08 || entry.target.classList.contains('chalk-write');
    if (entry.isIntersecting && enough) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: [0, 0.08] });
  const belowFold = new Map([...revealElements].map(el => [el, el.getBoundingClientRect().top > window.innerHeight]));
  revealElements.forEach(el => {
    if (belowFold.get(el)) el.classList.add('will-reveal');
    observer.observe(el);
  });
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { revealElements.forEach(el => el.classList.add('is-visible')); }
});
