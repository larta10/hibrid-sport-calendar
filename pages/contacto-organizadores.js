import { useState } from "react";
import Head from "next/head";

const INITIAL_FORM = { nombre: "", email: "", tipo: "", mensaje: "" };

export default function ContactOrganizers() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [status, setStatus]   = useState("idle");
  const [errors, setErrors]   = useState({});
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = true;
    if (!form.email.trim() || !form.email.includes("@")) errs.email = true;
    if (!form.mensaje.trim()) errs.mensaje = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:  form.nombre,
          email:   form.email,
          tipo:    form.tipo,
          mensaje: form.mensaje,
        }),
      });
      if (res.ok) {
        setForm(INITIAL_FORM);
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Error al enviar. Escríbenos directamente a hola@hybridracehub.com");
        setStatus("idle");
      }
    } catch {
      setSubmitError("Error al enviar. Escríbenos directamente a hola@hybridracehub.com");
      setStatus("idle");
    }
  }

  return (
    <>
      <Head>
        <title>Contacto Organizadores de Carreras OCR y HYROX | Hybrid Race Hub</title>
        <meta name="description" content="Promociona tu evento OCR, HYROX o CrossFit en Hybrid Race Hub, el calendario de referencia en España. Contacta con nosotros para estudiar tu colaboración." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/contacto-organizadores" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/contacto-organizadores" />
        <meta property="og:title" content="Contacto Organizadores — Hybrid Race Hub" />
        <meta property="og:description" content="Promociona tu evento OCR, HYROX o CrossFit en Hybrid Race Hub, el calendario de referencia en España." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contacto Organizadores — Hybrid Race Hub" />
        <meta name="twitter:description" content="Promociona tu evento OCR, HYROX o CrossFit en Hybrid Race Hub, el calendario de referencia en España." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root {
          --bg: #08090C;
          --bg2: #0F1015;
          --surface: #13151C;
          --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7;
          --muted: #8C8E9A;
          --accent: #FB923C;
          --radius-sm: 8px;
          --radius: 12px;
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          line-height: 1.6;
          min-height: 100vh;
        }
        a { color: var(--accent); text-decoration: none; }
        a:hover { text-decoration: underline; }

        .contact-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 1rem;
        }
        .back-link:hover { color: var(--accent); text-decoration: none; }

        .contact-hero { text-align: center; padding: 4rem 0 3rem; }
        .contact-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        .contact-title {
          font-family: var(--font-display);
          font-size: clamp(42px, 8vw, 72px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin-bottom: 1rem;
        }
        .contact-sub {
          font-size: 16px;
          color: var(--muted);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .contact-sub strong { color: var(--text); font-weight: 600; }
        .contact-email { margin-top: 1.5rem; }
        .contact-email a {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--accent);
        }

        .form-section { max-width: 560px; margin: 0 auto; padding: 2rem 0 4rem; }
        .form-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-group { margin-bottom: 1rem; }
        .form-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .form-input, .form-textarea, .form-select {
          width: 100%;
          background: var(--bg2);
          color: var(--text);
          border: 1px solid var(--border2);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: var(--accent);
        }
        .form-input.error, .form-textarea.error { border-color: #F87171; }
        .form-textarea { min-height: 130px; resize: vertical; }
        .form-select { cursor: pointer; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .form-submit {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--accent);
          color: #08090C;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          margin-top: 1rem;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(251,146,60,0.35);
        }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(8,9,12,0.3);
          border-top-color: #08090C;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .alert-success {
          padding: 14px 18px;
          background: rgba(52,211,153,0.10);
          border: 1px solid rgba(52,211,153,0.30);
          border-radius: var(--radius-sm);
          color: #34D399;
          font-size: 14px;
          font-weight: 600;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .alert-error {
          padding: 12px 16px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: var(--radius-sm);
          color: #F87171;
          font-size: 13px;
          margin-top: 1rem;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .contact-page { padding: 1rem; }
          .contact-hero { padding: 2rem 0; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="contact-page">
        <a href="/" className="back-link">← Volver al calendario</a>

        <header className="contact-hero">
          <p className="contact-eyebrow">Colaboraciones</p>
          <h1 className="contact-title">Colabora con nosotros</h1>
          <p className="contact-sub">
            ¿Organizas eventos de <strong>OCR/HYROX</strong> o gestionas un <strong>centro de entrenamiento funcional</strong>? Contacta con nosotros para aparecer destacado en la plataforma y llegar a miles de atletas interesados.
          </p>
          <p className="contact-email">
            <a href="mailto:hola@hybridracehub.com">hola@hybridracehub.com</a>
          </p>
        </header>

        <section className="form-section" id="contact-form">
          <h2 className="form-title">Solicita información</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className={`form-input${errors.nombre ? " error" : ""}`}
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-input${errors.email ? " error" : ""}`}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Soy... *</label>
              <select
                className="form-select"
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                required
              >
                <option value="">Selecciona tu perfil</option>
                <option value="organizador">Organizador de eventos (OCR / HYROX / CrossFit)</option>
                <option value="entrenador">Entrenador personal</option>
                <option value="centro">Centro de entrenamiento funcional</option>
                <option value="otro">Otro / Consulta general</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje *</label>
              <textarea
                className={`form-textarea${errors.mensaje ? " error" : ""}`}
                value={form.mensaje}
                onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                placeholder="Cuéntanos sobre tu evento o propuesta..."
                required
              />
            </div>

            {status === "success" && (
              <div className="alert-success">
                <span>✓</span>
                Mensaje enviado. Te contestaremos en un plazo máximo de 48 horas.
              </div>
            )}

            {submitError && (
              <div className="alert-error">{submitError}</div>
            )}

            <button type="submit" className="form-submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <><span className="spinner" /> Enviando...</>
              ) : (
                "Enviar mensaje →"
              )}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
