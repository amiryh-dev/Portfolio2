import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Briefcase,
  ExternalLink,
  Eye,
  FolderKanban,
  Inbox,
  LayoutList,
  LogOut,
  Route as RouteIcon,
  Sparkles,
  Type,
  UserRound,
  Wrench,
} from "lucide-react";
import { apiRequest } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio, useSetPortfolio } from "../../context/PortfolioContext";
import FieldEditor, { ObjectEditor, ReadOnlyContext } from "../../components/admin/FieldEditor";
import CollectionManager, {
  PROJECT_FIELDS,
  QUALIFICATION_FIELDS,
} from "../../components/admin/CollectionManager";
import Messages from "../../components/admin/Messages";

// `collection` sections use their own REST API (one request per change);
// the others are part of the page content document saved with "Save changes".
const SECTIONS = [
  { key: "profile", label: "Profile", icon: UserRound, hint: "Your name, contact details, and links." },
  { key: "copy", label: "Page text", icon: Type, hint: "Headings and text on each page." },
  { key: "projects", label: "Projects", icon: FolderKanban, collection: true, hint: "Projects and their case-study pages." },
  { key: "qualifications", label: "Education", icon: BookOpen, collection: true, hint: "Qualifications on the Education page." },
  { key: "experience", label: "Experience", icon: Briefcase, hint: "Work history on the About page." },
  { key: "skillGroups", label: "Skills", icon: Wrench, hint: "Toolkit groups on the About page." },
  { key: "services", label: "Services", icon: Sparkles, hint: "Services on the Services page." },
  { key: "navigation", label: "Navigation", icon: RouteIcon, hint: "Menu items. Paths must match existing pages." },
  { key: "messages", label: "Messages", icon: Inbox, adminOnly: true, hint: "Messages sent through the contact form." },
];

// Icons the pages know how to draw (see Services.jsx).
const CHOICES = {
  "services.icon": ["Braces", "Layers3", "Gauge", "Smartphone"],
};

function pageContent({ projects, qualifications, ...content }) {
  return content;
}

function useUnsavedWarning(active) {
  useEffect(() => {
    if (!active) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);
}

export default function Dashboard() {
  const { token, user, isAdmin, checking, signOut } = useAuth();
  const location = useLocation();
  const portfolio = usePortfolio();
  const setPortfolio = useSetPortfolio();
  const savedContent = useMemo(() => pageContent(portfolio), [portfolio]);
  const [draft, setDraft] = useState(savedContent);
  const [active, setActive] = useState("profile");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => isAdmin && JSON.stringify(draft) !== JSON.stringify(savedContent),
    [draft, savedContent, isAdmin],
  );
  useUnsavedWarning(dirty);

  const handleUnauthorized = useCallback(() => signOut(), [signOut]);
  const setProjects = useCallback(
    (items) => setPortfolio((current) => ({ ...current, projects: items })),
    [setPortfolio],
  );
  const setQualifications = useCallback(
    (items) => setPortfolio((current) => ({ ...current, qualifications: items })),
    [setPortfolio],
  );

  if (checking) {
    return (
      <main className="api-status" role="status">
        <p>Checking your session…</p>
      </main>
    );
  }
  if (!token || !user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  const sections = SECTIONS.filter((s) => isAdmin || !s.adminOnly);
  const section = sections.find((s) => s.key === active) || sections[0];

  async function save() {
    setSaving(true);
    setStatus({ type: "", text: "" });
    try {
      const saved = await apiRequest("/api/portfolio", {
        method: "PUT",
        token,
        body: JSON.stringify(draft),
      });
      setPortfolio((current) => ({ ...current, ...saved }));
      setDraft(saved);
      setStatus({ type: "success", text: "Changes saved. The site now shows the new content." });
    } catch (saveError) {
      if (saveError.status === 401) {
        setStatus({ type: "error", text: "Your session has ended, so the changes were not saved. Sign in again to continue." });
      } else {
        setStatus({ type: "error", text: saveError.message });
      }
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    if (window.confirm("Discard all unsaved changes?")) {
      setDraft(savedContent);
      setStatus({ type: "", text: "" });
    }
  }

  function confirmSignOut() {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    signOut();
  }

  function renderSection() {
    if (section.key === "messages") {
      return <Messages token={token} onUnauthorized={handleUnauthorized} />;
    }
    if (section.key === "projects") {
      return (
        <CollectionManager
          endpoint="/api/projects"
          fields={PROJECT_FIELDS}
          noun="project"
          describe={(p) => [p.category, p.period].filter(Boolean).join(" · ")}
          token={token}
          isAdmin={isAdmin}
          initialItems={portfolio.projects}
          onItemsChange={setProjects}
          onUnauthorized={handleUnauthorized}
        />
      );
    }
    if (section.key === "qualifications") {
      return (
        <CollectionManager
          endpoint="/api/qualifications"
          fields={QUALIFICATION_FIELDS}
          noun="qualification"
          describe={(q) => [q.institution, q.date].filter(Boolean).join(" · ")}
          token={token}
          isAdmin={isAdmin}
          initialItems={portfolio.qualifications}
          onItemsChange={setQualifications}
          onUnauthorized={handleUnauthorized}
        />
      );
    }
    const props = {
      value: draft[section.key],
      path: section.key,
      choicesFor: (path) =>
        path === "services.project"
          ? portfolio.projects.map((project) => project.slug).filter(Boolean)
          : CHOICES[path],
      onChange: (next) => setDraft((current) => ({ ...current, [section.key]: next })),
    };
    // Top-level objects show their fields directly; the page text groups
    // (home, about, …) start collapsed.
    return Array.isArray(draft[section.key]) ? (
      <FieldEditor key={section.key} {...props} />
    ) : (
      <ObjectEditor key={section.key} {...props} collapseNested={section.key === "copy"} />
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-brand">
          <LayoutList size={18} />
          <span>Portfolio dashboard</span>
        </div>
        <div className="admin-header-actions">
          <span className="admin-user">
            {user.email} · <span className="admin-role">{isAdmin ? "Admin" : "User"}</span>
          </span>
          <Link to="/" className="admin-text-button" target="_blank" rel="noreferrer">
            View site <ExternalLink size={13} />
          </Link>
          <button type="button" className="admin-text-button" onClick={confirmSignOut}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Dashboard sections">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              className={`admin-nav-item${section.key === key ? " active" : ""}`}
              aria-current={section.key === key ? "page" : undefined}
              onClick={() => {
                setActive(key);
                setStatus({ type: "", text: "" });
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          {!isAdmin && (
            <p className="admin-readonly" role="note">
              <Eye size={16} /> You can view the content. Only admins can make changes.
            </p>
          )}
          <div className="admin-section-head">
            <h1>{section.label}</h1>
            <p>{section.hint}</p>
          </div>

          {status.text && (
            <p className={status.type === "error" ? "form-error" : "form-success"} role="status">
              {status.text}
            </p>
          )}

          <ReadOnlyContext.Provider value={!isAdmin}>{renderSection()}</ReadOnlyContext.Provider>
        </main>
      </div>

      {isAdmin && (
        <div className={`admin-savebar${dirty ? " visible" : ""}`} aria-hidden={!dirty}>
          <span>You have unsaved changes.</span>
          <div>
            <button type="button" className="button-secondary" onClick={discard} disabled={saving} tabIndex={dirty ? 0 : -1}>
              Discard
            </button>
            <button type="button" className="button-primary" onClick={save} disabled={saving} tabIndex={dirty ? 0 : -1}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
