import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { posts } from "../../lib/posts";

const CATEGORY_COLORS = {
  "Guías":        { color: "var(--hyrox)",   bg: "rgba(250,204,21,0.12)" },
  "Eventos":      { color: "var(--ocr)",     bg: "rgba(251,146,60,0.14)" },
  "Equipamiento": { color: "var(--green)",   bg: "var(--green-bg)"       },
};

const PAGE_SIZE = 6;

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted[0];
  const rest = sorted.slice(1);

  const [page, setPage] = useState(1);

  // Page 1: featured + first (PAGE_SIZE-1) from rest; page N: rest slice
  const restPage1 = rest.slice(0, PAGE_SIZE - 1);
  const restAfterPage1 = rest.slice(PAGE_SIZE - 1);
  const totalPages = 1 + Math.ceil(restAfterPage1.length / PAGE_SIZE);

  const currentRest = page === 1
    ? restPage1
    : restAfterPage1.slice((page - 2) * PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const showFeatured = page === 1;

  return (
    <>
      <Head>
        <title>Blog — Hybrid Race Hub | OCR, HYROX y Fitness Híbrido</title>
        <meta name="description" content="Guías de entrenamiento, análisis de equipamiento y noticias sobre OCR, HYROX y competiciones funcionales en España." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hybridracehub.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hybridracehub.com/blog" />
        <meta property="og:title" content="Blog — Hybrid Race Hub | OCR, HYROX y Fitness Híbrido" />
        <meta property="og:description" content="Guías de entrenamiento, análisis de equipamiento y noticias sobre OCR, HYROX y competiciones funcionales en España." />
        <meta property="og:site_name" content="Hybrid Race Hub" />
        <meta property="og:image" content="https://hybridracehub.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog — Hybrid Race Hub | OCR, HYROX y Fitness Híbrido" />
        <meta name="twitter:description" content="Guías de entrenamiento, análisis de equipamiento y noticias sobre OCR, HYROX y competiciones funcionales en España." />
        <meta name="twitter:image" content="https://hybridracehub.com/og-image.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Blog — Hybrid Race Hub",
            "description": "Artículos sobre OCR, HYROX y fitness funcional en España",
            "url": "https://hybridracehub.com/blog",
            "numberOfItems": posts.length,
            "itemListElement": [...posts].sort((a,b)=>b.date.localeCompare(a.date)).map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://hybridracehub.com/blog/${p.slug}`,
              "name": p.title,
            })),
          })}}
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

        /* ── NAV ── */
        .topbar {
          background: var(--bg); border-bottom: 1px solid var(--border);
          height: 64px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 2rem;
        }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-logo-img {
          width: 36px; height: 36px;
          object-fit: contain; flex-shrink: 0; display: block;
          font-family: var(--font-display); font-size: 18px; font-weight: 900;
          color: #08090C; flex-shrink: 0;
        }
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

        /* ── HERO ── */
        .blog-hero {
          background: var(--bg); border-bottom: 1px solid var(--border);
          padding: 3rem 2rem 2.5rem;
        }
        .blog-hero-inner { max-width: 1100px; margin: 0 auto; }
        .blog-eyebrow {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent-mid);
          margin-bottom: 10px;
        }
        .blog-title {
          font-family: var(--font-display); font-size: clamp(44px, 7vw, 80px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          line-height: 0.95; color: var(--text); margin-bottom: 14px;
        }
        .blog-sub {
          font-family: var(--font-body); font-size: 15px; color: var(--muted);
          max-width: 520px; line-height: 1.65;
        }

        /* ── GRID ── */
        .blog-body { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

        .featured-card {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius-lg); padding: 2rem;
          margin-bottom: 2.5rem; transition: border-color .15s;
          cursor: pointer;
        }
        .featured-card:hover { border-color: var(--border2); }
        .featured-placeholder {
          background: var(--surface2); border-radius: var(--radius);
          display: flex; align-items: center; justify-content: center;
          min-height: 200px;
          font-family: var(--font-display); font-size: 80px; font-weight: 900;
          color: var(--accent); opacity: 0.15; text-transform: uppercase;
          letter-spacing: -2px; user-select: none;
        }
        .featured-content { display: flex; flex-direction: column; justify-content: center; gap: 12px; }
        .featured-label {
          font-family: var(--font-mono); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent-mid);
        }
        .featured-post-title {
          font-family: var(--font-display); font-size: clamp(22px, 3vw, 34px);
          font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em;
          color: var(--text); line-height: 1.1;
        }
        .featured-excerpt {
          font-family: var(--font-body); font-size: 14px; color: var(--muted);
          line-height: 1.65;
        }
        .post-meta {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .cat-tag {
          font-family: var(--font-display); font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          padding: 2px 9px; border-radius: 999px;
        }
        .meta-date {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2);
        }
        .meta-read {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted2);
        }
        .read-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-display); font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--accent); margin-top: 4px;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .post-card {
          background: var(--surface); border: 0.5px solid var(--border);
          border-radius: var(--radius-lg); padding: 1.5rem;
          display: flex; flex-direction: column; gap: 10px;
          transition: transform .15s, border-color .15s, box-shadow .15s;
        }
        .post-card:hover {
          transform: translateY(-2px); border-color: var(--border2);
          box-shadow: 0 6px 24px rgba(0,0,0,0.35);
        }
        .post-card-title {
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.15;
          color: var(--text);
        }
        .post-card-excerpt {
          font-family: var(--font-body); font-size: 13px; color: var(--muted);
          line-height: 1.6; flex: 1;
        }
        .post-card-footer {
          padding-top: 10px; border-top: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }

        @media (max-width: 720px) {
          .topbar { padding: 0 1rem; }
          .topbar-nav { display: none; }
          .blog-hero { padding: 2rem 1rem 1.5rem; }
          .blog-title { font-size: clamp(36px, 12vw, 60px); }
          .blog-body { padding: 1.5rem 1rem 3rem; }
          .featured-card { grid-template-columns: 1fr; gap: 1.25rem; }
          .featured-placeholder { min-height: 120px; font-size: 60px; }
          .featured-post-title { font-size: clamp(20px, 6vw, 28px); }
          .posts-grid { grid-template-columns: 1fr; }
          .post-card-title { font-size: 18px; }
          * { min-width: 0; }
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
          <Link href="/">Calendario</Link>
          <Link href="/blog" className="active">Blog</Link>
          <Link href="/productos">Productos</Link>
        </nav>
      </div>

      {/* Hero */}
      <div className="blog-hero">
        <div className="blog-hero-inner">
          <p className="blog-eyebrow">Hybrid Race Hub · Blog</p>
          <h1 className="blog-title">Noticias<br/>& Guías</h1>
          <p className="blog-sub">
            Artículos sobre OCR, HYROX y fitness híbrido — guías de entrenamiento,
            análisis de equipamiento y los mejores eventos de España.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="blog-body">

        {/* Featured post — page 1 only */}
        {showFeatured && featured && (
          <Link href={`/blog/${featured.slug}`} style={{ display: "block" }}>
            <article className="featured-card">
              <div className="featured-placeholder">
                {featured.category.substring(0, 2).toUpperCase()}
              </div>
              <div className="featured-content">
                <p className="featured-label">Artículo destacado</p>
                <div className="post-meta">
                  <span className="cat-tag" style={{
                    background: CATEGORY_COLORS[featured.category]?.bg || "var(--accent-bg)",
                    color: CATEGORY_COLORS[featured.category]?.color || "var(--accent)",
                  }}>{featured.category}</span>
                  <span className="meta-date">{featured.date}</span>
                  <span className="meta-read">{featured.readTime}</span>
                </div>
                <h2 className="featured-post-title">{featured.title}</h2>
                <p className="featured-excerpt">{featured.excerpt}</p>
                <span className="read-link">Leer artículo →</span>
              </div>
            </article>
          </Link>
        )}

        {/* Post grid */}
        <div className="posts-grid" style={{ marginBottom: "2rem" }}>
          {currentRest.map((post) => {
            const colors = CATEGORY_COLORS[post.category] || { color: "var(--accent)", bg: "var(--accent-bg)" };
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: "block" }}>
                <article className="post-card">
                  <div className="post-meta">
                    <span className="cat-tag" style={{ background: colors.bg, color: colors.color }}>
                      {post.category}
                    </span>
                    <span className="meta-read">{post.readTime}</span>
                  </div>
                  <h2 className="post-card-title">{post.title}</h2>
                  <p className="post-card-excerpt">{post.excerpt}</p>
                  <div className="post-card-footer">
                    <span className="meta-date">{post.date}</span>
                    <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>Leer →</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "2rem" }}>
            <button
              onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
              disabled={page === 1}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "7px 16px", borderRadius: 999,
                background: "transparent", border: "0.5px solid var(--border)",
                color: page === 1 ? "var(--muted2)" : "var(--text)", cursor: page === 1 ? "default" : "pointer",
              }}
            >← Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => { setPage(n); window.scrollTo(0, 0); }}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                  padding: "7px 14px", borderRadius: 999,
                  background: n === page ? "var(--accent)" : "transparent",
                  border: `0.5px solid ${n === page ? "var(--accent)" : "var(--border)"}`,
                  color: n === page ? "#000" : "var(--muted)", cursor: "pointer",
                }}
              >{n}</button>
            ))}
            <button
              onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
              disabled={page === totalPages}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "7px 16px", borderRadius: 999,
                background: "transparent", border: "0.5px solid var(--border)",
                color: page === totalPages ? "var(--muted2)" : "var(--text)", cursor: page === totalPages ? "default" : "pointer",
              }}
            >Siguiente →</button>
          </div>
        )}

        {/* Enlazado interno */}
        <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/calendario" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", border: "0.5px solid rgba(251,146,60,0.3)", borderRadius: 999, padding: "6px 14px" }}>
            📅 Ver calendario de eventos →
          </Link>
          <Link href="/productos/relojes" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "6px 14px" }}>
            🏆 Ranking relojes GPS →
          </Link>
          <Link href="/productos/zapatillas-hyrox" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "6px 14px" }}>
            👟 Ranking zapatillas HYROX →
          </Link>
        </div>
      </div>
    </>
  );
}
