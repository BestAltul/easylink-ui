import { useState } from "react";

function CheckAnswers({ questions }) {
  const [rawAnswers, setRawAnswers] = useState("");
  const [authResult, setAuthResult] = useState("");

  const handleCheckAnswers = async () => {
    try {
      const splitted = rawAnswers.split(/[,; ]/).map((s) => s.trim());

      // if (splitted.length !== questions.length) {
      //   setAuthResult(`Ожидалось ${questions.length} ответов, введено ${splitted.length}`);
      //   return;
      // }

      console.log("получ фопросы ", questions);

      const answers = questions.map((q, i) => ({
        entryId: q.entryId,
        answer: splitted[i],
      }));

      console.log("отвкты ", answers);

      const res = await fetch("http://localhost:8080/api/v3/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
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
      <p>
        <strong>Введите ответы через запятую:</strong>
      </p>
      <textarea
        value={rawAnswers}
        onChange={(e) => setRawAnswers(e.target.value)}
        style={{ width: "100%", height: "100px" }}
        placeholder="пример: кот, дом, школа"
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
