import React from "react";

export default function StepChooseQuestionsCount({ t, form }) {
  return (
    <div className="card p-5 shadow-sm animate-fadein text-center">
      <div className="mb-4 small text-muted" style={{ fontSize: 18 }}>
        {t("signup.step2_info")}
      </div>
      <label className="form-label mb-4" style={{ fontSize: 20 }}>
        {t("signup.step2_label")}
      </label>
      <div
        className="d-flex justify-content-center flex-wrap gap-3 mb-2"
        style={{ rowGap: "1rem" }}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            style={{
              width: "60px",
              height: "60px",
              fontSize: "1.5rem",
              borderRadius: "50%",
              boxShadow:
                form.totalQuestions === num
                  ? "0 2px 10px #b2f2d2"
                  : "0 1px 3px #eee",
              fontWeight: 700,
              flexShrink: 0, 
            }}
            className={`btn shadow-sm d-flex align-items-center justify-content-center ${
              form.totalQuestions === num ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => {
              form.setTotalQuestions(num);
              form.setStep(3);
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
