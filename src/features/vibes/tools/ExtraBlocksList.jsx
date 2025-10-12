import React from "react";
import ExtraBlockView from "@/components/InfoBlocks/ExtraBlock";
import HoursBlock from "@/components/InfoBlocks/HoursBlock";

function isHours(block) {
  return String(block?.type || "").toLowerCase() === "hours";
}
function isBirthday(block) {
  return String(block?.type || "").toLowerCase() === "birthday";
}
function toISODateValue(val) {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ExtraBlocksList({
  extraBlocks = [],
  editMode = false,
  onBlockChange,
  onBlockRemove,
  onOpenBlockPicker,
}) {
  if (!extraBlocks?.length && !editMode) return null;

  return (
    <div className="w-100 mt-2">
      {!extraBlocks?.length && editMode && (
         <div
            className="text-muted mb-2"
            style={{
            textAlign: "center",
            marginTop: "0.5rem",
            }}
        >
            No extra blocks yet
        </div>
      )}

      {extraBlocks.map((block, i) => {
        // VIEW
        if (!editMode) {
          return (
            <ExtraBlockView
              key={block.id || block.label || `${block.type || "extra"}-${i}`}
              block={block}
            />
          );
        }

        // EDIT 
        if (isHours(block)) {
          return (
            <HoursBlock
              key={block.id || `hours-${i}`}
              value={block.value || {}}
              onChange={(val) => onBlockChange?.(i, val)}
              onRemove={() => onBlockRemove?.(i)}
            />
          );
        }

        // (city, birthday, custom)
        const inputType = isBirthday(block) ? "date" : "text";
        const value = isBirthday(block)
          ? toISODateValue(block.value ?? "")
          : (block.value ?? "");

        return (
          <div
            key={block.id || `${block.type || "extra"}-${i}`}
            className="mb-2 px-3 py-2 rounded-3"
            style={{
              background: "#f7f9fd",
              borderLeft: "4px solid #637bfd",
              fontSize: 15,
              color: "#3a405a",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>{block.label || "Field"}</strong>
              {onBlockRemove && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onBlockRemove(i)}
                >
                  ×
                </button>
              )}
            </div>
            <input
              type={inputType}
              className="form-control"
              placeholder={block.placeholder || ""}
              value={value}
              onChange={(e) => onBlockChange?.(i, e.target.value)}
            />
          </div>
        );
      })}

      {editMode && (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm d-block mx-auto mt-2"
          onClick={() => onOpenBlockPicker?.(null)}
        >
          + Add info
        </button>
      )}
    </div>
  );
}
