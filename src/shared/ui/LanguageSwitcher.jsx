import React from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

const LANGUAGES = [
  { code: "en", label: "English",  flag: <ReactCountryFlag countryCode="GB" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} /> },
  { code: "ru", label: "Русский",  flag: <ReactCountryFlag countryCode="RU" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} /> },
  { code: "fr", label: "Français", flag: <ReactCountryFlag countryCode="FR" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} /> },
];

export default function LanguageSwitcher({ dropUp = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // позиционирование меню: вверх или вниз
  const menuPositionStyle = dropUp
    ? { bottom: 40, top: "auto", marginBottom: 8 } // ⬆️ вверх от кнопки
    : { top: 40, bottom: "auto", marginTop: 8 };   // ⬇️ вниз от кнопки

  return (
    <div className="dropdown" style={{ minWidth: 80, marginLeft: 12, position: "relative" }}>
      <button
        className="btn btn-light dropdown-toggle d-flex align-items-center"
        style={{
          borderRadius: 16,
          fontWeight: 500,
          boxShadow: "0 2px 8px rgba(70,110,255,0.04)",
          gap: 8,
          padding: "5px 14px"
        }}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {currentLang.flag} {currentLang.label}
      </button>

      {open && (
        <div
          className="dropdown-menu show"
          role="menu"
          style={{
            position: "absolute",
            left: 0,
            minWidth: 130,
            borderRadius: 14,
            boxShadow: "0 4px 24px #e6e9f7",
            zIndex: 1000,
            padding: 0,
            background: "#fff",
            overflow: "hidden",
            ...menuPositionStyle
          }}
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className="dropdown-item d-flex align-items-center"
              style={{
                fontWeight: i18n.language === lang.code ? "bold" : "normal",
                gap: 8,
                padding: "8px 16px",
                background: i18n.language === lang.code ? "#eef2ff" : "#fff",
                border: "none",
                cursor: "pointer",
                width: "100%",
                textAlign: "left"
              }}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              role="menuitem"
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
