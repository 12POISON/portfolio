"use client";

import { useEffect, useRef, useState } from "react";
import { store, useMotionOn, useScrolled } from "@/lib/animation/motion-store";
import { OWNER } from "@/lib/content";

// Fixed viewport frame — 1px inset border with corner HUD.
// THE TOP-LEFT CORNER IS EMPTY BY DESIGN: no logo, no name, ever.
// Triple-click the clock → error easter egg.

const IST = "Asia/Kolkata";

export default function Frame() {
  const scrolled = useScrolled();
  const motionOn = useMotionOn();
  const [clock, setClock] = useState("--:--:--");
  const clicks = useRef<{ n: number; t: number }>({ n: 0, t: 0 });

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: IST,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date());
    fmt();
    const iv = window.setInterval(fmt, 1000);
    return () => window.clearInterval(iv);
  }, []);

  const onClock = () => {
    const now = Date.now();
    clicks.current = now - clicks.current.t < 600 ? { n: clicks.current.n + 1, t: now } : { n: 1, t: now };
    if (clicks.current.n >= 3) {
      clicks.current = { n: 0, t: 0 };
      window.dispatchEvent(new CustomEvent("wj:egg", { detail: "clock" }));
    }
  };

  const pct = String(Math.min(100, Math.round(scrolled * 100))).padStart(2, "0");

  return (
    <div className="hud-frame">
      {/* corner labels sit ON the border line; top-left stays empty on purpose */}

      <span className="hud-slot hud-tr">
        <button type="button" className="hud-btn mono" data-hover onClick={() => store.setMenu(true)}>
          INDEX +
        </button>
        <button
          type="button"
          className="hud-btn mono"
          data-hover
          aria-pressed={motionOn}
          onClick={() => store.toggleMotion()}
        >
          MOTION {motionOn ? "ON" : "OFF"}
        </button>
      </span>

      <span className="hud-slot hud-bl mono">
        <span>{OWNER.hud.coords}</span>
        <button type="button" className="hud-btn mono" data-hover onClick={onClock} aria-label="local time">
          IST {clock}
        </button>
        <span aria-hidden="true">{pct}%</span>
      </span>

      <span className="hud-slot hud-br mono">
        <span>{OWNER.hud.version}</span>
        <span>{OWNER.handle}</span>
      </span>
    </div>
  );
}
