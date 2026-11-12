import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Win from "@/components/bits/win";
import { PROJECTS } from "@/lib/content";

// /work/[slug] — case pages: PROBLEM → APPROACH → NUMBERS → LIMITS → LINKS.
// All static (generateStaticParams), crawler-readable, no client JS needed.

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} — case`,
    description: p.line,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = PROJECTS.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = PROJECTS[idx];
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const cs = p.caseStudy;

  return (
    <article className="case" data-chapter="work">
      <p className="mono" style={{ marginBottom: 18 }}>
        <Link href="/" data-hover className="footer-link">
          ← BACK TO INDEX
        </Link>
      </p>

      <header className="case-head">
        <span className="mono" style={{ color: "var(--ink-dim)" }}>
          #{p.num}
        </span>
        <h1 className="case-name serif">{p.name}</h1>
        <span className="mono" style={{ color: "var(--ink-dim)" }}>
          {p.year} · {p.status ?? "SHIPPED"}
        </span>
      </header>

      <div className="case-block" data-reveal>
        <Win title={`${p.slug}.case`} meta={p.stack}>
          <p className="case-p">{p.line}</p>
        </Win>
      </div>

      <section className="case-block">
        <h2 className="mono case-h">PROBLEM</h2>
        {cs.problem.map((t, i) => (
          <p className="case-p" key={i} data-reveal>
            {t}
          </p>
        ))}
      </section>

      <section className="case-block">
        <h2 className="mono case-h">APPROACH</h2>
        {cs.approach.map((t, i) => (
          <p className="case-p" key={i} data-reveal>
            {t}
          </p>
        ))}
      </section>

      <section className="case-block" data-reveal>
        <h2 className="mono case-h">NUMBERS</h2>
        <div className="case-numbers">
          {cs.numbers.map((n) => (
            <div key={n.k}>
              <span className="case-num-v mono">{n.v}</span>
              <span className="case-num-k mono">{n.k}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-block">
        <h2 className="mono case-h">LIMITS — HONESTLY</h2>
        <ul className="case-limits" style={{ paddingLeft: 18 }}>
          {cs.limits.map((t, i) => (
            <li key={i} data-reveal>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="case-block">
        <h2 className="mono case-h">LINKS</h2>
        <div className="case-links">
          <a className="case-link mono" data-hover href={p.repo} target="_blank" rel="noreferrer">
            REPOSITORY ↗
          </a>
          {p.demo ? (
            <a className="case-link mono" data-hover href={p.demo} target="_blank" rel="noreferrer">
              LIVE DEMO ↗
            </a>
          ) : null}
          {p.site ? (
            <a className="case-link mono" data-hover href={p.site} target="_blank" rel="noreferrer">
              SITE ↗
            </a>
          ) : null}
          <a className="case-link mono" data-hover href="/resume.pdf" target="_blank" rel="noreferrer">
            RESUME.PDF ↗
          </a>
        </div>
      </section>

      <nav className="case-nav mono" aria-label="project navigation">
        <Link href={`/work/${prev.slug}`} data-hover>
          ← {prev.name}
        </Link>
        <Link href={`/work/${next.slug}`} data-hover>
          {next.name} →
        </Link>
      </nav>
    </article>
  );
}
