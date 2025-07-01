import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

const STEP_LABELS = [
  "Email",
  "Choose number of questions",
  "Questions & Answers",
  "Finish"
];

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
      toast.error("Please fill in all fields", { position: "top-right" });
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
      toast.error("Email is required", { position: "top-right" });
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
        toast.error(message || "Registration failed", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Registration error", { position: "top-right" });
    }
  };

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
        <h6 className="mb-3">Your memory is protected 🔐</h6>
        <ul className="list-group">
          {entriesList.map((entry, i) => (
            <li key={i} className="list-group-item d-flex flex-column align-items-start border-0 bg-light mb-2 rounded">
              <span className="fw-semibold mb-1">Q: {entry.realQuestion.text}</span>
              <span className="text-muted mb-1">Hint: {entry.associativeQuestion}</span>
              <span style={{ opacity: 0.5 }}>Answer: ••••</span>
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
          <div className="mb-2 small text-muted">Enter your email to create an account.</div>
          <label className="form-label">Email</label>
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
            <div className="invalid-feedback d-block">Enter a valid email address</div>
          )}
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              setEmailTouched(true);
              if (email.trim() && isEmailValid) setStep(2);
            }}
            disabled={!email.trim()}
          >
            Next
          </button>
        </div>
      );
    }

    // CHOOSE NUMBER STEP
    if (step === 2) {
      return (
        <div className="card p-5 shadow-sm animate-fadein text-center">
          <div className="mb-4 small text-muted" style={{ fontSize: 18 }}>
            How many memory locks do you want to add? More = safer!
          </div>
          <label className="form-label mb-4" style={{ fontSize: 20 }}>Choose number of memory locks:</label>
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
            Think up a question that only you know the answer to. This will be used for passwordless login!
          </div>
          <h5 className="mb-3">Question {step - 2} of {totalQuestions}</h5>

          {subStep === 0 && (
            <>
              <label className="form-label">Question</label>
              <select className="form-select mb-3" onChange={handleSelectQuestion} value={selectedQuestion}>
                <option value="">— Select —</option>
                <option value="custom">Write your own</option>
                {questionTemplates.map((q, i) => (
                  <option key={i} value={q.text}>{q.text}</option>
                ))}
              </select>
              {customQuestionVisible && (
                <>
                  <label className="form-label">Custom question</label>
                  <input
                    className="form-control mb-3"
                    value={realQuestion}
                    onChange={(e) => setRealQuestion(e.target.value)}
                    placeholder="Enter your question..."
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
                  Next
                </button>
              </div>
            </>
          )}

          {subStep === 1 && (
            <>
              <label className="form-label">Hint (to help you remember)</label>
              <input
                className="form-control mb-3"
                value={associativeQuestion}
                onChange={(e) => setAssociativeQuestion(e.target.value)}
                placeholder="This will help you recall the answer"
                autoFocus
              />
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-light px-4"
                  onClick={() => setSubStep(0)}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary px-4"
                  disabled={!associativeQuestion.trim()}
                  onClick={() => setSubStep(2)}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {subStep === 2 && (
            <>
              <label className="form-label">Answer</label>
              <div className="input-group mb-3">
                <input
                  type={showAnswer ? "text" : "password"}
                  className="form-control"
                  placeholder="Answer"
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
                  Back
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
                  {isLastQuestion ? "Create" : "Next"}
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
          Create Account
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
                    ? `Step ${step} of ${totalQuestions + 2}`
                    : "Almost done!"}
                </div>
              </div>
            </div>
            <h2 className="mb-5 text-center fw-bold" style={{ fontSize: 40, width: "100%" }}>
              EasyLink Registration <span role="img" aria-label="lock">🔒</span>
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
