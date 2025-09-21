import React from "react";
import { useTranslation } from "react-i18next";
import QuestionsPreview from "../QuestionsPreview";

export default function StepPreview({ form }) {
  const { t } = useTranslation("signup");
  const entriesList = form.entriesList ?? form.questions ?? [];

  return (
    <div className="card p-5 shadow-sm animate-fadein text-center">
      <QuestionsPreview entriesList={entriesList} />

      <button
        type="button"
        className="btn btn-primary btn-lg px-5 mt-3"
        onClick={form.handleSignup}
      >
        {t("finish_create")}
      </button>
    </div>
  );
}
