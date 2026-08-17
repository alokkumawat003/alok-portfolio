import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useHoverCapable } from "@/motionKit";

export default function CustomCursor() {
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const enabled = hoverCapable && !reduce;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 260, damping: 24 });
  const ry = useSpring(y, { stiffness: 260, damping: 24 });
  const [big, setBig] = useState(false);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setMoved(true); };
    const over = (e) => setBig(!!e.target.closest("a,button,input,textarea,[role='button']"));
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y, visibility: moved ? "visible" : "hidden" }} data-testid="custom-cursor-dot" />
      <motion.div className="cursor-ring" style={{ x: rx, y: ry, visibility: moved ? "visible" : "hidden" }} animate={{ scale: big ? 1.7 : 1, opacity: big ? 0.9 : 0.55 }} transition={{ duration: 0.25 }} />
    </>
  );
}
