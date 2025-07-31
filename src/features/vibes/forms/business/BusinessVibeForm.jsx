import React from "react";
import CONTACT_TYPES from "../../../../data/contactTypes.js";
import VibePreview from "../../components/VibePreview.jsx";
import iconMap from "../../../../data/contactIcons.jsx";
import { FaGlobe } from "react-icons/fa";
import INFO_BLOCK_TYPES from "../../../../data/infoBlockTypes.js";
import HoursBlock from "../../../../components/InfoBlocks/HoursBlock.jsx";
import { useNavigate } from "react-router-dom";
import { useBusinessVibeForm } from "./useBusinessVibeForm";
import { useTranslation } from "react-i18next";

export default function BusinessVibeForm({ initialData = {}, mode = "create", onSave, onCancel }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    name,
    setName,
    description,
    setDescription,
    photoFile,
    setPhotoFile,
    contacts,
    setContacts,
    showModal,
    setShowModal,
    extraBlocks,
    setExtraBlocks,
    showBlockModal,
    setShowBlockModal,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  } = useBusinessVibeForm({ navigate, initialData, mode, onSave });

  return (
    <div
      className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>
        <form
          className="bg-light p-4 rounded-4 shadow"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label className="form-label">{t("business_form.name_label")}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t("business_form.name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t("business_form.desc_label")}</label>
            <textarea
              className="form-control"
              placeholder={t("business_form.desc_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{t("business_form.contacts_label")}</label>
            {(contacts?.length ?? 0) === 0 && (
              <div className="mb-2 text-muted">{t("business_form.no_contacts")}</div>
            )}
            {Array.isArray(contacts) &&
              contacts.map((c, i) => (
                <div className="input-group mb-2" key={i}>
                  <span
                    className="input-group-text"
                    title={CONTACT_TYPES.find((t) => t.key === c.type)?.label}
                  >
                    {iconMap[c.type] || <FaGlobe />}
                  </span>
                  <input
                    type={
                      c.type === "email"
                        ? "email"
                        : c.type === "website"
                        ? "url"
                        : "text"
                    }
                    className="form-control"
                    placeholder={CONTACT_TYPES.find((t) => t.key === c.type)?.label}
                    value={c.value}
                    onChange={(e) => handleContactChange(i, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeContact(i)}
                    title={t("business_form.remove_button_title")}
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
              {t("business_form.add_contact")}
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">{t("business_form.additional_info")}</label>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mb-2"
              onClick={() => setShowBlockModal(true)}
            >
              {t("business_form.add_info_block")}
            </button>
            {extraBlocks.map((block, i) => {
              if (block.type === "hours") {
                return (
                  <HoursBlock
                    key={i}
                    value={block.value}
                    onChange={(val) => handleBlockChange(i, val)}
                    onRemove={() => removeBlock(i)}
                  />
                );
              }
              return (
                <div className="input-group mb-2" key={i}>
                  <span className="input-group-text" style={{ minWidth: 80 }}>
                    {block.label}
                  </span>
                  <input
                    type={block.type === "birthday" ? "date" : "text"}
                    className="form-control"
                    placeholder={
                      INFO_BLOCK_TYPES.find((b) => b.key === block.type)?.placeholder ||
                      "Enter info"
                    }
                    value={typeof block.value === "string" ? block.value : ""}
                    onChange={(e) => handleBlockChange(i, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeBlock(i)}
                    title={t("business_form.remove_button_title")}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mb-3">
            <label className="form-label">{t("business_form.photo_label")}</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
            <div className="form-text">{t("business_form.photo_hint")}</div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {mode === "edit" && (
              <button
                type="button"
                className="btn btn-outline-secondary w-50"
                onClick={onCancel}
                disabled={loading}
              >
                {t("business_form.cancel")}
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? mode === "edit"
                  ? t("business_form.saving")
                  : t("business_form.creating")
                : mode === "edit"
                ? t("business_form.save_button")
                : t("business_form.create_button")}
            </button>
          </div>
        </form>

        {showModal && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{
              background: "rgba(0,0,0,0.25)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("business_form.modal_contact_title")}</h5>
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
                      <span style={{ fontSize: 28 }}>
                        {iconMap[type.key] || <FaGlobe />}
                      </span>
                      <span style={{ fontSize: 14 }}>{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    {t("business_form.modal_cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showBlockModal && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{
              background: "rgba(0,0,0,0.22)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1010,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("business_form.modal_info_title")}</h5>
                </div>
                <div className="modal-body d-flex flex-wrap gap-2">
                  {INFO_BLOCK_TYPES.map((block) => (
                    <button
                      key={block.key}
                      className="btn btn-light"
                      style={{
                        minWidth: 110,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setExtraBlocks([
                          ...extraBlocks,
                          {
                            type: block.key,
                            label: block.label,
                            value: block.type === "hours" ? {} : "",
                          },
                        ]);
                        setShowBlockModal(false);
                      }}
                      disabled={
                        extraBlocks.some((b) => b.type === block.key) && block.key !== "custom"
                      }
                    >
                      {block.label}
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowBlockModal(false)}>
                    {t("business_form.modal_cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div
        style={{
          flex: "1 1 400px",
          minWidth: 300,
          maxWidth: 460,
        }}
        className="d-none d-lg-block"
      > */}
        {/* <div className="sticky-top" style={{ top: 90, zIndex: 1 }}>
          <VibePreview
            name={name}
            description={description}
            photoFile={photoFile}
            contacts={contacts}
            type="BUSINESS"
            extraBlocks={extraBlocks}
          />
        </div> */}
      </div>
   // </div>
  );
}
