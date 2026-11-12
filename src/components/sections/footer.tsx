import BackToTop from "@/components/back-to-top";
import { CHAPTERS, OWNER, PROJECTS } from "@/lib/content";

// FOOTER — the tagline (never a name), mono sitemap, status bar repeated.

export default function Footer() {
  return (
    <footer data-chapter="footer" className="chapter footer" aria-label="footer">
      <p className="footer-tagline serif" data-reveal>
        {OWNER.tagline}
      </p>

      <div className="footer-cols">
        <nav className="footer-col" aria-label="chapters">
          <span className="mono footer-col-h">CHAPTERS</span>
          {CHAPTERS.filter((c) => c.id !== "hero" && c.id !== "footer").map((c) => (
            <a key={c.id} className="mono footer-link" data-hover href={`#${c.id}`}>
              {c.num} / {c.title}
            </a>
          ))}
        </nav>
        <nav className="footer-col" aria-label="case pages">
          <span className="mono footer-col-h">CASES</span>
          {PROJECTS.map((p) => (
            <a key={p.slug} className="mono footer-link" data-hover href={`/work/${p.slug}`}>
              {p.num} / {p.name}
            </a>
          ))}
        </nav>
        <div className="footer-col">
          <span className="mono footer-col-h">STATUS</span>
          <span className="mono footer-link">{OWNER.role}</span>
          <span className="mono footer-link">{OWNER.hud.coords}</span>
          <span className="mono footer-link">B.TECH '28 · GPA {OWNER.education.gpa}</span>
        </div>
      </div>

      <div className="footer-bar">
        <span className="mono">© {new Date().getFullYear()} · ALL SYSTEMS NOMINAL</span>
        <span className="mono footer-quote serif">I DON&rsquo;T WALK THE STRIDE. <em>I AM</em> THE STRIDE.</span>
        <BackToTop />
      </div>
    </footer>
  );
}
