import { useState, useMemo } from "react";
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
  { id:"sprint", label:"Sprint / Short", sub:"< 5 km" },
  { id:"5k",     label:"5K",             sub:"5 km" },
  { id:"10k",    label:"10K",            sub:"10 km" },
  { id:"media",  label:"Media maratón",  sub:"21 km" },
  { id:"marat",  label:"Maratón",        sub:"42 km" },
  { id:"larga",  label:"Larga distancia",sub:"50 km+" },
  { id:"ultra",  label:"Ultra",          sub:"80 km+" },
];
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MODAL_COLOR = { run:"#6EE7B7",tri:"#93C5FD",dua:"#C4B5FD",swim:"#5EEAD4",mtb:"#FCD34D",trail:"#FCA5A5",ocr:"#F9A8D4",hyrox:"#86EFAC",marat:"#A5B4FC",xterra:"#BEF264" };
const MODAL_BG    = { run:"#064E3B",tri:"#1E3A5F",dua:"#3B1F6E",swim:"#134E4A",mtb:"#451A03",trail:"#4C0519",ocr:"#500724",hyrox:"#14532D",marat:"#1E1B4B",xterra:"#1A2E05" };

function toggle(arr, setArr, val) { setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]); }

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

  const espana = paises.includes("España");
  const anyFilter = paises.length || modalidades.length || distancias.length || mesDesde !== null || mesHasta !== null;

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
      if (ccaa.length === 1)   params.append("comunidad", `eq.${ccaa[0]}`);
      if (ccaa.length > 1)     params.append("comunidad", `in.(${ccaa.join(",")})`);
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

  const stepColor = ["#2563EB","#7C3AED","#059669","#B45309","#1D4ED8"];

  return (
    <>
      <Head>
        <title>Hibrid Sport Calendar — Pruebas deportivas 2026</title>
        <meta name="description" content="Calendario de pruebas deportivas 2026 en España y Europa. Running, triatlón, trail, HYROX, OCR, natación y más." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background:"#0E0F13", minHeight:"100vh", padding:"1.5rem 1.25rem", maxWidth:900, margin:"0 auto", fontFamily:"system-ui,sans-serif", color:"#F0F0F5", boxSizing:"border-box" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#1E1B3A", border:"0.5px solid #7C6FFF", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:18 }}>🏅</span>
            </div>
            <div>
              <p style={{ fontSize:18, fontWeight:500, margin:0 }}>Hibrid Sport Calendar</p>
              <p style={{ fontSize:11, color:"#6B6D7A", margin:0 }}>Pruebas deportivas 2026</p>
            </div>
          </div>
          {(anyFilter || results) && (
            <button onClick={handleReset} style={{ fontSize:12, color:"#6B6D7A", background:"none", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>Limpiar</button>
          )}
        </div>

        {/* 1 — País */}
        <div style={{ background:"#16181F", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1rem 1.25rem", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:stepColor[0], fontSize:11, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>1</div>
            <p style={{ fontSize:11, fontWeight:500, color:"#6B6D7A", letterSpacing:"0.07em", textTransform:"uppercase", margin:0 }}>País</p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {(showMasPaises ? PAISES : PAISES.slice(0,9)).map(p => (
              <button key={p} onClick={() => toggle(paises, setPaises, p)} style={{ padding:"5px 12px", fontSize:12, borderRadius:100, cursor:"pointer", border: paises.includes(p) ? "1.5px solid #93C5FD" : "0.5px solid rgba(255,255,255,0.08)", background: paises.includes(p) ? "#1E3A5F" : "#1C1E27", color: paises.includes(p) ? "#93C5FD" : "#6B6D7A", fontWeight: paises.includes(p) ? 500 : 400 }}>{p}</button>
            ))}
            <button onClick={() => setShowMasPaises(!showMasPaises)} style={{ fontSize:12, color:"#6B6D7A", background:"none", border:"none", cursor:"pointer" }}>{showMasPaises ? "Menos ▲" : `+${PAISES.length-9} más ▼`}</button>
          </div>
        </div>

        {/* 2 — CCAA */}
        {espana && (
          <div style={{ background:"#16181F", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1rem 1.25rem", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:stepColor[1], fontSize:11, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>2</div>
              <p style={{ fontSize:11, fontWeight:500, color:"#6B6D7A", letterSpacing:"0.07em", textTransform:"uppercase", margin:0 }}>Comunidad autónoma (opcional)</p>
              {ccaa.length > 0 && <span style={{ fontSize:11, color:"#C4B5FD", marginLeft:"auto" }}>{ccaa.length} sel.</span>}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {CCAA.map(c => (
                <button key={c} onClick={() => toggle(ccaa, setCcaa, c)} style={{ padding:"4px 10px", fontSize:11, borderRadius:100, cursor:"pointer", border: ccaa.includes(c) ? "1.5px solid #7C6FFF" : "0.5px solid rgba(255,255,255,0.08)", background: ccaa.includes(c) ? "#1E1B3A" : "#1C1E27", color: ccaa.includes(c) ? "#C4B5FD" : "#6B6D7A", fontWeight: ccaa.includes(c) ? 500 : 400 }}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {/* 3 — Modalidad */}
        <div style={{ background:"#16181F", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1rem 1.25rem", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:stepColor[2], fontSize:11, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>{espana ? 3 : 2}</div>
            <p style={{ fontSize:11, fontWeight:500, color:"#6B6D7A", letterSpacing:"0.07em", textTransform:"uppercase", margin:0 }}>Modalidad deportiva (opcional)</p>
            {modalidades.length > 0 && <span style={{ fontSize:11, color:"#6EE7B7", marginLeft:"auto" }}>{modalidades.length} sel.</span>}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {MODALIDADES.map(m => (
              <button key={m.id} onClick={() => toggle(modalidades, setModalidades, m.id)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", fontSize:13, borderRadius:100, cursor:"pointer", border: modalidades.includes(m.id) ? `1.5px solid ${MODAL_COLOR[m.id]}` : "0.5px solid rgba(255,255,255,0.08)", background: modalidades.includes(m.id) ? MODAL_BG[m.id] : "#1C1E27", color: modalidades.includes(m.id) ? MODAL_COLOR[m.id] : "#6B6D7A", fontWeight: modalidades.includes(m.id) ? 500 : 400 }}>
                <span style={{ fontSize:13 }}>{m.icon}</span>{m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 — Distancia */}
        <div style={{ background:"#16181F", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1rem 1.25rem", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:stepColor[3], fontSize:11, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>{espana ? 4 : 3}</div>
            <p style={{ fontSize:11, fontWeight:500, color:"#6B6D7A", letterSpacing:"0.07em", textTransform:"uppercase", margin:0 }}>Distancia (opcional)</p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {DISTANCIAS.map(d => (
              <button key={d.id} onClick={() => toggle(distancias, setDistancias, d.id)} style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", padding:"8px 14px", borderRadius:8, cursor:"pointer", border: distancias.includes(d.id) ? "1.5px solid #FCD34D" : "0.5px solid rgba(255,255,255,0.08)", background: distancias.includes(d.id) ? "#451A03" : "#1C1E27", color: distancias.includes(d.id) ? "#FCD34D" : "#6B6D7A", fontWeight: distancias.includes(d.id) ? 500 : 400, fontSize:13 }}>
                {d.label}<span style={{ fontSize:10, opacity:0.6, marginTop:2 }}>{d.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5 — Fechas */}
        <div style={{ background:"#16181F", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"1rem 1.25rem", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:stepColor[4], fontSize:11, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>{espana ? 5 : 4}</div>
            <p style={{ fontSize:11, fontWeight:500, color:"#6B6D7A", letterSpacing:"0.07em", textTransform:"uppercase", margin:0 }}>Rango de fechas — 2026 (opcional)</p>
          </div>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {["Desde","Hasta"].map((lbl, li) => (
              <div key={lbl} style={{ flex:1, minWidth:180 }}>
                <p style={{ fontSize:11, color:"#6B6D7A", margin:"0 0 8px" }}>{lbl}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {MESES.map((m, i) => {
                    const sel = li === 0 ? mesDesde === i : mesHasta === i;
                    const faded = li === 0 ? (mesDesde !== null && i < mesDesde) : (mesHasta !== null && i > mesHasta);
                    return (
                      <button key={i} onClick={() => li === 0 ? setMesDesde(mesDesde === i ? null : i) : setMesHasta(mesHasta === i ? null : i)} style={{ padding:"5px 9px", fontSize:12, borderRadius:6, cursor:"pointer", border: sel ? "1.5px solid #7C6FFF" : "0.5px solid rgba(255,255,255,0.08)", background: sel ? "#1E1B3A" : "#1C1E27", color: sel ? "#C4B5FD" : "#6B6D7A", fontWeight: sel ? 500 : 400, opacity: faded ? 0.3 : 1 }}>{m}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: anyFilter ? "#1E1B3A" : "#16181F", border: `0.5px solid ${anyFilter ? "#7C6FFF" : "rgba(255,255,255,0.08)"}`, borderRadius:14, padding:"1rem 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:20 }}>
          <p style={{ fontSize:12, color: anyFilter ? "#C4B5FD" : "#6B6D7A", margin:0, flex:1, lineHeight:1.6 }}>
            {summary || "Selecciona al menos un filtro para buscar pruebas"}
          </p>
          <button onClick={handleSearch} disabled={!anyFilter || loading} style={{ padding:"9px 22px", borderRadius:8, background: anyFilter ? "#7C6FFF" : "#3A3C47", color: anyFilter ? "#fff" : "#6B6D7A", border:"none", fontSize:14, fontWeight:500, cursor: anyFilter && !loading ? "pointer" : "default", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Buscando..." : "Buscar pruebas"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"2rem 0", color:"#6B6D7A" }}>
            <div style={{ width:32, height:32, border:"2px solid #3A3C47", borderTop:"2px solid #7C6FFF", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
            <p style={{ fontSize:13, margin:0 }}>Buscando pruebas...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* Error */}
        {error && <p style={{ fontSize:13, color:"#FCA5A5", textAlign:"center", padding:"1rem 0" }}>{error}</p>}

        {/* Resultados */}
        {results && !loading && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <p style={{ fontSize:13, fontWeight:500, color:"#F0F0F5", margin:0 }}>{results.length} pruebas encontradas</p>
              <p style={{ fontSize:11, color:"#6B6D7A", margin:0 }}>Pulsa cada tarjeta para más info</p>
            </div>
            <div style={{ display:"grid", gap:8 }}>
              {results.length === 0 && <p style={{ textAlign:"center", color:"#6B6D7A", padding:"2rem 0", fontSize:14 }}>Sin resultados con estos filtros.</p>}
              {results.map((r, i) => <RaceCard key={i} race={r} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function RaceCard({ race }) {
  const [open, setOpen] = useState(false);
  const mId = race.modalidad_id || "run";
  const col = MODAL_COLOR[mId] || "#C4B5FD";
  const bg  = MODAL_BG[mId]  || "#1E1B3A";
  return (
    <div onClick={() => setOpen(!open)} style={{ background:"#16181F", border:`0.5px solid ${open ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"}`, borderRadius:12, padding:"0.9rem 1.1rem", cursor:"pointer" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
            <span style={{ fontSize:11, fontWeight:500, padding:"2px 9px", borderRadius:100, background:bg, color:col }}>{race.modalidad}</span>
            {race.estado && <span style={{ fontSize:11, padding:"2px 9px", borderRadius:100, background: race.estado==="Abierta"?"#064E3B":race.estado==="Cerrada"?"#4C0519":"#451A03", color: race.estado==="Abierta"?"#6EE7B7":race.estado==="Cerrada"?"#FCA5A5":"#FCD34D" }}>{race.estado}</span>}
          </div>
          <p style={{ fontSize:14, fontWeight:500, margin:"0 0 4px", color:"#F0F0F5" }}>{race.nombre}</p>
          <p style={{ fontSize:12, color:"#6B6D7A", margin:0 }}>{race.fecha} · {race.ubicacion}</p>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <p style={{ fontSize:13, fontWeight:500, color:col, margin:"0 0 2px" }}>{race.precio || "—"}</p>
          <p style={{ fontSize:11, color:"#6B6D7A", margin:0 }}>{open ? "▲" : "▼"}</p>
        </div>
      </div>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"0.5px solid rgba(255,255,255,0.08)" }}>
          {race.distancia && <p style={{ fontSize:12, color:"#6B6D7A", margin:"0 0 4px" }}>Distancia: <span style={{ color:"#F0F0F5" }}>{race.distancia}</span></p>}
          {race.notas     && <p style={{ fontSize:12, color:"#6B6D7A", margin:"0 0 4px" }}>Notas: <span style={{ color:"#F0F0F5" }}>{race.notas}</span></p>}
          {race.url       && <a href={race.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:col, textDecoration:"none", border:`0.5px solid ${col}`, padding:"4px 10px", borderRadius:6, display:"inline-block", marginTop:4 }}>Ver inscripción →</a>}
        </div>
      )}
    </div>
  );
}
