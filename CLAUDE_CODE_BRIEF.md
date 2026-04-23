# Brief para Claude Code — Hybrid Race Hub (rediseño)

**Repo:** `larta10/hibrid-sport-calendar` · branch `main`
**Stack actual:** Next.js (Pages Router) + Supabase (REST). Archivo principal: `pages/index.js`.
**Objetivo:** rediseñar la home manteniendo toda la lógica actual (fetch, filtros, estado) pero con un **nuevo sistema visual** tipo "American hybrid sports" — inspirado en Rogue Fitness / CrossFit / Spartan / HYROX. Tema oscuro, tipografía condensada en mayúsculas, paleta naranja/amarillo sobre negro profundo.

Tienes permiso completo para editar `pages/index.js` y añadir archivos nuevos (`styles/`, `components/`, `public/fonts/`).

---

## 1. Reglas de oro

1. **No romper la lógica existente.** El fetch a Supabase, los filtros (`ccaa`, `modalParents`, `modalSubs`, `formats`, `dateRange`), el debounce de 320ms y el `MonthRangePicker` se mantienen. Solo cambia el *visual layer*.
2. **El nicho sigue siendo `ocr` + `funcional`.** No tocar `NICHE_PARENTS`.
3. **Mobile first real.** Probar en 390 / 768 / 1440. Nada se rompe, nada se sale.
4. **Cero emojis decorativos** en UI final (los del código actual en `MODALITIES.icon` se pueden sustituir por un glifo SVG minimalista — ver §6).
5. **Sin gradientes AI-slop.** Un solo gradiente puntual en el logo y en el hover del CTA primario. Nada más.

---

## 2. Design tokens — pegar en `styles/globals.css` o archivo nuevo

```css
:root {
  /* Base neutros */
  --bg:        #08090C;
  --bg2:       #0F1015;
  --surface:   #13151C;
  --surface2:  #1A1D26;
  --border:    rgba(255,255,255,0.08);
  --border2:   rgba(255,255,255,0.16);
  --hint:      #272932;
  --text:      #F5F5F7;
  --muted:     #8C8E9A;
  --muted2:    #5D5F6B;

  /* Modalidades (reemplazan los actuales) */
  --ocr:       #FB923C;             /* Spartan orange */
  --ocr-bg:    rgba(251,146,60,0.14);
  --hyrox:     #FACC15;             /* HYROX yellow */
  --hyrox-bg:  rgba(250,204,21,0.12);

  /* Acento global = naranja */
  --accent:    #FB923C;
  --accent-bg: rgba(251,146,60,0.14);
  --accent-mid:#FDBA74;

  /* Estados */
  --green:     #34D399;
  --green-bg:  rgba(52,211,153,0.14);
  --red:       #F87171;
  --red-bg:    rgba(248,113,113,0.14);

  /* Tipografía */
  --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-body:    "Inter", -apple-system, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  /* Radii */
  --radius-sm: 8px;
  --radius:    12px;
  --radius-lg: 16px;
}
```

Actualizar la constante `C` en `pages/index.js` para que lea estos tokens (o sustituirla por clases CSS — preferido).

---

## 3. Tipografía

Importar desde Google Fonts en `_document.js` o en `<Head>`:
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap
```

**Reglas de uso:**
- **Barlow Condensed** (display) — títulos grandes, nombres de prueba, números de precio, botones primarios. SIEMPRE en `text-transform: uppercase` con `letter-spacing: -0.01em`.
- **Inter** (body) — descripciones, chips, labels largos.
- **JetBrains Mono** (técnico) — fechas (`24 MAY 2026`), etiquetas tipo `FORMATO`, contadores, distancias, números de versión.

**Escala aproximada (desktop):**
| Uso | Font | Size | Weight | Case |
|---|---|---|---|---|
| Hero title | Display | 136px | 800 | UPPER |
| Section title | Display | 72px | 800 | UPPER |
| Race card name | Display | 22px | 700 | UPPER |
| Detail stat number | Display | 32–44px | 800 | — |
| Body / sub | Body | 18px | 400 | — |
| Chip / filter | Body | 11–12px | 500/600 | — |
| Mono label | Mono | 10–11px | 500 | UPPER · letter-spacing 0.14em |

---

## 4. Layout — desktop

```
┌──────────────────────────────────────────────────────────────┐
│ HERO (full-width)                                            │
│   [H] HYBRID RACE HUB · 412 EVENTOS       nav (4 items)      │
│                                                              │
│   ● CALENDARIO HÍBRIDO · ESPAÑA 2026                         │
│   OCR/HYROX/CROSSFIT.    (display 136px)                     │
│   Un solo hub para carreras híbridas…                        │
│   [412] eventos   [19] CCAA   [04:00] sync   [6] formatos    │
├────────────────┬─────────────────────────────────────────────┤
│ SIDEBAR 300px  │ MAIN                                        │
│                │                                             │
│ Filtros   ×    │ 38 Eventos                  [Sort buttons]  │
│ ──────────     │ Mar→Jun · Cataluña…                         │
│ ▌FORMATO       │ [active filters pills row]                  │
│  [Indiv] …     │                                             │
│ ▌TIPO          │ ┌────┐ ┌────┐ ┌────┐                        │
│  ⚡OCR▲         │ │card│ │card│ │card│   grid auto-fill      │
│   [Spartan]…   │ └────┘ └────┘ └────┘   minmax(300px,1fr)    │
│ ▌CCAA          │ …                                           │
│ ▌FECHAS        │                                             │
│  [year nav]    │                                             │
│  [12 months]   │                                             │
├────────────────┴─────────────────────────────────────────────┤
│ DETAIL SHOWCASE (expanded card demo)                         │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

El sidebar actual ya está en 268px — **ampliar a 300px** para que entren los chips de CCAA sin ahogarse.

---

## 5. Hero — nuevo bloque

Reemplazar el `<header>` de 56px por un hero de ~480px con:

```jsx
<header className="hero">
  <div className="hero-inner">
    <Brand totalCount={totalCount} refreshing={refreshing} />
    <Nav />
  </div>

  <div className="hero-headline">
    <div className="hero-eyebrow">
      <span className="pulse" /> Calendario híbrido · España 2026
    </div>
    <h1 className="hero-title">
      OCR<span className="slash">/</span>
      <span className="hy">HYROX</span><span className="slash">/</span>
      CROSSFIT.
    </h1>
    <p className="hero-sub">
      Un solo hub para las <strong>carreras híbridas, OCR y competiciones funcionales</strong> en España.
      Filtra por formato, comunidad y mes. Actualizado a diario desde las fuentes oficiales.
    </p>
    <HeroStats />
  </div>
</header>
```

El `<h1>` en tablet baja a 88px, en móvil a 54px (usar `clamp()` o media queries).

El logo debe ser un rombo recortado con `clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%)` y fondo `linear-gradient(135deg, var(--ocr) 0%, var(--hyrox) 100%)`, con la letra "H" en Barlow Condensed 900.

---

## 6. Iconografía de modalidades

Sustituir los emojis `⚡` y `🏋` en `MODALITIES` por **glifos SVG inline** que combinen con el tema industrial:

- OCR → triángulo con barra horizontal (estilo Spartan).
- Funcional → kettlebell o dos pesas geométricas.

Si no hay tiempo, aceptable dejar los emojis solo en los chips del sidebar, pero **no** en las pills de las race cards. Las cards solo llevan texto (`SPARTAN`, `HYROX`, etc.) en Barlow Condensed.

---

## 7. Componente `<RaceCard>` — reemplazo completo

Cambiar el estilo actual (cerrado/expandible) por dos variantes:

### 7.1 Vista colapsada (grid)

```
┌─────────────────────────────────────┐
│ [SPARTAN]  [ABIERTA]                │  ← tags estilo americano
│                                     │
│ SPARTAN SUPER MADRID                │  ← Barlow Condensed 22px 700
│ 24 MAY 2026 · San Agustín           │  ← Mono 11px
│ ─────────────────────────────────── │
│ Individual · 10 km          110€    │  ← footer con border-top
└─────────────────────────────────────┘
```

- Border radius 16px, bg `--surface`, border `--border`.
- Hover: `translateY(-2px)`, border `--border2`, shadow suave.
- Primera card del grid es `featured`: glow naranja sutil (`box-shadow: 0 0 0 1px rgba(251,146,60,0.2), 0 8px 32px rgba(251,146,60,0.06)`) y banda "DESTACADA" rotada 35° en la esquina superior derecha.

### 7.2 Vista expandida (modal o sección showcase)

Al hacer click, en vez de expandir inline como ahora, **abrir un modal centrado** (o un drawer lateral en desktop) con esta estructura:

```
┌──────────────────────────────────────┐
│ [SPARTAN · SUPER]  [ABIERTA]         │
│ SPARTAN SUPER MADRID 2026            │  ← Display 44px
│ 24 MAY · San Agustín · Madrid        │
│ ┌──────────┬──────────┬──────────┐   │
│ │ DISTANCIA│ FORMATO  │ PRECIO   │   │
│ │   10 KM  │  INDIV.  │   110€   │   │  ← grid 3 columnas, bordes finos
│ │ 25+ obst │ +equipos │ hasta... │   │
│ └──────────┴──────────┴──────────┘   │
│ Descripción de la prueba...          │
│ [IR A INSCRIPCIÓN →]  [Guardar ★]    │
└──────────────────────────────────────┘
```

CTA primario: fondo `--accent`, texto negro, Barlow Condensed 700 UPPER. Hover: `translateY(-1px)` + shadow naranja.

---

## 8. Sidebar — ajustes

Mantener las 4 secciones (`Formato`, `Tipo de prueba`, `CCAA`, `Fechas`) pero:

- **Header del sidebar** con título "FILTROS" en Barlow 700 UPPER + botón "Limpiar ×" a la derecha.
- **Label de sección** (`FORMATO`, etc.) en mono 10px, `letter-spacing: 0.16em`, con un `▌` (barra vertical de 3×11px) a la izquierda. Cuando la sección tiene filtros activos, label y barra se tiñen de `--accent-mid`.
- **Chips** con border-radius 999px. Estado off: `background: --surface2`, `color: --muted`. Estado on: borde 1.5px del color de la modalidad, bg tenue del color, texto saturado. En móvil, los chips reducen padding.
- **`MonthRangePicker`** — aumentar ligeramente el tamaño de las celdas en móvil (mínimo 44px de alto para touch). Mantener la lógica actual intacta.

---

## 9. Main — zona de resultados

Añadir encima del grid:

1. **Results head** — contador gigante (`38 EVENTOS` en display 36px, número en color `--accent`) + subtítulo mono (`Mar → Jun · Cataluña · Madrid · OCR + Funcional`). A la derecha: 3 botones de orden (`Fecha ↑`, `Precio`, `Cercanía`) + toggle grid/list.
2. **Active filters row** — pills `--accent-bg` con la `×` para quitar cada filtro individualmente.
3. **Grid** — `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`, gap 12px.

---

## 10. Responsive

```css
/* tablet */
@media (max-width: 1024px) {
  .hero-title { font-size: 88px; }
  .body { grid-template-columns: 260px 1fr; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
}

/* mobile */
@media (max-width: 720px) {
  .nav { display: none; }                /* sustituir por menú hamburguesa si hay tiempo */
  .hero-title { font-size: 60px; }
  .body { grid-template-columns: 1fr; }  /* sidebar arriba, luego main */
  .sidebar { border-right: none; border-bottom: 1px solid var(--border); position: relative; }
  .grid { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
```

**Importante:** en móvil, el sidebar actual ocupa toda la pantalla antes de los resultados. Eso es aceptable como v1, pero idealmente colapsarlo en un drawer con un botón "Filtros (3)" sticky arriba del listado.

---

## 11. Performance y SEO

- Mantener `<Head>` con title/description actuales, pero actualizar el `<title>` a:
  `"Hybrid Race Hub — Calendario OCR, HYROX y CrossFit en España"`
- Añadir `<link rel="preconnect">` a Supabase y a Google Fonts.
- Preload de `Barlow-Condensed-700` y `Inter-500`.
- Lighthouse objetivo: Performance ≥ 90, Accesibilidad ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## 12. Criterios de aceptación

- [ ] El fetch a Supabase y los filtros siguen funcionando idénticos.
- [ ] Hero nuevo con título gigante `OCR/HYROX/CROSSFIT.` en display.
- [ ] Paleta actualizada (naranja + amarillo, fuera del violeta como color primario — mantenerlo solo para acentos secundarios si hace falta).
- [ ] Cards en grid con la tipografía condensada; primera card con badge "DESTACADA".
- [ ] Click en card abre modal/drawer con stats en grid 3×1 (desktop) / 1×3 (móvil) y CTA "Ir a inscripción" en naranja sólido.
- [ ] Sidebar con header "FILTROS" + botón limpiar; barras verticales en los labels; chips con estados limpios.
- [ ] Responsive testeado en 390 / 768 / 1440. Sin scroll horizontal. Sin texto cortado.
- [ ] Fuentes cargando con `display=swap`.
- [ ] Sin emojis en las cards de resultados.

---

## 13. Referencias de estilo

- **Rogue Fitness** — cómo usan Barlow/Oswald condensed en ALL CAPS con colores sólidos.
- **CrossFit.com** — jerarquía tipográfica brutal, negros profundos, naranjas saturados.
- **HYROX** — amarillo ácido sobre negro, mono-weight tipográfico.
- **Spartan Race** — naranja-rojo, tipografía muscular, uso de "/" como separador de disciplinas.

La combinación naranja (OCR) + amarillo (HYROX) ya está en el código actual en `MODALITIES.color` — este rediseño solo sube su protagonismo al nivel de la marca.

---

## 14. Fuera de alcance (no hacer en esta iteración)

- No añadir login / cuenta de usuario.
- No añadir guardar favoritos (el botón "Guardar ★" es solo visual de momento).
- No cambiar el esquema de la tabla `races`.
- No añadir mapa interactivo (la nav lo promete, dejar el link como `#` de momento).
