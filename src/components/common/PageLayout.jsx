// PageLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageLayout({ title, children, showBackButton = true }) {
  const navigate = useNavigate();

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <div className="d-flex align-items-center mb-4">
        <h2 className="fw-bold mx-auto mb-0" style={{ letterSpacing: ".02em" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
