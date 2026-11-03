import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Download,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { navigation, profile } from "../data/portfolio";

export function Logo({ compact = false }) {
  return (
    <Link to="/" className="brand" aria-label="Amir Younesi — Home">
      <span className="brand-mark" aria-hidden="true">
        a<span>y</span>
        <i />
      </span>
      {!compact && (
        <span className="brand-label">
          AMIR YOUNESI
        </span>
      )}
    </Link>
  );
}
export function Tag({ children }) {
  return <span className="tag">{children}</span>;
}
export function PageIntro({ number, eyebrow, title, children }) {
  return (
    <header className="page-intro">
      <div className="eyebrow">
        <span>{number}</span>
        <i />
        {eyebrow}
      </div>
      <h1>{title}</h1>
      {children && <p className="intro-description">{children}</p>}
    </header>
  );
}
export function SectionHeading({ label, link, to }) {
  return (
    <div className="section-heading">
      <h2>{label}</h2>
      {link && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function ContactCta() {
  return (
    <div className="contact-cta">
      <div>
        <span className="eyebrow">HAVE SOMETHING IN MIND?</span>
        <h2>Let’s build it thoughtfully.</h2>
      </div>
      <Link to="/contact" className="circle-link" aria-label="Contact Amir">
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const initialRoute = useRef(true);
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    const title =
      navigation.find((n) => n.path === location.pathname)?.label ??
      (location.pathname.startsWith("/projects/")
        ? "Project details"
        : "Page not found");
    document.title = `${title} · Amir Younesi — Full-Stack Developer`;
    if (!initialRoute.current)
      document.getElementById("main-content")?.focus({ preventScroll: true });
    initialRoute.current = false;
  }, [location.pathname]);
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="mobile-header">
        <Logo compact />
        <span className="text-sm font-medium">Amir Younesi</span>
        <button
          ref={menuButton}
          className="icon-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <aside className={`identity-rail ${menuOpen ? "is-open" : ""}`}>
        <div className="desktop-brand">
          <Logo />
        </div>
        <div className="identity">
          <span className="eyebrow">ENGINEERING WITH INTENTION</span>
          <Link to="/" className="identity-name">
            Amir
            <br />
            Younesi<span>.</span>
          </Link>
          <p className="identity-role">{profile.role}</p>
          <p className="identity-description">
            I turn complex ideas into
            <br className="hidden xl:block" /> thoughtful digital experiences.
          </p>
        </div>
        <nav id="main-navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-number">{item.number}</span>
              <span className="nav-line" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="social-links">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Amir on LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email Amir">
              <Mail size={21} />
            </a>
            <a
              href={profile.resume}
              download
              aria-label="Download Amir's resume PDF"
            >
              <Download size={21} />
            </a>
            <span className="social-rule" />
          </div>
        
          <p className="rail-note">Care in the details. Purpose in the code.</p>
        </div>
      </aside>
      <div className="content-column">
        <main
          id="main-content"
          tabIndex={-1}
          key={location.pathname}
          className="page-enter"
        >
          <Outlet />
        </main>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Amir Younesi</span>
          <span>Thoughtfully designed. Carefully built.</span>
        </footer>
      </div>
    </div>
  );
}
