import React from "react";
import { useTranslation } from "react-i18next";

export default function ExtraBlocksGeneric({
  t: tProp,                 
  ns,                       
  blocks = [],              // [{type, label, value, placeholder?}]
  onOpenPicker,             // () => void
  onChange,                 // (index, newValue) => void
  onRemove,                 // (index) => void
  titleKey = "additional_info",
  addKey = "add_info_block",
  removeKey = "remove_button_title",
  isDateType,               // (blockType) => boolean
}) {
  const { t: tNs } = useTranslation(ns);
  const t = tProp ?? tNs;
  const tr = (key, fallback) => (t ? t(key, fallback ?? key) : (fallback ?? key));

  return (
    <>
      <label className="form-label">{tr(titleKey, "Additional info")}</label>

      <button
        type="button"
        className="btn btn-outline-secondary w-100 mb-2"
        onClick={onOpenPicker}
      >
        {tr(addKey, "Add info block")}
      </button>

      {blocks.map((block, i) => (
        <div className="input-group mb-2" key={`${block.type}-${i}`}>
          <span className="input-group-text" style={{ minWidth: 80 }}>
            {block.label}
          </span>

          <input
            type={isDateType?.(block.type) ? "date" : "text"}
            className="form-control"
            placeholder={block.placeholder || ""}
            value={block.value}
            onChange={(e) => onChange(i, e.target.value)}
            required
          />

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => onRemove(i)}
            title={tr(removeKey, "Remove")}
            aria-label={tr(removeKey, "Remove")}
          >
            ×
          </button>
        </div>
      ))}
    </>
  );
}
