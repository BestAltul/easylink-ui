import iconMap from "../../data/contactIcons"; 
import { FaGlobe } from "react-icons/fa";

export default function VibeDetailInfo({ vibe }) {
  if (!vibe) return null;

  const getButtonColor = (type) => {
    switch (type) {
      case "instagram": return "linear-gradient(45deg, #fd5, #f54394, #fc6736)";
      case "whatsapp": return "#eaffea";
      case "telegram": return "#e8f7fe";
      case "phone": return "#e9f0fd";
      case "website": return "#f7f8fa";
      case "email": return "#f7f8fa";
      default: return "#f5f5f5";
    }
  };

  const getContactLink = (c) => {
    if (c.type === "instagram" && c.value)
      return c.value.startsWith("http") ? c.value : `https://instagram.com/${c.value.replace(/^@/, "")}`;
    if (c.type === "whatsapp" && c.value)
      return c.value.startsWith("http") ? c.value : `https://wa.me/${c.value.replace(/\D/g, "")}`;
    if (c.type === "telegram" && c.value)
      return c.value.startsWith("http") ? c.value : `https://t.me/${c.value.replace(/^@/, "")}`;
    if (c.type === "email" && c.value)
      return `mailto:${c.value}`;
    if (c.type === "phone" && c.value)
      return `tel:${c.value}`;
    if (c.type === "website" && c.value)
      return c.value.startsWith("http") ? c.value : `https://${c.value}`;
    return "#";
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 14,
        boxShadow: "0 2px 12px #e9eafe30",
        padding: "0 0 18px 0"
      }}
    >

      <div style={{ display: "flex", justifyContent: "center", marginTop: -34, marginBottom: 10 }}>
        {vibe.photo ? (
          <img
            src={vibe.photo}
            alt={vibe.name}
            style={{
              width: 86,
              height: 86,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 2px 16px #e6e8f7",
              background: "#f7f8fa"
            }}
          />
        ) : (
          <div style={{
            width: 86, height: 86, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#f3f7ff", color: "#b2bad9", fontSize: 38, fontWeight: 700
          }}>
            {vibe.name ? vibe.name[0].toUpperCase() : "?"}
          </div>
        )}
      </div>

      <h2 style={{
        fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", textAlign: "center"
      }}>{vibe.name}</h2>
      <div style={{
        color: "#6b7acb", fontWeight: 500, fontSize: 14, textAlign: "center", marginBottom: 12
      }}>
        {vibe.type?.charAt(0).toUpperCase() + vibe.type?.slice(1)}
      </div>

      {vibe.description && (
        <div style={{
          background: "#f9faff",
          border: "1.5px solid #e6eaf6",
          borderRadius: 10,
          padding: "13px 15px",
          margin: "0 auto 14px auto",
          width: "98%",
          fontSize: 15.5,
          color: "#4d4d61",
          textAlign: "center",
        }}>
          {vibe.description}
        </div>
      )}

      <div style={{
        width: "38%", height: 2, background: "linear-gradient(90deg,#d8dffa,#f6eaff 80%)",
        borderRadius: 99, margin: "14px auto 18px auto"
      }} />

      {vibe.contacts?.length > 0 && (
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <b style={{ fontSize: 15, color: "#637bfd" }}>Contacts</b>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "7px",
            justifyContent: "center",
            marginTop: 7,
            marginBottom: 5
          }}>
            {vibe.contacts.map((c, i) => {
              const icon = (iconMap && iconMap[c.type]) || <FaGlobe />;
              const color = getButtonColor(c.type);
              return (
                <a
                  key={i}
                  className="btn"
                  style={{
                    minWidth: 86,
                    background: color,
                    fontWeight: 500,
                    borderRadius: 20,
                    border: "none",
                    boxShadow: "0 1px 4px #e9e9ee",
                    color: "#333",
                    fontSize: 14,
                    padding: "6px 12px 6px 8px",
                    display: "flex", alignItems: "center", gap: 7,
                    textDecoration: "none"
                  }}
                  href={getContactLink(c)}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  title={c.type}
                >
                  {icon}
                  <span style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 80,
                    whiteSpace: "nowrap"
                  }}>
                    {c.value}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {vibe.extraBlocks?.length > 0 && (
        <div style={{ margin: "16px 0 0 0" }}>
          {vibe.extraBlocks.map((block, i) => (
            <div key={i}
              style={{
                background: "#f6faff",
                borderLeft: "3px solid #637bfd",
                borderRadius: 7,
                fontSize: 14.5,
                color: "#3a405a",
                padding: "8px 12px",
                marginBottom: 7,
                fontWeight: 500
              }}>
              <span style={{ color: "#637bfd" }}>{block.label}:</span> {block.value || <span style={{color: "#bbb"}}>not specified</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
