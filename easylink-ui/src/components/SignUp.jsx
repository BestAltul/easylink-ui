import { useState, useEffect } from "react";

function SignUp() {
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestionVisible, setCustomQuestionVisible] = useState(false);

  const [realQuestion, setRealQuestion] = useState("");
  const [associativeQuestion, setAssociativeQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [entriesList, setEntriesList] = useState([]);
  const [showEntries, setShowEntries] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080api/v3/auth/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "template@email.com" }),
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch(() => setQuestions([]));
  }, []);

  const handleSelectQuestion = (e) => {
    const value = e.target.value;
    setSelectedQuestion(value);
    setCustomQuestionVisible(value === "custom");
    setRealQuestion(value === "custom" ? "" : value);
  };

  const handleAdd = () => {
    if (
      !realQuestion.trim() ||
      !associativeQuestion.trim() ||
      !answerText.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    setEntriesList([
      ...entriesList,
      {
        realQuestion: realQuestion.trim(),
        associativeQuestion: associativeQuestion.trim(),
        answer: answerText.trim(),
      },
    ]);

    setSelectedQuestion("");
    setCustomQuestionVisible(false);
    setRealQuestion("");
    setAssociativeQuestion("");
    setAnswerText("");
    setShowAnswer(false);
  };

  const handleRemove = (indexToRemove) => {
    setEntriesList(entriesList.filter((_, i) => i !== indexToRemove));
  };

  const handleSignup = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    if (entriesList.length === 0) {
      alert("Please add at least one entry");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v3/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entries: entriesList }),
      });
      alert(await res.text());
    } catch (err) {
      alert("Registration failed");
    }
  };

  const getPairTitle = (index) => {
    const titles = [
      "First question–answer pair",
      "Second question–answer pair",
      "Third question–answer pair",
      "Fourth question–answer pair",
      "Fifth question–answer pair",
    ];
    return titles[index] || `Entry #${index + 1}`;
  };

  return (
    <section>
      <h2>Sign Up</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Email:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h4>{getPairTitle(entriesList.length)}</h4>

        <select
          onChange={handleSelectQuestion}
          value={selectedQuestion}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <option value="">-- Select a question --</option>
          <option value="custom">Enter your own question</option>
          {questions.map((q, i) => (
            <option key={i} value={q.question}>
              {q.question}
            </option>
          ))}
        </select>

        {customQuestionVisible && (
          <input
            type="text"
            value={realQuestion}
            onChange={(e) => setRealQuestion(e.target.value)}
            placeholder="Enter your own question"
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
            }}
          />
        )}

        <input
          type="text"
          value={associativeQuestion}
          onChange={(e) => setAssociativeQuestion(e.target.value)}
          placeholder="Associative hint"
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
          }}
        />

        <div style={{ display: "flex", marginBottom: "0.5rem" }}>
          <input
            type={showAnswer ? "text" : "password"}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Answer"
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
          >
            {showAnswer ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleAdd}
          style={{ width: "100%", padding: "0.5rem" }}
        >
          Add entry
        </button>
      </div>

      {entriesList.length > 0 && (
        <button
          onClick={() => setShowEntries(!showEntries)}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            width: "100%",
            backgroundColor: "#eee",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showEntries ? "Hide entries" : "Show entries"}
        </button>
      )}

      {showEntries && entriesList.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h4>Your entries:</h4>
          <ul>
            {entriesList.map((entry, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <div>
                  <strong>Question:</strong> {entry.realQuestion} <br />
                  <strong>Hint:</strong> {entry.associativeQuestion} <br />
                  <strong>Answer:</strong> {entry.answer}
                </div>
                <button
                  onClick={() => handleRemove(i)}
                  style={{
                    marginTop: "0.3rem",
                    padding: "0.2rem 0.5rem",
                    color: "white",
                    backgroundColor: "red",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ✕ Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSignup}
        style={{ marginTop: "1rem", padding: "0.5rem", width: "100%" }}
      >
        Sign Up
      </button>
    </section>
  );
}

export default SignUp;
