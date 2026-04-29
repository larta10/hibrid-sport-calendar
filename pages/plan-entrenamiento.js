import { useState } from "react";
import Head from "next/head";
import { generatePlan, SESSION_TYPE_META, PHASE_META } from "../lib/training-plans";

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const OBJECTIVES = [
  { id: "ocr_sprint", label: "OCR Sprint",  sub: "Carrera con obstáculos corta (< 10 km)", accent: "#34D399" },
  { id: "ocr_pro",    label: "OCR Pro",     sub: "Distancia media (10–20 km)",              accent: "#60A5FA" },
  { id: "ocr_ultra",  label: "OCR Ultra",   sub: "Larga distancia (+ 20 km)",               accent: "#C084FC" },
  { id: "hyrox",      label: "HYROX",       sub: "Fitness Race — 8 km + 8 estaciones",      accent: "#FACC15" },
  { id: "crossfit",   label: "CrossFit",    sub: "Open / Competición en box",               accent: "#FB923C" },
  { id: "general",    label: "Funcional",   sub: "Fitness general y bienestar",             accent: "#F472B6" },
];

const LEVELS = [
  { id: "principiante", label: "Principiante", sub: "< 6 meses de entreno específico" },
  { id: "intermedio",   label: "Intermedio",   sub: "6 meses – 2 años entrenando" },
  { id: "avanzado",     label: "Avanzado",     sub: "+2 años y has competido" },
];

const HORIZONS = [
  { weeks: 4,  label: "4 semanas",      sub: "Evento inminente — plan de choque" },
  { weeks: 8,  label: "8 semanas",      sub: "Preparación estándar" },
  { weeks: 12, label: "12 semanas",     sub: "Preparación completa con base sólida" },
  { weeks: 16, label: "16 semanas",     sub: "Pretemporada — máximo rendimiento" },
  { weeks: 12, label: "Sin fecha fija", sub: "Mejora continua (equivale a 12 sem)", id: "open" },
];

const EQUIPMENT_OPTIONS = [
  { id: "box",     label: "Box / Gym completo",  sub: "Todo el equipamiento OCR/HYROX/CrossFit" },
  { id: "gym",     label: "Gimnasio estándar",   sub: "Pesas libres, barras, máquinas cardio" },
  { id: "home",    label: "En casa",             sub: "KB, bandas, barra de dominadas" },
  { id: "outdoor", label: "Al aire libre",       sub: "Parque, circuito exterior, sin máquinas" },
];

const WEAKNESS_OPTIONS = [
  { id: "strength",  label: "Fuerza" },
  { id: "endurance", label: "Resistencia" },
  { id: "speed",     label: "Velocidad" },
  { id: "obstacles", label: "Obstáculos" },
  { id: "mobility",  label: "Movilidad" },
  { id: "power",     label: "Potencia" },
];

const EX_BASE = {
  principiante: [
    { id: "squat",    label: "Sentadilla",   r: 0.50 },
    { id: "deadlift", label: "Peso Muerto",  r: 0.60 },
    { id: "bench",    label: "Press Banca",  r: 0.40 },
    { id: "press",    label: "Press Hombro", r: 0.30 },
    { id: "row",      label: "Remo",         r: 0.35 },
    { id: "lunge",    label: "Zancada",      r: 0.30 },
    { id: "kb",       label: "KB Swing",     r: 0.20 },
    { id: "thruster", label: "Thruster",     r: 0.20 },
  ],
  intermedio: [
    { id: "squat",    label: "Sentadilla",   r: 0.80 },
    { id: "deadlift", label: "Peso Muerto",  r: 1.00 },
    { id: "bench",    label: "Press Banca",  r: 0.65 },
    { id: "press",    label: "Press Hombro", r: 0.50 },
    { id: "row",      label: "Remo",         r: 0.55 },
    { id: "lunge",    label: "Zancada",      r: 0.45 },
    { id: "kb",       label: "KB Swing",     r: 0.30 },
    { id: "thruster", label: "Thruster",     r: 0.30 },
  ],
  avanzado: [
    { id: "squat",    label: "Sentadilla",   r: 1.10 },
    { id: "deadlift", label: "Peso Muerto",  r: 1.40 },
    { id: "bench",    label: "Press Banca",  r: 0.85 },
    { id: "press",    label: "Press Hombro", r: 0.70 },
    { id: "row",      label: "Remo",         r: 0.75 },
    { id: "lunge",    label: "Zancada",      r: 0.60 },
    { id: "kb",       label: "KB Swing",     r: 0.40 },
    { id: "thruster", label: "Thruster",     r: 0.45 },
  ],
};

const CYCLE_LABELS = ["Base", "+5%", "+10%", "DELOAD"];

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */

export default function PlanEntrenamiento() {
  const [step, setStep]               = useState(0);
  const [answers, setAnswers]         = useState({ edad: "", peso: "", altura: "", objective: null, level: null, daysPerWeek: 4, horizon: null, equipment: null, weaknesses: [] });
  const [plan, setPlan]               = useState(null);
  const [expandedWeeks, setExpWeeks]  = useState(new Set([1]));
  const [expandedDays,  setExpDays]   = useState(new Set());
  const [downloading,   setDownloading] = useState(null); // "excel" | "pdf" | null

  function pick(key, val) { setAnswers(p => ({ ...p, [key]: val })); }

  function toggleWeak(id) {
    setAnswers(p => ({
      ...p,
      weaknesses: p.weaknesses.includes(id) ? p.weaknesses.filter(w => w !== id) : [...p.weaknesses, id],
    }));
  }

  function next() {
    if (step < 5) { setStep(s => s + 1); window.scrollTo(0, 0); return; }
    const generated = generatePlan({
      objective: answers.objective,
      level: answers.level,
      daysPerWeek: answers.daysPerWeek,
      horizon: { weeks: answers.horizon.weeks },
      equipment: answers.equipment,
      weaknesses: answers.weaknesses,
    });
    setPlan(generated);
    setStep("result");
    window.scrollTo(0, 0);
  }

  function back() {
    if (step === "result") { setStep(5); return; }
    if (step > 0) { setStep(s => s - 1); window.scrollTo(0, 0); }
  }

  function reset() {
    setStep(0);
    setAnswers({ edad: "", peso: "", altura: "", objective: null, level: null, daysPerWeek: 4, horizon: null, equipment: null, weaknesses: [] });
    setPlan(null);
    setExpWeeks(new Set([1]));
    setExpDays(new Set());
    setDownloading(null);
    window.scrollTo(0, 0);
  }

  function canNext() {
    if (step === 0) {
      const e = Number(answers.edad), p = Number(answers.peso), h = Number(answers.altura);
      return e >= 14 && e <= 80 && p >= 30 && p <= 250 && h >= 130 && h <= 230;
    }
    if (step === 1) return !!answers.objective;
    if (step === 2) return !!answers.level;
    if (step === 3) return !!answers.horizon;
    if (step === 4) return !!answers.equipment;
    return true;
  }

  function toggleWeek(n) {
    setExpWeeks(p => { const s = new Set(p); s.has(n) ? s.delete(n) : s.add(n); return s; });
  }
  function toggleDay(k) {
    setExpDays(p => { const s = new Set(p); s.has(k) ? s.delete(k) : s.add(k); return s; });
  }

  async function downloadExcel() {
    setDownloading("excel");
    try {
      const res = await fetch("/api/generate-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Server error");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `plan-${answers.level || "entrenamiento"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel download error:", err);
    } finally {
      setDownloading(null);
    }
  }

  async function downloadPdf() {
    setDownloading("pdf");
    try {
      const { jsPDF }        = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const W = 210, H = 297, M = 15;
      const ORANGE = [251, 146, 60];
      const DARK   = [8, 9, 12];
      const SURF   = [26, 29, 38];
      const MUTED  = [140, 142, 154];
      const WHITE  = [245, 245, 247];

      const OBJ_MAP   = { ocr_sprint: "OCR Sprint", ocr_pro: "OCR Pro", ocr_ultra: "OCR Ultra", hyrox: "HYROX", crossfit: "CrossFit", general: "Funcional" };
      const LVL_MAP   = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" };
      const CYCLE_LBL = ["Base", "+5%", "+10%", "DELOAD"];

      function pageDecor() {
        // Header brand
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...ORANGE);
        doc.text("HYBRID RACE HUB", M, 10);
        doc.setDrawColor(...ORANGE);
        doc.setLineWidth(0.4);
        doc.line(M, 13, W - M, 13);
        // Footer
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MUTED);
        doc.text("hybridracehub.com", M, H - 7);
        doc.text("Plan de Entrenamiento Personalizado", W - M, H - 7, { align: "right" });
        doc.setDrawColor(0, 0, 0);
        doc.setTextColor(0, 0, 0);
      }

      // ── Cover ──────────────────────────────────────────────────────────
      pageDecor();
      doc.setFillColor(...DARK);
      doc.roundedRect(M, 18, W - 2 * M, 72, 3, 3, "F");

      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...ORANGE);
      doc.text("PLAN DE ENTRENAMIENTO", M + 7, 36);

      doc.setFontSize(18);
      doc.setTextColor(...WHITE);
      doc.text(plan?.title || "Personalizado", M + 7, 48, { maxWidth: W - 2 * M - 14 });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      const infoLine = [
        OBJ_MAP[answers.objective] || "",
        LVL_MAP[answers.level] || "",
        `${plan?.weeks?.length || 0} semanas`,
        `${answers.daysPerWeek} días/sem`,
        answers.peso ? `${answers.peso} kg` : null,
      ].filter(Boolean).join("  ·  ");
      doc.text(infoLine, M + 7, 62, { maxWidth: W - 2 * M - 14 });

      doc.setFontSize(9);
      doc.setTextColor(...ORANGE);
      doc.text("hybridracehub.com", M + 7, 78);

      // ── Weekly pages ───────────────────────────────────────────────────
      for (const week of (plan?.weeks || [])) {
        doc.addPage();
        pageDecor();

        const pos       = (week.number - 1) % 4;
        const cycle     = Math.floor((week.number - 1) / 4);
        const mult      = (1 + 0.05 * cycle) * [1.0, 1.05, 1.10, 0.80][pos];
        const isDeload  = pos === 3;
        const cycleLabel = CYCLE_LBL[pos];
        const pesoKg    = Number(answers.peso) || 70;
        const bases     = EX_BASE[answers.level] || EX_BASE.intermedio;
        const loads     = bases.map(({ label, r }) => ({ label, kg: Math.round(pesoKg * r * mult / 2.5) * 2.5 }));

        // Week header band
        doc.setFillColor(...DARK);
        doc.roundedRect(M, 16, W - 2 * M, 13, 2, 2, "F");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...ORANGE);
        doc.text(
          `SEMANA ${week.number}  ·  ${(week.phaseLabel || "").toUpperCase()}  ·  ${cycleLabel}${isDeload ? "  ← DELOAD" : ""}`,
          M + 4, 24.5
        );

        // Tip
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...MUTED);
        doc.text(week.tip || "", M, 34);

        // Build table rows
        const tableBody = [];
        for (const dayObj of (week.days || [])) {
          if (!dayObj.session) continue;
          tableBody.push([{
            content: `${dayObj.day}  —  ${dayObj.session.title || ""}`,
            colSpan: 7,
            styles: { fontStyle: "bold", fillColor: SURF, textColor: WHITE, fontSize: 8 },
          }]);
          for (const item of (dayObj.session.main || [])) {
            const sep = item.lastIndexOf(" — ");
            let name = item, sets = "", reps = "";
            if (sep !== -1) {
              name = item.slice(0, sep).trim();
              const rest = item.slice(sep + 3).trim();
              const m = rest.match(/^(\d+)\s*[×x]\s*(.+)$/);
              if (m) { sets = m[1]; reps = m[2].replace(/ ?reps?$/i, "").trim(); }
              else reps = rest;
            }
            const found  = loads.find(l => name.toLowerCase().includes(l.label.toLowerCase().split(" ")[0]));
            const pObj   = found ? String(found.kg) : "";
            tableBody.push([name, sets, reps, pObj, "", "", ""]);
          }
        }

        autoTable(doc, {
          startY: 37,
          head: [["Ejercicio", "Series", "Reps", "Peso obj.(kg)", "Peso real(kg)", "RPE", "Notas"]],
          body: tableBody,
          theme: "grid",
          headStyles: { fillColor: ORANGE, textColor: DARK, fontStyle: "bold", fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [248, 248, 250] },
          columnStyles: {
            0: { cellWidth: 58 },
            1: { cellWidth: 13, halign: "center" },
            2: { cellWidth: 20, halign: "center" },
            3: { cellWidth: 20, halign: "center" },
            4: { cellWidth: 20, halign: "center" },
            5: { cellWidth: 13, halign: "center" },
            6: { cellWidth: "auto" },
          },
          margin: { left: M, right: M },
          didDrawPage: pageDecor,
        });
      }

      // ── Mi Progreso ────────────────────────────────────────────────────
      doc.addPage();
      pageDecor();
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...ORANGE);
      doc.text("MI PROGRESO — SEGUIMIENTO SEMANAL", M, 22);

      const progBody = (plan?.weeks || []).map(w => [
        String(w.number), w.phaseLabel || "", "", "", "", "", "",
      ]);
      autoTable(doc, {
        startY: 27,
        head: [["Semana", "Fase", "Peso corp.(kg)", "RPE medio", "Ejercicio clave", "Peso movido(kg)", "Observaciones"]],
        body: progBody,
        theme: "grid",
        headStyles: { fillColor: ORANGE, textColor: DARK, fontStyle: "bold", fontSize: 8 },
        bodyStyles: { fontSize: 8.5 },
        alternateRowStyles: { fillColor: [248, 248, 250] },
        margin: { left: M, right: M },
        didDrawPage: pageDecor,
      });

      const objSlug = (OBJ_MAP[answers.objective] || "plan").toLowerCase().replace(/\s+/g, "-");
      doc.save(`plan-${objSlug}-${answers.level || "personalizado"}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setDownloading(null);
    }
  }

  function calcLoads(pesoKg, level, weekNum) {
    const posInCycle  = (weekNum - 1) % 4;
    const cycleNum    = Math.floor((weekNum - 1) / 4);
    const inCycleMult = [1.0, 1.05, 1.10, 0.80][posInCycle];
    const cycleBase   = 1.0 + 0.05 * cycleNum;
    const mult        = cycleBase * inCycleMult;
    const isDeload    = posInCycle === 3;
    const bases       = EX_BASE[level] || EX_BASE.intermedio;
    const items       = bases.map(({ id, label, r }) => ({
      id, label,
      kg: Math.round(pesoKg * r * mult / 2.5) * 2.5,
    }));
    return { items, isDeload, cycleLabel: CYCLE_LABELS[posInCycle] };
  }

  const selObj = OBJECTIVES.find(o => o.id === answers.objective);

  /* ── Shared head ──────────────────────────────────────────────────────── */
  const pageHead = (
    <Head>
      <title>Plan de Entrenamiento Personalizado OCR, HYROX, CrossFit | Hybrid Race Hub</title>
      <meta name="description" content="Genera tu plan de entrenamiento personalizado para OCR, HYROX o CrossFit. Adaptado a tu nivel, días disponibles y puntos débiles. Gratis." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://hybridracehub.com/plan-entrenamiento" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hybridracehub.com/plan-entrenamiento" />
      <meta property="og:title" content="Plan de Entrenamiento Personalizado | Hybrid Race Hub" />
      <meta property="og:description" content="Genera tu plan para OCR, HYROX o CrossFit según tu nivel y objetivos." />
      <meta property="og:site_name" content="Hybrid Race Hub" />
      <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    </Head>
  );

  const css = `
    :root {
      --bg:#08090C; --bg2:#0F1015; --surface:#13151C; --surface2:#1A1D26;
      --border:rgba(255,255,255,0.08); --border2:rgba(255,255,255,0.16);
      --text:#F5F5F7; --muted:#8C8E9A; --muted2:#5D5F6B;
      --accent:#FB923C; --accent-bg:rgba(251,146,60,0.14);
      --font-display:"Barlow Condensed","Arial Narrow",sans-serif;
      --font-body:"Inter",-apple-system,sans-serif;
      --font-mono:"JetBrains Mono",ui-monospace,monospace;
      --radius-sm:8px; --radius:12px;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.6;min-height:100vh;}
    a{color:var(--accent);text-decoration:none;}
    a:hover{text-decoration:underline;}

    .plan-page{max-width:860px;margin:0 auto;padding:2rem 1.5rem 4rem;}
    .back-link{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1.5rem;}
    .back-link:hover{color:var(--accent);text-decoration:none;}

    /* ── Wizard ── */
    .wizard-progress{display:flex;align-items:center;gap:6px;margin-bottom:2.5rem;}
    .wp-step{width:28px;height:4px;border-radius:2px;background:var(--border2);transition:background .25s;}
    .wp-step.done{background:var(--accent);}
    .wp-step.active{background:var(--accent);opacity:.6;}
    .wizard-label{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-left:auto;}

    .step-title{font-family:var(--font-display);font-size:clamp(28px,6vw,42px);font-weight:800;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:.5rem;}
    .step-sub{color:var(--muted);font-size:14px;margin-bottom:2rem;}

    .card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem;margin-bottom:2rem;}
    .card-grid.two-col{grid-template-columns:repeat(auto-fill,minmax(240px,1fr));}
    .sel-card{background:var(--surface);border:1.5px solid var(--border2);border-radius:var(--radius);padding:1.1rem 1.25rem;cursor:pointer;transition:border-color .18s,background .18s;}
    .sel-card:hover{border-color:rgba(251,146,60,.5);background:var(--surface2);}
    .sel-card.selected{border-color:var(--sel-accent,var(--accent));background:rgba(251,146,60,.07);}
    .sel-card-label{font-family:var(--font-display);font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;margin-bottom:2px;}
    .sel-card-sub{font-size:12px;color:var(--muted);line-height:1.4;}

    /* Days slider */
    .days-row{margin-bottom:2rem;}
    .days-label{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:.75rem;display:flex;justify-content:space-between;}
    .days-label span{font-size:14px;font-weight:600;color:var(--text);font-family:var(--font-display);letter-spacing:0;}
    .days-pips{display:flex;gap:.5rem;}
    .days-pip{flex:1;height:40px;border-radius:var(--radius-sm);background:var(--surface);border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:18px;font-weight:700;cursor:pointer;transition:all .18s;}
    .days-pip:hover{border-color:rgba(251,146,60,.5);}
    .days-pip.selected{background:rgba(251,146,60,.12);border-color:var(--accent);color:var(--accent);}

    /* Weakness chips */
    .chip-grid{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:.5rem;}
    .chip{padding:.45rem 1rem;border-radius:20px;background:var(--surface);border:1.5px solid var(--border2);font-size:13px;font-weight:500;cursor:pointer;transition:all .18s;}
    .chip:hover{border-color:rgba(251,146,60,.5);}
    .chip.selected{background:rgba(251,146,60,.13);border-color:var(--accent);color:var(--accent);}
    .chip-hint{font-size:12px;color:var(--muted2);margin-bottom:2rem;}

    /* Nav buttons */
    .wizard-nav{display:flex;gap:.75rem;justify-content:space-between;align-items:center;margin-top:2rem;}
    .btn-back{padding:11px 20px;background:transparent;color:var(--muted);border:1.5px solid var(--border2);border-radius:var(--radius-sm);font-family:var(--font-display);font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transition:all .18s;}
    .btn-back:hover{color:var(--text);border-color:var(--border2);}
    .btn-next{padding:12px 28px;background:var(--accent);color:#08090C;border:none;border-radius:var(--radius-sm);font-family:var(--font-display);font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:transform .15s,box-shadow .15s,opacity .15s;}
    .btn-next:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(251,146,60,.35);}
    .btn-next:disabled{opacity:.35;cursor:not-allowed;}

    /* ── Plan Result ── */
    .plan-header{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:2rem;margin-bottom:1.5rem;}
    .plan-eyebrow{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);margin-bottom:.5rem;}
    .plan-title{font-family:var(--font-display);font-size:clamp(28px,6vw,48px);font-weight:800;text-transform:uppercase;letter-spacing:-.01em;line-height:1.1;margin-bottom:.4rem;}
    .plan-subtitle{color:var(--muted);font-size:14px;margin-bottom:1.25rem;}
    .plan-stats{display:flex;flex-wrap:wrap;gap:.75rem;}
    .plan-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:.5rem 1rem;font-family:var(--font-mono);font-size:12px;color:var(--muted);}
    .plan-stat strong{color:var(--text);display:block;font-size:16px;font-family:var(--font-display);font-weight:700;}

    /* Phase timeline */
    .phase-bar{display:flex;gap:0;border-radius:var(--radius-sm);overflow:hidden;margin-bottom:1.5rem;height:36px;}
    .phase-seg{display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:.08em;font-weight:600;color:#000;padding:0 .5rem;}
    .phase-seg span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

    /* Weeks accordion */
    .weeks-list{display:flex;flex-direction:column;gap:.5rem;}
    .week-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);overflow:hidden;}
    .week-header{display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;cursor:pointer;transition:background .18s;}
    .week-header:hover{background:var(--surface2);}
    .week-num{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);min-width:52px;}
    .week-phase-badge{padding:.2rem .6rem;border-radius:4px;font-family:var(--font-mono);font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#000;}
    .week-tip{font-size:13px;color:var(--muted);flex:1;}
    .week-chevron{font-size:12px;color:var(--muted2);transition:transform .2s;flex-shrink:0;}
    .week-chevron.open{transform:rotate(90deg);}

    /* Days */
    .days-list{border-top:1px solid var(--border);padding:.75rem;}
    .day-card{border-radius:var(--radius-sm);overflow:hidden;margin-bottom:.4rem;}
    .day-card:last-child{margin-bottom:0;}
    .day-header{display:flex;align-items:center;gap:.75rem;padding:.65rem .9rem;background:var(--bg2);cursor:pointer;transition:background .18s;}
    .day-header:hover{background:var(--bg);}
    .day-name{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);min-width:72px;}
    .day-badge{padding:.15rem .5rem;border-radius:3px;font-family:var(--font-mono);font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
    .day-title{font-size:13px;font-weight:500;flex:1;}
    .day-chevron{font-size:10px;color:var(--muted2);transition:transform .2s;}
    .day-chevron.open{transform:rotate(90deg);}
    .day-body{background:var(--bg2);border-top:1px solid var(--border);padding:.75rem .9rem 1rem;}
    .day-section{margin-bottom:.75rem;}
    .day-section:last-child{margin-bottom:0;}
    .day-section-label{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted2);margin-bottom:.35rem;}
    .day-section ul{list-style:none;display:flex;flex-direction:column;gap:.2rem;}
    .day-section ul li{font-size:13px;color:var(--muted);line-height:1.5;padding-left:.9rem;position:relative;}
    .day-section ul li::before{content:"·";position:absolute;left:0;color:var(--accent);}
    .day-note{margin-top:.6rem;font-size:12px;color:var(--muted2);font-style:italic;border-left:2px solid var(--border2);padding-left:.6rem;}
    .day-rest{padding:.65rem .9rem;background:var(--bg2);color:var(--muted2);font-size:13px;font-style:italic;}

    /* CTAs */
    .plan-ctas{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:var(--radius-sm);font-family:var(--font-display);font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;transition:all .18s;}
    .cta-btn:hover{text-decoration:none;transform:translateY(-2px);}
    .cta-primary{background:var(--accent);color:#08090C;}
    .cta-primary:hover{box-shadow:0 6px 20px rgba(251,146,60,.35);}
    .cta-secondary{background:transparent;color:var(--text);border:1.5px solid var(--border2);}
    .cta-secondary:hover{border-color:var(--accent);color:var(--accent);}
    .cta-ghost{background:transparent;color:var(--muted);border:none;cursor:pointer;padding:12px 16px;font-family:var(--font-display);font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;}
    .cta-ghost:hover{color:var(--text);}

    /* ── Free badge ── */
    .free-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(251,146,60,.14);color:var(--accent);border:1px solid rgba(251,146,60,.3);border-radius:20px;padding:.35rem .9rem;font-family:var(--font-mono);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:1.25rem;}

    /* ── Profile step ── */
    .profile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;}
    .profile-field{display:flex;flex-direction:column;gap:.5rem;}
    .profile-label{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);}
    .profile-input{background:var(--surface);border:1.5px solid var(--border2);border-radius:var(--radius-sm);padding:.75rem 1rem;font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--text);outline:none;text-align:center;transition:border-color .18s;width:100%;}
    .profile-input:focus{border-color:var(--accent);}
    .profile-input::placeholder{color:var(--muted2);font-size:16px;font-weight:400;}

    /* ── Loads panel ── */
    .week-loads{background:rgba(251,146,60,.05);border-top:1px solid rgba(251,146,60,.18);padding:.75rem 1.25rem;}
    .loads-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;}
    .loads-title{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);}
    .loads-cycle-label{font-family:var(--font-mono);font-size:9px;font-weight:600;padding:.15rem .6rem;border-radius:4px;background:rgba(251,146,60,.15);color:var(--accent);}
    .loads-cycle-label.deload{background:rgba(250,204,21,.12);color:#FACC15;}
    .loads-grid{display:flex;flex-wrap:wrap;gap:.4rem;}
    .load-item{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:.3rem .7rem;display:flex;flex-direction:column;gap:1px;}
    .load-item-name{font-family:var(--font-mono);font-size:8px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);}
    .load-item-val{font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--accent);line-height:1;}

    /* ── Download buttons ── */
    .cta-dl-excel{background:rgba(52,211,153,.1);color:#34D399;border:1.5px solid rgba(52,211,153,.35);}
    .cta-dl-excel:hover:not(:disabled){background:rgba(52,211,153,.18);border-color:#34D399;transform:translateY(-2px);}
    .cta-dl-pdf{background:rgba(96,165,250,.1);color:#60A5FA;border:1.5px solid rgba(96,165,250,.35);}
    .cta-dl-pdf:hover:not(:disabled){background:rgba(96,165,250,.18);border-color:#60A5FA;transform:translateY(-2px);}
    .cta-btn:disabled{opacity:.45;cursor:not-allowed;}

    @media(max-width:600px){
      .plan-page{padding:1rem 1rem 3rem;}
      .card-grid{grid-template-columns:1fr 1fr;}
      .card-grid.two-col{grid-template-columns:1fr;}
      .plan-stats{gap:.5rem;}
      .plan-ctas{flex-direction:column;}
      .cta-btn{width:100%;justify-content:center;}
      .profile-grid{grid-template-columns:1fr;}
    }
  `;

  /* ── WIZARD ─────────────────────────────────────────────────────────── */
  if (step !== "result") {
    return (
      <>
        {pageHead}
        <style>{css}</style>
        <div className="plan-page">
          <a href="/" className="back-link">← Inicio</a>

          {/* Progress */}
          <div className="wizard-progress">
            {[0,1,2,3,4,5].map(n => (
              <div
                key={n}
                className={`wp-step ${n < step ? "done" : n === step ? "active" : ""}`}
              />
            ))}
            <span className="wizard-label">Paso {step + 1} de 6</span>
          </div>

          {/* ── Step 0: Perfil físico ── */}
          {step === 0 && (
            <>
              <div className="free-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6,1 7.5,4.2 11,4.6 8.5,7 9.2,10.5 6,8.8 2.8,10.5 3.5,7 1,4.6 4.5,4.2"/></svg>
                100% GRATUITO · SIN REGISTRO
              </div>
              <h1 className="step-title">Tu perfil físico</h1>
              <p className="step-sub">Tres datos para calcular las cargas de entrenamiento adaptadas a ti.</p>
              <div className="profile-grid">
                <div className="profile-field">
                  <label className="profile-label">Edad (años)</label>
                  <input
                    className="profile-input"
                    type="number"
                    inputMode="numeric"
                    min={14} max={80}
                    placeholder="--"
                    value={answers.edad}
                    onChange={e => pick("edad", e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Peso (kg)</label>
                  <input
                    className="profile-input"
                    type="number"
                    inputMode="decimal"
                    min={30} max={250}
                    placeholder="--"
                    value={answers.peso}
                    onChange={e => pick("peso", e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Altura (cm)</label>
                  <input
                    className="profile-input"
                    type="number"
                    inputMode="numeric"
                    min={130} max={230}
                    placeholder="---"
                    value={answers.altura}
                    onChange={e => pick("altura", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Step 1: Objetivo ── */}
          {step === 1 && (
            <>
              <h1 className="step-title">¿Cuál es tu objetivo?</h1>
              <p className="step-sub">El plan se construirá alrededor de esta disciplina.</p>
              <div className="card-grid">
                {OBJECTIVES.map(obj => (
                  <div
                    key={obj.id}
                    className={`sel-card${answers.objective === obj.id ? " selected" : ""}`}
                    style={{ "--sel-accent": obj.accent }}
                    onClick={() => pick("objective", obj.id)}
                  >
                    <div className="sel-card-label" style={{ color: answers.objective === obj.id ? obj.accent : undefined }}>
                      {obj.label}
                    </div>
                    <div className="sel-card-sub">{obj.sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Step 2: Nivel + Días ── */}
          {step === 2 && (
            <>
              <h1 className="step-title">Nivel y disponibilidad</h1>
              <p className="step-sub">Sé honesto — un plan bien ajustado es más efectivo que uno demasiado ambicioso.</p>
              <div className="card-grid two-col" style={{ marginBottom: "1.5rem" }}>
                {LEVELS.map(lv => (
                  <div
                    key={lv.id}
                    className={`sel-card${answers.level === lv.id ? " selected" : ""}`}
                    onClick={() => pick("level", lv.id)}
                  >
                    <div className="sel-card-label">{lv.label}</div>
                    <div className="sel-card-sub">{lv.sub}</div>
                  </div>
                ))}
              </div>

              <div className="days-row">
                <div className="days-label">
                  Días de entrenamiento por semana
                  <span>{answers.daysPerWeek} días</span>
                </div>
                <div className="days-pips">
                  {[3,4,5,6].map(d => (
                    <div
                      key={d}
                      className={`days-pip${answers.daysPerWeek === d ? " selected" : ""}`}
                      onClick={() => pick("daysPerWeek", d)}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Step 3: Horizonte ── */}
          {step === 3 && (
            <>
              <h1 className="step-title">¿Cuánto tiempo tienes?</h1>
              <p className="step-sub">El plan adaptará las fases de base, desarrollo e intensidad a tu ventana de tiempo.</p>
              <div className="card-grid two-col">
                {HORIZONS.map((h, i) => {
                  const isSelected = answers.horizon?.label === h.label;
                  return (
                    <div
                      key={i}
                      className={`sel-card${isSelected ? " selected" : ""}`}
                      onClick={() => pick("horizon", h)}
                    >
                      <div className="sel-card-label">{h.label}</div>
                      <div className="sel-card-sub">{h.sub}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Step 4: Equipamiento ── */}
          {step === 4 && (
            <>
              <h1 className="step-title">¿Qué tienes disponible?</h1>
              <p className="step-sub">Ajustaremos las sesiones a tu material. Siempre habrá alternativas.</p>
              <div className="card-grid two-col">
                {EQUIPMENT_OPTIONS.map(eq => (
                  <div
                    key={eq.id}
                    className={`sel-card${answers.equipment === eq.id ? " selected" : ""}`}
                    onClick={() => pick("equipment", eq.id)}
                  >
                    <div className="sel-card-label">{eq.label}</div>
                    <div className="sel-card-sub">{eq.sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Step 5: Puntos débiles ── */}
          {step === 5 && (
            <>
              <h1 className="step-title">¿Dónde quieres mejorar?</h1>
              <p className="step-sub">Opcional. Recibirás consejos específicos cada semana para trabajar estos aspectos.</p>
              <div className="chip-grid">
                {WEAKNESS_OPTIONS.map(w => (
                  <div
                    key={w.id}
                    className={`chip${answers.weaknesses.includes(w.id) ? " selected" : ""}`}
                    onClick={() => toggleWeak(w.id)}
                  >
                    {w.label}
                  </div>
                ))}
              </div>
              <p className="chip-hint">Selecciona los que quieras (o ninguno) y genera el plan.</p>
            </>
          )}

          {/* Navigation */}
          <div className="wizard-nav">
            <button className="btn-back" onClick={back} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
              ← Atrás
            </button>
            <button className="btn-next" onClick={next} disabled={!canNext()}>
              {step === 5 ? "Generar plan →" : "Continuar →"}
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── PLAN RESULT ─────────────────────────────────────────────────────── */

  // Build phase segments for the bar
  const phaseSegs = [];
  if (plan?.weeks?.length) {
    let cur = { phase: plan.weeks[0].phase, count: 0 };
    plan.weeks.forEach(w => {
      if (w.phase === cur.phase) { cur.count++; }
      else { phaseSegs.push({ ...cur }); cur = { phase: w.phase, count: 1 }; }
    });
    phaseSegs.push(cur);
  }

  const totalWeeks = plan?.weeks?.length || 0;

  return (
    <>
      {pageHead}
      <style>{css}</style>
      <div className="plan-page">
        <a href="/" className="back-link">← Inicio</a>

        {/* Plan header */}
        <div className="plan-header">
          <p className="plan-eyebrow">Tu plan personalizado</p>
          <h1 className="plan-title">{plan?.title}</h1>
          <p className="plan-subtitle">{plan?.subtitle}</p>
          <div className="plan-stats">
            <div className="plan-stat">
              <strong>{totalWeeks}</strong>semanas
            </div>
            <div className="plan-stat">
              <strong>{plan?.daysPerWeek}</strong>días / semana
            </div>
            <div className="plan-stat">
              <strong>{totalWeeks * plan?.daysPerWeek}</strong>sesiones totales
            </div>
            {selObj && (
              <div className="plan-stat">
                <strong style={{ color: selObj.accent }}>{selObj.label}</strong>objetivo
              </div>
            )}
          </div>
        </div>

        {/* Phase bar */}
        {phaseSegs.length > 0 && (
          <div className="phase-bar">
            {phaseSegs.map((seg, i) => {
              const meta = PHASE_META[seg.phase];
              const pct = (seg.count / totalWeeks) * 100;
              return (
                <div
                  key={i}
                  className="phase-seg"
                  style={{ width: `${pct}%`, background: meta.color }}
                  title={`${meta.label} — ${seg.count} sem.`}
                >
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Weeks accordion */}
        <div className="weeks-list">
          {plan?.weeks?.map(week => {
            const isOpen = expandedWeeks.has(week.number);
            const phaseMeta = PHASE_META[week.phase];
            const weekLoads = answers.peso ? calcLoads(Number(answers.peso), answers.level, week.number) : null;
            return (
              <div key={week.number} className="week-card">
                <div className="week-header" onClick={() => toggleWeek(week.number)}>
                  <span className="week-num">Sem. {week.number}</span>
                  <span
                    className="week-phase-badge"
                    style={{ background: phaseMeta.color }}
                  >
                    {week.phaseLabel}
                  </span>
                  <span className="week-tip">{week.tip}</span>
                  <span className={`week-chevron${isOpen ? " open" : ""}`}>▶</span>
                </div>

                {isOpen && (
                  <>
                  <div className="days-list">
                    {week.days.map((dayObj, di) => {
                      const dayKey = `${week.number}-${di}`;
                      const isDayOpen = expandedDays.has(dayKey);
                      const typeMeta = SESSION_TYPE_META[dayObj.type] || SESSION_TYPE_META.rest;
                      const isRest = dayObj.type === "rest";

                      if (isRest) {
                        return (
                          <div key={di} className="day-card">
                            <div className="day-rest">
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted2)", marginRight: ".75rem" }}>
                                {dayObj.day}
                              </span>
                              Descanso — recuperación total
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={di} className="day-card">
                          <div className="day-header" onClick={() => toggleDay(dayKey)}>
                            <span className="day-name">{dayObj.day}</span>
                            <span
                              className="day-badge"
                              style={{ background: typeMeta.bg, color: typeMeta.color }}
                            >
                              {typeMeta.label}
                            </span>
                            <span className="day-title">{dayObj.session?.title}</span>
                            <span className={`day-chevron${isDayOpen ? " open" : ""}`}>▶</span>
                          </div>

                          {isDayOpen && dayObj.session && (
                            <div className="day-body">
                              {dayObj.session.focus && (
                                <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: ".75rem", fontStyle: "italic" }}>
                                  {dayObj.session.focus}
                                </p>
                              )}
                              {dayObj.session.warmup?.length > 0 && (
                                <div className="day-section">
                                  <div className="day-section-label">Calentamiento</div>
                                  <ul>{dayObj.session.warmup.map((item, k) => <li key={k}>{item}</li>)}</ul>
                                </div>
                              )}
                              {dayObj.session.main?.length > 0 && (
                                <div className="day-section">
                                  <div className="day-section-label">Sesión principal</div>
                                  <ul>{dayObj.session.main.map((item, k) => <li key={k}>{item}</li>)}</ul>
                                </div>
                              )}
                              {dayObj.session.cooldown?.length > 0 && (
                                <div className="day-section">
                                  <div className="day-section-label">Vuelta a la calma</div>
                                  <ul>{dayObj.session.cooldown.map((item, k) => <li key={k}>{item}</li>)}</ul>
                                </div>
                              )}
                              {dayObj.session.note && (
                                <p className="day-note">{dayObj.session.note}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {weekLoads && (
                    <div className="week-loads">
                      <div className="loads-header">
                        <span className="loads-title">Cargas orientativas</span>
                        <span className={`loads-cycle-label${weekLoads.isDeload ? " deload" : ""}`}>
                          {weekLoads.cycleLabel}
                        </span>
                      </div>
                      <div className="loads-grid">
                        {weekLoads.items.map(({ id, label, kg }) => (
                          <div key={id} className="load-item">
                            <span className="load-item-name">{label}</span>
                            <span className="load-item-val">{kg}kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="plan-ctas">
          <button
            className="cta-btn cta-dl-excel"
            onClick={downloadExcel}
            disabled={!!downloading}
          >
            {downloading === "excel" ? "Generando..." : "↓ Descargar Excel"}
          </button>
          <button
            className="cta-btn cta-dl-pdf"
            onClick={downloadPdf}
            disabled={!!downloading}
          >
            {downloading === "pdf" ? "Generando..." : "↓ Descargar PDF"}
          </button>
          <a href="/calendario" className="cta-btn cta-secondary">Ver carreras próximas →</a>
          <a href="/centros-entrenamiento" className="cta-btn cta-secondary">Encuentra tu centro →</a>
          <button className="cta-ghost" onClick={reset}>Crear nuevo plan</button>
        </div>
      </div>
    </>
  );
}
