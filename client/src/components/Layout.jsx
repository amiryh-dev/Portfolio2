import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Download,
  LayoutDashboard,
  Linkedin,
  LogIn,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";

function AccountLinks() {
  const { user, signOut } = useAuth();
  if (user) {
    return (
      <div className="account-links">
        <Link to="/dashboard">
          <LayoutDashboard size={15} /> Dashboard
        </Link>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className="account-links">
      <Link to="/signin">
        <LogIn size={15} /> Sign in
      </Link>
      <Link to="/signup">Sign up</Link>
    </div>
  );
}

export function Logo({ compact = false }) {
  const { profile } = usePortfolio();
  return (
    <Link to="/" className="brand" aria-label={`${profile.name} — Home`}>
      <span className="brand-mark" aria-hidden="true">
        {profile.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toLowerCase()}
        <i />
      </span>
      {!compact && (
        <span className="brand-label">
          {profile.name.toUpperCase()}
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
  const { copy } = usePortfolio();
  return (
    <div className="contact-cta">
      <div>
        <span className="eyebrow">{copy.layout.contactEyebrow}</span>
        <h2>{copy.layout.contactTitle}</h2>
      </div>
      <Link to="/contact" className="circle-link" aria-label="Contact Amir">
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );
}

export default function Layout() {
  const { navigation, profile, copy } = usePortfolio();
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
    document.title = `${title} · ${profile.name} — ${profile.role}`;
    if (!initialRoute.current)
      document.getElementById("main-content")?.focus({ preventScroll: true });
    initialRoute.current = false;
  }, [location.pathname, profile.name, profile.role]);
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
        <span className="text-sm font-medium">{profile.name}</span>
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
          <span className="eyebrow">{copy.layout.identityEyebrow}</span>
          <Link to="/" className="identity-name">
            {profile.name.split(" ")[0]}
            <br />
            {profile.name.split(" ").slice(1).join(" ")}<span>.</span>
          </Link>
          <p className="identity-role">{profile.role}</p>
          <p className="identity-description">
            {copy.layout.identityDescription}
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
              aria-label={`${profile.name} on LinkedIn`}
            >
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
              <Mail size={21} />
            </a>
            <a
              href={profile.resume}
              download
              aria-label={`Download ${profile.name}'s resume PDF`}
            >
              <Download size={21} />
            </a>
            <span className="social-rule" />
          </div>
        
          <p className="rail-note">{copy.layout.railNote}</p>
          <AccountLinks />
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
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{copy.layout.footerTagline}</span>
        </footer>
      </div>
    </div>
  );
}
