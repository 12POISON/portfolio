import ChapHead from "@/components/bits/chap-head";
import CountUp from "@/components/bits/count-up";
import DitherImg from "@/components/bits/dither-img";
import Em from "@/components/bits/em";
import Win from "@/components/bits/win";
import { AMBITIONS, OWNER } from "@/lib/content";

// 01 — WHO: three positioning sentences, the ID window (name band cropped in
// the pipeline), then ONE ambition and the compact formal record — the
// who.dat window is sized to the portrait, not the other way round.

export default function Who() {
  return (
    <section data-chapter="who" id="who" className="chapter who" aria-label="who">
      <ChapHead num="01" title="WHO" note={OWNER.handle} />

      <div className="who-statements">
        {OWNER.positioning.map((s, i) => (
          <p key={i} className="statement serif" data-reveal>
            <Em text={s} />
          </p>
        ))}
      </div>

      <div className="who-grid">
        <div className="who-portrait" data-reveal>
          <Win title="portrait.pcx" meta="1-BIT · BAYER-8">
            <DitherImg
              name="portrait-id"
              alt="dithered 1-bit ID-style portrait"
              className="who-img"
            />
          </Win>
        </div>

        <div className="who-right">
          <Win title="who.dat" meta="EGO + RECORD · UNEDITED">
            <p className="mono win-sec">AMBITION</p>
            <ol className="principles principles-sm">
              <li className="principle">
                <span className="mono principle-id">{AMBITIONS[0].id}</span>
                <span className="principle-t serif">{AMBITIONS[0].t}</span>
                <span className="mono principle-d">— {AMBITIONS[0].d}</span>
              </li>
            </ol>

            <div className="edu-div" aria-hidden="true" />

            <p className="mono win-sec">EDUCATION</p>
            <dl className="edu">
              <div className="edu-row">
                <dt className="mono">INSTITUTE</dt>
                <dd className="edu-v serif">{OWNER.education.school}</dd>
              </div>
              <div className="edu-row">
                <dt className="mono">PROGRAM</dt>
                <dd className="edu-v serif">B.Tech · Artificial Intelligence &amp; ML</dd>
              </div>
              <div className="edu-row">
                <dt className="mono">SPAN</dt>
                <dd className="edu-v mono edu-strong">{OWNER.education.span}</dd>
              </div>
              <div className="edu-row">
                <dt className="mono">GPA</dt>
                <dd className="edu-v mono edu-strong">{OWNER.education.gpa}</dd>
              </div>
              <div className="edu-row">
                <dt className="mono">CAMPUS</dt>
                <dd className="edu-v serif">{OWNER.education.place}, IN</dd>
              </div>
            </dl>

            <p className="mono who-count">NO PAUSE · THE DEGREE IS THE FLOOR</p>
          </Win>
        </div>
      </div>

      <div className="who-stats" data-reveal>
        {OWNER.stats.map((s) => (
          <div className="stat" key={s.unit}>
            <span className="stat-v mono">
              <CountUp value={s.v} decimals={s.decimals} />
            </span>
            <span className="stat-u mono">{s.unit}</span>
            <span className="stat-l mono">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="mono who-foot" data-reveal>
        * FROM RESUME & PUBLIC REPOS · AS_OF {OWNER.as_of}
      </p>

      <div className="who-principles" data-reveal>
        <Win title="principles.txt" meta="READ-ONLY">
          <ol className="principles">
            {OWNER.principles.map((p) => (
              <li key={p.id} className="principle">
                <span className="mono principle-id">{p.id}</span>
                <span className="principle-t serif">{p.t}</span>
                <span className="mono principle-d">— {p.d}</span>
              </li>
            ))}
          </ol>
        </Win>
      </div>
    </section>
  );
}
