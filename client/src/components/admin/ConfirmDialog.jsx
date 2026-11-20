import { useCallback, useEffect, useRef, useState } from "react";

// An in-page replacement for window.confirm():
//   const [confirm, confirmDialog] = useConfirm();
//   if (await confirm("Delete this?", { confirmLabel: "Delete", danger: true })) …
//   …and render {confirmDialog} somewhere in the component.
export function useConfirm() {
  const [request, setRequest] = useState(null);

  const confirm = useCallback(
    (message, options = {}) =>
      new Promise((resolve) => setRequest({ message, ...options, resolve })),
    [],
  );

  const close = (answer) => {
    request?.resolve(answer);
    setRequest(null);
  };

  const dialog = request ? <ConfirmDialog request={request} onClose={close} /> : null;
  return [confirm, dialog];
}

function ConfirmDialog({ request, onClose }) {
  const confirmButton = useRef(null);

  useEffect(() => {
    confirmButton.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="confirm-backdrop" onClick={() => onClose(false)}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title">{request.title || "Are you sure?"}</h2>
        <p>{request.message}</p>
        <div className="admin-form-actions">
          <button type="button" className="button-secondary" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button
            ref={confirmButton}
            type="button"
            className={`button-primary${request.danger ? " danger" : ""}`}
            onClick={() => onClose(true)}
          >
            {request.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
