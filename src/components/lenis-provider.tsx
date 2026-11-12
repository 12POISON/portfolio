"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

// Lenis smooth scroll — desktop (hover + fine pointer) only, native on touch.
// RAF is owned by the ONE gsap.ticker; ScrollTrigger updates from Lenis events.

type LenisLike = {
  on: (event: string, cb: () => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
  scrollTo: (target: Element | number, options?: { offset?: number; duration?: number }) => void;
};

let cleanup: (() => void) | null = null;

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let destroyed = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 }) as LenisLike;
      (window as unknown as { __wjLenis?: LenisLike }).__wjLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        (window as unknown as { __wjLenis?: LenisLike }).__wjLenis = undefined;
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
      cleanup = null;
    };
  }, []);

  return <>{children}</>;
}
