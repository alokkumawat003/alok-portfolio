import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/motionKit";

export default function IntroLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(!reduced);

  useEffect(() => {
    if (reduced) {
      setVisible(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setVisible(false), 820);
    return () => window.clearTimeout(timer);
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
          <div className="loader-runtime-core"><b>BOOTING<br />IDENTITY<br />SYSTEM</b><span>ALOK_KUMAWAT</span></div>
          <div className="loader-runtime-foot">
            <span>MEMORY / READY</span><span>ROUTES / MOUNTED</span><span>GRAPHICS / ADAPTIVE</span>
          </div>
          <span className="loader-track" data-testid="intro-progress"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.68, ease: EASE }} /></span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
