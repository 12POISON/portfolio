import ChapHead from "@/components/bits/chap-head";
import Marquee from "@/components/bits/marquee";
import ReadmeDrop from "@/components/bits/readme-drop";
import { PROJECTS } from "@/lib/content";
import { getRepos } from "@/lib/github-data";

// 02 — WORK index. Driven by GitHub: the six curated PROJECTS first (with
// /work case pages), then EVERY other public non-fork repo pulled live from
// the GitHub API (ISR 5 min) — new repos appear here automatically.
// Case links only exist for the curated six; extra rows link to GitHub/homepage.

export default async function Work() {
  const { live, repos } = await getRepos();

  const seen = new Set(PROJECTS.map((p) => p.repo.replace(/\/$/, "").toUpperCase()));
  const extra = repos.filter((r) => !seen.has(r.url.replace(/\/$/, "").toUpperCase()));
  const total = PROJECTS.length + extra.length;

  return (
    <section data-chapter="work" id="work" className="chapter work" aria-label="work">
      <ChapHead
        num="02"
        title="WORK"
        note={`${String(total).padStart(2, "0")} PUBLIC ARTIFACTS · ${live ? "LIVE FEED" : "CACHED"}`}
      />

      <h2 className="chapter-title serif" data-reveal>
        Systems that survive <em>review</em>.
      </h2>

      <div className="rows">
        {PROJECTS.map((p) => (
          <ReadmeDrop key={p.slug} repo={p.repo} name={p.name}>
            <a
              className="row-cover"
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name} — open repository`}
            />
            <span className="row-num mono" data-row-num>
              #{p.num}
            </span>
            <a className="row-name serif" href={p.repo} target="_blank" rel="noreferrer" data-hover>
              {p.name}
            </a>
            <span className="row-line">{p.line}</span>
            <span className="row-stack mono">{p.stack}</span>
            <span className="row-year mono">{p.year}</span>
            <span className="row-status mono">{p.status ?? "SHIPPED"}</span>
            <a className="row-case mono" href={`/work/${p.slug}`} data-hover>
              CASE ↗
            </a>
            <span className="row-glyph mono" aria-hidden="true">
              ↗
            </span>
          </ReadmeDrop>
        ))}

        {extra.map((r, i) => (
          <ReadmeDrop key={r.url} repo={r.url} name={r.name} auto>
            <a
              className="row-cover"
              href={r.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${r.name} — open repository`}
            />
            <span className="row-num mono" data-row-num>
              #{String(PROJECTS.length + i + 1).padStart(2, "0")}
            </span>
            <a className="row-name serif" href={r.url} target="_blank" rel="noreferrer" data-hover>
              {r.name}
            </a>
            <span className="row-line">{r.description || "— no README theatrics, just code."}</span>
            <span className="row-stack mono">{r.stack}</span>
            <span className="row-year mono">{r.updated}</span>
            <span className="row-status mono">{r.homepage ? "LIVE" : "OPEN-SOURCE"}</span>
            <a
              className="row-case mono"
              href={r.homepage ?? r.url}
              target="_blank"
              rel="noreferrer"
              data-hover
            >
              {r.homepage ? "OPEN ↗" : "GITHUB ↗"}
            </a>
            <span className="row-glyph mono" aria-hidden="true">
              ↗
            </span>
          </ReadmeDrop>
        ))}
      </div>

      <p className="mono who-foot" data-reveal>
        * INDEX SYNCED TO github.com/WHITEJACK5 · CACHE 5M · CASE PAGES FOR THE SIX FLAGSHIPS
      </p>

      <Marquee
        className="work-marquee"
        items={["TRACER 53 MS", "AUPRC 83% CEILING", "PR-AUC 0.35", "+$7.4M POLICY", "D2/20", "74.4% COVERAGE", "WHITEJACK5"]}
      />
    </section>
  );
}
