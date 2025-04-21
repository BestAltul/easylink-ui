import { useContext, useState } from "react";

import AuthContext from "../js/AuthContext";

function StartAuth({ questions, setQuestions }) {
  const [email, setEmail] = useState("");
  const { login } = useContext(AuthContext);

  //const [questions, setQuestions] = useState([]); // 👈 храним локально

  const handleStartAuth = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v3/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      console.log("Получены вопросы:", result);

      setQuestions(result); // 👈 сохраняем локально
 
      login({ username: email });

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

      {/* 👇 Вот тут показываем полученные вопросы */}
      {Array.isArray(questions) && questions.length > 0 && (
        <div
          style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem" }}
        >
          <strong>Полученные вопросы:</strong>
          <ul>
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
