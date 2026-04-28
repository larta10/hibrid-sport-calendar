import React, { useState, useMemo } from "react";
const { haversine } = require("../lib/distance");
import Head from "next/head";
import Link from "next/link";
import centrosJson from "../lib/centros-entrenamiento.json";

/* ── Data helpers ────────────────────────────────────────────────────────── */
const CCAA_LIST = [...new Set(centrosJson.map((c) => c.ccaa).filter(Boolean))].sort();
const TIPO_LIST = [...new Set(centrosJson.map((c) => c.tipo).filter(Boolean))].sort();
const TOTAL = centrosJson.length;

// haversine helper moved to lib/distance.js
const CIUDADES = [...new Set(centrosJson.map((c) => c.ciudad).filter(Boolean))].length;

const TIPO_COLOR = {
  CrossFit:        { color: "#34D399", bg: "rgba(52,211,153,0.14)" },
  HYROX:           { color: "#FACC15", bg: "rgba(250,204,21,0.14)" },
  OCR:             { color: "#FB923C", bg: "rgba(251,146,60,0.18)" },
  Funcional:       { color: "#60A5FA", bg: "rgba(96,165,250,0.14)" },
  Multidisciplinar:{ color: "#C084FC", bg: "rgba(192,132,252,0.14)" },
};

/* Haversine function defined earlier (first definition kept) */

/* ── Proximity expansion ─────────────────────────────────────────────────── */
const MIN_RESULTS = 3;

function expandByProximity(exactResults, allCentros, query, activeCCAA, userLat, userLng) {
  if (exactResults.length >= MIN_RESULTS) return { results: exactResults, expanded: false, reason: "" };

  const pool = activeCCAA ? allCentros.filter((c) => c.ccaa === activeCCAA) : allCentros;
  const exactIds = new Set(exactResults.map((c) => c.id));

  // Detect if query looks like a CP (5 digits)
  const isCP = /^\d{4,5}$/.test(query.trim());

  let expanded = [];
  let reason = "";

  if (isCP) {
    const q = query.trim().padStart(5, "0");
    const province = q.slice(0, 2);

    // Same province (first 2 CP digits)
    expanded = pool.filter(
      (c) => !exactIds.has(c.id) && c.codigo_postal && c.codigo_postal.startsWith(province)
    );
    reason = "Misma provincia";

    // Still not enough → same CCAA
    if (exactResults.length + expanded.length < MIN_RESULTS) {
      const ccaas = new Set([...exactResults, ...expanded].map((c) => c.ccaa).filter(Boolean));
      const byCCAA = pool.filter(
        (c) => !exactIds.has(c.id) && !expanded.find((e) => e.id === c.id) && ccaas.has(c.ccaa)
      );
      expanded = [...expanded, ...byCCAA];
      reason = "Misma comunidad";
    }
  } else {
    // Text search: expand to same CCAA as any exact result
    const ccaas = new Set(exactResults.map((c) => c.ccaa).filter(Boolean));
    if (ccaas.size === 0 && activeCCAA) ccaas.add(activeCCAA);
    expanded = pool.filter(
      (c) => !exactIds.has(c.id) && ccaas.has(c.ccaa)
    );
    reason = "Misma comunidad";
  }

  // Build combined list (exact + expanded) and annotate distances if user location is available
  const additional = expanded.slice(0, Math.max(0, MIN_RESULTS - exactResults.length + 5));
  const combined = [...exactResults, ...additional];
  if (userLat != null && userLng != null) {
    combined.forEach((c) => {
      if (c.lat != null && c.lng != null) {
        c.distKm = haversine(userLat, userLng, c.lat, c.lng);
      } else {
        c.distKm = (c.distKm != null) ? c.distKm : null;
      }
    });
    combined.sort((a,b)=>{
      const da = (typeof a.distKm === 'number') ? a.distKm : Infinity;
      const db = (typeof b.distKm === 'number') ? b.distKm : Infinity;
      return da - db;
    });
  }
  return { results: combined, expanded: expanded.length > 0, reason };
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function CentrosEntrenamiento() {
  const [search, setSearch] = useState("");
  const [activeCCAA, setActiveCCAA] = useState(null);
  const [activeTipo, setActiveTipo] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  // Intentar obtener ubicación del usuario para búsquedas por proximidad
  React.useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      }, () => {}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 });
    }
  }, []);

  const { exact, proximity, proximityReason } = useMemo(() => {
    let pool = centrosJson;
    if (activeCCAA) pool = pool.filter((c) => c.ccaa === activeCCAA);
    if (activeTipo) pool = pool.filter((c) => c.tipo === activeTipo);

    const q = search.trim().toLowerCase();
    if (!q) {
      // Devolver exactamente la misma lista con dist=null cuando no hay búsqueda
      return { exact: pool.map(c => ({...c, distKm: null})), proximity: [], proximityReason: "" };
    }

    const exactRaw = pool.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.ciudad.toLowerCase().includes(q) ||
        (c.codigo_postal && c.codigo_postal.includes(q)) ||
        c.direccion.toLowerCase().includes(q)
    );

    const exactResults = exactRaw.map((c) => ({
      ...c,
      distKm: (userLat != null && userLng != null && c.lat != null && c.lng != null) ? haversine(userLat, userLng, c.lat, c.lng) : null
    }));

    const { results, expanded, reason } = expandByProximity(exactResults, pool, q, activeCCAA, userLat, userLng);
    const expandedIds = new Set(exactResults.map((c) => c.id));
    const prox = results.filter((c) => !expandedIds.has(c.id));
    prox.forEach((c) => {
      if (c.lat != null && c.lng != null && c.distKm == null) {
        c.distKm = (userLat != null && userLng != null) ? haversine(userLat, userLng, c.lat, c.lng) : null;
      }
    });
    const sortFn = (a,b) => {
      const da = a.distKm ?? Infinity;
      const db = b.distKm ?? Infinity;
      return da - db;
    };
    const exactSorted = [...exactResults].sort(sortFn);
    const proxSorted  = [...prox].sort(sortFn);
    return { exact: exactSorted, proximity: proxSorted, proximityReason: expanded ? reason : "" };
  }, [search, activeCCAA, activeTipo, userLat, userLng]);

  const grouped = useMemo(() => {
    if (search.trim()) return null;
    const g = {};
    exact.forEach((c) => {
      const key = c.ccaa || "Otras";
      if (!g[key]) g[key] = [];
      g[key].push(c);
    });
    return g;
  }, [exact, search]);

  const totalShown = exact.length + proximity.length;
  const noResults = search.trim() && exact.length === 0 && proximity.length === 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Centros de entrenamiento OCR, HYROX y CrossFit en España",
    description: "Directorio de centros de entrenamiento funcional, HYROX, OCR y CrossFit en España.",
    numberOfItems: TOTAL,
    itemListElement: centrosJson.slice(0, 50).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: c.nombre,
        address: {
          "@type": "PostalAddress",
          streetAddress: c.direccion,
          addressLocality: c.ciudad,
          postalCode: c.codigo_postal,
          addressRegion: c.ccaa,
          addressCountry: "ES",
        },
        ...(c.web ? { url: c.web } : {}),
        ...(c.telefono ? { telephone: c.telefono } : {}),
        ...(c.lat ? { geo: { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng } } : {}),
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Dónde Entrenar: OCR, HYROX y CrossFit en España | Hybrid Race Hub</title>
        <meta
          name="description"
          content={`Directorio de ${TOTAL}+ centros de entrenamiento funcional, HYROX, OCR y CrossFit en España. Busca por ciudad o código postal y encuentra dónde preparar tu próxima carrera híbrida.`}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/centros-entrenamiento" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/centros-entrenamiento" />
        <meta property="og:title" content="Dónde Entrenar: OCR, HYROX y CrossFit en España" />
        <meta property="og:description" content={`Directorio de ${TOTAL}+ centros de entrenamiento funcional, HYROX, OCR y CrossFit en España.`} />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dónde Entrenar: OCR, HYROX y CrossFit en España" />
        <meta name="twitter:description" content={`Directorio de ${TOTAL}+ centros de entrenamiento funcional en España.`} />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#08090C; --bg2:#0F1015; --surface:#13151C; --surface2:#1A1D26;
          --border:rgba(255,255,255,0.08); --border2:rgba(255,255,255,0.16);
          --text:#F5F5F7; --muted:#8C8E9A; --muted2:#5D5F6B;
          --accent:#FB923C; --accent-bg:rgba(251,146,60,0.14); --accent-mid:#FDBA74;
          --font-display:"Barlow Condensed","Arial Narrow",sans-serif;
          --font-body:"Inter",-apple-system,sans-serif;
          --font-mono:"JetBrains Mono",ui-monospace,monospace;
          --radius:12px; --radius-sm:8px; --radius-lg:16px;
        }
        body { background:var(--bg); color:var(--text); font-family:var(--font-body); }
        a { color:inherit; text-decoration:none; }

        .topbar { background:var(--bg); border-bottom:1px solid var(--border); height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 2rem; }
        .brand { display:flex; align-items:center; gap:14px; }
        .brand-logo { width:34px; height:34px; clip-path:polygon(15% 0,100% 0,85% 100%,0 100%); background:linear-gradient(135deg,#FB923C 0%,#FACC15 100%); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:16px; font-weight:900; color:#08090C; }
        .brand-name { font-family:var(--font-display); font-size:17px; font-weight:800; text-transform:uppercase; color:var(--text); }
        .brand-sub { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); }
        .topbar-nav { display:flex; gap:4px; }
        .topbar-nav a { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); padding:6px 12px; border-radius:var(--radius-sm); border:0.5px solid transparent; transition:color .15s,border-color .15s; }
        .topbar-nav a:hover { color:var(--text); border-color:var(--border2); }
        .topbar-nav a.active { color:var(--accent-mid); border-color:rgba(251,146,60,0.3); }

        .page-hero { background:var(--bg); border-bottom:1px solid var(--border); padding:3rem 2rem 2.5rem; }
        .page-hero-inner { max-width:1100px; margin:0 auto; }
        .page-eyebrow { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--accent-mid); margin-bottom:10px; }
        .page-title { font-family:var(--font-display); font-size:clamp(36px,6vw,70px); font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:0.95; color:var(--text); margin-bottom:14px; }
        .page-sub { font-family:var(--font-body); font-size:15px; color:var(--muted); max-width:640px; line-height:1.65; }
        .stats-bar { display:flex; gap:2rem; flex-wrap:wrap; margin-top:1.5rem; }
        .stat-item { display:flex; flex-direction:column; gap:2px; }
        .stat-val { font-family:var(--font-display); font-size:32px; font-weight:800; color:var(--accent); line-height:1; }
        .stat-lbl { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); }

        .search-bar { background:var(--surface); border-bottom:1px solid var(--border); padding:1rem 2rem; }
        .search-bar-inner { max-width:1100px; margin:0 auto; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .search-input-wrap { position:relative; flex:1; min-width:200px; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted2); pointer-events:none; }
        .search-input { width:100%; background:var(--surface2); border:0.5px solid var(--border2); border-radius:var(--radius-sm); padding:10px 12px 10px 36px; font-family:var(--font-body); font-size:14px; color:var(--text); outline:none; transition:border-color .15s; }
        .search-input::placeholder { color:var(--muted2); }
        .search-input:focus { border-color:rgba(251,146,60,0.4); }
        .result-count { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); white-space:nowrap; }

        .filters-bar { background:var(--surface); border-bottom:1px solid var(--border); padding:.6rem 2rem; display:flex; gap:0; flex-direction:column; }
        .filter-row { display:flex; gap:6px; flex-wrap:wrap; align-items:center; padding:.35rem 0; }
        .filter-row + .filter-row { border-top:0.5px solid var(--border); }
        .filter-label { font-family:var(--font-mono); font-size:8px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--muted2); white-space:nowrap; min-width:40px; }
        .filter-chip { font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; padding:4px 11px; border-radius:999px; border:0.5px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; white-space:nowrap; transition:all .15s; }
        .filter-chip:hover { border-color:var(--border2); color:var(--text); }
        .filter-chip--on { background:var(--accent-bg); color:var(--accent-mid); border-color:rgba(251,146,60,0.4); }
        .filter-chip--tipo { }
        .filter-chip--tipo.filter-chip--on { background:rgba(96,165,250,0.14); color:#93C5FD; border-color:rgba(96,165,250,0.4); }

        .centros-body { max-width:1100px; margin:0 auto; padding:2.5rem 2rem 4rem; }
        .section-head { margin-bottom:1rem; display:flex; align-items:center; gap:10px; }
        .section-head::after { content:""; flex:1; height:0.5px; background:var(--border); }
        .ccaa-title { font-family:var(--font-display); font-size:19px; font-weight:800; text-transform:uppercase; letter-spacing:0.02em; color:var(--text); }
        .section-count { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted2); }
        .ccaa-section { margin-bottom:2.5rem; }
        .centros-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:12px; }

        .proximity-notice { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); background:var(--surface); border:0.5px dashed var(--border2); border-radius:var(--radius-sm); padding:10px 16px; margin-bottom:1rem; }

        .centro-card { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius); padding:1.1rem; display:flex; flex-direction:column; gap:8px; transition:transform .15s,border-color .15s,box-shadow .15s; }
        .centro-card:hover { transform:translateY(-2px); border-color:var(--border2); box-shadow:0 6px 24px rgba(0,0,0,0.35); }
        .centro-card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
        .tipo-badge { font-family:var(--font-display); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; padding:2px 8px; border-radius:999px; flex-shrink:0; margin-top:2px; }
        .centro-nombre { font-family:var(--font-display); font-size:17px; font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:1.15; color:var(--text); flex:1; }
        .centro-loc { display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }
        .centro-ciudad { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--accent-mid); }
        .centro-cp { font-family:var(--font-mono); font-size:10px; font-weight:500; color:var(--muted2); }
        .centro-dir { font-family:var(--font-body); font-size:12px; color:var(--muted); line-height:1.5; flex:1; }
        .centro-links { display:flex; gap:6px; flex-wrap:wrap; padding-top:8px; border-top:0.5px solid var(--border); }
        .centro-link { display:inline-flex; align-items:center; gap:4px; font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; padding:4px 10px; border-radius:999px; border:0.5px solid var(--border); color:var(--muted); transition:color .15s,border-color .15s; }
        .centro-link:hover { color:var(--accent); border-color:rgba(251,146,60,0.3); }
        .centro-link--web { color:var(--accent-mid); border-color:rgba(253,186,116,0.25); }
        .centro-link--web:hover { border-color:var(--accent-mid); }
        .centro-link--tel { color:#93C5FD; border-color:rgba(147,197,253,0.25); }
        .centro-link--tel:hover { border-color:#93C5FD; }

        .no-results { text-align:center; padding:4rem 2rem; color:var(--muted); }
        .no-results strong { display:block; font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text); text-transform:uppercase; margin-bottom:8px; }

        .cta-block { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:2rem; text-align:center; margin-top:3rem; }
        .cta-block-title { font-family:var(--font-display); font-size:26px; font-weight:800; text-transform:uppercase; color:var(--text); margin-bottom:8px; }
        .cta-block-sub { font-family:var(--font-body); font-size:14px; color:var(--muted); margin-bottom:1.25rem; line-height:1.6; }
        .cta-btn { display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#08090C; font-family:var(--font-display); font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; padding:12px 24px; border-radius:var(--radius-sm); transition:transform .12s,box-shadow .12s; }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(251,146,60,0.4); }

        .bottom-links { margin-top:2rem; display:flex; gap:.75rem; flex-wrap:wrap; justify-content:center; }
        .bottom-link { display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; border-radius:999px; padding:6px 14px; }
        .bottom-link--accent { color:var(--accent); border:0.5px solid rgba(251,146,60,0.3); }
        .bottom-link--muted { color:var(--muted); border:0.5px solid rgba(255,255,255,0.08); }

        @media (max-width:720px) {
          .topbar { padding:0 1rem; }
          .topbar-nav a { font-size:9px; padding:5px 8px; }
          .page-hero { padding:2rem 1rem 1.5rem; }
          .centros-body { padding:1.5rem 1rem 3rem; }
          .search-bar { padding:.75rem 1rem; }
          .filters-bar { padding:.5rem 1rem; }
          .centros-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <Link href="/" className="brand">
          <div className="brand-logo">H</div>
          <div>
            <div className="brand-name">Hybrid Race Hub</div>
            <div className="brand-sub">OCR · HYROX · Functional</div>
          </div>
        </Link>
        <nav className="topbar-nav">
          <Link href="/">Inicio</Link>
          <Link href="/calendario">Calendario</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/calculadora-hyrox">Calculadora</Link>
          <Link href="/centros-entrenamiento" className="active">Centros</Link>
        </nav>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · Directorio nacional</p>
          <h1 className="page-title">
            Tu Mapa de Entrenamiento Híbrido en España
          </h1>
          <p className="page-sub">
            Directorio de centros OCR, HYROX, CrossFit y entrenamiento funcional en toda España.
            Busca por ciudad o código postal y encuentra dónde preparar tu próxima carrera.
          </p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-val">{TOTAL}+</span>
              <span className="stat-lbl">Centros</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{CCAA_LIST.length}</span>
              <span className="stat-lbl">CCAA</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{CIUDADES}</span>
              <span className="stat-lbl">Ciudades</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{TIPO_LIST.length}</span>
              <span className="stat-lbl">Especialidades</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <div className="search-bar-inner">
          <div className="search-input-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className="search-input"
              placeholder="Ciudad, código postal o nombre del centro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar centros de entrenamiento"
            />
          </div>
          <span className="result-count">{totalShown} resultado{totalShown !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-row">
          <span className="filter-label">Tipo</span>
          <button
            className={`filter-chip filter-chip--tipo${!activeTipo ? " filter-chip--on" : ""}`}
            onClick={() => setActiveTipo(null)}
          >
            Todos
          </button>
          {TIPO_LIST.map((t) => (
            <button
              key={t}
              className={`filter-chip filter-chip--tipo${activeTipo === t ? " filter-chip--on" : ""}`}
              onClick={() => setActiveTipo(activeTipo === t ? null : t)}
              style={activeTipo === t ? { background: TIPO_COLOR[t]?.bg, color: TIPO_COLOR[t]?.color, borderColor: TIPO_COLOR[t]?.color + "66" } : {}}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label">CCAA</span>
          <button
            className={`filter-chip${!activeCCAA ? " filter-chip--on" : ""}`}
            onClick={() => setActiveCCAA(null)}
          >
            Todas
          </button>
          {CCAA_LIST.map((ccaa) => (
            <button
              key={ccaa}
              className={`filter-chip${activeCCAA === ccaa ? " filter-chip--on" : ""}`}
              onClick={() => setActiveCCAA(activeCCAA === ccaa ? null : ccaa)}
            >
              {ccaa}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="centros-body">
        {noResults && (
          <div className="no-results">
            <strong>Sin resultados exactos</strong>
            No hay centros registrados para &quot;{search}&quot; todavía.
            <br />
            <span style={{ fontSize: 13, marginTop: 8, display: "block" }}>
              Prueba con una ciudad cercana o un código postal de la provincia.
            </span>
          </div>
        )}

        {/* Exact results */}
        {search.trim() && exact.length > 0 && (
          <div className="centros-grid" style={{ marginBottom: proximity.length ? "2rem" : 0 }}>
            {exact.map((c) => <CentroCard key={c.id} centro={c} />)}
          </div>
        )}

        {/* Proximity expansion */}
        {proximity.length > 0 && (
          <>
            <p className="proximity-notice">
              {exact.length === 0
                ? `No hay centros exactos para "${search}" — mostrando centros de la ${proximityReason.toLowerCase()}:`
                : `También cerca (${proximityReason.toLowerCase()}):`}
            </p>
            <div className="centros-grid">
              {proximity.map((c) => <CentroCard key={c.id} centro={c} />)}
            </div>
          </>
        )}

        {/* Grouped (no search) */}
        {grouped &&
          Object.entries(grouped)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([ccaa, boxes]) => (
              <section key={ccaa} className="ccaa-section">
                <div className="section-head">
                  <h2 className="ccaa-title">{ccaa}</h2>
                  <span className="section-count">{boxes.length} centro{boxes.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="centros-grid">
                  {boxes.map((c) => <CentroCard key={c.id} centro={c} />)}
                </div>
              </section>
            ))}

        {/* CTA */}
        <div className="cta-block">
          <p className="cta-block-title">¿Tu centro no aparece?</p>
          <p className="cta-block-sub">
            Si gestionas un centro de entrenamiento funcional, CrossFit, HYROX u OCR
            y quieres aparecer en el directorio, escríbenos. El listado es gratuito.
          </p>
          <a href="/contacto-organizadores" className="cta-btn">
            Añadir mi centro →
          </a>
        </div>

        <div className="bottom-links">
          <Link href="/calendario" className="bottom-link bottom-link--accent">
            Calendario de eventos →
          </Link>
          <Link href="/calculadora-hyrox" className="bottom-link bottom-link--muted">
            Calculadora HYROX →
          </Link>
          <Link href="/blog" className="bottom-link bottom-link--muted">
            Blog y guías →
          </Link>
        </div>
      </div>
    </>
  );
}

/* ── Card ───────────────────────────────────────────────────────────────── */
function CentroCard({ centro }) {
  const tc = TIPO_COLOR[centro.tipo] || { color: "#8C8E9A", bg: "rgba(140,142,154,0.12)" };
  const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(
    [centro.nombre, centro.direccion, centro.ciudad].filter(Boolean).join(" ")
  )}`;
  const hasWeb = centro.web && centro.web.trim();
  const hasTel = !!centro.telefono;
  const showLinks = hasWeb || hasTel;

  return (
    <article className="centro-card">
      <div className="centro-card-header">
        <h3 className="centro-nombre">{centro.nombre}</h3>
        {centro.tipo && (
          <span className="tipo-badge" style={{ background: tc.bg, color: tc.color }}>
            {centro.tipo}
          </span>
        )}
      </div>

      {(centro.ciudad || centro.codigo_postal) && (
        <div className="centro-loc">
          {centro.ciudad && <span className="centro-ciudad">{centro.ciudad}</span>}
          {centro.codigo_postal && <span className="centro-cp">{centro.codigo_postal}</span>}
        </div>
      )}

      {centro.direccion && <p className="centro-dir">{centro.direccion}</p>}
      {typeof centro.distKm === 'number' && centro.distKm >= 0 && (
        <div className="centro-dist" style={{fontSize: 12, color: 'var(--muted)'}}>A ~{centro.distKm.toFixed(1)} km</div>
      )}

      {showLinks && (
        <div className="centro-links">
          {hasWeb && (
            <a
              href={centro.web}
              target="_blank"
              rel="noreferrer noopener"
              className="centro-link centro-link--web"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M22 12a10 10 0 1 1-9-9"/>
                <path d="M15 7h6v6"/>
              </svg>
              Web
            </a>
          )}
          {hasTel && (
            <a href={`tel:${centro.telefono.replace(/[\s-]/g, "")}`} className="centro-link centro-link--tel">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
              Llamar
            </a>
          )}
          <a href={mapsUrl} target="_blank" rel="noreferrer noopener" className="centro-link" style={{ marginLeft: "auto" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Mapa
          </a>
        </div>
      )}
    </article>
  );
}
