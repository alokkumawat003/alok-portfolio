import { useEffect, useState } from "react";

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
export const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };
export const viewportOnce = { once: true, amount: 0.18 };
