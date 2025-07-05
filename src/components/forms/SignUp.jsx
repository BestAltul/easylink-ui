import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

function SignUp() {
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionTemplates, setQuestionTemplates] = useState([]);
  const [step, setStep] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(3);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestionVisible, setCustomQuestionVisible] = useState(false);
  const [realQuestion, setRealQuestion] = useState("");
  const [associativeQuestion, setAssociativeQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [entriesList, setEntriesList] = useState([]);
  const [emailTouched, setEmailTouched] = useState(false);
  const [subStep, setSubStep] = useState(0); // 0 - вопрос, 1 - подсказка, 2 - ответ
  const navigate = useNavigate();
  const { t } = useTranslation();

  // === EMAIL REGEX ===
  const isEmailValid = email.trim().length === 0
    ? true
    : /^\S+@\S+\.\S+$/.test(email.trim());

  useEffect(() => {
    fetch("/api/v3/auth/question-templates")
      .then((res) => res.json())
      .then((data) => setQuestionTemplates(data))
      .catch(() => setQuestionTemplates([]));
  }, []);

  const handleSelectQuestion = (e) => {
    const value = e.target.value;
    setSelectedQuestion(value);
    setCustomQuestionVisible(value === "custom");
    setRealQuestion(value === "custom" ? "" : value);
  };

  const handleAdd = () => {
    if ((!customQuestionVisible && !selectedQuestion) || (customQuestionVisible && !realQuestion.trim()) || !associativeQuestion.trim() || !answerText.trim()) {
      toast.error(t("signup.toast_fill_all"), { position: "top-right" });
      return;
    }

    const questionTemplate = selectedQuestion === "custom"
      ? { text: realQuestion.trim(), predefined: false, createdAt: new Date().toISOString() }
      : { text: selectedQuestion, predefined: true, createdAt: new Date().toISOString() };

    const newEntry = {
      realQuestion: questionTemplate,
      associativeQuestion: associativeQuestion.trim(),
      answer: answerText.trim(),
    };

    const updatedList = [...entriesList, newEntry];
    setEntriesList(updatedList);

    if (updatedList.length >= totalQuestions) {
      setStep(totalQuestions + 3);
    } else {
      setStep((prev) => prev + 1);
    }

    setSelectedQuestion("");
    setCustomQuestionVisible(false);
    setRealQuestion("");
    setAssociativeQuestion("");
    setAnswerText("");
    setShowAnswer(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailTouched) setEmailTouched(false);
  };

  const handleSignup = async () => {
    if (!email.trim()) {
      toast.error(t("signup.toast_email_required"), { position: "top-right" });
      return;
    }

    try {
      const res = await fetch("/api/v3/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entries: entriesList }),
      });

      const message = await res.text();
      if (res.ok) {
        toast.success(message, { position: "top-right" });
        navigate("/signin");
      } else {
        toast.error(message || t("signup.toast_fail"), { position: "top-right" });
      }
    } catch (error) {
      toast.error(t("signup.toast_error"), { position: "top-right" });
    }
  };

  // Для лейблов шагов сбоку
  const STEP_LABELS = [
    t("signup.step1_label"),
    t("signup.step2_label"),
    t("signup.step3_question"),
    t("signup.step3_create")
  ];

  function SidebarSteps() {
    return (
      <div
        className="d-none d-md-flex flex-column align-items-start gap-4 mt-4 pe-4"
        style={{ minWidth: 260 }}
      >
        {[1, 2, 3, 4].map((s, idx) => {
          const isActive = step === s || (s === 3 && step > 2 && step < totalQuestions + 3);
          const isDone = (s < step) || (s === 3 && step >= totalQuestions + 3);
          return (
            <div
              key={s}
              className="d-flex align-items-center gap-3"
              style={{
                minWidth: 200,
                fontWeight: isActive ? 700 : 400,
                fontSize: isActive ? 22 : 17,
                color: isActive ? "#0d6efd" : "#212529",
                letterSpacing: 0.1,
              }}
            >
              <span
                className={`badge d-flex align-items-center justify-content-center rounded-circle ${isDone ? "bg-success" : isActive ? "bg-primary" : "bg-light border"}`}
                style={{
                  width: 44,
                  height: 44,
                  fontSize: 22,
                  boxShadow: isActive ? "0 0 0 3px #e2f8e5" : "none"
                }}
              >
                {isDone ? <i className="bi bi-check-lg"></i> : s}
              </span>
              <span style={{ lineHeight: 1.15, textAlign: "left" }}>{STEP_LABELS[s - 1]}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function QuestionsPreview() {
    return (
      <div className="card mb-3 p-3 shadow-sm">
        <h6 className="mb-3">{t("signup.questions_preview_title")}</h6>
        <ul className="list-group">
          {entriesList.map((entry, i) => (
            <li key={i} className="list-group-item d-flex flex-column align-items-start border-0 bg-light mb-2 rounded">
              <span className="fw-semibold mb-1">{t("signup.questions_preview_q")} {entry.realQuestion.text}</span>
              <span className="text-muted mb-1">{t("signup.questions_preview_hint")} {entry.associativeQuestion}</span>
              <span style={{ opacity: 0.5 }}>{t("signup.questions_preview_answer")}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const renderStep = () => {
    // EMAIL STEP
    if (step === 1) {
      return (
        <div className="card p-5 shadow-sm animate-fadein">
          <div className="mb-2 small text-muted">{t("signup.step1_info")}</div>
          <label className="form-label">{t("signup.step1_label")}</label>
          <div className="input-group mb-2">
            <input
              type="email"
              className={`form-control ${!isEmailValid && email.trim() && emailTouched ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              autoFocus
            />
            {(!isEmailValid && email.trim() && emailTouched) && (
              <span className="input-group-text bg-white border-danger">
                <i className="bi bi-exclamation-circle text-danger"></i>
              </span>
            )}
          </div>
          {!isEmailValid && email.trim() && emailTouched && (
            <div className="invalid-feedback d-block">{t("signup.step1_invalid")}</div>
          )}
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              setEmailTouched(true);
              if (email.trim() && isEmailValid) setStep(2);
            }}
            disabled={!email.trim()}
          >
            {t("signup.step1_next")}
          </button>
        </div>
      );
    }

    // CHOOSE NUMBER STEP
    if (step === 2) {
      return (
        <div className="card p-5 shadow-sm animate-fadein text-center">
          <div className="mb-4 small text-muted" style={{ fontSize: 18 }}>
            {t("signup.step2_info")}
          </div>
          <label className="form-label mb-4" style={{ fontSize: 20 }}>{t("signup.step2_label")}</label>
          <div className="d-flex justify-content-center gap-4 flex-nowrap mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                style={{
                  width: "74px",
                  height: "74px",
                  fontSize: "2rem",
                  borderRadius: "50%",
                  boxShadow: totalQuestions === num ? "0 2px 10px #b2f2d2" : "0 1px 3px #eee",
                  fontWeight: 700
                }}
                className={`btn shadow-sm d-flex align-items-center justify-content-center ${totalQuestions === num ? "btn-success" : "btn-outline-success"}`}
                onClick={() => { setTotalQuestions(num); setStep(3); }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // QUESTIONS STEP
    if (step >= 3 && step < totalQuestions + 3) {
      const isLastQuestion = entriesList.length + 1 === totalQuestions;
      return (
        <div className="card p-5 shadow-sm animate-fadein" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="mb-2 small text-muted" style={{ fontSize: 16 }}>
            {t("signup.step3_info")}
          </div>
          <h5 className="mb-3">{t("signup.step3_question")} {step - 2} {t("signup.step3_of", { total: totalQuestions })}</h5>

          {subStep === 0 && (
            <>
              <label className="form-label">{t("signup.step3_question")}</label>
              <select className="form-select mb-3" onChange={handleSelectQuestion} value={selectedQuestion}>
                <option value="">— {t("signup.step3_select")} —</option>
                <option value="custom">{t("signup.step3_custom")}</option>
                {questionTemplates.map((q, i) => (
                  <option key={i} value={q.text}>{q.text}</option>
                ))}
              </select>
              {customQuestionVisible && (
                <>
                  <label className="form-label">{t("signup.step3_custom_label")}</label>
                  <input
                    className="form-control mb-3"
                    value={realQuestion}
                    onChange={(e) => setRealQuestion(e.target.value)}
                    placeholder={t("signup.step3_custom_label")}
                    autoFocus
                  />
                </>
              )}
              <div className="text-end">
                <button
                  className="btn btn-primary px-4"
                  disabled={
                    (!customQuestionVisible && !selectedQuestion) ||
                    (customQuestionVisible && !realQuestion.trim())
                  }
                  onClick={() => setSubStep(1)}
                >
                  {t("signup.step3_next")}
                </button>
              </div>
            </>
          )}

          {subStep === 1 && (
            <>
              <label className="form-label">{t("signup.step3_hint")}</label>
              <input
                className="form-control mb-3"
                value={associativeQuestion}
                onChange={(e) => setAssociativeQuestion(e.target.value)}
                placeholder={t("signup.step3_hint_placeholder")}
                autoFocus
              />
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-light px-4"
                  onClick={() => setSubStep(0)}
                >
                  {t("signup.step3_back")}
                </button>
                <button
                  className="btn btn-primary px-4"
                  disabled={!associativeQuestion.trim()}
                  onClick={() => setSubStep(2)}
                >
                  {t("signup.step3_next")}
                </button>
              </div>
            </>
          )}

          {subStep === 2 && (
            <>
              <label className="form-label">{t("signup.step3_answer")}</label>
              <div className="input-group mb-3">
                <input
                  type={showAnswer ? "text" : "password"}
                  className="form-control"
                  placeholder={t("signup.step3_answer")}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAnswer(!showAnswer)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showAnswer ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-light px-4"
                  onClick={() => setSubStep(1)}
                >
                  {t("signup.step3_back")}
                </button>
                <button
                  style={{
                    borderRadius: "12px",
                    fontSize: "1.17rem",
                    fontWeight: 600,
                    minWidth: "145px",
                    padding: "13px 35px",
                    background: "linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(34,211,238,0.09)",
                    cursor: "pointer",
                    transition: "filter 0.16s, transform 0.1s"
                  }}
                  disabled={!answerText.trim()}
                  onClick={() => {
                    handleAdd();
                    setSubStep(0); // reset for next question
                  }}
                >
                  {isLastQuestion ? t("signup.step3_create") : t("signup.step3_next")}
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    // FINISH STEP
    return (
      <div className="animate-fadein text-center">
        <QuestionsPreview />
        <button className="btn btn-primary btn-lg px-5" onClick={handleSignup}>
          {t("signup.finish_create")}
        </button>
      </div>
    );
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="mx-auto"
          style={{
            maxWidth: 1500,
            minHeight: 700,
            padding: "24px 0"
          }}>
        <div className="d-flex flex-row justify-content-center align-items-start gap-5">
          <SidebarSteps />
          <div className="flex-grow-1 d-flex flex-column align-items-center" style={{ minWidth: 640 }}>
            <div className="mb-4" style={{ width: "100%", maxWidth: 720 }}>
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(step / (totalQuestions + 2)) * 100}%`, backgroundColor: "#5cb85c" }}
                >
                  {step < totalQuestions + 3
                    ? t("signup.progress_step", { step, total: totalQuestions + 2 })
                    : t("signup.progress_done")}
                </div>
              </div>
            </div>
            <h2 className="mb-5 text-center fw-bold" style={{ fontSize: 40, width: "100%" }}>
              {t("signup.title")} <span role="img" aria-label="lock">🔒</span>
            </h2>
            <div style={{ width: "100%", maxWidth: 720 }}>{renderStep()}</div>
          </div>
        </div>
      </div>
      <style>
        {`
          .animate-fadein {
            animation: fadeIn .5s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to   { opacity: 1; transform: none;}
          }
          @media (min-width: 900px) {
            .card {
              min-width: 520px;
              max-width: 720px;
            }
          }
          .btn-outline-success, .btn-success {
            min-width: 30px !important;
            min-height: 30px !important;
            font-size: 2.1rem !important;
            border-radius: 13px !important;
          }
        `}
      </style>
    </section>
  );
}

export default SignUp;
