import React from "react";
import { useTranslation } from "react-i18next";

export default function SidebarSteps({ step, totalQuestions }) {
  const { t } = useTranslation("signup");

  const LABELS = [
    t("step1_label"),
    t("step2_label"),
    t("step3_question"),
    t("step3_create"),
  ];

  return (
    <ul
      className="d-none d-md-flex flex-column align-items-start gap-4 mt-4 pe-4"
      style={{ minWidth: 260 }}
      role="list"
      aria-label={t("title")}
    >
      {[1, 2, 3, 4].map((s) => {
        const isActive = step === s || (s === 3 && step > 2 && step < totalQuestions + 3);
        const isDone = s < step || (s === 3 && step >= totalQuestions + 3);

        return (
          <li
            key={s}
            className="d-flex align-items-center gap-3"
            style={{
              minWidth: 200,
              fontWeight: isActive ? 700 : 400,
              fontSize: isActive ? 22 : 17,
              color: isActive ? "#0d6efd" : "#212529",
              letterSpacing: 0.1,
            }}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`badge d-flex align-items-center justify-content-center rounded-circle ${
                isDone ? "bg-success" : isActive ? "bg-primary" : "bg-light border"
              }`}
              style={{
                width: 44,
                height: 44,
                fontSize: 22,
              }}
              aria-hidden="true"
            >
              {isDone ? <i className="bi bi-check-lg" /> : s}
            </span>
            <span style={{ lineHeight: 1.15, textAlign: "left" }}>
              {LABELS[s - 1]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
