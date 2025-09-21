import React from "react";
import { useTranslation } from "react-i18next";

export default function EmptyState({ emoji = "🌊", className = "" }) {
  const { t } = useTranslation("myvibes");

  return (
    <div
      className={`alert alert-secondary text-center ${className}`}
      role="status"
      aria-live="polite"
      style={{ maxWidth: 500, margin: "30px auto" }}
    >
      <div aria-hidden="true" style={{ fontSize: 54, marginBottom: 12 }}>
        {emoji}
      </div>
      <div>{t("no_vibes")}</div>
      <div className="mt-1" style={{ fontSize: 15, color: "#68798a" }}>
        {t("no_vibes_hint")}
      </div>
    </div>
  );
}
