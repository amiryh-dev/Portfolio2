import { Link } from "react-router-dom";
import { Download, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import {
  PageIntro,
  SectionHeading,
  Tag,
  ContactCta,
} from "../components/Layout";
export default function About() {
  const { profile, navigation, experience, skillGroups, copy } = usePortfolio();
  const content = copy.about;
  return (
    <>
      <PageIntro
        number={navigation.find((item) => item.path === "/about").number}
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
      <div className="about-profile">
        <figure className="portrait-frame">
          <img
            src={profile.portrait}
            alt={profile.portraitAlt}
            width="360"
            height="430"
          />
        </figure>
        <div className="prose-copy">
          <p>{content.paragraphs[0]}</p>
          <p>{content.paragraphs[1]}</p>
          <a className="button-secondary mt-5" href={profile.resume} download>
            <Download size={17} />
            Download resume<span className="text-xs text-muted">PDF</span>
          </a>
        </div>
      </div>
      <div className="prose-copy mt-8">
        <p>{content.paragraphs[2]}</p>
        <p>
          {content.personalIntro}{" "}
          <a href={profile.youtube} target="_blank" rel="noreferrer">
            {content.personalLinkLabel}
            <ArrowUpRight className="inline ml-1" size={13} />
          </a>
          {content.personalOutro}
        </p>
      </div>
      <section className="section-block">
        <SectionHeading label={content.experienceHeading} />
        <div className="timeline">
          {experience.map((job, i) => (
            <article key={job.company} className="timeline-item">
              <span className={`timeline-dot ${i === 0 ? "current" : ""}`} />
              <p className="timeline-date">{job.dates}</p>
              <h3>{job.title}</h3>
              <p className="timeline-company">{job.company}</p>
              <p className="timeline-detail">{job.detail}</p>
              <div className="tag-list">
                {job.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="canadian-experience">
          <p className="eyebrow">{content.canadianExperience.eyebrow}</p>
          <h3>{content.canadianExperience.title}</h3>
          <p>{content.canadianExperience.description}</p>
        </div>
      </section>
      <section className="section-block">
        <SectionHeading label={content.skillsHeading} />
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              <div className="tag-list">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <ContactCta />
    </>
  );
}
