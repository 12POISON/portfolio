import ChapHead from "@/components/bits/chap-head";
import Win from "@/components/bits/win";
import { EmailCopy, MailTo } from "@/components/signal-islands";
import { OWNER } from "@/lib/content";

// 07 — SIGNAL: giant serif CTA, the email as an enormous link, numbered
// social index, honest mailto composer, status line.

const SOCIALS = [
  { k: "GITHUB", v: "github.com/WHITEJACK5", href: OWNER.links.github },
  { k: "LINKEDIN", v: "linkedin.com/in/devireddybharadwaja", href: OWNER.links.linkedin },
  { k: "LEETCODE", v: "leetcode.com/u/devireddy5", href: OWNER.links.leetcode },
  { k: "INSTAGRAM", v: "@futurebug5", href: OWNER.links.instagram },
  { k: "RESUME", v: "/resume.pdf", href: "/resume.pdf" },
];

export default function Signal() {
  return (
    <section data-chapter="signal" id="signal" className="chapter signal" aria-label="signal">
      <ChapHead num="07" title="SIGNAL" note="OPEN TO INTERNSHIPS & AI ROLES" />

      <h2 className="signal-cta serif" data-reveal>
        Let&rsquo;s build something <em>measurable</em> and explainable.
      </h2>

      <div className="signal-email" data-reveal>
        <EmailCopy />
      </div>

      <div className="signal-grid">
        <ol className="signal-index" data-reveal>
          {SOCIALS.map((s, i) => (
            <li key={s.k}>
              <a className="signal-row" data-hover href={s.href} target={s.href.startsWith("/") ? undefined : "_blank"} rel="noreferrer">
                <span className="mono signal-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="signal-k mono">{s.k}</span>
                <span className="signal-v mono">{s.v}</span>
                <span className="mono signal-glyph" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ol>

        <div data-reveal>
          <Win title="mailto.exe" meta="NO BACKEND">
            <MailTo />
          </Win>
        </div>
      </div>

      <p className="mono signal-status" data-reveal>
        B.TECH '28 IN PROGRESS · OPEN TO INTERNSHIPS &amp; AI ENGINEERING ROLES
      </p>
    </section>
  );
}
