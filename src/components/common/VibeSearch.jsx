import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function VibeSearch() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError("");
    if (!/^\d{4,5}$/.test(code)) {
      setError(t("vibe_search.invalid_code"));
      return;
    }
    try {
      const res = await axios.get(`/api/v3/vibes/visibility/${code}`);
      navigate(`/view/${res.data.id}`);
    } catch (err) {
      setError(t("vibe_search.not_found"));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center mb-4"
      style={{ gap: 12, width: "100%", maxWidth: 600, margin: "0 auto" }}
    >
      <input
        type="text"
        className="form-control"
        placeholder={t("vibe_search.placeholder")}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        {t("vibe_search.button")}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}
