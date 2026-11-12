"use client";

// SINGLE SOURCE OF TRUTH for motion state.
// GSAP (director.ts), Framer Motion components, the shader loop and the HUD all
// read from this store. One owner per concern — no component decides alone.

type Listener = () => void;

const MOTION_KEY = "wj.motion";
const BOOT_KEY = "wj.booted";

class Store {
  motionOn = true;
  reduceMotion = false;
  scrolled = 0; // page scroll progress 0..1
  menuOpen = false;
  booted = false;

  private listeners = new Set<Listener>();

  init() {
    if (typeof window === "undefined") return;
    if (this._initialized) return;
    this._initialized = true;
    try {
      this.motionOn = localStorage.getItem(MOTION_KEY) !== "off";
    } catch {
      /* private mode */
    }
    if (sessionStorage.getItem(BOOT_KEY)) this.booted = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduceMotion = mq.matches;
    mq.addEventListener?.("change", (e) => {
      this.reduceMotion = e.matches;
      this.emit();
    });
  }

  private _initialized = false;

  /** Effective animation permission. */
  get active() {
    return this.motionOn && !this.reduceMotion;
  }

  toggleMotion() {
    this.motionOn = !this.motionOn;
    try {
      localStorage.setItem(MOTION_KEY, this.motionOn ? "on" : "off");
    } catch {
      /* ignore */
    }
    this.emit();
  }

  setMenu(open: boolean) {
    this.menuOpen = open;
    this.emit();
  }

  setScrolled(v: number) {
    const nv = Math.max(0, Math.min(1, v));
    if (Math.abs(nv - this.scrolled) > 0.01) {
      this.scrolled = nv;
      this.emit();
    }
  }

  finishBoot() {
    this.booted = true;
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* ignore */
    }
    this.emit();
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  private emit() {
    for (const fn of [...this.listeners]) fn();
  }
}

export const store = new Store();

// stable module-level subscribe for useSyncExternalStore
import { useSyncExternalStore } from "react";

export function useStore<T>(select: (s: Store) => T, serverValue: T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => select(store),
    () => serverValue
  );
}

export const useMotionOn = () => useStore((s) => s.active, true);
export const useScrolled = () => useStore((s) => s.scrolled, 0);
export const useMenuOpen = () => useStore((s) => s.menuOpen, false);
export const useBooted = () => useStore((s) => s.booted, false);
