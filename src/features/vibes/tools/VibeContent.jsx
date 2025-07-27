import React from "react";
import Avatar from "./Avatar";
import ExtraBlock from "./ExtraBlock";
import ContactButton from "./ContactButton";
import { QRCodeCanvas } from "qrcode.react";
import useVisibilityToggle from "../useVisibilityToggle.jsx";

export default function VibeContent({
  id,
  name,
  description,
  photoFile,
  contacts,
  type,
  extraBlocks,
  visible,
  publicCode,
}) {
  console.log("Inital visible, code", visible, publicCode);
  const [vibeVisible, code, visibilityButton] = useVisibilityToggle(
    id,
    visible,
    publicCode
  );

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="mb-3 w-100 px-3">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            {visibilityButton}
            {vibeVisible && code && (
              <div
                className="text-primary fw-bold d-flex align-items-center"
                style={{ fontSize: "1.15rem" }}
              >
                <span style={{ marginRight: 4 }}>Share code:</span>
                <strong>{code}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <Avatar name={name} photoFile={photoFile} />
      <h3 className="mb-0" style={{ fontWeight: 700 }}>
        {name || "Your Name"}
      </h3>
      <div
        className="text-primary mb-2"
        style={{ fontWeight: 600, textTransform: "uppercase" }}
      >
        {type?.charAt(0).toUpperCase() + type?.slice(1) || "Business"}
      </div>
      <div
        style={{
          background: "rgba(250, 250, 255, 0.92)",
          border: "1.5px solid #eaeaf5",
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 18,
          width: "100%",
          fontSize: 16,
          color: "#4d4d61",
          textAlign: "center",
        }}
      >
        {description || (
          <span style={{ color: "#bbb" }}>Description goes here...</span>
        )}
      </div>
      <div
        style={{
          width: "40%",
          height: 2,
          background: "linear-gradient(90deg,#d8dffa,#f6eaff 80%)",
          borderRadius: 99,
          marginBottom: 16,
        }}
      />
      <div className="d-flex flex-wrap gap-2 justify-content-center w-100">
        {contacts && contacts.length > 0 ? (
          contacts.map((c, i) => (
            <ContactButton key={c.type + i} type={c.type} value={c.value} />
          ))
        ) : (
          <span className="text-muted" style={{ fontSize: 15 }}>
            No contacts yet
          </span>
        )}
      </div>
      {extraBlocks && extraBlocks.length > 0 && (
        <div className="w-100 mt-2">
          {extraBlocks.map((block, i) => (
            <ExtraBlock key={block.label + i} block={block} />
          ))}
        </div>
      )}
      <div className="mt-4 text-center">
        {id ? (
          <>
            <QRCodeCanvas
              value={`${window.location.origin}/vibes/${id}`}
              size={60}
            />
            <div style={{ fontSize: 12, color: "#aaa" }}>Share QR code</div>
          </>
        ) : (
          <div
            className="qr-preview"
            style={{
              width: 60,
              height: 60,
              background: "#fafafa",
              border: "1.5px dashed #ddd",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#aaa",
            }}
            title="QR code will appear after creating the Vibe"
          >
            QR
          </div>
        )}
      </div>
    </div>
  );
}
