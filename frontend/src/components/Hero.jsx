import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { PROFILE } from "@/data/portfolio";
import { EASE, Magnetic } from "@/motionKit";

const STACK_NODES = ["AWS", "DEVOPS", "GIT", "JAVA", "SPRING BOOT", "MYSQL"];

export default function Hero() {
  return (
    <section id="top" className="hero-runtime" data-scene="top" data-testid="hero-section">
      <div className="hero-runtime-rail" aria-hidden="true"><span>00</span><i /><span>INFRASTRUCTURE ORIGIN</span></div>

      <motion.div className="hero-runtime-title">
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }}>
          [ CLOUD &amp; DEVOPS ENGINEER ]
        </motion.p>
        <h1 data-testid="hero-heading" aria-label="Alok Kumawat">
          <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.12, duration: 1, ease: EASE }}>ALOK</motion.span>
          <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.22, duration: 1, ease: EASE }}>KUMAWAT</motion.span>
        </h1>
      </motion.div>

      <div className="hero-world-labels" aria-hidden="true">
        <span>ORBITAL NODE / AK-01</span><span>UPTIME / 99.99</span><span>REGION / AP-SOUTH</span>
      </div>

      <motion.div className="hero-info-log" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.8, ease: EASE }}>
        <span>[ INFO_LOG ]</span>
        <p data-testid="hero-intro">I build cloud-ready systems by combining AWS and DevOps practices with a Java, Spring Boot, MySQL, and REST API foundation.</p>
      </motion.div>

      <motion.dl className="hero-metadata" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.78, duration: 0.8, ease: EASE }}>
        <div><dt>CORE_ID</dt><dd>{PROFILE.title}</dd></div>
        <div><dt>LOCATION</dt><dd>{PROFILE.shortLocation}</dd></div>
        <div><dt>DOMAIN</dt><dd>{PROFILE.direction}</dd></div>
        <div><dt>STATUS</dt><dd><i /> OPEN TO FULL-TIME</dd></div>
      </motion.dl>

      <motion.div className="hero-runtime-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.84, duration: 0.8, ease: EASE }}>
        <Magnetic href="#projects" className="runtime-action is-primary" data-testid="hero-projects-button">OPEN PROJECT ARCHIVE <ArrowUpRight size={15} /></Magnetic>
        <Magnetic href={PROFILE.resume} target="_blank" rel="noreferrer" className="runtime-action" data-testid="download-resume-button">RESUME.PDF <Download size={14} /></Magnetic>
      </motion.div>

      <div className="hero-stack-tape" aria-label="Core technologies">
        <span>ACTIVE STACK</span><div>{STACK_NODES.map((node) => <i key={node}>{node}</i>)}</div>
      </div>

      <div className="hero-chapter-preview" aria-hidden="true">
        <span>01 / IDENTITY</span><span>02 / CAPABILITY</span><span>03 / JOURNEY</span><span>04 / WORK</span><i />
      </div>

      <a href="#about" className="hero-enter" aria-label="Enter the portfolio" data-testid="scroll-indicator"><span>ENTER SYSTEM</span><ArrowDown size={14} /></a>
    </section>
  );
}
