import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useHoverCapable } from "@/motionKit";

export default function CustomCursor() {
  const hoverCapable = useHoverCapable();
  const reduced = useReducedMotion();
  const enabled = hoverCapable && !reduced;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.32 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.32 });
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);
  const interactiveRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };
    const detect = (event) => {
      const nextInteractive = Boolean(event.target.closest("a,button,input,textarea,[role='button']"));
      if (nextInteractive !== interactiveRef.current) {
        interactiveRef.current = nextInteractive;
        setInteractive(nextInteractive);
      }
    };
    const hide = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", detect, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", detect);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-probe" style={{ x, y, opacity: visible ? 1 : 0 }} data-testid="custom-cursor-dot" />
      <motion.div
        className={`cursor-field ${interactive ? "is-interactive" : ""}`}
        style={{ x: smoothX, y: smoothY, opacity: visible ? 1 : 0 }}
        animate={{ scale: interactive ? 1.45 : 1 }}
        transition={{ duration: 0.28 }}
        aria-hidden="true"
      ><i /></motion.div>
    </>
  );
}
