import React from "react";

export default function StepEmail({ t, form }) {
  return (
    <div className="card p-5 shadow-sm animate-fadein">
      <div className="mb-2 small text-muted">{t("signup.step1_info")}</div>
      <label className="form-label">{t("signup.step1_label")}</label>
      <div className="input-group mb-2">
        <input
          type="email"
          className={`form-control ${
            !form.isEmailValid && form.email.trim() && form.emailTouched ? "is-invalid" : ""
          }`}
          placeholder="you@example.com"
          value={form.email}
          onChange={form.handleEmailChange}
          onBlur={() => form.setEmailTouched(true)}
        />
        {(!form.isEmailValid && form.email.trim() && form.emailTouched) && (
          <span className="input-group-text bg-white border-danger">
            <i className="bi bi-exclamation-circle text-danger"></i>
          </span>
        )}
      </div>
      {!form.isEmailValid && form.email.trim() && form.emailTouched && (
        <div className="invalid-feedback d-block">{t("signup.step1_invalid")}</div>
      )}
      <button
        className="btn btn-primary mt-3"
        onClick={() => {
          form.setEmailTouched(true);
          if (form.email.trim() && form.isEmailValid) form.setStep(2);
        }}
        disabled={!form.email.trim()}
      >
        {t("signup.step1_next")}
      </button>
    </div>
  );
}
