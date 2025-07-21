import React from "react";
import { FaKey, FaLock, FaBolt, FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const icons = [
  <FaKey size={30} style={{ color: "#efbd3e" }} />,
  <FaLock size={30} style={{ color: "#f4528e" }} />,
  <FaBolt size={30} style={{ color: "#a687e7" }} />,
  <FaUserCircle size={30} style={{ color: "#e6c455" }} />
];

const colors = ["#fff4b2", "#ffd6e7", "#f3e8ff", "#fff7d6"];

export default function About() {
  const { t } = useTranslation();

  // Секции шагов теперь берём из переводов
  const steps = t("about.steps", { returnObjects: true });

  return (
    <div className="container py-5" style={{ minHeight: 600 }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ letterSpacing: 2 }}>
          {t("about.title")}
        </h1>
        <p className="lead text-muted mb-0" style={{ maxWidth: 500, margin: "0 auto" }}>
          {t("about.subtitle")}
        </p>
      </div>

      {/* Steps */}
      <div className="row g-4 justify-content-center mb-4">
        {steps.map((step, index) => (
          <div className="col-md-3 col-12" key={index}>
            <div
              className="p-4 h-100 rounded-4 shadow-sm step-box position-relative"
              style={{
                backgroundColor: colors[index % colors.length],
                border: "1.5px solid #ebecef",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s",
                boxShadow: "0 3px 14px 0 #0002",
              }}
              tabIndex={0}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-6px) scale(1.04)"}
              onMouseOut={e => e.currentTarget.style.transform = "none"}
              onFocus={e => e.currentTarget.style.transform = "translateY(-6px) scale(1.04)"}
              onBlur={e => e.currentTarget.style.transform = "none"}
            >
              <div className="mb-2 text-center">{icons[index]}</div>
              <h5 className="mb-2 text-center" style={{ fontWeight: 600 }}>{step.title}</h5>
              <p className="text-muted mb-0 text-center" style={{ fontSize: 16 }}>{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="text-center mt-5 mb-4">
        <a
          href="/signup"
          className="btn btn-lg btn-warning rounded-pill px-4 shadow-sm fw-semibold"
          style={{
            background: "linear-gradient(90deg, #f8d442, #ffb877)",
            border: "none",
            fontSize: 19,
            boxShadow: "0 2px 18px 0 #f8d44266",
            letterSpacing: 1,
          }}
        >
          {t("about.cta")}
        </a>
      </div>

      {/* Mission */}
      <div
        className="rounded-4 shadow p-4 mt-3 mx-auto"
        style={{
          backgroundColor: "#f7fafd",
          maxWidth: 680,
        }}
      >
        <div className="mb-2 text-center" style={{ fontSize: 30 }}>🌟</div>
        <h4 className="mb-2 text-center fw-bold">{t("about.mission_title")}</h4>
        <p className="text-muted text-center mb-0" style={{ fontSize: 17 }}>
          {t("about.mission")}
        </p>
      </div>
    </div>
  );
}
