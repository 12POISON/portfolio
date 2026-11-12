import DitherImg from "@/components/bits/dither-img";
import LiveClock from "@/components/bits/live-clock";
import ScrambleText from "@/components/bits/scramble-text";
import { OWNER } from "@/lib/content";

// 00 — HERO. Purely visual: the dithered hand-and-orb in a bare window frame
// (no title bar, no captions) plus a live ticking timestamp. No name, no logo,
// no big display text, no floating objects.
// The real <h1> is visually hidden for crawlers (persona line, not a name).

export default function Hero() {
  return (
    <section data-chapter="hero" className="hero" id="top" aria-label="intro">
      <h1 className="sr-only">
        {OWNER.role} — fraud risk engines, calibrated models, and the interfaces that make them usable. Handle: {OWNER.handle}.
      </h1>

      <div className="hero-stage">
        <figure className="hero-win" data-hero-frame>
          <div className="hero-img-wrap">
            <DitherImg
              hero
              eager
              name="hand-orb"
              alt="dithered 1-bit artwork — a hand holding a burning orb, 1-bit renaissance"
              className="hero-img"
            />
          </div>
        </figure>

        <p className="mono hero-tagline" data-hero-bit>
          <ScrambleText>{OWNER.tagline}</ScrambleText>
        </p>
      </div>

      <span className="mono annot annot-a" data-hero-bit aria-hidden="true">
        {OWNER.hud.coords}
      </span>
      <span className="mono annot annot-b" data-hero-bit aria-hidden="true">
        <LiveClock />
      </span>
      <span className="mono annot annot-d" data-hero-bit aria-hidden="true">
        SCROLL ↓
      </span>
    </section>
  );
}
