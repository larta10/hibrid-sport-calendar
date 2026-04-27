import Head from "next/head";
import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const CENTROS = [
  // MADRID
  { id:1,  nombre:"CrossFit Chamberí",       tipos:["CrossFit","HYROX"],         ciudad:"Madrid",                 ccaa:"Madrid",              direccion:"Chamberí, Madrid",                instagram:"crossfitchamberi",    web:"https://crossfitchamberi.com",    desc:"Box CrossFit y HYROX training en el corazón de Chamberí." },
  { id:2,  nombre:"CrossFit Alcobendas",     tipos:["CrossFit","HYROX"],         ciudad:"Alcobendas",             ccaa:"Madrid",              direccion:"Alcobendas, Madrid",              instagram:"crossfitalcobendas",  web:"",                                desc:"Box HYROX certificado al norte de Madrid." },
  { id:3,  nombre:"DK Fitness CrossFit",     tipos:["CrossFit","OCR"],           ciudad:"Majadahonda",            ccaa:"Madrid",              direccion:"Majadahonda, Madrid",             instagram:"dkfitnesscrossfit",   web:"",                                desc:"Especialistas en preparación OCR y CrossFit competitivo." },
  { id:4,  nombre:"CrossFit Las Rozas",      tipos:["CrossFit"],                 ciudad:"Las Rozas",              ccaa:"Madrid",              direccion:"Las Rozas de Madrid",             instagram:"crossfitlasrozas",    web:"",                                desc:"Box CrossFit con acceso rápido desde Madrid capital." },
  { id:5,  nombre:"R10 CrossFit Madrid",     tipos:["CrossFit","HYROX","OCR"],   ciudad:"Madrid",                 ccaa:"Madrid",              direccion:"Madrid",                          instagram:"r10crossfit",         web:"",                                desc:"Centro multidisciplinar con entrenamiento para HYROX y OCR." },
  // BARCELONA
  { id:6,  nombre:"CrossFit Gràcia",         tipos:["CrossFit","HYROX"],         ciudad:"Barcelona",              ccaa:"Cataluña",            direccion:"Gràcia, Barcelona",               instagram:"crossfitgracia",      web:"https://crossfitgracia.com",      desc:"Box CrossFit en el barrio de Gràcia con clases HYROX." },
  { id:7,  nombre:"CrossFit Born BCN",       tipos:["CrossFit"],                 ciudad:"Barcelona",              ccaa:"Cataluña",            direccion:"El Born, Barcelona",              instagram:"crossfitbornbcn",     web:"",                                desc:"Box en el Born con entrenamiento funcional de alto nivel." },
  { id:8,  nombre:"CrossFit Poblenou",       tipos:["CrossFit","OCR"],           ciudad:"Barcelona",              ccaa:"Cataluña",            direccion:"Poblenou, Barcelona",             instagram:"crossfitpoblenou",    web:"",                                desc:"CrossFit y preparación para OCR en el Poblenou." },
  { id:9,  nombre:"InSports Barcelona",      tipos:["HYROX","CrossFit"],         ciudad:"Barcelona",              ccaa:"Cataluña",            direccion:"Barcelona",                       instagram:"insports_bcn",         web:"https://insports.es",             desc:"Centro HYROX partner oficial y CrossFit en Barcelona." },
  { id:10, nombre:"CrossFit Mataró",         tipos:["CrossFit"],                 ciudad:"Mataró",                 ccaa:"Cataluña",            direccion:"Mataró, Barcelona",               instagram:"crossfitmataro",      web:"",                                desc:"Referencia CrossFit en el Maresme." },
  // COMUNIDAD VALENCIANA
  { id:11, nombre:"CrossFit Valencia",       tipos:["CrossFit","HYROX"],         ciudad:"Valencia",               ccaa:"Comunidad Valenciana",direccion:"Valencia",                        instagram:"crossfitvalencia",    web:"",                                desc:"Box CrossFit y HYROX en el centro de Valencia." },
  { id:12, nombre:"CrossFit Ruzafa",         tipos:["CrossFit"],                 ciudad:"Valencia",               ccaa:"Comunidad Valenciana",direccion:"Ruzafa, Valencia",                instagram:"crossfitruzafa",      web:"",                                desc:"Box en el vibrante barrio de Ruzafa, muy activo en competición." },
  { id:13, nombre:"CrossFit Paterna",        tipos:["CrossFit","OCR"],           ciudad:"Paterna",                ccaa:"Comunidad Valenciana",direccion:"Paterna, Valencia",               instagram:"crossfitpaterna",     web:"",                                desc:"Preparación OCR y CrossFit en Paterna." },
  { id:14, nombre:"CrossFit Alicante",       tipos:["CrossFit","HYROX"],         ciudad:"Alicante",               ccaa:"Comunidad Valenciana",direccion:"Alicante",                        instagram:"crossfitalicante",    web:"",                                desc:"Box CrossFit y HYROX training en Alicante." },
  // ANDALUCÍA
  { id:15, nombre:"CrossFit Sevilla",        tipos:["CrossFit","HYROX"],         ciudad:"Sevilla",                ccaa:"Andalucía",           direccion:"Sevilla",                         instagram:"crossfitsevilla",     web:"",                                desc:"Referencia CrossFit y HYROX en Sevilla." },
  { id:16, nombre:"CrossFit Triana",         tipos:["CrossFit"],                 ciudad:"Sevilla",                ccaa:"Andalucía",           direccion:"Triana, Sevilla",                 instagram:"crossfittriana",      web:"",                                desc:"Box en el icónico barrio de Triana, Sevilla." },
  { id:17, nombre:"CrossFit Málaga",         tipos:["CrossFit","HYROX","OCR"],   ciudad:"Málaga",                 ccaa:"Andalucía",           direccion:"Málaga",                          instagram:"crossfitmalaga",      web:"",                                desc:"Box CrossFit, HYROX y preparación OCR en Málaga." },
  { id:18, nombre:"CrossFit Fuengirola",     tipos:["CrossFit"],                 ciudad:"Fuengirola",             ccaa:"Andalucía",           direccion:"Fuengirola, Málaga",              instagram:"crossfitfuengirola",  web:"",                                desc:"CrossFit en la Costa del Sol, Fuengirola." },
  { id:19, nombre:"CrossFit Córdoba",        tipos:["CrossFit"],                 ciudad:"Córdoba",                ccaa:"Andalucía",           direccion:"Córdoba",                         instagram:"crossfitcordoba",     web:"",                                desc:"Box CrossFit en Córdoba." },
  { id:20, nombre:"CrossFit Granada",        tipos:["CrossFit","OCR"],           ciudad:"Granada",                ccaa:"Andalucía",           direccion:"Granada",                         instagram:"crossfitgranada",     web:"",                                desc:"CrossFit y trail running en Granada, ideal para OCR." },
  // PAÍS VASCO
  { id:21, nombre:"CrossFit Bilbao",         tipos:["CrossFit","HYROX"],         ciudad:"Bilbao",                 ccaa:"País Vasco",          direccion:"Bilbao",                          instagram:"crossfitbilbao",      web:"",                                desc:"Box CrossFit con training HYROX en Bilbao." },
  { id:22, nombre:"CrossFit Getxo",          tipos:["CrossFit","OCR"],           ciudad:"Getxo",                  ccaa:"País Vasco",          direccion:"Getxo, Bizkaia",                  instagram:"crossfitgetxo",       web:"",                                desc:"OCR y CrossFit en Getxo, preparación Spartan Race." },
  { id:23, nombre:"CrossFit Donostia",       tipos:["CrossFit"],                 ciudad:"San Sebastián",          ccaa:"País Vasco",          direccion:"San Sebastián / Donostia",        instagram:"crossfitdonostia",    web:"",                                desc:"Box CrossFit en Donostia/San Sebastián." },
  // ARAGÓN
  { id:24, nombre:"CrossFit Zaragoza",       tipos:["CrossFit","HYROX"],         ciudad:"Zaragoza",               ccaa:"Aragón",              direccion:"Zaragoza",                        instagram:"crossfitzaragoza",    web:"",                                desc:"Referencia CrossFit y HYROX en Aragón." },
  // MURCIA
  { id:25, nombre:"CrossFit Murcia",         tipos:["CrossFit"],                 ciudad:"Murcia",                 ccaa:"Murcia",              direccion:"Murcia",                          instagram:"crossfitmurcia",      web:"",                                desc:"Box CrossFit en Murcia." },
  { id:26, nombre:"CrossFit Cartagena",      tipos:["CrossFit","OCR"],           ciudad:"Cartagena",              ccaa:"Murcia",              direccion:"Cartagena, Murcia",               instagram:"crossfitcartagena",   web:"",                                desc:"CrossFit y preparación OCR en Cartagena." },
  // GALICIA
  { id:27, nombre:"CrossFit Coruña",         tipos:["CrossFit","OCR"],           ciudad:"A Coruña",               ccaa:"Galicia",             direccion:"A Coruña",                        instagram:"crossfitcoruna",      web:"",                                desc:"Box CrossFit en A Coruña con entrenamientos OCR." },
  { id:28, nombre:"CrossFit Vigo",           tipos:["CrossFit","HYROX"],         ciudad:"Vigo",                   ccaa:"Galicia",             direccion:"Vigo, Pontevedra",                instagram:"crossfitvigo",        web:"",                                desc:"Box CrossFit y HYROX training en Vigo." },
  // NAVARRA
  { id:29, nombre:"CrossFit Pamplona",       tipos:["CrossFit","OCR"],           ciudad:"Pamplona",               ccaa:"Navarra",             direccion:"Pamplona, Navarra",               instagram:"crossfitpamplona",    web:"",                                desc:"Box CrossFit en Pamplona, preparación Spartan Race." },
  // CASTILLA Y LEÓN
  { id:30, nombre:"CrossFit Valladolid",     tipos:["CrossFit"],                 ciudad:"Valladolid",             ccaa:"Castilla y León",     direccion:"Valladolid",                      instagram:"crossfitvalladolid",  web:"",                                desc:"Box CrossFit en Valladolid." },
  // CANTABRIA
  { id:31, nombre:"CrossFit Santander",      tipos:["CrossFit"],                 ciudad:"Santander",              ccaa:"Cantabria",           direccion:"Santander, Cantabria",            instagram:"crossfitsantander",   web:"",                                desc:"Box CrossFit en Santander." },
  // ASTURIAS
  { id:32, nombre:"CrossFit Oviedo",         tipos:["CrossFit","HYROX"],         ciudad:"Oviedo",                 ccaa:"Asturias",            direccion:"Oviedo, Asturias",                instagram:"crossfitoviedo",      web:"",                                desc:"Box CrossFit y HYROX training en Oviedo." },
  // CANARIAS
  { id:33, nombre:"CrossFit Las Palmas",     tipos:["CrossFit","HYROX"],         ciudad:"Las Palmas de G.C.",     ccaa:"Canarias",            direccion:"Las Palmas de Gran Canaria",      instagram:"crossfitlaspalmas",   web:"",                                desc:"Box CrossFit y HYROX en Gran Canaria." },
  { id:34, nombre:"CrossFit Tenerife",       tipos:["CrossFit","OCR"],           ciudad:"Santa Cruz de Tenerife", ccaa:"Canarias",            direccion:"Santa Cruz de Tenerife",          instagram:"crossfittenerife",    web:"",                                desc:"Box CrossFit en Tenerife, preparación Spartan Race Tenerife." },
  // BALEARES
  { id:35, nombre:"CrossFit Mallorca",       tipos:["CrossFit","HYROX"],         ciudad:"Palma de Mallorca",      ccaa:"Baleares",            direccion:"Palma de Mallorca",               instagram:"crossfitmallorca",    web:"",                                desc:"Box CrossFit y HYROX training en Palma de Mallorca." },
];

const TIPO_COLORS = {
  "CrossFit": { color:"#34D399", bg:"rgba(52,211,153,0.14)" },
  "HYROX":    { color:"#FACC15", bg:"rgba(250,204,21,0.12)" },
  "OCR":      { color:"#FB923C", bg:"rgba(251,146,60,0.14)" },
};

const CCAA_LIST = [...new Set(CENTROS.map(c => c.ccaa))].sort();

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function CentrosEntrenamiento() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Centros de entrenamiento CrossFit, HYROX y OCR en España",
    "description": "Directorio de gimnasios y boxes para entrenar CrossFit, HYROX y OCR en España.",
    "numberOfItems": CENTROS.length,
    "itemListElement": CENTROS.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": c.nombre,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": c.ciudad,
          "addressRegion": c.ccaa,
          "addressCountry": "ES",
        },
        "url": c.web || `https://www.instagram.com/${c.instagram}/`,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Centros de Entrenamiento CrossFit, HYROX y OCR en España | Hybrid Race Hub</title>
        <meta name="description" content="Directorio de los mejores gimnasios CrossFit, HYROX y OCR en España. Encuentra tu box más cercano para preparar tu próxima carrera híbrida." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/centros-entrenamiento" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/centros-entrenamiento" />
        <meta property="og:title" content="Centros de Entrenamiento CrossFit, HYROX y OCR en España" />
        <meta property="og:description" content="Directorio de los mejores gimnasios CrossFit, HYROX y OCR en España para preparar tu próxima carrera." />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Centros de Entrenamiento CrossFit, HYROX y OCR en España" />
        <meta name="twitter:description" content="Directorio de los mejores gimnasios CrossFit, HYROX y OCR en España." />
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
          --green:#34D399; --hyrox:#FACC15;
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
        .topbar-nav a.active { color:var(--accent-mid); border-color:rgba(251,146,60,0.3); }

        /* HERO */
        .page-hero { background:var(--bg); border-bottom:1px solid var(--border); padding:3rem 2rem 2.5rem; }
        .page-hero-inner { max-width:1100px; margin:0 auto; }
        .page-eyebrow { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:var(--accent-mid); margin-bottom:10px; }
        .page-title { font-family:var(--font-display); font-size:clamp(44px,7vw,80px); font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:0.95; color:var(--text); margin-bottom:14px; }
        .page-sub { font-family:var(--font-body); font-size:15px; color:var(--muted); max-width:600px; line-height:1.65; }

        /* STATS BAR */
        .stats-bar { display:flex; gap:2rem; flex-wrap:wrap; margin-top:1.5rem; }
        .stat-item { display:flex; flex-direction:column; gap:2px; }
        .stat-val { font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--accent); line-height:1; }
        .stat-lbl { font-family:var(--font-mono); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.14em; color:var(--muted); }

        /* FILTERS */
        .filters-bar { background:var(--surface); border-bottom:1px solid var(--border); padding:1rem 2rem; display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
        .filter-chip { font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; padding:6px 14px; border-radius:999px; border:0.5px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; transition:all .15s; }
        .filter-chip:hover { border-color:var(--border2); color:var(--text); }
        .filter-chip--on { background:var(--accent-bg); color:var(--accent-mid); border-color:rgba(251,146,60,0.4); }

        /* BODY */
        .centros-body { max-width:1100px; margin:0 auto; padding:2.5rem 2rem 4rem; }
        .ccaa-section { margin-bottom:3rem; }
        .ccaa-title { font-family:var(--font-display); font-size:22px; font-weight:800; text-transform:uppercase; letter-spacing:0.02em; color:var(--text); margin-bottom:1rem; display:flex; align-items:center; gap:10px; }
        .ccaa-title::after { content:""; flex:1; height:0.5px; background:var(--border); }
        .centros-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }

        /* CARD */
        .centro-card { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:1.25rem; display:flex; flex-direction:column; gap:10px; transition:transform .15s,border-color .15s,box-shadow .15s; }
        .centro-card:hover { transform:translateY(-2px); border-color:var(--border2); box-shadow:0 6px 24px rgba(0,0,0,0.35); }
        .centro-tipos { display:flex; gap:5px; flex-wrap:wrap; }
        .tipo-badge { font-family:var(--font-display); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; padding:2px 8px; border-radius:999px; }
        .centro-nombre { font-family:var(--font-display); font-size:20px; font-weight:800; text-transform:uppercase; letter-spacing:-0.01em; line-height:1.1; color:var(--text); }
        .centro-loc { font-family:var(--font-mono); font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; color:var(--muted); }
        .centro-desc { font-family:var(--font-body); font-size:13px; color:var(--muted); line-height:1.6; flex:1; }
        .centro-links { display:flex; gap:8px; flex-wrap:wrap; padding-top:8px; border-top:0.5px solid var(--border); }
        .centro-link { display:inline-flex; align-items:center; gap:5px; font-family:var(--font-mono); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; padding:5px 10px; border-radius:999px; border:0.5px solid var(--border); color:var(--muted); transition:color .15s,border-color .15s; }
        .centro-link:hover { color:var(--accent); border-color:rgba(251,146,60,0.3); }
        .centro-link--ig { color:var(--accent-mid); border-color:rgba(253,186,116,0.3); }
        .centro-link--ig:hover { border-color:var(--accent-mid); }
        .centro-map-link { margin-left:auto; }

        /* CTA block */
        .cta-block { background:var(--surface); border:0.5px solid var(--border); border-radius:var(--radius-lg); padding:2rem; text-align:center; margin-top:3rem; }
        .cta-block-title { font-family:var(--font-display); font-size:28px; font-weight:800; text-transform:uppercase; color:var(--text); margin-bottom:10px; }
        .cta-block-sub { font-family:var(--font-body); font-size:14px; color:var(--muted); margin-bottom:1.25rem; }
        .cta-btn { display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#08090C; font-family:var(--font-display); font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; padding:12px 24px; border-radius:var(--radius-sm); transition:transform .12s,box-shadow .12s; }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(251,146,60,0.4); }

        @media (max-width:720px) {
          .topbar { padding:0 1rem; }
          .page-hero { padding:2rem 1rem 1.5rem; }
          .centros-body { padding:1.5rem 1rem 3rem; }
          .filters-bar { padding:.75rem 1rem; }
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
          <Link href="/centros-entrenamiento" className="active">Centros</Link>
        </nav>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · Directorio</p>
          <h1 className="page-title">Centros de<br/>entrenamiento</h1>
          <p className="page-sub">
            Los mejores boxes CrossFit, centros HYROX y clubs OCR de España.
            Encuentra dónde entrenar para tu próxima carrera híbrida.
          </p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-val">{CENTROS.length}</span>
              <span className="stat-lbl">Centros</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{CCAA_LIST.length}</span>
              <span className="stat-lbl">CCAA</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">3</span>
              <span className="stat-lbl">Disciplinas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="centros-body">
        {CCAA_LIST.map(ccaa => {
          const centros = CENTROS.filter(c => c.ccaa === ccaa);
          return (
            <section key={ccaa} className="ccaa-section">
              <h2 className="ccaa-title">{ccaa}</h2>
              <div className="centros-grid">
                {centros.map(centro => (
                  <article key={centro.id} className="centro-card">
                    <div className="centro-tipos">
                      {centro.tipos.map(t => (
                        <span
                          key={t}
                          className="tipo-badge"
                          style={{ background: TIPO_COLORS[t]?.bg, color: TIPO_COLORS[t]?.color }}
                        >{t}</span>
                      ))}
                    </div>
                    <h3 className="centro-nombre">{centro.nombre}</h3>
                    <p className="centro-loc">{centro.direccion}</p>
                    <p className="centro-desc">{centro.desc}</p>
                    <div className="centro-links">
                      {centro.instagram && (
                        <a
                          href={`https://www.instagram.com/${centro.instagram}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="centro-link centro-link--ig"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                          @{centro.instagram}
                        </a>
                      )}
                      {centro.web && (
                        <a href={centro.web} target="_blank" rel="noreferrer" className="centro-link">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          Web
                        </a>
                      )}
                      <a
                        href={`https://maps.google.com?q=${encodeURIComponent(centro.nombre + " " + centro.direccion)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="centro-link centro-map-link"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        Mapa
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div className="cta-block">
          <p className="cta-block-title">¿Tu centro no aparece?</p>
          <p className="cta-block-sub">
            Escríbenos y lo añadimos al directorio. El listado es gratuito para boxes afiliados CrossFit, centros HYROX partner y clubs OCR.
          </p>
          <a href="/contacto-organizadores" className="cta-btn">AÑADIR MI CENTRO →</a>
        </div>

        {/* Enlazado interno */}
        <div style={{ marginTop:"2rem", display:"flex", gap:"0.75rem", flexWrap:"wrap", justifyContent:"center" }}>
          <Link href="/calendario" style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--accent)", border:"0.5px solid rgba(251,146,60,0.3)", borderRadius:999, padding:"6px 14px" }}>
            📅 Calendario de eventos →
          </Link>
          <Link href="/calculadora-hyrox" style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--muted)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:999, padding:"6px 14px" }}>
            🧮 Calculadora HYROX →
          </Link>
          <Link href="/blog" style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--font-mono)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--muted)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:999, padding:"6px 14px" }}>
            📖 Blog y guías →
          </Link>
        </div>
      </div>
    </>
  );
}
