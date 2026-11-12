"use client";

// THE DIRECTOR — one TimelineManager for the whole site.
// Every chapter exports a builder registered here; ONE gsap.context scopes
// them all; one shared ticker (GSAP) drives Lenis + shaders elsewhere.
// The MOTION toggle / prefers-reduced-motion rebuild or settle everything.
// Node ownership rule: Framer Motion components never animate a node that a
// builder touches (menu overlay, toast, eggs are framer-only; these are gsap-only).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { store } from "./motion-store";
import { CHAPTERS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

type HudState = { chapterIdx: number };

class Director {
  private root: HTMLElement | null = null;
  private ctx: gsap.Context | null = null;
  private mm: gsap.MatchMedia | null = null;
  private unsub: (() => void) | null = null;
  private heroTl: gsap.core.Timeline | null = null;
  private hudState: HudState = { chapterIdx: -1 };

  mount(root: HTMLElement) {
    this.root = root;
    store.init();
    this.unsub = store.subscribe(() => this.sync());
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    this.onLoad = onLoad;
    this.rebuild();
  }

  private onLoad: (() => void) | null = null;

  destroy() {
    this.unsub?.();
    this.unsub = null;
    this.mm?.revert();
    this.mm = null;
    this.ctx?.revert();
    this.ctx = null;
    this.heroTl = null;
    this.root = null;
    if (this.onLoad) window.removeEventListener("load", this.onLoad);
    this.onLoad = null;
  }

  /** React to store changes (boot done, motion toggled, reduced-motion). */
  private sync() {
    if (!this.root) return;
    const built = !!this.ctx;
    if (store.active !== built) {
      this.rebuild();
      return;
    }
    if (store.booted && this.heroTl) this.heroTl.play();
  }

  private rebuild() {
    this.mm?.revert();
    this.ctx?.revert();
    this.heroTl = null;
    this.mm = null;
    this.ctx = null;
    if (!this.root) return;

    const active = store.active;
    const root = this.root;

    // Always-on: HUD scroll progress + chapter bursts (runs in every branch)
    const hud = () => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          store.setScrolled(self.progress);
          const idx = CHAPTERS.findLastIndex((c) => {
            const el = document.querySelector<HTMLElement>(`[data-chapter="${c.id}"]`);
            return !!el && el.getBoundingClientRect().top <= window.innerHeight * 0.5;
          });
          if (idx !== this.hudState.chapterIdx) {
            this.hudState.chapterIdx = idx;
            window.dispatchEvent(new CustomEvent("wj:chapter", { detail: CHAPTERS[idx]?.id ?? "hero" }));
          }
        },
      });
    };

    if (!active) {
      // settle: everything visible, no narrative triggers
      this.ctx = gsap.context(() => {
        gsap.set(root.querySelectorAll("[data-reveal],[data-hero-bit],[data-hero-img],[data-hero-frame]"), {
          clearProps: "transform,opacity,visibility",
          y: 0,
          opacity: 1,
          scale: 1,
        });
        hud();
      }, root);
      return;
    }

    this.ctx = gsap.context(() => {
      this.mm = gsap.matchMedia();
      this.mm.add(
        {
          desktop: "(min-width: 768px) and (hover: hover)",
          touch: "(max-width: 767px), (hover: none)",
        },
        (mmCtx) => {
          this.buildAll(!!(mmCtx.conditions as { desktop?: boolean }).desktop);
        }
      );
      hud();
    }, root);
  }

  private buildAll(desktop: boolean) {
    const root = this.root!;
    this.hero(root, desktop);
    for (const c of CHAPTERS) {
      if (c.id === "hero") continue;
      this.chapter(root, c.id);
    }
    this.chapter(root, "footer"); // footer isn't a numbered chapter but reveals the same way
    if (store.booted) this.heroTl?.play();
  }

  /* ── HERO ─────────────────────────────────────────────────────────── */
  private hero(root: HTMLElement, _desktop: boolean) {
    const chapter = root.querySelector<HTMLElement>('[data-chapter="hero"]');
    if (!chapter) return;
    const img = chapter.querySelector<HTMLElement>("[data-hero-img]");
    const frame = chapter.querySelector<HTMLElement>("[data-hero-frame]");
    const bits = [...chapter.querySelectorAll<HTMLElement>("[data-hero-bit]")];

    const tl = gsap.timeline({ paused: true });
    if (img) {
      tl.from(img, { opacity: 0, duration: 1.1, ease: "steps(8)", delay: 0.15 }, 0).from(
        img,
        { y: 26, duration: 0.9, ease: "power3.out" },
        0
      );
    }
    if (frame) {
      tl.from(frame, { scaleX: 0, transformOrigin: "left center", duration: 0.55, ease: "power2.inOut" }, 0.35).from(
        frame,
        { scaleY: 0, transformOrigin: "center top", duration: 0.45, ease: "power2.inOut" },
        0.55
      );
    }
    tl.from(
      bits,
      { opacity: 0, y: 14, duration: 0.5, ease: "power3.out", stagger: 0.1 },
      0.7
    );
    this.heroTl = tl;
  }

  /* ── GENERIC CHAPTER (who / work / commits / toolbox / log / life / signal) ── */
  private chapter(root: HTMLElement, id: string) {
    const chapter = root.querySelector<HTMLElement>(`[data-chapter="${id}"]`);
    if (!chapter) return;

    const targets = chapter.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length) {
      gsap.from(targets, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: chapter, start: "top 92%", once: true },
      });
    }
    const rules = chapter.querySelectorAll<HTMLElement>("[data-rule]");
    if (rules.length) {
      gsap.from(rules, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.7,
        ease: "power2.inOut",
        stagger: 0.08,
        scrollTrigger: { trigger: chapter, start: "top 88%", once: true },
      });
    }
  }
}

export const director = new Director();
