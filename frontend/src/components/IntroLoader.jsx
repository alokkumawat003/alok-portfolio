import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/motionKit";

export default function IntroLoader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (reduce) { setShow(false); return undefined; }
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, [reduce]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="intro-loader" data-testid="intro-loader" exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: EASE }}>
          <div className="intro-stack">
            <motion.span className="intro-name" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: EASE }}>
              Alok<span>.</span>
            </motion.span>
            <span className="intro-track" data-testid="intro-progress">
              <motion.span className="intro-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.25, ease: "easeInOut" }} />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
