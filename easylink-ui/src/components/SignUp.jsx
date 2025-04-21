import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    <section className="container mt-4">
      <h2 className="mb-4">Sign Up</h2>

      <div className="mb-4">
        <label htmlFor="emailInput" className="form-label">
          Email:
        </label>
        <input
          type="email"
          id="emailInput"
          className="form-control rounded shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div
        className="p-4 rounded shadow mb-4"
        style={{ backgroundColor: "#e1f3e0" }}
      >
        <h4 className="mb-3">{getPairTitle(entriesList.length)}</h4>

        <div className="mb-3">
          <label htmlFor="questionSelect" className="form-label">
            Choose a question
          </label>
          <select
            className="form-select rounded shadow-sm"
            id="questionSelect"
            onChange={handleSelectQuestion}
            value={selectedQuestion}
          >
            <option value="">-- Select a question --</option>
            <option value="custom">Enter your own question</option>
            {questions.map((q, i) => (
              <option key={i} value={q.question}>
                {q.question}
              </option>
            ))}
          </select>
        </div>

        {customQuestionVisible && (
          <div className="mb-3">
            <label htmlFor="customQuestion" className="form-label">
              Your custom question
            </label>
            <input
              type="text"
              className="form-control rounded shadow-sm"
              id="customQuestion"
              value={realQuestion}
              onChange={(e) => setRealQuestion(e.target.value)}
              placeholder="Enter your own question"
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="associativeHint" className="form-label">
            Associative hint
          </label>
          <input
            type="text"
            className="form-control rounded shadow-sm"
            id="associativeHint"
            value={associativeQuestion}
            onChange={(e) => setAssociativeQuestion(e.target.value)}
            placeholder="Enter associative hint"
          />
        </div>

        <div className="d-flex align-items-center mb-3">
          <input
            type={showAnswer ? "text" : "password"}
            className="form-control rounded shadow-sm"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Answer"
          />
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="btn btn-outline-secondary ms-2"
            title={showAnswer ? "Hide answer" : "Show answer"}
          >
            <i className={`bi ${showAnswer ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>

        <button className="btn btn-primary w-100" onClick={handleAdd}>
          Add entry
        </button>
      </div>

      {entriesList.length > 0 && (
        <button
          onClick={() => setShowEntries(!showEntries)}
          className="btn btn-light border-dark w-100 mb-3"
        >
          {showEntries ? "Hide entries" : "Show entries"}
        </button>
      )}

      {showEntries && entriesList.length > 0 && (
        <div className="mb-3">
          <h4>Your entries:</h4>
          <ul className="list-group">
            {entriesList.map((entry, i) => (
              <li key={i} className="list-group-item">
                <div>
                  <strong>Question:</strong> {entry.realQuestion} <br />
                  <strong>Hint:</strong> {entry.associativeQuestion} <br />
                  <strong>Answer:</strong> {entry.answer}
                </div>
                <button
                  onClick={() => handleRemove(i)}
                  className="btn btn-sm btn-danger mt-2"
                >
                  ✕ Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-success w-100" onClick={handleSignup}>
        Sign Up
      </button>
    </section>
  );
}

export default SignUp;
