// Antepone el `base` de Astro (p. ej. /TheFragrancerBar en GitHub Pages) a una ruta absoluta del sitio.
export const url = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
