import { createContext, useContext, useId, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, Plus, Trash2 } from "lucide-react";

// A generic editor for the portfolio content: it renders a form for any
// mix of objects, lists and text, so every section can be edited without a
// hand-written form. `shape` is a sample of what a value can contain (built
// from all sibling items), used for empty lists and for new items.

// When true, every field is shown but can't be changed (regular users).
export const ReadOnlyContext = createContext(false);

export function humanize(key) {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

// Combines several values into one sample that has every key any of them has.
export function mergeShape(a, b) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    const items = [...a, ...b];
    return items.length ? [items.reduce((acc, item) => mergeShape(acc, item))] : [];
  }
  if (isObject(a) && isObject(b)) {
    const merged = { ...a };
    for (const key of Object.keys(b)) merged[key] = mergeShape(a[key], b[key]);
    return merged;
  }
  return a;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function shapeOfList(list) {
  return list.length ? list.reduce((acc, item) => mergeShape(acc, item)) : undefined;
}

function blankFrom(shape) {
  if (Array.isArray(shape)) return [];
  if (isObject(shape)) {
    return Object.fromEntries(Object.entries(shape).map(([k, v]) => [k, blankFrom(v)]));
  }
  if (typeof shape === "number") return 0;
  if (typeof shape === "boolean") return false;
  return "";
}

function itemTitle(item, index) {
  if (!isObject(item)) return `Item ${index + 1}`;
  const title = item.title || item.label || item.name || item.value || item.slug || item.company;
  return title ? String(title) : `Item ${index + 1}`;
}

const LONG_TEXT_KEYS = /description|detail|challenge|takeaway|intro|lead|note|paragraph|outro|alt$/i;

function TextField({ label, value, onChange, fieldKey, choices }) {
  const id = useId();
  const readOnly = useContext(ReadOnlyContext);
  // Decided once, so the field doesn't switch type (and lose focus) while typing.
  const [multiline] = useState(
    () => String(value).length > 70 || LONG_TEXT_KEYS.test(String(fieldKey || "")),
  );

  let control;
  if (choices && choices.length) {
    const options = choices.includes(value) || !value ? choices : [value, ...choices];
    control = (
      <select id={id} value={value} disabled={readOnly} onChange={(e) => onChange(e.target.value)}>
        {!value && <option value="">Choose…</option>}
        {options.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    );
  } else if (typeof value === "number") {
    control = (
      <input
        id={id}
        type="number"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    );
  } else if (multiline) {
    control = (
      <textarea id={id} rows={3} value={value} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} />
    );
  } else {
    control = <input id={id} value={value} readOnly={readOnly} onChange={(e) => onChange(e.target.value)} />;
  }

  if (!label) return control;
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      {control}
    </div>
  );
}

function move(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ItemActions({ index, length, onMove, onRemove, label }) {
  const readOnly = useContext(ReadOnlyContext);
  if (readOnly) return null;
  return (
    // preventDefault stops a click on these buttons from also opening or
    // closing the surrounding <details>.
    <div className="admin-item-actions" onClick={(event) => event.preventDefault()}>
      <button
        type="button"
        className="admin-icon-button"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ArrowUp size={15} />
      </button>
      <button
        type="button"
        className="admin-icon-button"
        aria-label={`Move ${label} down`}
        disabled={index === length - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ArrowDown size={15} />
      </button>
      <button
        type="button"
        className="admin-icon-button danger"
        aria-label={`Remove ${label}`}
        onClick={() => onRemove(index)}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ListEditor({ label, value, onChange, shape, path, choicesFor }) {
  const readOnly = useContext(ReadOnlyContext);
  const sample = shapeOfList(value) ?? (Array.isArray(shape) ? shape[0] : undefined) ?? "";
  const objects = isObject(sample);
  const update = (index, next) => onChange(value.map((item, i) => (i === index ? next : item)));
  const remove = (index) => {
    const name = itemTitle(value[index], index);
    if (objects && !window.confirm(`Remove “${name}”?`)) return;
    onChange(value.filter((_, i) => i !== index));
  };
  const moveItem = (from, to) => onChange(move(value, from, to));
  const add = () => onChange([...value, blankFrom(sample)]);

  return (
    <div className="admin-list">
      {label && <p className="admin-list-label">{label}</p>}
      {value.length === 0 && <p className="admin-empty">Nothing here yet.</p>}
      {objects ? (
        value.map((item, index) => (
          <details key={index} className="admin-item" open={value.length === 1}>
            <summary>
              <ChevronRight size={16} className="admin-chevron" />
              <span className="admin-item-title">{itemTitle(item, index)}</span>
              <ItemActions
                index={index}
                length={value.length}
                onMove={moveItem}
                onRemove={remove}
                label={itemTitle(item, index)}
              />
            </summary>
            <div className="admin-item-body">
              <ObjectEditor
                value={item}
                shape={sample}
                path={path}
                choicesFor={choicesFor}
                onChange={(next) => update(index, next)}
              />
            </div>
          </details>
        ))
      ) : (
        <div className="admin-string-list">
          {value.map((item, index) => (
            <div key={index} className="admin-string-row">
              <TextField
                value={item}
                fieldKey={path}
                choices={choicesFor?.(path)}
                onChange={(next) => update(index, next)}
              />
              <ItemActions
                index={index}
                length={value.length}
                onMove={moveItem}
                onRemove={remove}
                label={`item ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
      {!readOnly && (
        <button type="button" className="admin-add" onClick={add}>
          <Plus size={15} /> Add {objects ? "item" : "line"}
        </button>
      )}
    </div>
  );
}

export function ObjectEditor({ value, onChange, shape, path = "", choicesFor, collapseNested }) {
  const keys = Object.keys(mergeShape(value, shape) || {});
  return (
    <div className="admin-object">
      {keys.map((key) => {
        const fieldShape = shape?.[key];
        const fieldValue = value?.[key] ?? blankFrom(fieldShape);
        const fieldPath = path ? `${path}.${key}` : key;
        const set = (next) => onChange({ ...value, [key]: next });
        return (
          <FieldEditor
            key={key}
            fieldKey={key}
            label={humanize(key)}
            value={fieldValue}
            shape={fieldShape}
            path={fieldPath}
            choicesFor={choicesFor}
            collapseNested={collapseNested}
            onChange={set}
          />
        );
      })}
    </div>
  );
}

export default function FieldEditor({
  label,
  value,
  onChange,
  shape,
  path,
  fieldKey,
  choicesFor,
  collapseNested,
}) {
  const readOnly = useContext(ReadOnlyContext);
  if (Array.isArray(value)) {
    return (
      <ListEditor
        label={label}
        value={value}
        onChange={onChange}
        shape={shape}
        path={path}
        choicesFor={choicesFor}
      />
    );
  }
  if (isObject(value)) {
    const body = (
      <ObjectEditor value={value} shape={shape} path={path} choicesFor={choicesFor} onChange={onChange} />
    );
    if (collapseNested) {
      return (
        <details className="admin-group">
          <summary>
            <ChevronRight size={16} className="admin-chevron" />
            {label}
          </summary>
          <div className="admin-group-body">{body}</div>
        </details>
      );
    }
    return (
      <fieldset className="admin-fieldset">
        <legend>{label}</legend>
        {body}
      </fieldset>
    );
  }
  if (typeof value === "boolean") {
    return (
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={value}
          disabled={readOnly}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    );
  }
  return (
    <TextField
      label={label}
      value={value ?? ""}
      fieldKey={fieldKey}
      choices={choicesFor?.(path)}
      onChange={onChange}
    />
  );
}
