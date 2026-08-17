import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Cloud, Code2, Download, GitBranch, MapPin, Send, Server, Terminal } from "lucide-react";
import { EASE, Magnetic, useHoverCapable } from "@/motionKit";

const ROLES = ["Java Full Stack Developer", "Aspiring DevOps Engineer", "Cloud Enthusiast"];
const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 1.5 } } };
const itemV = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } };
const lineV = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const charV = { hidden: { opacity: 0, y: "0.55em" }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };
const wordV = { hidden: { opacity: 0, y: "0.7em" }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

const Chars = ({ text, grad }) => text.split("").map((c, i) => (
  <motion.span className={`char ${grad ? "char-grad" : ""}`} variants={charV} key={`${c}-${i}`}>{c === " " ? "\u00A0" : c}</motion.span>
));
const Words = ({ text }) => text.split(" ").map((word, index) => (
  <motion.span className="word" variants={wordV} key={`${word}-${index}`}>{word}</motion.span>
));

const floaters = [
  { Icon: Cloud, className: "float-a", dur: 6 },
  { Icon: Code2, className: "float-b", dur: 7.4 },
  { Icon: Server, className: "float-c", dur: 5.4 },
  { Icon: GitBranch, className: "float-d", dur: 8.2 },
];

function useTypewriter(words) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (reduce) return undefined;
    let word = 0, char = words[0].length, deleting = false, timer;
    const tick = () => {
      const current = words[word];
      char += deleting ? -1 : 1;
      if (char > current.length) char = current.length;
      setText(current.slice(0, char));
      let delay = deleting ? 34 : 68;
      if (!deleting && char >= current.length) { deleting = true; delay = 1700; }
      else if (deleting && char === 0) { deleting = false; word = (word + 1) % words.length; delay = 380; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [reduce, words]);
  return text;
}

export default function Hero() {
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const parallaxOn = hoverCapable && !reduce;
  const typed = useTypewriter(ROLES);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const farX = useTransform(sx, (v) => v * 30);
  const farY = useTransform(sy, (v) => v * 22);
  const midX = useTransform(sx, (v) => v * -16);
  const midY = useTransform(sy, (v) => v * -12);

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section id="top" className="hero container" data-testid="hero-section" onMouseMove={parallaxOn ? onMove : undefined}>
      {floaters.map(({ Icon, className, dur }) => (
        <motion.span className={`float-el ${className}`} key={className} aria-hidden="true" animate={reduce ? undefined : { y: [0, -16, 0] }} transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}>
          <Icon size={17} />
        </motion.span>
      ))}
      <motion.div className="hero-copy" variants={containerV} initial="hidden" animate="show">
        <motion.div className="eyebrow" variants={itemV}><span className="status-dot" /> Available for full-time opportunities</motion.div>
        <motion.p className="hero-kicker" variants={itemV} data-testid="hero-typing-role">{typed}<span className="type-caret" /></motion.p>
        <motion.h1 data-testid="hero-heading" variants={lineV}>
          <Chars text="Alok" />{"\u00A0"}<Chars text="Kumawat" grad />
        </motion.h1>
        <motion.p className="hero-statement" variants={lineV}>
          <Words text="Building reliable systems" /><em><Words text="for the next layer." /></em>
        </motion.p>
        <motion.p className="hero-intro" variants={itemV} data-testid="hero-intro">I’m a Java Full Stack Developer transitioning into Cloud &amp; DevOps, with a bias for clean architecture and useful products.</motion.p>
        <motion.div className="hero-ctas" variants={itemV}>
          <Magnetic className="button button-primary" href="https://customer-assets-7cd3h4nn.emergentagent.net/job_devops-journey-alok/artifacts/ba8cth48_Alok%20Kumawat%20Resume.pdf" target="_blank" rel="noreferrer" data-testid="download-resume-button"><Download size={16} /> Download resume</Magnetic>
          <Magnetic className="button button-ghost" href="#contact" data-testid="hero-contact-button">Let’s connect <Send size={15} /></Magnetic>
        </motion.div>
        <motion.div className="hero-meta" variants={itemV}><span><MapPin size={14} /> Jaipur, Rajasthan</span><span><Terminal size={14} /> B.Tech CSE · 2026</span></motion.div>
      </motion.div>
      <motion.div className="hero-visual" aria-label="Cloud infrastructure illustration" data-testid="hero-visual" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 1.9, ease: EASE }}>
        <motion.div className="parallax-layer" style={{ x: farX, y: farY }}>
          <div className="orb orb-one" /><div className="orb orb-two" /><div className="grid-horizon" /><div className="network-line line-a" /><div className="network-line line-b" /><div className="network-line line-c" /><div className="network-node node-a" /><div className="network-node node-b" /><div className="network-node node-c" /><div className="network-node node-d" />
        </motion.div>
        <div className="terminal-card">
          <div className="terminal-top"><span className="traffic red" /><span className="traffic yellow" /><span className="traffic green" /><span className="terminal-title">alok@cloud: ~/journey</span></div>
          <div className="terminal-body"><p><span className="code-muted">01</span> <span className="code-purple">const</span> <span className="code-blue">focus</span> = [</p><p className="indent"><span className="code-green">&quot;build&quot;</span>, <span className="code-green">&quot;automate&quot;</span>,</p><p className="indent"><span className="code-green">&quot;ship with confidence&quot;</span></p><p>];</p><p className="terminal-prompt"><span>➜</span> <span className="code-blue">alok</span> <span className="cursor" /></p></div>
        </div>
        <motion.div className="parallax-layer" style={{ x: midX, y: midY }}>
          <div className="cloud-chip" data-testid="cloud-status-chip"><Cloud size={17} /><span>AWS / DevOps</span><b>↗</b></div><div className="live-chip" data-testid="systems-online-status"><span className="pulse-dot" /> Systems online <strong>99.9%</strong></div><div className="signal-card" data-testid="deployment-signal-card"><span>deployments</span><strong>24</strong><i><b /><b /><b /><b /><b /><b /><b /></i></div>
          <div className="infra-panel" data-testid="infrastructure-panel"><div className="infra-heading"><span>infra / overview</span><span className="infra-live"><i /> live</span></div><div className="infra-region"><Cloud size={14} /><span>ap-south-1</span><b>healthy</b></div><div className="infra-services"><span><i /> api-gateway</span><span><i /> cve-service</span><span><i /> mysql-db</span></div><div className="infra-meter"><span>pipeline health</span><b>87%</b><i><em /></i></div></div>
          <div className="command-ribbon" data-testid="command-ribbon"><span>➜</span> ship --env <b>production</b> <i>⌁</i></div>
        </motion.div>
        <div className="hero-scroll" data-testid="scroll-indicator"><ChevronDown size={16} /> scroll to explore</div>
      </motion.div>
    </section>
  );
}
