import { useSyncExternalStore } from "react";

const SERVER_PROFILE = { tier: "low", reducedMotion: true, touch: false, dpr: 1 };

const readProfile = () => {
  if (typeof window === "undefined") return SERVER_PROFILE;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const compact = window.innerWidth < 860;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let tier = "high";
  if (reducedMotion || memory <= 2 || cores <= 2) tier = "low";
  else if (touch || compact || memory <= 4 || cores <= 6 || dpr > 1.75) tier = "medium";

  return { tier, reducedMotion, touch, dpr };
};

const sameProfile = (current, next) => (
  current.tier === next.tier
  && current.reducedMotion === next.reducedMotion
  && current.touch === next.touch
  && current.dpr === next.dpr
);

let snapshot = readProfile();
let frame = 0;
let teardown = null;
const listeners = new Set();

const refresh = () => {
  window.cancelAnimationFrame(frame);
  frame = window.requestAnimationFrame(() => {
    const next = readProfile();
    if (sameProfile(snapshot, next)) return;
    snapshot = next;
    listeners.forEach((listener) => listener());
  });
};

const start = () => {
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointerQuery = window.matchMedia("(pointer: coarse)");
  reducedQuery.addEventListener("change", refresh);
  pointerQuery.addEventListener("change", refresh);
  window.addEventListener("resize", refresh, { passive: true });
  refresh();

  return () => {
    window.cancelAnimationFrame(frame);
    reducedQuery.removeEventListener("change", refresh);
    pointerQuery.removeEventListener("change", refresh);
    window.removeEventListener("resize", refresh);
  };
};

const subscribe = (listener) => {
  listeners.add(listener);
  if (!teardown) teardown = start();
  return () => {
    listeners.delete(listener);
    if (!listeners.size && teardown) {
      teardown();
      teardown = null;
    }
  };
};

export default function usePerformanceProfile() {
  return useSyncExternalStore(subscribe, () => snapshot, () => SERVER_PROFILE);
}
