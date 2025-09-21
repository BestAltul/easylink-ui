import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import BusinessVibeForm from "./business/BusinessVibeForm";
import PersonalVibeForm from "./personal/PersonalVibeForm";
import EventVibeForm from "./events/EventVibeForm";
import BackButton from "@/components/common/BackButton";

const TYPE_COMPONENTS = {
  BUSINESS: BusinessVibeForm,
  PERSONAL: PersonalVibeForm,
  EVENT: EventVibeForm,
};

export default function CreateVibe() {
  const { t } = useTranslation("create_vibe"); 
  const navigate = useNavigate();
  const [type, setType] = React.useState("BUSINESS");

  const Form = TYPE_COMPONENTS[type] || BusinessVibeForm;

  return (
    <div className="container py-5">
      <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
        {/* Back */}
        <div style={{ marginBottom: 18 }}>
          <BackButton
            to="/profile"
            label={t("back")}
            className="d-inline-flex align-items-center"
            style={{ paddingLeft: 15, paddingRight: 18 }}
          />
        </div>

        <h2 className="mb-4 text-center" style={{ fontWeight: 600 }}>
          {t("title")}
        </h2>

        <div className="mb-4" style={{ maxWidth: 420, margin: "0 auto" }}>
          <label className="form-label" htmlFor="vibe-type">
            {t("type_label")}
          </label>
          <select
            id="vibe-type"
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label={t("type_label")}
          >
            <option value="BUSINESS">{t("types.business")}</option>
            <option value="PERSONAL">{t("types.personal")}</option>
            <option value="EVENT">{t("types.event")}</option>
          </select>
        </div>

        <Form mode="create" />
      </div>
    </div>
  );
}
