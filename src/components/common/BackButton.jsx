import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BackButton({
  to = "/",
  labelKey = "vibe.back",
  className = "",
  style = {},
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      className={`btn btn-outline-secondary d-flex align-items-center ${className}`}
      style={{
        borderRadius: 12,
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
        gap: 6,
        ...style,
      }}
      onClick={() => navigate(to)}
    >
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 20 20"
        style={{ marginRight: 6, marginLeft: -3 }}
      >
        <path d="M13 5l-5 5 5 5" />
      </svg>
      {t(labelKey)}
    </button>
  );
}
