import React from "react";

function QuestionsPreview({ entriesList, t }) {
  return (
    <div className="card mb-3 p-3 shadow-sm">
      <h6 className="mb-3">{t("signup.questions_preview_title")}</h6>
      <ul className="list-group">
        {entriesList.map((entry, i) => (
          <li key={i} className="list-group-item d-flex flex-column align-items-start border-0 bg-light mb-2 rounded">
            <span className="fw-semibold mb-1">{t("signup.questions_preview_q")} {entry.realQuestion.text}</span>
            <span className="text-muted mb-1">{t("signup.questions_preview_hint")} {entry.associativeQuestion}</span>
            <span style={{ opacity: 0.5 }}>{t("signup.questions_preview_answer")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionsPreview;
