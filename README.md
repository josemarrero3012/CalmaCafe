# Calma Café

Prototipo de web que hice para Aterna Studio. Es para Calma Café, una cafetería de brunch en Maspalomas (Gran Canaria). Ahora mismo está terminada la primera fase.

Se puede ver aquí: https://josemarrero3012.github.io/CalmaCafe/

## Qué tiene

Son cuatro páginas: Inicio, Carta, Calma (la historia del local) y Visítanos. Toda la web está en español, inglés, alemán y neerlandés.

- La carta completa del local, con unos 130 platos, sus precios, extras y alérgenos, separada en Carta, Vegetariano, Vegano y Bebidas.
- Un aviso de abierto o cerrado que usa la hora de Canarias.
- Algunos detalles animados: la firma «Feed your soul» que se escribe sola, la taza del logo con su vapor y una tarjeta en la que «Alma» se convierte en «Calma», que es como empezó llamándose el café.
- El logo vectorizado a partir de la imagen original, en versión clara y oscura.

Si el sistema tiene activado «reducir movimiento», las animaciones no se reproducen.

## La carta se actualiza sola

La carta no está copiada a mano. Un script la importa de la carta digital oficial del local y la guarda en un archivo de datos. Cada mañana, antes de que abra el café, GitHub Actions vuelve a ejecutarlo y, si algo ha cambiado, actualiza la web.

El script solo arregla la forma (acentos, espacios, unidades) y nunca toca precios ni ingredientes. Si la web oficial falla o devuelve menos de la mitad de los platos, no guarda nada, para no publicar una carta rota.

Lo más delicado fueron los alérgenos. La carta oficial solo los tiene en unos 30 de los 130 platos, así que completé los que se podían saber con seguridad por los ingredientes. Aun así, la web avisa de que un plato sin alérgenos en la lista no quiere decir que no los tenga.

## Con qué está hecha

Astro para generar las páginas estáticas, CSS propio y JavaScript sin librerías. Las fuentes y las imágenes están optimizadas y van dentro del proyecto, así que la web no depende de servicios externos para cargar.

## Probarla en local

Hace falta Node 22.12 o superior.

```bash
npm ci
npm run dev
```

Se abre en http://localhost:4321. Todo lo técnico (datos, idiomas, SEO y pruebas) está en [docs/DESARROLLO.md](docs/DESARROLLO.md), y lo que queda por confirmar con el local, en [docs/PENDIENTES.md](docs/PENDIENTES.md).
