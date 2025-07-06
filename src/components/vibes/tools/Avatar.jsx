function Avatar({ name, photoFile }) {
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
      {photoFile ? (
        <img
          src={URL.createObjectURL(photoFile)}
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
