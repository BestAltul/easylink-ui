import React from "react";

export default function ProgressBar({ currentStep, totalSteps }) {
  const percent = (currentStep / totalSteps) * 100;

  return (
    <div className="progress mb-3" style={{ height: "7px" }}>
      <div
        className="progress-bar bg-success"
        style={{
          width: `${percent}%`,
          transition: "width 0.4s",
        }}
      />
    </div>
  );
}
