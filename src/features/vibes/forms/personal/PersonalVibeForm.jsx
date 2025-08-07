import React from "react";
import { useNavigate } from "react-router-dom";
import CONTACT_TYPES from "../../../../data/contactTypes.js";
import iconMap from "../../../../data/contactIcons.jsx";
import VibePreview from "../../components/VibePreview";
import { FaGlobe } from "react-icons/fa";
import { usePersonalVibeForm } from "./usePersonalVibeForm";
import { useTranslation } from "react-i18next";
import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal"
import PersonalInfoBlockModal from "@/features/vibes/components/Modals/PersonalInfoBlockModal"

const PERSONAL_INFO_BLOCKS = [
  { key: "city", label: "City", placeholder: "Your city" },
  { key: "birthday", label: "Birthday", placeholder: "YYYY-MM-DD" },
];

export default function PersonalVibeForm({ initialData = {}, mode = "create", onSave, onCancel }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    name, setName,
    description, setDescription,
    photoFile, setPhotoFile,
    contacts, setContacts,
    showModal, setShowModal,
    extraBlocks, setExtraBlocks,
    showBlockModal, setShowBlockModal,
    showInfo, setShowInfo,
    loading,
    addContact, handleContactChange, removeContact,
    handleBlockChange, removeBlock,
    handleSubmit,
  } = usePersonalVibeForm({ navigate, initialData, mode, onSave, onCancel });

  return (
    <div className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>
        <form className="bg-light p-4 rounded-4 shadow" style={{ width: "100%" }} onSubmit={handleSubmit}>
          {showInfo && (
            <div className="alert alert-info d-flex align-items-center justify-content-between" style={{ fontSize: 15 }}>
              <div>
                <b>{t("personal_form.alert_title")}</b> {t("personal_form.alert_desc")}<br />
                <span className="text-danger">
                  {t("personal_form.alert_warn")}
                </span>
              </div>
              <button
                type="button"
                className="btn-close ms-2"
                aria-label="Close"
                onClick={() => setShowInfo(false)}
                style={{ filter: "invert(0.5)" }}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">{t("personal_form.name_label")}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t("personal_form.name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t("personal_form.bio_label")}</label>
            <textarea
              className="form-control"
              placeholder={t("personal_form.bio_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t("personal_form.contacts_label")}</label>
            {contacts.length === 0 && (
              <div className="mb-2 text-muted" style={{ fontSize: 15 }}>
                {t("personal_form.no_contacts")}
              </div>
            )}
            {contacts.map((c, i) => (
              <div className="input-group mb-2" key={i}>
                <span
                  className="input-group-text"
                  title={CONTACT_TYPES.find((t) => t.key === c.type)?.label}
                >
                  {iconMap[c.type] || <FaGlobe />}
                </span>
                <input
                  type={
                    c.type === "email" ? "email"
                    : c.type === "website" ? "url"
                    : "text"
                  }
                  className="form-control"
                  placeholder={CONTACT_TYPES.find((t) => t.key === c.type)?.label || c.type}
                  value={c.value}
                  onChange={(e) => handleContactChange(i, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeContact(i)}
                  title={t("personal_form.remove_button_title")}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary w-100"
              onClick={() => setShowModal(true)}
              disabled={contacts.length >= CONTACT_TYPES.length}
            >
              {t("personal_form.add_contact")}
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">{t("personal_form.additional_info")}</label>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mb-2"
              onClick={() => setShowBlockModal(true)}
            >
              {t("personal_form.add_info_block")}
            </button>
            {extraBlocks.map((block, i) => (
              <div className="input-group mb-2" key={i}>
                <span className="input-group-text" style={{ minWidth: 80 }}>{block.label}</span>
                <input
                  type={block.type === "birthday" ? "date" : "text"}
                  className="form-control"
                  placeholder={block.placeholder || ""}
                  value={block.value}
                  onChange={(e) => handleBlockChange(i, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeBlock(i)}
                  title={t("personal_form.remove_button_title")}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">{t("personal_form.photo_label")}</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
            <div className="form-text">{t("personal_form.photo_hint")}</div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {mode === "edit" && (
              <button
                type="button"
                className="btn btn-outline-secondary w-50"
                onClick={onCancel}
                disabled={loading}
              >
                {t("personal_form.cancel")}
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? mode === "edit"
                  ? t("personal_form.saving")
                  : t("personal_form.creating")
                : mode === "edit"
                ? t("personal_form.save_button")
                : t("personal_form.create_button")}
            </button>
          </div>
        </form>

        {showModal && (
          <ContactTypeModal
            contacts={contacts}
            onClose={() => setShowModal(false)}
            onSelect={(typeKey) => {
            addContact(typeKey);
            setShowModal(false);
            }}
          />
        )} 

        {showBlockModal && (
          <PersonalInfoBlockModal
            extraBlocks={extraBlocks}
            onClose={() => setShowBlockModal(false)}
            onSelect={(block) => {
              setExtraBlocks([...extraBlocks, {
                type: block.key,
                label: block.label,
                value: "",
                placeholder: block.placeholder
              }]);
              setShowBlockModal(false);
            }}
          />
        )}
      </div>

      {/* {mode === "create" || mode === "edit" ? (
        <div style={{ flex: "1 1 400px", minWidth: 300, maxWidth: 460 }} className="d-none d-lg-block">
          <div className="sticky-top" style={{ top: 90, zIndex: 1 }}>
            <VibePreview
              name={name}
              description={description}
              photoFile={photoFile}
              contacts={contacts}
              type="PERSONAL"
              extraBlocks={extraBlocks}
            />
          </div>
        </div>
      ) : null} */}
    </div>
  );
}
