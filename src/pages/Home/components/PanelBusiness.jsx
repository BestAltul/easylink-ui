import React from "react";
import { useTranslation } from "react-i18next";
import { IconBarChart, IconShield } from "../icons/Icons";

export default function PanelBusiness() {
  const { t } = useTranslation("home");

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <article className="feature glass h-100 p-4">
          <div className="feature__icon" aria-hidden="true"><IconBarChart /></div>
          <h3 className="feature__title">
            {t("business.offers_title", "Offers & analytics")}
          </h3>
          <p className="feature__text">
            {t("business.offers_text", "Promote offers and see views, shares and conversions in one place.")}
          </p>
        </article>
      </div>
      <div className="col-12 col-md-6">
        <article className="feature glass h-100 p-4">
          <div className="feature__icon" aria-hidden="true"><IconShield /></div>
          <h3 className="feature__title">
            {t("business.team_title", "Team-ready")}
          </h3>
          <p className="feature__text">
            {t("business.team_text", "Multiple admins, branded QR, share presets for events and campaigns.")}
          </p>
        </article>
      </div>
    </div>
  );
}
