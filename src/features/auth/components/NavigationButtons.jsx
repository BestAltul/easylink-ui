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
    <div
      className="
        d-flex
        flex-column flex-sm-row              /* xs: колонка, ≥sm: в ряд */
        align-items-stretch align-items-sm-center
        justify-content-sm-center
        gap-2                                /* стабильный зазор между кнопками */
        mt-3
      "
      style={{ width: "100%" }}
    >
      {/* Back */}
      <button
        type="button"
        className="
          btn btn-outline-secondary
          d-flex align-items-center justify-content-center gap-2
          w-100 w-sm-auto                    /* xs: 100% ширины, ≥sm: авто */
          px-3 py-2                          /* компактнее на мобилке */
        "
        onClick={handleBack}
        disabled={isFirst}
      >
        <i className="bi bi-arrow-left" aria-hidden="true" />
        {t("back")}
      </button>

      {/* Next / Login */}
      <button
        type="button"
        className="
          btn btn-success
          d-flex align-items-center justify-content-center gap-2
          w-100 w-sm-auto                    /* xs: 100%, ≥sm: авто */
          px-4 py-2
        "
        onClick={handleNext}
        disabled={!canNext}
        /* на широких экранах пусть будет длиннее, на узких — адаптивно */
        style={{ minWidth: "min(140px, 48vw)" }}
        aria-label={isLast ? t("login") : t("next")}
      >
        {isLast ? t("login") : t("next")}
        <i className="bi bi-arrow-right" aria-hidden="true" />
      </button>
    </div>
  );
}
