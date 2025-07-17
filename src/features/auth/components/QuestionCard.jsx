import React from "react";
import { motion } from "framer-motion";

export default function QuestionCard({
  keyProp,
  question,
  inputRef,
  inputAnswer,
  setInputAnswer,
  showPassword,
  setShowPassword,
  handleKeyDown,
  t,
  currentStep,
  totalQuestions,
}) {
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
      <div className="mb-1 text-muted" style={{ fontSize: 14 }}>
        {totalQuestions > 1 &&
          t("auth.progress", {
            current: currentStep + 1,
            total: totalQuestions,
          })}
      </div>
      <div className="mb-2 fw-semibold" style={{ fontSize: 18 }}>
        {question}
      </div>
      <div className="text-secondary mb-3" style={{ fontSize: 13 }}>
        {t("auth.case_insensitive")}
      </div>
      <div className="input-group mb-2">
        <input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          className="form-control"
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("auth.answer_placeholder")}
          style={{ borderRadius: "14px 0 0 14px" }}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => setShowPassword((v) => !v)}
        >
          <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
        </button>
      </div>
    </motion.div>
  );
}
