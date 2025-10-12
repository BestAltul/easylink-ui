import React from "react";
import { useTranslation } from "react-i18next";

import AvatarPicker from "./AvatarPicker.jsx";
import ContactsSection from "./ContactsSection.jsx";
import QRBox from "./QRBox.jsx";
import ExtraBlocksList from "./ExtraBlocksList.jsx";
import ExtraBlock from "@/components/InfoBlocks/ExtraBlock";

export default function VibeContent({
  id,
  name,
  description,
  photoFile,
  contacts = [],
  type,
  extraBlocks = [],
  visible,
  publicCode,
  editMode = false,

  onChangeName,
  onChangeDescription,
  onChangePhotoFile,

  onOpenContactPicker,
  onRemoveContact,
  onChangeContactValue,
  resumeEditAt,

  onBlockChange,
  onBlockRemove,
  onOpenBlockPicker,
}) {
  const { t } = useTranslation("vibe_content");

  const slug = (type || "").toString().toLowerCase();
  const pretty = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : t("default_type");
  const typeLabel = slug ? t(`types.${slug}`, pretty) : t("default_type");

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Photo */}
      <AvatarPicker
        name={name}
        photoFile={photoFile}
        editMode={editMode}
        onChangePhotoFile={onChangePhotoFile}
      />

      {/* Name */}
      {editMode ? (
        <input
          type="text"
          value={name}
          placeholder={t("your_name")}
          onChange={(e) => onChangeName?.(e.target.value)}
          className="form-control text-center fw-bold mb-0"
          style={{ border: "none", background: "transparent" }}
        />
      ) : (
        <h3 className="mb-0" style={{ fontWeight: 700 }}>{name || t("your_name")}</h3>
      )}

      {/* Type */}
      <div className="text-primary mb-2" style={{ fontWeight: 600, textTransform: "uppercase" }}>
        {typeLabel}
      </div>

      {/* Description */}
      {editMode ? (
        <textarea
          value={description}
          placeholder={t("default_description")}
          onChange={(e) => onChangeDescription?.(e.target.value)}
          rows={2}
          className="form-control"
          style={{ borderRadius: 14, textAlign: "center" }}
        />
      ) : (
        <div className="w-100" style={{ textAlign: "center" }}>
          {description || <span style={{ color: "#bbb" }}>{t("default_description")}</span>}
        </div>
      )}

      {/* Divider */}
      <div style={{ width: "40%", height: 2, background: "#eee", borderRadius: 99, margin: "16px 0" }} />

      {/* Contacts */}
      <ContactsSection
        t={t}
        contacts={contacts}
        editMode={editMode}
        onOpenContactPicker={onOpenContactPicker}
        onRemoveContact={onRemoveContact}
        onChangeContactValue={onChangeContactValue}
        resumeEditAt={resumeEditAt}
      />

      <ExtraBlocksList
        extraBlocks={extraBlocks}
        editMode={editMode}
        onBlockChange={onBlockChange}
        onBlockRemove={onBlockRemove}
        onOpenBlockPicker={onOpenBlockPicker}
      />

      {/* QR */}
      <div className="mt-4 text-center">
        <QRBox id={id} t={t} />
      </div>
    </div>
  );
}
