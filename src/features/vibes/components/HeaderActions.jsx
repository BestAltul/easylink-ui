import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/common/BackButton";
import { useTranslation } from "react-i18next";

export default function UserVibesHeaderActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center mb-4" style={{ minHeight: 54 }}>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
        <BackButton to="/profile" labelKey="myvibes.back" />
      </div>
      <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
        <h2 className="fw-bold mb-0" style={{ letterSpacing: ".02em" }}>
          {t("myvibes.title")}
        </h2>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-primary"
          style={{
            borderRadius: 12,
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
          }}
          onClick={() => navigate("/create-vibe")}
        >
          {t("myvibes.create")}
        </button>
      </div>
    </div>
  );
}
