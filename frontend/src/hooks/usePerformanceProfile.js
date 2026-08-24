import { useEffect, useState } from "react";

const readProfile = () => {
  if (typeof window === "undefined") {
    return { tier: "low", reducedMotion: true, touch: false, dpr: 1 };
  }

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

export default function usePerformanceProfile() {
  const [profile, setProfile] = useState(readProfile);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    let frame;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setProfile(readProfile()));
    };

    reducedQuery.addEventListener("change", update);
    pointerQuery.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      reducedQuery.removeEventListener("change", update);
      pointerQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return profile;
}
