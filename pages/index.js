import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  SUPABASE_URL, ANON_KEY, TODAY_ISO, TODAY_YEAR, NICHE_PARENTS, CCAA, FORMATS,
  formatDate, InstagramIcon, EnvelopeIcon, HeroStats, SiteFooter, CookieBanner, CalIcon,
} from "../lib/shared";

/* ─── Hero Search ──────────────────────────────────────────────────────────── */
function HeroSearch() {
  const router  = useRouter();
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const debRef  = useRef(null);
  const wrapRef = useRef(null);

  useEffect(()=>{
    clearTimeout(debRef.current);
    if(!query.trim()){ setResults([]); setOpen(false); return; }
    debRef.current = setTimeout(async ()=>{
      try {
        const t = query.trim().replace(/[%_]/g,"");
        const p = new URLSearchParams();
        p.set("select","id,nombre,fecha_iso,ubicacion,comunidad");
        p.set("modalidad_parent",`in.(${NICHE_PARENTS.join(",")})`);
        p.set("fecha_iso",`gte.${TODAY_ISO}`);
        p.set("or",`(nombre.ilike.*${t}*,ubicacion.ilike.*${t}*,comunidad.ilike.*${t}*)`);
        p.set("order","fecha_iso.asc");
        p.set("limit","8");
        const res  = await fetch(`${SUPABASE_URL}/rest/v1/races?${p}`,{
          headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}` },
        });
        const data = await res.json();
        if(Array.isArray(data)&&data.length>0){ setResults(data); setOpen(true); }
        else { setResults([]); setOpen(false); }
      } catch {}
    },200);
    return ()=>clearTimeout(debRef.current);
  },[query]);

  useEffect(()=>{
    function down(e){ if(wrapRef.current&&!wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown",down);
    return ()=>document.removeEventListener("mousedown",down);
  },[]);

  function go(r){ router.push(`/calendario?q=${encodeURIComponent(r.nombre)}`); }
  function goAll(){ if(query.trim()) router.push(`/calendario?q=${encodeURIComponent(query.trim())}`); }

  return (
    <div className="hs-wrap" ref={wrapRef}>
      <label className="hs-eyebrow">BUSCA TU PRÓXIMA CARRERA</label>
      <div className={`hs-box${open?" hs-box--open":""}`}>
        <span className="hs-icon">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" stroke="#FB923C" strokeWidth="1.4"/>
            <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" stroke="#FB923C" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          className="hs-input"
          type="text"
          placeholder="Busca carrera, ciudad o prueba..."
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&goAll()}
        />
        {query&&(
          <button className="hs-clear-btn" onClick={()=>{ setQuery(""); setOpen(false); }}>×</button>
        )}
      </div>
      {open&&results.length>0&&(
        <div className="hs-dropdown">
          {results.map((r,i)=>(
            <button key={i} className="hs-item" onClick={()=>go(r)}>
              <span className="hs-item-name">{r.nombre}</span>
              <span className="hs-item-meta">
                {formatDate(r.fecha_iso)}{r.ubicacion?` · ${r.ubicacion}`:r.comunidad?` · ${r.comunidad}`:""}
              </span>
            </button>
          ))}
          <button className="hs-ver-todo" onClick={goAll}>
            Ver todos los resultados para &quot;{query}&quot; →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ_DATA = [
  { question:"¿Qué es una carrera OCR?", answer:"OCR (Obstacle Course Race) es una carrera que combina running con obstáculos naturales o artificiales. Las pruebas más populares son Spartan Race, Tough Mudder y sus variantes. Los corredores deben completar tramos de carrera con desafíos físicos como trepar, arrastrarse, cargar peso y cruzar elementos de agua." },
  { question:"¿Qué es HYROX? ¿En qué se diferencia de CrossFit?", answer:"HYROX es una modalidad específica de fitness funcional que consiste en completar una serie de ejercicios técnicos (burpees, saltos, remo, cargada) intercalados con carrera. A diferencia de los Open de CrossFit, los eventos HYROX están estandarizados y tienen un formato fijo (típicamente 8 estaciones + carrera) permitiendo comparar resultados entre eventos." },
  { question:"¿Cómo me inscribo en una carrera?", answer:"Cada carrera tiene su propio sistema de inscripción. Haz clic en cualquier carrera del calendario para ver los detalles. Encontrarás un enlace directo a la web oficial del evento donde podrás completar tu inscripción." },
  { question:"¿Qué nivel necesito para participar?", answer:"Cada evento indica su nivel de dificultad. Los formatos 'Individual' son para todos los niveles, mientras que 'Pro / Elite' requieren experiencia previa. Las distancias varían desde 5km hasta ultra distancias de 50km+." },
  { question:"¿Puedo competir en pareja o equipo?", answer:"Sí, muchos eventos OCR y funcionales ofrecen formatos por parejas (2 personas) o equipos (4+ personas). Estos formatos añaden una dimensión de teamwork. Filtra por 'Parejas' o 'Equipos' en el calendario." },
  { question:"¿Dónde encuentro entrenamientos específicos?", answer:"En la sección 'Comunidad' del Hub encontrarás box de HYROX y CrossFit por toda España. Muchos de estos gyms ofrecen clases específicas para mejorar tu rendimiento en obstáculos." },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className={`faq-question${isOpen?" faq-question--open":""}`} onClick={()=>setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen?"−":"+"}</span>
      </button>
      {isOpen&&<div className="faq-answer">{answer}</div>}
    </div>
  );
}

function FAQSection() {
  return (
    <section className="faq">
      <div className="faq-inner">
        <div className="faq-header">
          <p className="faq-eyebrow">PREGUNTAS FRECUENTES</p>
          <h2 className="faq-title">Todo sobre carreras híbridas</h2>
        </div>
        <div className="faq-list">
          {FAQ_DATA.map((item,i)=><FAQItem key={i} question={item.question} answer={item.answer}/>)}
        </div>
      </div>
    </section>
  );
}

/* ─── OrganizerContact ─────────────────────────────────────────────────────── */
function OrganizerContact() {
  const [form, setForm]     = useState({ nombre:"", email:"", prueba:"", mensaje:"" });
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  function set(field, val){ setForm(f=>({...f,[field]:val})); }

  async function handleSubmit(e) {
    e.preventDefault();
    if(!form.nombre||!form.email||!form.mensaje) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form),
      });
      if(res.ok){ setStatus("success"); }
      else { const body=await res.json().catch(()=>({})); throw new Error(body.error||"Error al enviar"); }
    } catch(err) { setStatus("error"); setErrMsg(err.message||"No se pudo enviar. Inténtalo de nuevo."); }
  }

  return (
    <section className="oc">
      <div className="oc-inner">
        <div className="oc-text">
          <p className="oc-eyebrow">PARA ORGANIZADORES</p>
          <h2 className="oc-title">¿Organizas una<br/>prueba híbrida?</h2>
          <p className="oc-sub">
            Hybrid Race Hub es el calendario de referencia de carreras OCR, HYROX y
            fitness funcional en España. Si organizas una prueba y quieres llegar a miles
            de atletas comprometidos, escríbenos. Estudiamos cada colaboración de forma individual.
          </p>
          <a href="mailto:hola@hybridracehub.com" className="oc-ig-link" style={{marginBottom:8,display:"inline-flex"}}>
            <EnvelopeIcon size={14}/><span>hola@hybridracehub.com</span>
          </a>
          <br/>
          <a href="https://www.instagram.com/hybridracehub_spain" target="_blank" rel="noreferrer" className="oc-ig-link">
            <InstagramIcon size={14}/><span>O DM · @hybridracehub_spain</span>
          </a>
        </div>

        <div className="oc-form-wrap">
          {status==="success"?(
            <div className="oc-success">
              <span className="oc-check">✓</span>
              <div>
                <p className="oc-success-title">¡Mensaje enviado!</p>
                <p className="oc-success-sub">Te respondemos en menos de 48 h.</p>
              </div>
            </div>
          ):(
            <form className="oc-form" onSubmit={handleSubmit}>
              <div className="oc-field">
                <label className="oc-label">Nombre *</label>
                <input className="oc-input" type="text" placeholder="Tu nombre" required
                  value={form.nombre} onChange={e=>set("nombre",e.target.value)} disabled={status==="loading"}/>
              </div>
              <div className="oc-field">
                <label className="oc-label">Email de contacto *</label>
                <input className="oc-input" type="email" placeholder="tu@email.com" required
                  value={form.email} onChange={e=>set("email",e.target.value)} disabled={status==="loading"}/>
              </div>
              <div className="oc-field">
                <label className="oc-label">Nombre del evento</label>
                <input className="oc-input" type="text" placeholder="Nombre de la prueba (opcional)"
                  value={form.prueba} onChange={e=>set("prueba",e.target.value)} disabled={status==="loading"}/>
              </div>
              <div className="oc-field">
                <label className="oc-label">Mensaje *</label>
                <textarea className="oc-input oc-textarea" placeholder="Cuéntanos tu prueba, fecha, lugar…" required
                  rows={4} value={form.mensaje} onChange={e=>set("mensaje",e.target.value)} disabled={status==="loading"}/>
              </div>
              <button type="submit" className="oc-btn" disabled={status==="loading"}>
                {status==="loading"?"Enviando…":"ENVIAR MENSAJE →"}
              </button>
              {status==="error"&&<p className="oc-error">{errMsg}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── HomeSections ─────────────────────────────────────────────────────────── */
const BlogIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="24" height="28" rx="3" stroke="#FB923C" strokeWidth="1.8"/>
    <line x1="9" y1="11" x2="23" y2="11" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="9" y1="16" x2="23" y2="16" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="9" y1="21" x2="17" y2="21" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const ShopIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M6 8h20l-2 14H8L6 8z" stroke="#FB923C" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 8c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="26" r="1.5" fill="#FB923C"/>
    <circle cx="20" cy="26" r="1.5" fill="#FB923C"/>
  </svg>
);

const CalcIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="5" y="4" width="22" height="26" rx="3" stroke="#FACC15" strokeWidth="1.8"/>
    <rect x="9" y="8" width="14" height="6" rx="1.5" stroke="#FACC15" strokeWidth="1.5"/>
    <circle cx="10" cy="20" r="1.5" fill="#FACC15"/>
    <circle cx="16" cy="20" r="1.5" fill="#FACC15"/>
    <circle cx="22" cy="20" r="1.5" fill="#FACC15"/>
    <circle cx="10" cy="26" r="1.5" fill="#FACC15"/>
    <circle cx="16" cy="26" r="1.5" fill="#FACC15"/>
    <circle cx="22" cy="26" r="1.5" fill="#FACC15"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="10" width="24" height="18" rx="2" stroke="#A78BFA" strokeWidth="1.8"/>
    <path d="M4 15h24" stroke="#A78BFA" strokeWidth="1.5"/>
    <path d="M13 10V6a3 3 0 0 1 6 0v4" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 22h8" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PlanIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="24" height="24" rx="3" stroke="#34D399" strokeWidth="1.8"/>
    <path d="M9 12h14M9 17h10M9 22h6" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="24" cy="22" r="5" fill="#08090C" stroke="#34D399" strokeWidth="1.8"/>
    <path d="M22 22l1.5 1.5L26 20" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function HomeSections() {
  const sections = [
    {
      href: "/calendario",
      icon: <CalIcon/>,
      title: "Calendario",
      desc: "Más de 140 eventos OCR, HYROX y fitness funcional en España. Filtra por comunidad, formato y fecha.",
      cta: "→ Ver eventos",
      iconBg: "var(--accent-bg)",
    },
    {
      href: "/plan-entrenamiento",
      icon: <PlanIcon/>,
      title: "Plan de entrenamiento",
      desc: "Crea tu plan personalizado para OCR, HYROX o CrossFit en 5 preguntas. Adaptado a tu nivel y días disponibles.",
      cta: "→ Crear mi plan",
      iconBg: "rgba(52,211,153,0.14)",
    },
    {
      href: "/blog",
      icon: <BlogIcon/>,
      title: "Blog",
      desc: "Guías técnicas, análisis de equipamiento y estrategias de competición escritas por atletas.",
      cta: "→ Leer artículos",
      iconBg: "rgba(250,204,21,0.14)",
    },
    {
      href: "/productos",
      icon: <ShopIcon/>,
      title: "Productos",
      desc: "Rankings de zapatillas, relojes GPS, pulsómetros y equipamiento para OCR e HYROX.",
      cta: "→ Ver rankings",
      iconBg: "rgba(52,211,153,0.14)",
    },
    {
      href: "/calculadora-hyrox",
      icon: <CalcIcon/>,
      title: "Calculadora HYROX",
      desc: "Calcula tu ritmo por estación y estima tu tiempo final. Con categorías de referencia para planificar tu carrera.",
      cta: "→ Calcular tiempo",
      iconBg: "rgba(250,204,21,0.14)",
    },
    {
      href: "/centros-entrenamiento",
      icon: <BoxIcon/>,
      title: "Centros de entrenamiento",
      desc: "Directorio de centros OCR, HYROX y CrossFit en España. Busca por ciudad o código postal.",
      cta: "→ Buscar centro",
      iconBg: "rgba(139,92,246,0.14)",
    },
  ];
  return (
    <section className="home-sections">
      <div className="home-sections-inner">
        {sections.map((s,i)=>(
          <a key={i} href={s.href} className="home-card">
            <div className="home-card-icon" style={{background:s.iconBg}}>{s.icon}</div>
            <h2 className="home-card-title">{s.title}</h2>
            <p className="home-card-desc">{s.desc}</p>
            <span className="home-card-cta">{s.cta}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─── Home ─────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [totalCount, setTotalCount] = useState(null);
  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count&modalidad_parent=in.(ocr,funcional)`,{
      headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}`, Prefer:"count=exact" },
    }).then(r=>{ const c=r.headers.get("content-range"); if(c) setTotalCount(c.split("/")[1]); }).catch(()=>{});
  },[]);

  const [centerQuery, setCenterQuery] = useState("");
  const router = useRouter();
  function goCenterSearch() {
    const q = centerQuery.trim();
    if (!q) return;
    router.push(`/centros-entrenamiento?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <Head>
        <title>Hybrid Race Hub — Plataforma OCR, HYROX y Entrenamiento Funcional en España</title>
        <meta name="description" content="Tu plataforma completa para el entrenamiento híbrido en España. Descubre eventos de OCR, HYROX y CrossFit, encuentra centros de entrenamiento cerca de ti y accede a rankings de equipamiento especializado." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/" />
        <meta property="og:title" content="Hybrid Race Hub — Plataforma OCR, HYROX y Entrenamiento Funcional en España" />
        <meta property="og:description" content="Tu plataforma completa para el entrenamiento híbrido en España. Descubre eventos de OCR, HYROX y CrossFit, encuentra centros de entrenamiento cerca de ti y accede a rankings de equipamiento." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hybrid Race Hub — Calendario OCR, HYROX y CrossFit en España" />
        <meta name="twitter:description" content="El calendario de referencia para carreras OCR, HYROX y competiciones funcionales en España." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link rel="preconnect" href={SUPABASE_URL} />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://hybridracehub.com/#organization",
                "name": "Hybrid Race Hub",
                "url": "https://hybridracehub.com/",
                "logo": { "@type": "ImageObject", "url": "https://hybridracehub.com/logo.svg" },
                "sameAs": ["https://www.instagram.com/hybridracehub_spain"],
              },
              {
                "@type": "WebSite",
                "@id": "https://hybridracehub.com/#website",
                "url": "https://hybridracehub.com/",
                "name": "Hybrid Race Hub",
                "description": "Calendario OCR, HYROX y CrossFit en España",
                "publisher": { "@id": "https://hybridracehub.com/#organization" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": { "@type": "EntryPoint", "urlTemplate": "https://hybridracehub.com/calendario?q={search_term_string}" },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          })}}
        />
      </Head>

      {/* ── HEADER ── */}
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <Image src="/logo-icon.svg" className="brand-logo-img" alt="Hybrid Race Hub" width={40} height={40} priority />
            <div>
              <div className="brand-name">Hybrid Race Hub</div>
              <div className="brand-sub">
                <span>OCR · HYROX · Functional</span>
                {totalCount&&<span className="brand-count">{totalCount} eventos</span>}
              </div>
            </div>
          </div>
          <nav className="nav" aria-label="Navegación principal">
            <a href="/calendario">Calendario</a>
            <a href="/plan-entrenamiento">Plan</a>
            <a href="/centros-entrenamiento">Centros</a>
            <a href="/calculadora-hyrox">Calculadora</a>
            <a href="/blog">Blog</a>
          </nav>
        </div>

        {/* Hero body: new title/subtitle and hero search */}
        <div className="hero-body" style={{ paddingTop: 0 }}>
          <div className="hero-left">
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,6vw,48px)', textTransform:'none' }}>
              De la inscripción al podio: tu camino en 3 pasos
            </h1>
            <p className="hero-sub" style={{ maxWidth: 680 }}>
              Encuentra tu carrera, entrena con un plan personalizado, localiza tu gimnasio
            </p>
            {/* Espaciado para que los 3 pasos se destaquen debajo del hero */}
          <HeroStats totalCount={totalCount} ccaaCount={CCAA.length} formatsCount={FORMATS.length}/>
          <a href="/calendario" className="hero-cta">VER TODOS LOS EVENTOS →</a>
          </div>
        </div>
        {/* Search bar: kept for header-like utility, smaller prominence per spec */}
        <div className="hero-search-outer" style={{ marginTop: '0.5rem' }}>
          <HeroSearch/>
        </div>

        {/* Nuevo journey de 3 pasos */}
        <section className="home-journey" aria-label="Tres pasos" style={{ padding:'2.5rem 0' }}>
          <div className="home-journey-inner">
            {/* Paso 1 */}
            <div className="journey-card" title="Próximos eventos: Hyrox Madrid (Mayo), Spartan Race Barcelona (Junio)">
              <div className="journey-icon" aria-hidden>📅</div>
              <h3 className="journey-title" style={{ color:'#fff' }}>Paso 1: Encuentra tu Evento</h3>
              <p className="journey-desc">Calendario completo de carreras Hyrox, OCR y híbridas en España. Filtra por ciudad, fecha y nivel.</p>
              <a href="/calendario" className="btn-primary" style={{ alignSelf:'flex-start' }}>Explorar Calendario</a>
              <div className="journey-tooltip">Próximos eventos: Hyrox Madrid (Mayo), Spartan Race Barcelona (Junio)...</div>
            </div>
            {/* Paso 2 */}
            <div className="journey-card" aria-label="Paso 2">
              <div className="journey-icon" aria-hidden>💪</div>
              <h3 className="journey-title" style={{ color:'#fff' }}>Paso 2: Plan Personalizado</h3>
              <p className="journey-desc">Entrena con un plan diseñado para tu nivel y tus objetivos. Responde 5 preguntas y recibe tu rutina semanal.</p>
              <a href="/plan-entrenamiento" className="btn-primary" style={{ alignSelf:'flex-start' }}>CREAR MI PLAN →</a>
            </div>
            {/* Paso 3 */}
            <div className="journey-card" aria-label="Paso 3">
              <div className="journey-icon" aria-hidden>📍</div>
              <h3 className="journey-title" style={{ color:'#fff' }}>Paso 3: Encuentra tu Gimnasio</h3>
              <p className="journey-desc">Centros con equipamiento Hyrox, boxes de CrossFit y gimnasios funcionales cerca de ti.</p>
              <div className="journey-city-search" style={{ display:'flex', gap:8 }}>
                <input placeholder="Madrid, Barcelona, 28001..." className="center-search-input" aria-label="Ciudad"/>
              </div>
              <a href="/centros-deportivos" className="btn-primary" style={{ alignSelf:'flex-start' }}>Buscar Centros</a>
              <div className="journey-tooltip">Más de 150 centros registrados en España</div>
            </div>
          </div>
        </section>
        {/* Recursos Complementarios (secundaria) */}
        <section className="home-secondary" aria-label="Recursos Complementarios">
          <div className="home-secondary-inner">
            <a className="home-card small" href="/blog">
              <div className="home-card-icon" style={{ width:40, height:40, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>📝</div>
              <h2 className="home-card-title" style={{ fontSize:18 }}>Blog de Entrenamiento</h2>
              <p className="home-card-desc">Artículos, guías y análisis técnico</p>
              <span className="home-card-cta">Leer artículos</span>
            </a>
            <a className="home-card small" href="/productos">
              <div className="home-card-icon" style={{ width:40, height:40, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>🛒</div>
              <h2 className="home-card-title" style={{ fontSize:18 }}>Equipamiento Recomendado</h2>
              <p className="home-card-desc">Rankings de relojes, zapatillas y gear</p>
              <span className="home-card-cta">Ver rankings</span>
            </a>
            <a className="home-card small" href="/calculadora">
              <div className="home-card-icon" style={{ width:40, height:40, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>⏱️</div>
              <h2 className="home-card-title" style={{ fontSize:18 }}>Calculadora de Tiempos</h2>
              <p className="home-card-desc">Estima tu marca en Hyrox según nivel</p>
              <span className="home-card-cta">Calcular</span>
            </a>
          </div>
        </section>
      </header>

      <HomeSections/>
      <FAQSection/>
      <OrganizerContact/>
      <SiteFooter/>
      <CookieBanner/>
    </>
  );
}
