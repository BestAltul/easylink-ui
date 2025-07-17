import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSignUpForm } from "./hooks/useSignUpForm";
import "./SignUp.css";
import SidebarSteps from "./components/SidebarSteps";
import StepEmail from "./components/steps/StepEmail";
import StepChooseQuestionsCount from "./components/steps/StepChooseQuestionsCount";
import StepAddQuestion from "./components/steps/StepAddQuestion";
import StepPreview from "./components/steps/StepPreview";

function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useSignUpForm(navigate, t);

  const STEP_LABELS = [
    t("signup.step1_label"),
    t("signup.step2_label"),
    t("signup.step3_question"),
    t("signup.step3_create"),
  ];

  const renderStep = () => {
    if (form.step === 1) {
      return <StepEmail t={t} form={form} />;
    }
    if (form.step === 2) {
      return <StepChooseQuestionsCount t={t} form={form} />;
    }
    if (form.step >= 3 && form.step < form.totalQuestions + 3) {
      return <StepAddQuestion t={t} form={form} />;
    }
    return <StepPreview t={t} form={form} />;
  };

  return (
    <section className="container mt-5 mb-5">
      <div
        className="mx-auto"
        style={{
          maxWidth: 1500,
          minHeight: 700,
          padding: "24px 0",
        }}
      >
        <div className="d-flex flex-row justify-content-center align-items-start gap-5">
          <SidebarSteps
            step={form.step}
            totalQuestions={form.totalQuestions}
            STEP_LABELS={STEP_LABELS}
          />
          <div
            className="flex-grow-1 d-flex flex-column align-items-center"
            style={{ minWidth: 640 }}
          >
            <div className="mb-4" style={{ width: "100%", maxWidth: 720 }}>
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(form.step / (form.totalQuestions + 2)) * 100}%`,
                    backgroundColor: "#5cb85c",
                  }}
                >
                  {form.step < form.totalQuestions + 3
                    ? t("signup.progress_step", {
                        step: form.step,
                        total: form.totalQuestions + 2,
                      })
                    : t("signup.progress_done")}
                </div>
              </div>
            </div>
            <h2
              className="mb-5 text-center fw-bold"
              style={{ fontSize: 40, width: "100%" }}
            >
              {t("signup.title")} <span role="img" aria-label="lock">🔒</span>
            </h2>
            <div style={{ width: "100%", maxWidth: 720 }}>{renderStep()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
