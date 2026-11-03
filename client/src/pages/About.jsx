import { Link } from "react-router-dom";
import { Download, ArrowUpRight } from "lucide-react";
import { profile, experience, skillGroups } from "../data/portfolio";
import {
  PageIntro,
  SectionHeading,
  Tag,
  ContactCta,
} from "../components/Layout";
export default function About() {
  return (
    <>
      <PageIntro
        number="02"
        eyebrow="ABOUT ME"
        title={
          <>
            A developer.
            <br />
            <span>Always a learner.</span>
          </>
        }
      >
        I’m Amir Younesi. You can call me Amir.
      </PageIntro>
      <div className="about-profile">
        <figure className="portrait-frame">
          <img
            src="/images/amir.png"
            alt="Amir Younesi"
            width="360"
            height="430"
          />
        </figure>
        <div className="prose-copy">
          <p>
            I’ve spent over nine years building software: creative tools, travel
            platforms, and the systems that make them work.
          </p>
          <p>
            My work sits between thoughtful interfaces and practical
            engineering. I care about clear interactions, maintainable code, and
            performance that people can feel.
          </p>
          <a className="button-secondary mt-5" href={profile.resume} download>
            <Download size={17} />
            Download resume<span className="text-xs text-muted">PDF</span>
          </a>
        </div>
      </div>
      <div className="prose-copy mt-8">
        <p>
          Today, I’m based in Richmond Hill, Ontario. I’m developing UpHub, a
          bilingual local-discovery platform, and studying Software Engineering
          Technology — Artificial Intelligence at Centennial College.
        </p>
        <p>
          Outside the editor, you’ll usually find me on a volleyball court. I
          play every week and share moments from our games on{" "}
          <a href={profile.youtube} target="_blank" rel="noreferrer">
            YouTube
            <ArrowUpRight className="inline ml-1" size={13} />
          </a>
          . It’s another way to create, learn, and connect.
        </p>
      </div>
      <section className="section-block">
        <SectionHeading label="The experience behind the work" />
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
          <p className="eyebrow">ALSO IN CANADA · FEB — AUG 2025</p>
          <h3>Security / Field Technician</h3>
          <p>
            Synergy Protection Group Inc. — hands-on camera and NVR
            troubleshooting, field documentation, and coordination with site
            teams.
          </p>
        </div>
      </section>
      <section className="section-block">
        <SectionHeading label="My toolkit" />
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
