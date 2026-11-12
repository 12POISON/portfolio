import ChapHead from "@/components/bits/chap-head";

// 06 — LIFE: one artifact — the human-evolution clip, quantized to true 1-bit
// in real time (grayscale → #wj-onebit SVG filter defined in layout.tsx).
// No window chrome, no caption: the video fills its frame edge to edge,
// loops forever. Deliberate beat: "data is cold, I am not."

export default function Life() {
  return (
    <section data-chapter="life" id="life" className="chapter life" aria-label="life">
      <ChapHead num="06" title="LIFE" note="1-BIT HUMAN GALLERY" />

      <h2 className="chapter-title serif" data-reveal>
        Data is cold. <em>I</em> am not.
      </h2>

      <figure className="life-frame" data-reveal>
        <video
          className="life-video"
          src="/d/human-evolution.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="human evolution montage, quantized live to 1-bit"
        />
      </figure>
    </section>
  );
}
