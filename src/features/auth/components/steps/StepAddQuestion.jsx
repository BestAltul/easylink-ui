import React from "react";

export default function StepAddQuestion({ t, form }) {
  const isLastQuestion = form.entriesList.length + 1 === form.totalQuestions;

  return (
    <div
      className="card p-5 shadow-sm animate-fadein"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="mb-2 small text-muted" style={{ fontSize: 16 }}>
        {t("signup.step3_info")}
      </div>
      <h5 className="mb-3">
        {t("signup.step3_question")} {form.step - 2}{" "}
        {t("signup.step3_of", { total: form.totalQuestions })}
      </h5>

      {form.subStep === 0 && (
        <>
          <label className="form-label">{t("signup.step3_question")}</label>
          <select
            className="form-select mb-3"
            onChange={form.handleSelectQuestion}
            value={form.selectedQuestion}
          >
            <option value="">— {t("signup.step3_select")} —</option>
            <option value="custom">{t("signup.step3_custom")}</option>
            {form.questionTemplates.map((q, i) => (
              <option key={i} value={q.text}>
                {q.text}
              </option>
            ))}
          </select>
          {form.customQuestionVisible && (
            <>
              <label className="form-label">{t("signup.step3_custom_label")}</label>
              <input
                className="form-control mb-3"
                value={form.realQuestion}
                onChange={(e) => form.setRealQuestion(e.target.value)}
                placeholder={t("signup.step3_custom_label")}
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
              {t("signup.step3_next")}
            </button>
          </div>
        </>
      )}

      {form.subStep === 1 && (
        <>
          <label className="form-label">{t("signup.step3_hint")}</label>
          <input
            className="form-control mb-3"
            value={form.associativeQuestion}
            onChange={(e) => form.setAssociativeQuestion(e.target.value)}
            placeholder={t("signup.step3_hint_placeholder")}
            autoFocus
          />
          <div className="d-flex justify-content-between">
            <button className="btn btn-light px-4" onClick={() => form.setSubStep(0)}>
              {t("signup.step3_back")}
            </button>
            <button
              className="btn btn-primary px-4"
              disabled={!form.associativeQuestion.trim()}
              onClick={() => form.setSubStep(2)}
            >
              {t("signup.step3_next")}
            </button>
          </div>
        </>
      )}

      {form.subStep === 2 && (
        <>
          <label className="form-label">{t("signup.step3_answer")}</label>
          <div className="input-group mb-3">
            <input
              type={form.showAnswer ? "text" : "password"}
              className="form-control"
              placeholder={t("signup.step3_answer")}
              value={form.answerText}
              onChange={(e) => form.setAnswerText(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => form.setShowAnswer(!form.showAnswer)}
              tabIndex={-1}
            >
              <i
                className={`bi ${
                  form.showAnswer ? "bi-eye-slash" : "bi-eye"
                }`}
              ></i>
            </button>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-light px-4" onClick={() => form.setSubStep(1)}>
              {t("signup.step3_back")}
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
              {isLastQuestion ? t("signup.step3_create") : t("signup.step3_next")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
