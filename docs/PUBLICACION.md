# Publicación y visibilidad

## Identidad y enlace

Título de presentación: **Prototipo Web - Calma Café**.
Identificador técnico: `josemarrero3012/CalmaCafe`.
Demo: https://josemarrero3012.github.io/CalmaCafe/.

Se conserva el nombre técnico porque renombrar un repositorio no redirige la URL de su sitio de proyecto. No cambiar `base` ni el nombre mientras se quiera mantener ese enlace.

## Recomendación de visibilidad

Para una propuesta comercial, se recomienda **código y documentación privados y demo pública**. El negocio necesita revisar la web; no necesita acceso público al historial, las notas internas o los recursos reutilizables.

GitHub Pages en repositorios privados requiere un plan compatible, como GitHub Pro. Con GitHub Free, privatizar el repositorio despublica Pages. Antes de cambiar la visibilidad hay que comprobar el plan del propietario y la configuración de Pages. Mantener el enlace disponible tiene prioridad.

En la revisión del 29 de octubre de 2026, el repositorio es público. El conector disponible no permite modificar su configuración y el navegador no tiene sesión autenticada; no se ha podido comprobar el plan ni aplicar la visibilidad privada. No se debe interpretar la limpieza de archivos como una restricción de acceso: las versiones anteriores siguen en Git.

Si el plan admite Pages privado, cambiar la visibilidad del repositorio a privado manteniendo la publicación del sitio pública y comprobar la misma URL. Si no lo admite, la alternativa es un repositorio privado de desarrollo y este repositorio público limitado al artefacto estático; requiere preparar y validar un nuevo proceso de publicación, no basta con borrar archivos de la rama principal.

`noindex` es una indicación a buscadores, no autenticación. La página de propuesta también es pública por URL. Los recursos que recibe el navegador pueden descargarse aunque el código fuente del proyecto sea privado.

## Historial y commits

Se conserva el historial publicado para mantener referencias de PR, autoría y trazabilidad. Cambiar mensajes anteriores reescribe los identificadores de los commits y exige actualizar las ramas remotas mediante force push; no se realiza como una operación cosmética.

Los nuevos cambios siguen Conventional Commits, con descripciones en español: `docs:`, `fix:`, `feat:`, `refactor:`, `test:`, `ci:` y `chore:`. Las actualizaciones automáticas usan `chore(carta): ...`. Preferir squash al integrar una PR para obtener un commit con un propósito claro; no eliminar ramas que contengan trabajo sin integrar.

## Antes de la web definitiva

Resolver [PENDIENTES.md](PENDIENTES.md), validar la carta con el local y confirmar los permisos de uso de marca y recursos. Configurar dominio y textos legales cuando el negocio los facilite. Activar indexación solo cuando se acuerde la publicación definitiva.

Referencias: [renombrado](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository), [planes de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [cambios de visibilidad](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).
