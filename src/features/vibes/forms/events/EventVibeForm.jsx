import React from "react";
import { useNavigate } from "react-router-dom";
import VibePreview from "../../components/VibePreview";
import { FaGlobe } from "react-icons/fa";
import { useEventVibeForm } from "./useEventVibeForm";
import { useTranslation } from "react-i18next";
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";

const EVENT_INFO_BLOCKS = [
  { key: "date", label: "Event Date", placeholder: "YYYY-MM-DD" },
  { key: "location", label: "Location", placeholder: "Venue / City" },
  { key: "organizer", label: "Organizer", placeholder: "Organizer Name" }
];

export default function EventVibeForm({
  mode = "create",
  initialData = {},
  onCancel,
  onSave
}) {
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
    loading,
    addContact, handleContactChange, removeContact,
    handleBlockChange, removeBlock,
    handleSubmit
  } = useEventVibeForm({ navigate, initialData, mode, onSave });

  return (
    <div className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>
        <form className="bg-light p-4 rounded-4 shadow" style={{ width: "100%" }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t("event_form.name_label")}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t("event_form.name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t("event_form.desc_label")}</label>
            <textarea
              className="form-control"
              placeholder={t("event_form.desc_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t("event_form.contacts_label")}</label>
            {contacts.length === 0 && (
              <div className="mb-2 text-muted" style={{ fontSize: 15 }}>
                {t("event_form.no_contacts")}
              </div>
            )}
            {contacts.map((c, i) => (
              <div className="input-group mb-2" key={i}>
                <span className="input-group-text" title={c.label || c.type}>
                  {iconMap[c.type] || <FaGlobe />}
                </span>
                <input
                  type={c.type === "email" ? "email" : "text"}
                  className="form-control"
                  placeholder={c.label || c.type}
                  value={c.value}
                  onChange={(e) => handleContactChange(i, e.target.value)}
                  required
                />
                <button type="button" className="btn btn-outline-danger" onClick={() => removeContact(i)} title={t("event_form.remove_button_title")}>×</button>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary w-100" onClick={() => setShowModal(true)}>
              {t("event_form.add_contact")}
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">{t("event_form.info_label")}</label>
            <button type="button" className="btn btn-outline-secondary w-100 mb-2" onClick={() => setShowBlockModal(true)}>
              {t("event_form.add_info_block")}
            </button>
            {extraBlocks.map((block, i) => (
              <div className="input-group mb-2" key={i}>
                <span className="input-group-text" style={{ minWidth: 80 }}>{block.label}</span>
                <input
                  type={block.type === "date" ? "date" : "text"}
                  className="form-control"
                  placeholder={block.placeholder || ""}
                  value={block.value}
                  onChange={(e) => handleBlockChange(i, e.target.value)}
                  required
                />
                <button type="button" className="btn btn-outline-danger" onClick={() => removeBlock(i)} title={t("event_form.remove_button_title")}>×</button>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">{t("event_form.photo_label")}</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
            <div className="form-text">{t("event_form.photo_hint")}</div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {mode === "edit" && (
              <button
                type="button"
                className="btn btn-outline-secondary w-50"
                onClick={onCancel}
                disabled={loading}
              >
                {t("event_form.cancel")}
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? mode === "edit"
                  ? t("event_form.saving")
                  : t("event_form.creating")
                : mode === "edit"
                ? t("event_form.save_button")
                : t("event_form.create_button")}
            </button>
          </div>
        </form>

        {showModal && (
          <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.25)", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1000 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("event_form.modal_contact_title")}</h5>
                </div>
                <div className="modal-body d-flex flex-wrap gap-2">
                  {CONTACT_TYPES.map((type) => (
                    <button
                      key={type.key}
                      className="btn btn-light"
                      style={{
                        width: 110,
                        height: 70,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => addContact(type.key)}
                      disabled={contacts.some((c) => c.type === type.key)}
                    >
                      <span style={{ fontSize: 28 }}>{iconMap[type.key] || <FaGlobe />}</span>
                      <span style={{ fontSize: 14 }}>{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    {t("event_form.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showBlockModal && (
          <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.22)", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1010 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("event_form.modal_info_title")}</h5>
                </div>
                <div className="modal-body d-flex flex-wrap gap-2">
                  {EVENT_INFO_BLOCKS.map((block) => (
                    <button key={block.key} className="btn btn-light" style={{ minWidth: 110, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => {
                      setExtraBlocks([...extraBlocks, {
                        type: block.key,
                        label: block.label,
                        value: "",
                        placeholder: block.placeholder
                      }]);
                      setShowBlockModal(false);
                    }} disabled={extraBlocks.some((b) => b.type === block.key)}>
                      {block.label}
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowBlockModal(false)}>
                    {t("event_form.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: "1 1 400px", minWidth: 320, maxWidth: 480 }} className="d-none d-lg-block">
        <div className="sticky-top" style={{ top: 90, zIndex: 1 }}>
          <VibePreview
            name={name}
            description={description}
            photoFile={photoFile}
            contacts={contacts}
            type="EVENT"
            extraBlocks={extraBlocks}
          />
        </div>
      </div>
    </div>
  );
}
