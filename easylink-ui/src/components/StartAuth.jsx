import { useState } from "react";
import { useAuth } from "../js/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";



function StartAuth({ questions, setQuestions }) {
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleStartAuth = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v3/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      setQuestions(result);
      login({ username: email });
    } catch (err) {
      alert("Ошибка при получении вопросов");
      setQuestions([]);
    }
  };

  return (
    <section className="container mt-4">
      <h2 className="mb-4">Start Authentication</h2>

      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label">
          Email:
        </label>
        <input
          id="emailInput"
          type="email"
          className="form-control rounded shadow-sm"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success w-100 mb-4"
        onClick={handleStartAuth}
      >
        Start Auth
      </button>

      {Array.isArray(questions) && questions.length > 0 && (
        <div className="p-4 rounded shadow" style={{ backgroundColor: "#f8f9fa" }}>
          <strong>Received questions:</strong>
          <ul className="mt-2">
            {questions.map((q, i) => (
              <li key={i}>{q.question}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default StartAuth;
