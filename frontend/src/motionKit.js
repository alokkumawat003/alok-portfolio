import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];
export const viewportOnce = { once: true, amount: 0.16 };

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
};

export const useHoverCapable = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.06 } },
};

export function ChapterHeading({ number, eyebrow, children, description, align = "left" }) {
  return (
    <motion.header
      className={`chapter-heading is-${align}`}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <motion.div className="chapter-coordinate" variants={reveal}>
        <span>{number}</span>
        <i />
        <span>{eyebrow}</span>
      </motion.div>
      <motion.h2 variants={reveal}>{children}</motion.h2>
      {description ? <motion.p variants={reveal}>{description}</motion.p> : null}
    </motion.header>
  );
}

export function Magnetic({ as = "a", className = "", children, strength = 0.14, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const enabled = hoverCapable && !reduce;
  const Component = as;

  const onMove = (event) => {
    const element = ref.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      element.style.setProperty("--magnet-x", `${(x - bounds.width / 2) * strength}px`);
      element.style.setProperty("--magnet-y", `${(y - bounds.height / 2) * strength}px`);
      element.style.setProperty("--glow-x", `${x}px`);
      element.style.setProperty("--glow-y", `${y}px`);
    });
  };

  const onLeave = () => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--magnet-x", "0px");
    element.style.setProperty("--magnet-y", "0px");
  };

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  return (
    <Component
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={enabled ? onMove : undefined}
      onPointerLeave={enabled ? onLeave : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}
