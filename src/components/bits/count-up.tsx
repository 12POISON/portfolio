"use client";

import { useEffect, useRef } from "react";
import { countUp, onFirstView } from "@/lib/animation/micro";

// Stat figure: SSR prints the final value (SEO/no-JS), JS counts 0 → value once in view.
export default function CountUp({
  value,
  decimals = 0,
  className = "",
}: {
  value: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.count = value;
    el.dataset.countDecimals = String(decimals);
    const animated = () => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) countUp(el);
    };
    onFirstView(el, animated);
  }, [value, decimals]);

  return (
    <span ref={ref} className={className} data-count={value} data-count-decimals={decimals}>
      {value}
    </span>
  );
}
