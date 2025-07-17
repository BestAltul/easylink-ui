import React from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

const LANGUAGES = [
  {
    code: "en",
    label: "English",
    flag: <ReactCountryFlag countryCode="GB" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} />
  },
  {
    code: "ru",
    label: "Русский",
    flag: <ReactCountryFlag countryCode="RU" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} />
  },
  {
    code: "fr",
    label: "Français",
    flag: <ReactCountryFlag countryCode="FR" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} />
  }
  // {
  //   code: "es",
  //   label: "Español",
  //   flag: <ReactCountryFlag countryCode="ES" svg style={{ width: "1.3em", height: "1.3em", marginRight: 6 }} />
  // }
  // // Можешь добавить еще языки здесь
];


export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);

  // Current Language
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

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
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            minWidth: 130,
            borderRadius: 14,
            boxShadow: "0 4px 24px #e6e9f7",
            zIndex: 1000,
            padding: 0,
            background: "#fff",
            overflow: "hidden"
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
                cursor: "pointer"
              }}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
