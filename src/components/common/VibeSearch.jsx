import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/services/amplitude";

export default function VibeSearch() {
  const { t } = useTranslation("vibe_search");
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = /^\d{4,5}$/.test(code);

  const onChange = (e) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 5);
    setCode(next);
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setError(t("invalid_code"));
      trackEvent("Vibe Search Failed", { reason: "invalid_format", code });
      return;
    }

    try {
      setLoading(true);
      trackEvent("Vibe Search Submit", { code_length: code.length });
      const res = await axios.get(`/api/v3/vibes/visibility/${code}`);
      trackEvent("Vibe Search Success", { code, id: res?.data?.id });
      navigate(`/view/${res.data.id}`);
    } catch (err) {
      setError(t("not_found"));
      trackEvent("Vibe Search Failed", { reason: "not_found", code });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-100"
      style={{ maxWidth: 600, margin: "0 auto" }}
      noValidate
      aria-label={t("label", "Vibe code search")}
    >
      <div
        className="d-flex justify-content-center align-items-stretch"
        style={{ gap: 12 }}
      >
        <input
          id="vibeCode"
          className="form-control"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          placeholder={t("placeholder")}
          value={code}
          onChange={onChange}
          aria-describedby="vibeSearchHint"
          aria-invalid={!!error}
          autoFocus
          style={{ minWidth: 0 }}
          autoComplete="off" 
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !isValid}
          aria-busy={loading ? "true" : "false"}
          style={{ whiteSpace: "nowrap" }}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              {t("searching", "Searching…")}
            </>
          ) : (
            t("button")
          )}
        </button>
      </div>

      <div
        id="vibeSearchHint"
        className={`mt-2 small ${error ? "text-danger" : "text-muted"}`}
        style={{ minHeight: "1.2em" }}
        aria-live="polite"
      >
        {error}
      </div>
    </form>
  );
}
