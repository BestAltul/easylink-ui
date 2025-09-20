import React from "react";

export default function InfoAlert({ t, onClose }) {
  return (
    <div className="alert alert-info d-flex align-items-center justify-content-between" style={{ fontSize: 15 }}>
      <div>
        <b>{t("personal_form.alert_title")}</b> {t("personal_form.alert_desc")}<br/>
        <span className="text-danger">{t("personal_form.alert_warn")}</span>
      </div>
      <button type="button" className="btn-close ms-2" aria-label="Close" onClick={onClose} style={{ filter:"invert(0.5)" }}/>
    </div>
  );
}
