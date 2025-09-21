import React from "react";
import { useTranslation } from "react-i18next";

export default function StepChooseQuestionsCount({ form }) {
  const { t } = useTranslation("signup");

  return (
    <div className="card p-5 shadow-sm animate-fadein text-center">
      <div className="mb-4 small text-muted" style={{ fontSize: 18 }}>
        {t("step2_info")}
      </div>

      <label className="form-label mb-4" style={{ fontSize: 20 }}>
        {t("step2_label")}
      </label>

      <div
        className="d-flex justify-content-center flex-wrap gap-3 mb-2"
        style={{ rowGap: "1rem" }}
        role="group"
        aria-label={t("step2_label")}
      >
        {[1, 2, 3, 4, 5].map((num) => {
          const active = form.totalQuestions === num;
          return (
            <button
              key={num}
              type="button"
              aria-pressed={active}
              onClick={() => {
                form.setTotalQuestions(num);
                form.setStep(3);
              }}
              className={`btn shadow-sm d-flex align-items-center justify-content-center ${
                active ? "btn-success" : "btn-outline-success"
              }`}
              style={{
                width: 60,
                height: 60,
                fontSize: "1.5rem",
                borderRadius: "50%",
                boxShadow: active ? "0 2px 10px #b2f2d2" : "0 1px 3px #eee",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
