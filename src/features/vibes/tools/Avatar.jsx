import React, { useState } from "react";

function Avatar({ name, photo }) {
  const [open, setOpen] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || window.location.origin;

  let src = null;

  if (photo instanceof File) {
    src = URL.createObjectURL(photo);
  } else if (typeof photo === "string") {
    if (photo.startsWith("/uploads")) {
      src = `${API_BASE}${photo}`;
    } else {
      src = photo;
    }
  }

  return (
    <>
      <div
        onDoubleClick={() => src && setOpen(true)}
        style={{
          width: 94,
          height: 94,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: 14,
          marginTop: -8,
          cursor: src ? "zoom-in" : "default",
        }}
      >
        {src ? (
          <img
            src={src}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "#bbb", fontSize: 40 }}>
            {name ? name[0].toUpperCase() : "?"}
          </span>
        )}
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={src}
            alt={name}
            onDoubleClick={() => setOpen(false)}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              cursor: "zoom-out",
            }}
          />
        </div>
      )}
    </>
  );
}

export default Avatar;
