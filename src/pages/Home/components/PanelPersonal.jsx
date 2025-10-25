import React from "react";
import { useTranslation } from "react-i18next";
import { IconZap, IconShield } from "../icons/Icons";

export default function PanelPersonal() {
  const { t } = useTranslation("home");

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <article className="feature glass h-100 p-4">
          <div className="feature__icon" aria-hidden="true"><IconZap /></div>
          <h3 className="feature__title">
            {t("personal.title", "Personal Vibe")}
          </h3>
          <p className="feature__text">
            {t("personal.text", "Share your links, contact buttons and a quick intro. QR in one tap.")}
          </p>
        </article>
      </div>
      <div className="col-12 col-md-6">
        <article className="feature glass h-100 p-4">
          <div className="feature__icon" aria-hidden="true"><IconShield /></div>
          <h3 className="feature__title">
            {t("personal.privacy_title", "Privacy layers")}
          </h3>
          <p className="feature__text">
            {t("personal.privacy_text", "Control visibility by audience: public, friends, private.")}
          </p>
        </article>
      </div>
    </div>
  );
}
