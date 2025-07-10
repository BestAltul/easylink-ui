import React, { useEffect, useState } from "react";
import VibePreview from "./VibePreview";
import VibeEditor from "./VibeEditor";
import parseFields from "../../data/parseFields";
import { useParams, useNavigate } from "react-router-dom";

export default function VibePage() {
  const { id } = useParams();
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v3/vibes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVibe(data))
      .catch(() => setVibe(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!vibe)
    return (
      <div className="alert alert-danger my-5 text-center">Vibe not found.</div>
    );

  // Парсим поля
  const name = vibe.name;
  const { contacts, extraBlocks } = parseFields(vibe.fieldsDTO || []);

  return (
    <div
      className="container py-5"
      style={{ maxWidth: 980, minHeight: 420, position: "relative" }}
    >
      {/* Вынеси в отдельный div */}
      <div
        className="d-flex align-items-center"
        style={{
          position: "relative",
          marginBottom: 36,
          minHeight: 56,
        }}
      >
        {/* Кнопка Back слева */}
        <button
          className="btn btn-outline-secondary d-flex align-items-center"
          style={{
            borderRadius: 12,
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
            gap: 6,
            minWidth: 120, // Чтобы не прыгал заголовок при исчезновении кнопки
            zIndex: 2,
            position: "relative",
          }}
          onClick={() => navigate("/my-vibes")}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 20 20"
            style={{ marginRight: 6, marginLeft: -3 }}
          >
            <path d="M13 5l-5 5 5 5" />
          </svg>
          Back to Vibes
        </button>

        {/* Заголовок строго по центру, абсолют */}
        <h2
          className="fw-bold"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            margin: 0,
            letterSpacing: ".02em",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          Vibe
        </h2>
      </div>
      {/* Кнопки справа сверху */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 28,
          zIndex: 10,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          className="btn btn-primary btn-sm d-flex align-items-center"
          style={{
            borderRadius: 20,
            boxShadow: "0 1px 4px #d6d7fc",
            fontWeight: 500,
            fontSize: 15,
            gap: 7,
            padding: "5px 14px",
          }}
          onClick={() => {
            if (vibe.type === "BUSINESS") {
              navigate(`/vibes/${id}/interactions`);
            } else {
              navigate(`/vibes/${id}/interactions-basic`);
            }
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="10" r="6" />
            <path d="M14 10h-4" />
            <path d="M10 6v8" />
          </svg>
          Interactions
        </button>
        <button
          className="btn btn-light btn-sm d-flex align-items-center"
          style={{
            borderRadius: 20,
            boxShadow: "0 1px 4px #d6d7fc",
            fontWeight: 500,
            fontSize: 15,
            gap: 7,
            padding: "5px 14px",
          }}
          onClick={() => setEditing(true)}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="#2f57d7"
            strokeWidth="2"
            viewBox="0 0 20 20"
          >
            <path d="M4 13.5V16h2.5l7.6-7.6-2.5-2.5L4 13.5z" />
            <path d="M13.7 5.3l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1" />
          </svg>
          Edit
        </button>
        <button
          className="btn btn-light btn-sm d-flex align-items-center"
          style={{
            borderRadius: 20,
            boxShadow: "0 1px 4px #d6d7fc",
            fontWeight: 500,
            fontSize: 15,
            gap: 7,
            padding: "5px 14px",
          }}
          onClick={() => setShowSettings(true)}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="#2f57d7"
            strokeWidth="2"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="10" r="3" />
            <path d="M19.4 12.6l-1.1-.6c.1-.7.1-1.3 0-2l1.1-.6a1 1 0 0 0-.4-1.8l-1.2-.2c-.3-.6-.7-1.2-1.2-1.6l.3-1.2A1 1 0 0 0 16.1 3l-1.1.6A7.2 7.2 0 0 0 12 3.1l-.3-1.2A1 1 0 0 0 10.2 1h-1a1 1 0 0 0-.9.7l-.3 1.2A7.2 7.2 0 0 0 5 3.6L3.9 3A1 1 0 0 0 2.7 4.3l.3 1.2c-.5.4-.9 1-1.2 1.6l-1.2.2A1 1 0 0 0 0.6 8.6l1.1.6c-.1.7-.1 1.3 0 2l-1.1.6a1 1 0 0 0 .4 1.8l1.2.2c.3.6.7 1.2 1.2 1.6l-.3 1.2a1 1 0 0 0 1.3 1.2l1.1-.6a7.2 7.2 0 0 0 2.1 1.3l.3 1.2a1 1 0 0 0 .9.7h1a1 1 0 0 0 .9-.7l.3-1.2a7.2 7.2 0 0 0 2.1-1.3l1.1.6a1 1 0 0 0 1.3-1.2l-.3-1.2c.5-.4.9-1 1.2-1.6l1.2-.2a1 1 0 0 0 .4-1.8z" />
          </svg>
          Settings
        </button>
      </div>

      {/* Основной flex-контент */}
      <div className="d-flex" style={{ minHeight: 420 }}>
        {/* Превью */}
        <div
          style={{
            flex: editing ? "0 0 50%" : "1 1 100%",
            minWidth: 0,
            transition:
              "flex-basis .45s cubic-bezier(.68,-0.4,.27,1.25), margin-right .3s",
            marginRight: editing ? 32 : 0,
            filter: editing ? "blur(0.5px) grayscale(0.08)" : "none",
            transform: editing ? "translateX(-24px) scale(.99)" : "none",
            zIndex: 1,
          }}
        >
          <VibePreview
            id={vibe.id}
            name={name}
            description={vibe.description}
            photoFile={vibe.photo}
            contacts={contacts}
            type={vibe.type}
            extraBlocks={extraBlocks}
          />
        </div>

        {/* Редактор (50% ширины) */}
        {editing && (
          <div
            className="card shadow"
            style={{
              flex: "0 0 100%",
              maxWidth: 1000,
              // marginTop: 10,
              marginLeft: 22,
              borderRadius: 18,
              background: "#fff",
              zIndex: 2,
              animation: "slideIn .53s cubic-bezier(.62,-0.45,.28,1.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 420,
            }}
          >
            <VibeEditor
              initialFields={vibe.fieldsDTO || []}
              initialDescription={vibe.description}
              onCancel={() => setEditing(false)}
              onSave={(updatedVibe) => {
                setVibe(updatedVibe);
                setEditing(false);
              }}
            />
          </div>
        )}

        {/* Панель Settings (можно вынести в отдельный компонент) */}
        {showSettings && (
          <div
            className="card shadow"
            style={{
              flex: "0 0 32%",
              maxWidth: "90vw",
              width: "100%",
              marginLeft: 32,
              borderRadius: 14,
              background: "#f5f8fe",
              zIndex: 22,
              animation: "slideIn .48s cubic-bezier(.6,-0.2,.25,1.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <strong>Settings</strong>
              <button
                className="btn-close"
                onClick={() => setShowSettings(false)}
              />
            </div>
            <div className="p-3 text-muted" style={{ fontSize: 15 }}>
              Здесь настройки вайба (скоро тут будет удаление, приватность и
              т.п.).
            </div>
            <button
              className="btn btn-outline-danger btn-sm m-3"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Стили для анимации */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(140px) scale(.97);}
          100% { opacity: 1; transform: translateX(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
