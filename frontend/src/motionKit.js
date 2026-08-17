import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export const useHoverCapable = () => {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCapable(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return capable;
};

export const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } } };
export const fadeUp = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } };
export const viewportOnce = { once: true, amount: 0.18 };

export function SectionHeading({ index, compact, children }) {
  return (
    <motion.div className={`section-heading ${compact ? "compact" : ""}`} variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <motion.p className="section-index" variants={fadeUp}>{index}</motion.p>
      <motion.h2 variants={fadeUp}>{children}</motion.h2>
      <motion.span className="heading-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewportOnce} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }} />
    </motion.div>
  );
}

export function Magnetic({ as = "a", className = "", children, strength = 0.22, ...rest }) {
  const ref = useRef(null);
  const capable = useHoverCapable();
  const reduce = useReducedMotion();
  const enabled = capable && !reduce;
  const Comp = as;
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <Comp ref={ref} className={`magnetic ${className}`} onMouseMove={enabled ? onMove : undefined} onMouseLeave={enabled ? onLeave : undefined} {...rest}>
      {children}
    </Comp>
  );
}
