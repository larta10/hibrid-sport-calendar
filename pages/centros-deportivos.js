import Head from 'next/head';
export default function CentrosDeportivos() {
  return (
    <>
      <Head>
        <title>Centros Deportivos - Próximamente</title>
      </Head>
      <main style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Buscador de Centros - Próximamente</h1>
        <p style={{ color: 'var(--muted)' }}>Esta página estará disponible próximamente. Mientras tanto, utiliza la búsqueda central para encontrar centros cercanos en la página principal.</p>
      </main>
    </>
  );
}
