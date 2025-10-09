// Privacy.jsx — split + i18n keys
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useScrollToHash from "@/components/legal/useScrollToHash";
import Section from "@/components/legal/Section";
import TOC from "@/components/legal/TOC";
import ProcessorTable from "@/components/legal/ProcessorTable";
import { Trans, useTranslation } from "react-i18next";
import { PRIVACY_UPDATED_AT } from "@/pages/legal/versions";
import "./privacy.css";

const CONTACT_EMAIL = "help.youmeknow@gmail.com";
const BRAND = "YouMeKnow (YMK)";

function copyAnchor(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard?.writeText(url);
}

export default function Privacy() {
  const { t } = useTranslation("legal_privacy");
  useScrollToHash();

  const tocItems = [
    { id: "data-we-collect", label: t("toc.data") },
    { id: "how-we-use", label: t("toc.use") },
    { id: "legal-bases", label: t("toc.bases") },
    { id: "sharing", label: t("toc.sharing") },
    { id: "cookies", label: t("toc.cookies") },
    { id: "choices", label: t("toc.choices") },
    { id: "retention", label: t("toc.retention") },
    { id: "security", label: t("toc.security") },
    { id: "international", label: t("toc.international") },
    { id: "children", label: t("toc.children") },
    { id: "changes", label: t("toc.changes") },
    { id: "contact", label: t("toc.contact") },
  ];

  const processorHeaders = [
    t("table.provider"),
    t("table.purpose"),
    t("table.categories"),
    t("table.region"),
  ];

  const processors = [
    {
      provider: "Amplitude",
      purpose: t("processors.amplitude.purpose"),
      categories: t("processors.amplitude.categories"),
      region: t("processors.amplitude.region"),
    },
    {
      provider: t("processors.smtp.name"),
      purpose: t("processors.smtp.purpose"),
      categories: t("processors.smtp.categories"),
      region: t("processors.smtp.region"),
    },
    {
      provider: t("processors.cloud.name"),
      purpose: t("processors.cloud.purpose"),
      categories: t("processors.cloud.categories"),
      region: t("processors.cloud.region"),
    },
  ];

  return (
    <main className="legal-container" id="content">
      <a href="#content" className="skip-link">{t("a11y.skip")}</a>

      <header className="legal-header" role="banner">
        <h1 className="legal-h1">{t("title")}</h1>
        <p className="legal-meta">
          <em>{t("updated", { date: PRIVACY_UPDATED_AT })}</em>
        </p>
        <p className="legal-intro">
          {t("intro", { brand: BRAND })}
        </p>
        <TOC items={tocItems} title={t("toc.title")} />
      </header>

      <Section id="data-we-collect" title={t("sections.data.title")} copyAnchor={copyAnchor}>
        <details open>
          <summary><strong>{t("sections.data.account.title")}</strong></summary>
          <ul>
            <li>{t("sections.data.account.items.identifiers")}</li>
            <li>{t("sections.data.account.items.auth")}</li>
            <li>{t("sections.data.account.items.vibe")}</li>
          </ul>
        </details>

        <details>
          <summary><strong>{t("sections.data.usage.title")}</strong></summary>
          <ul>
            <li>{t("sections.data.usage.items.events")}</li>
            <li>{t("sections.data.usage.items.device")}</li>
          </ul>
        </details>

        <details>
          <summary><strong>{t("sections.data.support.title")}</strong></summary>
          <ul>
            <li>{t("sections.data.support.items.messages")}</li>
            <li>{t("sections.data.support.items.billing")}</li>
          </ul>
        </details>

        <p className="note">{t("sections.data.note")}</p>
      </Section>

      <Section id="how-we-use" title={t("sections.use.title")} copyAnchor={copyAnchor}>
        <ul className="bulleted">
          <li>{t("sections.use.items.provide")}</li>
          <li>{t("sections.use.items.improve")}</li>
          <li>{t("sections.use.items.personalize")}</li>
          <li>{t("sections.use.items.security")}</li>
          <li>{t("sections.use.items.communicate")}</li>
          <li>
            <Trans
              i18nKey="sections.use.items.legal"
              ns="legal_privacy"
              values={{ terms: t("terms") }}
              components={{ termsLink: <Link to="/terms" /> }}
            />
          </li>
        </ul>
      </Section>

      <Section id="legal-bases" title={t("sections.bases.title")} copyAnchor={copyAnchor}>
        <ul className="bulleted">
          <li><strong>{t("sections.bases.items.contract.title")}</strong>: {t("sections.bases.items.contract.text")}</li>
          <li><strong>{t("sections.bases.items.legit.title")}</strong>: {t("sections.bases.items.legit.text")}</li>
          <li><strong>{t("sections.bases.items.consent.title")}</strong>: {t("sections.bases.items.consent.text")}</li>
          <li><strong>{t("sections.bases.items.obligation.title")}</strong>: {t("sections.bases.items.obligation.text")}</li>
        </ul>
      </Section>

      <Section id="sharing" title={t("sections.sharing.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.sharing.intro")}</p>
        <ProcessorTable rows={processors} headers={processorHeaders} />
        <p>{t("sections.sharing.note", { brand: BRAND })}</p>
      </Section>

      <Section id="cookies" title={t("sections.cookies.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.cookies.intro")}</p>
        <ul className="bulleted">
          <li><strong>{t("sections.cookies.items.essential.title")}</strong>: {t("sections.cookies.items.essential.text")}</li>
          <li><strong>{t("sections.cookies.items.analytics.title")}</strong>: {t("sections.cookies.items.analytics.text")}</li>
          <li><strong>{t("sections.cookies.items.prefs.title")}</strong>: {t("sections.cookies.items.prefs.text")}</li>
        </ul>
        <p>
          <Trans
            i18nKey="sections.cookies.controls"
            ns="legal_privacy"
            values={{ privacy: t("links.privacy_settings") }}
            components={{ privacyLink: <Link to="/settings/privacy" /> }}
          />
        </p>
        <p>{t("sections.cookies.dnt")}</p>
      </Section>

      <Section id="choices" title={t("sections.choices.title")} copyAnchor={copyAnchor}>
        <ul className="bulleted">
          <li>
            <Trans
              i18nKey="sections.choices.items.manage"
              ns="legal_privacy"
              values={{ account: t("links.account_settings") }}
              components={{ accountLink: <Link to="/settings/account" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="sections.choices.items.optout"
              ns="legal_privacy"
              values={{ privacy: t("links.privacy_settings") }}
              components={{ privacyLink: <Link to="/settings/privacy" /> }}
            />
          </li>
          <li>{t("sections.choices.items.rights")}</li>
        </ul>
        <p>
          {t("sections.choices.contact", { email: CONTACT_EMAIL })}
        </p>
      </Section>

      <Section id="retention" title={t("sections.retention.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.retention.text")}</p>
      </Section>

      <Section id="security" title={t("sections.security.title")} copyAnchor={copyAnchor}>
        <ul className="bulleted">
          <li>{t("sections.security.items.transport")}</li>
          <li>{t("sections.security.items.controls")}</li>
          <li>{t("sections.security.items.vuln")}</li>
        </ul>
        <p>{t("sections.security.disclaimer")}</p>
      </Section>

      <Section id="international" title={t("sections.international.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.international.text")}</p>
      </Section>

      <Section id="children" title={t("sections.children.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.children.text")}</p>
      </Section>

      <Section id="changes" title={t("sections.changes.title")} copyAnchor={copyAnchor}>
        <p>{t("sections.changes.text")}</p>
      </Section>

      <Section id="contact" title={t("sections.contact.title")} copyAnchor={copyAnchor}>
        <p>
          {t("sections.contact.text", { email: CONTACT_EMAIL })}{" "}
          <Trans
            i18nKey="sections.contact.links"
            ns="legal_privacy"
            values={{ terms: t("terms"), ads: t("ads") }}
            components={{
              termsLink: <Link to="/terms" />,
              adsLink: <Link to="/ads" />
            }}
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
