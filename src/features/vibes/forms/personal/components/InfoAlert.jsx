import React from "react";
import { useTranslation } from "react-i18next";

export default function InfoAlert({ onClose }) {
  const { t } = useTranslation("personal_form");

  return (
    <div
      className="alert alert-info d-flex align-items-center justify-content-between"
      style={{ fontSize: 15 }}
      role="alert"
      aria-live="polite"
    >
      <div>
        <b>{t("alert_title")}</b> {t("alert_desc")}<br/>
        <span className="text-danger">{t("alert_warn")}</span>
      </div>
      <button
        type="button"
        className="btn-close ms-2"
        aria-label={t("close")}
        onClick={onClose}
        style={{ filter: "invert(0.5)" }}
      />
    </div>
  );
}
