// src/components/header/AccessCTA.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./AccessCTA.css";

export default function AccessCTA({
  subscribed = false,
  loading = false,
  onClick,
  className = "",
}) {
  const { t } = useTranslation("header");

  if (subscribed) {
    return (
      <div
        className={`access-cta access-cta--subscribed ${className}`}
        aria-live="polite"
        aria-label={t("subscribed")}
        title={t("subscribed")}
      >
        <span className="access-cta__icon" aria-hidden>🔓</span>
        <span className="access-cta__label">{t("subscribed")}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`access-cta ${className}`}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading ? "true" : "false"}
      aria-label={loading ? t("loading") : t("early_subscribtion")}
      title={t("lifetime_offer")}
    >
      <span className="access-cta__spark" aria-hidden>💎</span>
      <span className="access-cta__label">{t("join_now")}</span>
      <span className="access-cta__badge">{t("lifetime_free_first100")}</span>
    </button>
  );
}
