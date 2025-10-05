import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useScrollToHash from "@/components/legal/useScrollToHash";
import Section from "@/components/legal/Section";
import TOC from "@/components/legal/TOC";
import { useTranslation, Trans } from "react-i18next";
import { ADS_UPDATED_AT } from "@/pages/legal/versions";

const BRAND = "YouMeKnow (YMK)";
const CONTACT_EMAIL = "help.youmeknow@gmail.com";

function copyAnchor(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard?.writeText(url);
}

export default function Ads() {
  const { t } = useTranslation("legal_ads");
  useScrollToHash();

  const tocItems = [
    { id: "ads", label: t("toc.ads") },
    { id: "tracking", label: t("toc.tracking") },
    { id: "preferences", label: t("toc.preferences") },
    { id: "contact", label: t("toc.contact") }
  ];

  return (
    <main className="legal-container" id="content">
      <a href="#content" className="skip-link">{t("a11y.skip")}</a>

      <header className="legal-header" role="banner">
        <h1 className="legal-h1">{t("title")}</h1>
        <p className="legal-meta">
          <em>{t("updated", { date: ADS_UPDATED_AT })}</em>
        </p>
        <p className="legal-intro">{t("intro", { brand: BRAND })}</p>
        <TOC items={tocItems} title={t("toc.title")} />
      </header>

      <Section id="ads" title={t("sections.ads.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.ads.text1")}</p>
        <ul className="bulleted">
          <li>{t("sections.ads.items.labels")}</li>
          <li>{t("sections.ads.items.thirdparties")}</li>
          <li>{t("sections.ads.items.controls")}</li>
        </ul>
      </Section>

      <Section id="tracking" title={t("sections.tracking.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.tracking.text1")}</p>
        <details>
          <summary><strong>{t("sections.tracking.cookies.title")}</strong></summary>
          <ul>
            <li>{t("sections.tracking.cookies.items.essential")}</li>
            <li>{t("sections.tracking.cookies.items.analytics")}</li>
            <li>{t("sections.tracking.cookies.items.prefs")}</li>
          </ul>
        </details>
        <details>
          <summary><strong>{t("sections.tracking.sdks.title")}</strong></summary>
          <ul>
            <li>{t("sections.tracking.sdks.items.analytics")}</li>
            <li>{t("sections.tracking.sdks.items.ads")}</li>
          </ul>
        </details>
        <p className="note">
          <Trans
            i18nKey="sections.tracking.note"
            t={t}
            components={{ privacy: <Link to="/privacy" /> }}
          />
        </p>
      </Section>

      <Section id="preferences" title={t("sections.preferences.title")} copyAnchor={copyAnchor}>
        <ul className="bulleted">
          <li>
            <Trans
              i18nKey="sections.preferences.items.settings"
              t={t}
              components={{ settings: <Link to="/settings/privacy" /> }}
            />
          </li>
          <li>{t("sections.preferences.items.email")}</li>
          <li>{t("sections.preferences.items.dnt")}</li>
        </ul>
      </Section>

      <Section id="contact" title={t("sections.contact.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.contact.text", { email: CONTACT_EMAIL })}</p>
      </Section>

      <footer className="legal-footer">
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="back-to-top"
        >
          {t("back_to_top")}
        </a>
      </footer>
    </main>
  );
}
