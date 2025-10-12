import React from "react";
import { useNavigate } from "react-router-dom";

export default function VibeCircleCard({ vibe }) {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const src = vibe.photo?.startsWith("/uploads")
    ? `${API_BASE}${vibe.photo}`
    : vibe.photo || "/default-avatar.png";

  const handleOpen = () => navigate(`/vibes/${vibe.id}`);

  return (
    <div
      className="card mb-3 shadow-sm"
      style={{ borderRadius: "1rem", cursor: "pointer" }}
      onClick={handleOpen}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            src={src}
            alt="Vibe"
            className="rounded-circle me-3"
            width="56"
            height="56"
            style={{ objectFit: "cover" }}
          />
          <div>
            <h6 className="mb-0 fw-semibold">{vibe.name}</h6>
            <small className="text-muted">{vibe.type || "Vibe"}</small>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          Open
        </button>
      </div>
    </div>
  );
}
