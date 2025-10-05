import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BackButton({
  to = "/",
  labelKey = "vibe.back",
  label,
  ns,
  className = "",
  style = {},
}) {
  const navigate = useNavigate();
  let nsName = ns;
  let tKey = labelKey;

  if (!nsName) {
    if (labelKey.includes(":")) {
      const [fromKeyNs, ...rest] = labelKey.split(":");
      nsName = fromKeyNs;
      tKey = rest.join(":") || "back";
    } else if (labelKey.includes(".")) {
      const [fromKeyNs, ...rest] = labelKey.split(".");
      nsName = fromKeyNs;
      tKey = rest.join(".") || "back";
    }
  }

  const { t } = useTranslation(nsName);
  const text = label ?? t(tKey);

  return (
    <button
      type="button"
      className={`btn btn-outline-secondary d-flex align-items-center ${className}`}
      style={{
        borderRadius: 12,
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
        gap: 6,
        ...style,
      }}
      onClick={() => navigate(to)}
      aria-label={text}
    >
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 20 20"
        style={{ marginRight: 6, marginLeft: -3 }}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M13 5l-5 5 5 5" />
      </svg>
      {text}
    </button>
  );
}
