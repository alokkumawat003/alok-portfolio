import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import { ChapterHeading, reveal, stagger, viewportOnce } from "@/motionKit";

const PROJECT_META = [
  { code: "SEC/CVE", build: "BACKEND SECURITY SYSTEM", glyph: "CVE" },
  { code: "SYS/EDU", build: "JAVA RECORD SYSTEM", glyph: "DB" },
  { code: "WEB/COM", build: "RESPONSIVE COMMERCE", glyph: "WEB" },
  { code: "TOOL/BUD", build: "EVERYDAY UTILITY", glyph: "₹" },
];

function ProjectSchematic({ project, meta }) {
  return (
    <div className={`project-schematic schematic-${project.type}`} aria-hidden="true">
      <div className="schematic-orbit"><i /><i /><i /></div>
      <span className="schematic-code">AK//{project.number}</span>
      <strong>{meta.glyph}</strong>
      <div className="schematic-data"><span>INPUT</span><i /><span>OUTPUT</span></div>
      <p>{meta.build}</p>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="chapter projects-runtime" data-scene="projects" data-testid="projects-section">
      <div className="chapter-frame container">
        <div className="projects-runtime-mast">
          <ChapterHeading number="04" eyebrow="Project gateways / selected output" description="Four practical systems. Scroll through each gateway to move deeper into the archive.">
            Work that moves<br />from logic to use.
          </ChapterHeading>
          <div className="archive-status" aria-hidden="true"><span>GATEWAYS</span><strong>04</strong><i /><span>NATIVE SCROLL</span></div>
        </div>

        <motion.div className="project-gateways" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {PROJECTS.map((project, index) => (
            <motion.article className="project-gateway" variants={reveal} key={project.title} data-project-scene={index} data-testid={`project-${project.number}`}>
              <div className="project-gateway-index"><span>{project.number}</span><i /><p>{PROJECT_META[index].code}</p></div>
              <div className="project-gateway-copy">
                <p className="project-build-type">{PROJECT_META[index].build}</p>
                <h3>{project.title}</h3>
                <p className="project-gateway-description">{project.description}</p>
                <ul aria-label={`${project.title} technologies`}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                <div className="project-gateway-links">
                  {project.repository ? (
                    <a href={project.repository} target="_blank" rel="noreferrer" data-testid={`project-github-${project.number}`}><Github size={15} /> REPOSITORY <ArrowUpRight size={14} /></a>
                  ) : <span>PRIVATE / LOCAL BUILD</span>}
                  <a href="#contact" aria-label={`Ask about ${project.title}`} data-testid={`project-contact-${project.number}`}>DISCUSS PROJECT <ArrowRight size={15} /></a>
                </div>
              </div>
              <ProjectSchematic project={project} meta={PROJECT_META[index]} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
