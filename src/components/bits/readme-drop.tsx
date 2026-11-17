"use client";

// README-DROP — hover any WORK row and that repo's GitHub README unfolds
// beneath it as a dropdown, fully rendered on a black panel (white text):
// headings, badges, screenshots, tables, lists, code blocks, links.
// Works for EVERY repo row — current and future — because the repo path is
// derived from the row's own URL at render time and the README is fetched
// live per repo (new public repo → new row → its README just works).
//
// Device rules:
//   • Hover-capable devices (any window width): hover a row → dropdown.
//   • Touch-only devices (phones, tablets): each row gets a visible
//     "README ▾ OPEN" strip — tap to unfold, tap again/outside to close.
//   • Both paths share the same fetch pipeline and caches below.
//
// Robustness rules:
//   • GitHub's rendered-README endpoint first (sanitized upstream), plain
//     raw text as fallback, then a cached "no readme" verdict (never re-hammer
//     a repo that has none).
//   • Every image path — absolute, root-relative, bare repo-relative — is
//     rewritten; images that still fail are removed (no broken icons).
//   • Links never 404 the site: bare file links open on GitHub.
//   • 12s abort timeout on every fetch.
//   • Every repo with no README gets a cached verdict (never re-hammered).

import { useEffect, useRef, useState, type ReactNode } from "react";

type Entry = { kind: "html" | "text"; content: string };

// owner/repo → rendered entry, shared across all rows for the page session
const cache = new Map<string, Entry>();
// owner/repo → verified to have no readable README anywhere (cached verdict)
const noReadme = new Set<string>();

const TIMEOUT_MS = 12000;

function repoPath(repoUrl: string): string {
  try {
    const u = new URL(repoUrl);
    return u.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .slice(0, 2)
      .join("/");
  } catch {
    return "";
  }
}

/** Make any README image URL absolute and loadable from the site. */
function absSrc(src: string, path: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return "https:" + src;
  if (src.startsWith("/")) return "https://github.com" + src;
  // bare repo-relative path ("docs/img.png", "frontend/public/logo.png")
  return `https://raw.githubusercontent.com/${path}/HEAD/${src.replace(/ /g, "%20")}`;
}

/** GitHub-rendered README HTML (sanitized upstream — no scripts/iframes). */
async function fetchRendered(path: string): Promise<string> {
  const r = await fetch(`https://api.github.com/repos/${path}/readme`, {
    headers: { Accept: "application/vnd.github.html+json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!r.ok) throw new Error("render unavailable");
  const html = await r.text();
  if (!html.trim()) throw new Error("empty render");
  return prepHtml(html, path);
}

/** Rewrite URLs so images/links work in place, inside the dropdown. */
function prepHtml(html: string, path: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  // <picture> dark/light variants reference unrewritten srcsets — drop them,
  // the <img src> (which we rewrite) is the single source of truth
  doc.querySelectorAll("picture source").forEach((s) => s.remove());
  doc.querySelectorAll("img").forEach((img) => {
    img.setAttribute("src", absSrc(img.getAttribute("src") ?? "", path));
    img.removeAttribute("srcset");
    img.setAttribute("loading", "lazy");
  });
  // heading-anchor ¶ links are pure noise in a dropdown
  doc.querySelectorAll("a.anchor").forEach((a) => a.remove());
  doc.querySelectorAll("a").forEach((a) => {
    const h = a.getAttribute("href") ?? "";
    if (/^(https?:)?\/\//i.test(h)) {
      /* already absolute */
    } else if (h.startsWith("/")) {
      a.setAttribute("href", "https://github.com" + h);
    } else if (h.startsWith("#")) {
      a.setAttribute("href", `https://github.com/${path}${h}`);
    } else if (h && !/^(mailto:|tel:|javascript:)/i.test(h)) {
      // bare-relative file link — view it on GitHub, never 404 our site
      a.setAttribute("href", `https://github.com/${path}/blob/HEAD/${h}`);
    } else {
      return;
    }
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noreferrer");
  });
  return doc.body.innerHTML;
}

/** Terminal-plain fallback (also used when the render endpoint fails). */
async function fetchPlain(path: string): Promise<string> {
  for (const file of ["README.md", "readme.md", "Readme.md", "README.rst", "README.txt"]) {
    const r = await fetch(`https://raw.githubusercontent.com/${path}/HEAD/${file}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (r.ok) return await r.text();
  }
  throw new Error("no readme");
}

type Drop = { open: boolean; status: "loading" | "ok" | "error"; kind: "html" | "text"; text: string };
const SHUT: Drop = { open: false, status: "loading", kind: "html", text: "" };
const CAP = 8000;

export default function ReadmeDrop({
  repo,
  name,
  auto = false,
  children,
}: {
  repo: string;
  name: string;
  auto?: boolean;
  children: ReactNode;
}) {
  const [drop, setDrop] = useState<Drop>(SHUT);
  const path = repoPath(repo);
  const openTimer = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    return () => {
      alive.current = false;
      if (openTimer.current) window.clearTimeout(openTimer.current);
    };
  }, []);

  // kill broken images inside the injected README (capture-phase listener
  // catches error events that never bubble) — the panel stays clean
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const bury = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement) t.remove();
    };
    el.addEventListener("error", bury, true);
    return () => el.removeEventListener("error", bury, true);
  }, []);

  // shared fetch pipeline — rendered HTML → plain text → cached verdict.
  // Used by both the hover path and the touch toggle.
  const load = async () => {
    if (!path) return;
    if (noReadme.has(path)) {
      setDrop({ open: true, status: "error", kind: "text", text: "" });
      return;
    }
    const hit = cache.get(path);
    if (hit) {
      setDrop({ open: true, status: "ok", kind: hit.kind, text: hit.content });
      return;
    }
    setDrop({ open: true, status: "loading", kind: "html", text: "" });
    try {
      const content = await fetchRendered(path);
      cache.set(path, { kind: "html", content });
      if (alive.current) setDrop({ open: true, status: "ok", kind: "html", text: content });
    } catch {
      try {
        const plain = await fetchPlain(path);
        cache.set(path, { kind: "text", content: plain.slice(0, CAP) });
        if (alive.current) setDrop({ open: true, status: "ok", kind: "text", text: plain.slice(0, CAP) });
      } catch {
        noReadme.add(path);
        if (alive.current) setDrop({ open: true, status: "error", kind: "text", text: "" });
      }
    }
  };

  // hover path (any hover-capable device at ANY window width) — debounced so
  // fast sweeps across rows don't fire fetches
  const open = () => {
    if (!path || !window.matchMedia("(hover: hover)").matches) return;
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => {
      if (alive.current) void load();
    }, 120);
  };

  const close = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (alive.current) setDrop((d) => (d.open ? { ...d, open: false } : d));
  };

  // touch path (phones / tablets) — hover never fires there, so each row
  // carries a visible toggle: tap to unfold, tap again or outside to close.
  const toggleTouch = () => {
    if (!path || window.matchMedia("(hover: hover)").matches) return;
    if (drop.open) {
      close();
      (document.activeElement as HTMLElement | null)?.blur?.();
      return;
    }
    void load();
  };

  // tapping anywhere outside the row closes the open dropdown (touch flow)
  useEffect(() => {
    if (!drop.open) return;
    const onDoc = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [drop.open]);

  return (
    <div
      ref={wrapRef}
      className={`row${auto ? " row-auto" : ""}`}
      data-row
      data-reveal
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      {children}

      {/* touch-only toggle — hidden entirely on hover-capable devices via CSS */}
      <button
        type="button"
        className="row-readme mono"
        aria-expanded={drop.open}
        onClick={toggleTouch}
      >
        {drop.open ? "README × CLOSE" : "README ▾ OPEN"}
      </button>

      {drop.open && (
        <div className="readme-drop" role="note" aria-label={`${name} — README from GitHub`}>
          <div className="readme-bar mono">
            <span className="win-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="readme-title">README.md</span>
            <span className="readme-meta">{path.toUpperCase()}</span>
          </div>
          <div className="readme-scroll">
            {drop.status === "loading" ? (
              <pre className="readme-pre mono">FETCHING README FROM GITHUB…</pre>
            ) : drop.status === "error" ? (
              <pre className="readme-pre mono">NO README EXPOSED — THE CODE SPEAKS FOR ITSELF.</pre>
            ) : drop.kind === "html" ? (
              <div className="readme-body mono" dangerouslySetInnerHTML={{ __html: drop.text }} />
            ) : (
              <pre className="readme-pre mono">{drop.text}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
