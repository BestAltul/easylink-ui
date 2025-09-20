import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useEventVibeForm } from "./useEventVibeForm";

// generic form blocks
import ContactListGeneric from "@/components/common/formBlocks/ContactListGeneric";
import ExtraBlocksGeneric from "@/components/common/formBlocks/ExtraBlocksGeneric";
import PhotoUploader from "@/components/common/formBlocks/PhotoUploader";

// preview
import { VibePreviewPane, MobilePreviewModal } from "@/components/common/preview";

// data
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";

// modals
import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";

const EVENT_INFO_BLOCKS = [
  { key: "date", label: "Event Date", placeholder: "YYYY-MM-DD" },
  { key: "location", label: "Location", placeholder: "Venue / City" },
  { key: "organizer", label: "Organizer", placeholder: "Organizer Name" },
];

export default function EventVibeForm({
  mode = "create",
  initialData = {},
  onCancel,
  onSave,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMobilePreview, setShowMobilePreview] = React.useState(false);

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
  } = useEventVibeForm({ navigate, initialData, mode, onSave });

  return (
    <div
      className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>
        {/* mobile preview button */}
        <div className="d-lg-none mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => setShowMobilePreview(true)}
          >
            {t("event_form.preview")}
          </button>
        </div>

        <form
          className="bg-light p-4 rounded-4 shadow"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          {/* name */}
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

          {/* description */}
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

          {/* contacts */}
          <div className="mb-3">
            <ContactListGeneric
              t={t}
              contacts={contacts}
              onChange={handleContactChange}
              onRemove={removeContact}
              onOpenPicker={() => setShowModal(true)}
              contactTypes={CONTACT_TYPES}
              iconMap={iconMap}
              titleKey="event_form.contacts_label"
              emptyKey="event_form.no_contacts"
              addKey="event_form.add_contact"
            />
          </div>

          {/* extra blocks */}
          <div className="mb-3">
            <ExtraBlocksGeneric
              t={t}
              blocks={extraBlocks}
              onOpenPicker={() => setShowBlockModal(true)}
              onChange={handleBlockChange}
              onRemove={removeBlock}
              titleKey="event_form.info_label"
              addKey="event_form.add_info_block"
              isDateType={(type) => type === "date"}
            />
          </div>

          {/* photo */}
          <PhotoUploader
            t={t}
            onFileChange={setPhotoFile}
            labelKey="event_form.photo_label"
            hintKey="event_form.photo_hint"
          />

          {/* buttons */}
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

        {/* contact modal */}
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

        {/* extra blocks modal */}
        {showBlockModal && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{
              background: "rgba(0,0,0,0.22)",
              position: "fixed",
              inset: 0,
              zIndex: 1010,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {t("event_form.modal_info_title")}
                  </h5>
                </div>
                <div className="modal-body d-flex flex-wrap gap-2">
                  {EVENT_INFO_BLOCKS.map((block) => (
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
                            value: "",
                            placeholder: block.placeholder,
                          },
                        ]);
                        setShowBlockModal(false);
                      }}
                      disabled={extraBlocks.some((b) => b.type === block.key)}
                    >
                      {block.label}
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowBlockModal(false)}
                  >
                    {t("event_form.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* desktop preview */}
      {(mode === "create" || mode === "edit") && (
        <VibePreviewPane
          name={name}
          description={description}
          photoFile={photoFile}
          contacts={contacts}
          extraBlocks={extraBlocks}
          type="EVENT"
        />
      )}

      {/* mobile preview modal */}
      <MobilePreviewModal
        open={showMobilePreview}
        onClose={() => setShowMobilePreview(false)}
        t={t}
        name={name}
        description={description}
        photoFile={photoFile}
        contacts={contacts}
        extraBlocks={extraBlocks}
        type="EVENT"
      />
    </div>
  );
}
