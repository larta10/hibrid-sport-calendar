import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  SUPABASE_URL, ANON_KEY, TODAY_ISO, TODAY_YEAR, NICHE_PARENTS,
  MODALITIES, CCAA, MONTH_NAMES, formatDate,
  toggle, OcrIcon, FuncIcon, EnvelopeIcon, InstagramIcon,
  FilterSection, ActiveFiltersRow, DateRangePicker,
  RaceCard, RaceModal, SiteFooter, CookieBanner, SiteNav,
} from "../lib/shared";

export default function Calendario() {
  const router = useRouter();

  const [ccaa, setCcaa]                 = useState([]);
  const [modalParents, setModalParents] = useState([]);
  const [modalSubs, setModalSubs]       = useState([]);
  const [dateRange, setDateRange]       = useState({ from:null, to:null });
  const [textQuery, setTextQuery]       = useState("");
  const [results, setResults]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState(null);
  const [totalCount, setTotalCount]     = useState(null);
  const [sortBy, setSortBy]             = useState("date");
  const [selectedRace, setSelectedRace] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [routerReady, setRouterReady]   = useState(false);
  const [availableCcaa, setAvailableCcaa] = useState(CCAA);

  /* Fetch distinct CCAAa that have at least 1 event */
  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/races?select=comunidad&modalidad_parent=in.(${NICHE_PARENTS.join(",")})&limit=500`,{
      headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}` },
    })
      .then(r=>r.json())
      .then(data=>{
        if(!Array.isArray(data)) return;
        const seen=new Set(data.map(r=>r.comunidad).filter(Boolean));
        setAvailableCcaa(CCAA.filter(c=>seen.has(c)));
      })
      .catch(()=>{});
  },[]);

  /* Read ?q param from URL on mount */
  useEffect(()=>{
    if(!router.isReady) return;
    if(router.query.q) setTextQuery(decodeURIComponent(router.query.q));
    setRouterReady(true);
  },[router.isReady, router.query.q]);

  function toggleParent(id) {
    if(modalParents.includes(id)){
      setModalParents(p=>p.filter(x=>x!==id));
      const subs=MODALITIES.find(m=>m.id===id)?.subs.map(s=>s.id)||[];
      setModalSubs(s=>s.filter(x=>!subs.includes(x)));
    } else {
      setModalParents(p=>[...p,id]);
    }
  }

  const fetchRaces = useCallback(async ()=>{
    if(results!==null) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      p.append("select","*");
      p.append("order","fecha_iso.asc");

      if(modalSubs.length>0){
        if(modalSubs.length===1) p.append("modalidad_id",`eq.${modalSubs[0]}`);
        else p.append("modalidad_id",`in.(${modalSubs.join(",")})`);
      } else if(modalParents.length>0){
        if(modalParents.length===1) p.append("modalidad_parent",`eq.${modalParents[0]}`);
        else p.append("modalidad_parent",`in.(${modalParents.join(",")})`);
      } else {
        p.append("modalidad_parent",`in.(${NICHE_PARENTS.join(",")})`);
      }

      if(dateRange.from) p.append("fecha_iso",`gte.${dateRange.from}`);
      else p.append("fecha_iso",`gte.${TODAY_ISO}`);
      if(dateRange.to) p.append("fecha_iso",`lte.${dateRange.to}`);

      if(ccaa.length===1) p.append("comunidad",`eq.${ccaa[0]}`);
      else if(ccaa.length>1) p.append("comunidad",`in.(${ccaa.join(",")})`);

      if(textQuery.trim()){
        const t = textQuery.trim().replace(/[%_]/g,"");
        p.append("or",`(nombre.ilike.*${t}*,ubicacion.ilike.*${t}*,comunidad.ilike.*${t}*)`);
      }

      const res  = await fetch(`${SUPABASE_URL}/rest/v1/races?${p}`,{
        headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}` },
      });
      const data = await res.json();
      if(!Array.isArray(data)) throw new Error(data.message||"Error");

      setResults(data);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },[ccaa,modalParents,modalSubs,dateRange,textQuery]);

  useEffect(()=>{
    if(!routerReady) return;
    const t=setTimeout(fetchRaces,320);
    return ()=>clearTimeout(t);
  },[fetchRaces,routerReady]);

  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/races?select=count&modalidad_parent=in.(ocr,funcional)`,{
      headers:{ apikey:ANON_KEY, Authorization:`Bearer ${ANON_KEY}`, Prefer:"count=exact" },
    }).then(r=>{ const c=r.headers.get("content-range"); if(c) setTotalCount(c.split("/")[1]); }).catch(()=>{});
  },[]);

  function handleReset(){
    setCcaa([]); setModalParents([]); setModalSubs([]);
    setDateRange({from:null,to:null}); setTextQuery("");
    router.replace("/calendario",undefined,{shallow:true});
  }

  const anyFilter=ccaa.length||modalParents.length||modalSubs.length
    ||dateRange.from||dateRange.to||textQuery;

  const sorted=results?[...results].sort((a,b)=>{
    if(sortBy==="price"){
      const pa=parseFloat((a.precio||"").replace(/[^\d.]/g,""))||0;
      const pb=parseFloat((b.precio||"").replace(/[^\d.]/g,""))||0;
      return pa-pb;
    }
    return (a.fecha_iso||"").localeCompare(b.fecha_iso||"");
  }):[];

  const subtitle=[
    textQuery&&`"${textQuery}"`,
    (dateRange.from||dateRange.to)&&(
      dateRange.from&&dateRange.to
        ?`${formatDate(dateRange.from)}→${formatDate(dateRange.to)}`
        :dateRange.from?`Desde ${formatDate(dateRange.from)}`:`Hasta ${formatDate(dateRange.to)}`
    ),
    ...ccaa.slice(0,2),
    ccaa.length>2&&`+${ccaa.length-2} CCAA`,
    modalParents.length>0&&modalParents.map(p=>MODALITIES.find(m=>m.id===p)?.label||p).join(" + "),
  ].filter(Boolean).join(" · ");

  return (
    <>
      <Head>
        <title>Calendario OCR, HYROX y CrossFit España 2026 | Hybrid Race Hub</title>
        <meta name="description" content="Todos los eventos OCR, HYROX y competiciones funcionales en España 2026. Filtra por formato, comunidad autónoma y fecha. Actualizado a diario." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/calendario" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/calendario" />
        <meta property="og:title" content="Calendario OCR, HYROX y CrossFit España 2026 | Hybrid Race Hub" />
        <meta property="og:description" content="Todos los eventos OCR, HYROX y competiciones funcionales en España 2026. Filtra por formato, comunidad autónoma y fecha." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calendario OCR, HYROX y CrossFit España 2026 | Hybrid Race Hub" />
        <meta name="twitter:description" content="Todos los eventos OCR, HYROX y competiciones funcionales en España 2026." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href={SUPABASE_URL} />
      </Head>

      {/* ── HEADER ── */}
      <header className="hero" style={{paddingBottom:"1rem"}}>
        <div className="hero-inner">
          <div className="brand">
            <a href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:14}}>
              <Image src="/logo-icon.svg" className="brand-logo-img" alt="Hybrid Race Hub" width={40} height={40} priority />
              <div>
                <div className="brand-name">Hybrid Race Hub</div>
                <div className="brand-sub">
                  <span>OCR · HYROX · Functional</span>
                  {totalCount&&<span className="brand-count">{totalCount} eventos</span>}
                  {refreshing&&<span className="refreshing-dot"/>}
                </div>
              </div>
            </a>
          </div>
          <SiteNav activePath="/calendario"/>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="body">

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${sidebarOpen?" sidebar--open":""}`}>
          <div className="sidebar-head">
            <span className="sidebar-head-title">Filtros</span>
            {anyFilter
              ?<button className="sidebar-clear" onClick={handleReset}>Limpiar ×</button>
              :null}
          </div>
          <div className="sidebar-body">

            <FilterSection title="Tipo de prueba" active={modalParents.length>0||modalSubs.length>0}>
              <div className="chips-col">
                {MODALITIES.map(m=>(
                  <div key={m.id}>
                    <button onClick={()=>toggleParent(m.id)}
                      className={`chip${modalParents.includes(m.id)?" chip--on":""}`}
                      style={modalParents.includes(m.id)?{borderColor:m.color,background:m.bg,color:m.color}:{}}>
                      {m.id==="ocr"?<OcrIcon/>:<FuncIcon/>}
                      {m.label}
                      <span style={{fontSize:8,opacity:.5,marginLeft:2}}>{modalParents.includes(m.id)?"▲":"▼"}</span>
                    </button>
                    {modalParents.includes(m.id)&&(
                      <div className="sub-chips">
                        {m.subs.map(s=>(
                          <button key={s.id} onClick={()=>toggle(modalSubs,setModalSubs,s.id)}
                            className={`chip${modalSubs.includes(s.id)?" chip--on":""}`}
                            style={modalSubs.includes(s.id)?{borderColor:m.color,background:m.bg,color:m.color}:{}}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Comunidad autónoma" active={ccaa.length>0}>
              <div className="chips-wrap">
                {availableCcaa.map(c=>(
                  <button key={c} onClick={()=>toggle(ccaa,setCcaa,c)}
                    className={`chip${ccaa.includes(c)?" chip--on":""}`}
                    style={ccaa.includes(c)?{borderColor:"var(--accent)",background:"var(--accent-bg)",color:"var(--accent-mid)"}:{}}>
                    {c}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Fechas" active={!!(dateRange.from||dateRange.to)}>
              <DateRangePicker
                from={dateRange.from} to={dateRange.to}
                onChange={({from,to})=>setDateRange({from,to})}
              />
            </FilterSection>

            <FilterSection title="Eventos por ciudad" active={false}>
              <div className="chips-wrap">
                {[
                  ["bilbao","Bilbao"],["barcelona","Barcelona"],["madrid","Madrid"],
                  ["valencia","Valencia"],["malaga","Málaga"],["sevilla","Sevilla"],
                  ["zaragoza","Zaragoza"],["murcia","Murcia"],
                ].map(([slug, label]) => (
                  <a key={slug} href={`/calendario/${slug}`}
                    style={{ display:"inline-block", fontFamily:"var(--font-mono)", fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--muted)", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:999, padding:"4px 10px", textDecoration:"none", transition:"color .15s, border-color .15s" }}>
                    {label}
                  </a>
                ))}
              </div>
            </FilterSection>

          </div>

          {/* Apply button — mobile bottom sheet only */}
          <div className="sidebar-apply-wrap">
            <button className="sidebar-apply-btn" onClick={()=>setSidebarOpen(false)}>
              Aplicar filtros
            </button>
          </div>
        </aside>

        {/* Filter backdrop — mobile only */}
        {sidebarOpen&&<div className="filter-backdrop" onClick={()=>setSidebarOpen(false)}/>}

        {/* ── MAIN ── */}
        <main className="main">
          <div className="main-inner">

            {results!==null&&!loading&&!error&&(
              <div className="results-head">
                <div>
                  <div className="results-count">
                    <span>{sorted.length}</span> EVENTO{sorted.length!==1?"S":""}
                  </div>
                  {subtitle&&<div className="results-sub">{subtitle}</div>}
                </div>
                <div className="sort-btns">
                  <button className={`sort-btn${sortBy==="date"?" sort-btn--on":""}`} onClick={()=>setSortBy("date")}>Fecha ↑</button>
                  <button className={`sort-btn${sortBy==="price"?" sort-btn--on":""}`} onClick={()=>setSortBy("price")}>Precio</button>
                </div>
              </div>
            )}

            {anyFilter&&(
              <ActiveFiltersRow
                ccaa={ccaa} modalParents={modalParents} modalSubs={modalSubs}
                dateRange={dateRange} textQuery={textQuery}
                setCcaa={setCcaa} setModalParents={setModalParents}
                setModalSubs={setModalSubs}
                setDateRange={setDateRange} setTextQuery={setTextQuery}
              />
            )}

            {loading&&results===null&&(
              <div className="state-center">
                <div className="spinner"/>
                <p className="state-sub">Cargando eventos…</p>
              </div>
            )}

            {error&&!loading&&(
              <div className="state-center">
                <p className="state-sub" style={{color:"var(--red)"}}>{error}</p>
              </div>
            )}

            {results!==null&&!loading&&!error&&(
              sorted.length===0?(
                <div className="state-center">
                  <div className="state-icon">🏁</div>
                  <p className="state-title">Sin resultados</p>
                  <p className="state-sub">Prueba a ajustar los filtros o ampliar el rango de fechas.</p>
                </div>
              ):(
                <div className="race-grid">
                  {sorted.map((r,i)=>(
                    <RaceCard key={r.id||i} race={r} featured={r.featured===true} onClick={()=>setSelectedRace(r)}/>
                  ))}
                </div>
              )
            )}
          </div>
        </main>
      </div>

      <SiteFooter/>
      <CookieBanner/>

      <button className="mobile-filter-btn" onClick={()=>setSidebarOpen(o=>!o)}>
        {sidebarOpen?"Cerrar ×":`Filtros${anyFilter?` (${[ccaa.length,modalParents.length,modalSubs.length,(dateRange.from||dateRange.to)?1:0,textQuery?1:0].reduce((a,b)=>a+b,0)})`:"" }`}
      </button>

      {selectedRace&&<RaceModal race={selectedRace} onClose={()=>setSelectedRace(null)}/>}
    </>
  );
}
