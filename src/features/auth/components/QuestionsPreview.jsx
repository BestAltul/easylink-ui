import React from "react";
import { useTranslation } from "react-i18next";

export default function QuestionsPreview({ entriesList = [] }) {
  const { t } = useTranslation("signup");

  return (
    <div className="card mb-3 p-3 shadow-sm">
      <h6 className="mb-3">{t("questions_preview_title")}</h6>

      <ul className="list-group" role="list">
        {entriesList.map((entry, i) => {
          const key = entry?.id ?? entry?.realQuestion?.id ?? i;
          return (
            <li
              key={key}
              className="list-group-item d-flex flex-column align-items-start border-0 bg-light mb-2 rounded"
            >
              <span className="fw-semibold mb-1">
                {t("questions_preview_q")}{" "}
                {entry?.realQuestion?.text ?? "—"}
              </span>
              <span className="text-muted mb-1">
                {t("questions_preview_hint")}{" "}
                {entry?.associativeQuestion ?? "—"}
              </span>
              <span style={{ opacity: 0.6 }}>
                {t("questions_preview_answer")}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
