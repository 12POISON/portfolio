"use client";

import { useEffect, useRef } from "react";
import { scrambleReveal, onFirstView } from "@/lib/animation/micro";

// SSR'd text; scrambles to itself on first view or on "wj:scramble".
export default function ScrambleText({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: string;
  className?: string;
  as?: "span" | "div";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      delete el.dataset.scrambled;
      el.dataset.scrambling = "0";
      scrambleReveal(el);
    };
    onFirstView(el, run);
    const onScramble = () => run();
    window.addEventListener("wj:scramble", onScramble);
    return () => {
      window.removeEventListener("wj:scramble", onScramble);
    };
  }, []);

  const T = Tag as "span";
  return (
    <T ref={ref as React.Ref<HTMLSpanElement>} className={className} data-scramble-text={children}>
      {children}
    </T>
  );
}
