"use client";

import { motion } from "motion/react";

// Footer back-to-top styled as a window control; rides Lenis when present.

type LenisLike = { scrollTo: (target: number, options?: { duration?: number }) => void };

export default function BackToTop() {
  const up = () => {
    const l = (window as unknown as { __wjLenis?: LenisLike }).__wjLenis;
    l?.scrollTo(0, { duration: 1.4 }) ?? window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <motion.button
      type="button"
      className="top-btn mono"
      data-hover
      onClick={up}
      whileTap={{ scale: 0.96 }}
      aria-label="back to top"
    >
      ▲ TOP
    </motion.button>
  );
}
