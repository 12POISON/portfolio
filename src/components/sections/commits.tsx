import ChapHead from "@/components/bits/chap-head";
import CountUp from "@/components/bits/count-up";
import Win from "@/components/bits/win";
import { getRepos } from "@/lib/github-data";
import { OWNER, type Project } from "@/lib/content";
import snapshot from "@/data/github-snapshot.json";

// 03 — COMMITS. Contribution graph as 1-bit dot matrix (SSR, crawlable),
// honest counters, recent public events as a terminal log.
// Live fetch is ISR-cached (1 h); on rate-limit the build-time snapshot
// renders with a `-- cached` label.

type Contrib = { date: string; count: number; level: number };
type Ev = { type: string; repo: string | null; at: string };

type GithubData = {
  live: boolean;
  total: number;
  contributions: Contrib[];
  events: Ev[];
};

const VERB: Record<string, string> = {
  PushEvent: "push",
  CreateEvent: "new",
  WatchEvent: "star",
  ForkEvent: "fork",
  IssuesEvent: "issue",
  PullRequestEvent: "pr",
  ReleaseEvent: "release",
  PublicEvent: "public",
};

function fmtEvents(raw: unknown): Ev[] {
  if (!Array.isArray(raw)) return [];
  return (raw as Array<{ type?: string; repo?: { name?: string }; created_at?: string }>)
    .slice(0, 12)
    .map((e) => ({ type: e.type ?? "Event", repo: e.repo?.name ?? null, at: e.created_at ?? "" }));
}

async function getGithub(): Promise<GithubData> {
  const fallback: GithubData = {
    live: false,
    total: (snapshot.contributions as Contrib[]).reduce((a, d) => a + d.count, 0),
    contributions: snapshot.contributions as Contrib[],
    events: fmtEvents(snapshot.events),
  };
  try {
    const [c, e] = await Promise.all([
      fetch("https://github-contributions-api.jogruber.de/v4/WHITEJACK5?y=last", {
        next: { revalidate: 300 },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch("https://api.github.com/users/WHITEJACK5/events/public?per_page=12", {
        next: { revalidate: 300 },
        headers: { "User-Agent": "whitejack5-portfolio" },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]);
    const contribs: Contrib[] | undefined = c?.contributions;
    if (contribs?.length) {
      return {
        live: true,
        total: c.total?.lastYear ?? contribs.reduce((a: number, d: Contrib) => a + d.count, 0),
        contributions: contribs,
        events: fmtEvents(e),
      };
    }
  } catch {
    /* offline / rate-limited → snapshot */
  }
  return fallback;
}

export default async function Commits() {
  const data = await getGithub();
  const { repos } = await getRepos();
  const repoCount = repos.length || 9;
  const weeks: Contrib[][] = [];
  for (let i = 0; i < data.contributions.length; i += 7) weeks.push(data.contributions.slice(i, i + 7));

  return (
    <section data-chapter="commits" id="commits" className="chapter commits" aria-label="commits">
      <ChapHead num="03" title="COMMITS" note={`-- ${data.live ? "LIVE" : `CACHED ${snapshot.fetched_at?.slice(0, 10) ?? "2026.11.10"}`}`} />

      <h2 className="chapter-title serif" data-reveal>
        The graph is the <em>ledger</em>.
      </h2>

      <div className="commit-grid-wrap win" data-reveal>
        <div className="win-bar">
          <span className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="mono win-title">audit.log — github.com/WHITEJACK5</span>
          <span className="mono win-meta">{data.contributions.length} DAYS</span>
        </div>
        <div className="win-body">
          <div
            className="commit-grid"
            role="img"
            aria-label={`Contribution graph: ${data.total} contributions in the last year`}
          >
            {weeks.map((week, wi) => (
              <div className="commit-col" key={wi}>
                {week.map((d) => (
                  <span
                    key={d.date}
                    className={`cell c${d.level}`}
                    title={`${d.date} · ${d.count} contribution${d.count === 1 ? "" : "s"}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="commit-legend mono" aria-hidden="true">
            LESS
            <span className="cell c0" />
            <span className="cell c1" />
            <span className="cell c2" />
            <span className="cell c3" />
            <span className="cell c4" />
            MORE
          </p>
        </div>
      </div>

      <div className="commit-counters" data-reveal>
        <div className="stat">
          <span className="stat-v mono">
            <CountUp value={String(data.total)} />
          </span>
          <span className="stat-u mono">CONTRIBS / YEAR</span>
          <span className="stat-l mono">graph sum · {data.live ? "live" : "snapshot"}</span>
        </div>
        <div className="stat">
          <span className="stat-v mono">
            <CountUp value={String(repoCount)} />
          </span>
          <span className="stat-u mono">PUBLIC REPOS</span>
          <span className="stat-l mono">github.com/WHITEJACK5</span>
        </div>
        <div className="stat">
          <span className="stat-v mono">×2</span>
          <span className="stat-u mono">PULL SHARK</span>
          <span className="stat-l mono">achievement unlocked · honestly</span>
        </div>
      </div>

      <div className="who-principles" data-reveal>
        <Win title="events.log" meta="PUBLIC FEED">
          <ul className="event-log mono">
            {data.events.map((e, i) => (
              <li key={i}>
                <span className="ev-date">[{e.at.slice(5, 10).replace("-", ".")}]</span>{" "}
                <span className="ev-verb">{VERB[e.type] ?? "act"}</span> →{" "}
                <span className="ev-repo">{e.repo ?? "—"}</span>
              </li>
            ))}
            {data.events.length === 0 && <li>-- feed quiet. the graph still tells the truth.</li>}
          </ul>
        </Win>
      </div>

      <p className="mono who-foot" data-reveal>
        * CACHE 5M · RATE-LIMIT FALLBACK = BUNDLED SNAPSHOT · AS_OF {OWNER.as_of}
      </p>
    </section>
  );
}
