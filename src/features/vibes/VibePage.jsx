import React, { useEffect, useState } from "react";
import VibePreview from "./components/VibePreview";
import VibeFormRenderer from "@/features/vibes/components/VibeFormRenderer";
import parseFields from "../../data/parseFields";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/VibePage.css";
import { updateVibe } from "@/api/vibeApi";
import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";
import useVibeSave from "@/features/vibes/hooks/useVibeSave";
import BackButton from "@/components/common/BackButton";

export default function VibePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const {
    vibe,
    setVibe,
    loading,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
  } = useVibeLoader(id, token);

  const handleSave = useVibeSave({ token, vibe, setVibe, setEditing });

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
        <BackButton to="/my-vibes" labelKey="vibe.back" />
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
      </div>

      <div className="vibe-main">
      {editing ? (
        <VibeFormRenderer
          type={vibe.type}
          initialData={{
            id: vibe.id,
            name,
            description,
            contacts,
            extraBlocks,
            photo: vibe.photo,
          }}
          onCancel={() => setEditing(false)}
          onSave={handleSave}
        />
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
          publicCode={publicCode}
        />
      )}      
      </div>
    </div>
  );
}
