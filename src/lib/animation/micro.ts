"use client";

// MICRO-INTERACTION PACK — imported, never copy-pasted.
// anime.js owns text micro-animation (scramble, per-char rise);
// GSAP owns count-ups (numbers need precision + ease control).
// transform/opacity only. Idempotent via dataset flags.

import { animate, stagger } from "animejs";
import gsap from "gsap";

const GLYPHS = "▓▒░#@%&/\\|=+*<>-_01AJXK";

/** Scramble-in a text element on first view (or on the "wj:scramble" event). */
export function scrambleReveal(el: HTMLElement, ms = 380) {
  const text = (el.dataset.scrambleText ??= el.textContent ?? "");
  if (el.dataset.scrambling === "1") return;
  el.dataset.scrambling = "1";
  el.textContent = "";

  const spans = [...text].map((c) => {
    const s = document.createElement("span");
    s.textContent = c === " " ? "\u00A0" : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    s.style.display = "inline-block";
    s.style.opacity = "0";
    el.append(s);
    return { s, c };
  });

  let frame = 0;
  const total = Math.max(8, Math.ceil(ms / 16));
  const iv = window.setInterval(() => {
    frame++;
    const k = Math.floor((frame / total) * text.length) + 2;
    spans.forEach(({ s, c }, i) => {
      s.style.opacity = "1";
      s.textContent = i < k ? (c === " " ? "\u00A0" : c) : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    });
    if (frame >= total) {
      window.clearInterval(iv);
      spans.forEach(({ s, c }) => (s.textContent = c === " " ? "\u00A0" : c));
      el.dataset.scrambling = "0";
    }
  }, 16);

  animate(
    spans.map(({ s }) => s),
    { translateY: ["0.25em", "0em"], duration: 420, ease: "out(3)", delay: stagger(8) }
  );
}

/** Count-up on [data-count] elements (anime-grade precision without the debate). */
export function countUp(el: HTMLElement) {
  if (el.dataset.counted === "1") return;
  el.dataset.counted = "1";
  const target = parseFloat(el.dataset.count ?? "0");
  const decimals = parseInt(el.dataset.countDecimals ?? "0", 10) || 0;
  const obj = { v: 0 };
  el.textContent = (0).toFixed(decimals);
  gsap.to(obj, {
    v: target,
    duration: 1.2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = obj.v.toFixed(decimals);
    },
  });
}

/** Trigger any [data-micro] element once on first intersection. */
export function onFirstView(el: HTMLElement, fn: () => void) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        fn();
      }
    },
    { threshold: 0.35 }
  );
  io.observe(el);
}
