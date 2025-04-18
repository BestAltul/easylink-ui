import { useState } from "react";

function StartAuth() {
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleStartAuth = async () => {
    try {
      const res = await fetch("http://localhost:8080/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      setQuestions(result);
    } catch (err) {
      alert("Ошибка при получении вопросов");
      setQuestions([]);
    }
  };

  return (
    <section>
      <h2>Start Authentication</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ width: "100%", padding: "0.5rem" }}
      />
      <button
        onClick={handleStartAuth}
        style={{ marginTop: "0.5rem", padding: "0.5rem", width: "100%" }}
      >
        Start Auth
      </button>

      <p>Questions:</p>
      <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
        {JSON.stringify(questions, null, 2)}
      </pre>
    </section>
  );
}

export default StartAuth;
