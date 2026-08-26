import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/motionKit";

export default function IntroLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(!reduced);
  const [progress, setProgress] = useState(reduced ? 100 : 0);

  useEffect(() => {
    if (reduced) {
      setVisible(false);
      return undefined;
    }
    const start = performance.now();
    let frame = 0;
    let previous = -1;
    const tick = (now) => {
      const raw = Math.min(100, ((now - start) / 1250) * 100);
      const next = raw >= 100 ? 100 : Math.floor(raw / 4) * 4;
      if (next !== previous) {
        previous = next;
        setProgress(next);
      }
      if (next < 100) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    const timer = window.setTimeout(() => setVisible(false), 1420);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="field-loader"
          data-testid="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: 0.46, ease: EASE }}
        >
          <div className="loader-runtime-head"><span>AK//RUNTIME</span><span>PORTFOLIO.2026</span></div>
          <div className="loader-runtime-core"><b>BOOTING<br />INFRASTRUCTURE<br />WORLD</b><span>ALOK_KUMAWAT / {String(progress).padStart(3, "0")}%</span></div>
          <div className="loader-runtime-foot">
            <span>MEMORY / READY</span><span>ROUTES / MOUNTED</span><span>GRAPHICS / ADAPTIVE</span>
          </div>
          <span className="loader-track" data-testid="intro-progress"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.25, ease: "linear" }} /></span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
