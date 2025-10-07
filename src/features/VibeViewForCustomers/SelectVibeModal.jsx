import React from "react";

export default function SelectVibeModal({
  availableVibes,
  selectedMyVibeId,
  setSelectedMyVibeId,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="modal-backdrop d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content p-4 shadow rounded bg-white"
        style={{ maxWidth: 500, width: "90%" }}
      >
        <h5>Select your Vibe to subscribe with:</h5>
        <ul className="list-group mb-3">
          {availableVibes.map((vibe) => (
            <li
              key={vibe.id}
              className={`list-group-item d-flex align-items-center gap-2 ${
                selectedMyVibeId === vibe.id ? "active" : ""
              }`}
              onClick={() => setSelectedMyVibeId(vibe.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  vibe.photo ? `/uploads/${vibe.photo}` : "/default-avatar.png"
                }
                alt="avatar"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>
                  {vibe.name || "Unnamed Vibe"}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {vibe.description
                    ? vibe.description.slice(0, 40) + "..."
                    : "No description"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    color: "#999",
                  }}
                >
                  {vibe.type || "Business"}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!selectedMyVibeId}
          >
            Confirm
          </button>
          <button className="btn btn-secondary ms-2" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
