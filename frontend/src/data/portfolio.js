export const PROFILE = {
  name: "Alok Kumawat",
  location: "Jaipur, Rajasthan, India",
  shortLocation: "Jaipur, India",
  title: "Java Full Stack Developer",
  direction: "Cloud & DevOps",
  email: "alokkumawat2004@gmail.com",
  phoneDisplay: "+91 9782216089",
  phoneHref: "tel:+919782216089",
  github: "https://github.com/alokkumawat003",
  linkedin: "https://www.linkedin.com/in/alok-kumawat-342511250/",
  resume: "https://customer-assets-7cd3h4nn.emergentagent.net/job_devops-journey-alok/artifacts/ba8cth48_Alok%20Kumawat%20Resume.pdf",
};

export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "experience", label: "Journey" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const SKILL_GROUPS = [
  { number: "01", title: "Languages", value: ["Java", "JavaScript", "Python", "SQL", "HTML", "CSS"] },
  { number: "02", title: "Frameworks", value: ["Spring Boot", "JPA", "Hibernate"] },
  { number: "03", title: "Cloud & DevOps", value: ["AWS", "DevOps fundamentals"] },
  { number: "04", title: "Core concepts", value: ["OOP", "Data Structures", "Algorithms"] },
  { number: "05", title: "Tools", value: ["Git", "VS Code", "IntelliJ", "Eclipse", "Postman"] },
  { number: "06", title: "Data & APIs", value: ["MySQL", "REST APIs", "JSON"] },
];

export const EXPERIENCE = [
  {
    date: "May 2025 — Present",
    role: "Java Developer Intern",
    company: "8Bit Systems · Jaipur",
    points: [
      "Built a Spring Boot application for managing CVEs with USER / ADMIN access",
      "Designed layered architecture using DTOs, ModelMapper, and Repository patterns",
      "Implemented enum validation, nested JSON converters, and UUID generation",
      "Used Hibernate, MySQL, and JPA annotations for persistence and validation",
    ],
  },
  {
    date: "Jul 2024 — Aug 2024",
    role: "Java Developer Intern",
    company: "Anantics India Pvt. Ltd. · Jaipur",
    points: [
      "Collaborated on backend systems using Java, Spring Boot, and REST APIs",
      "Designed, managed, and optimized relational databases with MySQL",
      "Built and tested modules using object-oriented programming principles",
    ],
  },
  {
    date: "Aug 2023",
    role: "Web Developer Intern",
    company: "Zeetron Networks Pvt. Ltd. · Jaipur",
    points: [
      "Developed UIs using JavaScript frameworks, HTML5, and CSS3",
      "Pitched feature improvements and managed multiple fast-paced tasks",
      "Optimized performance through concurrency improvements",
    ],
  },
];

export const PROJECTS = [
  {
    number: "01",
    title: "Vulnerability Management System",
    description: "Spring Boot CVE tracker with role-based access, UUID generation, and JSON handling in MySQL.",
    technologies: ["Spring Boot", "MySQL"],
    type: "cve",
    repository: "https://github.com/alokkumawat003/Vulnerability_Management_System",
  },
  {
    number: "02",
    title: "Student Management System",
    description: "A focused management system built with Core Java and Advanced Java concepts.",
    technologies: ["Core Java", "OOP"],
    type: "student",
  },
  {
    number: "03",
    title: "Woodfinity E-Commerce Website",
    description: "A responsive storefront experience built with HTML, CSS, and JavaScript.",
    technologies: ["HTML", "CSS", "JavaScript"],
    type: "commerce",
  },
  {
    number: "04",
    title: "Budget Calculator",
    description: "A practical shop billing calculator system for quick, accurate everyday totals.",
    technologies: ["JavaScript", "HTML", "CSS"],
    type: "budget",
  },
];

export const EDUCATION = [
  { year: "2022 — 2026", title: "B.Tech, Computer Science and Engineering", school: "Poornima College of Engineering" },
  { year: "2022", title: "Class 12 · 72.40%", school: "NBF Public School" },
  { year: "2020", title: "Class 10 · 74.00%", school: "Aims Academy" },
];

export const SIGNALS = [
  { value: "3★", label: "CodeChef rating" },
  { value: "176+", label: "LeetCode problems solved" },
  { value: "2026", label: "Graduation year" },
];
