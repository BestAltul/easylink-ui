import React from "react";
import QuestionsPreview from "../QuestionsPreview";

export default function StepPreview({ t, form }) {
  return (
    <div className="animate-fadein text-center">
      <QuestionsPreview entriesList={form.entriesList} t={t} />
      <button className="btn btn-primary btn-lg px-5" onClick={form.handleSignup}>
        {t("signup.finish_create")}
      </button>
    </div>
  );
}
