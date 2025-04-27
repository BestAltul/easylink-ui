import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StartAuth({ questions, setQuestions }) {
  const [email, setEmail] = useState("");
  const [rawAnswers, setRawAnswers] = useState("");
  const [authResult, setAuthResult] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  const startAuth = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v3/auth/start", {
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

  const checkAnswers = async () => {
    try {
      const splitted = rawAnswers.split(/[,; ]/).map((s) => s.trim());
      const answers = questions.map((q, i) => ({
        entryId: q.entryId,
        answer: splitted[i],
      }));

      const res = await fetch("http://localhost:8080/api/v3/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers }),
      });

      if (res.ok) {
        const data = await res.text();
        toast.success("✅ Success: " + data, { position: "top-right" });

        setAuthResult(data);

        if (data.toLowerCase().includes("success")) {
          login({ username: email });
          navigate("/profile");
        }
      } else {
        const errorData = await res.json();

        if (res.status === 423) {
          toast.error("🚫 Blocked: " + errorData.message, {
            position: "top-right",
          });
        } else if (res.status === 401) {
          toast.warn("❗ Wrong answers: " + errorData.message, {
            position: "top-right",
          });
        } else {
          toast.error("❌ Error: " + res.status, { position: "top-right" });
        }
      }
    } catch (err) {
      // setAuthResult("Error");
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
            Your Answers (comma-separated):
          </label>
          <div className="input-group">
            <input
              type={showAnswers ? "text" : "password"}
              className="form-control shadow-sm"
              value={rawAnswers}
              onChange={(e) => setRawAnswers(e.target.value)}
              placeholder="e.g. cat, house, school"
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
