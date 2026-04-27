import Head from "next/head";
import Link from "next/link";
import { SiteFooter, CookieBanner } from "../lib/shared";

// Simple hub page to host HYROX training programs anchor
export default function RaceHub() {
  return (
    <>
      <Head>
        <title>HYROX Programas — Hybrid Race Hub</title>
        <meta name="description" content="Descubre los Programas HYROX y planes de entrenamiento disponibles en Hybrid Race Hub." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://hybridracehub.com/race-hub" />
      </Head>

      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'inline-block' }} />
          <strong>Hybrid Race Hub</strong>
        </div>
        <nav style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <Link href="/calendario">Calendario</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/calculadora-hyrox">Calculadora</Link>
          <Link href="/centros-entrenamiento">Centros</Link>
        </nav>
      </header>

        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
        <section id="training-programs" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, textTransform: 'uppercase' }}>
            Programas HYROX
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            Entrenamiento estructurado para HYROX, desde fundamentos hasta planes de competición.
            Selecciona un programa y empieza a entrenar con guías y bloques de ejercicios diseñados para mejorar tu rendimiento.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem', marginTop: '1rem' }}>
            {[
              {title:'HYROX Foundations', text:'Base de entrenamiento para principiantes: técnica, resistencia y consistencia.'},
              {title:'Plan de 6 Semanas', text:'Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo.'},
              {title:'Guías de Preparación', text:'Estrategias de pacing, recuperación y nutrición para competición HYROX.'},
              {title:'HYROX Avanzado', text:'Entrenamiento para niveles avanzados con enfoque en velocidad y resistencia.'},
              {title:'HYROX Endurance', text:'Sesiones de resistencia larga y bloques de aerobic capacity.'},
            ].map((p, idx) => (
              <article key={idx} className="cat-card" style={{ padding: '1rem' }}>
                <a href={`#${p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} style={{ textDecoration:'none', color:'inherit' }}>
                  <div className="cat-name" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>{p.title}</div>
                </a>
                <p className="cat-note" style={{ marginTop: 6 }}>{p.text}</p>
                <a href={`#${p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} className="cta-btn" style={{ display:'inline-flex', marginTop:8 }}>Detalles</a>
              </article>
            ))}
          </div>
        </section>
        {/* Program details anchors (for accessibility and explicit sections) */}
        <section id="hyrox-foundations" style={{ padding:'2rem 0' }}>
          <h3 style={{ fontFamily:'var(--font-display)' }}>HYROX Foundations</h3>
          <p>Base de entrenamiento para principiantes: técnica, resistencia y consistencia. Incluye micro-bloques semanales y pruebas de progreso.</p>
        </section>
        <section id="hyrox-6-weeks" style={{ padding:'2rem 0' }}>
          <h3 style={{ fontFamily:'var(--font-display)' }}>Plan de 6 Semanas</h3>
          <p>Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo. Enfoque en mejorar tiempos y consistencia.</p>
        </section>
        <section id="hyrox-guides" style={{ padding:'2rem 0' }}>
          <h3 style={{ fontFamily:'var(--font-display)' }}>Guías de Preparación</h3>
          <p>Guías de pacing, recuperación y nutrición para competición HYROX. Incluye ejemplos de plan de entrenamiento y test de umbral.</p>
        </section>
        <section id="hyrox-advanced" style={{ padding:'2rem 0' }}>
          <h3 style={{ fontFamily:'var(--font-display)' }}>HYROX Avanzado</h3>
          <p>Entrenamiento para niveles avanzados con enfoque en velocidad y resistencia. Fases de carga y descarga para picos.</p>
        </section>
        <section id="hyrox-endurance" style={{ padding:'2rem 0' }}>
          <h3 style={{ fontFamily:'var(--font-display)' }}>HYROX Endurance</h3>
          <p>Sesiones de resistencia larga y bloques de capacidad aeróbica para sostener ritmo en distancias largas.</p>
        </section>
      </main>

      <SiteFooter />
      <CookieBanner />
    </>
  );
}
