"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { store, useMenuOpen } from "@/lib/animation/motion-store";
import { CHAPTERS, OWNER } from "@/lib/content";

// MENU OVERLAY — FRAMER MOTION TERRITORY (component micro-interaction; GSAP is
// never given these nodes). Escape / backdrop close; anchor-jump via Lenis.

export default function MenuOverlay() {
  const open = useMenuOpen();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && store.setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  const go = (id: string) => {
    store.setMenu(false);
    const el = document.querySelector(`[data-chapter="${id}"]`);
    if (!el) return;
    const lenis = (window as unknown as { __wjLenis?: { scrollTo: (t: Element, o?: object) => void } }).__wjLenis;
    lenis?.scrollTo(el, { offset: -10, duration: 1.2 }) ?? el.scrollIntoView();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label="chapter index"
        >
          <motion.div
            className="menu-panel win"
            initial={{ y: 18, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ y: 12, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="win-bar">
              <span className="win-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="mono win-title">index.exe — chapter map</span>
              <button type="button" className="mono hud-btn" data-hover onClick={() => store.setMenu(false)}>
                CLOSE ×
              </button>
            </div>
            <nav className="menu-body" aria-label="chapters">
              {CHAPTERS.map((c, i) => (
                <motion.button
                  key={c.id}
                  type="button"
                  className="menu-row"
                  data-hover
                  onClick={() => go(c.id)}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.06 + i * 0.035, duration: 0.3 }}
                >
                  <span className="mono menu-num">{c.num}</span>
                  <span className="serif menu-title">{c.title}</span>
                  <span className="mono menu-arrow" aria-hidden="true">
                    ↘
                  </span>
                </motion.button>
              ))}
            </nav>
            <div className="menu-foot mono">
              <span>{OWNER.handle}</span>
              <span>{OWNER.hud.coords}</span>
              <span>{OWNER.hud.version}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
