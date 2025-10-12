import React from "react";

function Avatar({ name, photoUrl, size = 94 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: 14,
        marginTop: -8,
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ color: "#bbb", fontSize: 40 }}>
          {name ? name[0].toUpperCase() : "?"}
        </span>
      )}
    </div>
  );
}

export default Avatar;
