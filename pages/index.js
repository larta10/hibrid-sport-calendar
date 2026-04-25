import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  SUPABASE_URL, ANON_KEY, TODAY_ISO, TODAY_YEAR, NICHE_PARENTS, CCAA, FORMATS,
  formatDate, InstagramIcon, EnvelopeIcon, HeroStats, SiteFooter, CookieBanner,
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

/* ─── NewsletterSignup ─────────────────────────────────────────────────────── */
function NewsletterSignup() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if(!email||!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`,{
        method:"POST",
        headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" },
        body: JSON.stringify({ email:email.toLowerCase().trim(), active:true }),
      });
      if(res.ok||res.status===201){ setStatus("success"); }
      else {
        const body=await res.json().catch(()=>({}));
        if(body?.code==="23505"){ setStatus("success"); }
        else throw new Error(body?.message||"Error");
      }
    } catch { setStatus("error"); setErrMsg("No se pudo completar. Inténtalo de nuevo."); }
  }

  return (
    <section className="nl">
      <div className="nl-inner">
        <div className="nl-text">
          <p className="nl-eyebrow">NEWSLETTER</p>
          <h2 className="nl-title">¿Sin perderte<br/>una carrera?</h2>
          <p className="nl-sub">
            Te avisamos cuando añadamos nuevas carreras OCR, HYROX o
            competiciones funcionales en España.
          </p>
        </div>
        {status==="success"?(
          <div className="nl-success">
            <span className="nl-check">✓</span>
            ¡Apuntado! Te avisaremos de nuevas pruebas.
          </div>
        ):(
          <form className="nl-form" onSubmit={handleSubmit}>
            <input type="email" className="nl-input" placeholder="tu@email.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              required disabled={status==="loading"}/>
            <button type="submit" className="nl-btn" disabled={status==="loading"}>
              {status==="loading"?"…":"QUIERO AVISOS →"}
            </button>
            {status==="error"&&<p className="nl-error">{errMsg}</p>}
          </form>
        )}
      </div>
    </section>
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

/* ─── Home ─────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [totalCount, setTotalCount] = useState(null);

  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count&modalidad_parent=in.(ocr,funcional)`,{
      headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}`, Prefer:"count=exact" },
    }).then(r=>{ const c=r.headers.get("content-range"); if(c) setTotalCount(c.split("/")[1]); }).catch(()=>{});
  },[]);

  return (
    <>
      <Head>
        <title>Hybrid Race Hub — Calendario OCR, HYROX y CrossFit en España</title>
        <meta name="description" content="El calendario de referencia para carreras OCR, HYROX y competiciones funcionales en España. Filtra por formato, comunidad y fecha." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://hybridracehub.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/" />
        <meta property="og:title" content="Hybrid Race Hub" />
        <meta property="og:description" content="OCR · HYROX · Functional — Calendario de competiciones híbridas en España" />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href={SUPABASE_URL} />
      </Head>

      {/* ── HEADER ── */}
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <div className="brand-logo">H</div>
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
            <a href="/blog">Blog</a>
            <a href="/productos">Productos</a>
          </nav>
        </div>

        {/* Hero body: left = headline, right = search */}
        <div className="hero-body">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot"/>
              Calendario híbrido · España {TODAY_YEAR}
            </div>
            <h1 className="hero-title">
              OCR<span className="slash">/</span><span className="hy">HYROX</span><span className="slash">/</span>CROSSFIT.
            </h1>
            <p className="hero-sub">
              El calendario más completo de <strong>carreras híbridas, OCR y competiciones funcionales</strong> en España.
              Encuentra todas las pruebas, filtra por formato, comunidad y fecha. Actualizado a diario.
            </p>
            <HeroStats totalCount={totalCount} ccaaCount={CCAA.length} formatsCount={FORMATS.length}/>
            <a href="/calendario" className="hero-cta">VER TODOS LOS EVENTOS →</a>
          </div>
          <div className="hero-right">
            <HeroSearch/>
          </div>
        </div>
      </header>

      <NewsletterSignup/>
      <FAQSection/>
      <OrganizerContact/>
      <SiteFooter/>
      <CookieBanner/>
    </>
  );
}
