import React from "react";
import { useTranslation } from "react-i18next";

export default function StepsNav({
  questions,
  currentStep,
  setCurrentStep,
  answersList,
}) {
  const { t } = useTranslation("auth");

  const onKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCurrentStep(idx);
    }
  };

  return (
    <ul className="list-group shadow-sm rounded-3" style={{ minWidth: 120 }}>
      {questions.map((q, idx) => {
        const isActive = idx === currentStep;
        const answered = Boolean(answersList[idx]?.trim());
        return (
          <li
            key={q.entryId}
            className={`list-group-item d-flex align-items-center gap-2 border-0 rounded-2 my-1 px-3 py-2 ${
              isActive ? "bg-success bg-opacity-10" : ""
            }`}
            style={{
              cursor: "pointer",
              fontWeight: isActive ? 600 : 400,
              transition: "background 0.2s",
            }}
            tabIndex={0}
            aria-selected={isActive}
            onClick={() => setCurrentStep(idx)}
            onKeyDown={(e) => onKeyDown(e, idx)}
          >
            <i
              className={`bi bi-${
                answered ? "check-circle-fill text-success" : "circle"
              }`}
              aria-hidden="true"
            />
            <span style={{ fontSize: 15 }}>
              {t("q_number", { num: idx + 1 })}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
