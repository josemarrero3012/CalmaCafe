# Alérgenos y carta: verificación del 15 de octubre de 2026

Resumen de la comparación entre la carta digital oficial ([calma.buenacarta.com](https://calma.buenacarta.com/)) y esta web, lo que se ha cambiado y lo que sigue pendiente de que el local corrija.

## 1. Verificación

- La web mostraba **exactamente los alérgenos de la carta oficial**: los 123 platos comunes coincidían en contenido y orden, y no había diferencias de precio.
- El problema está en el origen: la carta oficial marca alérgenos en solo **30 de sus 130 platos** y se contradice entre menús (el mismo plato con alérgenos distintos según el menú).
- La carta oficial había cambiado desde la importación del 7 de octubre (ver punto 2).

## 2. Platos, fotos y nombres actualizados (`npm run carta`)

Carta importada el 15 de octubre de 2026: **130 platos** (antes 124) y **91 con foto** (antes 86).

Platos nuevos (7 entradas, 4 platos distintos):

| Plato | Menús | Precio | Foto |
|---|---|---|---|
| Tosta Remolacha (tomates confitados y feta) | Carta, Vegetariano, Vegano | 8,00 € | sí |
| Pancake Manzana crumble | Carta (Algo dulce), Vegetariano | 12,50 € | sí |
| Tosta Cacahuete | Vegetariano | 7,00 € | sí |
| Pumpkin Spice Latte | Bebidas | 5,00 € | no |

- **Retirado:** «Sándwich Atún picante» (9,00 €, Carta). Ya no está en la oficial. Si fue un error suyo, habrá que volver a añadirlo.
- **Extra nuevo:** «Crema de pistacho vegana» (+3,50 €) en los Pancakes de «Algo dulce» del menú Vegano.
- **Nombre corregido:** «Pumkin Spice Latte» → «Pumpkin Spice Latte» (errata de la oficial; el resto de nombres ya pasaba por las correcciones de forma del script).
- Los textos nuevos están traducidos al inglés, alemán y neerlandés en `src/i18n/carta.json`, incluido el alérgeno «Sulfitos».

## 3. Alérgenos que esta web añade a los oficiales

Se añaden solo cuando el ingrediente aparece en el nombre o la descripción del plato, o es inherente al plato (pan, harina de trigo, tofu, hummus, cava…). **No se quita ninguno de los oficiales.** Los añadidos viven en `src/data/alergenos-anadidos.json`, el script `npm run carta` los aplica en cada importación y cada plato guarda en `carta.json` el campo `alergenosAnadidos`. El texto de la sección de alergias de la carta ya avisa de que están completados.

73 platos, 98 alérgenos añadidos.

### Carta

| Plato | Se añade | Motivo |
|---|---|---|
| Granola Cacahuete | Gluten, Cacahuetes, Lácteos | Granola (con gluten en el resto de la carta), crema de cacahuete y yogur griego, según su descripción |
| Tosta huevos revueltos y bacon | Huevos | «huevos revueltos» en el nombre |
| Tosta Tumaca | Gluten, Semillas de sésamo | tosta (pan) «con aceite y semillas»; la misma tosta en Vegetariano ya marca Sésamo |
| Tosta Caesar | Gluten | tosta (pan) |
| Tosta Remolacha | Gluten, Lácteos | tosta (pan) con queso feta |
| Tosta Salmón | Pescado, Huevos | salmón en el nombre y huevo revuelto en la descripción |
| Tosta Brie | Frutos de cáscara | «con nueces» en la descripción |
| Tosta Cacahuete | Gluten, Cacahuetes | tosta (pan) con crema de cacahuete |
| Pancakes estilo americano | Gluten, Huevos | pancakes con huevos revueltos |
| Sándwich Brie y bacon | Gluten, Lácteos | sándwich (pan) con brie |
| Sándwich Pollo y pesto | Gluten | sándwich (pan) |
| Sándwich Guacamole y champiñones | Gluten | sándwich (pan) |
| Ensalada de atún picante & huevo | Pescado | atún en el nombre |
| Fajita Salmón | Pescado | salmón en el nombre |
| Hummus | Semillas de sésamo | el hummus lleva tahini (sésamo) |
| Huevo | Huevos | huevo |
| Queso o jamón | Lácteos | queso (o jamón) |
| Mozzarella | Lácteos | mozzarella |
| Rollito de canela | Gluten | masa de harina de trigo |
| Gofre | Gluten | masa de harina de trigo |
| Cookies | Gluten | galleta de harina de trigo |
| Mini Brookie | Gluten | masa de harina de trigo |
| Pancakes | Gluten, Huevos, Lácteos | es el mismo plato «Pancakes» que en Brunch, que ya marca estos tres |
| Pancake Manzana crumble | Gluten | pancake (harina de trigo) |
| Gofre con mermelada o Nutella | Gluten | gofre (harina de trigo) |
| Sándwich pollo y queso a la plancha | Gluten, Lácteos | sándwich (pan) con queso |
| Tosta solo huevos | Gluten, Huevos | tosta (pan) con huevos revueltos |
| Yogur con fruta | Lácteos | yogur |

### Vegetariano

| Plato | Se añade | Motivo |
|---|---|---|
| Tosta Remolacha | Gluten, Lácteos | tosta (pan) con feta |
| Tosta huevos revueltos | Huevos | «huevos revueltos» en el nombre |
| Tosta Brie | Frutos de cáscara | «con nueces» en la descripción |
| Pancakes | Gluten, Huevos, Lácteos | es el mismo plato «Pancakes» de Carta, que ya marca estos tres |
| Granola Cacahuete | Gluten, Cacahuetes | granola con crema de cacahuete |
| Tosta Cacahuete | Gluten, Cacahuetes | tosta (pan) con crema de cacahuete |
| Fajita Desayuno | Huevos | «huevos revueltos» en la descripción |
| Pancakes | Gluten, Huevos, Lácteos | es el mismo plato «Pancakes» de Carta, que ya marca estos tres |
| Rollito de canela | Gluten | masa de harina de trigo |
| Gofre | Gluten | masa de harina de trigo |
| Cookies | Gluten | galleta de harina de trigo |
| Mini Brookie | Gluten | masa de harina de trigo |
| Pancake Manzana crumble | Gluten | pancake (harina de trigo) |
| Hummus | Semillas de sésamo | el hummus lleva tahini (sésamo) |
| Huevo | Huevos | huevo |
| Queso | Lácteos | queso |

### Vegano

| Plato | Se añade | Motivo |
|---|---|---|
| Granola Bowl Vegano con fruta | Gluten | granola |
| Granola Cacahuete Vegano | Gluten, Cacahuetes | granola con crema de cacahuete |
| Calma Vegano | Gluten, Soja | triassant (pan) con revuelto de tofu |
| Tosta Remolacha | Gluten | tosta (pan) |
| Tosta Tumaca | Gluten, Semillas de sésamo | tosta (pan) «con aceite y semillas»; la misma tosta en Vegetariano ya marca Sésamo |
| Tosta tofu revuelto | Gluten, Soja | tosta (pan) con tofu |
| Tosta Cacahuete | Gluten, Cacahuetes | tosta (pan) con crema de cacahuete |
| Tosta guacamole & champiñones | Gluten | tosta (pan) |
| Gofre Vegano | Gluten | gofre (harina de trigo) |
| Rollito de canela vegano | Gluten | masa de harina de trigo |
| Pancakes Veganos | Gluten | pancakes (harina de trigo) |
| Fajita Vegana | Gluten, Semillas de sésamo | fajita (tortilla de trigo) con hummus (sésamo) |
| Ensalada Vegana de Quinoa & garbanzos | Gluten | «pan de acompañamiento» |
| Rollito de canela | Gluten | masa de harina de trigo |
| Gofre | Gluten | gofre (harina de trigo) |
| Pancakes | Gluten | pancakes (harina de trigo) |
| Tofu | Soja | el tofu es de soja |
| Hummus | Semillas de sésamo | el hummus lleva tahini (sésamo) |

### Bebidas

| Plato | Se añade | Motivo |
|---|---|---|
| Café con leche o cortado largo | Lácteos | «con leche» en el nombre |
| Leche & leche | Lácteos | «leche & leche» |
| Cappuccino | Lácteos | el cappuccino se hace con leche |
| Latte Macchiato | Lácteos | el latte macchiato se hace con leche |
| Latte congelado | Lácteos | «leche» en la descripción |
| Cerveza | Gluten | la cerveza lleva cebada |
| Vino | Sulfitos | el vino lleva sulfitos |
| Cava piccolo | Sulfitos | el cava lleva sulfitos |
| Mimosa | Sulfitos | la mimosa lleva cava |
| Fresa Mimosa | Sulfitos | lleva cava |
| Aperol Spritz | Sulfitos | el Aperol Spritz lleva prosecco |

## 4. Incoherencias que siguen en la carta oficial (sin tocar)

Esto es lo que habría que confirmar con el local. No se ha aplicado porque no es seguro.

**Marcado en la oficial sin ingrediente que lo justifique**
- Espresso marca Lácteos, mientras que Americano y Extra espresso no marcan nada. Parece un error.
- Frutos de cáscara sin frutos secos en la descripción: Granola Bowl, Tosta Salmón, Tosta huevos revueltos y bacon, Ensalada Caesar, Ensalada de atún, Ensalada de quinoa y pollo, Fajita Caesar, Fajita Desayuno, Fajita Salmón y Mixto niños.
- Cacahuetes en Ensalada de quinoa y pollo y en Fajita Caesar, sin cacahuete en la descripción (y los platos con cacahuete no lo marcaban).
- Soja en Ensalada Caesar, Ensalada de atún, Fajita Caesar, Fajita Salmón y «Pan con…».
- Huevos en Tosta Brie, Mozzarella Serrano y pesto, Calma Especial y los Triassant vegetarianos.
- Lácteos en la Fajita Vegetariana (humus, guacamole y champiñones).

**El mismo plato con alérgenos distintos según el menú (tras los añadidos)**
- Granola Bowl con fruta: Carta marca Gluten, Lácteos, Frutos de cáscara y Sésamo; Vegetariano solo Gluten y Lácteos.
- Tosta Brie: Carta marca Huevos y Vegetariano no.
- Fajita Desayuno: Carta marca Frutos de cáscara y Vegetariano no.
- Fajita Vegetariana (Gluten, Lácteos, Sésamo) frente a Fajita Vegana (mismos ingredientes, sin Lácteos).

**Probables, pero no seguros (no añadidos)**
- Bebidas con posible leche vegetal: Matcha Latte, Ube Latte, Chocolate caliente, Calma Latte, Calma Ice Latte, Latte de matcha y de ube congelados, Pumpkin Spice Latte. Calma Latte y Calma Ice Latte dicen «Pistacho, Nutella, Dulce de Leche» como opciones: según la elección llevarían Frutos de cáscara y Lácteos.
- Gofre, Rollito de canela, Cookies, Mini Brookie y Pancake Manzana crumble: Huevos y Lácteos (existen versiones veganas).
- Granola Cacahuete vegetariano: Lácteos si lleva yogur (la descripción no lo dice).
- Salsa Caesar (Tosta Caesar, Ensalada Caesar, Fajita Caesar): Huevos, Lácteos, Mostaza y Pescado (anchoa).
- Pesto (Sándwich Pollo y pesto, Tosta Serrano, Mozzarella Serrano y pesto): Lácteos y frutos secos.
- Papas ajillo al horno con chili alioli: Huevos.
- Triassant con tomate, aceite y semillas (vegano): Sésamo si las semillas lo llevan (la Tosta Tumaca con las mismas semillas sí lo marca).
- Tosta Remolacha vegana dice «con queso»: confirmar que es queso vegano.
- Extras de Pancakes y Gofre (Nutella, crema de pistacho, crema de cacahuete): dependen de lo que se elija.
- Cerveza: se ha marcado Gluten; el resto de alérgenos de bebidas alcohólicas (Sulfitos en cerveza) no se ha tocado.

## 5. Cómo se mantiene

1. `npm run carta` reimporta la carta oficial y aplica `src/data/alergenos-anadidos.json`.
2. `npm test` avisa de textos sin traducir y de añadidos que ya no encajan con la carta.
3. Cuando el local corrija un alérgeno en su carta, el script no duplica nada: el añadido se ignora si el oficial ya lo trae. Se puede borrar la entrada del JSON.
