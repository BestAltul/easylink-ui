import React from "react";
import { BsShareFill } from "react-icons/bs";
import { QRCodeCanvas } from "qrcode.react";
import ContactButton from "./tools/ContactButton";
import ShareModal from "./tools/ShareModal";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function VibePreview({
  id,
  name,
  description,
  photoFile,
  contacts,
  type,
  extraBlocks,
}) {
  const [showShare, setShowShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const shareUrl = id
    ? `${window.location.origin}/view/${id}`
    : window.location.href;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="card shadow rounded-4 p-4 vibe-preview"
      style={{
        background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
        border: "none",
        maxWidth: 400,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Share button */}
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <button
          className="btn btn-light shadow-sm"
          style={{ borderRadius: 99 }}
          onClick={() => setShowShare(true)}
        >
          <BsShareFill size={20} style={{ color: "#627bf7" }} />
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        show={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={shareUrl}
        copied={copied}
        onCopy={handleCopy}
      />

      <div className="d-flex flex-column align-items-center">
        {/* Avatar */}
        <div
          style={{
            width: 94,
            height: 94,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            marginBottom: 14,
            marginTop: -8,
          }}
        >
          {photoFile ? (
            <img
              src={URL.createObjectURL(photoFile)}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "#bbb", fontSize: 40 }}>
              {name ? name[0].toUpperCase() : "?"}
            </span>
          )}
        </div>

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

        {/* Contacts */}
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

        {/* Extra blocks */}
        {extraBlocks && extraBlocks.length > 0 && (
          <div className="w-100 mt-2">
            {extraBlocks.map((block, i) => (
              <div
                key={block.label + i}
                className="mb-2 px-3 py-2 rounded-3"
                style={{
                  background: "#f7f9fd",
                  borderLeft: "4px solid #637bfd",
                  fontSize: 15,
                  color: "#3a405a",
                }}
              >
                <strong>{block.label}:</strong>{" "}
                {typeof block.value === "object" &&
                block.value !== null &&
                !Array.isArray(block.value) ? (
                  <table
                    style={{ fontSize: 15, marginTop: 4, marginBottom: 2 }}
                  >
                    <tbody>
                      {weekDays.map((day) => (
                        <tr key={day}>
                          <td style={{ paddingRight: 7, color: "#637bfd" }}>
                            {day}:
                          </td>
                          <td>
                            {block.value?.[day] || (
                              <span style={{ color: "#bbb" }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span>
                    {block.value || (
                      <span style={{ color: "#bbb" }}>not specified</span>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* QR */}
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
    </div>
  );
}
