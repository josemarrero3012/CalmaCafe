import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const base = process.env.QA_URL || 'http://localhost:4321';
// Cada sección es una página independiente; «home» conserva el nombre de las capturas anteriores.
const pages = [['/', 'home'], ['/carta/', 'carta'], ['/calma/', 'calma'], ['/visitanos/', 'visitanos']];
// Versiones traducidas: mismas comprobaciones generales (las interacciones por nombre se prueban en español).
const translated = ['en', 'de', 'nl'].flatMap(lang => ({ en: ['', 'menu/', 'about/', 'visit/'], de: ['', 'speisekarte/', 'ueber-uns/', 'besuch/'], nl: ['', 'menukaart/', 'over-ons/', 'bezoek/'] })[lang].map((slug, i) => [`/${lang}/${slug}`, `${lang}-${['home', 'carta', 'calma', 'visitanos'][i]}`, lang]));
await mkdir('docs/capturas', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const report = [];
const carta = JSON.parse(await readFile('src/data/carta.json', 'utf8'));
const dishCount = carta.menus.reduce((n, m) => n + m.grupos.reduce((k, g) => k + g.platos.length, 0), 0);
const scriptHidden = page => page.locator('.script-word path').evaluateAll(paths => paths.filter(p => parseFloat(getComputedStyle(p).strokeDashoffset) > 0.01).length);
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const [path, name, lang = 'es'] of [...pages, ...translated]) {
      const errors = [];
      const externalRequests = [];
      const onError = e => errors.push(e.message);
      const onRequest = r => { if (!r.url().startsWith(base) && !r.url().startsWith('data:')) externalRequests.push(r.url()); };
      page.on('pageerror', onError);
      page.on('request', onRequest);
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1, `${path}: un único h1`);
      assert.equal(await page.locator('html').getAttribute('lang'), lang, `${path}: idioma del documento`);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 5, `${path}: hreflang de los cuatro idiomas y x-default`);
      for (const href of await page.locator('.lang-switch a').evaluateAll(links => links.map(a => a.getAttribute('href')))) {
        assert.ok((await page.request.get(base + href)).ok(), `${path}: el selector de idioma enlaza a ${href}`);
      }
      assert.equal(await page.locator('.desktop-nav [aria-current="page"]').count(), 1, `${path}: sección actual marcada`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path} ${width}: overflow horizontal`);
      assert.equal(await page.locator('iframe').count(), 0, 'El mapa no debe cargarse antes de pulsar');
      assert.equal(await page.evaluate(() => document.cookie), '');
      assert.equal(await scriptHidden(page), 0, `${path}: con movimiento reducido la caligrafía se ve completa`);
      // Ningún marcador de demo ni dato de ejemplo a la vista.
      assert.doesNotMatch(await page.locator('body').innerText(), /PENDIENTE|por confirmar|de ejemplo|Abierto ahora/i, `${path}: marcador visible`);
      assert.equal(await page.locator('.mobile-bottom a[href^="tel:"]').count(), 1, 'Llamar abre el teléfono');
      if (name === 'home') {
        assert.equal(await page.locator('video').evaluate(v => v.paused), true, 'El vídeo no arranca solo');
        assert.ok(await page.locator('.hero-bg img').evaluate(img => img.complete && img.naturalWidth > 0), 'Foto de fondo del hero cargada');
        await page.getByRole('button', { name: 'Matcha y ube' }).click();
        assert.equal(await page.getByRole('button', { name: 'Matcha y ube' }).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('[data-team-panel="matcha"]').isVisible(), true);
        assert.equal(await page.locator('[data-team-panel="coffee"]').isVisible(), false);
        await page.getByRole('button', { name: 'Café' }).click();
      }
      if (name === 'carta') {
        // Pestañas de menú: solo se ve el elegido y la URL lo recuerda.
        assert.equal(await page.locator('.carta-menu:visible').count(), 1);
        await page.locator('[data-tab="vegano"]').click();
        assert.equal(await page.locator('#menu-vegano').isVisible(), true);
        assert.equal(await page.locator('#menu-carta').isVisible(), false);
        assert.equal(await page.locator('[data-tab="vegano"]').getAttribute('aria-selected'), 'true');
        assert.match(page.url(), /#vegano$/);
        await page.locator('#menu-vegano [data-dish-open]').first().click();
        assert.equal(await page.locator('#dish-dialog').evaluate(d => d.open), true);
        assert.equal(await page.locator('[data-dish-title]').innerText(), await page.locator('#menu-vegano .dish[data-photo]').first().getAttribute('data-name'));
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#dish-dialog').evaluate(d => d.open), false);
        // La barra de menús es fija: se puede cambiar de menú a mitad de la carta.
        await page.locator('#vegano-algo-dulce').scrollIntoViewIfNeeded();
        await page.locator('[data-tab="bebidas"]').click();
        assert.equal(await page.locator('#menu-bebidas').isVisible(), true);
        assert.equal(await page.locator('[data-sections="bebidas"]').isVisible(), true);
        assert.equal(await page.locator('[data-sections="vegano"]').isVisible(), false);
        assert.ok(await page.locator('#menu-bebidas h2').evaluate(h => h.getBoundingClientRect().top < innerHeight / 2), 'El menú elegido se ve arriba');
        await page.locator('[data-tab="carta"]').click();
        // La nota sin gluten solo aparece en los menús que la llevan en la carta oficial.
        assert.equal(await page.locator('#menu-carta .carta-note').count(), 0);
        assert.equal(await page.locator('#menu-vegano .carta-note').count(), 1);
        // Cada tamaño de foto que la carta declara debe existir (la vista previa y la ampliación los piden).
        const photoUrls = await page.locator('.dish[data-photo]').evaluateAll(dishes => dishes.flatMap(d => d.dataset.photoWidths.split(',').map(w => `${d.dataset.photo}-${w}.webp`)));
        const missing = [];
        for (const url of new Set(photoUrls)) if (!(await page.request.head(base + url)).ok()) missing.push(url);
        assert.deepEqual(missing, [], 'Fotos de la carta inexistentes');
      }
      // Recorrer la página para que las imágenes lazy se carguen antes de la captura.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      });
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
      await page.evaluate(() => window.scrollTo(0, 0));
      const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(i => i.checkVisibility() && (!i.complete || i.naturalWidth === 0)).map(i => i.src));
      assert.deepEqual(broken, [], `${path}: imágenes rotas`);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
      if (lang === 'es' || name.endsWith('home')) await page.screenshot({ path: `docs/capturas/${name}-${width}.png`, fullPage: true });
      if (name === 'home') await page.screenshot({ path: `docs/capturas/hero-${width}.png` });
      report.push({ page: path, width, errors: [...errors], externalRequestsBeforeMapClick: [...externalRequests], accessibility: axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
      assert.deepEqual(externalRequests, [], 'No deben existir peticiones externas antes de cargar el mapa');
      page.off('pageerror', onError);
      page.off('request', onRequest);
      if (name === 'visitanos') {
        // Simular el proveedor: comprobar el consentimiento sin transferir datos a Google en QA.
        await page.route('https://maps.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Mapa simulado para la prueba.</p>' }));
        await page.getByRole('button', { name: 'Cargar mapa' }).click();
        assert.equal(await page.locator('iframe').count(), 1);
      }
    }
    if (width === 390) {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      assert.equal(await page.locator('#mobile-menu').evaluate(d => d.open), true);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.closest('#mobile-menu') !== null), true);
      await page.locator('#mobile-menu a[href="/visitanos/"]').click();
      await page.waitForURL(`${base}/visitanos/`);
      assert.equal(await page.locator('#mobile-menu').evaluate(d => d.open), false);
      assert.equal(await page.evaluate(() => scrollY), 0, 'La sección se abre arriba, sin desplazamiento');
      assert.equal(await page.getByRole('link', { name: 'Llamar' }).getAttribute('href'), 'tel:+34681667917');
    }
    await context.close();
  }
  // Sin JavaScript, el contenido, fotos y enlaces de visita siguen disponibles.
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  for (const [path] of [...pages, ...translated]) {
    await noJS.goto(base + path);
    assert.equal(await noJS.locator('h1').isVisible(), true);
    assert.equal(await noJS.locator('.will-reveal').count(), 0);
  }
  await noJS.goto(`${base}/carta/`);
  assert.equal(await noJS.locator('.dish').count(), dishCount, 'Sin JavaScript se ve la carta completa');
  assert.equal(await noJS.locator('.carta-menu:visible').count(), carta.menus.length);
  await noJS.close();
  const animated = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await animated.goto(base);
  assert.ok(await scriptHidden(animated) > 0, 'La caligrafía empieza sin escribir');
  // «Ver el local» abre el vídeo en una ventana; al cerrarla se pausa.
  await animated.getByRole('button', { name: 'Reproducir vídeo del local' }).click();
  await animated.waitForFunction(() => !document.querySelector('video').paused, { timeout: 15_000 });
  assert.equal(await animated.locator('video').evaluate(v => v.muted), true);
  await animated.waitForFunction(() => [...document.querySelectorAll('.script-word path')].every(p => parseFloat(getComputedStyle(p).strokeDashoffset) <= 0.01), { timeout: 10_000 });
  await animated.keyboard.press('Escape');
  await animated.waitForFunction(() => document.querySelector('video').paused && !document.querySelector('#video-dialog').open);
  await animated.locator('.desktop-nav a[href="/calma/"]').click();
  await animated.waitForURL(`${base}/calma/`);
  await animated.locator('#chalk-title').scrollIntoViewIfNeeded();
  await animated.waitForFunction(() => document.querySelector('#chalk-title').classList.contains('is-visible'), null, { timeout: 5_000 });
  await animated.locator('#details-title').scrollIntoViewIfNeeded();
  await animated.waitForFunction(() => document.querySelector('.details-heading').classList.contains('is-visible'));
  await animated.emulateMedia({ reducedMotion: 'reduce' });
  await animated.waitForFunction(() => document.querySelectorAll('.will-reveal:not(.is-visible)').length === 0);
  assert.equal(await animated.locator('.will-reveal:not(.is-visible)').count(), 0);
  for (const width of [320, 768, 1024]) {
    await animated.setViewportSize({ width, height: 900 });
    for (const [path] of [...pages, ...translated]) {
      await animated.goto(base + path);
      assert.equal(await animated.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path} ${width}: overflow horizontal`);
    }
  }
  await animated.close();
} finally {
  await writeFile('docs/capturas/qa-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report.map(r => ({ page: r.page, width: r.width, errors: r.errors.length, axe: r.accessibility.map(a => a.id) }))));
if (report.some(r => r.errors.length || r.accessibility.length)) process.exitCode = 1;
