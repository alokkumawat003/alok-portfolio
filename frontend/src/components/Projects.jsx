import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import { ChapterHeading, EASE, reveal, stagger, useHoverCapable, viewportOnce } from "@/motionKit";

const PROJECT_META = [
  { code: "SEC/CVE", build: "BACKEND SYSTEM" },
  { code: "SYS/EDU", build: "JAVA APPLICATION" },
  { code: "WEB/COM", build: "WEB EXPERIENCE" },
  { code: "TOOL/BUD", build: "UTILITY SYSTEM" },
];

function ArtifactScreen({ project }) {
  return (
    <div className={`artifact-screen artifact-${project.type}`} aria-hidden="true">
      <div className="artifact-screen-head"><span>AK//{project.number}</span><span>LIVE PREVIEW</span></div>
      {project.type === "cve" ? (
        <div className="cve-console">
          <span>CVE_ID</span><span>SEVERITY</span><span>STATE</span>
          <b>CVE-2025-01</b><i>HIGH</i><em>OPEN</em>
          <b>CVE-2025-02</b><i>MED</i><em>REVIEW</em>
          <b>CVE-2025-03</b><i>LOW</i><em>CLOSED</em>
        </div>
      ) : null}
      {project.type === "student" ? (
        <div className="student-console">
          <strong>STUDENT.REGISTRY</strong>
          <span><i>01</i><b>RECORD / ACTIVE</b></span>
          <span><i>02</i><b>RECORD / ACTIVE</b></span>
          <span><i>03</i><b>RECORD / ACTIVE</b></span>
        </div>
      ) : null}
      {project.type === "commerce" ? (
        <div className="commerce-console">
          <strong>WOODFINITY</strong>
          <div><i /><i /><i /></div>
          <span>CATALOG / RESPONSIVE</span>
        </div>
      ) : null}
      {project.type === "budget" ? (
        <div className="budget-console">
          <strong>TOTAL / ₹ 04,280</strong>
          <span>SUBTOTAL <b>₹ 03,950</b></span>
          <span>TAX <b>₹ 00,330</b></span>
          <i />
        </div>
      ) : null}
      <div className="artifact-screen-foot"><span>SYSTEM_READY</span><span>[DATA_STREAM]</span></div>
    </div>
  );
}

export default function Projects() {
  const hoverCapable = useHoverCapable();
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(-500);
  const pointerY = useMotionValue(-500);
  const smoothX = useSpring(pointerX, { stiffness: 240, damping: 28, mass: 0.34 });
  const smoothY = useSpring(pointerY, { stiffness: 240, damping: 28, mass: 0.34 });
  const [previewIndex, setPreviewIndex] = useState(null);

  const positionPreview = (event) => {
    if (!hoverCapable) return;
    const previewWidth = 332;
    const previewHeight = 226;
    pointerX.set(Math.min(event.clientX + 32, window.innerWidth - previewWidth - 18));
    pointerY.set(Math.max(18, Math.min(event.clientY - 78, window.innerHeight - previewHeight - 18)));
  };

  return (
    <section id="projects" className="chapter projects-runtime" data-testid="projects-section">
      <div className="chapter-frame container">
        <div className="projects-runtime-mast">
          <ChapterHeading
            number="04"
            eyebrow="Project archive / selected output"
            description="Four practical builds across backend security, Java systems, responsive commerce, and everyday tooling."
          >Project archive.<br />Built to solve.</ChapterHeading>
          <div className="archive-status" aria-hidden="true"><span>RECORDS</span><strong>04</strong><i /> <span>SCROLL / NATIVE</span></div>
        </div>

        <motion.div className="project-records" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {PROJECTS.map((project, index) => (
            <motion.article
              className="project-record"
              variants={reveal}
              key={project.title}
              data-testid={`project-${project.number}`}
              onPointerEnter={(event) => {
                if (!hoverCapable) return;
                setPreviewIndex(index);
                positionPreview(event);
              }}
              onPointerMove={positionPreview}
              onPointerLeave={() => setPreviewIndex(null)}
            >
              <div className="project-record-index"><span>{project.number}</span><i /></div>
              <div className="project-record-main">
                <p>{PROJECT_META[index].code} // {PROJECT_META[index].build}</p>
                <h3>{project.title}</h3>
                <ul aria-label={`${project.title} technologies`}>
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                <p className="project-record-description">{project.description}</p>
              </div>
              <div className="project-record-links">
                {project.repository ? (
                  <a href={project.repository} target="_blank" rel="noreferrer" data-testid={`project-github-${project.number}`}>
                    <Github size={15} /> REPOSITORY <ArrowUpRight size={14} />
                  </a>
                ) : <span>PRIVATE / LOCAL BUILD</span>}
                <a href="#contact" aria-label={`Ask about ${project.title}`} data-testid={`project-contact-${project.number}`}>
                  DISCUSS PROJECT <ArrowRight size={15} />
                </a>
              </div>
              <div className="project-inline-preview"><ArtifactScreen project={project} /></div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {hoverCapable && previewIndex !== null ? (
          <motion.div
            className="project-pointer-preview"
            style={{ x: smoothX, y: smoothY }}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.92, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0% 0 0)" }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.96, clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: reduced ? 0.12 : 0.32, ease: EASE }}
          >
            <ArtifactScreen project={PROJECTS[previewIndex]} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
