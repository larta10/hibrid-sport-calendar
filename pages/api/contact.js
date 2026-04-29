import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TIPO_LABELS = {
  organizador: "Organizador de eventos (OCR/HYROX/CrossFit)",
  centro:      "Gestor de centro de entrenamiento funcional",
  otro:        "Otro / Consulta general",
};
const PLAN_LABELS = {
  basico:  "Visibilidad básica",
  premium: "Máxima visibilidad",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { nombre, email, empresa, tipo, plan, mensaje } = req.body || {};

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#F5F5F7;font-family:Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 20px;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
            <tr><td style="padding:24px 32px;background:#13151C;border-radius:10px 10px 0 0;border-bottom:2px solid #FB923C;">
              <p style="margin:0 0 6px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#FB923C;font-weight:700;">HYBRID RACE HUB</p>
              <h2 style="margin:0;font-size:22px;font-weight:800;color:#F5F5F7;">Nueva colaboración</h2>
            </td></tr>
            <tr><td style="padding:24px 32px;background:#1A1D26;">
              <table style="font-size:13px;border-collapse:collapse;width:100%;">
                <tr><td style="padding:5px 12px 5px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;">Nombre</td><td style="padding:5px 0;color:#F5F5F7;">${esc(nombre)}</td></tr>
                <tr><td style="padding:5px 12px 5px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;">Email</td><td style="padding:5px 0;"><a href="mailto:${esc(email)}" style="color:#FB923C;">${esc(email)}</a></td></tr>
                ${empresa ? `<tr><td style="padding:5px 12px 5px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;">Empresa</td><td style="padding:5px 0;color:#F5F5F7;">${esc(empresa)}</td></tr>` : ""}
                ${tipo ? `<tr><td style="padding:5px 12px 5px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;">Perfil</td><td style="padding:5px 0;color:#F5F5F7;">${esc(TIPO_LABELS[tipo] || tipo)}</td></tr>` : ""}
                ${plan ? `<tr><td style="padding:5px 12px 5px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;">Colaboración</td><td style="padding:5px 0;color:#F5F5F7;">${esc(PLAN_LABELS[plan] || plan)}</td></tr>` : ""}
              </table>
              <div style="margin-top:16px;padding:16px;background:#08090C;border-radius:8px;font-size:13px;line-height:1.7;color:#8C8E9A;">
                ${esc(mensaje).replace(/\n/g, "<br>")}
              </div>
            </td></tr>
            <tr><td style="padding:14px 32px;background:#0F1015;border-radius:0 0 10px 10px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#5D5F6B;">Responde a este email — tu respuesta llegará directamente a <a href="mailto:${esc(email)}" style="color:#FB923C;">${esc(email)}</a></p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from:    "hola@hybridracehub.com",
      to:      "pablolartategui@gmail.com",
      replyTo: email,
      subject: "Nueva colaboración - Hybrid Race Hub",
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err.message);
    return res.status(500).json({ error: "Error al enviar. Escríbenos directamente a hola@hybridracehub.com" });
  }
}
