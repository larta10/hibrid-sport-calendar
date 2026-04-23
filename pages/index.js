import { useState, useMemo, useEffect } from "react";
import Head from "next/head";

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

const PAISES = ["España","Portugal","Francia","Alemania","Italia","Reino Unido","Países Bajos","Bélgica","Suiza","Austria","Estados Unidos","México","Colombia","Argentina","Chile","Brasil"];
const CCAA = ["Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria","Castilla-La Mancha","Castilla y León","Cataluña","Ceuta","Comunidad Valenciana","Extremadura","Galicia","La Rioja","Madrid","Melilla","Murcia","Navarra","País Vasco"];
const MODALIDADES = [
  { id:"run",   label:"Running",                   icon:"🏃" },
  { id:"tri",   label:"Triatlón",                  icon:"🏊" },
  { id:"dua",   label:"Duatlón",                   icon:"🚴" },
  { id:"swim",  label:"Natación / Aguas abiertas", icon:"🌊" },
  { id:"mtb",   label:"Ciclismo / MTB",            icon:"🚵" },
  { id:"trail", label:"Trail running",             icon:"⛰️" },
  { id:"ocr",   label:"OCR / Obstáculos",          icon:"🔥" },
  { id:"hyrox", label:"HYROX / Funcional",         icon:"💪" },
  { id:"marat", label:"Maratón",                   icon:"🎽" },
  { id:"xterra",label:"XTERRA / Offroad",          icon:"🌲" },
];
const DISTANCIAS = [
  { id:"sprint", label:"Sprint", sub:"< 5 km" },
  { id:"5k",     label:"5K",     sub:"5 km" },
  { id:"10k",    label:"10K",    sub:"10 km" },
  { id:"media",  label:"Media",  sub:"21 km" },
  { id:"marat",  label:"Maratón",sub:"42 km" },
  { id:"larga",  label:"Larga",  sub:"50 km+" },
  { id:"ultra",  label:"Ultra",  sub:"80 km+" },
];
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MODAL_COLOR = { run:"#6EE7B7",tri:"#93C5FD",dua:"#C4B5FD",swim:"#5EEAD4",mtb:"#FCD34D",trail:"#FCA5A5",ocr:"#F9A8D4",hyrox:"#86EFAC",marat:"#A5B4FC",xterra:"#BEF264" };
const MODAL_BG    = { run:"#064E3B",tri:"#1E3A5F",dua:"#3B1F6E",swim:"#134E4A",mtb:"#451A03",trail:"#4C0519",ocr:"#500724",hyrox:"#14532D",marat:"#1E1B4B",xterra:"#1A2E05" };

const C = {
  bg:"#0E0F13", card:"#16181F", card2:"#1C1E27",
  border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.14)",
  text:"#F0F0F5", muted:"#6B6D7A", hint:"#3A3C47",
  accent:"#7C6FFF", accentBg:"#1E1B3A",
};

function toggle(arr, setArr, val) { setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]); }

function SectionCard({ step, stepColor, title, count, children }) {
  return (
    <div style={{ background:C.card, border:`0.5px solid ${C.border}`, borderRadius:16, padding:"1.1rem 1.25rem", marginBottom:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ width:22, height:22, borderRadius:"50%", background:stepColor, fontSize:11, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>{step}</div>
        <p style={{ fontSize:11, fontWeight:600, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", margin:0 }}>{title}</p>
        {count > 0 && <span style={{ fontSize:11, color:C.accent, marginLeft:"auto", background:C.accentBg, padding:"2px 8px", borderRadius:20 }}>{count} sel.</span>}
      </div>
      {children}
    </div>
  );
}

function RaceCard({ race }) {
  const [open, setOpen] = useState(false);
  const mId = race.modalidad_id || "run";
  const col = MODAL_COLOR[mId] || "#C4B5FD";
  const bg  = MODAL_BG[mId]  || C.accentBg;
  return (
    <div onClick={() => setOpen(!open)} style={{ background:C.card, border:`0.5px solid ${open ? C.border2 : C.border}`, borderRadius:14, padding:"1rem 1.1rem", cursor:"pointer", transition:"border-color .15s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
            <span style={{ fontSize:11, fontWeight:500, padding:"2px 9px", borderRadius:100, background:bg, color:col }}>{race.modalidad}</span>
            {race.estado && (
              <span style={{ fontSize:11, padding:"2px 9px", borderRadius:100,
                background: race.estado==="Abierta"?"#064E3B":race.estado==="Cerrada"?"#4C0519":"#451A03",
                color: race.estado==="Abierta"?"#6EE7B7":race.estado==="Cerrada"?"#FCA5A5":"#FCD34D"
              }}>{race.estado}</span>
            )}
          </div>
          <p style={{ fontSize:14, fontWeight:500, margin:"0 0 4px", color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{race.nombre}</p>
          <p style={{ fontSize:12, color:C.muted, margin:0 }}>{race.fecha} · {race.ubicacion}</p>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <p style={{ fontSize:13, fontWeight:500, color:col, margin:"0 0 4px" }}>{race.precio || "—"}</p>
          <p style={{ fontSize:11, color:C.muted, margin:0 }}>{open ? "▲" : "▼"}</p>
        </div>
      </div>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:`0.5px solid ${C.border}` }}>
          {race.distancia && <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>Distancia: <span style={{ color:C.text }}>{race.distancia}</span></p>}
          {race.comunidad && <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>Comunidad: <span style={{ color:C.text }}>{race.comunidad}</span></p>}
          {race.notas     && <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>Notas: <span style={{ color:C.text }}>{race.notas}</span></p>}
          {race.url       && <a href={race.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:col, textDecoration:"none", border:`0.5px solid ${col}`, padding:"5px 12px", borderRadius:6, display:"inline-block", marginTop:4 }}>Ver inscripción →</a>}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [paises, setPaises]           = useState([]);
  const [ccaa, setCcaa]               = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [distancias, setDistancias]   = useState([]);
  const [mesDesde, setMesDesde]       = useState(null);
  const [mesHasta, setMesHasta]       = useState(null);
  const [showMasPaises, setShowMasPaises] = useState(false);
  const [results, setResults]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [totalPruebas, setTotalPruebas] = useState(null);

  const espana = paises.includes("España");
  const anyFilter = paises.length || modalidades.length || distancias.length || mesDesde !== null || mesHasta !== null;

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count`, {
      headers: { "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}`, "Prefer": "count=exact" }
    }).then(r => {
      const count = r.headers.get("content-range");
      if (count) setTotalPruebas(count.split("/")[1]);
    }).catch(() => {});
  }, []);

  const summary = useMemo(() => {
    const parts = [];
    if (paises.length) parts.push(paises.join(", "));
    if (ccaa.length) parts.push(ccaa.length > 2 ? `${ccaa.length} comunidades` : ccaa.join(", "));
    if (modalidades.length) parts.push(MODALIDADES.filter(m => modalidades.includes(m.id)).map(m => m.label).join(", "));
    if (mesDesde !== null || mesHasta !== null) parts.push(`${mesDesde !== null ? MESES[mesDesde] : "—"} → ${mesHasta !== null ? MESES[mesHasta] : "—"}`);
    return parts.join(" · ") || null;
  }, [paises, ccaa, modalidades, distancias, mesDesde, mesHasta]);

  async function handleSearch() {
    if (!anyFilter) return;
    setLoading(true); setError(null); setResults(null);
    try {
      const params = new URLSearchParams();
      params.append("select", "*");
      params.append("order", "fecha_iso.asc");
      if (paises.length === 1) params.append("pais", `eq.${paises[0]}`);
      if (paises.length > 1)  params.append("pais", `in.(${paises.join(",")})`);
      if (ccaa.length === 1)  params.append("comunidad", `eq.${ccaa[0]}`);
      if (ccaa.length > 1)    params.append("comunidad", `in.(${ccaa.join(",")})`);
      if (modalidades.length === 1) params.append("modalidad_id", `eq.${modalidades[0]}`);
      if (modalidades.length > 1)   params.append("modalidad_id", `in.(${modalidades.join(",")})`);
      if (mesDesde !== null) params.append("fecha_iso", `gte.2026-${String(mesDesde+1).padStart(2,"0")}-01`);
      if (mesHasta !== null) params.append("fecha_iso", `lte.${new Date(2026, mesHasta+1, 0).toISOString().split("T")[0]}`);

      const res = await fetch(`${SUPABASE_URL}/rest/v1/races?${params.toString()}`, {
        headers: { "apikey": ANON_KEY, "Authorization": `Bearer ${ANON_KEY}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data.message || "Error");
      setResults(data);
    } catch (e) {
      setError("Error al conectar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPaises([]); setCcaa([]); setModalidades([]); setDistancias([]);
    setMesDesde(null); setMesHasta(null); setResults(null); setError(null);
  }

  const stepColors = ["#2563EB","#7C3AED","#059669","#B45309","#1D4ED8"];

  return (
    <>
      <Head>
        <title>Hibrid Sport Calendar — Pruebas deportivas 2026</title>
        <meta name="description" content="Calendario de pruebas deportivas 2026 en España y Europa. Running, triatlón, trail, HYROX, OCR, natación y más." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Hibrid Sport Calendar" />
        <meta property="og:description" content="Encuentra tu próxima prueba deportiva en España y Europa." />
      </Head>

      <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"system-ui,-apple-system,sans-serif", color:C.text }}>
        <div style={{ maxWidth:860, margin:"0 auto", padding:"0 1rem 3rem" }}>

          {/* Header */}
          <div style={{ padding:"2rem 0 1.5rem", borderBottom:`0.5px solid ${C.border}`, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:C.accentBg, border:`0.5px solid ${C.accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏅</div>
              <div>
                <h1 style={{ fontSize:20, fontWeight:600, margin:0, letterSpacing:"-0.3px" }}>Hibrid Sport Calendar</h1>
                <p style={{ fontSize:12, color:C.muted, margin:"2px 0 0" }}>
                  Pruebas deportivas 2026
                  {totalPruebas && <span style={{ marginLeft:8, color:C.accent, background:C.accentBg, padding:"1px 7px", borderRadius:20, fontSize:11 }}>{totalPruebas} indexadas</span>}
                </p>
              </div>
            </div>
            {(anyFilter || results) && (
              <button onClick={handleReset} style={{ fontSize:12, color:C.muted, background:"none", border:`0.5px solid ${C.border}`, borderRadius:8, padding:"6px 14px", cursor:"pointer" }}>Limpiar filtros</button>
            )}
          </div>

          {/* Hero */}
          <div style={{ marginBottom:24, padding:"1.25rem 1.5rem", background:C.card, borderRadius:16, border:`0.5px solid ${C.border}` }}>
            <p style={{ fontSize:22, fontWeight:600, margin:"0 0 6px", letterSpacing:"-0.4px" }}>Encuentra tu próxima carrera</p>
            <p style={{ fontSize:14, color:C.muted, margin:0, lineHeight:1.6 }}>Running, triatlón, trail, HYROX, OCR, natación y más — en España y Europa. Actualizado diariamente.</p>
          </div>

          {/* 1 — País */}
          <SectionCard step="1" stepColor={stepColors[0]} title="País" count={paises.length}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {(showMasPaises ? PAISES : PAISES.slice(0,9)).map(p => (
                <button key={p} onClick={() => toggle(paises, setPaises, p)} style={{ padding:"5px 13px", fontSize:12, borderRadius:100, cursor:"pointer", fontWeight: paises.includes(p)?500:400, border: paises.includes(p)?`1.5px solid #93C5FD`:`0.5px solid ${C.border}`, background: paises.includes(p)?"#1E3A5F":C.card2, color: paises.includes(p)?"#93C5FD":C.muted, transition:"all .1s" }}>{p}</button>
              ))}
              <button onClick={() => setShowMasPaises(!showMasPaises)} style={{ fontSize:12, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:"5px 4px" }}>{showMasPaises ? "Menos ▲" : `+${PAISES.length-9} más ▼`}</button>
            </div>
          </SectionCard>

          {/* 2 — CCAA */}
          {espana && (
            <SectionCard step="2" stepColor={stepColors[1]} title="Comunidad autónoma (opcional)" count={ccaa.length}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {CCAA.map(c => (
                  <button key={c} onClick={() => toggle(ccaa, setCcaa, c)} style={{ padding:"4px 11px", fontSize:12, borderRadius:100, cursor:"pointer", fontWeight: ccaa.includes(c)?500:400, border: ccaa.includes(c)?`1.5px solid ${C.accent}`:`0.5px solid ${C.border}`, background: ccaa.includes(c)?C.accentBg:C.card2, color: ccaa.includes(c)?"#C4B5FD":C.muted, transition:"all .1s" }}>{c}</button>
                ))}
              </div>
            </SectionCard>
          )}

          {/* 3 — Modalidad */}
          <SectionCard step={espana?3:2} stepColor={stepColors[2]} title="Modalidad deportiva (opcional)" count={modalidades.length}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {MODALIDADES.map(m => (
                <button key={m.id} onClick={() => toggle(modalidades, setModalidades, m.id)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", fontSize:13, borderRadius:100, cursor:"pointer", fontWeight: modalidades.includes(m.id)?500:400, border: modalidades.includes(m.id)?`1.5px solid ${MODAL_COLOR[m.id]}`:`0.5px solid ${C.border}`, background: modalidades.includes(m.id)?MODAL_BG[m.id]:C.card2, color: modalidades.includes(m.id)?MODAL_COLOR[m.id]:C.muted, transition:"all .1s" }}>
                  <span style={{ fontSize:14 }}>{m.icon}</span>{m.label}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* 4 — Distancia */}
          <SectionCard step={espana?4:3} stepColor={stepColors[3]} title="Distancia (opcional)" count={distancias.length}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {DISTANCIAS.map(d => (
                <button key={d.id} onClick={() => toggle(distancias, setDistancias, d.id)} style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontWeight: distancias.includes(d.id)?500:400, fontSize:13, border: distancias.includes(d.id)?`1.5px solid #FCD34D`:`0.5px solid ${C.border}`, background: distancias.includes(d.id)?"#451A03":C.card2, color: distancias.includes(d.id)?"#FCD34D":C.muted, transition:"all .1s" }}>
                  {d.label}<span style={{ fontSize:10, opacity:0.6, marginTop:2 }}>{d.sub}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* 5 — Fechas */}
          <SectionCard step={espana?5:4} stepColor={stepColors[4]} title="Rango de fechas — 2026 (opcional)">
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {["Desde","Hasta"].map((lbl, li) => (
                <div key={lbl} style={{ flex:1, minWidth:200 }}>
                  <p style={{ fontSize:11, color:C.muted, margin:"0 0 8px" }}>{lbl}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {MESES.map((m, i) => {
                      const sel = li===0 ? mesDesde===i : mesHasta===i;
                      const faded = li===0 ? (mesDesde!==null&&i<mesDesde) : (mesHasta!==null&&i>mesHasta);
                      return (
                        <button key={i} onClick={() => li===0 ? setMesDesde(mesDesde===i?null:i) : setMesHasta(mesHasta===i?null:i)} style={{ padding:"5px 9px", fontSize:12, borderRadius:6, cursor:"pointer", fontWeight:sel?500:400, border: sel?`1.5px solid ${C.accent}`:`0.5px solid ${C.border}`, background: sel?C.accentBg:C.card2, color: sel?"#C4B5FD":C.muted, opacity:faded?0.3:1, transition:"all .1s" }}>{m}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* CTA */}
          <div style={{ background: anyFilter?C.accentBg:C.card, border:`0.5px solid ${anyFilter?C.accent:C.border}`, borderRadius:16, padding:"1.1rem 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:24 }}>
            <p style={{ fontSize:13, color: anyFilter?"#C4B5FD":C.muted, margin:0, flex:1, lineHeight:1.6 }}>
              {summary || "Selecciona al menos un filtro para buscar pruebas"}
            </p>
            <button onClick={handleSearch} disabled={!anyFilter||loading} style={{ padding:"10px 24px", borderRadius:10, background: anyFilter?"#7C6FFF":C.hint, color: anyFilter?"#fff":C.muted, border:"none", fontSize:14, fontWeight:500, cursor: anyFilter&&!loading?"pointer":"default", opacity:loading?0.7:1, transition:"opacity .15s" }}>
              {loading ? "Buscando..." : "Buscar pruebas"}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"3rem 0", color:C.muted }}>
              <div style={{ width:36, height:36, border:`2px solid ${C.hint}`, borderTop:`2px solid ${C.accent}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              <p style={{ fontSize:13, margin:0 }}>Buscando pruebas...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Error */}
          {error && <p style={{ fontSize:13, color:"#FCA5A5", textAlign:"center", padding:"1.5rem 0" }}>{error}</p>}

          {/* Resultados */}
          {results && !loading && (
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <p style={{ fontSize:14, fontWeight:500, color:C.text, margin:0 }}>{results.length} prueba{results.length!==1?"s":""} encontrada{results.length!==1?"s":""}</p>
                <p style={{ fontSize:11, color:C.muted, margin:0 }}>Pulsa para ver más info</p>
              </div>
              {results.length === 0
                ? <p style={{ textAlign:"center", color:C.muted, padding:"3rem 0", fontSize:14 }}>Sin resultados con estos filtros.</p>
                : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(340px, 1fr))", gap:10 }}>
                    {results.map((r, i) => <RaceCard key={i} race={r} />)}
                  </div>
              }
            </div>
          )}

        </div>
      </div>
    </>
  );
}
