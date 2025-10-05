// Terms.jsx — aligned with Privacy.jsx structure + i18n keys
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useScrollToHash from "@/components/legal/useScrollToHash";
import Section from "@/components/legal/Section";
import TOC from "@/components/legal/TOC";
import { useTranslation, Trans } from "react-i18next";
import { TERMS_UPDATED_AT } from "@/pages/legal/versions";
import "./terms.css";

const BRAND = "YouMeKnow (YMK)";
const CONTACT_EMAIL = "help.youmeknow@gmail.com";

function copyAnchor(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard?.writeText(url);
}

export default function Terms() {
  const { t } = useTranslation("legal_terms");
  useScrollToHash();
  const tocItems = [
    { id: "acceptance", label: t("toc.acceptance") },
    { id: "accounts", label: t("toc.accounts") },
    { id: "use", label: t("toc.use") },
    { id: "liability", label: t("toc.liability") },
    { id: "contact", label: t("toc.contact") },
  ];

  return (
    <main className="legal-container" id="content">
      <a href="#content" className="skip-link">{t("a11y.skip")}</a>

      <header className="legal-header" role="banner">
        <h1 className="legal-h1">{t("title")}</h1>
        <p className="legal-meta">
          <em>{t("updated", { date: TERMS_UPDATED_AT })}</em>
        </p>
        <p className="legal-intro">{t("intro", { brand: BRAND })}</p>
        <TOC items={tocItems} title={t("toc.title")} />
      </header>

      <Section id="acceptance" title={t("sections.acceptance.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.acceptance.text1")}</p>
        <ul className="bulleted">
          <li>{t("sections.acceptance.items.read")}</li>
          <li>{t("sections.acceptance.items.updates")}</li>
          <li>{t("sections.acceptance.items.continue")}</li>
        </ul>
      </Section>

      <Section id="accounts" title={t("sections.accounts.title")} copyAnchor={copyAnchor}>
        <details open>
          <summary><strong>{t("sections.accounts.eligibility.title")}</strong></summary>
          <p>{t("sections.accounts.eligibility.text")}</p>
        </details>
        <details>
          <summary><strong>{t("sections.accounts.security.title")}</strong></summary>
          <ul>
            <li>{t("sections.accounts.security.items.credential")}</li>
            <li>{t("sections.accounts.security.items.notify")}</li>
          </ul>
        </details>
        <details>
          <summary><strong>{t("sections.accounts.termination.title")}</strong></summary>
          <p>{t("sections.accounts.termination.text")}</p>
        </details>
      </Section>

      <Section id="use" title={t("sections.use.title")} copyAnchor={copyAnchor}>
        <div className="legal-columns">
          <div>
            <h3 className="legal-h3">{t("sections.use.allowed.title")}</h3>
            <ul className="bulleted">
              <li>{t("sections.use.allowed.items.create")}</li>
              <li>{t("sections.use.allowed.items.share")}</li>
              <li>{t("sections.use.allowed.items.api")}</li>
            </ul>
          </div>
          <div>
            <h3 className="legal-h3">{t("sections.use.prohibited.title")}</h3>
            <ul className="bulleted">
              <li>{t("sections.use.prohibited.items.reverse")}</li>
              <li>{t("sections.use.prohibited.items.unlawful")}</li>
              <li>{t("sections.use.prohibited.items.integrity")}</li>
            </ul>
          </div>
        </div>

        {/* Use Trans so the link text lives in JSON: "... <privacy>Privacy Policy</privacy>." */}
        <p className="note">
          <Trans
            i18nKey="sections.use.note"
            t={t}
            components={{ privacy: <Link to="/privacy" /> }}
          />
        </p>
      </Section>

      <Section id="liability" title={t("sections.liability.title")} copyAnchor={copyAnchor}>
        <p className="caps">{t("sections.liability.disclaimer_caps")}</p>
        <p>{t("sections.liability.cap")}</p>
        <p>{t("sections.liability.indemnity", { brand: BRAND })}</p>
      </Section>

      <Section id="contact" title={t("sections.contact.title")} copyAnchor={copyAnchor}>
        <p>
          {t("sections.contact.text", { email: CONTACT_EMAIL })}{" "}
          <Trans
            i18nKey="sections.contact.links"
            t={t}
            components={{ privacy: <Link to="/privacy" /> }}
          />
        </p>
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
