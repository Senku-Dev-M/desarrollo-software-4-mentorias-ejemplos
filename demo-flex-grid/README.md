# Flexbox y CSS Grid: demo y guía práctica

Una página pequeña de HTML y CSS para aprender a distribuir y alinear elementos.
Usa Flexbox en el encabezado, la navegación, las cajas numeradas y el pie de
página; usa Grid para organizar las seis tarjetas de cursos.

En CSS hablamos de **propiedades y valores**, no de atributos HTML:
en `display: flex`, `display` es la propiedad y `flex` su valor.

## Contenido

- [Ejecutar y recorrer la demo](#ejecutar-y-recorrer-la-demo)
- [Cuándo usar cada uno](#cuándo-usar-cada-uno)
- [Flexbox: ejes, contenedor e hijos](#flexbox-ejes-contenedor-e-hijos)
- [Grid: filas, columnas y áreas](#grid-filas-columnas-y-áreas)
- [Responsive](#responsive)
- [Errores frecuentes y accesibilidad](#errores-frecuentes-y-accesibilidad)
- [Ejercicios y comprobación](#ejercicios-y-comprobación)
- [Referencias](#referencias)

## Ejecutar y recorrer la demo

1. Descarga o clona el repositorio y entra a `demo-flex-grid`.
2. Abre [index.html](./index.html) con doble clic en un navegador.
3. Abre [styles.css](./styles.css) en tu editor.
4. Cambia una propiedad, guarda y recarga el navegador.
5. Cambia el ancho de la ventana para comparar escritorio y móvil.

No hay JavaScript, dependencias, compilación ni servidor obligatorio.
También puedes usar un servidor estático de tu editor si ya tienes uno instalado.
Los enlaces del menú usan `href="#"`: son ilustrativos, no páginas adicionales.

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | Encabezado, menú, tres cajas, seis tarjetas y pie de página. |
| `styles.css` | Estilos base y cinco etapas comentadas de Flexbox, Grid y responsive. |
| `README.md` | Explicación, referencia de propiedades y práctica guiada. |

### Qué hace el código actual

| Selector | Técnica | Resultado |
| --- | --- | --- |
| `.flex-demo` | Flexbox, `row`, `center`, `wrap`, `gap: 20px` | Tres cajas centradas que pueden saltar de línea. |
| `.header` | Flexbox y `space-between` | Título y navegación separados. |
| `.nav` | Flexbox y `gap: 20px` | Enlaces en una fila. |
| `.grid-demo` | Grid y `1fr 1fr 1fr 1fr` | Cuatro columnas; las seis tarjetas ocupan dos filas. |
| `.footer` | Flexbox y `space-between` | Dos textos separados. |
| `@media (max-width: 600px)` | Cambios responsive | Header y footer en columna; Grid con dos columnas; header rojo. |

El breakpoint incluye **600 px**. Por encima de ese ancho se usan cuatro
columnas; a 600 px o menos se usan dos. La demo no tiene una regla de una
columna ni calcula automáticamente cuántas tarjetas caben. Las variantes de
esta guía son propuestas para practicar, no funcionalidades ya implementadas.

## Cuándo usar cada uno

| Necesidad | Primera opción | Motivo |
| --- | --- | --- |
| Menú, botones, icono junto a texto | Flexbox | Distribuir elementos en una dirección. |
| Título a un lado y acciones al otro | Flexbox | Repartir el espacio de una fila. |
| Tarjetas con columnas alineadas entre filas | Grid | Coordinar filas y columnas. |
| Página con header, sidebar y contenido | Grid | Definir regiones del diseño. |
| Botones dentro de una tarjeta de una cuadrícula | Ambos | Grid organiza las tarjetas; Flexbox organiza su interior. |

Flexbox trabaja con un eje principal; permitir varias líneas con `wrap` no
crea columnas compartidas entre ellas. Grid define una cuadrícula de dos
dimensiones. Son herramientas complementarias, no una competencia de cuál es
"más moderna". Empieza por la relación entre los elementos, no por la cantidad.
[Comparación y combinación en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Relationship_with_other_layout_methods).

## Flexbox: ejes, contenedor e hijos

### Activarlo y entender los ejes

```css
.flex-demo {
  display: flex;             /* Los hijos directos pasan a ser flex items. */
  flex-direction: row;       /* Eje principal en la dirección de la fila. */
  justify-content: center;   /* Distribución en el eje principal. */
  align-items: center;       /* Alineación en el eje transversal. */
  flex-wrap: wrap;           /* Permite más de una línea si hace falta. */
  gap: 20px;                /* Separación entre elementos/líneas. */
}
```

Con escritura horizontal de izquierda a derecha, `row` tiene eje principal
horizontal y `column` vertical. `justify-content` sigue el eje principal:
**no siempre significa alinear horizontalmente**. `align-items` sigue el
transversal. La dirección de escritura y `direction` también influyen.

Solo los hijos directos participan en ese contenedor. El `.header` organiza
`h1` y `nav`; `.nav` necesita su propio `display: flex` para organizar los enlaces.
[Conceptos de Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts).

### Propiedades del contenedor Flexbox

| Propiedad | Valores frecuentes | Para qué sirve |
| --- | --- | --- |
| `display` | `flex`, `inline-flex` | Activa Flexbox; cambia también cómo participa el contenedor en el flujo exterior. |
| `flex-direction` | `row`, `column`, `row-reverse`, `column-reverse` | Elige el eje principal y su sentido. |
| `flex-wrap` | `nowrap`, `wrap`, `wrap-reverse` | Decide si hay una línea o varias y el sentido de apilarlas. |
| `flex-flow` | `row wrap` | Abrevia dirección y ajuste de líneas. |
| `justify-content` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | Distribuye espacio libre en el eje principal. |
| `align-items` | `stretch`, `flex-start`, `center`, `flex-end`, `baseline` | Alinea los elementos en el eje transversal de su línea. |
| `align-content` | `stretch`, `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | Distribuye las líneas del contenedor con wrapping; no sustituye a `align-items`. |
| `gap` | `20px`, `12px 20px` | Separa elementos/líneas sin agregar espacio exterior. Dos valores: `row-gap column-gap`. |
| `row-gap`, `column-gap` | Longitudes como `1rem` | Configuran cada separación por separado; su relación con los ejes cambia con `flex-direction`. |

`space-between` deja espacio entre elementos, no en los extremos.
`space-around` reparte espacio alrededor; entre vecinos se suma.
`space-evenly` usa la misma separación entre vecinos y extremos.
Si no hay espacio libre, esos repartos pueden no producir una diferencia visible.

Para observar `align-content`, usa `wrap`, varias líneas y una altura que deje
espacio transversal libre. Con `nowrap` no distribuye líneas.
[Referencia de align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/align-content).

### Propiedades de los hijos Flexbox

| Propiedad | Ejemplo | Para qué sirve |
| --- | --- | --- |
| `flex-grow` | `1` | Factor para repartir espacio positivo disponible; no es un porcentaje. Inicial: `0`. |
| `flex-shrink` | `1` | Factor de reducción ante falta de espacio, ponderado por el tamaño base. Inicial: `1`. |
| `flex-basis` | `200px`, `auto`, `0` | Tamaño base en el eje principal antes de crecer o reducirse. |
| `flex` | `1 1 200px` | Abrevia grow, shrink y basis, en ese orden. |
| `align-self` | `auto`, `center`, `flex-end`, `stretch` | Cambia la alineación transversal de un solo hijo. |
| `order` | `-1`, `0`, `1` | Cambia la posición visual; no reordena el HTML. |
| Márgenes automáticos | `margin-inline-start: auto` | Absorben espacio disponible; útiles para empujar una acción al extremo. |

Ejemplo opcional: reemplaza los tamaños de las cajas por una base flexible.

```css
.flex-demo > .box {
  flex: 1 1 180px; /* Puede crecer, reducirse y parte de una base de 180 px. */
  min-width: 0;   /* Permite reducirse más allá del mínimo automático del contenido. */
}

.flex-demo > .box:nth-child(2) {
  flex-grow: 2;   /* Recibe el doble de espacio extra, no necesariamente el doble de ancho. */
}
```

Atajos útiles: `flex: initial` equivale a `0 1 auto`; `flex: auto`, a `1 1 auto`;
`flex: none`, a `0 0 auto`. `flex: 1` usa una base cero porcentual en navegadores;
no significa "ancho 100 %". Para aprender sin ambigüedades escribe los tres valores.
`align-self: stretch` necesita que el tamaño transversal no esté fijado para
estirar como esperas. `justify-self` no alinea hijos en Flexbox.
[Referencia de flex](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex).

### Centrar en ambos ejes

```css
.flex-demo {
  display: flex;
  min-height: 220px; /* Deja espacio para ver el centrado vertical. */
  justify-content: center;
  align-items: center;
  gap: 20px;
}
```

## Grid: filas, columnas y áreas

### Vocabulario básico

- **Contenedor:** elemento con `display: grid`.
- **Item:** hijo directo que participa en esa cuadrícula.
- **Línea:** límite de una fila o columna; tres columnas tienen cuatro líneas verticales.
- **Track o pista:** espacio entre dos líneas consecutivas: una fila o columna.
- **Celda:** intersección de una fila y una columna.
- **Área:** rectángulo formado por una o varias celdas.
- **Grid explícito:** pistas definidas con `grid-template-*`.
- **Grid implícito:** pistas creadas para colocar elementos que exceden el explícito.

En esta demo las columnas son explícitas y las filas se generan automáticamente
para alojar las seis tarjetas. [Conceptos de Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts).

### Propiedades del contenedor Grid

| Propiedad | Ejemplo | Para qué sirve |
| --- | --- | --- |
| `display` | `grid`, `inline-grid` | Activa Grid. |
| `grid-template-columns` | `repeat(3, 1fr)` | Define las columnas explícitas. |
| `grid-template-rows` | `auto 1fr auto` | Define las filas explícitas. |
| `grid-template-areas` | `"header header" "menu main"` | Nombra áreas rectangulares. |
| `grid-template` | Filas / columnas | Atajo para el grid explícito; al aprender conviene separar propiedades. |
| `grid-auto-rows` | `minmax(100px, auto)` | Tamaño de filas implícitas. |
| `grid-auto-columns` | `180px` | Tamaño de columnas implícitas. |
| `grid-auto-flow` | `row`, `column`, `row dense` | Algoritmo de colocación automática. |
| `grid` | Sintaxis de definición o auto-colocación | Atajo amplio; puede reiniciar propiedades omitidas del grid. |
| `gap`, `row-gap`, `column-gap` | `20px`, `10px 20px` | Separación entre pistas. |
| `justify-items` | `start`, `end`, `center`, `stretch` | Alinea items en su área en el eje inline. |
| `align-items` | `start`, `end`, `center`, `stretch`, `baseline` | Alinea items en su área en el eje block. |
| `place-items` | `center`, `start center` | Atajo: align-items y justify-items. |
| `justify-content`, `align-content` | `center`, `space-between`, `start` | Distribuyen la cuadrícula dentro del contenedor si sobra espacio en el eje correspondiente. |
| `place-content` | `center`, `start center` | Atajo: align-content y justify-content. |

En escritura horizontal, inline suele ser horizontal y block vertical.
`place-items: center` centra cada item dentro de su área; `place-content: center`
centra el conjunto de pistas. No son intercambiables. Si las columnas `1fr`
ya consumen todo el ancho, no queda espacio horizontal para distribuir el conjunto.

### Unidades y funciones para definir pistas

```css
.grid-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
```

- `px`: longitud fija; `rem`: relativa al tamaño de fuente raíz.
- `%`: relativa a la dimensión correspondiente del contenedor; tres columnas
  de `33.33%` más gaps pueden desbordar.
- `fr`: fracción del espacio disponible para las pistas flexibles, no del ancho
  completo sin descontar separaciones o pistas fijas. `2fr 1fr` reparte en proporción 2:1
  cuando los mínimos del contenido no lo impiden.
- `auto`: tamaño automático dependiente del contenido y del espacio disponible.
- `min-content` y `max-content`: tamaños intrínsecos del contenido, no píxeles fijos.
- `minmax(mínimo, máximo)`: limita una pista; `minmax(0, 1fr)` permite que su mínimo
  no lo imponga el contenido. No uses `1fr` como mínimo: `minmax(1fr, 2fr)` es inválido.
- `fit-content(250px)`: tamaño basado en contenido con un límite, sujeto a su mínimo intrínseco.
- `repeat(3, 1fr)`: repite la definición tres veces.

La demo usa cuatro `1fr`; su mínimo automático puede provocar desbordamiento
con contenido muy largo. Usar `minmax(0, 1fr)` ayuda con las pistas, pero también
debes permitir que el contenido se ajuste, por ejemplo con `overflow-wrap: anywhere`.
[Columnas](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns)
y [minmax](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax).

### Propiedades de los hijos Grid

| Propiedad | Ejemplo | Para qué sirve |
| --- | --- | --- |
| `grid-column-start`, `grid-column-end` | `1`, `3` | Líneas de inicio y fin de columnas. |
| `grid-row-start`, `grid-row-end` | `1`, `span 2` | Líneas de fila o número de pistas a ocupar. |
| `grid-column` | `1 / 3`, `span 2`, `1 / -1` | Atajo para inicio/fin de columna. |
| `grid-row` | `1 / 3` | Atajo para inicio/fin de fila. |
| `grid-area` | `main` o `1 / 1 / 3 / 3` | Área nombrada o row-start / column-start / row-end / column-end. |
| `justify-self`, `align-self` | `end`, `center`, `stretch` | Alineación de un item dentro de su área. |
| `place-self` | `center`, `start end` | Atajo: align-self y justify-self. |
| `order` | `1` | Influye en el orden de auto-colocación, no en el orden del documento. |

Prueba temporalmente una tarjeta destacada:

```css
.grid-demo > .card:first-child {
  grid-column: 1 / 3; /* Desde la línea 1 a la 3: ocupa dos columnas. */
}
```

`1 / -1` abarca todas las columnas del **grid explícito**. No significa
"hasta cualquier columna implícita que se cree después".

### Variante con áreas nombradas

Este bloque es un ejercicio independiente: necesita los hijos con esas clases,
no debe pegarse sin más en `.grid-demo`.

```html
<div class="layout">
  <header class="top">Encabezado</header>
  <aside class="side">Menú</aside>
  <main class="content">Contenido</main>
  <footer class="bottom">Pie</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  grid-template-areas:
    "top    top"
    "side   content"
    "bottom bottom";
  gap: 20px;
}
.top { grid-area: top; }
.side { grid-area: side; }
.content { grid-area: content; }
.bottom { grid-area: bottom; }
```

Cada fila debe tener el mismo número de celdas y cada área debe ser rectangular.
Un punto `.` representa una celda sin área nombrada.

### Para continuar: auto-colocación y subgrid

`grid-auto-flow: row` coloca automáticamente por filas; `column` lo hace por
columnas. `dense` intenta rellenar huecos y puede adelantar visualmente un
elemento posterior: úsalo con cuidado cuando el orden importa.
[Referencia de grid-auto-flow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-flow).

Un grid anidado es independiente por defecto. `subgrid` permite que un hijo
que también es grid reutilice pistas del padre en el eje elegido; es útil
para alinear partes internas de varias tarjetas. No es necesario para esta
demo. [Guía de subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid).

## Responsive

### La estrategia actual: media query

```css
/* Más de 600 px: cuatro columnas. */
.grid-demo {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* 600 px o menos: dos columnas. */
@media (max-width: 600px) {
  .grid-demo { grid-template-columns: repeat(2, 1fr); }
  .header, .footer { flex-direction: column; }
}
```

Es una versión abreviada del código de la demo: las propiedades no redefinidas
siguen aplicándose. El CSS actual repite `display` y `gap` dentro de la media
query; no es necesario repetirlos para cambiar solo las columnas.

Extensión opcional para pantallas más estrechas: agrega esta regla **después**
de la de 600 px para que gane en la cascada con igual especificidad.

```css
@media (max-width: 400px) {
  .grid-demo { grid-template-columns: minmax(0, 1fr); }
}
```

### Alternativa: columnas automáticas

Para ensayar esta variante, reemplaza la definición de columnas y quita la
sobrescritura de columnas dentro de la media query; si la conservas, seguirá
forzando dos columnas en móvil.

```css
.grid-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 20px;
}
```

Se crean tantas columnas como quepan. El mínimo habitual es 220 px; `min(100%,
220px)` evita exigir más ancho que el contenedor cuando este es menor.
No equivale a "siempre tres columnas".

- `auto-fill` conserva las pistas vacías que caben.
- `auto-fit` colapsa pistas repetidas vacías y permite aprovechar su espacio.

La diferencia se nota con pocas tarjetas en un contenedor ancho.
Mantén las reglas responsive del header y footer: automatizar las tarjetas
no adapta por sí solo el resto de la página.
[Referencia de repeat y repetición automática](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat).

## Errores frecuentes y accesibilidad

| Síntoma | Qué revisar |
| --- | --- |
| Una propiedad no hace nada | ¿Está en el contenedor o en el hijo correcto? ¿Ese hijo es directo? |
| `justify-content` no centra verticalmente | Comprueba el eje principal y si hay altura/espacio libre. |
| `align-content` no cambia Flexbox | Necesita wrapping; para ver distribución, varias líneas y espacio transversal. |
| Las cajas no saltan de línea | El valor inicial es `nowrap`; comprueba sus tamaños y `flex-shrink`. |
| Las tarjetas se salen del ancho | Revisa mínimos de contenido, pistas, palabras largas y tamaños fijos. |
| El padding agranda demasiado las cajas | `box-sizing: border-box`, ya presente, incluye padding y borde en el tamaño declarado. |
| Un cambio no se ve en móvil | La media query puede estar sobrescribiendo esa propiedad. |
| Las columnas tienen anchos inesperados | `fr` convive con mínimos intrínsecos; no garantiza ignorar el contenido. |

No uses `order`, direcciones `reverse`, áreas ni `dense` para corregir un HTML
desordenado. El orden visual puede diferir del recorrido con teclado o lector
de pantalla. Mantén un orden lógico en el documento y prueba con Tab.
No uses anchos fijos para todo ni posiciones absolutas para maquetar esta demo.

## Ejercicios y comprobación

Haz un cambio por vez y restáuralo antes del siguiente si interfiere:

1. **Ejes:** cambia `.flex-demo` de `row` a `column`. Explica qué eje controla ahora `justify-content`.
2. **Distribución:** compara `center`, `space-between` y `space-evenly` con el mismo ancho disponible.
3. **Wrapping:** reduce el ancho con `wrap` y luego con `nowrap`. Observa si las cajas se reducen o desbordan.
4. **Crecimiento:** prueba `flex: 1 1 180px` y cambia solo el grow de la segunda caja a `2`.
5. **Líneas:** fija temporalmente una altura y fuerza varias líneas para comparar `align-items` y `align-content`.
6. **Pistas:** cambia las cuatro columnas por `repeat(3, minmax(0, 1fr))`: seis tarjetas forman dos filas.
7. **Colocación:** haz que la primera tarjeta ocupe dos columnas con `grid-column`.
8. **Breakpoint:** prueba 601 px y 600 px de ancho de viewport, no de la tarjeta: observa el salto de cuatro a dos columnas y el header rojo.
9. **Automático:** prueba `auto-fit` y `auto-fill`; deja solo dos tarjetas para ver la diferencia en una ventana ancha.
10. **Combinación:** conserva Grid para las tarjetas y usa Flexbox dentro de una tarjeta para una fila de botones.

En las herramientas de desarrollo del navegador, inspecciona `.flex-demo` y
`.grid-demo` y activa sus overlays de Flex/Grid. Comprueba reglas aplicadas,
reglas tachadas por la cascada y tamaños calculados. Los cambios hechos solo
en DevTools se pierden al recargar: pásalos al CSS si quieres conservarlos.

Lista de comprobación del código original:

- [ ] Se ven tres cajas y seis tarjetas sin instalar nada.
- [ ] En un viewport ancho las tarjetas tienen cuatro columnas.
- [ ] A 600 px o menos las tarjetas tienen dos columnas y el header es rojo.
- [ ] Header y footer pasan a columna en ese breakpoint.
- [ ] Puedes explicar qué propiedades están en el padre y cuáles en los hijos.
- [ ] Puedes elegir Flexbox o Grid según el problema, y combinarlos.

## Referencias

La guía cubre las propiedades de uso habitual y temas para continuar; no es
un catálogo de cada valor definido en las especificaciones. Para valores menos
comunes y compatibilidad de navegadores, consulta las referencias enlazadas
junto a cada sección y los módulos completos:

- [Módulo CSS Flexible Box Layout en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
- [Módulo CSS Grid Layout en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

Volver al [README del monorepo](../README.md).
