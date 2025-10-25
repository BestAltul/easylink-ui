import React from "react";
import { useTranslation } from "react-i18next";
import { IconZap, IconBarChart } from "../icons/Icons";

export default function PanelOther() {
  const { t } = useTranslation("home");

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <article className="feature glass h-100 p-4">
          <div className="feature__icon" aria-hidden="true"><IconZap /></div>
          <h3 className="feature__title">
            {t("other.mode_title", "Other mode")}
          </h3>
          <p className="feature__text">
            {t("other.mode_text", "Flexible Vibe type for events, portfolios, or anything unique.")}
          </p>
        </article>
      </div>
      <div className="col-12 col-md-6">
        <article className="feature glass h-100 p-4">
          <div className="feature__icon" aria-hidden="true"><IconBarChart /></div>
          <h3 className="feature__title">
            {t("other.stats_title", "Live stats")}
          </h3>
          <p className="feature__text">
            {t("other.stats_text", "Track visits and engagement in real time to see what resonates.")}
          </p>
        </article>
      </div>
    </div>
  );
}
