import {
  GraduationCap,
  Languages,
  Cpu,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageIntro, Tag, ContactCta } from "../components/Layout";
const qualifications = [
  {
    title: "Software Engineering Technology — Artificial Intelligence",
    institution: "Centennial College · Toronto, Ontario",
    date: "September 2026 — Present",
    status: "In progress",
    icon: Cpu,
    description:
      "Fast-Track program, building on my software development experience with formal study in artificial intelligence, systems design, and applied mathematics.",
    subjects: [
      "Artificial Intelligence",
      "AI Systems Design",
      "Linear Algebra & Statistics",
      "Java Programming",
    ],
  },
  {
    title: "English for Academic Purposes",
    institution: "Centennial College · Toronto, Ontario",
    date: "Completed August 2026",
    status: "Completed",
    icon: Languages,
    description:
      "Academic communication, writing, and presentation skills for studying and collaborating in English.",
    subjects: [],
  },
  {
    title: "Bachelor’s · Computer Software",
    institution: "SAMA Technical and Vocational College · Quchan, Iran",
    date: "Completed",
    status: "Degree",
    icon: BookOpen,
    description: "Foundational studies in computer software and programming.",
    subjects: [],
  },
];
export default function Education() {
  return (
    <>
      <PageIntro
        number="04"
        eyebrow="EDUCATION & LEARNING"
        title={
          <>
            Built on experience.
            <br />
            <span>Growing through learning.</span>
          </>
        }
      >
        A foundation in engineering and software, with a new chapter in
        artificial intelligence.
      </PageIntro>
      <div className="education-list">
        {qualifications.map((q, i) => (
          <article
            key={q.title}
            className={`education-card ${i === 0 ? "featured" : ""}`}
          >
            <div className="education-top">
              <span className="education-icon">
                <q.icon size={21} />
              </span>
              <span className="qualification-status">{q.status}</span>
            </div>
            <p className="education-date">{q.date}</p>
            <h2>{q.title}</h2>
            <p className="institution">{q.institution}</p>
            <p className="education-description">{q.description}</p>
            {q.subjects.length > 0 && (
              <div className="tag-list">
                {q.subjects.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="learning-note">
        <p>
          Learning has always been part of the work: a new framework, a better
          architecture, or a clearer way to solve the problem.
        </p>
        <Link to="/projects" className="text-link">
          See it in practice
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <ContactCta />
    </>
  );
}
