import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StartAuth({ questions, setQuestions }) {
  const [email, setEmail] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const [answersList, setAnswersList] = useState([]);
  const [authResult, setAuthResult] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  const startAuth = async () => {
    if (!email.trim()) {
      toast.error("⚠️ Please enter your email!", { position: "top-right" });
      return;
    }
  
    try {
      const res = await fetch("/api/v3/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      alert("Ошибка при получении вопросов");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputAnswer.trim();
      if (trimmed && !answersList.includes(trimmed)) {
        setAnswersList([...answersList, trimmed]);
        setInputAnswer("");
      }
    }
  };

  const removeAnswer = (indexToRemove) => {
    setAnswersList(answersList.filter((_, index) => index !== indexToRemove));
  };

  const checkAnswers = async () => {
    if (answersList.length !== questions.length) {
      toast.warn(`❗ Please enter exactly ${questions.length} answers.`, {
        position: "top-right",
      });
      return;
    }

    try {
      const answers = questions.map((q, i) => ({
        entryId: q.entryId,
        answer: answersList[i] || "",
      }));

      const timezone =
        user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch("/api/v3/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers, timezone }),
      });

      if (res.ok) {
        const data = await res.text();
        toast.success("✅ Success: " + data, { position: "top-right" });
        setAuthResult(data);

        if (data.toLowerCase().includes("success")) {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          login({ username: email, timezone });
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
          placeholder="Enter your email"
        />
      </div>

      <button className="btn btn-success w-100 mb-4" onClick={startAuth}>
        Start Auth
      </button>

      {Array.isArray(questions) && questions.length > 0 && (
        <div
          className="p-4 rounded shadow"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <strong>Received questions:</strong>
          <ul className="mt-2">
            {questions.map((q, i) => (
              <li key={i} className="list-group-item">
                {q.question}
              </li>
            ))}
          </ul>


          <label className="form-label mt-3">
            Your Answers (enter devided):
          </label>

          <div className="d-flex flex-wrap mb-2" style={{ gap: "5px" }}>
            {answersList.map((answer, index) => (
              <div
                key={index}
                className="badge bg-primary d-flex align-items-center"
                style={{ padding: "0.5rem", fontSize: "1rem" }}
              >
                {showAnswers ? answer : "•••••"}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  aria-label="Remove"
                  onClick={() => removeAnswer(index)}
                  style={{ fontSize: "0.6rem" }}
                ></button>
              </div>
            ))}
          </div>

          <div className="input-group">
            <input
              type={showAnswers ? "text" : "password"}
              className="form-control shadow-sm"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type answer and press Enter"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowAnswers((prev) => !prev)}
            >
              {showAnswers ? "Hide" : "Show"}
            </button>
          </div>

          <button onClick={checkAnswers} className="btn btn-success w-100 mt-3">
            Check Answers
          </button>
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
