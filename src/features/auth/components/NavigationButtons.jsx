import React from "react";
import { useTranslation } from "react-i18next";

export default function NavigationButtons({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  inputAnswer = "",
}) {
  const { t } = useTranslation("auth");

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const canNext = inputAnswer.trim().length > 0;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button
        type="button"
        className="btn btn-outline-secondary px-3"
        onClick={handleBack}
        disabled={isFirst}
        aria-disabled={isFirst}
      >
        <i className="bi bi-arrow-left" aria-hidden="true" /> {t("back")}
      </button>

      <button
        type="button"
        className="btn btn-success px-4"
        onClick={handleNext}
        disabled={!canNext}
        aria-disabled={!canNext}
        aria-label={isLast ? t("login") : t("next")}
      >
        {isLast ? t("login") : t("next")}
        <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
      </button>
    </div>
  );
}
