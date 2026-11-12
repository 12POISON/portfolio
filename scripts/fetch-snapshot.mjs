// Fetch a fresh GitHub snapshot → src/data/github-snapshot.json (build fallback)
//                              + public/data/github-snapshot.json (plain mirror)
// Run any time: `node scripts/fetch-snapshot.mjs`
import { mkdirSync, writeFileSync } from "node:fs";

const UA = { "User-Agent": "whitejack5-portfolio" };
const mapEvent = (e) => ({
  type: e.type,
  repo: e.repo?.name ?? null,
  at: e.created_at ?? "",
  ref: e.payload?.ref ?? null,
  size: typeof e.payload?.size === "number" ? e.payload.size : null,
});

mkdirSync("src/data", { recursive: true });
mkdirSync("public/data", { recursive: true });

const [contrib, events, repos] = await Promise.all([
  fetch("https://github-contributions-api.jogruber.de/v4/WHITEJACK5?y=last")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
  fetch("https://api.github.com/users/WHITEJACK5/events/public?per_page=12", { headers: UA })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .catch(() => []),
  fetch("https://api.github.com/users/WHITEJACK5/repos?per_page=100&sort=updated", { headers: UA })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .catch(() => []),
]);

const contributions = contrib.contributions ?? [];
const out = {
  source: "github.com + jogruber v4",
  fetched_at: new Date().toISOString(),
  total: contrib.total ?? null,
  contributions,
  events: (Array.isArray(events) ? events : []).map(mapEvent),
  repos: (Array.isArray(repos) ? repos : [])
    .filter((r) => !r.fork && !r.private)
    .map((r) => ({
      name: r.name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      pushed_at: r.pushed_at,
      homepage: r.homepage,
      stargazers_count: r.stargazers_count,
    })),
};

writeFileSync("src/data/github-snapshot.json", JSON.stringify(out, null, 2));
writeFileSync("public/data/github-snapshot.json", JSON.stringify(out));
const sum = contributions.reduce((a, d) => a + d.count, 0);
console.log(
  `snapshot saved · ${contributions.length} days · ${sum} contributions · ${out.events.length} events · ${out.repos.length} repos`
);
