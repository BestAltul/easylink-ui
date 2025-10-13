import React from "react";
import ContactButton from "./ContactButton";
import { valueToString } from "./valueToString";

export default function ContactsSection({
  t,
  contacts,
  editMode,
  onOpenContactPicker,
  onRemoveContact,
  onChangeContactValue,
  resumeEditAt
}) {
  const [editingIdx, setEditingIdx] = React.useState(-1);
  const [tempValue, setTempValue]   = React.useState("");
  const lastNonceRef = React.useRef(null);

  // auto-focus edit when resumeEditAt приходит
  React.useEffect(() => {
    if (!editMode || !resumeEditAt || resumeEditAt.index == null) return;
    const { index, nonce } = resumeEditAt;
    if (nonce && nonce === lastNonceRef.current) return;
    lastNonceRef.current = nonce || null;

    const raw = contacts?.[index]?.value;
    setEditingIdx(index);
    setTempValue(valueToString(raw));
  }, [resumeEditAt, editMode, contacts]);

  const prevLenRef = React.useRef(contacts?.length || 0);
  React.useEffect(() => {
    const curr = contacts?.length || 0;
    const prev = prevLenRef.current;
    if (editMode && curr > prev) {
      const i = curr - 1;
      setEditingIdx(i);
      const raw = contacts[i]?.value;
      setTempValue(typeof raw === "string" ? raw : (raw?.value ?? ""));
    }
    prevLenRef.current = curr;
  }, [contacts, editMode]);

  return (
    <div className="d-flex flex-column align-items-center w-100" style={{ gap: 8 }}>
      <div className="d-flex flex-wrap gap-2 justify-content-center w-100">
        {contacts && contacts.length > 0 ? (
          contacts.map((c, i) => (
            <div key={(c.id ?? `${c.type}-${i}`)} style={{ position: "relative", minHeight: 44 }}>
              <ContactButton
                type={c.type}
                value={c.value}
                editMode={editMode}
                isEditing={editMode && editingIdx === i}
                editValue={editMode && editingIdx === i ? tempValue : ""}
                inputKey={editingIdx === i && resumeEditAt ? resumeEditAt.nonce : undefined}
                onStartEdit={() => {
                  setEditingIdx(i);
                  setTempValue(valueToString(c?.value));
                }}
                onEditChange={(v) => setTempValue(v)}
                onCommitEdit={(e) => {
                  if (e?.preventDefault) e.preventDefault();
                  onChangeContactValue?.(i, tempValue);
                  setEditingIdx(-1);
                }}
                onCancelEdit={() => setEditingIdx(-1)}
                onChangeType={() => onOpenContactPicker?.(i)}
              />

              {editMode && (
                <button
                  type="button"
                  title="Remove"
                  onClick={() => onRemoveContact?.(i)}
                  className="btn btn-light btn-sm"
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    lineHeight: 0,
                    padding: 0,
                    boxShadow: "0 1px 3px rgba(0,0,0,.15)",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))
        ) : (
          <span className="text-muted" style={{ fontSize: 15 }}>
            {t("no_contacts")}
          </span>
        )}
      </div>

      {editMode && (
        <button
          type="button"
          onClick={() => onOpenContactPicker?.(null)}
          className="btn btn-outline-primary btn-sm"
          style={{ marginTop: 6 }}
        >
          + {t("add_contact", "Add contact")}
        </button>
      )}
    </div>
  );
}
