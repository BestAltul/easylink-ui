function Avatar({ name, photo }) {
  //const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
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
    <div
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
  );
}

export default Avatar;
