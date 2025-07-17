import React from "react";
import { FaGlobe } from "react-icons/fa";
import iconMap from "../../../data/contactIcons";
import { getContactLink } from "../../../data/contactLinks";

const getButtonColor = (type) => {
  switch (type) {
    case "instagram":
      return "linear-gradient(45deg, #fd5, #f54394, #fc6736)";
    case "whatsapp":
      return "#eaffea";
    case "telegram":
      return "#e8f7fe";
    case "phone":
      return "#e9f0fd";
    case "website":
      return "#f7f8fa";
    case "email":
      return "#f7f8fa";
    default:
      return "#f5f5f5";
  }
};

export default function ContactButton({ type, value }) {
  const icon = iconMap[type] || <FaGlobe />;
  const color = getButtonColor(type);
  const link = getContactLink(type, value);

  return (
    <a
      className="contact-btn"
      style={{
        minWidth: 140,
        height: 44,
        display: "flex",
        alignItems: "center",
        background: color,
        borderRadius: 22,
        boxShadow: "0 2px 8px #e9e9ee",
        padding: "0 20px 0 16px",
        fontWeight: 500,
        fontSize: 16,
        color: "#222",
        border: "none",
        textDecoration: "none",
        gap: 10,
        overflow: "hidden",
      }}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 22,
          minWidth: 24,
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          lineHeight: "1.4",
          marginLeft: 6,
        }}
      >
        {value}
      </span>
    </a>
  );
}
