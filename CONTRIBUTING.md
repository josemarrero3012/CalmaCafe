# Trabajar en el proyecto

1. Crear una rama desde `main` con prefijo `codex/` o un nombre descriptivo acordado.
2. Mantener cada cambio centrado en un propósito; revisar datos y traducciones cuando cambie la carta.
3. Ejecutar `npm test` y `npm run build`. Para cambios visuales o interacciones, revisar móvil y escritorio y ejecutar el QA de navegador.
4. Abrir una pull request explicando problema, cambio y validación.

## Commits

Formato: `tipo(ámbito opcional): descripción en español`.

```text
docs: actualizar la documentación del prototipo
fix(carta): conservar el precio del extra seleccionado
ci: comprobar la compilación antes de publicar
chore(carta): actualizar desde la fuente oficial
```

Usar `feat`, `fix`, `docs`, `refactor`, `test`, `ci` o `chore` según el cambio. Conservar la autoría y las referencias del historial existente.

## Recursos y datos

No incluir credenciales, datos privados del cliente, originales multimedia ni informes generados. Los derivados de `public/` son necesarios para la compilación y sí se versionan. Conservar las licencias de las fuentes y comprobar los derechos de nuevos recursos. No cambiar ingredientes, precios o afirmaciones alimentarias sin validación de la fuente o del negocio.

## GitHub Pages

Conservar `CalmaCafe`, `site` y `base` para mantener el enlace de la demo. La documentación del repositorio no se publica como parte del sitio: Pages recibe `dist/`.
