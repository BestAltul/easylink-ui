import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import BusinessVibeForm from "./business/BusinessVibeForm";
import PersonalVibeForm from "./personal/PersonalVibeForm";
import EventVibeForm from "./events/EventVibeForm";

export default function CreateVibe() {
  const [type, setType] = useState("BUSINESS");
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
        {/* Back Button */}
        <div style={{ marginBottom: 18 }}>
          <button
            className="btn btn-outline-secondary d-inline-flex align-items-center"
            style={{
              borderRadius: 12,
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
              gap: 6,
              paddingLeft: 15,
              paddingRight: 18,
            }}
            onClick={() => navigate("/profile")}
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
            {t("create_vibe.back")}
          </button>
        </div>

        <h2 className="mb-4 text-center" style={{ fontWeight: 600 }}>
          {t("create_vibe.title")}
        </h2>

        <div className="mb-4" style={{ maxWidth: 420, margin: "0 auto" }}>
          <label className="form-label">{t("create_vibe.type_label")}</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="BUSINESS">{t("create_vibe.type_business")}</option>
            <option value="PERSONAL">{t("create_vibe.type_personal")}</option>
            <option value="EVENT">{t("create_vibe.type_event")}</option>
          </select>
        </div>

        {type === "BUSINESS" && <BusinessVibeForm mode="create" />}
        {type === "PERSONAL" && <PersonalVibeForm mode="create" />}
        {type === "EVENT" && <EventVibeForm mode="create" />}
      </div>
    </div>
  );
}
