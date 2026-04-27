import { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";

/* ─── HYROX structure ──────────────────────────────────────────────────────── */
const STATIONS = [
  { id:"s1",  label:"SkiErg",             detail:"1.000 m",   icon:"⛷️",  tipo:"station" },
  { id:"s2",  label:"Sled Push",          detail:"50 m",      icon:"🛷",  tipo:"station" },
  { id:"s3",  label:"Sled Pull",          detail:"50 m",      icon:"🪢",  tipo:"station" },
  { id:"s4",  label:"Burpee Broad Jump",  detail:"80 m",      icon:"💥",  tipo:"station" },
  { id:"s5",  label:"Rowing",             detail:"1.000 m",   icon:"🚣",  tipo:"station" },
  { id:"s6",  label:"Farmer's Carry",     detail:"200 m",     icon:"🏋️",  tipo:"station" },
  { id:"s7",  label:"Sandbag Lunges",     detail:"100 m",     icon:"🎒",  tipo:"station" },
  { id:"s8",  label:"Wall Balls",         detail:"100 reps",  icon:"🏀",  tipo:"station" },
];

// 8 laps (before each station) + 8 stations = 16 inputs total
const ROUNDS = Array.from({ length: 8 }, (_, i) => ({
  run:     { id: `r${i+1}`, label: `Carrera ${i+1}`, detail: "1 km" },
  station: STATIONS[i],
}));

const CATEGORIES = [
  { label:"Elite Hombres",  max:55*60,           color:"#FACC15" },
  { label:"Elite Mujeres",  min:55*60, max:65*60, color:"#FACC15" },
  { label:"Open Hombres",   min:55*60, max:90*60, color:"#34D399" },
  { label:"Open Mujeres",   min:65*60, max:105*60,color:"#34D399" },
  { label:"PRO Hombres",    min:45*60, max:55*60, color:"#FB923C" },
];

const TARGET_TIMES = [
  { cat:"Elite Hombres",  time:"< 55:00", color:"#FACC15" },
  { cat:"Sub-60 Hombres", time:"55:00 – 60:00", color:"#FDBA74" },
  { cat:"Open Hombres",   time:"60:00 – 1:30:00", color:"#34D399" },
  { cat:"Elite Mujeres",  time:"< 65:00", color:"#FACC15" },
  { cat:"Open Mujeres",   time:"65:00 – 1:45:00", color:"#34D399" },
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function parseTime(val) {
  if (!val || val.trim() === "") return 0;
  const parts = val.trim().split(":");
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + Math.min(s, 59);
  }
  if (parts.length === 1) {
    return (parseInt(parts[0], 10) || 0) * 60;
  }
  return 0;
}

function formatSeconds(totalSec) {
  if (!totalSec) return "—";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}

function getCategory(totalSec) {
  if (!totalSec) return null;
  const min = totalSec / 60;
  if (min < 45) return { label:"PRO / Elite top", color:"#FB923C", note:"Rendimiento de competición internacional" };
  if (min < 55) return { label:"Elite Hombres / PRO", color:"#FACC15", note:"Nivel de competición top" };
  if (min < 60) return { label:"Sub-60 — Muy sólido", color:"#FDBA74", note:"Rendimiento alto, cerca de la élite" };
  if (min < 75) return { label:"Open — Nivel avanzado", color:"#34D399", note:"Tiempo competitivo en categoría Open" };
  if (min < 90) return { label:"Open — Nivel medio", color:"#34D399", note:"Rango habitual de participantes Open" };
  if (min < 105) return { label:"Finisher — Buen resultado", color:"#8C8E9A", note:"¡Completar HYROX ya es un logro!" };
  return { label:"Finisher", color:"#5D5F6B", note:"Sigue entrenando, cada intento suma" };
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function CalculadoraHyrox() {
  const initTimes = {};
  ROUNDS.forEach(r => { initTimes[r.run.id] = ""; initTimes[r.station.id] = ""; });
  const [times, setTimes] = useState(initTimes);

  const set = useCallback((id, val) => {
    // Only allow digits and colon
    const clean = val.replace(/[^0-9:]/g, "").slice(0, 5);
    setTimes(prev => ({ ...prev, [id]: clean }));
  }, []);

  const totalSec = Object.values(times).reduce((acc, v) => acc + parseTime(v), 0);
  const hasAny   = Object.values(times).some(v => v.trim() !== "");
  const category = hasAny ? getCategory(totalSec) : null;

  const runTotal     = ROUNDS.reduce((acc, r) => acc + parseTime(times[r.run.id]), 0);
  const stationTotal = ROUNDS.reduce((acc, r) => acc + parseTime(times[r.station.id]), 0);

  function reset() { setTimes(initTimes); }

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Calculadora HYROX — Hybrid Race Hub",
    "applicationCategory": "Sports",
    "description": "Calcula tu tiempo total en HYROX introduciendo los tiempos de cada estación y carrera. Descubre tu categoría: Elite, Open o Finisher.",
    "url": "https://hybridracehub.com/calculadora-hyrox",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
    "operatingSystem": "Web",
  };

  return (
    <>
      <Head>
        <title>Calculadora HYROX — Estima tu Tiempo Total | Hybrid Race Hub</title>
        <meta name="description" content="Calcula tu tiempo estimado en HYROX introduciendo los tiempos de cada estación (SkiErg, Sled Push, Rowing...) y las 8 carreras de 1km. Descubre tu categoría." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/calculadora-hyrox" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/calculadora-hyrox" />
        <meta property="og:title" content="Calculadora HYROX — Estima tu Tiempo Total" />
        <meta property="og:description" content="Calcula tu tiempo estimado en HYROX. Introduce los tiempos de tus 8 carreras y 8 estaciones y obtén tu tiempo total y categoría." />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calculadora HYROX — Hybrid Race Hub" />
        <meta name="twitter:description" content="Calcula tu tiempo total estimado en HYROX por estación." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#08090C; --bg2:#0F1015; --surface:#13151C; --surface2:#1A1D26;
          --border:rgba(255,255,255,0.08); --border2:rgba(255,255,255,0.16);
          --text:#F5F5F7; --muted:#8C8E9A; --muted2:#5D5F6B;
          --accent:#FB923C; --accent-bg:rgba(251,146,60,0.14); --accent-mid:#FDBA74;
          --green:#34D399; --green-bg:rgba(52,211,153,0.14);
          --hyrox:#FACC15; --hyrox-bg:rgba(250,204,21,0.12);
          --font-display:"Barlow Condensed","Arial Narrow",sans-serif;
          --font-body:"Inter",-apple-system,sans-serif;
          --font-mono:"JetBrains Mono",ui-monospace,monospace;
          --radius:12px; --radius-sm:8px; --radius-lg:16px;
        }
        body { background:var(--bg); color:var(--text); font-family:var(--font-body); }
        a { color:inherit; text-decoration:none; }

        /* NAV */
        .topbar { background:var(--bg); border-bottom:1px solid var(--border); height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 2rem; }
        .brand { display:flex; align-items:center; gap:14px; }
        .brand-logo { width:34px; height:34px; clip-path:polygon(15% 0,100% 0,85% 100%,0 100%); background:linear-gradient(135deg,#FB923C 0%,#FACC15 100%); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:16px; font-weight:900; color:#08090C; }
        .brand-name { font-family:var(--font-display); font-size:17px; font-weight:800; text-transform:uppercase; color:var(--text); }
        .brand-sub { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); }
        .topbar-nav { display:flex; gap:4px; }
        .topbar-nav a { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); padding:6px 12px; border-radius:var(--radius-sm); border:0.5px solid transparent; transition:color .15s,border-color .15s; }
        .topbar-nav a:hover { color:var(--text); border-color:var(--border2); }
        .topbar-nav a.active { color:var(--hyrox); border-color:rgba(250,204,21,0.3); }

        /* HERO */
        .page-hero { background:var(--bg); border-bottom:1px solid var(--border); padding:3rem 2rem 2.5rem; }
        .page-hero-inner { max-width:900px; margin:0 auto; }
        .page-eyebrow { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--hyrox); margin-bottom:10px; }
        .page-title { font-family:var(--font-display); font-size:clamp(44px,7vw,80px); font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:0.95; color:var(--text); margin-bottom:14px; }
        .page-title span { color:var(--hyrox); }
        .page-sub { font-family:var(--font-body); font-size:15px; color:var(--muted); max-width:600px; line-height:1.65; }

        /* LAYOUT */
        .calc-body { max-width:900px; margin:0 auto; padding:2rem 2rem 4rem; display:grid; grid-template-columns:1fr 320px; gap:2rem; align-items:start; }

        /* ROUNDS */
        .rounds-list { display:flex; flex-direction:column; gap:10px; }
        .round-block { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; }
        .round-header { background:var(--surface2); padding:.6rem 1rem; display:flex; align-items:center; gap:8px; border-bottom:0.5px solid var(--border); }
        .round-num { font-family:var(--font-display); font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--accent); }
        .round-rows { display:grid; grid-template-columns:1fr 1fr; }
        .time-row { padding:.85rem 1rem; display:flex; flex-direction:column; gap:6px; }
        .time-row:first-child { border-right:0.5px solid var(--border); }
        .time-row-top { display:flex; align-items:center; gap:8px; }
        .time-icon { font-size:14px; line-height:1; }
        .time-label { font-family:var(--font-display); font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.02em; color:var(--text); }
        .time-detail { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted2); }
        .time-input {
          width:100%; font-family:var(--font-mono); font-size:18px; font-weight:600;
          background:var(--bg2); color:var(--text); border:1px solid var(--border2);
          border-radius:var(--radius-sm); padding:8px 10px; outline:none;
          transition:border-color .15s; letter-spacing:0.05em; text-align:center;
        }
        .time-input:focus { border-color:var(--accent); }
        .time-input::placeholder { color:var(--muted2); font-size:14px; }

        /* RESULT PANEL */
        .result-panel { position:sticky; top:1.5rem; display:flex; flex-direction:column; gap:12px; }
        .result-card { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; }
        .result-label { font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--muted); margin-bottom:8px; }
        .result-time { font-family:var(--font-display); font-size:clamp(48px,8vw,72px); font-weight:800; text-transform:uppercase; letter-spacing:-0.02em; color:var(--hyrox); line-height:1; margin-bottom:4px; }
        .result-time--empty { color:var(--muted2); }
        .result-splits { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:1rem; padding-top:1rem; border-top:0.5px solid var(--border); }
        .split-item { display:flex; flex-direction:column; gap:3px; }
        .split-lbl { font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--muted2); }
        .split-val { font-family:var(--font-display); font-size:22px; font-weight:800; color:var(--text); }
        .cat-card { padding:1.25rem; background:var(--surface); border-radius:var(--radius-lg); border:0.5px solid var(--border); }
        .cat-label { font-family:var(--font-mono); font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--muted); margin-bottom:8px; }
        .cat-name { font-family:var(--font-display); font-size:22px; font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:1.1; margin-bottom:6px; }
        .cat-note { font-family:var(--font-body); font-size:12px; color:var(--muted); line-height:1.5; }
        .reset-btn { width:100%; font-family:var(--font-display); font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; background:transparent; color:var(--muted); border:0.5px solid var(--border); border-radius:var(--radius-sm); padding:10px; cursor:pointer; transition:color .15s,border-color .15s; }
        .reset-btn:hover { color:var(--text); border-color:var(--border2); }

        /* REFERENCE TABLE */
        .ref-card { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:1.25rem; }
        .ref-title { font-family:var(--font-display); font-size:16px; font-weight:800; text-transform:uppercase; letter-spacing:0.02em; color:var(--text); margin-bottom:12px; }
        .ref-row { display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:0.5px solid var(--border); }
        .ref-row:last-child { border-bottom:none; }
        .ref-cat { font-family:var(--font-body); font-size:12px; color:var(--muted); }
        .ref-time { font-family:var(--font-mono); font-size:12px; font-weight:600; }

        /* TIPS */
        .tips-card { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:1.25rem; }
        .tips-title { font-family:var(--font-display); font-size:16px; font-weight:800; text-transform:uppercase; color:var(--text); margin-bottom:10px; }
        .tip-item { font-family:var(--font-body); font-size:12px; color:var(--muted); padding:5px 0; border-bottom:0.5px solid var(--border); line-height:1.5; }
        .tip-item:last-child { border-bottom:none; }

        @media (max-width:720px) {
          .topbar { padding:0 1rem; }
          .page-hero { padding:2rem 1rem 1.5rem; }
          .calc-body { grid-template-columns:1fr; padding:1.5rem 1rem 3rem; gap:1.5rem; }
          .result-panel { position:relative; top:0; }
          .round-rows { grid-template-columns:1fr; }
          .time-row:first-child { border-right:none; border-bottom:0.5px solid var(--border); }
          .topbar-nav { display:none; }
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
          <Link href="/calculadora-hyrox" className="active">Calculadora</Link>
          <Link href="/centros-entrenamiento">Centros</Link>
        </nav>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · Herramienta</p>
          <h1 className="page-title">Calculadora<br/><span>HYROX</span></h1>
          <p className="page-sub">
            Introduce los tiempos de tus 8 carreras (1 km cada una) y 8 estaciones.
            Calcula tu tiempo total estimado y descubre en qué categoría entrarías.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div className="calc-body">
        {/* Left: rounds */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.14em", color:"var(--muted)" }}>
              Introduce tiempos en formato MM:SS (ej: 4:30)
            </span>
            <button className="reset-btn" style={{ width:"auto", padding:"6px 14px" }} onClick={reset}>
              Limpiar
            </button>
          </div>

          <div className="rounds-list">
            {ROUNDS.map((round, i) => (
              <div key={i} className="round-block">
                <div className="round-header">
                  <span className="round-num">Ronda {i + 1}</span>
                </div>
                <div className="round-rows">
                  {/* Run */}
                  <div className="time-row">
                    <div className="time-row-top">
                      <span className="time-icon">🏃</span>
                      <div>
                        <div className="time-label">Carrera</div>
                        <div className="time-detail">1 km</div>
                      </div>
                    </div>
                    <input
                      className="time-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM:SS"
                      value={times[round.run.id]}
                      onChange={e => set(round.run.id, e.target.value)}
                      aria-label={`Tiempo carrera ronda ${i+1}`}
                    />
                  </div>
                  {/* Station */}
                  <div className="time-row">
                    <div className="time-row-top">
                      <span className="time-icon">{round.station.icon}</span>
                      <div>
                        <div className="time-label">{round.station.label}</div>
                        <div className="time-detail">{round.station.detail}</div>
                      </div>
                    </div>
                    <input
                      className="time-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM:SS"
                      value={times[round.station.id]}
                      onChange={e => set(round.station.id, e.target.value)}
                      aria-label={`Tiempo ${round.station.label} ronda ${i+1}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Internal links */}
          <div style={{ marginTop:"2rem", display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
            <Link href="/calendario/madrid" style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--accent)", border:"0.5px solid rgba(251,146,60,0.3)", borderRadius:999, padding:"6px 14px" }}>
              📅 Próximas HYROX España →
            </Link>
            <Link href="/centros-entrenamiento" style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--muted)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:999, padding:"6px 14px" }}>
              🏋️ Centros de entrenamiento →
            </Link>
            <Link href="/productos/relojes" style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--muted)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:999, padding:"6px 14px" }}>
              ⌚ Relojes GPS para HYROX →
            </Link>
          </div>
        </div>

        {/* Right: result panel */}
        <div className="result-panel">
          {/* Total time */}
          <div className="result-card">
            <p className="result-label">Tiempo total estimado</p>
            <div className={`result-time${!hasAny ? " result-time--empty" : ""}`}>
              {hasAny ? formatSeconds(totalSec) : "0:00"}
            </div>
            <div className="result-splits">
              <div className="split-item">
                <span className="split-lbl">Carrera total</span>
                <span className="split-val" style={{ color:"var(--accent)" }}>
                  {hasAny ? formatSeconds(runTotal) : "—"}
                </span>
              </div>
              <div className="split-item">
                <span className="split-lbl">Estaciones total</span>
                <span className="split-val" style={{ color:"var(--hyrox)" }}>
                  {hasAny ? formatSeconds(stationTotal) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="cat-card">
            <p className="cat-label">Categoría estimada</p>
            {category ? (
              <>
                <p className="cat-name" style={{ color: category.color }}>{category.label}</p>
                <p className="cat-note">{category.note}</p>
              </>
            ) : (
              <p className="cat-name" style={{ color:"var(--muted2)" }}>Introduce tiempos</p>
            )}
          </div>

          {/* Reference times */}
          <div className="ref-card">
            <p className="ref-title">Tiempos de referencia</p>
            {TARGET_TIMES.map((t, i) => (
              <div key={i} className="ref-row">
                <span className="ref-cat">{t.cat}</span>
                <span className="ref-time" style={{ color: t.color }}>{t.time}</span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="tips-card">
            <p className="tips-title">Pesos reglamentarios</p>
            <div className="tip-item">🛷 <strong>Sled Push:</strong> 152kg H / 102kg M</div>
            <div className="tip-item">🪢 <strong>Sled Pull:</strong> 103kg H / 78kg M</div>
            <div className="tip-item">🏋️ <strong>Farmer's Carry:</strong> 2×24kg H / 2×16kg M</div>
            <div className="tip-item">🎒 <strong>Sandbag Lunges:</strong> 20kg H / 10kg M</div>
            <div className="tip-item">🏀 <strong>Wall Balls:</strong> 9kg (3m) H / 6kg (2.7m) M</div>
          </div>

          <button className="reset-btn" onClick={reset}>Reiniciar calculadora</button>
        </div>
      </div>
    </>
  );
}
