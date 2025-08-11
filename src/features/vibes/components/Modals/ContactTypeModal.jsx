import React from "react";
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";
import { FaGlobe } from "react-icons/fa";

export default function ContactTypeModal({ contacts = [], onSelect, onClose }) {
  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{
        background: "rgba(0, 0, 0, 0.25)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Choose Contact Type</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body d-flex flex-wrap gap-2">
            {CONTACT_TYPES.map((type) => (
              <button
                key={type.key}
                className="btn btn-light"
                style={{
                  width: 110,
                  height: 70,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 14,
                }}
                onClick={() => onSelect(type.key)}
                disabled={contacts.some((c) => c.type === type.key)}
              >
                <div style={{ fontSize: 24 }}>
                  {iconMap[type.key] || <FaGlobe />}
                </div>
                <div>{type.label}</div>
              </button>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary w-100" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
