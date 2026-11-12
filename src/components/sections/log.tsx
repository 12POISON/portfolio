import ChapHead from "@/components/bits/chap-head";
import { LOG } from "@/lib/content";

// 05 — LOG: verified timeline (no internships — none exist to fake).
// Ends with a blinking cursor, because the log is still being written.

export default function Log() {
  return (
    <section data-chapter="log" id="log" className="chapter log" aria-label="log">
      <ChapHead num="05" title="LOG" note="EDUCATION · BUILDS · RECOGNITION" />

      <h2 className="chapter-title serif" data-reveal>
        Append-only <em>history</em>.
      </h2>

      <ol className="log-list">
        {LOG.map((e, i) => (
          <li className="log-row" data-reveal key={i}>
            <span className="log-d mono">[{e.d}]</span>
            <span className="log-t serif">{e.t}</span>
            <span className="log-m mono">{e.m}</span>
          </li>
        ))}
        <li className="log-row log-now" data-reveal>
          <span className="log-d mono">[----]</span>
          <span className="log-t serif">Next entry</span>
          <span className="log-m mono">
            awaiting commit <span className="blink">▊</span>
          </span>
        </li>
      </ol>
    </section>
  );
}
