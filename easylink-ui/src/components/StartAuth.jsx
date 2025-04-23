import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
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
        body: JSON.stringify({ answers }),
      });

      const text = await res.text();
      setAuthResult(text);

      if (text.toLowerCase().includes("success")) {
        login({ username: email });
        navigate("/profile");
      }
    } catch (err) {
      setAuthResult("Ошибка при проверке");
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

      <button onClick={startAuth} className="btn btn-primary w-100 mb-3">
        Get Questions
      </button>

      {questions.length > 0 && (
        <div className="mb-3">
          <p><strong>Questions:</strong></p>
          <ul className="list-group mb-2">
            {questions.map((q, i) => (
              <li key={i} className="list-group-item">{q.question}</li>
            ))}
          </ul>
          <label className="form-label">Your Answers (comma-separated):</label>
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

      {authResult && (
        <div className="alert alert-info mt-3">
          {authResult}
        </div>
      )}

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

export default SignIn;
