import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";

export default function HeaderActions() {
  const { t } = useTranslation("myvibes");
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center mb-4" style={{ minHeight: 54 }}>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
        <BackButton to="/profile" label={t("back")} />
      </div>

      <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
        <h2 className="fw-bold mb-0" style={{ letterSpacing: ".02em" }}>
          {t("title")}
        </h2>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{
            borderRadius: 12,
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
          }}
          onClick={() => navigate("/create-vibe")}
          aria-label={t("create")}
        >
          {t("create")}
        </button>
      </div>
    </div>
  );
}
