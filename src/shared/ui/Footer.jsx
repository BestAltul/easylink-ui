import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__links">
        <a href="/terms">{t("footer.terms")}</a>
        <a href="/privacy">{t("footer.privacy")}</a>
        <a href="/ads">{t("footer.ads")}</a>
      </div>

      <div className="footer__address">
        © {new Date().getFullYear()} {t("footer.brand")}. {t("footer.copyright")}
      </div>
    </footer>
  );
}
