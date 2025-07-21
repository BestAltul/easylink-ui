import React from "react";

function SidebarSteps({ step, totalQuestions, STEP_LABELS }) {
  return (
    <div
      className="d-none d-md-flex flex-column align-items-start gap-4 mt-4 pe-4"
      style={{ minWidth: 260 }}
    >
      {[1, 2, 3, 4].map((s, idx) => {
        const isActive = step === s || (s === 3 && step > 2 && step < totalQuestions + 3);
        const isDone = (s < step) || (s === 3 && step >= totalQuestions + 3);
        return (
          <div
            key={s}
            className="d-flex align-items-center gap-3"
            style={{
              minWidth: 200,
              fontWeight: isActive ? 700 : 400,
              fontSize: isActive ? 22 : 17,
              color: isActive ? "#0d6efd" : "#212529",
              letterSpacing: 0.1,
            }}
          >
            <span
              className={`badge d-flex align-items-center justify-content-center rounded-circle ${isDone ? "bg-success" : isActive ? "bg-primary" : "bg-light border"}`}
              style={{
                width: 44,
                height: 44,
                fontSize: 22,
                boxShadow: isActive ? "0 0 0 3px #e2f8e5" : "none"
              }}
            >
              {isDone ? <i className="bi bi-check-lg"></i> : s}
            </span>
            <span style={{ lineHeight: 1.15, textAlign: "left" }}>{STEP_LABELS[s - 1]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SidebarSteps;
