import React from "react";
import Avatar from "./Avatar";
import usePhotoPreview from "./usePhotoPreview";

export default function AvatarPicker({ name, photo, editMode, onChangePhoto }) {
  const fileRef = React.useRef(null);
  const previewUrl = usePhotoPreview(photo);

  const handlePickPhoto = () => {
    if (!editMode) return;
    fileRef.current?.click();
  };

  const handlePhotoSelected = (e) => {
    const file = e.target.files?.[0];
    if (file && onChangePhoto) onChangePhoto(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handlePhotoSelected}
      />

      <div
        style={{
          position: "relative",
          cursor: editMode ? "pointer" : "default",
        }}
        onClick={handlePickPhoto}
        aria-label={editMode ? "Change photo" : undefined}
      >
        <Avatar name={name} photo={photo} photoUrl={previewUrl} />

        {editMode && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(0,0,0,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#fff",
              opacity: 0,
              transition: "opacity .15s",
            }}
            className="vibe-avatar-overlay"
          >
            change photo
          </div>
        )}
      </div>
    </>
  );
}
