import React from "react";
import { FaGlobe } from "react-icons/fa";

export default function ContactListGeneric({
  t,                       // i18n fn or undefined
  contacts,                // [{type, value, label?}]
  onChange,                // (index, newValue) => void
  onRemove,                // (index) => void
  onOpenPicker,            // () => void | contacts type
  contactTypes,            // [{key, label}]
  iconMap,                 // { [typeKey]: <Icon/> }
  titleKey,                // "event_form.contacts_label" | "personal_form.contacts_label"
  emptyKey,                // "event_form.no_contacts" | ...
  addKey,                  // "event_form.add_contact" | ...
}) {
  const getDef = (type) => contactTypes?.find((x) => x.key === type);

  return (
    <>
      <label className="form-label">{t ? t(titleKey) : "Contacts"}</label>
      {contacts.length === 0 && (
        <div className="mb-2 text-muted" style={{ fontSize: 15 }}>
          {t ? t(emptyKey) : "No contacts yet"}
        </div>
      )}
      {contacts.map((c, i) => {
        const def = getDef(c.type);
        const placeholder = c.label || def?.label || c.type;
        const inputType =
          c.type === "email" ? "email" :
          c.type === "website" ? "url" :
          "text";
        return (
          <div className="input-group mb-2" key={i}>
            <span className="input-group-text" title={def?.label || c.type}>
              {iconMap?.[c.type] || <FaGlobe />}
            </span>
            <input
              type={inputType}
              className="form-control"
              placeholder={placeholder}
              value={c.value}
              onChange={(e) => onChange(i, e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => onRemove(i)}
              title={t ? t("personal_form.remove_button_title") : "Remove"}
            >
              ×
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className="btn btn-outline-primary w-100"
        onClick={onOpenPicker}
      >
        {t ? t(addKey) : "Add contact"}
      </button>
    </>
  );
}
