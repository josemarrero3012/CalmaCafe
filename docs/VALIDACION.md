# Validación de Fase 1

Comprobada el **5 de octubre de 2026**, en la compilación estática servida localmente. Node 24.19.0, Astro 7.3.5, Chromium 153 y Lighthouse 13.5.0.

## Rendimiento móvil

| Categoría | Resultado |
| --- | ---: |
| Rendimiento | **97/100** |
| Accesibilidad | **100/100** |
| Buenas prácticas | **100/100** |
| SEO | **100/100** |
| LCP | **2,480 s** |
| FCP | **1,355 s** |
| CLS | **0** |
| Total Blocking Time | **0 ms** |

Medición Lighthouse móvil con red simulada (RTT 150 ms, 1.638,4 Kbps) y ralentización de CPU ×4. Viewport 412 × 823, DPR 1,75. El objetivo local de ≥90 en las cuatro categorías y LCP <2,5 s se alcanza en esta ejecución; no es una medición de campo ni una garantía del futuro alojamiento.

[Informe HTML](capturas/lighthouse-mobile.report.html) · [JSON completo](capturas/lighthouse-mobile.report.json) · [Resumen de métricas](lighthouse-summary.json).

La nota SEO evalúa únicamente lo presente en esta Home: el SEO completo, las URLs definitivas, hreflang, sitemap, robots y páginas legales siguen reservados a Fase 3.

## Comprobaciones

- Compilación y TypeScript: **0 errores, 0 advertencias, 0 sugerencias**.
- Horario: **5 pruebas** con límites de apertura y cierre, descansos, turnos partidos, siguiente día y cambio de hora de Canarias.
- Axe en 390 y 1440 px: **0 incidencias** en reglas WCAG A/AA y buenas prácticas comprobables automáticamente.
- Un H1, imágenes sin errores, textos alternativos, ausencia de scroll horizontal y foco visible.
- Menú móvil con diálogo nativo, cierre con Escape, foco dentro del diálogo, navegación a anclas y regreso del foco tras avisos.
- Selector café/matcha con `aria-pressed` y respuesta anunciada por `aria-live`.
- Vídeo silenciado y control de reproducción/pausa; poster y contenido visible con movimiento reducido. El cambio de preferencia en vivo muestra todos los elementos.
- Cero cookies propias y **cero solicitudes externas antes de pulsar el mapa**. La prueba del mapa intercepta Google localmente, evitando transferencias externas durante QA.
- Contenido y fotografías accesibles sin JavaScript.
- Comprobación adicional de anchuras 320, 768 y 1024 px.
- Dependencias: auditoría tras actualización, **0 vulnerabilidades**. Se fija `phin` 3.7.1 para la dependencia transitiva de Potrace; vectorización comprobada con la actualización.

Las pruebas automáticas complementan la revisión visual; no equivalen a una auditoría humana completa con todas las tecnologías de asistencia.

## Recursos

- Vídeo MP4: **10 s, 432 × 768, H.264, 604.328 bytes, sin pista de audio**.
- Vídeo WebM: **10 s, 432 × 768, VP9, 946.713 bytes, sin pista de audio**.
- Diez fotogramas extraídos; ocho se muestran en el collage. Los originales no se modificaron.
- Ocho fotos originales en AVIF/WebP con variantes responsivas y dimensiones explícitas.
- Logo original trazado, verificado visualmente; versiones transparentes de marca completa, wordmark y taza-loto.

## Repetir

```bash
npm run build
npm run preview -- --port 4322
QA_URL=http://localhost:4322 npm run qa
npm test
```

Para Lighthouse, instala Chromium con Playwright o apunta `CHROME_PATH` a tu Chrome:

```bash
CHROME_PATH=/ruta/a/chrome npx lighthouse http://localhost:4322 \
  --chrome-flags='--headless --no-sandbox' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html --output-path=docs/capturas/lighthouse-mobile
```
