import React, { useState } from "react";
import VibePreview from "./components/VibePreview";
import VibeFormRenderer from "@/features/vibes/components/VibeFormRenderer";
import BusinessVibeOwnerView from "@/features/vibes/forms/business/BusinessVibeOwnerView";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/VibePage.css";
import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";
import useVibeSave from "@/features/vibes/hooks/useVibeSave";
import BackButton from "@/components/common/BackButton";

export default function VibePage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
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

  if (loading)
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="spinner-border text-primary" role="status"></div>
      <div className="mt-2">{t("loading")}</div>
    </div>
  );
  if (!vibe)
    return (
      <div className="alert alert-danger my-5 text-center">
        {t("not_found")}
      </div>
    );

  return (
    <div className="route-shell">
      <div className="container py-5 vibe-container">
        <header className="vibe-header">
          <div className="vibe-header__left">
            <BackButton
              to="/my-vibes"
              className="btn-secondary"
              label={
                <>
                  <span className="btn-text-full">{t("back")}</span>
                  <span className="btn-text-short">{t("back_short")}</span>
                </>
              }
            />
          </div>

          <h2 className="vibe-header__title fw-bold">{t("title")}</h2>

          <div className="vibe-header__right">
            <button
              type="button"
              className="btn-main btn-compact d-flex align-items-center gap-2"
              onClick={() => {
                if (vibe.type === "BUSINESS")
                  navigate(`/vibes/${id}/interactions`);
                else navigate(`/vibes/${id}/interactions-basic`);
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="6" />
                <path d="M14 10h-4" />
                <path d="M10 6v8" />
              </svg>
              {t("interactions")}
            </button>
              <button
                type="button"
                className="btn-white btn-compact d-flex align-items-center gap-2"
                onClick={() => setEditing(true)}
              >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M4 13.5V16h2.5l7.6-7.6-2.5-2.5L4 13.5z" />
                <path d="M13.7 5.3l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1" />
              </svg>
              {t("edit")}
            </button>
          </div>
        </header>

        <div className="vibe-main">
          {editing ? (
            <VibeFormRenderer
              key={`${vibe.type}:${vibe.id}`}
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
          ) : vibe.type === "BUSINESS" ? (
            <div
              key={`view-business-${vibe.id}`}
              className="card shadow rounded-4 p-4 vibe-preview"
              style={{
                background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
                border: "none",
                maxWidth: 400,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <BusinessVibeOwnerView
                id={vibe.id}
                shareUrl={`${window.location.origin}/view/${vibe.id}`}
                name={name}
                description={description}
                photo={vibe.photo}
                contacts={contacts}
                type={vibe.type}
                extraBlocks={extraBlocks}
                publicCode={publicCode}
                visible={visible}
              />
            </div>
          ) : (
            <VibePreview
              key={`view-generic-${vibe.id}`}
              id={vibe.id}
              name={name}
              description={description}
              photo={vibe.photo}
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
    </div>
  );
}
