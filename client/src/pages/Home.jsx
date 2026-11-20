import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ContactCta, SectionHeading, Tag } from "../components/Layout";

export default function Home() {
  const { projects, navigation, copy } = usePortfolio();
  const content = copy.home;
  return (
    <>
      <section className="home-intro">
        <div className="eyebrow">
          <span>{navigation.find((item) => item.path === "/").number}</span>
          <i />
          {content.eyebrow}
        </div>
        <h1>
          {content.title[0]}
          <br />
          <span>{content.title[1]}</span>
        </h1>
        <p className="home-lead">{content.lead}</p>
        <p className="home-description">{content.description}</p>
        <div className="hero-actions">
          <Link to="/projects" className="button-primary">
            {content.primaryLink}
            <ArrowUpRight size={18} />
          </Link>
          <Link to="/about" className="text-link">
            {content.secondaryLink}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
     
      <section className="section-block">
        <SectionHeading
          label={content.selectedWork}
          link={content.allProjects}
          to="/projects"
        />
        <div className="home-projects">
          {projects.slice(0, 2).map((project) => (
            <Link
              className="home-project group"
              to={`/projects/${project.slug}`}
              key={project.slug}
            >
              <div className="home-project-visual">
                <img
                  src={project.image || "/images/project-placeholder.svg"}
                  alt={project.imageAlt || project.title}
                  width="720"
                  height="430"
                />
              </div>
              <div>
                <div className="project-category">{project.category}</div>
                <h3>
                  {project.title}
                  <ArrowUpRight size={17} />
                </h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="now-block">
        <span className="now-marker" aria-hidden="true" />
        <div>
          <span className="eyebrow">{content.nextEyebrow}</span>
          <h2>{content.nextTitle}</h2>
          <p>{content.nextDescription}</p>
          <Link className="text-link" to="/education">
            {content.nextLink}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
