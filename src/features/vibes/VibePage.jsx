import React, { useEffect, useState } from "react";
import VibePreview from "./components/VibePreview";
import BusinessVibeForm from "./forms/business/BusinessVibeForm";
import PersonalVibeForm from "./forms/personal/PersonalVibeForm";
import EventVibeForm from "./forms/events/EventVibeForm";
import parseFields from "../../data/parseFields";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/VibePage.css";

export default function VibePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([]);
  const [extraBlocks, setExtraBlocks] = useState([]);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [publicCode, setPublicCode] = useState("");

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v3/vibes/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setVibe(data))
      .catch(() => setVibe(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (vibe) {
      setName(vibe.name || "");
      setDescription(vibe.description || "");
      setVisible(vibe.visible || false);
      setPublicCode(vibe.publicCode || "");
      const { contacts, extraBlocks } = parseFields(vibe.fieldsDTO || []);
      setContacts(contacts);
      setExtraBlocks(extraBlocks);
    }
  }, [vibe]);

  if (loading) return <div className="text-center my-5">{t("vibe.loading")}</div>;
  if (!vibe)
    return (
      <div className="alert alert-danger my-5 text-center">
        {t("vibe.not_found")}
      </div>
    );

  return (
    <div className="container py-5 vibe-container">
      <div className="d-flex align-items-center vibe-header">
        <button
          className="btn btn-outline-secondary d-flex align-items-center vibe-back-button"
          onClick={() => navigate("/my-vibes")}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20" style={{ marginRight: 6, marginLeft: -3 }}>
            <path d="M13 5l-5 5 5 5" />
          </svg>
          {t("vibe.back")}
        </button>
        <h2 className="fw-bold vibe-heading">{t("vibe.title")}</h2>
      </div>

      <div className="vibe-top-buttons">
        <button
          className="btn btn-primary btn-sm d-flex align-items-center vibe-interaction-btn"
          onClick={() => {
            if (vibe.type === "BUSINESS") navigate(`/vibes/${id}/interactions`);
            else navigate(`/vibes/${id}/interactions-basic`);
          }}
        >
          <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6" />
            <path d="M14 10h-4" />
            <path d="M10 6v8" />
          </svg>
          {t("vibe.interactions")}
        </button>

        <button
          className="btn btn-light btn-sm d-flex align-items-center vibe-edit-btn"
          onClick={() => setEditing(true)}
        >
          <svg width="18" height="18" fill="none" stroke="#2f57d7" strokeWidth="2" viewBox="0 0 20 20">
            <path d="M4 13.5V16h2.5l7.6-7.6-2.5-2.5L4 13.5z" />
            <path d="M13.7 5.3l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1" />
          </svg>
          {t("vibe.edit")}
        </button>

        <button
          className="btn btn-light btn-sm d-flex align-items-center vibe-settings-btn"
          onClick={() => setShowSettings(true)}
        >
          <svg width="18" height="18" fill="none" stroke="#2f57d7" strokeWidth="2" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="3" />
            <path d="M19.4 12.6l-1.1-.6c.1-.7.1-1.3 0-2l1.1-.6a1 1 0 0 0-.4-1.8l-1.2-.2c-.3-.6-.7-1.2-1.2-1.6l.3-1.2A1 1 0 0 0 16.1 3l-1.1.6A7.2 7.2 0 0 0 12 3.1l-.3-1.2A1 1 0 0 0 10.2 1h-1a1 1 0 0 0-.9.7l-.3 1.2A7.2 7.2 0 0 0 5 3.6L3.9 3A1 1 0 0 0 2.7 4.3l.3 1.2c-.5.4-.9 1-1.2 1.6l-1.2.2A1 1 0 0 0 0.6 8.6l1.1.6c-.1.7-.1 1.3 0 2l-1.1.6a1 1 0 0 0 .4 1.8l1.2.2c.3.6.7 1.2 1.2 1.6l-.3 1.2a1 1 0 0 0 1.3 1.2l1.1-.6a7.2 7.2 0 0 0 2.1 1.3l.3 1.2a1 1 0 0 0 .9.7h1a1 1 0 0 0 .9-.7l.3-1.2a7.2 7.2 0 0 0 2.1-1.3l1.1.6a1 1 0 0 0 1.3-1.2l-.3-1.2c.5-.4.9-1 1.2-1.6l1.2-.2a1 1 0 0 0 .4-1.8z" />
          </svg>
          {t("vibe.settings")}
        </button>
      </div>

      <div className="vibe-main">
        {editing ? (
          <>
            {(vibe.type === "BUSINESS" && (
              <BusinessVibeForm
                mode="edit"
                initialData={{
                  id: vibe.id,
                  name,
                  description,
                  contacts,
                  extraBlocks,
                  photo: vibe.photo,
                }}
                onCancel={() => setEditing(false)}
                onSave={async (updated) => {
                  const currentId = vibe?.id;
                  if (!currentId) {
                    alert(t("vibe.error_no_id"));
                    return;
                  }

                  const response = await fetch(`/api/v3/vibes/${vibe.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      id: currentId,
                      name: updated.name,
                      description: updated.description,
                      fieldsDTO: updated.fieldsDTO,
                    }),
                  });

                  if (response.ok) {
                    const data = await response.json();
                    setVibe((prev) => ({ ...prev, ...data }));
                    setEditing(false);
                  } else {
                    alert(t("vibe.error_save"));
                  }
                }}
              />
            )) ||
              (vibe.type === "PERSONAL" && (
                <PersonalVibeForm
                  mode="edit"
                  initialData={{
                    id: vibe.id,
                    name,
                    description,
                    contacts,
                    extraBlocks,
                    photo: vibe.photo,
                  }}
                  onCancel={() => setEditing(false)}
                  onSave={async (updated) => {
                    const currentId = vibe?.id;
                    if (!currentId) {
                      alert(t("vibe.error_no_id"));
                      return;
                    }

                    const response = await fetch(`/api/v3/vibes/${vibe.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        id: currentId,
                        name: updated.name,
                        description: updated.description,
                        fieldsDTO: updated.fieldsDTO,
                      }),
                    });

                    if (response.ok) {
                      const data = await response.json();
                      setVibe((prev) => ({ ...prev, ...data }));
                      setEditing(false);
                    } else {
                      alert(t("vibe.error_save"));
                    }
                  }}
                />
              )) ||
              (vibe.type === "OTHER" && (
                <EventVibeForm
                  mode="edit"
                  initialData={{
                    id: vibe.id,
                    name,
                    description,
                    contacts,
                    extraBlocks,
                    photo: vibe.photo,
                  }}
                  onCancel={() => setEditing(false)}
                  onSave={async (updated) => {
                    const currentId = vibe?.id;
                    if (!currentId) {
                      alert(t("vibe.error_no_id"));
                      return;
                    }

                    const response = await fetch(`/api/v3/vibes/${vibe.id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        id: currentId,
                        name: updated.name,
                        description: updated.description,
                        fieldsDTO: updated.fieldsDTO,
                      }),
                    });

                    if (response.ok) {
                      const data = await response.json();
                      setVibe((prev) => ({ ...prev, ...data }));
                      setEditing(false);
                    } else {
                      alert(t("vibe.error_save"));
                    }
                  }}
                />
              ))}
          </>
        ) : (
          <VibePreview
            id={vibe.id}
            name={name}
            description={description}
            photoFile={vibe.photo}
            contacts={contacts}
            type={vibe.type}
            extraBlocks={extraBlocks}
            vibeId={vibe.id}
            visible={vibe.visible}
            publicCode={vibe.publicCode}
          />
        )}
      </div>

      {showSettings && (
        <div className="card shadow vibe-settings-panel">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <strong>{t("vibe.settings_panel_title")}</strong>
            <button className="btn-close" onClick={() => setShowSettings(false)} />
          </div>
          <div className="p-3 text-muted" style={{ fontSize: 15 }}>
            {t("vibe.settings_panel_text")}
          </div>
          <button
            className="btn btn-outline-danger btn-sm m-3"
            onClick={() => setShowSettings(false)}
          >
            {t("vibe.settings_panel_close")}
          </button>
        </div>
      )}
    </div>
  );
}
