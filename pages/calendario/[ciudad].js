import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SUPABASE_URL, ANON_KEY, NICHE_PARENTS, formatDate } from "../../lib/shared";

const CIUDADES = {
  bilbao: {
    name: "Bilbao",
    ccaa: "País Vasco",
    keywords: ["Hyrox Bilbao 2026", "carreras OCR Bilbao", "atletismo híbrido Bilbao"],
    metaTitle: "Carreras OCR y HYROX en Bilbao 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Bilbao y País Vasco 2026. Todos los eventos, fechas y detalles de inscripción.",
    intro: "Bilbao y el País Vasco son uno de los destinos más activos del calendario de carreras híbridas en el norte de España. Desde pruebas OCR en los montes vascos hasta competiciones HYROX en instalaciones cubiertas de Bilbao, la región ofrece una variada oferta para atletas de todos los niveles.",
    training: "El País Vasco cuenta con una sólida infraestructura de boxes de CrossFit y centros de fitness funcional en el área metropolitana de Bilbao. Los parques y montes de los alrededores (Pagasarri, Gorbea) ofrecen terreno ideal para preparar las partes de trail de las carreras OCR. Para entrenamiento específico de HYROX en Bilbao, busca cajas y gimnasios afiliados a HYROX que ofrecen clases grupales con el equipamiento oficial.",
  },
  barcelona: {
    name: "Barcelona",
    ccaa: "Cataluña",
    keywords: ["Hyrox Barcelona 2026", "carreras OCR Barcelona", "OCR Cataluña"],
    metaTitle: "Carreras OCR y HYROX en Barcelona 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Barcelona y Cataluña 2026. Todos los eventos, fechas e inscripciones.",
    intro: "Barcelona es uno de los centros de referencia para el deporte funcional y las carreras híbridas en España. La ciudad y su región cuentan con una amplia oferta de eventos OCR y HYROX, así como infraestructuras de entrenamiento de primer nivel. El Parque Natural del Montnegre o el Garraf son escenarios habituales para pruebas de trail y OCR.",
    training: "El ecosistema deportivo de Barcelona y Cataluña incluye numerosos boxes de CrossFit, gimnasios funcionales y centros afiliados a HYROX distribuidos por toda la ciudad. Para el entrenamiento de trail y OCR, las montañas de Collserola, el Montserrat y el Garraf ofrecen rutas de dificultad variable perfectas para preparar cualquier nivel.",
  },
  madrid: {
    name: "Madrid",
    ccaa: "Madrid",
    keywords: ["Hyrox Madrid 2026", "carreras OCR Madrid 2026", "fitness funcional Madrid"],
    metaTitle: "Carreras OCR y HYROX en Madrid 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Madrid 2026. Todos los eventos, fechas y detalles de inscripción.",
    intro: "Madrid concentra algunos de los eventos de fitness funcional más importantes de España. La capital alberga regularmente ediciones de HYROX, campeonatos de CrossFit y carreras OCR tanto en instalaciones cubiertas como en los espacios naturales que rodean la ciudad. La Sierra de Guadarrama es el escenario natural por excelencia para las pruebas de trail y OCR en la región.",
    training: "Madrid cuenta con la mayor concentración de boxes y gimnasios de fitness funcional de España. Encontrarás centros afiliados a HYROX en todos los barrios, así como múltiples opciones para entrenamiento específico de OCR. Para el trail, la Sierra de Guadarrama, el Hayedo de Montejo y los parques del norte ofrecen terreno variado para todos los niveles.",
  },
  valencia: {
    name: "Valencia",
    ccaa: "Comunidad Valenciana",
    keywords: ["Hyrox Valencia 2026", "OCR Valencia", "carreras funcionales Valencia"],
    metaTitle: "Carreras OCR y HYROX en Valencia 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Valencia y la Comunidad Valenciana 2026. Todos los eventos y fechas.",
    intro: "Valencia y la Comunidad Valenciana tienen una escena creciente de fitness funcional y carreras híbridas. La ciudad alberga eventos HYROX en sus instalaciones deportivas y las sierras del interior (Mariola, Aitana, Calderona) acogen regularmente pruebas de OCR y trail running con obstáculos. El clima mediterráneo favorece la práctica deportiva durante casi todo el año.",
    training: "La red de boxes de CrossFit y centros de fitness funcional en Valencia ha crecido significativamente en los últimos años. Para el entrenamiento específico de OCR, los parques naturales del entorno valenciano ofrecen terreno variado: desde la playa hasta el monte. Muchos clubs de trail running locales organizan entrenamientos específicos para carreras de obstáculos.",
  },
  malaga: {
    name: "Málaga",
    ccaa: "Andalucía",
    keywords: ["Hyrox Málaga 2026", "OCR Málaga 2026", "carreras montaña Málaga"],
    metaTitle: "Carreras OCR y HYROX en Málaga 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Málaga y Andalucía 2026. Todos los eventos, fechas e inscripciones.",
    intro: "Málaga y el litoral malagueño son cada vez más protagonistas en el calendario de carreras híbridas andaluzas. La provincia combina perfectamente las pruebas en recintos urbanos con las carreras en la Sierra de las Nieves o el Parque Natural Montes de Málaga. El clima benigno permite competir prácticamente cualquier mes del año.",
    training: "Málaga cuenta con una comunidad fitness funcional activa con boxes de CrossFit y centros de entrenamiento funcional bien equipados. La sierra ofrece entornos ideales para el entrenamiento de trail y los componentes de fuerza funcional propios del OCR. Muchos centros locales organizan salidas de preparación específica para pruebas híbridas.",
  },
  sevilla: {
    name: "Sevilla",
    ccaa: "Andalucía",
    keywords: ["carreras OCR Sevilla", "fitness funcional Sevilla", "HYROX Sevilla 2026"],
    metaTitle: "Carreras OCR y HYROX en Sevilla 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Sevilla y Andalucía 2026. Todos los eventos, fechas y detalles.",
    intro: "Sevilla tiene una escena deportiva de fitness funcional y carreras híbridas en expansión. La capital andaluza acoge eventos de HYROX y CrossFit en sus instalaciones deportivas, mientras que los parques naturales cercanos (Sierra Norte de Sevilla, Doñana) sirven de escenario para pruebas de OCR y trail. El Parque María Luisa y las riberas del Guadalquivir son puntos habituales de entrenamiento.",
    training: "El tejido de boxes y centros de fitness funcional en Sevilla ha crecido notablemente. Para el entrenamiento de trail y OCR, la Sierra Norte sevillana ofrece rutas de exigencia variable. Las temperaturas extremas del verano hacen que los entrenamientos se concentren en mañanas muy tempranas o en instalaciones climatizadas durante los meses de julio y agosto.",
  },
  zaragoza: {
    name: "Zaragoza",
    ccaa: "Aragón",
    keywords: ["carreras híbridas Zaragoza", "OCR Aragón", "HYROX Zaragoza 2026"],
    metaTitle: "Carreras OCR y HYROX en Zaragoza 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Zaragoza y Aragón 2026. Todos los eventos, fechas e inscripciones.",
    intro: "Zaragoza y Aragón se han consolidado como un punto de referencia para las carreras híbridas en el nordeste español. La ciudad acoge eventos de fitness funcional en sus modernos polideportivos y los Pirineos aragoneses son uno de los escenarios más espectaculares del OCR en España, con pruebas que combinan trail técnico con obstáculos de alta exigencia.",
    training: "Zaragoza cuenta con una comunidad crossfitter activa con boxes bien equipados en toda la ciudad. Para el entrenamiento específico de OCR y trail, la proximidad de los Pirineos es una ventaja enorme: desde las montañas del Moncayo hasta el Pirineo oscense, los atletas aragoneses tienen acceso a algunos de los mejores terrenos de entrenamiento de España.",
  },
  murcia: {
    name: "Murcia",
    ccaa: "Murcia",
    keywords: ["OCR Murcia 2026", "carreras funcionales Murcia", "HYROX Murcia"],
    metaTitle: "Carreras OCR y HYROX en Murcia 2026 | Hybrid Race Hub",
    metaDesc: "Calendario de carreras OCR, HYROX y pruebas híbridas en Murcia 2026. Todos los eventos, fechas e inscripciones.",
    intro: "Murcia tiene una comunidad de deporte funcional y OCR en crecimiento. La región murciana combina instalaciones deportivas modernas para eventos HYROX y CrossFit con el entorno natural de la Sierra Espuña y el Noroeste murciano para pruebas de OCR. El clima seco y soleado favorece la práctica deportiva al aire libre durante la mayor parte del año.",
    training: "En Murcia encontrarás boxes de CrossFit y centros de fitness funcional distribuidos por toda la ciudad y su área metropolitana. Para el entrenamiento al aire libre, la Sierra Espuña ofrece rutas técnicas con buen desnivel, perfectas para preparar los componentes de trail de las carreras OCR. La costa del Mar Menor también se utiliza para entrenamientos de resistencia.",
  },
};

const SLUG_TO_PATH_PARAMS = Object.keys(CIUDADES).map(slug => ({ params: { ciudad: slug } }));

export async function getStaticPaths() {
  return { paths: SLUG_TO_PATH_PARAMS, fallback: false };
}

export async function getStaticProps({ params }) {
  const cityData = CIUDADES[params.ciudad];
  if (!cityData) return { notFound: true };
  return { props: { slug: params.ciudad, cityData } };
}

export default function CalendarioCiudad({ slug, cityData }) {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const p = new URLSearchParams();
    p.set("select", "*");
    p.set("modalidad_parent", `in.(${NICHE_PARENTS.join(",")})`);
    p.set("fecha_iso", `gte.${today}`);
    p.set("comunidad", `eq.${cityData.ccaa}`);
    p.set("order", "fecha_iso.asc");
    p.set("limit", "20");
    fetch(`${SUPABASE_URL}/rest/v1/races?${p}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    })
      .then(r => r.json())
      .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setEvents([]); setLoading(false); });
  }, [cityData.ccaa]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://hybridracehub.com/" },
      { "@type": "ListItem", "position": 2, "name": "Calendario", "item": "https://hybridracehub.com/calendario" },
      { "@type": "ListItem", "position": 3, "name": cityData.name, "item": `https://hybridracehub.com/calendario/${slug}` },
    ],
  };

  return (
    <>
      <Head>
        <title>{cityData.metaTitle}</title>
        <meta name="description" content={cityData.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://hybridracehub.com/calendario/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://hybridracehub.com/calendario/${slug}`} />
        <meta property="og:title" content={cityData.metaTitle} />
        <meta property="og:description" content={cityData.metaDesc} />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cityData.metaTitle} />
        <meta name="twitter:description" content={cityData.metaDesc} />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #08090C; --bg2: #0F1015; --surface: #13151C; --surface2: #1A1D26;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7; --muted: #8C8E9A; --muted2: #5D5F6B; --hint: #272932;
          --accent: #FB923C; --accent-bg: rgba(251,146,60,0.14); --accent-mid: #FDBA74;
          --green: #34D399;
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
          --radius: 12px; --radius-sm: 8px; --radius-lg: 16px;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        a { color: inherit; text-decoration: none; }
        .topbar { background: var(--bg); border-bottom: 1px solid var(--border); height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-logo-img { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; display: block; }
        .brand-name { font-family: var(--font-display); font-size: 17px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em; color: var(--text); }
        .brand-sub { font-family: var(--font-mono); font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); }
        .topbar-nav { display: flex; gap: 4px; }
        .topbar-nav a { font-family: var(--font-mono); font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); padding: 6px 12px; border-radius: var(--radius-sm); border: 0.5px solid transparent; transition: color .15s, border-color .15s; }
        .topbar-nav a:hover { color: var(--text); border-color: var(--border2); }

        .breadcrumb { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2); padding: 1rem 2rem 0; max-width: 1100px; margin: 0 auto; }
        .breadcrumb a:hover { color: var(--text); }
        .breadcrumb-sep { color: var(--hint); }

        .page-hero { background: var(--bg); border-bottom: 1px solid var(--border); padding: 2.5rem 2rem 2rem; }
        .page-hero-inner { max-width: 1100px; margin: 0 auto; }
        .page-eyebrow { font-family: var(--font-mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-mid); margin-bottom: 8px; }
        .page-title { font-family: var(--font-display); font-size: clamp(36px, 6vw, 72px); font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em; line-height: 0.95; color: var(--text); margin-bottom: 12px; }
        .page-sub { font-family: var(--font-body); font-size: 15px; color: var(--muted); max-width: 600px; line-height: 1.65; }
        .keywords { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .keyword-tag { font-family: var(--font-mono); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2); border: 0.5px solid var(--border); border-radius: 999px; padding: 3px 9px; }

        .page-body { max-width: 1100px; margin: 0 auto; padding: 2rem 2rem 4rem; display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        @media (max-width: 900px) { .page-body { grid-template-columns: 1fr; } .sidebar { order: -1; } }

        .section-title { font-family: var(--font-display); font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em; color: var(--text); margin-bottom: 1rem; }
        .intro-text { font-family: var(--font-body); font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 2rem; }

        .events-section { margin-bottom: 2.5rem; }
        .event-card { background: var(--surface); border: 0.5px solid var(--border); border-radius: var(--radius); padding: 1rem 1.25rem; margin-bottom: 10px; display: flex; gap: 1rem; align-items: flex-start; transition: border-color .15s; }
        .event-card:hover { border-color: var(--border2); }
        .event-date { font-family: var(--font-mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-mid); white-space: nowrap; flex-shrink: 0; padding-top: 3px; }
        .event-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: var(--text); margin-bottom: 3px; }
        .event-meta { font-family: var(--font-mono); font-size: 10px; color: var(--muted2); text-transform: uppercase; letter-spacing: 0.08em; }
        .empty-state { font-family: var(--font-body); font-size: 14px; color: var(--muted); padding: 1.5rem; text-align: center; background: var(--surface); border-radius: var(--radius); border: 0.5px solid var(--border); }

        .training-section { margin-bottom: 2.5rem; }
        .training-text { font-family: var(--font-body); font-size: 14px; color: var(--muted); line-height: 1.7; }

        .cta-box { background: var(--surface); border: 0.5px solid rgba(251,146,60,0.3); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; }
        .cta-box-title { font-family: var(--font-display); font-size: 18px; font-weight: 800; text-transform: uppercase; color: var(--text); margin-bottom: 8px; }
        .cta-box-sub { font-family: var(--font-body); font-size: 13px; color: var(--muted); line-height: 1.55; margin-bottom: 1rem; }
        .cta-btn { display: block; text-align: center; background: var(--accent); color: #08090C; font-family: var(--font-display); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 10px 16px; border-radius: var(--radius-sm); }
        .sidebar-link { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); border: 0.5px solid var(--border); border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 8px; transition: color .15s, border-color .15s; }
        .sidebar-link:hover { color: var(--text); border-color: var(--border2); }

        @media (max-width: 720px) { .topbar { padding: 0 1rem; } .page-hero { padding: 2rem 1rem 1.5rem; } .page-body { padding: 1rem 1rem 3rem; } }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <Link href="/" className="brand">
          <Image src="/logo-icon.svg" className="brand-logo-img" alt="Hybrid Race Hub" width={36} height={36} priority />
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
        </nav>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Inicio</Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/calendario">Calendario</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{cityData.name}</span>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · España 2026</p>
          <h1 className="page-title">Carreras OCR, HYROX<br/>y Híbridas en {cityData.name} 2026</h1>
          <p className="page-sub">{cityData.intro}</p>
          <div className="keywords">
            {cityData.keywords.map(k => <span key={k} className="keyword-tag">{k}</span>)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="page-body">
        <main>
          {/* Events */}
          <div className="events-section">
            <h2 className="section-title">Próximos eventos en {cityData.name} ({cityData.ccaa})</h2>
            {loading && <div className="empty-state">Cargando eventos…</div>}
            {!loading && events && events.length === 0 && (
              <div className="empty-state">
                No hay eventos próximos registrados en {cityData.ccaa} en este momento.<br/>
                <Link href="/calendario" style={{ color: "var(--accent)", textDecoration: "underline", marginTop: 8, display: "inline-block" }}>
                  Ver todos los eventos de España →
                </Link>
              </div>
            )}
            {!loading && events && events.map(ev => (
              <div key={ev.id} className="event-card">
                <div className="event-date">{formatDate(ev.fecha_iso)}</div>
                <div>
                  <div className="event-name">{ev.nombre}</div>
                  <div className="event-meta">
                    {[ev.modalidad, ev.ubicacion, ev.precio].filter(Boolean).join(" · ")}
                  </div>
                  {ev.url && (
                    <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4, display: "inline-block" }}>
                      Ver detalles →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Training section */}
          <div className="training-section">
            <h2 className="section-title">Dónde entrenar en {cityData.name}</h2>
            <p className="training-text">{cityData.training}</p>
          </div>

          {/* CTA */}
          <Link href="/calendario" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", border: "0.5px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "8px 16px", width: "fit-content", marginTop: 8 }}>
            Ver todos los eventos en España →
          </Link>
        </main>

        <aside className="sidebar">
          <div className="cta-box">
            <div className="cta-box-title">¿Buscas tu próxima carrera?</div>
            <p className="cta-box-sub">Filtra por comunidad, formato y fecha en el calendario completo.</p>
            <Link href="/calendario" className="cta-btn">Ver calendario →</Link>
          </div>

          <Link href="/productos/relojes" className="sidebar-link">🏆 Ranking relojes GPS</Link>
          <Link href="/productos/zapatillas-hyrox" className="sidebar-link">👟 Zapatillas HYROX</Link>
          <Link href="/productos/zapatillas-trail" className="sidebar-link">🥾 Zapatillas trail OCR</Link>
          <Link href="/blog" className="sidebar-link">📖 Blog: guías y artículos</Link>

          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted2)", marginBottom: 8 }}>Otras ciudades</p>
            {Object.entries({ bilbao: "Bilbao", barcelona: "Barcelona", madrid: "Madrid", valencia: "Valencia", malaga: "Málaga", sevilla: "Sevilla", zaragoza: "Zaragoza", murcia: "Murcia" })
              .filter(([s]) => s !== slug)
              .map(([s, n]) => (
                <Link key={s} href={`/calendario/${s}`} className="sidebar-link">{n}</Link>
              ))
            }
          </div>
        </aside>
      </div>
    </>
  );
}
