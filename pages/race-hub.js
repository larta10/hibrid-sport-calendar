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
            <article className="cat-card" style={{ padding: '1rem' }}>
              <div className="cat-name" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>HYROX Foundations</div>
              <p className="cat-note" style={{ marginTop: 6 }}>Base de entrenamiento para principiantes: técnica, resistencia y consistencia.</p>
            </article>
            <article className="cat-card" style={{ padding: '1rem' }}>
              <div className="cat-name" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>Plan de 6 Semanas</div>
              <p className="cat-note" style={{ marginTop: 6 }}>Progresión semanal con bloques de fuerza, técnica y pruebas a mitad de ciclo.</p>
            </article>
            <article className="cat-card" style={{ padding: '1rem' }}>
              <div className="cat-name" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>Guías de Preparación</div>
              <p className="cat-note" style={{ marginTop: 6 }}>Estrategias de pacing, recuperación y nutrición para competición HYROX.</p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
      <CookieBanner />
    </>
  );
}
