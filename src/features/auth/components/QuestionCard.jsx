import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function QuestionCard({
  keyProp,
  question,
  inputRef,
  inputAnswer,
  setInputAnswer,
  showPassword,
  setShowPassword,
  handleKeyDown,
  currentStep,
  totalQuestions,
}) {
  const { t } = useTranslation("auth");
  const inputId = `auth-answer-${currentStep}`;

  return (
    <motion.div
      key={keyProp}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="card shadow-lg p-4 rounded-4 border-0"
      style={{ minHeight: 240 }}
    >
      {totalQuestions > 1 && (
        <div className="mb-1 text-muted" style={{ fontSize: 14 }}>
          {t("progress", { current: currentStep + 1, total: totalQuestions })}
        </div>
      )}

      <label htmlFor={inputId} className="mb-2 fw-semibold" style={{ fontSize: 18 }}>
        {question}
      </label>

      <div className="text-secondary mb-3" style={{ fontSize: 13 }}>
        {t("case_insensitive")}
      </div>

      <div className="input-group mb-2">
        <input
          id={inputId}
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          className="form-control"
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("answer_placeholder")}
          spellCheck={false}
          autoComplete="off"
          style={{ borderRadius: "14px 0 0 14px" }}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          onMouseDown={(e) => e.preventDefault()}
          title={showPassword ? "Hide" : "Show"}
        >
          <i className={`bi bi-eye${showPassword ? "-slash" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}
