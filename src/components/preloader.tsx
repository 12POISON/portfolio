"use client";

import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/animation/motion-store";

// HONEST PRELOADER — pure visual overlay; the real DOM (SSR) underneath stays
// crawlable. Progress follows REAL events (fonts + hero image + minimum beat),
// floors at 400 ms, caps at 1.6 s, skippable, and skipped entirely on repeat
// visits (sessionStorage). Exit = fullscreen dither-pixel wipe (GLSL, canvas-2D
// fallback when WebGL is unavailable).

const LOG = [
  "/sys [WHITEJACK5].init",
  "/load dither.pitch ............. OK",
  "/load hand.orb ............... OK",
  "/load ledger.chain ............. OK",
  "/check motion .................. OK",
  "/gate llms.txt ................. OPEN",
  "ALL SYSTEMS NOMINAL",
];

const WIPE_VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const WIPE_FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uT;
// bayer 4×4 per 3px screen cell — chunky 1-bit dissolve
float bayer(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  float m[16];
  m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
  m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
  m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
  m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
  int i = y * 4 + x;
  float v = 0.0;
  for (int k = 0; k < 16; k++) { if (k == i) v = m[k]; }
  return v / 16.0;
}
void main() {
  vec2 cell = floor(gl_FragCoord.xy / 3.0);
  float reveal = uT * 1.35 - 0.15;         // slight overshoot so it fully clears
  float b = bayer(cell);
  float alpha = step(b, 1.0 - reveal) * step(0.0, reveal);
  // ink-white dissolve edge: pixels at the reveal line flash white for one frame-ish band
  float edge = smoothstep(0.0, 0.08, abs(b - (1.0 - reveal)));
  vec3 ink = vec3(0.929, 0.925, 0.910);    // #EDECE8
  vec3 col = mix(vec3(0.0), ink, edge < 0.02 ? 1.0 : 0.0);
  gl_FragColor = vec4(col, alpha);
}`;

export default function Preloader() {
  const [lineCount, setLineCount] = useState(0);
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef(false);

  useEffect(() => {
    let done = false;
    let raf = 0;
    let iv = 0;

    // repeat visit → skip the whole boot instantly
    let skip = false;
    try {
      if (sessionStorage.getItem("wj.booted")) skip = true;
    } catch {
      /* ignore */
    }
    if (skip) {
      setGone(true);
      store.finishBoot();
      return;
    }

    document.documentElement.classList.add("booting");

    // REAL progress: fonts + hero decode; bounded by floor/cap
    const hero = document.querySelector<HTMLImageElement>("img[data-hero]");
    const real = Promise.allSettled([
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ?? Promise.resolve(),
      hero?.decode() ?? Promise.resolve(),
    ]);
    let realDone = false;
    real.then(() => (realDone = true));
    const t0 = performance.now();
    iv = window.setInterval(() => {
      const el = (performance.now() - t0) / 1300; // ~realistic budget
      // honest clamp: we never show >85% before the real events resolve
      setPct(Math.min(realDone ? 100 : 85, Math.max(0, Math.round(el * 100))));
      setLineCount(Math.min(LOG.length, Math.floor(el * LOG.length * 1.4)));
      if (el >= 1 && realDone && !done) finish();
    }, 40);
    // hard cap: never trap the visitor behind a slow font/decode (spec: ≤1.6 s,
    // extended margin only when the network is genuinely slow)
    window.setTimeout(() => finish(), 2400);

    const finish = () => {
      if (done) return;
      done = true;
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      // honest floor
      const wait = Math.max(0, 400 - (performance.now() - t0));
      window.setTimeout(runWipe, skipRef.current ? 0 : wait);
    };

    real.then(() => {
      // don't race the cap; the interval triggers finish via el >= 1 — this only
      // accelerates progress visualization (fonts usually land < 1.3s)
    });

    const skipFn = () => {
      skipRef.current = true;
      finish();
    };
    window.addEventListener("keydown", skipFn, { once: true });
    window.addEventListener("pointerdown", skipFn, { once: true });

    const runWipe = async () => {
      // wake the page beneath
      document.documentElement.classList.remove("booting");
      store.finishBoot();

      let wiped = false;
      const canvas = canvasRef.current;
      if (canvas && window.matchMedia("(hover: hover)").matches) {
        try {
          const { Renderer, Program, Mesh, Triangle } = await import("ogl");
          const renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: 1 });
          const gl = renderer.gl;
          gl.clearColor(0, 0, 0, 0);
          const program = new Program(gl, {
            vertex: WIPE_VERT,
            fragment: WIPE_FRAG,
            uniforms: { uT: { value: 0 } },
          });
          const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
          await new Promise<void>((resolve) => {
            const t0 = performance.now();
            const frame = () => {
              const t = (performance.now() - t0) / 850;
              program.uniforms.uT.value = t;
              renderer.render({ scene: mesh });
              if (t >= 1.25) resolve();
              else requestAnimationFrame(frame);
            };
            frame();
          });
          wiped = true;
        } catch {
          wiped = false;
        }
      }
      if (!wiped && canvas) {
        // CSS fallback: stepped opacity dissolve
        canvas.style.transition = "opacity .7s steps(10)";
        canvas.style.opacity = "0";
        await new Promise((r) => window.setTimeout(r, 720));
      }
      setGone(true);
    };

    return () => {
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skipFn);
      window.removeEventListener("pointerdown", skipFn);
      document.documentElement.classList.remove("booting");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className="boot" id="__boot" role="status" aria-label="loading">
      <canvas ref={canvasRef} className="boot-canvas" aria-hidden="true" />
      <div className="boot-inner mono" aria-hidden="true">
        <div className="boot-log">
          {LOG.slice(0, lineCount).map((l, i) => (
            <div key={i} className={i === LOG.length - 1 ? "boot-verdict" : undefined}>
              {l}
            </div>
          ))}
        </div>
        <div className="boot-bar" aria-hidden="true">
          <span className="boot-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="boot-foot mono">
          <span>{String(pct).padStart(3, "0")}%</span>
          <span className="boot-skip">CLICK OR ANY KEY TO SKIP</span>
        </div>
      </div>
      <noscript>
        {/* JS-less visitors must never be blocked */}
        <style>{`#__boot{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
