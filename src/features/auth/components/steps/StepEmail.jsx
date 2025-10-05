import React from "react";
import { useTranslation } from "react-i18next";

export default function StepEmail({ form }) {
  const { t } = useTranslation("signup");

  const invalid = !form.isEmailValid && form.email.trim() && form.emailTouched;

  const goNext = () => {
    form.setEmailTouched(true);
    if (form.email.trim() && form.isEmailValid) form.setStep(2);
  };

  return (
    <div className="card p-5 shadow-sm animate-fadein">
      <div className="mb-2 small text-muted">{t("step1_info")}</div>

      <label className="form-label" htmlFor="signup-email">
        {t("step1_label")}
      </label>

      <div className="input-group mb-2">
        <input
          id="signup-email"
          type="email"
          className={`form-control ${invalid ? "is-invalid" : ""}`}
          value={form.email}
          onChange={form.handleEmailChange}
          onBlur={() => form.setEmailTouched(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goNext();
          }}
          placeholder={t("step1_placeholder", { defaultValue: "you@example.com" })}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "signup-email-error" : undefined}
        />
        {invalid && (
          <span className="input-group-text bg-white border-danger">
            <i className="bi bi-exclamation-circle text-danger" aria-hidden="true"></i>
          </span>
        )}
      </div>

      {invalid && (
        <div id="signup-email-error" className="invalid-feedback d-block">
          {t("step1_invalid")}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={goNext}
        disabled={!form.email.trim()}
      >
        {t("step1_next")}
      </button>
    </div>
  );
}
