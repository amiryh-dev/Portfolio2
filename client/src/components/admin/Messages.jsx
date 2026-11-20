import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "../../api";

const FIELDS = [
  { name: "firstname", label: "First name" },
  { name: "lastname", label: "Last name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
];

function MessageForm({ message, onSave, onCancel }) {
  const [values, setValues] = useState({
    firstname: message.firstname || "",
    lastname: message.lastname || "",
    email: message.email || "",
    phone: message.phone || "",
    message: message.message || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(values);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-message-form" onSubmit={submit}>
      <div className="admin-form-grid">
        {FIELDS.map((field) => (
          <div key={field.name} className="admin-field">
            <label htmlFor={`${message._id}-${field.name}`}>{field.label}</label>
            <input
              id={`${message._id}-${field.name}`}
              type={field.type || "text"}
              value={values[field.name]}
              onChange={set(field.name)}
              required={field.name !== "phone"}
            />
          </div>
        ))}
        <div className="admin-field wide">
          <label htmlFor={`${message._id}-message`}>Message</label>
          <textarea
            id={`${message._id}-message`}
            rows={4}
            value={values.message}
            onChange={set("message")}
            required
            minLength={10}
          />
        </div>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="button-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button className="button-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

// Contact form messages: admins can read, edit and delete them.
export default function Messages({ token, onUnauthorized }) {
  const [messages, setMessages] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleError = useCallback(
    (requestError) => {
      if (requestError.status === 401) onUnauthorized();
      setError(requestError.message);
    },
    [onUnauthorized],
  );

  useEffect(() => {
    apiRequest("/api/contacts", { token })
      .then(setMessages)
      .catch(handleError);
  }, [token, handleError]);

  async function update(id, values) {
    setError("");
    try {
      const saved = await apiRequest(`/api/contacts/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify(values),
      });
      setMessages((current) => current.map((m) => (m._id === id ? saved : m)));
      setEditingId(null);
    } catch (saveError) {
      handleError(saveError);
    }
  }

  async function remove(message) {
    if (!window.confirm(`Delete the message from ${message.firstname} ${message.lastname}? This can't be undone.`)) {
      return;
    }
    setError("");
    try {
      await apiRequest(`/api/contacts/${message._id}`, { method: "DELETE", token });
      setMessages((current) => current.filter((m) => m._id !== message._id));
    } catch (deleteError) {
      handleError(deleteError);
    }
  }

  return (
    <>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!messages && !error && <p className="admin-empty">Loading messages…</p>}
      {messages && !messages.length && <p className="admin-empty">No messages yet.</p>}
      {messages && messages.length > 0 && (
        <ul className="admin-messages">
          {[...messages].reverse().map((message) => (
            <li key={message._id} className="admin-message">
              {editingId === message._id ? (
                <MessageForm
                  message={message}
                  onSave={(values) => update(message._id, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="admin-message-head">
                    <div>
                      <strong>
                        {message.firstname} {message.lastname}
                      </strong>
                      <a href={`mailto:${message.email}`}>{message.email}</a>
                      {message.phone && <span>{message.phone}</span>}
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-text-button" onClick={() => setEditingId(message._id)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button type="button" className="admin-text-button danger" onClick={() => remove(message)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  <p>{message.message}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
