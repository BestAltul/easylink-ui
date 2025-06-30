import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import iconMap from "../../data/contactIcons";
import { FaGlobe } from "react-icons/fa";

// Цвет для кнопок/иконок (можно вынести как функцию)
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

export default function BusinessVibeExample() {
  const businessVibes = [
    {
      fullName: "John Doe",
      phone: "+1 555-123-4567",
      email: "john.doe@example.com",
      photoUrl: "/john_doe.png",
      facebook: "https://facebook.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.com",
      contacts: [
        { type: "phone", value: "+1 555-123-4567" },
        { type: "email", value: "john.doe@example.com" },
        { type: "website", value: "https://johndoe.com" },
        { type: "facebook", value: "https://facebook.com/johndoe" },
        { type: "linkedin", value: "https://linkedin.com/in/johndoe" }
      ],
      description: "Founder of CoffeeSpace. Connecting people with the best coffee.",
    },
    {
      fullName: "Jane Smith",
      phone: "+1 555-987-6543",
      email: "jane.smith@example.com",
      photoUrl: "/jane_smith.png",
      facebook: "https://facebook.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      website: "https://janesmith.com",
      contacts: [
        { type: "phone", value: "+1 555-987-6543" },
        { type: "email", value: "jane.smith@example.com" },
        { type: "website", value: "https://janesmith.com" },
        { type: "facebook", value: "https://facebook.com/janesmith" },
        { type: "linkedin", value: "https://linkedin.com/in/janesmith" }
      ],
      description: "Business manager & networking enthusiast. Coffee is life.",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center">Business Vibes</h2>
      <div className="row g-4 justify-content-center">
        {businessVibes.map((profile, idx) => (
          <div key={idx} className="col-12 col-lg-5">
            <VibeBusinessCard profile={profile} />
          </div>
        ))}
      </div>
    </div>
  );
}

function VibeBusinessCard({ profile }) {
  const [activeTab, setActiveTab] = useState("main");

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.website || "https://easylink.link/yourlink");
  };

  const handleDownloadVCard = () => {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
TEL:${profile.phone}
EMAIL:${profile.email}
URL:${profile.website}
END:VCARD
    `.trim();

    const blob = new Blob([vcard], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${profile.fullName.replace(/\s/g, "_")}.vcf`;
    link.click();
  };

  return (
    <div
      className="shadow rounded-4 p-4"
      style={{
        background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
        minHeight: 420,
        border: "none",
        maxWidth: 400,
        margin: "0 auto"
      }}
    >
      {/* Аватар */}
      <div className="d-flex flex-column align-items-center">
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
            marginBottom: 10,
            marginTop: -8
          }}
        >
          {profile.photoUrl
            ? <img src={profile.photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "#bbb", fontSize: 40 }}>
              {profile.fullName ? profile.fullName[0].toUpperCase() : "?"}
            </span>
          }
        </div>
        {/* Имя и описание */}
        <h4 className="mb-1 text-center" style={{ fontWeight: 700 }}>
          {profile.fullName}
        </h4>
        <div style={{ fontSize: 15, color: "#637bfd", marginBottom: 5 }}>
          Business
        </div>
        <div
          className="mb-3 text-center"
          style={{
            background: "rgba(250,250,255,0.93)",
            border: "1.5px solid #eaeaf5",
            borderRadius: 14,
            padding: "10px 15px",
            fontSize: 15,
            color: "#4d4d61",
            minHeight: 38
          }}
        >
          {profile.description}
        </div>
        {/* Табы */}
        <div className="d-flex justify-content-center mb-2 gap-2">
          <button
            className={`btn btn-sm ${activeTab === "main" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("main")}
            style={{ borderRadius: 14, fontWeight: 500, minWidth: 80 }}
          >
            Info
          </button>
          <button
            className={`btn btn-sm ${activeTab === "actions" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("actions")}
            style={{ borderRadius: 14, fontWeight: 500, minWidth: 80 }}
          >
            Actions
          </button>
        </div>
        {/* Контент табов */}
        {activeTab === "main" && (
          <div className="w-100">
            <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
              {profile.contacts && profile.contacts.length > 0 ? profile.contacts.map((c, i) => {
                const icon = iconMap[c.type] || <FaGlobe />;
                const color = getButtonColor(c.type);
                // определяем ссылку для разных типов
                let link = "#";
                if (c.type === "email" && c.value) link = `mailto:${c.value}`;
                else if (c.type === "phone" && c.value) link = `tel:${c.value}`;
                else if (c.type === "website" && c.value) link = c.value;
                else if (c.type === "facebook" && c.value) link = c.value;
                else if (c.type === "linkedin" && c.value) link = c.value;

                return (
                  <a
                    key={i}
                    className="btn btn-light d-flex align-items-center gap-2"
                    style={{
                      minWidth: 110,
                      background: color,
                      borderRadius: 20,
                      border: "none",
                      boxShadow: "0 2px 8px #e9e9ee",
                      color: "#333",
                      fontSize: 15,
                      fontWeight: 500,
                      transition: "box-shadow .12s"
                    }}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon}
                    <span style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 72,
                      whiteSpace: "nowrap"
                    }}>
                      {c.value}
                    </span>
                  </a>
                );
              }) : (
                <span className="text-muted" style={{ fontSize: 15 }}>No contacts yet</span>
              )}
            </div>
          </div>
        )}
        {activeTab === "actions" && (
          <div className="w-100 text-center mt-2">
            <div className="mb-2">QR Code (scan to open website):</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <QRCode value={profile.website || "https://easylink.link/yourlink"} size={128} />
            </div>
            <button className="btn btn-outline-success mt-3 w-100" onClick={handleCopy}>
              📋 Copy Vibe Link
            </button>
            <button className="btn btn-outline-secondary mt-2 w-100" onClick={handleDownloadVCard}>
              💾 Save to Contacts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
