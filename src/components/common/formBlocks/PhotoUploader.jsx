import React from "react";

export default function PhotoUploader({ t, setPhotoFile }) {
  return (
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
  );
}
