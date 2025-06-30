import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

function StartAuth({ questions, setQuestions }) {
  const [email, setEmail] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const [answersList, setAnswersList] = useState([]);
  const [authResult, setAuthResult] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef();

  // Автофокус и автоподстановка ответа при смене шага
  useEffect(() => {
    setInputAnswer(answersList[currentStep] || "");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const verifyEmail = async (inputEmail) => {
    if (!inputEmail.trim()) return;

    try {
      const res = await fetch("/api/v3/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail }),
      });

      if (res.status === 404) {
        setQuestions([]);
        setAnswersList([]);
        toast.error("❌ Email not found", { position: "top-right" });
      } else {
        const data = await res.json();
        setQuestions(data);
        setAnswersList(new Array(data.length).fill(""));
        setCurrentStep(0);
      }
    } catch (err) {
      toast.error("⚠️ Error verifying email", { position: "top-right" });
    }
  };

  const handleNext = () => {
    const trimmed = inputAnswer.trim();
    if (!trimmed) return;

    const updatedAnswers = [...answersList];
    updatedAnswers[currentStep] = trimmed;
    setAnswersList(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setInputAnswer("");
      checkAnswers(updatedAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const checkAnswers = async (finalAnswers) => {
    if (finalAnswers.length !== questions.length) {
      toast.warn(`❗ Please enter exactly ${questions.length} answers.`, {
        position: "top-right",
      });
      return;
    }

    try {
      const answers = questions.map((q, i) => ({
        entryId: q.entryId,
        answer: finalAnswers[i] || "",
      }));

      const timezone =
        user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch("/api/v3/auth/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, answers, timezone }),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data["Authentication successful"];

        toast.success("Success ", { position: "top-right" });
        setAuthResult("Authenticationnsuccessful");

        sessionStorage.setItem("jwt", token);

        if (token) {
          login({ username: email, token, timezone });
          navigate("/profile");
        }
      } else {
        const contentType = res.headers.get("content-type") || "";
        let errorData = null;
        let errorText = null;

        if (contentType.includes("application/json")) {
          errorData = await res.json();
        } else {
          errorText = await res.text();
        }

        if (res.status === 423) {
          toast.error("🚫 Blocked: " + (errorData?.message || errorText), {
            position: "top-right",
          });
        } else if (res.status === 401) {
          toast.warn("❗ Wrong answers: " + (errorData?.message || errorText), {
            position: "top-right",
          });
        } else {
          toast.error("❌ Error: " + res.status, {
            position: "top-right",
          });
        }
      }
    } catch (err) {
      toast.error("⚠️ Error on checking answers: " + err.message, {
        position: "top-right",
      });
      setAuthResult("Error on checking answers");
    }
  };

  return (
    <section className="container mt-4">
      <h2 className="mb-4">Sign In</h2>

      <div className="mb-3">
        <label className="form-label">Email:</label>
        <input
          type="email"
          className="form-control shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => verifyEmail(email)}
          onKeyDown={(e) => {
            if (e.key === "Enter") verifyEmail(email);
          }}
          placeholder="Enter your email"
        />
      </div>

      {Array.isArray(questions) && questions.length > 0 && (
        <div className="d-flex gap-4 align-items-start" style={{ minHeight: 380 }}>
          {/* Left: Steps nav */}
          <ul className="list-group shadow-sm rounded-3" style={{ minWidth: 120 }}>
            {questions.map((q, idx) => (
              <li
                key={q.entryId}
                className={`list-group-item d-flex align-items-center gap-2 border-0 rounded-2 my-1 px-3 py-2 ${idx === currentStep ? "bg-success bg-opacity-10" : ""}`}
                style={{
                  cursor: "pointer",
                  fontWeight: idx === currentStep ? 600 : 400,
                  transition: "background 0.2s"
                }}
                onClick={() => setCurrentStep(idx)}
              >
                <i className={`bi bi-${answersList[idx]?.trim() ? "check-circle-fill text-success" : "circle"}`}></i>
                <span style={{fontSize: 15}}>Q{idx + 1}</span>
              </li>
            ))}
          </ul>

          {/* Center: Form */}
          <div className="flex-grow-1 position-relative">
            {/* Progress bar */}
            <div className="progress mb-3" style={{ height: 7 }}>
              <div
                className="progress-bar bg-success"
                style={{
                  width: `${((currentStep + 1) / questions.length) * 100}%`,
                  transition: "width 0.4s"
                }}
              />
            </div>
            {/* Вопрос с анимацией */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
                className="card shadow-lg p-4 rounded-4 border-0"
                style={{ minHeight: 240 }}
              >
                <div className="mb-1 text-muted" style={{ fontSize: 14 }}>
                  {questions.length > 1 && `Answer question ${currentStep + 1} of ${questions.length}`}
                </div>
                <div className="mb-2 fw-semibold" style={{ fontSize: 18 }}>
                  {questions[currentStep]?.question}
                </div>
                <div className="text-secondary mb-3" style={{ fontSize: 13 }}>
                  {/* Твоя подсказка, при желании */}
                  Case-insensitive. Only you know your answer.
                </div>
                <div className="input-group mb-2">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={inputAnswer}
                    onChange={e => setInputAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer"
                    style={{ borderRadius: "14px 0 0 14px" }}
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(v => !v)}>
                    <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                  </button>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button className="btn btn-outline-secondary px-3" onClick={handleBack} disabled={currentStep === 0}>
                    <i className="bi bi-arrow-left"></i> Back
                  </button>
                  <button className="btn btn-success px-4" onClick={handleNext} disabled={!inputAnswer.trim()}>
                    {currentStep === questions.length - 1 ? "Login" : "Next"}
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}


      {authResult && <div className="alert alert-info mt-3">{authResult}</div>}

      <p className="text-center mt-3">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="btn btn-link p-0"
          style={{ textDecoration: "underline", fontWeight: "500" }}
        >
          Sign up
        </button>
      </p>
    </section>
  );
}

export default StartAuth;
