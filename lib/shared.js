import { useState, useRef, useEffect } from "react";

/* ─── Supabase ─────────────────────────────────────────────────────────────── */
export const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
export const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

/* ─── Date constants ───────────────────────────────────────────────────────── */
const NOW          = new Date();
export const TODAY_YEAR  = NOW.getFullYear();
export const TODAY_MONTH = NOW.getMonth();
export const TODAY_ISO   = `${TODAY_YEAR}-${String(TODAY_MONTH+1).padStart(2,"0")}-${String(NOW.getDate()).padStart(2,"0")}`;

/* ─── Data constants ───────────────────────────────────────────────────────── */
export const NICHE_PARENTS = ["ocr", "funcional"];

export const MODALITIES = [
  {
    id:"ocr", label:"OCR",
    color:"var(--ocr)", bg:"var(--ocr-bg)",
    subs:[
      { id:"ocr-spartan", label:"Spartan Race" },
      { id:"ocr-mudder",  label:"Tough Mudder" },
      { id:"ocr-general", label:"OCR General"  },
    ],
  },
  {
    id:"funcional", label:"HYROX / Funcional",
    color:"var(--hyrox)", bg:"var(--hyrox-bg)",
    subs:[
      { id:"func-hyrox",   label:"HYROX"            },
      { id:"func-crossfit",label:"CrossFit"          },
      { id:"func-fitness", label:"Fitness Funcional" },
    ],
  },
];

export const SUB_COLOR = {};
export const SUB_BG    = {};
MODALITIES.forEach(m => m.subs.forEach(s => { SUB_COLOR[s.id]=m.color; SUB_BG[s.id]=m.bg; }));

export const CCAA = [
  "Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria",
  "Castilla-La Mancha","Castilla y León","Cataluña","Ceuta",
  "Comunidad Valenciana","Extremadura","Galicia","La Rioja",
  "Madrid","Melilla","Murcia","Navarra","País Vasco",
];

export const FORMATS = [
  { id:"individual", label:"Individual" },
  { id:"pairs",      label:"Parejas"    },
  { id:"team",       label:"Equipos"    },
  { id:"elite",      label:"Pro / Elite"},
];

export const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
export const MONTH_FULL  = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const WEEKDAY_SHORT = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
export function toggle(arr, setArr, val) {
  setArr(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr,val]);
}

export function formatDate(iso) {
  if(!iso) return "";
  const [y,m,d] = iso.split("-");
  return `${d} ${MONTH_NAMES[parseInt(m,10)-1]} ${y}`;
}

export function buildGCalUrl(race) {
  const p = new URLSearchParams({ action: "TEMPLATE" });
  p.set("text", race.nombre || "");
  if (race.fecha_iso) {
    const start = race.fecha_iso.replace(/-/g, "");
    const next  = new Date(race.fecha_iso + "T12:00:00");
    next.setDate(next.getDate() + 1);
    const end = next.toISOString().split("T")[0].replace(/-/g, "");
    p.set("dates", `${start}/${end}`);
  }
  if (race.ubicacion) p.set("location", race.ubicacion);
  const details = [
    race.modalidad  && `Modalidad: ${race.modalidad}`,
    race.formato    && `Formato: ${race.formato}`,
    race.precio     && `Precio: ${race.precio}`,
    race.notas,
    race.url        && `Inscripción: ${race.url}`,
  ].filter(Boolean).join("\n");
  if (details) p.set("details", details);
  return `https://calendar.google.com/calendar/render?${p}`;
}

/* ─── Icons ────────────────────────────────────────────────────────────────── */
export const OcrIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <polygon points="7,1 13,13 1,13" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="4" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const FuncIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="3" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 11h4M7 11V4M5 6h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

export const EnvelopeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

export const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1" y1="5.5" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="4" y1="1" x2="4" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="9" y1="1" x2="9" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

/* ─── Visual DateRangePicker ───────────────────────────────────────────────── */
const DrpCalSvg = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="2" width="12" height="11" rx="2" stroke="#FB923C" strokeWidth="1.3"/>
    <line x1="1" y1="6" x2="13" y2="6" stroke="#FB923C" strokeWidth="1.3"/>
    <line x1="4" y1="1" x2="4" y2="3.5" stroke="#FB923C" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10" y1="1" x2="10" y2="3.5" stroke="#FB923C" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

function CalendarPopup({ value, min, onChange, onClose }) {
  const minDate  = new Date((min || TODAY_ISO) + "T00:00:00");
  const initDate = value ? new Date(value + "T00:00:00") : minDate;
  const [viewYear,  setViewYear]  = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  function prevMonth() {
    if(viewMonth===0){ setViewMonth(11); setViewYear(y=>y-1); }
    else setViewMonth(m=>m-1);
  }
  function nextMonth() {
    if(viewMonth===11){ setViewMonth(0); setViewYear(y=>y+1); }
    else setViewMonth(m=>m+1);
  }

  function handleDay(day) {
    const iso = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if(new Date(iso+"T00:00:00") < minDate) return;
    onChange(iso);
    onClose();
  }

  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const startOffset = (new Date(viewYear, viewMonth, 1).getDay()+6)%7;
  const cells = [...Array(startOffset).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];

  return (
    <div>
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={prevMonth} type="button">‹</button>
        <span className="cal-month-label">{MONTH_FULL[viewMonth]} {viewYear}</span>
        <button className="cal-nav-btn" onClick={nextMonth} type="button">›</button>
      </div>
      <div className="cal-weekdays">
        {WEEKDAY_SHORT.map(d=><span key={d} className="cal-weekday">{d}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map((d,i)=>{
          if(!d) return <span key={i} className="cal-day cal-day--empty"/>;
          const iso=`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const disabled=new Date(iso+"T00:00:00")<minDate;
          const selected=value===iso;
          const isToday=iso===TODAY_ISO;
          return (
            <button key={i} type="button"
              className={`cal-day${selected?" cal-day--selected":""}${isToday&&!selected?" cal-day--today":""}`}
              disabled={disabled}
              onClick={()=>handleDay(d)}
            >{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function DateField({ label, value, min, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(()=>{
    function down(e){ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown",down);
    return ()=>document.removeEventListener("mousedown",down);
  },[]);

  return (
    <div className="drp-field" ref={ref}>
      <button type="button" className={`drp-trigger${open?" drp-trigger--open":""}`} onClick={()=>setOpen(o=>!o)}>
        <span className="drp-trigger-label">{label}</span>
        {value
          ? <span className="drp-trigger-value">{formatDate(value)}</span>
          : <span className="drp-trigger-placeholder">Seleccionar</span>}
        <span className="drp-trigger-icons">
          {value && (
            <span className="drp-clear-x" role="button" aria-label="Limpiar"
              onClick={e=>{e.stopPropagation();onChange(null);setOpen(false);}}>×</span>
          )}
          <DrpCalSvg/>
        </span>
      </button>
      {open && (
        <div className="drp-popup">
          <CalendarPopup value={value} min={min} onChange={onChange} onClose={()=>setOpen(false)}/>
        </div>
      )}
    </div>
  );
}

export function DateRangePicker({ from, to, onChange }) {
  return (
    <div className="drp-wrap">
      <DateField label="FECHA DESDE" value={from} min={TODAY_ISO}
        onChange={val=>onChange({from:val, to:(val&&to&&val>to)?null:to})}/>
      <DateField label="FECHA HASTA" value={to} min={from||TODAY_ISO}
        onChange={val=>onChange({from, to:val})}/>
    </div>
  );
}

/* ─── FilterSection ────────────────────────────────────────────────────────── */
export function FilterSection({ title, active, children }) {
  return (
    <div className="fs">
      <div className={`fs-label${active?" fs-label--active":""}`}>
        <span className={`fs-bar${active?" fs-bar--active":""}`}/>
        <span className="fs-title">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ─── ActiveFiltersRow ─────────────────────────────────────────────────────── */
export function ActiveFiltersRow({ ccaa=[], modalParents=[], modalSubs=[], formats=[], dateRange={from:null,to:null}, textQuery="",
  setCcaa=()=>{}, setModalParents=()=>{}, setModalSubs=()=>{}, setFormats=()=>{}, setDateRange=()=>{}, setTextQuery=()=>{} }) {
  const pills = [];

  if(textQuery) pills.push({ label:`"${textQuery}"`, onRemove:()=>setTextQuery("") });
  (formats||[]).forEach(f=>{
    const lbl=FORMATS.find(x=>x.id===f)?.label||f;
    pills.push({ label:lbl, onRemove:()=>setFormats(p=>p.filter(x=>x!==f)) });
  });
  modalSubs.forEach(s=>{
    const lbl=MODALITIES.flatMap(m=>m.subs).find(x=>x.id===s)?.label||s;
    pills.push({ label:lbl, onRemove:()=>setModalSubs(p=>p.filter(x=>x!==s)) });
  });
  modalParents.forEach(p=>{
    const hasSubs=MODALITIES.find(m=>m.id===p)?.subs.some(s=>modalSubs.includes(s.id));
    if(!hasSubs){
      const lbl=MODALITIES.find(m=>m.id===p)?.label||p;
      pills.push({ label:lbl, onRemove:()=>setModalParents(prev=>prev.filter(x=>x!==p)) });
    }
  });
  ccaa.forEach(c=>pills.push({ label:c, onRemove:()=>setCcaa(p=>p.filter(x=>x!==c)) }));
  if(dateRange.from||dateRange.to){
    const label=(dateRange.from&&dateRange.to)
      ?`${formatDate(dateRange.from)} → ${formatDate(dateRange.to)}`
      :dateRange.from?`Desde ${formatDate(dateRange.from)}`:`Hasta ${formatDate(dateRange.to)}`;
    pills.push({ label, onRemove:()=>setDateRange({from:null,to:null}) });
  }

  if(!pills.length) return null;
  return (
    <div className="af-row">
      {pills.map((p,i)=>(
        <button key={i} className="af-pill" onClick={p.onRemove}>
          {p.label}<span className="af-x">×</span>
        </button>
      ))}
    </div>
  );
}

/* ─── HeroStats ────────────────────────────────────────────────────────────── */
export function HeroStats({ totalCount, ccaaCount, formatsCount }) {
  const stats = [
    { val:totalCount||"—", label:"Eventos" },
    { val:ccaaCount,        label:"CCAA"   },
    { val:formatsCount,     label:"Formatos" },
    { val:"Diario",         label:"Sync"   },
  ];
  return (
    <div className="hero-stats">
      {stats.map((s,i)=>(
        <div key={i} className="hero-stat">
          <span className="hero-stat-val">{s.val}</span>
          <span className="hero-stat-lbl">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── RaceCard ─────────────────────────────────────────────────────────────── */
export function RaceCard({ race, featured, onClick }) {
  const col=SUB_COLOR[race.modalidad_id]||"var(--accent)";
  const bg =SUB_BG[race.modalidad_id]  ||"var(--accent-bg)";
  const statusStyle=race.estado==="Abierta"
    ?{bg:"var(--green-bg)",color:"var(--green)"}
    :race.estado==="Cerrada"
    ?{bg:"var(--red-bg)",color:"var(--red)"}
    :{bg:"rgba(250,204,21,0.12)",color:"var(--hyrox)"};

  return (
    <div className={`race-card${featured?" race-card--featured":""}`} onClick={onClick}
      role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick()}>
      {featured && <div className="featured-badge">DESTACADA</div>}
      <div className="card-tags">
        <span className="tag" style={{background:bg,color:col}}>
          {race.modalidad||(race.modalidad_parent||"").toUpperCase()}
        </span>
        {race.estado && (
          <span className="tag" style={{background:statusStyle.bg,color:statusStyle.color}}>
            {race.estado.toUpperCase()}
          </span>
        )}
      </div>
      <p className="card-name">{(race.nombre||"").toUpperCase()}</p>
      <p className="card-meta">
        {race.fecha||race.fecha_iso}
        {race.ubicacion&&<><span className="sep"> · </span>{race.ubicacion}</>}
      </p>
      <div className="card-footer">
        <div className="card-info">
          {race.distancia&&<span className="card-distancia">{race.distancia}</span>}
          {race.formato&&<span className="card-formato">{race.formato}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span className="card-price" style={{color:col}}>{race.precio||""}</span>
          {race.fecha_iso&&(
            <a href={buildGCalUrl(race)} target="_blank" rel="noreferrer"
              className="card-gcal" onClick={e=>e.stopPropagation()}
              title="Añadir a Google Calendar" aria-label="Añadir a Google Calendar">
              <CalIcon/>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── RaceModal ────────────────────────────────────────────────────────────── */
export function RaceModal({ race, onClose }) {
  const col=SUB_COLOR[race.modalidad_id]||"var(--accent)";
  const bg =SUB_BG[race.modalidad_id]  ||"var(--accent-bg)";
  const statusStyle=race.estado==="Abierta"
    ?{bg:"var(--green-bg)",color:"var(--green)"}
    :race.estado==="Cerrada"
    ?{bg:"var(--red-bg)",color:"var(--red)"}
    :{bg:"rgba(250,204,21,0.12)",color:"var(--hyrox)"};

  useEffect(()=>{
    const fn=e=>{ if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown",fn);
    document.body.style.overflow="hidden";
    return ()=>{ document.removeEventListener("keydown",fn); document.body.style.overflow=""; };
  },[onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            <span className="tag" style={{background:bg,color:col}}>
              {race.modalidad||(race.modalidad_parent||"").toUpperCase()}
            </span>
            {race.estado&&(
              <span className="tag" style={{background:statusStyle.bg,color:statusStyle.color}}>
                {race.estado.toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="modal-title">{(race.nombre||"").toUpperCase()}</h2>
          <p className="modal-loc">
            {race.fecha&&<span>{race.fecha}</span>}
            {race.ubicacion&&<><span className="sep">·</span><span>{race.ubicacion}</span></>}
            {race.comunidad&&<><span className="sep">·</span><span>{race.comunidad}</span></>}
          </p>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-stats">
          <div className="stat-cell">
            <span className="stat-label">DISTANCIA</span>
            <span className="stat-val">{race.distancia||"—"}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">FORMATO</span>
            <span className="stat-val">{race.formato||"—"}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">PRECIO</span>
            <span className="stat-val" style={{color:col}}>{race.precio||""}</span>
          </div>
        </div>
        {race.notas&&<p className="modal-notes">{race.notas}</p>}
        <div className="modal-ctas">
          {race.url
            ? <a href={race.url} target="_blank" rel="noreferrer" className="btn-primary">IR A INSCRIPCIÓN →</a>
            : <span className="btn-primary btn-primary--off">SIN ENLACE OFICIAL</span>
          }
          {race.fecha_iso&&(
            <a href={buildGCalUrl(race)} target="_blank" rel="noreferrer" className="btn-ghost">
              AÑADIR A CALENDARIO 📅
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SiteFooter ───────────────────────────────────────────────────────────── */
export function SiteFooter() {
  const cityLinks = [
    { href: "/calendario/bilbao",    label: "OCR Bilbao"     },
    { href: "/calendario/barcelona", label: "OCR Barcelona"  },
    { href: "/calendario/madrid",    label: "OCR Madrid"     },
    { href: "/calendario/valencia",  label: "OCR Valencia"   },
    { href: "/calendario/malaga",    label: "OCR Málaga"     },
    { href: "/calendario/sevilla",   label: "OCR Sevilla"    },
    { href: "/calendario/zaragoza",  label: "OCR Zaragoza"   },
    { href: "/calendario/murcia",    label: "OCR Murcia"     },
  ];
  const productLinks = [
    { href: "/productos/relojes",           label: "Relojes GPS"          },
    { href: "/productos/zapatillas-hyrox",  label: "Zapatillas HYROX"     },
    { href: "/productos/zapatillas-trail",  label: "Zapatillas Trail"     },
    { href: "/productos/zapatillas-crossfit", label: "Zapatillas CrossFit" },
    { href: "/productos/pulsometros",       label: "Pulsómetros"          },
    { href: "/productos/ropa",              label: "Ropa técnica"         },
  ];
  const linkStyle = {
    fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 500,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: "var(--muted, #8C8E9A)", textDecoration: "none",
    transition: "color .15s",
  };
  const headStyle = {
    fontFamily: "var(--font-mono, monospace)", fontSize: 9, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.14em",
    color: "var(--muted2, #5D5F6B)", marginBottom: 10,
  };
  return (
    <footer className="site-footer">
      <div className="sf-inner">
        <div className="sf-top">
          <div className="sf-brand">
            <div className="brand-logo" style={{width:34,height:34,fontSize:17}}>H</div>
            <div>
              <div className="brand-name" style={{fontSize:15}}>Hybrid Race Hub</div>
              <div className="brand-sub">OCR · HYROX · Functional</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <a href="mailto:hola@hybridracehub.com" className="sf-ig">
              <EnvelopeIcon size={15}/><span>hola@hybridracehub.com</span>
            </a>
            <a href="https://www.instagram.com/hybridracehub_spain" target="_blank" rel="noreferrer" className="sf-ig">
              <InstagramIcon size={15}/><span>@hybridracehub_spain</span>
            </a>
          </div>
        </div>
        <div className="sf-divider"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"1.5rem 2rem",padding:"1.25rem 0"}}>
          <div>
            <p style={headStyle}>Eventos por ciudad</p>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:7}}>
              {cityLinks.map(l=>(
                <li key={l.href}><a href={l.href} style={linkStyle}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p style={headStyle}>Rankings de productos</p>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:7}}>
              {productLinks.map(l=>(
                <li key={l.href}><a href={l.href} style={linkStyle}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p style={headStyle}>Secciones</p>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:7}}>
              <li><a href="/calendario" style={linkStyle}>Calendario</a></li>
              <li><a href="/blog" style={linkStyle}>Blog</a></li>
              <li><a href="/productos" style={linkStyle}>Productos</a></li>
              <li><a href="/race-hub#training-programs" style={linkStyle}>Programas HYROX</a></li>
              <li><a href="/contacto-organizadores" style={linkStyle}>Organizadores</a></li>
            </ul>
          </div>
        </div>
        <div className="sf-divider"/>
        <div className="sf-legal-block">
          <p className="sf-legal-head">Aviso Legal · Privacidad · Cookies</p>
          <p className="sf-legal-text">
            <strong>Responsable del tratamiento:</strong> Hybrid Race Hub ·{" "}
            <strong>Finalidad:</strong> gestión de consultas de organizadores y envío de alertas de nuevas carreras ·{" "}
            <strong>Base legal:</strong> consentimiento del interesado (Art. 6.1.a RGPD) ·{" "}
            <strong>Destinatarios:</strong> no se ceden datos a terceros ·{" "}
            <strong>Derechos:</strong> acceso, rectificación, supresión, portabilidad y oposición dirigiéndose a{" "}
            <a href="mailto:hola@hybridracehub.com" style={{color:"var(--muted)"}}>hola@hybridracehub.com</a>
          </p>
          <p className="sf-legal-text">
            Este sitio web utiliza únicamente cookies técnicas esenciales.
            No se emplean cookies publicitarias ni de seguimiento de terceros.
            Los datos personales se tratan conforme al RGPD y la LOPDGDD.
          </p>
        </div>
        <p className="sf-copy">© {new Date().getFullYear()} Hybrid Race Hub · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

/* ─── SiteNav ──────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/",                     label: "Inicio"      },
  { href: "/calendario",           label: "Calendario"  },
  { href: "/plan-entrenamiento",   label: "Plan"        },
  { href: "/centros-entrenamiento",label: "Centros"     },
  { href: "/calculadora-hyrox",    label: "Calculadora" },
  { href: "/blog",                 label: "Blog"        },
  { href: "/productos",            label: "Productos"   },
];

export function SiteNav({ activePath }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="nav" aria-label="Navegación principal">
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} className={activePath === l.href ? "nav-active" : ""}>{l.label}</a>
        ))}
      </nav>

      <button className="nav-toggle" onClick={() => setOpen(true)} aria-label="Abrir menú" aria-expanded={open}>
        <span className="nav-toggle-bar"/>
        <span className="nav-toggle-bar"/>
        <span className="nav-toggle-bar"/>
      </button>

      {open && (
        <div className="mobile-nav-overlay mobile-nav-overlay--open" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="mobile-nav-header">
            <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
              <div className="brand-logo" style={{ width:32, height:32, fontSize:16 }}>H</div>
              <span className="brand-name" style={{ fontSize:16 }}>Hybrid Race Hub</span>
            </a>
            <button className="mobile-nav-close" onClick={() => setOpen(false)} aria-label="Cerrar menú">×</button>
          </div>
          <nav className="mobile-nav-links" aria-label="Menú móvil">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href}
                className={`mobile-nav-link${activePath === l.href ? " mobile-nav-link--active" : ""}`}
                onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

/* ─── CookieBanner ─────────────────────────────────────────────────────────── */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    if(typeof window!=="undefined"&&!localStorage.getItem("hrh_cookies_ok")) setVisible(true);
  },[]);
  function accept(){
    if(typeof window!=="undefined") localStorage.setItem("hrh_cookies_ok","1");
    setVisible(false);
  }
  if(!visible) return null;
  return (
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
      <p className="cookie-text">
        Usamos cookies técnicas esenciales para el funcionamiento del sitio y para recordar tus preferencias.
        No empleamos cookies publicitarias ni de seguimiento. Al continuar navegando aceptas su uso.
      </p>
      <button className="cookie-btn" onClick={accept}>Entendido</button>
    </div>
  );
}
