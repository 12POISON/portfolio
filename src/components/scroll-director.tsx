"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { director } from "@/lib/animation/director";

// The ONLY place GSAP narrative animation is mounted: one useGSAP scope,
// one director instance, full cleanup on unmount. Server children pass
// through untouched (SEO sees plain HTML; animation is layered on top).
export default function ScrollDirector({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      root.current && director.mount(root.current);
    },
    { scope: root }
  );

  useEffect(() => {
    // director.destroy() already unmounts everything on unmount
    return () => director.destroy();
  }, []);

  return <div ref={root}>{children}</div>;
}
