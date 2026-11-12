"use client";

// Live hero timestamp: /TS YYYY.MM.DD · HH:MM:SS, ticking every second.
// Hydration-safe: the server prints a neutral placeholder (it can never know
// the visitor's clock); the client fills it and keeps it perfectly in sync.

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function stamp(d: Date) {
  return `/TS ${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function LiveClock() {
  const [ts, setTs] = useState("/TS ----.--.-- · --:--:--");

  useEffect(() => {
    const tick = () => setTs(stamp(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{ts}</span>;
}
