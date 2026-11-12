import { cache } from "react";
import snapshot from "@/data/github-snapshot.json";

// GitHub repos — ONE cached fetch shared by the WORK index and COMMITS.
// Live API with ISR (5 min); on rate-limit/offline the build-time snapshot
// renders instead (the WORK header shows which one is live).

export type RepoRow = {
  name: string; // uppercased repo name
  url: string;
  description: string;
  stack: string; // primary language, uppercased
  updated: string; // last push, YYYY.MM.DD
  homepage: string | null;
  stars: number;
};

type RawRepo = {
  name?: string;
  html_url?: string;
  description?: string | null;
  language?: string | null;
  pushed_at?: string;
  homepage?: string | null;
  stargazers_count?: number;
  fork?: boolean;
  "private"?: boolean;
};

function mapRepo(r: RawRepo): RepoRow {
  return {
    name: (r.name ?? "").toUpperCase(),
    url: r.html_url ?? "https://github.com/WHITEJACK5",
    description: (r.description ?? "").trim(),
    stack: (r.language ?? "CODE").toUpperCase(),
    updated: (r.pushed_at ?? "").slice(0, 10).replaceAll("-", "."),
    homepage: r.homepage || null,
    stars: r.stargazers_count ?? 0,
  };
}

// Repos that must never appear as WORK rows (profile-config / scratch repos).
// Uppercased names; add a line here to hide another repo from the index.
const HIDDEN_REPOS = new Set(["WHITEJACK5", "RAG-BASICS", "ML_PROJECT"]);

function publicRepos(list: RawRepo[]): RepoRow[] {
  return list
    .filter((r) => !r.fork && !r["private"])
    .filter((r) => !HIDDEN_REPOS.has((r.name ?? "").toUpperCase()))
    .map(mapRepo);
}

export const getRepos = cache(async (): Promise<{ live: boolean; repos: RepoRow[] }> => {
  try {
    const r = await fetch("https://api.github.com/users/WHITEJACK5/repos?per_page=100&sort=updated", {
      next: { revalidate: 300 },
      headers: { "User-Agent": "whitejack5-portfolio" },
    });
    if (r.ok) {
      const j: unknown = await r.json();
      if (Array.isArray(j) && j.length) {
        return { live: true, repos: publicRepos(j as RawRepo[]) };
      }
    }
  } catch {
    /* offline / rate-limited → snapshot */
  }
  const snap = (snapshot as { repos?: RawRepo[] }).repos;
  return { live: false, repos: Array.isArray(snap) ? publicRepos(snap) : [] };
});
