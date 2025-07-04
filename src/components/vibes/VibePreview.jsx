// src/components/vibes/VibePreview.jsx
import React from "react";
import iconMap from "../../data/contactIcons";
import { FaGlobe } from "react-icons/fa";
import { BsShareFill, BsClipboard } from "react-icons/bs";
import { FaTelegramPlane, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { createPortal } from "react-dom";
import { getContactLink } from "../../data/contactLinks";

const getButtonColor = (type) => {
  switch (type) {
    case "instagram": return "linear-gradient(45deg, #fd5, #f54394, #fc6736)";
    case "whatsapp": return "#eaffea";
    case "telegram": return "#e8f7fe";
    case "phone": return "#e9f0fd";
    case "website": return "#f7f8fa";
    case "email": return "#f7f8fa";
    default: return "#f5f5f5";
  }
};

const weekDays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function VibePreview({ id, name, description, photoFile, contacts, type, extraBlocks }) {
  const [qrHover, setQrHover] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Ссылка на вайб
  const shareUrl = id
    ? `${window.location.origin}/vibes/${id}`
    : window.location.href;

  // Для закрытия по клику вне окна
  React.useEffect(() => {
    if (!showShare) return;
    const handleClick = (e) => {
      if (e.target.classList && e.target.classList.contains("vibe-share-backdrop")) setShowShare(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showShare]);

  function handleCopy(link) {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="card shadow rounded-4 p-4 vibe-preview"
      style={{
        background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
        minHeight: 420,
        border: "none",
        maxWidth: 400,
        margin: "0 auto",
        transition: "box-shadow .16s, transform .18s",
        position: "relative",
      }}
      tabIndex={0}
    >
      {/* Кнопка "поделиться" */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 20 }}>
        <button
          className="btn btn-light shadow-sm share-btn"
          style={{
            borderRadius: 99,
            padding: 7,
            border: "none",
            background: "#f7faff",
            boxShadow: "0 2px 8px #e6e9f7",
            cursor: "pointer"
          }}
          title="Share"
          onClick={() => setShowShare(true)}
        >
          <BsShareFill size={20} style={{ color: "#627bf7" }} />
        </button>
      </div>

      {/* Share Modal через Portal */}
      {showShare && typeof window !== "undefined" && createPortal(
        <div
          className="vibe-share-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(34,42,75,.22)",
            zIndex: 1111,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card shadow-lg p-4"
            style={{
              minWidth: 320,
              maxWidth: 370,
              borderRadius: 18,
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="btn-close position-absolute"
              style={{ top: 10, right: 10 }}
              onClick={() => setShowShare(false)}
            />
            <div className="mb-3">
              <h5>Share your Vibe</h5>
              <div className="text-muted" style={{ fontSize: 15 }}>
                Отправь ссылку, QR или отправь в мессенджер!
              </div>
            </div>
            <input
              className="form-control mb-2"
              value={shareUrl}
              readOnly
              style={{
                fontSize: 15,
                background: "#f5f7fb",
                borderRadius: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={e => {
                e.target.select();
                handleCopy(shareUrl);
              }}
            />
            <button
              className={`btn w-100 mb-2 ${copied ? "btn-success" : "btn-outline-primary"}`}
              onClick={() => handleCopy(shareUrl)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {copied ? (
                <>
                  <span className="me-2">&#10003;</span> Copied!
                </>
              ) : (
                <>
                  <BsClipboard /> Copy Link
                </>
              )}
            </button>
            <div className="d-flex flex-column gap-2 mb-2">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                style={{ fontWeight: 500, fontSize: 16 }}
                onClick={() => setCopied(false)}
              >
                <FaTelegramPlane /> Telegram
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success d-flex align-items-center gap-2"
                style={{ fontWeight: 500, fontSize: 16 }}
                onClick={() => setCopied(false)}
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-danger d-flex align-items-center gap-2"
                style={{ fontWeight: 500, fontSize: 16 }}
                onClick={() => setCopied(false)}
              >
                <FaInstagram /> Instagram
              </a>
            </div>
            <div className="text-center my-3">
              <QRCodeCanvas
                value={shareUrl}
                size={112}
                bgColor="#ffffff"
                fgColor="#222"
                level="M"
                style={{ margin: "0 auto", display: "block" }}
              />
              <div style={{ fontSize: 12, color: "#888", marginTop: 7 }}>
                Отсканируй, чтобы открыть Vibe
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      <div className="d-flex flex-column align-items-center">
        {/* Аватар с hover */}
        <div
          className="vibe-avatar"
          style={{
            width: 94,
            height: 94,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
            overflow: "hidden",
            marginBottom: 14,
            marginTop: -8,
            transition: "box-shadow .18s, transform .2s"
          }}
          tabIndex={0}
        >
          {photoFile
            ? <img src={URL.createObjectURL(photoFile)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "#bbb", fontSize: 40 }}>
                {name ? name[0].toUpperCase() : "?"}
              </span>
          }
        </div>
        {/* Имя и тип */}
        <h3 className="mb-0" style={{ fontWeight: 700, fontSize: 24 }}>{name || "Your Name"}</h3>
        <div className="text-primary mb-2" style={{ fontWeight: 600, fontSize: 16, letterSpacing: 1, textTransform: "uppercase" }}>
          {type?.charAt(0).toUpperCase() + type?.slice(1) || "Business"}
        </div>
        {/* Описание */}
        <div style={{
          background: "rgba(250, 250, 255, 0.92)",
          border: "1.5px solid #eaeaf5",
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 18,
          width: "100%",
          boxShadow: "0 1px 8px #e6e8f7",
          fontSize: 16,
          color: "#4d4d61",
          textAlign: "center",
          minHeight: 40,
          transition: "box-shadow .15s"
        }}>
          {description || <span style={{ color: "#bbb" }}>Description goes here...</span>}
        </div>
        {/* Разделитель */}
        <div style={{
          width: "40%", height: 2, background: "linear-gradient(90deg,#d8dffa,#f6eaff 80%)",
          borderRadius: 99, marginBottom: 16, marginTop: 15
        }} />
        {/* Контакты */}
        <div className="d-flex flex-wrap gap-2 mt-1 justify-content-center w-100">
          {contacts && contacts.length > 0 ? contacts.map((c, i) => {
            const icon = iconMap[c.type] || <FaGlobe />;
            const color = getButtonColor(c.type);

            const link = getContactLink(c.type, c.value);
            return (
              <a
                key={c.type + c.value + i}
                className="contact-btn"
                style={{
                  minWidth: 140,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  background: color,
                  borderRadius: 22,
                  boxShadow: "0 2px 8px #e9e9ee",
                  padding: "0 20px 0 16px",
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#222",
                  border: "none",
                  textDecoration: "none",
                  gap: 10,
                  overflow: "hidden"
                }}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 22,
                  minWidth: 24,
                  justifyContent: "center"
                }}>
                  {icon}
                </span>
                <span style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  lineHeight: "1.4",
                  marginLeft: 6
                }}>
                  {c.value}
                </span>
              </a>
            );
          }) : (
            <span className="text-muted" style={{ fontSize: 15 }}>No contacts yet</span>
          )}
        </div>
        {/* extraBlocks как было */}
        {extraBlocks && extraBlocks.length > 0 && (
          <div className="w-100 mt-2">
            {extraBlocks.map((block, i) => (
              <div key={block.label + i}
                className="mb-2 px-3 py-2 rounded-3"
                style={{
                  background: "#f7f9fd",
                  borderLeft: "4px solid #637bfd",
                  fontSize: 15,
                  color: "#3a405a",
                }}>
                <strong>{block.label}:</strong>{" "}
                {typeof block.value === "object" && block.value !== null && !Array.isArray(block.value)
                  ? (
                    <table style={{ fontSize: 15, marginTop: 4, marginBottom: 2 }}>
                      <tbody>
                        {weekDays.map(day => (
                          <tr key={day}>
                            <td style={{ paddingRight: 7, color: "#637bfd" }}>{day}:</td>
                            <td>{block.value?.[day] || <span style={{ color: "#bbb" }}>—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                  : (
                    <span>
                      {block.value || <span style={{ color: "#bbb" }}>not specified</span>}
                    </span>
                  )
                }
              </div>
            ))}
          </div>
        )}
        {/* QR-код или заглушка */}
        <div className="mt-4 text-center">
          {id ? (
            <>
              <QRCodeCanvas
                value={`${window.location.origin}/vibes/${id}`}
                size={60}
                bgColor="#fff"
                fgColor="#222"
                level="M"
                style={{
                  margin: "0 auto",
                  display: "block",
                  borderRadius: 9,
                  border: "1.5px dashed #ddd",
                  background: "#fafafa",
                  padding: 4,
                }}
              />
              <div style={{ fontSize: 12, color: "#aaa" }}>
                Share QR code
              </div>
            </>
          ) : (
            <div
              className="qr-preview"
              tabIndex={0}
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
                margin: "0 auto"
              }}
              title="QR code will appear after creating the Vibe"
            >
              QR
            </div>
          )}
        </div>
      </div>

      {/* Стили прямо в компонент (лучше вынести в отдельный файл) */}
      <style>
        {`
        .vibe-preview:hover, .vibe-preview:focus-within {
          box-shadow: 0 8px 28px #e9eafe;
          transform: translateY(-2px) scale(1.011);
        }
        .vibe-avatar:hover, .vibe-avatar:focus {
          box-shadow: 0 4px 16px #dde8fa;
          transform: scale(1.06);
        }
        .vibe-contact:hover, .vibe-contact:focus {
          box-shadow: 0 4px 14px #d9e5fa;
          transform: scale(1.04);
          z-index: 2;
        }
        .vibe-contact-icon {
          font-size: 20px;
          transition: color .15s;
        }
        .vibe-contact:hover .vibe-contact-icon,
        .vibe-contact:focus .vibe-contact-icon {
          color: #627bf7;
        }
        @media (max-width: 550px) {
          .vibe-preview {
            max-width: 97vw !important;
            padding: 18px !important;
          }
          .vibe-avatar {
            width: 66px !important; height: 66px !important;
          }
        }
        .share-btn:hover, .share-btn:focus {
          background: #ebf0fc !important;
          box-shadow: 0 6px 18px #d3dfff !important;
        }
        .share-menu .dropdown-item:hover {
          background: #f3f7fe !important;
          color: #222 !important;
        }
        `}
      </style>
    </div>
  );
}
