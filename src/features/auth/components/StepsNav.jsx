import React from "react";

export default function StepsNav({ questions, currentStep, setCurrentStep, answersList, t }) {
  return (
    <ul className="list-group shadow-sm rounded-3" style={{ minWidth: 120 }}>
      {questions.map((q, idx) => (
        <li
          key={q.entryId}
          className={`list-group-item d-flex align-items-center gap-2 border-0 rounded-2 my-1 px-3 py-2 ${
            idx === currentStep ? "bg-success bg-opacity-10" : ""
          }`}
          style={{
            cursor: "pointer",
            fontWeight: idx === currentStep ? 600 : 400,
            transition: "background 0.2s",
          }}
          onClick={() => setCurrentStep(idx)}
        >
          <i
            className={`bi bi-${
              answersList[idx]?.trim()
                ? "check-circle-fill text-success"
                : "circle"
            }`}
          ></i>
          <span style={{ fontSize: 15 }}>
            {t("auth.q_number", { num: idx + 1 })}
          </span>
        </li>
      ))}
    </ul>
  );
}
