import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { RANKINGS, AZ } from "../lib/rankings";


/* ─── COMPONENT ─────────────────────────────────────────────────────────────── */

export default function Productos() {
  return (
    <>
      <Head>
        <title>Rankings de Equipamiento OCR y HYROX 2026 | Hybrid Race Hub</title>
        <meta name="description" content="Rankings honestos de relojes GPS, zapatillas trail, pulsómetros y ropa deportiva para OCR e HYROX. Con precios y enlaces a Amazon España." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/productos" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/productos" />
        <meta property="og:title" content="Rankings de Equipamiento OCR y HYROX 2026 | Hybrid Race Hub" />
        <meta property="og:description" content="Rankings honestos de relojes GPS, zapatillas trail, pulsómetros y ropa deportiva para OCR e HYROX. Con precios y enlaces a Amazon España." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rankings de Equipamiento OCR y HYROX 2026 | Hybrid Race Hub" />
        <meta name="twitter:description" content="Rankings honestos de relojes GPS, zapatillas trail, pulsómetros y ropa deportiva para OCR e HYROX." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(
            RANKINGS.flatMap((ranking, ri) =>
              ranking.products.map((product, i) => {
                const ratingValue = ranking.table.rows[i]?.[ranking.table.rows[i].length - 1] ?? null;
                const price = product.price.match(/\d+/)?.[0] ?? "";
                return {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  "name": product.name,
                  "description": product.desc,
                  "brand": { "@type": "Brand", "name": product.brand || product.name.split(" ")[0] },
                  "url": `https://hybridracehub.com/productos/${ranking.slug}`,
                  "offers": {
                    "@type": "Offer",
                    "url": AZ(product.asin),
                    "priceCurrency": "EUR",
                    "price": price,
                    "availability": "https://schema.org/InStock",
                    "seller": { "@type": "Organization", "name": "Amazon" },
                  },
                  ...(ratingValue ? { "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": ratingValue,
                    "bestRating": "10",
                    "ratingCount": "1",
                  }} : {}),
                };
              })
            )
          )}}
        />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #08090C; --bg2: #0F1015; --surface: #13151C; --surface2: #1A1D26;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.16);
          --text: #F5F5F7; --muted: #8C8E9A; --muted2: #5D5F6B; --hint: #272932;
          --ocr: #FB923C; --ocr-bg: rgba(251,146,60,0.14);
          --hyrox: #FACC15; --hyrox-bg: rgba(250,204,21,0.12);
          --accent: #FB923C; --accent-bg: rgba(251,146,60,0.14); --accent-mid: #FDBA74;
          --green: #34D399; --green-bg: rgba(52,211,153,0.14);
          --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
          --font-body: "Inter", -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, monospace;
          --radius: 12px; --radius-sm: 8px; --radius-lg: 16px;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        a { color: inherit; text-decoration: none; }

        /* NAV */
        .topbar {
          background: var(--bg); border-bottom: 1px solid var(--border);
          height: 64px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 2rem;
        }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-logo-img { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; display: block; }
        .brand-name {
          font-family: var(--font-display); font-size: 17px; font-weight: 800;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text);
        }
        .brand-sub {
          font-family: var(--font-mono); font-size: 9px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted);
        }
        .topbar-nav { display: flex; gap: 4px; }
        .topbar-nav a {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          padding: 6px 12px; border-radius: var(--radius-sm);
          border: 0.5px solid transparent; transition: color .15s, border-color .15s;
        }
        .topbar-nav a:hover { color: var(--text); border-color: var(--border2); }
        .topbar-nav a.active { color: var(--accent-mid); border-color: rgba(251,146,60,0.3); }

        /* HERO */
        .page-hero { background: var(--bg); border-bottom: 1px solid var(--border); padding: 3rem 2rem 2.5rem; }
        .page-hero-inner { max-width: 1100px; margin: 0 auto; }
        .page-eyebrow {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-mid); margin-bottom: 10px;
        }
        .page-title {
          font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          line-height: 0.95; color: var(--text); margin-bottom: 14px;
        }
        .page-sub { font-family: var(--font-body); font-size: 15px; color: var(--muted); max-width: 580px; line-height: 1.65; }
        .affiliate-notice {
          margin-top: 1.25rem; font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted2);
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius-sm); padding: 8px 14px; display: inline-block;
        }

        /* NAV INTERNA RANKINGS */
        .rankings-nav {
          background: var(--surface); border-bottom: 1px solid var(--border);
          padding: 0 2rem; display: flex; gap: 0; overflow-x: auto;
        }
        .rankings-nav a {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          padding: 12px 16px; border-bottom: 2px solid transparent;
          white-space: nowrap; transition: color .15s, border-color .15s;
        }
        .rankings-nav a:hover { color: var(--text); border-bottom-color: var(--border2); }

        /* CONTENT */
        .page-body { max-width: 1100px; margin: 0 auto; padding: 0 2rem 4rem; }

        /* RANKING SECTION */
        .ranking-section { padding: 3rem 0; border-bottom: 1px solid var(--border); }
        .ranking-section:last-child { border-bottom: none; }
        .ranking-header { margin-bottom: 1.5rem; }
        .ranking-letter {
          display: inline-block; font-family: var(--font-display); font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.14em;
          background: var(--accent-bg); color: var(--accent);
          padding: 3px 10px; border-radius: 999px; margin-bottom: 8px;
        }
        .ranking-eyebrow {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted2); margin-bottom: 6px;
        }
        .ranking-title {
          font-family: var(--font-display); font-size: clamp(28px, 4vw, 44px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          color: var(--text); line-height: 1.05;
        }
        .ranking-intro { margin: 1.25rem 0; }
        .ranking-intro p {
          font-family: var(--font-body); font-size: 14px; color: var(--muted);
          line-height: 1.7; margin-bottom: 0.75rem;
        }

        /* COMPARISON TABLE */
        .comp-table-wrap { overflow-x: auto; margin: 1.5rem 0; border-radius: var(--radius); border: 0.5px solid var(--border); }
        .comp-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 11px; }
        .comp-table th {
          background: var(--surface2); color: var(--muted); font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 10px 14px; text-align: left; border-bottom: 0.5px solid var(--border);
          white-space: nowrap;
        }
        .comp-table td {
          padding: 9px 14px; border-bottom: 0.5px solid var(--border);
          color: var(--text); vertical-align: middle;
        }
        .comp-table tr:last-child td { border-bottom: none; }
        .comp-table tr:hover td { background: rgba(251,146,60,0.04); }
        .comp-table td:first-child { font-family: var(--font-display); font-weight: 700; font-size: 13px; }

        /* PRODUCT CARDS */
        .products-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;
          margin: 1.5rem 0;
        }
        .product-card {
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius-lg); display: flex; flex-direction: column;
          transition: border-color .15s, box-shadow .15s, transform .15s; overflow: hidden;
        }
        .product-card:hover {
          border-color: var(--border2); box-shadow: 0 8px 28px rgba(0,0,0,0.4); transform: translateY(-2px);
        }
        .product-card-head {
          background: var(--surface2); padding: 1.25rem 1.25rem 1rem;
          border-bottom: 0.5px solid var(--border); display: flex; align-items: center; gap: 12px;
        }
        .product-rank {
          font-family: var(--font-display); font-size: 32px; font-weight: 900;
          color: var(--accent); line-height: 1; flex-shrink: 0; width: 32px;
        }
        .product-name {
          font-family: var(--font-display); font-size: 18px; font-weight: 800;
          text-transform: uppercase; letter-spacing: -0.01em; color: var(--text); line-height: 1.15;
        }

        /* PRODUCT IMAGE */
        .product-img-wrap {
          background: rgba(255,255,255,0.05); min-height: 180px;
          display: flex; align-items: center; justify-content: center;
          padding: 16px; border-bottom: 0.5px solid var(--border);
        }
        .product-img {
          max-height: 220px; width: 100%; object-fit: contain; border-radius: 8px; display: block;
        }
        .product-img-placeholder {
          min-height: 148px; width: 100%;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface2); border-radius: 8px;
          font-family: var(--font-mono); font-size: 10px; color: var(--muted2);
          text-transform: uppercase; letter-spacing: 0.1em;
        }

        .product-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .product-desc { font-family: var(--font-body); font-size: 13px; color: var(--muted); line-height: 1.6; flex: 1; }
        .product-pc { display: flex; flex-direction: column; gap: 6px; }
        .product-pc-label {
          font-family: var(--font-mono); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted2);
        }
        .product-pc-list { display: flex; flex-direction: column; gap: 3px; }
        .product-pc-item {
          font-family: var(--font-body); font-size: 12px; color: var(--muted);
          display: flex; align-items: flex-start; gap: 6px; line-height: 1.4;
        }
        .product-pc-item::before { content: ""; flex-shrink: 0; margin-top: 5px; }
        .pros .product-pc-item::before { content: "✓"; color: var(--green); font-size: 10px; margin-top: 2px; }
        .cons .product-pc-item::before { content: "✗"; color: var(--muted2); font-size: 10px; margin-top: 2px; }
        .product-price {
          font-family: var(--font-mono); font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-mid);
        }
        .product-cta {
          display: block; background: var(--accent); color: #08090C;
          font-family: var(--font-display); font-size: 13px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em;
          text-align: center; padding: 11px 16px;
          border-top: 0.5px solid var(--border); transition: opacity .15s;
        }
        .product-cta:hover { opacity: 0.88; }

        /* CONCLUSION */
        .ranking-conclusion {
          background: var(--surface); border: 0.5px solid var(--border); border-radius: var(--radius);
          padding: 1.25rem 1.5rem; margin-top: 1.5rem;
        }
        .ranking-conclusion-label {
          font-family: var(--font-mono); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent-mid); margin-bottom: 8px;
        }
        .ranking-conclusion p { font-family: var(--font-body); font-size: 13px; color: var(--muted); line-height: 1.65; }

        /* LEGAL FOOTER */
        .legal-footer {
          border-top: 0.5px solid var(--border); padding: 2rem;
          max-width: 1100px; margin: 0 auto;
        }
        .legal-text {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted2); line-height: 1.6;
        }

        @media (max-width: 720px) {
          .topbar { padding: 0 1rem; }
          .page-hero { padding: 2rem 1rem 1.5rem; }
          .page-body { padding: 0 1rem 3rem; }
          .products-grid { grid-template-columns: 1fr; }
          .comp-table { font-size: 10px; }
          .comp-table td, .comp-table th { padding: 8px 10px; }
          .rankings-nav { padding: 0 1rem; }
        }
      `}</style>

      {/* Topbar */}
      <div className="topbar">
        <Link href="/" className="brand">
          <Image src="/logo-icon.svg" className="brand-logo-img" alt="Hybrid Race Hub" width={36} height={36} priority />
          <div>
            <div className="brand-name">Hybrid Race Hub</div>
            <div className="brand-sub">OCR · HYROX · Functional</div>
          </div>
        </Link>
        <nav className="topbar-nav">
          <Link href="/">Inicio</Link>
          <Link href="/calendario">Calendario</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/productos" className="active">Productos</Link>
        </nav>
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-eyebrow">Hybrid Race Hub · Equipamiento</p>
          <h1 className="page-title">Rankings<br/>de Equipamiento</h1>
          <p className="page-sub">
            Selección honesta de relojes GPS, zapatillas, pulsómetros y ropa deportiva
            para OCR y HYROX — solo lo que vale la pena, con precio en Amazon España.
          </p>
          <span className="affiliate-notice">
            Como afiliado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.
          </span>
        </div>
      </div>

      {/* Nav interna */}
      <nav className="rankings-nav">
        {RANKINGS.map(r => (
          <a key={r.id} href={`#${r.id}`}>{r.letter}. {r.title.split("—")[0].trim()}</a>
        ))}
      </nav>

      {/* Rankings */}
      <div className="page-body">
        {RANKINGS.map(ranking => (
          <section key={ranking.id} id={ranking.id} className="ranking-section">
            <div className="ranking-header">
              <div className="ranking-letter">Ranking {ranking.letter}</div>
              <div className="ranking-eyebrow">{ranking.eyebrow}</div>
              <h2 className="ranking-title">{ranking.title}</h2>
            </div>

            <div className="ranking-intro">
              {ranking.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* Tabla comparativa */}
            <div className="comp-table-wrap">
              <table className="comp-table">
                <thead>
                  <tr>{ranking.table.headers.map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ranking.table.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fichas */}
            <div className="products-grid">
              {ranking.products.map(product => (
                <div key={product.rank} className="product-card">
                  <div className="product-card-head">
                    <div className="product-rank">#{product.rank}</div>
                    <div className="product-name">{product.name}</div>
                  </div>

                  {product.img && (
                    <div className="product-img-wrap">
                      <Image
                        src={product.img}
                        alt={product.name}
                        width={220}
                        height={220}
                        className="product-img"
                      />
                    </div>
                  )}

                  <div className="product-body">
                    <p className="product-desc">{product.desc}</p>
                    <div className="product-pc pros">
                      <div className="product-pc-label">Pros</div>
                      <div className="product-pc-list">
                        {product.pros.map((p, i) => (
                          <div key={i} className="product-pc-item">{p}</div>
                        ))}
                      </div>
                    </div>
                    <div className="product-pc cons">
                      <div className="product-pc-label">Contras</div>
                      <div className="product-pc-list">
                        {product.cons.map((c, i) => (
                          <div key={i} className="product-pc-item">{c}</div>
                        ))}
                      </div>
                    </div>
                    <div className="product-price">{product.price}</div>
                  </div>
                  <a
                    href={AZ(product.asin)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="product-cta"
                  >
                    Ver en Amazon →
                  </a>
                </div>
              ))}
            </div>

            {/* Conclusión */}
            <div className="ranking-conclusion">
              <div className="ranking-conclusion-label">Recomendación según perfil</div>
              <p>{ranking.conclusion}</p>
            </div>

            {/* Enlazado interno */}
            <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/calendario" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", border: "0.5px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "5px 12px" }}>
                📅 ¿Listo para competir? Ver calendario →
              </Link>
              <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "5px 12px" }}>
                📖 Leer artículos del blog →
              </Link>
            </div>
          </section>
        ))}

        <div className="legal-footer">
          <p className="legal-text">
            Como afiliado de Amazon, Hybrid Race Hub obtiene ingresos por las compras adscritas que cumplen los
            requisitos aplicables. Los precios indicados son orientativos y pueden variar. Los enlaces llevan a
            Amazon.es donde podrás ver el precio actualizado, disponibilidad y opiniones de otros compradores.
            Los ASINs pueden cambiar — si un enlace no funciona, busca el producto directamente en Amazon.es.
          </p>
        </div>
      </div>
    </>
  );
}
