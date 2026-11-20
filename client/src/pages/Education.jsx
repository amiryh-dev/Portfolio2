import {
  GraduationCap,
  Languages,
  Cpu,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageIntro, Tag, ContactCta } from "../components/Layout";
import { usePortfolio } from "../context/PortfolioContext";

const qualificationIcons = { Cpu, Languages, BookOpen };

export default function Education() {
  const { navigation, qualifications, copy } = usePortfolio();
  const content = copy.education;
  return (
    <>
      <PageIntro
        number={navigation.find((item) => item.path === "/education").number}
        eyebrow={content.eyebrow}
        title={
          <>
            {content.title[0]}
            <br />
            <span>{content.title[1]}</span>
          </>
        }
      >
        {content.intro}
      </PageIntro>
      <div className="education-list">
        {qualifications.map((q, i) => (
          <article
            key={q.title}
            className={`education-card ${i === 0 ? "featured" : ""}`}
          >
            <div className="education-top">
              <span className="education-icon">
                {(() => {
                  const Icon = qualificationIcons[q.icon];
                  return Icon ? <Icon size={21} /> : null;
                })()}
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
          {content.learningNote}
        </p>
        <Link to="/projects" className="text-link">
          {content.learningLink}
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <ContactCta />
    </>
  );
}
