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
const services = [
  {
    number: "01",
    icon: Braces,
    title: "Frontend development",
    subtitle: "Interfaces that feel right.",
    description:
      "Responsive, accessible web interfaces built with React, Next.js, Vue, and Tailwind CSS.",
    items: [
      "Component-based interfaces",
      "Responsive layouts",
      "Design-to-code implementation",
    ],
    project: "editools",
    projectName: "Editools",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Full-stack web applications",
    subtitle: "A complete product, connected.",
    description:
      "Applications with clear APIs, reliable data flows, and practical automation behind the interface.",
    items: [
      "Node.js and Laravel backends",
      "REST API integration",
      "Authentication and data modeling",
    ],
    project: "travel-platform",
    projectName: "Travel booking platform",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Performance & improvement",
    subtitle: "Make the existing product better.",
    description:
      "Identify friction in loading, asset delivery, API usage, and repetitive operational workflows.",
    items: [
      "Lazy loading and caching",
      "Asset delivery optimization",
      "Queue-based workflow automation",
    ],
    project: "editools",
    projectName: "Editools performance work",
  },
  {
    number: "04",
    icon: Smartphone,
    title: "Cross-platform development",
    subtitle: "Your product, on the move.",
    description:
      "Mobile experiences with React Native and Expo, connected to the services your product needs.",
    items: [
      "Cross-platform interfaces",
      "Role-based user journeys",
      "Maps and cloud media integration",
    ],
    project: "uphub",
    projectName: "UpHub",
  },
];
export default function Services() {
  return (
    <>
      <PageIntro
        number="05"
        eyebrow="HOW I CAN HELP"
        title={
          <>
            From a good idea.
            <br />
            <span>To a useful product.</span>
          </>
        }
      >
        I bring hands-on experience across the interface, the backend, and the
        details that connect them.
      </PageIntro>
      <div className="services-list">
        {services.map((s) => (
          <article key={s.number} className="service-card">
            <div className="service-top">
              <s.icon size={28} strokeWidth={1.4} />
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
