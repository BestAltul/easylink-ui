import React from "react";

// generic form blocks
import ContactListGeneric from "@/components/common/formBlocks/ContactListGeneric";
import ExtraBlocksGeneric from "@/components/common/formBlocks/ExtraBlocksGeneric";
import PhotoUploader from "@/components/common/formBlocks/PhotoUploader";

// special block
import HoursBlock from "@/components/InfoBlocks/HoursBlock";

// data
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";

export default function MainTab({
  t,
  mode,
  loading,

  name,
  setName,
  description,
  setDescription,

  contacts = [],
  onContactChange, // (index, value)
  onContactRemove, // (index)
  onOpenContactPicker, // () => void

  extraBlocks = [],
  onBlockChange, // (index, value) -> void (индекс из ОРИГ массива)
  onBlockRemove, // (index) -> void
  onOpenBlockPicker, // () => void

  photo,
  setPhoto,

  onCancel,
}) {
  const nonHourIndexMap = React.useMemo(
    () =>
      extraBlocks.reduce((acc, b, i) => {
        if (!isHoursBlock(b)) acc.push(i);
        return acc;
      }, []),
    [extraBlocks]
  );

  const DAY_KEYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  function looksLikeHoursObject(val) {
    if (!val || typeof val !== "object" || Array.isArray(val)) return false;
    const keys = Object.keys(val).map((k) => k.toLowerCase());
    return DAY_KEYS.some((d) => keys.includes(d));
  }

  function isHoursBlock(b) {
    const type = String(b?.type || "").toLowerCase();
    const label = String(b?.label || "").toLowerCase();
    if (type === "hours" || label === "hours") return true;
    return looksLikeHoursObject(b?.value);
  }

  function normalizeHours(val) {
    if (typeof val === "string") {
      try {
        val = JSON.parse(val);
      } catch {
        val = {};
      }
    }
    const base = {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    };
    return val && typeof val === "object" && !Array.isArray(val)
      ? { ...base, ...val }
      : base;
  }

  const nonHourBlocks = React.useMemo(
    () => nonHourIndexMap.map((i) => extraBlocks[i]),
    [nonHourIndexMap, extraBlocks]
  );

  return (
    <>
      {/* name */}
      <div className="mb-3">
        <label className="form-label">{t("name_label")}</label>
        <input
          type="text"
          className="form-control"
          placeholder={t("name_placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* description */}
      <div className="mb-3">
        <label className="form-label">{t("desc_label")}</label>
        <textarea
          className="form-control"
          placeholder={t("desc_placeholder")}
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
          onChange={onContactChange}
          onRemove={onContactRemove}
          onOpenPicker={onOpenContactPicker}
          contactTypes={CONTACT_TYPES}
          iconMap={iconMap}
          titleKey="contacts_label"
          emptyKey="no_contacts"
          addKey="add_contact"
        />
      </div>

      {extraBlocks.map(
        (b, i) =>
          isHoursBlock(b) && (
            <HoursBlock
              key={`hours-${i}`}
              value={normalizeHours(b.value)}
              onChange={(val) => onBlockChange(i, val)}
              onRemove={() => onBlockRemove(i)}
            />
          )
      )}

      <div className="mb-3">
        <ExtraBlocksGeneric
          t={t}
          blocks={nonHourBlocks}
          onOpenPicker={onOpenBlockPicker}
          onChange={(idx, val) => onBlockChange(nonHourIndexMap[idx], val)}
          onRemove={(idx) => onBlockRemove(nonHourIndexMap[idx])}
          titleKey="additional_info"
          addKey="add_info_block"
          isDateType={(type) => type === "birthday"}
        />
      </div>

      {/* photo */}
      <PhotoUploader
        t={t}
        onFileChange={setPhoto}
        labelKey="photo_label"
        hintKey="photo_hint"
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
            {t("cancel")}
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading
            ? mode === "edit"
              ? t("saving")
              : t("creating")
            : mode === "edit"
            ? t("save_button")
            : t("create_button")}
        </button>
      </div>
    </>
  );
}
