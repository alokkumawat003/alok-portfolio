import { motion } from "framer-motion";
import { SKILL_GROUPS } from "@/data/portfolio";
import { ChapterHeading, reveal, stagger, viewportOnce } from "@/motionKit";

let skillIndex = 0;
const INDEXED_GROUPS = SKILL_GROUPS.map((group) => ({
  ...group,
  values: group.value.map((value) => ({
    value,
    address: `0x${(skillIndex++).toString(16).padStart(2, "0")}`,
  })),
}));

export default function Skills() {
  return (
    <section id="skills" className="chapter skills-runtime" data-scene="skills" data-testid="skills-section">
      <div className="chapter-frame container">
        <ChapterHeading
          number="02"
          eyebrow="Capability register"
          description="The technologies I use, organized as an addressable engineering directory. Every sector below is part of my working skill set."
        >Technical sectors.<br />One working stack.</ChapterHeading>

        <motion.div className="skill-register" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <motion.div className="skill-register-head" variants={reveal} aria-hidden="true">
            <span>SECTOR</span><span>CAPABILITY</span><span>ADDRESSABLE SKILLS</span><span>COUNT</span>
          </motion.div>

          {INDEXED_GROUPS.map((group) => (
            <motion.article className="skill-sector" variants={reveal} key={group.title} data-testid={`skill-${group.title.toLowerCase().replaceAll(" ", "-")}`}>
              <div className="skill-sector-code"><span>SECTOR_{group.number}</span><i /></div>
              <h3>{group.title}</h3>
              <ul>
                {group.values.map(({ value, address }) => (
                  <li key={value}><span>{address}</span><b>{value}</b></li>
                ))}
              </ul>
              <strong>{String(group.values.length).padStart(2, "0")}</strong>
            </motion.article>
          ))}
        </motion.div>

        <div className="skill-register-foot" aria-hidden="true">
          <span>REGISTER_END</span><i /><span>STATUS / READY</span>
        </div>
      </div>
    </section>
  );
}
