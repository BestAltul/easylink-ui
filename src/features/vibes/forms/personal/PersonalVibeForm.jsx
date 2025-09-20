import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { usePersonalVibeForm } from "./usePersonalVibeForm";

// generic preview
import { VibePreviewPane, MobilePreviewModal } from "@/components/common/preview";

// generic form blocks
import ContactListGeneric from "@/components/common/formBlocks/ContactListGeneric";
import ExtraBlocksGeneric from "@/components/common/formBlocks/ExtraBlocksGeneric";
import PhotoUploader from "@/components/common/formBlocks/PhotoUploader";

// data
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";

// modals
import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";
import PersonalInfoBlockModal from "@/features/vibes/components/Modals/PersonalInfoBlockModal";

// alert 
import InfoAlert from "./components/InfoAlert";

export default function PersonalVibeForm({
  initialData = {},
  mode = "create",
  onSave,
  onCancel
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMobilePreview, setShowMobilePreview] = React.useState(false);

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
    <div className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100"
         style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>

        {/* mobile preview btn */}
        <div className="d-lg-none mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => setShowMobilePreview(true)}
          >
            {t("personal_form.preview")}
          </button>
        </div>

        <form className="bg-light p-4 rounded-4 shadow" style={{ width: "100%" }} onSubmit={handleSubmit}>
          {showInfo && (
            <InfoAlert t={t} onClose={() => setShowInfo(false)} />
          )}

          {/* name */}
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

          {/* bio */}
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
              titleKey="personal_form.contacts_label"
              emptyKey="personal_form.no_contacts"
              addKey="personal_form.add_contact"
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
              titleKey="personal_form.additional_info"
              addKey="personal_form.add_info_block"
              isDateType={(type) => type === "birthday"}
            />
          </div>

          <PhotoUploader
            t={t}
            onFileChange={setPhotoFile}
            labelKey="personal_form.photo_label"
            hintKey="personal_form.photo_hint"
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

        {/* contact type modal */}
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

        {/* extra block modal */}
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

      {/* desktop preview */}
      {(mode === "create" || mode === "edit") && (
        <VibePreviewPane
          name={name}
          description={description}
          photoFile={photoFile}
          contacts={contacts}
          extraBlocks={extraBlocks}
          type="PERSONAL"
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
        type="PERSONAL"
      />
    </div>
  );
}
