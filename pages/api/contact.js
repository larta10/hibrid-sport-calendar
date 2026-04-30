import { Resend } from "resend";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TIPO_LABELS = {
  organizador: "Organizador de eventos",
  entrenador:  "Entrenador personal",
  centro:      "Centro de entrenamiento",
  otro:        "Otro / Consulta general",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nombre, email, tipo, prueba, mensaje } = req.body || {};

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY no configurada");
    return res.status(500).json({ error: "Error de configuración del servidor" });
  }

  const tipoLabel = TIPO_LABELS[tipo] || tipo || "General";
  const subject   = `Nueva colaboración - ${tipoLabel}${prueba?.trim() ? ` - ${prueba}` : ""} - Hybrid Race Hub`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F0F2;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0F2;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#13151C;padding:28px 36px 24px;border-radius:12px 12px 0 0;border-bottom:2px solid #FB923C;">
          <p style="margin:0 0 6px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FB923C;font-weight:700;font-family:monospace;">HYBRID RACE HUB</p>
          <h1 style="margin:0;font-size:24px;font-weight:800;color:#F5F5F7;line-height:1.2;">Nueva colaboración</h1>
          <p style="margin:6px 0 0;font-size:13px;color:#8C8E9A;">${esc(tipoLabel)}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#1A1D26;padding:28px 36px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
            <tr>
              <td style="padding:8px 16px 8px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;vertical-align:top;">Nombre</td>
              <td style="padding:8px 0;color:#F5F5F7;">${esc(nombre)}</td>
            </tr>
            <tr>
              <td style="padding:8px 16px 8px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;vertical-align:top;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${esc(email)}" style="color:#FB923C;text-decoration:none;">${esc(email)}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 16px 8px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;vertical-align:top;">Perfil</td>
              <td style="padding:8px 0;color:#F5F5F7;">${esc(tipoLabel)}</td>
            </tr>
            ${prueba?.trim() ? `<tr>
              <td style="padding:8px 16px 8px 0;color:#8C8E9A;white-space:nowrap;font-weight:600;vertical-align:top;">Evento / Org.</td>
              <td style="padding:8px 0;color:#F5F5F7;">${esc(prueba)}</td>
            </tr>` : ""}
          </table>

          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#FB923C;font-weight:600;font-family:monospace;">MENSAJE</p>
          <div style="background:#08090C;border-radius:8px;padding:16px 20px;font-size:14px;line-height:1.75;color:#8C8E9A;">
            ${esc(mensaje).replace(/\n/g, "<br>")}
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0F1015;padding:16px 36px;border-radius:0 0 12px 12px;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;color:#5D5F6B;">
            Te contestaremos en un plazo máximo de 48 horas.
          </p>
          <p style="margin:0;font-size:11px;color:#5D5F6B;">
            Responde a este email para contactar directamente con
            <a href="mailto:${esc(email)}" style="color:#FB923C;text-decoration:none;">${esc(email)}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from:     "hola@hybridracehub.com",
      to:       "pablolartategui@gmail.com",
      replyTo:  email,
      subject,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err?.message ?? err);
    return res.status(500).json({
      error: "Error al enviar. Escríbenos a hola@hybridracehub.com",
    });
  }
}
