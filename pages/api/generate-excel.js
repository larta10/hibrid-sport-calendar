import ExcelJS from "exceljs";
import { generatePlan } from "../../lib/training-plans";

const EX_BASE = {
  principiante: [
    { label: "Sentadilla",   r: 0.50 },
    { label: "Peso Muerto",  r: 0.60 },
    { label: "Press Banca",  r: 0.40 },
    { label: "Press Hombro", r: 0.30 },
    { label: "Remo",         r: 0.35 },
    { label: "Zancada",      r: 0.30 },
    { label: "KB Swing",     r: 0.20 },
    { label: "Thruster",     r: 0.20 },
  ],
  intermedio: [
    { label: "Sentadilla",   r: 0.80 },
    { label: "Peso Muerto",  r: 1.00 },
    { label: "Press Banca",  r: 0.65 },
    { label: "Press Hombro", r: 0.50 },
    { label: "Remo",         r: 0.55 },
    { label: "Zancada",      r: 0.45 },
    { label: "KB Swing",     r: 0.30 },
    { label: "Thruster",     r: 0.30 },
  ],
  avanzado: [
    { label: "Sentadilla",   r: 1.10 },
    { label: "Peso Muerto",  r: 1.40 },
    { label: "Press Banca",  r: 0.85 },
    { label: "Press Hombro", r: 0.70 },
    { label: "Remo",         r: 0.75 },
    { label: "Zancada",      r: 0.60 },
    { label: "KB Swing",     r: 0.40 },
    { label: "Thruster",     r: 0.45 },
  ],
};

const OBJ_LABELS   = { ocr_sprint: "OCR Sprint", ocr_pro: "OCR Pro", ocr_ultra: "OCR Ultra", hyrox: "HYROX", crossfit: "CrossFit", general: "Funcional" };
const LEVEL_LABELS = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" };
const CYCLE_L      = ["Base", "+5%", "+10%", "DELOAD"];

function calcLoads(pesoKg, level, weekNum) {
  const pos   = (weekNum - 1) % 4;
  const cycle = Math.floor((weekNum - 1) / 4);
  const mult  = (1.0 + 0.05 * cycle) * [1.0, 1.05, 1.10, 0.80][pos];
  const bases = EX_BASE[level] || EX_BASE.intermedio;
  return {
    items:      bases.map(({ label, r }) => ({ label, kg: Math.round(pesoKg * r * mult / 2.5) * 2.5 })),
    isDeload:   pos === 3,
    cycleLabel: CYCLE_L[pos],
  };
}

function parseEx(str) {
  const sep = str.lastIndexOf(" — ");
  if (sep === -1) return { name: str.trim(), sets: "", reps: "" };
  const name = str.slice(0, sep).trim();
  const rest = str.slice(sep + 3).trim();
  const m = rest.match(/^(\d+)\s*[×x]\s*(.+)$/);
  if (!m) return { name, sets: "", reps: rest };
  return { name, sets: m[1], reps: m[2].replace(/ ?reps?$/i, "").trim() };
}

/* ── Excel style helpers ────────────────────────────────────────────────── */
const fill   = a => ({ type: "pattern", pattern: "solid", fgColor: { argb: a } });
const bdr    = () => { const s = { style: "thin", color: { argb: "FF2A2D36" } }; return { top: s, left: s, bottom: s, right: s }; };
const fnt    = (argb, size = 10, bold = false, italic = false) => ({ name: "Calibri", size, bold, italic, color: { argb } });
const centre = { vertical: "middle", horizontal: "center" };

const C = { dark: "FF08090C", surface: "FF1A1D26", row: "FF13151C", alt: "FF0F1015", orange: "FFFB923C", white: "FFF5F5F7", muted: "FF8C8E9A", brand: "FF5D5F6B" };

function sheetHeaderFooter(ws, brand) {
  ws.getCell("A1").value = brand;
  ws.getCell("A1").font  = fnt(C.brand, 8, false, true);
  ws.getCell("A1").fill  = fill(C.dark);
}

/* ── Main generator ─────────────────────────────────────────────────────── */
async function buildExcel(plan, answers) {
  const wb = new ExcelJS.Workbook();
  wb.creator  = "Hybrid Race Hub";
  wb.created  = new Date();
  const pesoKg = Number(answers.peso) || 70;

  /* ── Portada ─────────────────────────────────────────────────────── */
  const cover = wb.addWorksheet("Portada");
  cover.views = [{ showGridLines: false }];
  ["A","B","C","D"].forEach((c, i) => { cover.getColumn(c).width = [4, 30, 30, 4][i]; });

  for (let r = 1; r <= 38; r++) {
    for (let c = 1; c <= 5; c++) cover.getRow(r).getCell(c).fill = fill(C.dark);
    cover.getRow(r).height = 20;
  }

  // Brand watermark top
  cover.mergeCells("B1:C1");
  cover.getCell("B1").value = "hybridracehub.com";
  cover.getCell("B1").font  = fnt(C.brand, 8, false, true);
  cover.getCell("B1").fill  = fill(C.dark);

  // Logo title
  cover.getRow(4).height = 32;
  cover.mergeCells("B4:C4");
  const logo = cover.getCell("B4");
  logo.value = "HYBRID RACE HUB";
  logo.font  = fnt(C.orange, 22, true);
  logo.fill  = fill(C.dark);

  // Plan name
  cover.mergeCells("B6:C6");
  const ptitle = cover.getCell("B6");
  ptitle.value = plan.title || "Plan de Entrenamiento Personalizado";
  ptitle.font  = fnt(C.white, 14, true);
  ptitle.fill  = fill(C.dark);

  cover.mergeCells("B7:C7");
  const psub = cover.getCell("B7");
  psub.value = plan.subtitle || "";
  psub.font  = fnt(C.muted, 9, false, true);
  psub.fill  = fill(C.dark);

  const stats = [
    ["Objetivo",      OBJ_LABELS[answers.objective]   || answers.objective  || "—"],
    ["Nivel",         LEVEL_LABELS[answers.level]      || answers.level      || "—"],
    ["Semanas",       String(plan.weeks?.length || 0)],
    ["Días / semana", String(answers.daysPerWeek || 4)],
    ["Peso corporal", answers.peso ? `${answers.peso} kg` : "—"],
    ["Fecha",         new Date().toLocaleDateString("es-ES")],
  ];
  let ri = 9;
  for (const [label, val] of stats) {
    cover.getCell(`B${ri}`).value = label; cover.getCell(`B${ri}`).font = fnt(C.muted, 9);   cover.getCell(`B${ri}`).fill = fill(C.dark);
    cover.getCell(`C${ri}`).value = val;   cover.getCell(`C${ri}`).font = fnt(C.white, 9, true); cover.getCell(`C${ri}`).fill = fill(C.dark);
    ri++;
  }

  // Brand footer
  cover.mergeCells(`B${ri + 2}:C${ri + 2}`);
  const bfoot = cover.getCell(`B${ri + 2}`);
  bfoot.value = "hybridracehub.com  ·  Rellena Peso real y RPE tras cada sesión";
  bfoot.font  = fnt(C.brand, 8, false, true);
  bfoot.fill  = fill(C.dark);

  /* ── Columnas semanales ─────────────────────────────────────────── */
  const COLS = [
    { header: "Ejercicio",       width: 44 },
    { header: "Series",          width: 10 },
    { header: "Reps / Tiempo",   width: 17 },
    { header: "Peso obj. (kg)",  width: 16 },
    { header: "Peso real (kg)",  width: 16 },
    { header: "RPE (1-10)",      width: 13 },
    { header: "Notas",           width: 32 },
  ];

  for (const week of (plan.weeks || [])) {
    const { items: loads, isDeload, cycleLabel } = calcLoads(pesoKg, answers.level, week.number);
    const ws = wb.addWorksheet(`Semana ${week.number}`);
    ws.views = [{ showGridLines: false }];
    COLS.forEach((col, i) => { ws.getColumn(i + 1).width = col.width; });

    // Brand watermark row 1
    ws.mergeCells(1, 1, 1, COLS.length);
    ws.getCell(1, 1).value = "hybridracehub.com";
    ws.getCell(1, 1).font  = fnt(C.brand, 8, false, true);
    ws.getCell(1, 1).fill  = fill(C.dark);
    ws.getRow(1).height = 14;

    // Week title row 2
    ws.mergeCells(2, 1, 2, COLS.length);
    const wt = ws.getCell(2, 1);
    wt.value     = `SEMANA ${week.number}  ·  ${(week.phaseLabel || "").toUpperCase()}  ·  ${cycleLabel}${isDeload ? "  ← DELOAD" : ""}`;
    wt.font      = fnt(C.orange, 13, true);
    wt.fill      = fill(C.surface);
    wt.alignment = { vertical: "middle" };
    ws.getRow(2).height = 24;

    // Tip row 3
    ws.mergeCells(3, 1, 3, COLS.length);
    const tip = ws.getCell(3, 1);
    tip.value = week.tip || "";
    tip.font  = fnt(C.muted, 9, false, true);
    tip.fill  = fill(C.surface);
    ws.getRow(3).height = 16;

    // Column headers row 4
    const hRow = ws.getRow(4);
    hRow.height = 20;
    COLS.forEach((col, i) => {
      const cell = hRow.getCell(i + 1);
      cell.value     = col.header;
      cell.font      = fnt(C.orange, 10, true);
      cell.fill      = fill(C.surface);
      cell.border    = bdr();
      cell.alignment = centre;
    });

    let curRow = 5;

    for (const dayObj of (week.days || [])) {
      if (!dayObj.session) continue;

      // Day separator
      ws.mergeCells(curRow, 1, curRow, COLS.length);
      const ds = ws.getCell(curRow, 1);
      ds.value     = `${dayObj.day}  —  ${dayObj.session.title || ""}`;
      ds.font      = fnt(C.white, 10, true);
      ds.fill      = fill(C.alt);
      ds.border    = bdr();
      ds.alignment = { vertical: "middle" };
      ws.getRow(curRow).height = 18;
      curRow++;

      // Warmup (muted)
      for (const item of (dayObj.session.warmup || [])) {
        const { name, sets, reps } = parseEx(item);
        const row = ws.getRow(curRow);
        row.height = 16;
        [name, sets, reps, "", "", "", ""].forEach((v, i) => {
          const cell = row.getCell(i + 1);
          cell.value  = v;
          cell.font   = fnt(C.muted, 9, false, true);
          cell.fill   = fill(C.row);
          cell.border = bdr();
        });
        curRow++;
      }

      // Main exercises
      for (const item of (dayObj.session.main || [])) {
        const { name, sets, reps } = parseEx(item);
        const loadEntry = loads.find(l => name.toLowerCase().includes(l.label.toLowerCase().split(" ")[0]));
        const pesoObj   = loadEntry ? String(loadEntry.kg) : "";
        const row = ws.getRow(curRow);
        row.height = 20;
        [name, sets, reps, pesoObj, "", "", ""].forEach((v, i) => {
          const cell = row.getCell(i + 1);
          cell.fill   = fill(C.row);
          cell.border = bdr();
          cell.font   = i === 3 && v ? fnt(C.orange, 10, true) : fnt(C.white, 10);
          cell.value  = v;
        });
        curRow++;
      }

      // Peso corporal row
      const pcRow = ws.getRow(curRow);
      pcRow.height = 16;
      ["Peso corporal (kg)", "", "", "", "", "", ""].forEach((v, i) => {
        const cell = pcRow.getCell(i + 1);
        cell.value  = v;
        cell.font   = fnt(C.muted, 9, false, true);
        cell.fill   = fill(C.alt);
        cell.border = bdr();
      });
      curRow++;
    }

    // Brand footer at end of sheet
    ws.mergeCells(curRow + 1, 1, curRow + 1, COLS.length);
    const sf = ws.getCell(curRow + 1, 1);
    sf.value = "hybridracehub.com";
    sf.font  = fnt(C.brand, 8, false, true);
    sf.fill  = fill(C.dark);
  }

  /* ── Mi Progreso ─────────────────────────────────────────────────── */
  const prog = wb.addWorksheet("Mi Progreso");
  prog.views = [{ showGridLines: false }];
  const PCOLS = [
    { header: "Semana",             width: 12 },
    { header: "Fase",               width: 18 },
    { header: "Peso corp. (kg)",    width: 18 },
    { header: "RPE medio",          width: 14 },
    { header: "Ejercicio clave",    width: 30 },
    { header: "Peso movido (kg)",   width: 18 },
    { header: "Observaciones",      width: 35 },
  ];

  // Brand watermark
  prog.mergeCells(1, 1, 1, PCOLS.length);
  prog.getCell(1, 1).value = "hybridracehub.com";
  prog.getCell(1, 1).font  = fnt(C.brand, 8, false, true);
  prog.getCell(1, 1).fill  = fill(C.dark);
  prog.getRow(1).height = 14;

  // Title
  prog.mergeCells(2, 1, 2, PCOLS.length);
  const pt2 = prog.getCell(2, 1);
  pt2.value     = "MI PROGRESO — SEGUIMIENTO SEMANAL";
  pt2.font      = fnt(C.orange, 14, true);
  pt2.fill      = fill(C.surface);
  pt2.alignment = { vertical: "middle" };
  prog.getRow(2).height = 26;

  // Headers
  const phRow = prog.getRow(3);
  phRow.height = 20;
  PCOLS.forEach((col, i) => {
    prog.getColumn(i + 1).width = col.width;
    const cell = phRow.getCell(i + 1);
    cell.value     = col.header;
    cell.font      = fnt(C.orange, 10, true);
    cell.fill      = fill(C.surface);
    cell.border    = bdr();
    cell.alignment = centre;
  });

  for (const week of (plan.weeks || [])) {
    const row = prog.getRow(3 + week.number);
    row.height = 20;
    [String(week.number), week.phaseLabel || "", "", "", "", "", ""].forEach((v, i) => {
      const cell = row.getCell(i + 1);
      const bg   = week.number % 2 === 0 ? C.row : C.surface;
      cell.value  = v;
      cell.font   = fnt(i < 2 ? C.muted : C.white, 10);
      cell.fill   = fill(bg);
      cell.border = bdr();
    });
  }

  // Brand footer
  const lastRow = 3 + (plan.weeks?.length || 0) + 2;
  prog.mergeCells(lastRow, 1, lastRow, PCOLS.length);
  const pf = prog.getCell(lastRow, 1);
  pf.value = "hybridracehub.com";
  pf.font  = fnt(C.brand, 8, false, true);
  pf.fill  = fill(C.dark);

  return wb.xlsx.writeBuffer();
}

/* ── Handler ─────────────────────────────────────────────────────────────── */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers } = req.body;
  if (!answers?.objective || !answers?.level) {
    return res.status(400).json({ error: "Datos insuficientes" });
  }

  try {
    const plan = generatePlan({
      objective:   answers.objective,
      level:       answers.level,
      daysPerWeek: Number(answers.daysPerWeek) || 4,
      horizon:     { weeks: Number(answers.horizon?.weeks) || 8 },
      equipment:   answers.equipment,
      weaknesses:  answers.weaknesses || [],
    });

    const buffer = await buildExcel(plan, answers);

    const objLabel = (OBJ_LABELS[answers.objective] || "plan").toLowerCase().replace(/\s+/g, "-");
    const filename = `plan-${objLabel}-${answers.level || "personalizado"}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.byteLength);
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Excel generation error:", err);
    res.status(500).json({ error: "Error al generar el Excel" });
  }
}
