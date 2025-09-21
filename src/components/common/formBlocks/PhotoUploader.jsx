import React from "react";
import { useTranslation } from "react-i18next";

export default function PhotoUploader({
  t: tProp,              
  ns,                    
  labelKey = "photo_label",
  hintKey = "photo_hint",
  label,                 
  hint,                  
  onFileChange,          // (file|null) => void
  accept = "image/*",
  disabled = false,
}) {
  const { t: tNs } = useTranslation(ns);
  const t = tProp ?? tNs;

  const inputId = React.useId();
  const hintId = `${inputId}-hint`;

  const labelText = label ?? (t ? t(labelKey) : "Photo");
  const hintText  = hint  ?? (t ? t(hintKey)  : "Upload a square JPG/PNG");

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={inputId}>{labelText}</label>
      <input
        id={inputId}
        type="file"
        className="form-control"
        accept={accept}
        disabled={disabled}
        aria-describedby={hintText ? hintId : undefined}
        onChange={(e) => onFileChange?.(e.target.files?.[0] ?? null)}
      />
      {hintText && <div id={hintId} className="form-text">{hintText}</div>}
    </div>
  );
}
