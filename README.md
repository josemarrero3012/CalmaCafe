# Prototipo Web - Calma Café

Prototipo oficial presentado al negocio de **Calma Café**, cafetería de brunch en Maspalomas, Gran Canaria. Desarrollado para **Aterna Studio**.

**[Ver el prototipo](https://josemarrero3012.github.io/CalmaCafe/)** · [Documentación](docs/README.md) · [Desarrollo](docs/DESARROLLO.md)

> Esta entrega es una propuesta presentada al negocio. La aprobación del prototipo, la autorización de los recursos y la publicación como web definitiva son pasos distintos; las confirmaciones pendientes están documentadas.

## Alcance

- Inicio, Carta, Calma y Visítanos en español, inglés, alemán y neerlandés.
- Carta importada de la fuente digital del local, con precios, extras, fotografías y traducciones. Actualización diaria mediante GitHub Actions cuando hay cambios.
- Horarios calculados en la zona `Atlantic/Canary`.
- Diseño adaptable, animaciones con alternativa de movimiento reducido y contenido accesible sin JavaScript.
- Fotografías y fuentes servidas desde el proyecto; vídeo y mapa bajo demanda.
- Página de propuesta en español, fuera de la navegación y del sitemap.

Las páginas llevan `noindex, nofollow` durante la fase de prototipo. **El enlace es público: `noindex` no limita el acceso ni garantiza la exclusión de todos los buscadores.**

## Tecnología

Astro con generación estática, TypeScript y CSS propio. React se utiliza en el carrusel de fotografías de Calma, que se hidrata cuando entra en pantalla. Las imágenes se distribuyen en AVIF y WebP.

## Desarrollo local

Node.js **22.12 o superior** y npm. La versión de referencia está en [`.nvmrc`](.nvmrc).

```bash
npm ci
npm run dev
```

Abrir **http://localhost:4321/CalmaCafe/**. El prefijo reproduce la ruta de GitHub Pages.

| Comando | Uso |
| --- | --- |
| `npm test` | Pruebas de datos, traducciones y lógica |
| `npm run check` | Comprobación de Astro y TypeScript |
| `npm run build` | Comprobar y generar el sitio en `dist/` |
| `npm run preview` | Servir la compilación |
| `npm run qa` | Comprobaciones de navegador; requiere servidor y Chromium |
| `npm run carta` | Importar la carta oficial; modifica datos y fotografías |

## Organización

```text
.github/     Automatización y plantilla de revisión
src/         Páginas, vistas, componentes, estilos, datos e idiomas
public/      Recursos que se sirven directamente y licencias de fuentes
scripts/     Importación de carta, preparación de recursos y QA
tests/       Pruebas automatizadas
docs/       Documentación vigente e histórico de auditorías
reports/     Capturas e informes locales generados (fuera de Git)
```

## Entrega y mantenimiento

`main` publica en GitHub Pages tras superar pruebas y compilación. Se conserva el identificador **`CalmaCafe`** para mantener [el enlace de la demo](https://josemarrero3012.github.io/CalmaCafe/). El título de presentación admite espacios y acentos; el identificador del repositorio es independiente.

Los datos por confirmar se mantienen en [PENDIENTES.md](docs/PENDIENTES.md). El tratamiento de alérgenos está descrito en [ALERGENOS.md](docs/ALERGENOS.md): las deducciones por ingredientes no sustituyen la validación del local ni permiten garantizar ausencia de alérgenos o contaminación cruzada.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para trabajar en el proyecto y [la política de publicación](docs/PUBLICACION.md) para la visibilidad y el historial.

## Derechos

Este repositorio no concede una licencia abierta de reutilización. La marca, fotografías, vídeo, ilustraciones y demás materiales conservan los derechos de sus respectivos titulares. Las fuentes se distribuyen con sus licencias en `public/fonts/` y `src/fonts/`. La publicación del prototipo no implica autorización para reutilizar la identidad o los recursos del negocio.
