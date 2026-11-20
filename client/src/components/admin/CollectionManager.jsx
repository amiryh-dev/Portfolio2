import { useCallback, useEffect, useId, useState } from "react";
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "../../api";
import { useConfirm } from "./ConfirmDialog";

// Create / read / update / delete for one collection (projects or
// qualifications) through its REST API. Admins can change entries; other
// users can only open and read them.
//
// Field types:
//   text, textarea, number, select (with `options`),
//   lines    -> list of strings, one per line
//   tags     -> list of strings, comma separated
//   outcomes -> list of { value, label }, one "value | label" per line

function toFormValue(field, value) {
  if (field.type === "lines") return (value || []).join("\n");
  if (field.type === "tags") return (value || []).join(", ");
  if (field.type === "outcomes") {
    return (value || []).map((o) => `${o.value || ""} | ${o.label || ""}`).join("\n");
  }
  if (value === undefined || value === null) return field.type === "select" ? field.options[0] : "";
  return String(value);
}

function fromFormValue(field, value) {
  const lines = () => value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (field.type === "lines") return lines();
  if (field.type === "tags") return value.split(",").map((t) => t.trim()).filter(Boolean);
  if (field.type === "outcomes") {
    return lines().map((line) => {
      const [first, ...rest] = line.split("|");
      return { value: first.trim(), label: rest.join("|").trim() };
    });
  }
  if (field.type === "number") return value === "" ? undefined : Number(value);
  return value.trim();
}

function ItemForm({ fields, item, readOnly, onSubmit, onCancel, saving, error, noun }) {
  const formId = useId();
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, toFormValue(f, item?.[f.name])])),
  );
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    const body = {};
    for (const field of fields) {
      const value = fromFormValue(field, values[field.name]);
      if (value !== undefined) body[field.name] = value;
    }
    onSubmit(body);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <button type="button" className="admin-text-button admin-back" onClick={onCancel}>
        <ArrowLeft size={14} /> Back to the list
      </button>
      <h2>{readOnly ? item.title : item ? `Edit ${noun}` : `New ${noun}`}</h2>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-form-grid">
        {fields.map((field) => {
          const id = `${formId}-${field.name}`;
          const common = {
            id,
            name: field.name,
            value: values[field.name],
            onChange: set(field.name),
            readOnly,
            required: field.required && !readOnly,
          };
          let control;
          if (field.type === "select") {
            control = (
              <select {...common} disabled={readOnly}>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          } else if (["textarea", "lines", "outcomes"].includes(field.type)) {
            control = <textarea {...common} rows={field.rows || 3} />;
          } else {
            control = <input {...common} type={field.type === "number" ? "number" : "text"} pattern={field.pattern} />;
          }
          return (
            <div key={field.name} className={`admin-field${field.wide ? " wide" : ""}`}>
              <label htmlFor={id}>
                {field.label} {field.required && !readOnly && <span>*</span>}
              </label>
              {control}
              {field.help && !readOnly && <p className="field-help mt-1.5">{field.help}</p>}
            </div>
          );
        })}
      </div>
      {!readOnly && (
        <div className="admin-form-actions">
          <button type="button" className="button-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="button-primary" disabled={saving}>
            {saving ? "Saving…" : item ? "Save changes" : `Add ${noun}`}
          </button>
        </div>
      )}
    </form>
  );
}

export default function CollectionManager({
  endpoint,
  fields,
  noun,
  describe,
  token,
  isAdmin,
  initialItems,
  onItemsChange,
  onUnauthorized,
}) {
  const [items, setItems] = useState(initialItems || []);
  // null = list view; { item } = editing or viewing an item; { item: null } = new item.
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirm, confirmDialog] = useConfirm();

  const reload = useCallback(async () => {
    const list = await apiRequest(endpoint);
    setItems(list);
    onItemsChange(list);
  }, [endpoint, onItemsChange]);

  useEffect(() => {
    reload().catch((loadError) => setError(loadError.message));
  }, [reload]);

  function handleError(requestError) {
    if (requestError.status === 401) onUnauthorized();
    setError(requestError.message);
  }

  async function save(body) {
    setSaving(true);
    setError("");
    try {
      const existing = editing.item;
      if (existing) {
        await apiRequest(`${endpoint}/${existing._id}`, { method: "PUT", token, body: JSON.stringify(body) });
      } else {
        await apiRequest(endpoint, { method: "POST", token, body: JSON.stringify(body) });
      }
      await reload();
      setEditing(null);
      setNotice(existing ? `“${body.title}” was updated.` : `“${body.title}” was added.`);
    } catch (saveError) {
      handleError(saveError);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    const ok = await confirm(`“${item.title}” will be permanently deleted. This can't be undone.`, {
      title: `Delete this ${noun}?`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    setError("");
    try {
      await apiRequest(`${endpoint}/${item._id}`, { method: "DELETE", token });
      await reload();
      setNotice(`“${item.title}” was deleted.`);
    } catch (deleteError) {
      handleError(deleteError);
    }
  }

  function open(item) {
    setError("");
    setNotice("");
    setEditing({ item });
  }

  if (editing) {
    return (
      <ItemForm
        key={editing.item?._id || "new"}
        fields={fields}
        item={editing.item}
        readOnly={!isAdmin}
        noun={noun}
        saving={saving}
        error={error}
        onSubmit={save}
        onCancel={() => {
          setEditing(null);
          setError("");
        }}
      />
    );
  }

  return (
    <div className="admin-collection">
      {isAdmin && (
        <button type="button" className="button-primary admin-new" onClick={() => open(null)}>
          <Plus size={16} /> Add {noun}
        </button>
      )}
      {notice && (
        <p className="form-success" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {items.length === 0 && <p className="admin-empty">Nothing here yet.</p>}
      {confirmDialog}
      <ul className="admin-rows">
        {items.map((item) => (
          <li key={item._id} className="admin-row">
            <div className="min-w-0">
              <strong>{item.title}</strong>
              <span>{describe(item)}</span>
            </div>
            <div className="admin-row-actions">
              {isAdmin ? (
                <>
                  <button type="button" className="admin-text-button" onClick={() => open(item)}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button type="button" className="admin-text-button danger" onClick={() => remove(item)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              ) : (
                <button type="button" className="admin-text-button" onClick={() => open(item)}>
                  <Eye size={14} /> View
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const PROJECT_FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    pattern: "[a-z0-9]+(-[a-z0-9]+)*",
    help: "The page address: /projects/<slug>. Lowercase letters, numbers and dashes.",
  },
  { name: "category", label: "Category", type: "text" },
  { name: "number", label: "Number", type: "text", help: "Shown on the card, e.g. 04." },
  { name: "subtitle", label: "Subtitle", type: "text", wide: true },
  { name: "description", label: "Description", type: "textarea", required: true, wide: true },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "period", label: "Period", type: "text" },
  { name: "result", label: "Key result", type: "text" },
  { name: "tags", label: "Tags", type: "tags", wide: true, help: "Separate tags with commas." },
  { name: "image", label: "Image path", type: "text", help: "e.g. /images/project.svg" },
  { name: "imageAlt", label: "Image description", type: "text" },
  { name: "challenge", label: "Challenge", type: "textarea", wide: true },
  { name: "approach", label: "Approach", type: "lines", rows: 4, wide: true, help: "One step per line." },
  {
    name: "outcomes",
    label: "Outcomes",
    type: "outcomes",
    wide: true,
    help: "One per line as “value | label”, e.g. “≈ 3× | Faster initial loading”.",
  },
  { name: "takeaway", label: "Takeaway", type: "textarea", wide: true },
  { name: "order", label: "Position", type: "number", help: "Lower numbers are listed first." },
];

export const QUALIFICATION_FIELDS = [
  { name: "title", label: "Title", type: "text", required: true, wide: true },
  { name: "institution", label: "Institution", type: "text", required: true, wide: true },
  { name: "date", label: "Date", type: "text", help: "e.g. September 2026 — Present" },
  { name: "status", label: "Status", type: "text", help: "e.g. In progress, Completed" },
  { name: "icon", label: "Icon", type: "select", options: ["BookOpen", "Cpu", "Languages"] },
  { name: "order", label: "Position", type: "number", help: "Lower numbers are listed first." },
  { name: "description", label: "Description", type: "textarea", wide: true },
  { name: "subjects", label: "Subjects", type: "lines", wide: true, help: "One subject per line." },
];
