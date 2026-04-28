import Head from 'next/head';
export default function CalculadoraHyrox() {
  return (
    <>
      <Head>
        <title>calculadora Hyrox - Próximamente</title>
      </Head>
      <main style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Calculadora Hyrox - Próximamente</h1>
        <p style={{ color: 'var(--muted)' }}>Esta página estará disponible próximamente. Mientras tanto, usa la calculadora existente en la sección de herramientas.</p>
      </main>
    </>
  );
}
