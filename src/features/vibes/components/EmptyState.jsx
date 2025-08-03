import React from "react";
import { useTranslation } from "react-i18next";

export default function EmptyState() {
  const { t } = useTranslation();

  return (
    <div
      className="alert alert-secondary text-center"
      style={{ maxWidth: 500, margin: "30px auto" }}
    >
      <div style={{ fontSize: 54, marginBottom: 12 }}>🌊</div>
      {t("myvibes.no_vibes")}
      <br />
      <span style={{ fontSize: 15, color: "#68798a" }}>
        {t("myvibes.no_vibes_hint")}
      </span>
    </div>
  );
}
