import { useState } from "react";
import Head from "next/head";

const PRICING_PLANS = [
  {
    name: "Destacado básico",
    price: "49€",
    period: "/mes",
    description: " visibility esencial para tu evento",
    features: [
      "Badge 'Destacado' en el calendario",
      "Posición preferente en el grid",
      "Logo en la tarjeta del evento",
      "Enlace prioritario a inscripción",
      "Soporte por email"
    ]
  },
  {
    name: "Destacado premium",
    price: "99€",
    period: "/mes",
    description: "máxima visibilidad y exposición",
    features: [
      "Todo lo incluido en Básico",
      "Banner superior en homepage",
      "Destacado en newsletter",
      "Posición top en búsquedas",
      "Soporte prioritario 24/7",
      "Analíticas básicas del evento"
    ],
    popular: true
  }
];

export default function ContactOrganizers() {
  const [form, setForm] = useState({ name: "", email: "", empresa: "", plan: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.email.trim() || !form.email.includes("@")) errs.email = true;
    if (!form.message.trim()) errs.message = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "hybridracehub",
          template_id: "contact_organizers",
          user_id: "YOUR_PUBLIC_KEY",
          template_params: form
        })
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Head>
        <title>Contacto Organizadores — Hybrid Race Hub</title>
        <meta name="description" content="Promociona tu evento OCR, HYROX o CrossFit en Hybrid Race Hub. Planes de destacado básico y premium." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root {
          --bg: #08090C;
          --bg2: #0F1015;
          --surface: #13151C;
          --surface2: #1A1D26;
          --border: rgba(255,255,255,0.08);
          --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7;
          --muted: #8C8E9A;
          --muted2: #5D5F6B;
          --accent: #FB923C;
          --accent-bg: rgba(251,146,60,0.14);
          --accent-mid: #FDBA74;
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
          --radius-sm: 8px;
          --radius: 12px;
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

        .contact-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Hero */
        .contact-hero {
          text-align: center;
          padding: 4rem 0 3rem;
        }
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

        /* Pricing Grid */
        .pricing-section {
          padding: 2rem 0 4rem;
        }
        .pricing-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 2rem;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .pricing-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          border-color: var(--border2);
        }
        .pricing-card.popular {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent), 0 8px 32px rgba(251,146,60,0.15);
        }
        .pricing-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent);
          color: #08090C;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 4px 16px;
          border-radius: 999px;
        }
        .pricing-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 0.5rem;
        }
        .pricing-desc {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 1.5rem;
        }
        .pricing-amount {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text);
        }
        .pricing-period {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--muted);
        }
        .pricing-features {
          list-style: none;
          margin-bottom: 1.5rem;
        }
        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--muted);
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
        }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-features li::before {
          content: "✓";
          color: var(--accent);
          font-weight: 700;
        }
        .pricing-cta {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          background: var(--accent);
          color: #08090C;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .pricing-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(251,146,60,0.35);
        }

        /* Form */
        .form-section {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 0 4rem;
        }
        .form-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
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
        .form-input.error, .form-textarea.error {
          border-color: #F87171;
        }
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .form-select {
          cursor: pointer;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
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
        .form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .form-success {
          text-align: center;
          padding: 3rem 2rem;
          background: var(--surface);
          border-radius: var(--radius);
        }
        .form-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(52,211,153,0.14);
          color: #34D399;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .form-success-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .form-success-text {
          color: var(--muted);
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .contact-page { padding: 1rem; }
          .contact-hero { padding: 2rem 0; }
          .form-row { grid-template-columns: 1fr; }
          .pricing-grid { gap: 1rem; }
        }
      `}</style>

      <div className="contact-page">
        <header className="contact-hero">
          <p className="contact-eyebrow">Colaboraciones</p>
          <h1 className="contact-title">Contacto organizadores</h1>
          <p className="contact-sub">
            <strong>Hybrid Race Hub</strong> es el calendario de referencia para carreras híbridas, OCR y competiciones funcionales en España. 
            Promociona tu evento y llega a miles de atletas interesados.
          </p>
        </header>

        <section className="pricing-section">
          <h2 className="pricing-title">Planes de promoción</h2>
          <div className="pricing-grid">
            {PRICING_PLANS.map((plan, i) => (
              <div key={i} className={`pricing-card${plan.popular ? ' popular' : ''}`}>
                {plan.popular && <span className="pricing-badge">Popular</span>}
                <h3 className="pricing-name">{plan.name}</h3>
                <p className="pricing-desc">{plan.description}</p>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feat, j) => (
                    <li key={j}>{feat}</li>
                  ))}
                </ul>
                <button className="pricing-cta" onClick={() => document.getElementById("contact-form").scrollIntoView({ behavior: "smooth" })}>
                  Contratar
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="form-section" id="contact-form">
          <h2 className="form-title">Solicita información</h2>
          
          {status === "success" ? (
            <div className="form-success">
              <div className="form-success-icon">✓</div>
              <h3 className="form-success-title">Mensaje enviado</h3>
              <p className="form-success-text">Gracias por contactar con nosotros. Te responderemos en breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className={`form-input${errors.name ? ' error' : ''}`}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-input${errors.email ? ' error' : ''}`}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Empresa / Organización</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.empresa}
                    onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))}
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plan de interés</label>
                  <select
                    className="form-select"
                    value={form.plan}
                    onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                  >
                    <option value="">Selecciona un plan</option>
                    <option value="basico">Destacado básico (49€/mes)</option>
                    <option value="premium">Destacado premium (99€/mes)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Mensaje *</label>
                <textarea
                  className={`form-textarea${errors.message ? ' error' : ''}`}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Cuéntanos sobre tu evento..."
                  required
                />
              </div>
              
              <button type="submit" className="form-submit" disabled={status === "loading"}>
                {status === "loading" ? "Enviando..." : "Enviar mensaje →"}
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}