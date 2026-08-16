import { Check, CloudCog } from "lucide-react";

const groups = [
  ["Languages", "HTML · CSS · JavaScript · Python · SQL · Java"],
  ["Frameworks", "Spring Boot"],
  ["Cloud & DevOps", "AWS · DevOps fundamentals", true],
  ["Core concepts", "OOP · Data Structures · Algorithms"],
  ["Tools", "Git · VS Code · IntelliJ · Eclipse · Postman"],
  ["Data & APIs", "MySQL · REST APIs · JPA / Hibernate"],
];

export default function Skills() {
  return <section id="skills" className="section section-tint" data-testid="skills-section"><div className="container"><div className="section-heading compact"><p className="section-index">02 / capabilities</p><h2>The stack behind<br /><span>the work.</span></h2></div><div className="skills-grid">{groups.map(([title, value, progress]) => <div className="skill-card" key={title} data-testid={`skill-${title.toLowerCase().replaceAll(" ", "-")}`}><div className="skill-top"><span>{title}</span>{progress ? <span className="progress-badge"><CloudCog size={13} /> In progress</span> : <Check size={16} />}</div><p>{value}</p>{progress && <div className="progress-line"><i /></div>}</div>)}</div></div></section>;
}