import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { PROFILE } from "@/data/portfolio";
import { EASE, Magnetic, useHoverCapable } from "@/motionKit";

const STACK_NODES = ["JAVA", "SPRING BOOT", "MYSQL", "AWS", "GIT", "REST API"];

function StackMachine({ machineRef }) {
  return (
    <div className="stack-machine-stage" aria-hidden="true">
      <div className="machine-coordinates"><span>X / 075.7873</span><span>Y / 026.9124</span></div>
      <div className="stack-machine" ref={machineRef}>
        <span className="machine-plane plane-back" />
        <span className="machine-plane plane-mid" />
        <span className="machine-plane plane-front" />
        <span className="machine-spine spine-x" />
        <span className="machine-spine spine-y" />
        <div className="machine-core">
          <small>PRIMARY RUNTIME</small>
          <strong>JAVA</strong>
          <span>FULL_STACK / ACTIVE</span>
        </div>
        <div className="machine-sidecar"><i>AK</i><span>BUILD<br />SYSTEMS</span></div>
        {STACK_NODES.map((node, index) => <b className={`machine-node node-${index + 1}`} key={node}>{node}</b>)}
      </div>
      <div className="machine-readout">
        <span>NODE_AK // ONLINE</span>
        <span>INPUT / POINTER</span>
        <span>FRAME / ADAPTIVE</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const machineRef = useRef(null);
  const frameRef = useRef(0);
  const reduced = useReducedMotion();
  const hoverCapable = useHoverCapable();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -115]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.58, 0]);
  const machineY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 86]);

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), []);

  const moveMachine = (event) => {
    if (!hoverCapable || reduced || !machineRef.current) return;
    const bounds = sectionRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      machineRef.current?.style.setProperty("--machine-rx", `${-y * 9}deg`);
      machineRef.current?.style.setProperty("--machine-ry", `${x * 13}deg`);
    });
  };

  const resetMachine = () => {
    if (!machineRef.current) return;
    machineRef.current.style.setProperty("--machine-rx", "-2deg");
    machineRef.current.style.setProperty("--machine-ry", "-5deg");
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-runtime"
      data-testid="hero-section"
      onPointerMove={moveMachine}
      onPointerLeave={resetMachine}
    >
      <div className="hero-runtime-rail" aria-hidden="true"><span>00</span><i /><span>IDENTITY PROCESS</span></div>

      <motion.div className="hero-machine-wrap" style={{ y: machineY }}>
        <StackMachine machineRef={machineRef} />
      </motion.div>

      <motion.div className="hero-runtime-title" style={{ y: titleY, opacity: titleOpacity }}>
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
        >[ JAVA FULL STACK DEVELOPER ]</motion.p>
        <h1 data-testid="hero-heading" aria-label="Alok Kumawat">
          <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.12, duration: 1, ease: EASE }}>ALOK</motion.span>
          <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.22, duration: 1, ease: EASE }}>KUMAWAT</motion.span>
        </h1>
      </motion.div>

      <motion.div
        className="hero-info-log"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.72, duration: 0.8, ease: EASE }}
      >
        <span>[ INFO_LOG ]</span>
        <p data-testid="hero-intro">I build Java-backed web systems with Spring Boot, MySQL, REST APIs, Cloud, and DevOps foundations.</p>
      </motion.div>

      <motion.dl
        className="hero-metadata"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.78, duration: 0.8, ease: EASE }}
      >
        <div><dt>CORE_ID</dt><dd>{PROFILE.title}</dd></div>
        <div><dt>LOCATION</dt><dd>{PROFILE.shortLocation}</dd></div>
        <div><dt>DOMAIN</dt><dd>{PROFILE.direction}</dd></div>
        <div><dt>STATUS</dt><dd><i /> OPEN TO FULL-TIME</dd></div>
      </motion.dl>

      <motion.div
        className="hero-runtime-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.84, duration: 0.8, ease: EASE }}
      >
        <Magnetic href="#projects" className="runtime-action is-primary" data-testid="hero-projects-button">
          OPEN PROJECT ARCHIVE <ArrowUpRight size={15} />
        </Magnetic>
        <Magnetic href={PROFILE.resume} target="_blank" rel="noreferrer" className="runtime-action" data-testid="download-resume-button">
          RESUME.PDF <Download size={14} />
        </Magnetic>
      </motion.div>

      <div className="hero-stack-tape" aria-label="Core technologies">
        <span>ACTIVE STACK</span>
        <div>{STACK_NODES.map((node) => <i key={node}>{node}</i>)}</div>
      </div>

      <a href="#about" className="hero-enter" aria-label="Enter the portfolio" data-testid="scroll-indicator">
        <span>ENTER SYSTEM</span><ArrowDown size={14} />
      </a>
    </section>
  );
}
