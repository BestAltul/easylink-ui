import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/BackButton";
import "./HeaderActions.css";

export default function HeaderActions() {
  const { t } = useTranslation("myvibes");
  const navigate = useNavigate();

  return (
    <header className="header-actions">
      <div className="header-actions__left">
        <BackButton
          to="/profile"
          label={
            <>
              <span className="btn-text-full">{t("back")}</span>
              <span className="btn-text-short">{t("back_short")}</span>
            </>
          }
          className="btn-secondary"
        />
      </div>

      <h2 className="header-actions__title">{t("title")}</h2>

      <div className="header-actions__right">
        <button
          type="button"
          className="btn-main"
          onClick={() => navigate("/create-vibe")}
        >
          <span className="btn-text-full">{t("create")}</span>
          <span className="btn-text-short">{t("create_short")}</span>
        </button>
      </div>
    </header>
  );
}
