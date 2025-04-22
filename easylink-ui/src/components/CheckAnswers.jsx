import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext"; // <- added

function CheckAnswers({ questions }) {
  const [rawAnswers, setRawAnswers] = useState("");
  const [authResult, setAuthResult] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // getting login

  const handleCheckAnswers = async () => {
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
        login({ email: "user@email.com" }); 
        navigate("/profile");
      }
    } catch (err) {
      setAuthResult("Error while checking");
    }
  };

  return (
    <section>
      <h2>Check Answers</h2>
      <p>
        <strong>Enter answers separated by commas:</strong>
      </p>
      <textarea
        value={rawAnswers}
        onChange={(e) => setRawAnswers(e.target.value)}
        style={{ width: "100%", height: "100px" }}
        placeholder="example: cat, house, school"
      />
      <button
        onClick={handleCheckAnswers}
        style={{ marginTop: "0.5rem", padding: "0.5rem", width: "100%" }}
      >
        Check Answers
      </button>
      {authResult && (
        <div
          style={{
            marginTop: "15px",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            border: "1px solid #ddd",
          }}
        >
          {authResult}
        </div>
      )}
    </section>
  );
}

export default CheckAnswers;
