import React from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ContactListGeneric({
  t: tProp,                 
  ns,                       
  contacts = [],            
  onChange,                 
  onRemove,                 
  onOpenPicker,             
  contactTypes = [],        
  iconMap = {},             
  titleKey = "contacts_label",
  emptyKey = "no_contacts",
  addKey = "add_contact",
  removeKey = "remove_button_title",
}) {
  const { t: tNs } = useTranslation(ns);
  const t = tProp ?? tNs;

  const getDef = (type) => contactTypes.find((x) => x.key === type);

  const inputTypeFor = (type) => {
    switch (type) {
      case "email":
        return "email";
      case "website":
      case "url":
        return "url";
      case "phone":
      case "tel":
      case "whatsapp":
        return "tel";
      default:
        return "text";
    }
  };

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
        const inputType = inputTypeFor(c.type);

        return (
          <div className="input-group mb-2" key={`${c.type}-${i}`}>
            <span className="input-group-text" title={def?.label || c.type}>
              {iconMap[c.type] || <FaGlobe />}
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
              title={t ? t(removeKey) : "Remove"}
              aria-label={t ? t(removeKey) : "Remove"}
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
