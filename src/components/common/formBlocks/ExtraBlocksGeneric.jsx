import React from "react";

export default function ExtraBlocksGeneric({
  t,
  blocks,               // [{type, label, value, placeholder?}]
  onOpenPicker,         // () => void — open
  onChange,             // (index, newValue) => void
  onRemove,             // (index) => void
  titleKey,             // "event_form.info_label" | "personal_form.additional_info"
  addKey,               // "event_form.add_info_block" | "personal_form.add_info_block"
  isDateType,           // (blockType) => boolean  (for ex., type === 'date' | 'birthday')
}) {
  return (
    <>
      <label className="form-label">{t ? t(titleKey) : "Additional info"}</label>
      <button
        type="button"
        className="btn btn-outline-secondary w-100 mb-2"
        onClick={onOpenPicker}
      >
        {t ? t(addKey) : "Add info block"}
      </button>

      {blocks.map((block, i) => (
        <div className="input-group mb-2" key={i}>
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
            title={t ? t("personal_form.remove_button_title") : "Remove"}
          >
            ×
          </button>
        </div>
      ))}
    </>
  );
}
