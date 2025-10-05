import React from "react";
import { useTranslation } from "react-i18next";

export default function StepAddQuestion({ form }) {
  const { t } = useTranslation("signup");
  const isLastQuestion = form.entriesList.length + 1 === form.totalQuestions;

  return (
    <div className="card p-5 shadow-sm animate-fadein" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="mb-2 small text-muted" style={{ fontSize: 16 }}>
        {t("step3_info")}
      </div>

      <h5 className="mb-3">
        {t("step3_question")} {form.step - 2} {t("step3_of", { total: form.totalQuestions })}
      </h5>

      {form.subStep === 0 && (
        <>
          <label className="form-label" htmlFor="signup-question">{t("step3_question")}</label>
          <select
            id="signup-question"
            className="form-select mb-3"
            onChange={form.handleSelectQuestion}
            value={form.selectedQuestion}
          >
            <option value="">— {t("step3_select")} —</option>
            <option value="custom">{t("step3_custom")}</option>
            {form.questionTemplates.map((q, i) => (
              <option key={i} value={q.text}>{q.text}</option>
            ))}
          </select>

          {form.customQuestionVisible && (
            <>
              <label className="form-label" htmlFor="signup-custom-question">{t("step3_custom_label")}</label>
              <input
                id="signup-custom-question"
                className="form-control mb-3"
                value={form.realQuestion}
                onChange={(e) => form.setRealQuestion(e.target.value)}
                placeholder={t("step3_custom_label")}
                autoFocus
              />
            </>
          )}

          <div className="text-end">
            <button
              className="btn btn-primary px-4"
              disabled={
                (!form.customQuestionVisible && !form.selectedQuestion) ||
                (form.customQuestionVisible && !form.realQuestion.trim())
              }
              onClick={() => form.setSubStep(1)}
            >
              {t("step3_next")}
            </button>
          </div>
        </>
      )}

      {form.subStep === 1 && (
        <>
          <label className="form-label" htmlFor="signup-hint">{t("step3_hint")}</label>
          <input
            id="signup-hint"
            className="form-control mb-3"
            value={form.associativeQuestion}
            onChange={(e) => form.setAssociativeQuestion(e.target.value)}
            placeholder={t("step3_hint_placeholder")}
            autoFocus
          />
          <div className="d-flex justify-content-between">
            <button className="btn btn-light px-4" onClick={() => form.setSubStep(0)}>
              {t("step3_back")}
            </button>
            <button
              className="btn btn-primary px-4"
              disabled={!form.associativeQuestion.trim()}
              onClick={() => form.setSubStep(2)}
            >
              {t("step3_next")}
            </button>
          </div>
        </>
      )}

      {form.subStep === 2 && (
        <>
          <label className="form-label" htmlFor="signup-answer">{t("step3_answer")}</label>
          <div className="input-group mb-3">
            <input
              id="signup-answer"
              type={form.showAnswer ? "text" : "password"}
              className="form-control"
              placeholder={t("step3_answer")}
              value={form.answerText}
              onChange={(e) => form.setAnswerText(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => form.setShowAnswer(!form.showAnswer)}
              onMouseDown={(e) => e.preventDefault()} 
              tabIndex={-1}
              title={form.showAnswer ? "Hide" : "Show"}
            >
              <i className={`bi ${form.showAnswer ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-light px-4" onClick={() => form.setSubStep(1)}>
              {t("step3_back")}
            </button>
            <button
              style={{
                borderRadius: "12px",
                fontSize: "1.17rem",
                fontWeight: 600,
                minWidth: "145px",
                padding: "13px 35px",
                background: "linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)",
                color: "#fff",
                border: "none",
                boxShadow: "0 4px 20px rgba(34,211,238,0.09)",
                cursor: "pointer",
                transition: "filter 0.16s, transform 0.1s",
              }}
              disabled={!form.answerText.trim()}
              onClick={() => {
                form.handleAdd();
                form.setSubStep(0);
              }}
            >
              {isLastQuestion ? t("step3_create") : t("step3_next")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
