import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VibePreview from "./VibePreview";

// Универсальный парсер
function parseFields(fieldsDTO = []) {
  let name = "";
  const contacts = [];
  fieldsDTO.forEach(field => {
    if (field.type === "fullName" || field.type === "name") {
      name = field.value;
    }
    if (
      field.type === "phone" ||
      field.type === "email" ||
      field.type === "telegram" ||
      field.type === "whatsapp" ||
      field.type === "website"
    ) {
      contacts.push({ type: field.type, value: field.value });
    }
  });
  return { name, contacts };
}

export default function VibePage() {
  const { id } = useParams();
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v3/vibes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setVibe(data))
      .catch(() => setVibe(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!vibe) return <div className="alert alert-danger my-5 text-center">Vibe not found.</div>;

  const { name, contacts } = parseFields(vibe.fieldsDTO);

  return (
    <div className="container py-5" style={{ maxWidth: 860, minHeight: 400, position: "relative" }}>
      {/* Кнопки справа */}
      <div style={{
        position: "absolute",
        top: 14,
        right: 28,
        zIndex: 10,
        display: "flex",
        gap: 10,
      }}>
        <button
          className="btn btn-light btn-sm d-flex align-items-center"
          style={{
            borderRadius: 20,
            boxShadow: "0 1px 4px #d6d7fc",
            fontWeight: 500,
            fontSize: 15,
            gap: 7,
            padding: "5px 14px"
          }}
          onClick={() => setEditing(true)}
        >
          <svg width="18" height="18" fill="none" stroke="#2f57d7" strokeWidth="2" viewBox="0 0 20 20">
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
            padding: "5px 14px"
          }}
          onClick={() => setShowSettings(true)}
        >
          <svg width="18" height="18" fill="none" stroke="#2f57d7" strokeWidth="2" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="3" />
            <path d="M19.4 12.6l-1.1-.6c.1-.7.1-1.3 0-2l1.1-.6a1 1 0 0 0-.4-1.8l-1.2-.2c-.3-.6-.7-1.2-1.2-1.6l.3-1.2A1 1 0 0 0 16.1 3l-1.1.6A7.2 7.2 0 0 0 12 3.1l-.3-1.2A1 1 0 0 0 10.2 1h-1a1 1 0 0 0-.9.7l-.3 1.2A7.2 7.2 0 0 0 5 3.6L3.9 3A1 1 0 0 0 2.7 4.3l.3 1.2c-.5.4-.9 1-1.2 1.6l-1.2.2A1 1 0 0 0 0.6 8.6l1.1.6c-.1.7-.1 1.3 0 2l-1.1.6a1 1 0 0 0 .4 1.8l1.2.2c.3.6.7 1.2 1.2 1.6l-.3 1.2a1 1 0 0 0 1.3 1.2l1.1-.6a7.2 7.2 0 0 0 2.1 1.3l.3 1.2a1 1 0 0 0 .9.7h1a1 1 0 0 0 .9-.7l.3-1.2a7.2 7.2 0 0 0 2.1-1.3l1.1.6a1 1 0 0 0 1.3-1.2l-.3-1.2c.5-.4.9-1 1.2-1.6l1.2-.2a1 1 0 0 0 .4-1.8z"/>
          </svg>
          Settings
        </button>
      </div>

      <div className="d-flex" style={{ minHeight: 400 }}>
        {/* Блок превью и анимация смещения */}
        <div
          style={{
            flex: editing ? "0 0 56%" : "1 1 100%",
            minWidth: 0,
            transition: "flex-basis .45s cubic-bezier(.68,-0.4,.27,1.25), margin-right .3s",
            marginRight: editing ? 28 : 0,
            filter: editing ? "blur(0.5px) grayscale(0.08)" : "none",
            transform: editing ? "translateX(-30px) scale(.99)" : "none",
            zIndex: 1,
          }}
        >
          <h2 className="fw-bold mb-4" style={{ letterSpacing: ".02em" }}>
            Vibe
          </h2>
          <VibePreview
            name={name}
            description={vibe.description}
            photoFile={vibe.photo}
            contacts={contacts}
            type={vibe.type}
            extraBlocks={vibe.extraBlocks || []}
          />
        </div>

        {/* Панель редактора */}
        {editing && (
          <div
            className="card shadow"
            style={{
              minWidth: 330,
              maxWidth: 380,
              marginLeft: 36,
              borderRadius: 18,
              background: "#fff",
              zIndex: 2,
              animation: "slideIn .53s cubic-bezier(.62,-0.45,.28,1.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <VibeEditForm
              initial={vibe}
              onCancel={() => setEditing(false)}
              onSave={updatedVibe => {
                setVibe(updatedVibe);
                setEditing(false);
              }}
            />
          </div>
        )}

        {/* Панель Settings */}
        {showSettings && (
          <div
            className="card shadow"
            style={{
              minWidth: 260,
              maxWidth: 300,
              marginLeft: 40,
              borderRadius: 14,
              background: "#f5f8fe",
              zIndex: 22,
              animation: "slideIn .48s cubic-bezier(.6,-0.2,.25,1.1)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <strong>Settings</strong>
              <button className="btn-close" onClick={() => setShowSettings(false)} />
            </div>
            <div className="p-3 text-muted" style={{ fontSize: 15 }}>
              Здесь настройки вайба (скоро тут будет удаление, приватность и т.п.).
            </div>
            <button className="btn btn-outline-danger btn-sm m-3" onClick={() => setShowSettings(false)}>
              Close
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(140px) scale(.97);}
          100% { opacity: 1; transform: translateX(0) scale(1);}
        }
      `}</style>
    </div>
  );
}

// Мини-редактор (оставь свой VibeEditForm если нужно)
function VibeEditForm({ initial, onCancel, onSave }) {
  const { name } = parseFields(initial.fieldsDTO);
  const [formName, setFormName] = useState(name);
  const [description, setDescription] = useState(initial.description);

  function handleSubmit(e) {
    e.preventDefault();
    let nameFieldExists = false;
    const newFields = initial.fieldsDTO.map(field => {
      if (field.type === "name") {
        nameFieldExists = true;
        return { ...field, value: formName };
      }
      return field;
    });
    if (!nameFieldExists) {
      newFields.push({
        type: "name",
        value: formName,
        label: "Name",
        id: undefined
      });
    }
    fetch(`/api/v3/vibes/${initial.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        description,
        fieldsDTO: newFields,
      }),
    })
      .then(res => res.json())
      .then(updated => onSave(updated));
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 w-100">
      <div className="mb-3">
        <label className="form-label">Vibe Name</label>
        <input
          className="form-control"
          value={formName}
          onChange={e => setFormName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-success" type="submit">Save</button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
