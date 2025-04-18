import { useState } from "react";

function CheckAnswers() {
  const [answers, setAnswers] = useState(
    '[{"entryId":"uuid-здесь","answer":"твой ответ"}]'
  );
  const [authResult, setAuthResult] = useState("");

  const handleCheckAnswers = async () => {
    try {
      const res = await fetch("http://localhost:8080/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: JSON.parse(answers) }),
      });
      const text = await res.text();
      setAuthResult(text);
    } catch (err) {
      setAuthResult("Ошибка при проверке");
    }
  };

  return (
    <section>
      <h2>Check Answers</h2>
      <textarea
        value={answers}
        onChange={(e) => setAnswers(e.target.value)}
        style={{ width: "100%", height: "100px" }}
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
