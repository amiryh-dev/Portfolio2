import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "../data/portfolio";
import { PageIntro, Tag, ContactCta } from "../components/Layout";
import NotFound from "./NotFound";
export default function Projects() {
  return (
    <>
      <PageIntro
        number="03"
        eyebrow="SELECTED PROJECTS"
        title={
          <>
            The work.
            <br />
            <span>And the thinking behind it.</span>
          </>
        }
      >
        Creative tools, booking systems, and community platforms. Different
        problems, the same care in the details.
      </PageIntro>
      <div className="projects-list">
        {projects.map((project) => (
          <article key={project.slug} className="project-card">
            <Link
              to={`/projects/${project.slug}`}
              aria-label={`Explore ${project.title}`}
              className="project-image-link"
            >
              <img
                src={project.image}
                alt={project.imageAlt}
                width="720"
                height="430"
                loading="lazy"
              />
              <span className="image-label">SYSTEM OVERVIEW</span>
              <span className="image-arrow">
                <ArrowUpRight size={23} />
              </span>
            </Link>
            <div className="flex items-center justify-between gap-3 mt-6">
              <span className="project-category mb-0">{project.category}</span>
              <span className="project-index">/{project.number}</span>
            </div>
            <h2>
              <Link to={`/projects/${project.slug}`}>{project.title}</Link>
            </h2>
            <p className="project-summary">{project.description}</p>
            <div className="project-role">
              <span>{project.role}</span>
              <span>{project.period}</span>
            </div>
            <div className="tag-list">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="project-bottom">
              <span className="result-label">{project.result}</span>
              <Link to={`/projects/${project.slug}`} className="text-link">
                Read the case study
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <ContactCta />
    </>
  );
}
export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <Link to="/projects" className="back-link">
        <ArrowLeft size={15} />
        All projects
      </Link>
      <PageIntro
        number={project.number}
        eyebrow={project.category.toUpperCase()}
        title={project.title}
      >
        {project.subtitle}
      </PageIntro>
      <figure className="case-image">
        <img
          src={project.image}
          alt={project.imageAlt}
          width="720"
          height="430"
        />
        <figcaption>
          Simplified architecture overview of the project.
        </figcaption>
      </figure>
      <dl className="case-meta">
        <div>
          <dt>MY ROLE</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>TIMELINE</dt>
          <dd>{project.period}</dd>
        </div>
        <div className="col-span-full">
          <dt>ORGANIZATION</dt>
          <dd>{project.company}</dd>
        </div>
      </dl>
      <div className="tag-list">
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <section className="case-section">
        <h2>The challenge</h2>
        <p>{project.challenge}</p>
      </section>
      <section className="case-section">
        <h2>My contribution</h2>
        <ol className="contribution-list">
          {project.approach.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="case-section">
        <h2>The outcome</h2>
        <div className="outcomes-grid">
          {project.outcomes.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
        {project.slug === "uphub" ? (
          <p className="small-note">
            UpHub is an ongoing independent project. The capabilities above
            describe the work developed so far.
          </p>
        ) : (
          <p className="small-note">
            Figures are approximate project results documented in my resume.
          </p>
        )}
      </section>
      <blockquote className="takeaway">{project.takeaway}</blockquote>
      <div className="next-project">
        <span className="eyebrow">NEXT CASE STUDY</span>
        <Link to={`/projects/${next.slug}`}>
          {next.title}
          <ArrowRight size={22} />
        </Link>
      </div>
    </>
  );
}
