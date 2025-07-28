import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useStartAuthForm } from "./hooks/useStartAuthForm";
import { AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import StepsNav from "./components/StepsNav";
import ProgressBar from "./components/ProgressBar";
import QuestionCard from "./components/QuestionCard";
import NavigationButtons from "./components/NavigationButtons";

function StartAuth({ questions, setQuestions }) {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo");
  const subscribe = params.get("subscribe");
  const { t } = useTranslation();

  const {
    email,
    setEmail,
    inputAnswer,
    setInputAnswer,
    answersList,
    authResult,
    currentStep,
    setCurrentStep,
    showPassword,
    setShowPassword,
    inputRef,
    verifyEmail,
    handleNext,
    handleBack,
    handleKeyDown,
  } = useStartAuthForm({
    questions,
    setQuestions,
    login,
    navigate,
    t,
    subscribe,
    redirectTo,
    user,
  });

  return (
    <section className="container mt-4">
      <h2 className="mb-4">{t("auth.title")}</h2>

      <div className="mb-3">
        <div className="d-flex align-items-center">
          <input
            type="email"
            className="form-control shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") verifyEmail(email);
            }}
            placeholder="Enter your email"
            style={{ maxWidth: "400px" }}
          />

          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={() => verifyEmail(email)}
          >
            Next
          </button>
        </div>
      </div>

      {Array.isArray(questions) && questions.length > 0 && (
        <div
          className="d-flex gap-4 align-items-start"
          style={{ minHeight: 380 }}
        >
          <StepsNav
            questions={questions}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            answersList={answersList}
            t={t}
          />

          <div className="flex-grow-1 position-relative">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={questions.length}
            />

            <AnimatePresence mode="wait">
              <QuestionCard
                keyProp={currentStep}
                question={questions[currentStep]?.question}
                inputRef={inputRef}
                inputAnswer={inputAnswer}
                setInputAnswer={setInputAnswer}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleKeyDown={handleKeyDown}
                t={t}
                currentStep={currentStep}
                totalQuestions={questions.length}
              />
            </AnimatePresence>

            <NavigationButtons
              currentStep={currentStep}
              totalSteps={questions.length}
              handleBack={handleBack}
              handleNext={handleNext}
              inputAnswer={inputAnswer}
              t={t}
            />
          </div>
        </div>
      )}

      {authResult && <div className="alert alert-info mt-3">{authResult}</div>}

      <p className="text-center mt-3">
        {t("auth.no_account")}{" "}
        <button
          onClick={() => {
            const newParams = new URLSearchParams();
            if (redirectTo) newParams.set("redirectTo", redirectTo);
            if (subscribe === "true") newParams.set("subscribe", "true");

            const query = newParams.toString();
            navigate(query ? `/signup?${query}` : "/signup");
          }}
          className="btn btn-link p-0"
          style={{ textDecoration: "underline", fontWeight: "500" }}
        >
          {t("auth.signup")}
        </button>
      </p>
    </section>
  );
}

export default StartAuth;
