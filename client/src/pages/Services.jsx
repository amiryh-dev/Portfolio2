import { Link } from "react-router-dom";
import {
  Braces,
  Layers3,
  Gauge,
  Smartphone,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { PageIntro, ContactCta } from "../components/Layout";
import { usePortfolio } from "../context/PortfolioContext";

const serviceIcons = { Braces, Layers3, Gauge, Smartphone };

export default function Services() {
  const { navigation, services, copy } = usePortfolio();
  const content = copy.services;
  return (
    <>
      <PageIntro
        number={navigation.find((item) => item.path === "/services").number}
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
      <div className="services-list">
        {services.map((s) => (
          <article key={s.number} className="service-card">
            <div className="service-top">
              {(() => {
                const Icon = serviceIcons[s.icon];
                return Icon ? <Icon size={28} strokeWidth={1.4} /> : null;
              })()}
              <span>/{s.number}</span>
            </div>
            <h2>{s.title}</h2>
            <p className="service-subtitle">{s.subtitle}</p>
            <p className="service-description">{s.description}</p>
            <ul>
              {s.items.map((item) => (
                <li key={item}>
                  <Check size={14} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to={`/projects/${s.project}`} className="text-link">
              Related work: {s.projectName}
              <ArrowUpRight size={15} />
            </Link>
          </article>
        ))}
      </div>
      <ContactCta />
    </>
  );
}
