import { useState, useEffect } from "react";
import Head from "next/head";

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzA2MDcsImV4cCI6MjA5MjUwNjYwN30.kY5rw5BFXqdMze0IMQmbDQNfh5uXhaI35e4LfMYNOjE";

const CCAA = [
  "Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria",
  "Castilla-La Mancha","Castilla y León","Cataluña","Ceuta",
  "Comunidad Valenciana","Extremadura","Galicia","La Rioja",
  "Madrid","Melilla","Murcia","Navarra","País Vasco",
];

const MODALIDADES = [
  {
    id: "running", label: "Running", icon: "🏃",
    color: "#6EE7B7", bg: "#064E3B",
    subs: [
      { id: "running-road",  label: "Road running" },
      { id: "running-trail", label: "Trail" },
      { id: "running-mont",  label: "Montaña" },
    ],
  },
  {
    id: "ciclismo", label: "Ciclismo", icon: "🚴",
    color: "#FCD34D", bg: "#451A03",
    subs: [
      { id: "cicl-carretera", label: "Carretera" },
      { id: "cicl-gravel",    label: "Gravel" },
      { id: "cicl-mtb",       label: "MTB" },
    ],
  },
  {
    id: "natacion", label: "Natación", icon: "🌊",
    color: "#5EEAD4", bg: "#134E4A",
    subs: [
      { id: "nat-piscina",  label: "Piscina" },
      { id: "nat-abiertas", label: "Aguas abiertas" },
    ],
  },
  {
    id: "triatlon", label: "Triatlón", icon: "🏊",
    color: "#93C5FD", bg: "#1E3A5F",
    subs: [
      { id: "tri-triatlon", label: "Triatlón" },
      { id: "tri-duatlon",  label: "Duatlón" },
      { id: "tri-xterra",   label: "XTERRA" },
      { id: "tri-aquatlon", label: "Aquatlón" },
    ],
  },
  {
    id: "funcional", label: "Funcional", icon: "💪",
    color: "#86EFAC", bg: "#14532D",
    subs: [
      { id: "func-hyrox",   label: "HYROX" },
      { id: "func-crossfit",label: "CrossFit" },
      { id: "func-fitness", label: "Fitness funcional" },
    ],
  },
  {
    id: "ocr", label: "OCR", icon: "🔥",
    color: "#F9A8D4", bg: "#500724",
    subs: [
      { id: "ocr-spartan", label: "Spartan Race" },
      { id: "ocr-mudder",  label: "Tough Mudder" },
      { id: "ocr-general", label: "Obstáculos" },
    ],
  },
];

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const C = {
  bg: "#0E0F13", card: "#16181F", card2: "#1C1E27",
  border: "rgba(255,255,255,0.07)", border2: "rgba(255,255,255,0.16)",
  text: "#F0F0F5", muted: "#6B6D7A", hint: "#2E3040",
  accent: "#7C6FFF", accentBg: "#1E1B3A", accentMid: "#C4B5FD",
};

// Build color lookups from parent modality
const SUB_COLOR = {};
const SUB_BG = {};
MODALIDADES.forEach(m => {
  m.subs.forEach(s => { SUB_COLOR[s.id] = m.color; SUB_BG[s.id] = m.bg; });
});

function toggle(arr, setArr, val) {
  setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
}

// ── Distance slider — logarithmic scale 0–1000 km ─────────────────────────────
const SLIDER_MAX = 1000;

function posToKm(pos) {
  if (pos <= 0) return 0;
  if (pos >= SLIDER_MAX) return 1000;
  return Math.round(Math.pow(10, (pos / SLIDER_MAX) * 3));
}
function kmToPos(km) {
  if (km <= 0) return 0;
  if (km >= 1000) return SLIDER_MAX;
  return Math.round((Math.log10(Math.max(km, 1)) / 3) * SLIDER_MAX);
}
function fmtKm(km) {
  if (km === 0) return "0 km";
  if (km >= 1000) return "1000+ km";
  return `${km} km`;
}

function DistanceSlider({ minKm, maxKm, onMin, onMax }) {
  const minPos = kmToPos(minKm);
  const maxPos = kmToPos(maxKm);
  const pctL   = (minPos / SLIDER_MAX) * 100;
  const pctR   = (maxPos / SLIDER_MAX) * 100;
  const active = minKm > 0 || maxKm < 1000;

  // Scale markers at log positions
  const marks = [
    { km: 0,    label: "0" },
    { km: 10,   label: "10" },
    { km: 42,   label: "42" },
    { km: 100,  label: "100" },
    { km: 1000, label: "1000" },
  ];

  return (
    <div>
      {/* Current range display */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: active ? C.accentMid : C.muted,
          background: active ? C.accentBg : C.card2,
          border: `0.5px solid ${active ? C.accent : C.border}`,
          padding: "3px 9px", borderRadius: 6 }}>
          {fmtKm(minKm)}
        </span>
        <span style={{ fontSize: 10, color: C.hint }}>——</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: active ? C.accentMid : C.muted,
          background: active ? C.accentBg : C.card2,
          border: `0.5px solid ${active ? C.accent : C.border}`,
          padding: "3px 9px", borderRadius: 6 }}>
          {fmtKm(maxKm)}
        </span>
      </div>

      {/* Track + dual thumbs */}
      <div className="dist-range">
        {/* Track base */}
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)",
          left: 0, right: 0, height: 4, background: C.hint, borderRadius: 2, pointerEvents: "none" }} />
        {/* Filled segment */}
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)",
          left: `${pctL}%`, width: `${pctR - pctL}%`, height: 4,
          background: active ? C.accent : "#3A3C55", borderRadius: 2, pointerEvents: "none",
          transition: "background .2s" }} />

        {/* Min thumb */}
        <input
          type="range" min={0} max={SLIDER_MAX} value={minPos}
          onChange={e => {
            const p = Math.min(Number(e.target.value), maxPos - 10);
            onMin(posToKm(p));
          }}
          className="dist-thumb"
        />
        {/* Max thumb */}
        <input
          type="range" min={0} max={SLIDER_MAX} value={maxPos}
          onChange={e => {
            const p = Math.max(Number(e.target.value), minPos + 10);
            onMax(posToKm(p));
          }}
          className="dist-thumb"
        />
      </div>

      {/* Scale markers */}
      <div style={{ position: "relative", height: 18, marginTop: 4 }}>
        {marks.map(({ km, label }) => {
          const pct = (kmToPos(km) / SLIDER_MAX) * 100;
          return (
            <span key={km} style={{
              position: "absolute", left: `${pct}%`, transform: "translateX(-50%)",
              fontSize: 9, color: C.muted, userSelect: "none",
            }}>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── RaceCard ──────────────────────────────────────────────────────────────────
function RaceCard({ race }) {
  const [open, setOpen] = useState(false);
  const col = SUB_COLOR[race.modalidad_id] || C.accentMid;
  const bg  = SUB_BG[race.modalidad_id]   || C.accentBg;

  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: C.card,
        border: `0.5px solid ${open ? C.border2 : C.border}`,
        borderRadius: 12,
        padding: "0.8rem 1rem",
        cursor: "pointer",
        transition: "border-color .15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 100, background: bg, color: col }}>
              {race.modalidad}
            </span>
            {race.estado && (
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 100,
                background: race.estado === "Abierta" ? "#064E3B" : race.estado === "Cerrada" ? "#4C0519" : "#451A03",
                color:      race.estado === "Abierta" ? "#6EE7B7" : race.estado === "Cerrada" ? "#FCA5A5" : "#FCD34D",
              }}>
                {race.estado}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 3px", color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {race.nombre}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
            {race.fecha}{race.ubicacion ? ` · ${race.ubicacion}` : ""}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: col, margin: "0 0 2px" }}>{race.precio || "—"}</p>
          <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{open ? "▲" : "▼"}</p>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${C.border}` }}>
          {race.distancia && (
            <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px" }}>
              Distancia: <span style={{ color: C.text }}>{race.distancia}</span>
            </p>
          )}
          {race.comunidad && (
            <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px" }}>
              Comunidad: <span style={{ color: C.text }}>{race.comunidad}</span>
            </p>
          )}
          {race.notas && (
            <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px" }}>
              Notas: <span style={{ color: C.text }}>{race.notas}</span>
            </p>
          )}
          {race.url && (
            <a
              href={race.url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize: 11, color: col, textDecoration: "none", border: `0.5px solid ${col}`, padding: "4px 10px", borderRadius: 6, display: "inline-block", marginTop: 4 }}
            >
              Ver inscripción →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── FilterSection ─────────────────────────────────────────────────────────────
function FilterSection({ title, count, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
        {title}
        {count > 0 && <span style={{ fontWeight: 700, color: C.accent }}>{count}</span>}
      </p>
      {children}
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [ccaa, setCcaa]               = useState([]);
  const [modalParents, setModalParents] = useState([]);
  const [modalSubs, setModalSubs]     = useState([]);
  const [distMin, setDistMin]         = useState(0);
  const [distMax, setDistMax]         = useState(1000);
  const [mesDesde, setMesDesde]       = useState(null);
  const [mesHasta, setMesHasta]       = useState(null);
  const [results, setResults]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [totalPruebas, setTotalPruebas] = useState(null);

  const distActive = distMin > 0 || distMax < 1000;
  const anyFilter =
    ccaa.length || modalParents.length || modalSubs.length ||
    distActive || mesDesde !== null || mesHasta !== null;

  function toggleParent(id) {
    if (modalParents.includes(id)) {
      setModalParents(p => p.filter(x => x !== id));
      const subIds = MODALIDADES.find(m => m.id === id)?.subs.map(s => s.id) || [];
      setModalSubs(s => s.filter(x => !subIds.includes(x)));
    } else {
      setModalParents(p => [...p, id]);
    }
  }

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, Prefer: "count=exact" },
    })
      .then(r => { const c = r.headers.get("content-range"); if (c) setTotalPruebas(c.split("/")[1]); })
      .catch(() => {});
  }, []);

  async function handleSearch() {
    if (!anyFilter) return;
    setLoading(true); setError(null); setResults(null);
    try {
      const p = new URLSearchParams();
      p.append("select", "*");
      p.append("order", "fecha_iso.asc");
      p.append("pais", "eq.España");

      if (ccaa.length === 1) p.append("comunidad", `eq.${ccaa[0]}`);
      if (ccaa.length > 1)   p.append("comunidad", `in.(${ccaa.join(",")})`);

      if (modalSubs.length > 0) {
        if (modalSubs.length === 1) p.append("modalidad_id", `eq.${modalSubs[0]}`);
        else p.append("modalidad_id", `in.(${modalSubs.join(",")})`);
      } else if (modalParents.length > 0) {
        if (modalParents.length === 1) p.append("modalidad_parent", `eq.${modalParents[0]}`);
        else p.append("modalidad_parent", `in.(${modalParents.join(",")})`);
      }

      if (distMin > 0)    p.append("distancia_km", `gte.${distMin}`);
      if (distMax < 1000) p.append("distancia_km", `lte.${distMax}`);

      if (mesDesde !== null)
        p.append("fecha_iso", `gte.2026-${String(mesDesde + 1).padStart(2, "0")}-01`);
      if (mesHasta !== null)
        p.append("fecha_iso", `lte.${new Date(2026, mesHasta + 1, 0).toISOString().split("T")[0]}`);

      const res  = await fetch(`${SUPABASE_URL}/rest/v1/races?${p}`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data.message || "Error");
      setResults(data);
    } catch {
      setError("Error al conectar con la base de datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCcaa([]); setModalParents([]); setModalSubs([]);
    setDistMin(0); setDistMax(1000);
    setMesDesde(null); setMesHasta(null);
    setResults(null); setError(null);
  }

  return (
    <>
      <Head>
        <title>Hibrid Sport Calendar — Pruebas España 2026</title>
        <meta name="description" content="Calendario de pruebas deportivas 2026 en España. Running, triatlón, trail, HYROX, OCR, natación y más." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #0E0F13; color: #F0F0F5; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2E3040; border-radius: 4px; }

        /* ── Dual-range distance slider ── */
        .dist-range { position: relative; height: 28px; margin: 2px 0; }
        .dist-thumb {
          -webkit-appearance: none; appearance: none;
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 100%; height: 28px;
          background: transparent; pointer-events: none;
          outline: none; margin: 0;
        }
        .dist-thumb::-webkit-slider-runnable-track { background: transparent; height: 4px; }
        .dist-thumb::-moz-range-track { background: transparent; height: 4px; border: none; }
        .dist-thumb::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          pointer-events: all;
          width: 18px; height: 18px; border-radius: 50%;
          background: #7C6FFF; border: 2.5px solid #0E0F13;
          cursor: grab; box-shadow: 0 0 0 3px rgba(124,111,255,0.18);
          transition: box-shadow .15s;
        }
        .dist-thumb::-webkit-slider-thumb:hover  { box-shadow: 0 0 0 5px rgba(124,111,255,0.28); }
        .dist-thumb::-webkit-slider-thumb:active { cursor: grabbing; }
        .dist-thumb::-moz-range-thumb {
          pointer-events: all;
          width: 18px; height: 18px; border-radius: 50%;
          background: #7C6FFF; border: 2.5px solid #0E0F13;
          cursor: grab;
        }

        @media (max-width: 768px) {
          html, body { overflow: auto; }
          #sidebar { width: 100% !important; min-width: unset !important; height: auto !important; border-right: none !important; border-bottom: 0.5px solid rgba(255,255,255,0.07); }
          #layout { flex-direction: column !important; }
          #main { height: auto !important; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* ── Header ── */}
        <div style={{ height: 52, flexShrink: 0, background: C.card, borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accentBg, border: `0.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
              🏅
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: "-0.2px" }}>Hibrid Sport Calendar</p>
              <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>
                Pruebas España 2026
                {totalPruebas && (
                  <span style={{ marginLeft: 6, color: C.accent, background: C.accentBg, padding: "1px 6px", borderRadius: 20, fontSize: 10 }}>
                    {totalPruebas} indexadas
                  </span>
                )}
              </p>
            </div>
          </div>
          {(anyFilter || results) && (
            <button onClick={handleReset} style={{ fontSize: 12, color: C.muted, background: "none", border: `0.5px solid ${C.border}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>
              Limpiar
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div id="layout" style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Sidebar ── */}
          <div
            id="sidebar"
            style={{
              width: 282, minWidth: 282,
              background: C.card,
              borderRight: `0.5px solid ${C.border}`,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* CCAA */}
            <FilterSection title="Comunidad autónoma" count={ccaa.length}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {CCAA.map(c => (
                  <button
                    key={c}
                    onClick={() => toggle(ccaa, setCcaa, c)}
                    style={{
                      padding: "3px 9px", fontSize: 11, borderRadius: 100, cursor: "pointer",
                      fontWeight: ccaa.includes(c) ? 500 : 400,
                      border:      ccaa.includes(c) ? `1.5px solid ${C.accent}` : `0.5px solid ${C.border}`,
                      background:  ccaa.includes(c) ? C.accentBg : C.card2,
                      color:       ccaa.includes(c) ? C.accentMid : C.muted,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Modalidades jerárquicas */}
            <FilterSection title="Modalidad" count={modalParents.length + modalSubs.length}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {MODALIDADES.map(m => (
                  <div key={m.id}>
                    <button
                      onClick={() => toggleParent(m.id)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "5px 11px", fontSize: 12, borderRadius: 100, cursor: "pointer",
                        fontWeight:  modalParents.includes(m.id) ? 500 : 400,
                        border:      modalParents.includes(m.id) ? `1.5px solid ${m.color}` : `0.5px solid ${C.border}`,
                        background:  modalParents.includes(m.id) ? m.bg : C.card2,
                        color:       modalParents.includes(m.id) ? m.color : C.muted,
                        marginBottom: modalParents.includes(m.id) ? 5 : 0,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{m.icon}</span>
                      {m.label}
                      <span style={{ fontSize: 9, opacity: 0.5 }}>{modalParents.includes(m.id) ? "▲" : "▼"}</span>
                    </button>

                    {modalParents.includes(m.id) && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingLeft: 10, borderLeft: `2px solid ${m.color}33` }}>
                        {m.subs.map(s => (
                          <button
                            key={s.id}
                            onClick={() => toggle(modalSubs, setModalSubs, s.id)}
                            style={{
                              padding: "3px 9px", fontSize: 11, borderRadius: 100, cursor: "pointer",
                              fontWeight: modalSubs.includes(s.id) ? 500 : 400,
                              border:     modalSubs.includes(s.id) ? `1.5px solid ${m.color}` : `0.5px solid ${C.border}`,
                              background: modalSubs.includes(s.id) ? m.bg : C.card2,
                              color:      modalSubs.includes(s.id) ? m.color : C.muted,
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Distancia — slider logarítmico */}
            <FilterSection title="Distancia" count={distActive ? 1 : 0}>
              <DistanceSlider
                minKm={distMin} maxKm={distMax}
                onMin={setDistMin} onMax={setDistMax}
              />
            </FilterSection>

            {/* Fechas */}
            <FilterSection title="Fechas 2026">
              {["Desde", "Hasta"].map((lbl, li) => (
                <div key={lbl} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: C.muted, margin: "0 0 5px" }}>{lbl}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {MESES.map((mes, i) => {
                      const sel   = li === 0 ? mesDesde === i : mesHasta === i;
                      const faded = li === 0
                        ? mesDesde !== null && i < mesDesde
                        : mesHasta !== null && i > mesHasta;
                      return (
                        <button
                          key={i}
                          onClick={() =>
                            li === 0
                              ? setMesDesde(mesDesde === i ? null : i)
                              : setMesHasta(mesHasta === i ? null : i)
                          }
                          style={{
                            padding: "4px 7px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                            border:     sel ? `1.5px solid ${C.accent}` : `0.5px solid ${C.border}`,
                            background: sel ? C.accentBg : C.card2,
                            color:      sel ? C.accentMid : C.muted,
                            opacity: faded ? 0.28 : 1,
                          }}
                        >
                          {mes}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </FilterSection>

            {/* Spacer + Botón */}
            <div style={{ marginTop: "auto", paddingTop: 8 }}>
              <button
                onClick={handleSearch}
                disabled={!anyFilter || loading}
                style={{
                  width: "100%", padding: "10px 0", borderRadius: 10,
                  background: anyFilter ? C.accent : C.hint,
                  color:      anyFilter ? "#fff"    : C.muted,
                  border: "none", fontSize: 13, fontWeight: 500,
                  cursor:  anyFilter && !loading ? "pointer" : "default",
                  opacity: loading ? 0.65 : 1,
                  transition: "background .15s, opacity .15s",
                }}
              >
                {loading ? "Buscando…" : "Buscar pruebas"}
              </button>
            </div>
          </div>

          {/* ── Main ── */}
          <div id="main" style={{ flex: 1, overflowY: "auto", padding: "1.25rem", background: C.bg }}>

            {/* Empty state */}
            {!results && !loading && !error && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 320, color: C.muted, textAlign: "center", gap: 14 }}>
                <span style={{ fontSize: 56 }}>🏅</span>
                <p style={{ fontSize: 18, fontWeight: 600, color: C.text, letterSpacing: "-0.3px" }}>Encuentra tu próxima prueba</p>
                <p style={{ fontSize: 13, maxWidth: 300, lineHeight: 1.7 }}>
                  Usa los filtros del panel izquierdo para buscar entre todas las pruebas deportivas de España 2026.
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 320, gap: 14, color: C.muted }}>
                <div style={{ width: 36, height: 36, border: `2.5px solid ${C.hint}`, borderTop: `2.5px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
                <p style={{ fontSize: 13 }}>Buscando pruebas…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <p style={{ fontSize: 13, color: "#FCA5A5", textAlign: "center", padding: "3rem 0" }}>{error}</p>
            )}

            {/* Results */}
            {results && !loading && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                    {results.length} prueba{results.length !== 1 ? "s" : ""} encontrada{results.length !== 1 ? "s" : ""}
                  </p>
                  <p style={{ fontSize: 11, color: C.muted }}>Pulsa para ver más info</p>
                </div>

                {results.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem 0" }}>
                    <p style={{ fontSize: 14, color: C.muted }}>Sin resultados con estos filtros.</p>
                    <p style={{ fontSize: 12, color: C.hint, marginTop: 6 }}>Prueba a ampliar el rango de fechas o cambiar la modalidad.</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 8 }}>
                    {results.map((r, i) => <RaceCard key={i} race={r} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
