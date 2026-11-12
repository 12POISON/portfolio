"use client";

import { useEffect, useRef } from "react";
import { useMotionOn } from "@/lib/animation/motion-store";

// Custom cursor — ONE 1-bit crosshair (two bars + center tick), mix-blend
// difference so it inverts over whatever it crosses. Desktop (hover + fine)
// only. No trail, no tile, no follower lag. MOTION OFF → system cursor.

export default function Cursor() {
  const motionOn = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!ok || !motionOn) return;

    document.documentElement.classList.add("cursor-on");
    let x = -100, y = -100, cx = -100, cy = -100, hot = false, seen = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as Element | null;
      hot = !!el?.closest?.("[data-hover],a,button,input,textarea,select");
      if (!seen) {
        seen = true;
        cx = x;
        cy = y;
        ref.current?.classList.add("cursor-live");
      }
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      cx += (x - cx) * 0.5; // near-instant; just enough to kill jitter
      cy += (y - cy) * 0.5;
      if (ref.current) {
        ref.current.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%) rotate(${hot ? 45 : 0}deg) scale(${hot ? 1.5 : 1})`;
      }
    };
    loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("cursor-on");
    };
  }, [motionOn]);

  return <div ref={ref} className="cursor-x" aria-hidden="true" />;
}
