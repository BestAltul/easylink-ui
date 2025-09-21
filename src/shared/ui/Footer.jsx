import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__links">
        <Link to="/terms">{t("terms")}</Link>
        <Link to="/privacy">{t("privacy")}</Link>
        <Link to="/ads">{t("ads")}</Link>
      </div>

      <div className="footer__address">
        © {year} {t("brand")}. {t("copyright")}
      </div>
    </footer>
  );
}
