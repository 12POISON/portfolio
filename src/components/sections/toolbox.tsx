import ChapHead from "@/components/bits/chap-head";
import Marquee from "@/components/bits/marquee";
import Win from "@/components/bits/win";
import { TOOLBOX } from "@/lib/content";

// 04 — TOOLBOX: certs window + skills.zip file tree (core first, explored/
// second — honest depth), then two marquee rows (focus / current).

export default function Toolbox() {
  return (
    <section data-chapter="toolbox" id="toolbox" className="chapter toolbox" aria-label="toolbox">
      <ChapHead num="04" title="TOOLBOX" note="CORE FIRST · EXPLORED SECOND" />

      <h2 className="chapter-title serif" data-reveal>
        The machine <em>room</em>.
      </h2>

      <div className="tb-grid">
        <div data-reveal>
          <Win title="certs.txt" meta="VERIFIED ×3">
            <ul className="cert-list">
              {TOOLBOX.certs.map((c) => (
                <li key={c.name} className="cert">
                  <span className="mono cert-when">{c.when}</span>
                  <span className="cert-name serif">{c.name}</span>
                  <span className="mono cert-by">{c.by}</span>
                </li>
              ))}
            </ul>
          </Win>
        </div>

        <div data-reveal>
          <Win title="skills.zip" meta="UNPACKED">
            <div className="zip">
              {TOOLBOX.folders.map((f) => (
                <div className="zip-folder" key={f.name}>
                  <span className="mono zip-name">{f.name}/</span>
                  <span className="zip-files">
                    {f.core.map((t) => (
                      <span className="file mono" data-hover key={t}>
                        {t}
                      </span>
                    ))}
                    {f.explored?.map((t) => (
                      <span className="file mono file-explored" data-hover key={t}>
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </Win>
        </div>
      </div>

      <div className="tb-marquees">
        <Marquee items={TOOLBOX.marquee[0]} duration={30} />
        <Marquee items={TOOLBOX.marquee[1]} duration={24} reverse />
      </div>
    </section>
  );
}
