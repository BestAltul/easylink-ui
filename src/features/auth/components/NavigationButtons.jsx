import React from "react";

export default function NavigationButtons({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  inputAnswer,
  t,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button
        className="btn btn-outline-secondary px-3"
        onClick={handleBack}
        disabled={currentStep === 0}
      >
        <i className="bi bi-arrow-left"></i> {t("auth.back")}
      </button>
      <button
        className="btn btn-success px-4"
        onClick={handleNext}
        disabled={!inputAnswer.trim()}
      >
        {currentStep === totalSteps - 1 ? t("auth.login") : t("auth.next")}
        <i className="bi bi-arrow-right ms-2"></i>
      </button>
    </div>
  );
}
