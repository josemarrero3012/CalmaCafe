# Arquitectura

El proyecto genera un sitio estático. No incluye backend, base de datos, sistema de reservas ni panel de administración.

| Ruta | Responsabilidad |
| --- | --- |
| `src/pages/` | Entradas y rutas, incluida la 404 y la propuesta |
| `src/views/` | Contenido de Inicio, Carta, Calma y Visítanos |
| `src/layouts/` | Documento HTML, metadatos y navegación compartida |
| `src/components/` | Componentes Astro reutilizables |
| `src/components/ui/` | Carrusel React cargado con `client:visible` |
| `src/assets/` | Recursos procesados por Astro |
| `src/styles/` | Estilos generales, carta y ambientación |
| `src/scripts/` | Interacciones del navegador y animación de la cronología |
| `src/lib/` | Rutas base, carta, horarios, destacados y datos estructurados |
| `src/data/` | Datos de negocio, carta y manifiestos multimedia |
| `src/i18n/` | Interfaz, rutas y traducciones de la carta |
| `src/fonts/` | Fuente de la máscara caligráfica y licencia |
| `public/` | Recursos estáticos autoalojados |
| `scripts/` | Herramientas de mantenimiento ejecutadas con Node |
| `tests/` | Pruebas con `node:test` |

Flujo de datos: fuente digital → importador → JSON y fotografías → vistas Astro → `dist/` → GitHub Pages. Los datos se resuelven al compilar; el indicador de apertura se actualiza en el navegador con la hora de Canarias.

Mantener las rutas en las entradas, el contenido en las vistas y la lógica comprobable en `src/lib/`. No mover recursos ni cambiar nombres solo por estética: existen referencias desde datos, importadores y páginas.
