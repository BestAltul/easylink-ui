import React from "react";

export default function ProgressBar({
  currentStep = 0,
  totalSteps = 1,
  colorClass = "bg-success",
  height = 7,
  className = "",
  label,
  labelId,
}) {
  const max = Math.max(1, totalSteps);
  const now = Math.min(Math.max(0, currentStep), max);
  const percent = (now / max) * 100;

  return (
    <div className={`progress mb-3 ${className}`} style={{ height }}>
      <div
        className={`progress-bar ${colorClass}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={now}
        aria-valuetext={label ? `${label} (${now}/${max})` : `${now}/${max}`}
        aria-labelledby={labelId}
        style={{ width: `${percent}%`, transition: "width 0.4s" }}
      >
        {/* Bootstrap 5: visually-hidden (sr-only — в v4) */}
        <span className="visually-hidden">{Math.round(percent)}%</span>
      </div>
    </div>
  );
}
