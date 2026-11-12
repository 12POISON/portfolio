"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// EASTER EGGS — typewriter buffers + Konami + triple-click clock (frame.tsx).
// whitejack5 → scramble + hero pulse · Konami → achievement ·
// 333 → trident · poison → alt-node terminal. Framer Motion owns these windows.

type EggId = "whitejack5" | "konami" | "333" | "poison" | "clock";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

const WINDOWS: Record<EggId, { title: string; body: React.ReactNode }> = {
  whitejack5: { title: "ego.egg", body: <p>HANDLE RECOGNIZED — the orb burns brighter. THE ONLY NAME ON THIS SITE IS THE ONE YOU TYPED.</p> },
  konami: { title: "achievement.log", body: <p>ACHIEVEMENT UNLOCKED — pull-shark ×2 · audit chain verified.</p> },
  "333": {
    title: "trident.txt",
    body: (
      <pre>{`   |   |   |
   |   |   |
   \\__ | __/
      | |
      | |
      | |
     /===\\`}</pre>
    ),
  },
  poison: {
    title: "alt_node.pid",
    body: (
      <pre>{`$ ssh alt_node@12POISON
> archvision-ai-uml lives here.
> the other account exists.`}</pre>
    ),
  },
  clock: { title: "clock.err", body: <p>ERROR 0x333 — time is a construct. Try measuring something better.</p> },
};

export default function EasterEggs() {
  const [egg, setEgg] = useState<EggId | null>(null);

  useEffect(() => {
    let buf = "";
    let seq: string[] = [];

    const fire = (id: EggId) => {
      setEgg(id);
      if (id === "whitejack5") {
        window.dispatchEvent(new CustomEvent("wj:scramble"));
      }
      window.setTimeout(() => setEgg((cur) => (cur === id ? null : cur)), 7000);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setEgg(null);
      if (e.key.length === 1) buf = (buf + e.key.toLowerCase()).slice(-24);
      else seq = [...seq, e.key].slice(-KONAMI.length);

      if (buf.endsWith("whitejack5")) {
        buf = "";
        fire("whitejack5");
      } else if (buf.endsWith("333")) {
        buf = "";
        fire("333");
      } else if (buf.endsWith("poison")) {
        buf = "";
        fire("poison");
      } else if (KONAMI.every((k, i) => seq[i] === k)) {
        seq = [];
        fire("konami");
      }
    };

    const onEgg = (e: Event) => fire((e as CustomEvent).detail as EggId);

    window.addEventListener("keydown", onKey);
    window.addEventListener("wj:egg", onEgg);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wj:egg", onEgg);
    };
  }, []);

  const win = egg ? WINDOWS[egg] : null;

  return (
    <AnimatePresence>
      {win && (
        <motion.div
          className="egg-window win"
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          role="alert"
          aria-live="assertive"
        >
          <div className="win-bar">
            <span className="win-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="mono win-title">{win.title}</span>
            <button type="button" className="mono hud-btn" data-hover onClick={() => setEgg(null)}>
              ×
            </button>
          </div>
          <div className="win-body mono egg-body">{win.body}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
