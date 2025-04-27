import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleSelectQuestion = (e) => {
    const value = e.target.value;
    setSelectedQuestion(value);
    setCustomQuestionVisible(value === "custom");
    setRealQuestion(value === "custom" ? "" : value);
  };

  const handleAdd = () => {
    if (
      (!customQuestionVisible && !selectedQuestion) ||
      (customQuestionVisible && !realQuestion.trim()) ||
      !associativeQuestion.trim() ||
      !answerText.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    let questionTemplate;

    if (selectedQuestion === "custom") {
      questionTemplate = {
        text: realQuestion.trim(),
        predefined: false,
        createdAt: new Date().toISOString(),
      };
    } else {
      const template = questionTemplates.find(
        (q) => q.text === selectedQuestion
      );
      questionTemplate = template || {
        text: selectedQuestion,
        predefined: true,
        createdAt: new Date().toISOString(),
      };
    }

    const newEntry = {
      realQuestion: questionTemplate,
      associativeQuestion: associativeQuestion.trim(),
      answer: answerText.trim(),
    };

    const newList = [...entriesList, newEntry];
    setEntriesList(newList);

    if (newList.length >= totalQuestions) {
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

  const handleSignup = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      const res = await fetch("/api/v3/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entries: entriesList }),
      });

      const message = await res.text();
      alert(message);
      navigate("/signin");
    } catch (err) {
      alert("Registration failed");
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="card p-4 shadow-sm">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              if (!email.trim()) {
                alert("Email is required");
                return;
              }
              setStep(2);
            }}
          >
            Next
          </button>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="card p-4 shadow-sm text-center">
          <label className="form-label mb-3">
            Choose number of memory locks:
          </label>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                className={`btn rounded-circle ${
                  totalQuestions === num ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => {
                  setTotalQuestions(num);
                  setStep(3);
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step >= 3 && step < totalQuestions + 3) {
      return (
        <div
          className="card p-4 shadow-sm"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h5 className="mb-3">
            Step {step - 2} of {totalQuestions}: Create a memory lock
          </h5>

          <label className="form-label">Choose a question</label>
          <select
            className="form-select mb-3"
            onChange={handleSelectQuestion}
            value={selectedQuestion}
          >
            <option value="">-- Select a question --</option>
            <option value="custom">Enter your own</option>
            {questionTemplates.map((q, i) => (
              <option key={i} value={q.text}>
                {q.text}
              </option>
            ))}
          </select>

          {customQuestionVisible && (
            <>
              <label className="form-label">Custom question</label>
              <input
                className="form-control mb-3"
                value={realQuestion}
                onChange={(e) => setRealQuestion(e.target.value)}
              />
            </>
          )}

          <label className="form-label">Hint (to help you remember)</label>
          <input
            className="form-control mb-3"
            value={associativeQuestion}
            onChange={(e) => setAssociativeQuestion(e.target.value)}
          />

          <div className="input-group mb-3">
            <input
              type={showAnswer ? "text" : "password"}
              className="form-control"
              placeholder="Answer"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <i className={`bi ${showAnswer ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          <button className="btn btn-success w-100" onClick={handleAdd}>
            {entriesList.length + 1 === totalQuestions ? "Finish" : "Next"}
          </button>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h4 className="mb-3">All Done!</h4>
        <button className="btn btn-primary" onClick={handleSignup}>
          Submit & Create Account
        </button>
      </div>
    );
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="mb-4">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${(step / (totalQuestions + 2)) * 100}%`,
              backgroundColor: "#4caf50",
            }}
          >
            Step {step} of {totalQuestions + 2}
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-center">Start Your Journey with EasyLink 🔒</h2>

      {renderStep()}
    </section>
  );
}

export default SignUp;
