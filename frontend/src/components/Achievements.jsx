import { motion } from "framer-motion";
import { reveal, stagger, viewportOnce } from "@/motionKit";

const signals = [
  { value: "3★", label: "CodeChef rating", testId: "codechef-stat" },
  { value: "176+", label: "LeetCode problems solved", testId: "leetcode-stat" },
  { value: "2026", label: "B.Tech graduation year" },
];

export default function Achievements() {
  return (
    <section id="achievements" className="signal-runtime" data-testid="achievements-section">
      <motion.div className="container signal-runtime-inner" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <motion.header variants={reveal}><span>06 / SIGNAL ARRAY</span><h2>Measured progress.</h2></motion.header>
        {signals.map(({ value, label, testId }, index) => (
          <motion.div variants={reveal} key={label}>
            <span>READING_0{index + 1}</span>
            <strong data-testid={testId}>{value}</strong>
            <p>{label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
