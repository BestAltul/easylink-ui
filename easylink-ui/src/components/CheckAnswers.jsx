import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CheckAnswers({ questions }) {
  const [rawAnswers, setRawAnswers] = useState("");
  const [authResult, setAuthResult] = useState("");
  const navigate = useNavigate();

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

      // if OK, redirecting
      if (text.toLowerCase().includes("success")) {
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
      <pre style={{ background: "#f4f4f4", padding: "1rem" }}>{authResult}</pre>
    </section>
  );
}

export default CheckAnswers;
