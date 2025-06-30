// src/components/vibes/VibePreview.jsx
import React from "react";
import iconMap from "../../data/contactIcons";
import { FaGlobe } from "react-icons/fa";

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

export default function VibePreview({ name, description, photoFile, contacts, type, extraBlocks }) {
  // Микро-анимация: состояние для hover QR
  const [qrHover, setQrHover] = React.useState(false);

  return (
    <div
      className="card shadow rounded-4 p-4 vibe-preview"
      style={{
        background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
        minHeight: 420,
        border: "none",
        maxWidth: 400,
        margin: "0 auto",
        transition: "box-shadow .16s, transform .18s"
      }}
      tabIndex={0}
    >
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

            let link = "#";
            if (c.type === "instagram" && c.value)
              link = c.value.startsWith("http") ? c.value : `https://instagram.com/${c.value.replace(/^@/, "")}`;
            else if (c.type === "whatsapp" && c.value)
              link = c.value.startsWith("http") ? c.value : `https://wa.me/${c.value.replace(/\D/g, "")}`;
            else if (c.type === "telegram" && c.value)
              link = c.value.startsWith("http") ? c.value : `https://t.me/${c.value.replace(/^@/, "")}`;
            else if (c.type === "email" && c.value)
              link = `mailto:${c.value}`;
            else if (c.type === "phone" && c.value)
              link = `tel:${c.value}`;
            else if (c.type === "website" && c.value)
              link = c.value.startsWith("http") ? c.value : `https://${c.value}`;

            return (
              <a
                className="contact-btn"
                style={{
                  minWidth: 140,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  background: color, // твой градиент или цвет
                  borderRadius: 22,
                  boxShadow: "0 2px 8px #e9e9ee",
                  padding: "0 20px 0 16px",
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#222",
                  border: "none",
                  textDecoration: "none",
                  gap: 10, // расстояние между иконкой и текстом
                  overflow: "hidden"
                }}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 22, // размер иконки
                  minWidth: 24,
                  justifyContent: "center"
                }}>
                  {icon}
                </span>
                <span style={{
                  flex: 1,
                  minWidth: 0, // чтобы текст не расширял всю кнопку
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  lineHeight: "1.4", // чтобы буквы как p не обрезались
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
              <div key={i}
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
        {/* QR-код — теперь с анимацией и кликом */}
        <div className="mt-4">
          <div
            className="qr-preview"
            onMouseEnter={() => setQrHover(true)}
            onMouseLeave={() => setQrHover(false)}
            tabIndex={0}
            style={{
              width: 60,
              height: 60,
              background: qrHover ? "#f3f7fd" : "#fafafa",
              border: "1.5px dashed #ddd",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: qrHover ? "#7b91fa" : "#aaa",
              boxShadow: qrHover ? "0 3px 12px #e6ecfa" : "",
              cursor: "pointer",
              transition: "all .17s"
            }}
            title="Click to enlarge"
            onClick={() => window.alert("Здесь будет ваш QR-code!")}
          >
            QR
          </div>
          <div style={{ fontSize: 12, color: "#aaa" }}>
            Share QR code
          </div>
        </div>
      </div>

      {/* Стили прямо в компонент (для примера, но лучше вынести в CSS-модуль или SCSS) */}
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
        `}
      </style>
    </div>
  );
}