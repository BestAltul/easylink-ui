import React from "react";
import VibePreview from "@/features/vibes/components/VibePreview";

export default function MobilePreviewModal({
  open,
  onClose,
  t,
  name,
  description,
  photo,
  contacts,
  extraBlocks,
  type = "PERSONAL",
}) {
  if (!open) return null;
  return (
    <div
      className="modal d-block d-lg-none"
      tabIndex={-1}
      style={{
        background: "rgba(0,0,0,0.35)",
        position: "fixed",
        inset: 0,
        zIndex: 1050,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="previewTitle"
    >
      <div className="modal-dialog modal-fullscreen-sm-down modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="previewTitle" className="modal-title">
              {t ? t("preview_title") : "Preview"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <VibePreview
              name={name}
              description={description}
              photo={photo}
              contacts={contacts}
              type={type}
              extraBlocks={extraBlocks}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              {t ? t("close") : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
