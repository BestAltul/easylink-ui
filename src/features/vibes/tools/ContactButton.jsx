import React from "react";
import { FaGlobe } from "react-icons/fa";
import iconMap from "../../../data/contactIcons";
import { getContactLink } from "../../../data/contactLinks";

const getButtonColor = (type) => {
  switch (type) {
    case "instagram": return "linear-gradient(45deg, #fd5, #f54394, #fc6736)";
    case "whatsapp":  return "#eaffea";
    case "telegram":  return "#e8f7fe";
    case "phone":     return "#e9f0fd";
    case "website":   return "#f7f8fa";
    case "email":     return "#f7f8fa";
    default:          return "#f5f5f5";
  }
};

function toStr(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "value" in val) return String(val.value ?? "");
  return String(val ?? "");
}

export default function ContactButton({
  type,
  value,
  editMode = false,
  isEditing = false,
  editValue = "",
  inputKey, 
  onStartEdit,
  onEditChange,
  onCommitEdit,
  onCancelEdit,
  onChangeType, 
  
}) {
  const icon = iconMap[type] || <FaGlobe />;
  const color = getButtonColor(type);
  const displayValue = toStr(value);
  const isEmpty = !displayValue.trim();
  const placeholder = "enter value";

  const baseStyle = {
    minWidth: 140,
    height: 44,
    display: "flex",
    alignItems: "center",
    background: color,
    borderRadius: 22,
    boxShadow: "0 2px 8px #e9e9ee",
    padding: "0 12px",
    fontWeight: 500,
    fontSize: 16,
    color: "#222",
    border: "none",
    textDecoration: "none",
    gap: 10,
    overflow: "hidden",
  };
  const iconStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: 22,
    minWidth: 24,
    justifyContent: "center",
  };
  const textStyle = {
    flex: 1,
    minWidth: 0,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    lineHeight: "1.4",
    marginLeft: 6,
  };

  //edit mode
  if (editMode && isEditing) {
    const skipCommitRef = React.useRef(false);
    return (
      <div className="contact-btn" style={{ ...baseStyle, cursor: "text" }}>
        <span style={iconStyle}>{icon}</span>
        <input
          key={inputKey}
          autoFocus
          value={editValue ?? ""}
          onChange={(e) => onEditChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); onCommitEdit?.(e); }
            if (e.key === "Escape") { skipCommitRef.current = true; onCancelEdit?.(); }
          }}
          onBlur={() => {
            if (skipCommitRef.current) { skipCommitRef.current = false; return; }
            onCommitEdit?.();
          }}
          placeholder={placeholder}
          className="form-control form-control-sm"
          style={{
            ...textStyle,
            border: "none",
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            outline: "none",
          }}
        />
        {onChangeType && (
          <button
            type="button"
            title="Change type"
            onMouseDown={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              skipCommitRef.current = true; 
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeType();  
              setTimeout(() => { skipCommitRef.current = false; }, 0);
            }}
            className="btn btn-light btn-sm"
            style={{ padding: "2px 8px", borderRadius: 12, lineHeight: 1, marginLeft: 8 }}
          >
            ↩
          </button>
        )}
      </div>
    );
  }

  if (editMode) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`contact-btn${isEditing ? " contact-btn--editing" : ""}`}
        style={{ ...baseStyle, cursor: "text", position: "relative" }}
        onClick={onStartEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onStartEdit?.();
        }}
      >
        <span style={iconStyle}>{icon}</span>
        <span style={{ ...textStyle, color: isEmpty ? "#999" : "#222" }}>
          {isEmpty ? placeholder : displayValue}
        </span>

        {onChangeType && (
          <button
            type="button"
            title="Change type"
            onClick={(e) => { e.stopPropagation(); onChangeType(); }}
            className="btn btn-light btn-sm"
            style={{
              padding: "2px 8px",
              borderRadius: 12,
              lineHeight: 1,
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            ↩
          </button>
        )}
      </div>
    );
  }

  //view mode with link
  const href = getContactLink(type, displayValue);
  return (
    <a
      className="contact-btn"
      style={baseStyle}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span style={iconStyle}>{icon}</span>
      <span style={textStyle}>{displayValue}</span>
    </a>
  );
}
