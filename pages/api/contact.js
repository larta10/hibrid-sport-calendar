import nodemailer from "nodemailer";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nombre, email, prueba, mensaje } = req.body || {};

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const subject = `[Organizador] ${nombre}${prueba ? ` · ${prueba}` : ""}`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#FB923C;margin-bottom:20px">Nuevo mensaje de organizador</h2>
      <table style="font-size:14px;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#8C8E9A;white-space:nowrap"><b>Nombre</b></td><td style="padding:6px 0">${esc(nombre)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#8C8E9A;white-space:nowrap"><b>Email</b></td><td style="padding:6px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${prueba ? `<tr><td style="padding:6px 12px 6px 0;color:#8C8E9A;white-space:nowrap"><b>Prueba</b></td><td style="padding:6px 0">${esc(prueba)}</td></tr>` : ""}
      </table>
      <div style="margin-top:16px;padding:16px;background:#13151C;border-radius:8px;font-size:14px;line-height:1.6">
        ${esc(mensaje).replace(/\n/g, "<br>")}
      </div>
      <p style="margin-top:16px;font-size:12px;color:#5D5F6B">
        Responde directamente a este email — tu respuesta llegará a ${esc(email)}
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Hybrid Race Hub" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `${nombre} <${email}>`,
      subject,
      text: `Nuevo mensaje de organizador\n\nNombre: ${nombre}\nEmail: ${email}${prueba ? `\nPrueba: ${prueba}` : ""}\n\nMensaje:\n${mensaje}`,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err.message);
    return res.status(500).json({ error: "No se pudo enviar el mensaje. Inténtalo de nuevo." });
  }
}
