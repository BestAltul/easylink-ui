import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestionVisible, setCustomQuestionVisible] = useState(false);
  const [realQuestion, setRealQuestion] = useState("");
  const [associativeQuestion, setAssociativeQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [entriesList, setEntriesList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v3/auth/start", {
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
    if (!realQuestion.trim() || !associativeQuestion.trim() || !answerText.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newEntry = {
      realQuestion: realQuestion.trim(),
      associativeQuestion: associativeQuestion.trim(),
      answer: answerText.trim(),
    };

    const newEntries = [...entriesList, newEntry];
    setEntriesList(newEntries);

    if (newEntries.length >= totalQuestions) {
      setStep(totalQuestions + 3);
    } else {
      setStep(step + 1);
    }

    setSelectedQuestion("");
    setCustomQuestionVisible(false);
    setRealQuestion("");
    setAssociativeQuestion("");
    setAnswerText("");
    setShowAnswer(false);
  };

  const handleSignup = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    // console.log("Payload being sent:", {
    //   email,
    //   entries: entriesList,
    // });
    

    try {
      const res = await fetch("/api/v3/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entries: entriesList }),
      });

      const message = await res.text();
      alert(message);
      navigate("/signin");
    } catch (err) {
      alert("Registration failed");
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="card p-4 shadow-sm">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              if (!email.trim()) {
                alert("Email is required");
                return;
              }
              setStep(2);
            }}
          >
            Next
          </button>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="card p-4 shadow-sm">
          <label className="form-label">How many memory locks?</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={10}
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Number(e.target.value))}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={() => setStep(3)}
          >
            Start
          </button>
        </div>
      );
    }

    if (step >= 3 && step < totalQuestions + 3) {
      return (
        <div className="card p-4 shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
          <h5 className="mb-3">
            Step {step - 2} of {totalQuestions}: Create a memory lock
          </h5>

          <label className="form-label">Choose a question</label>
          <select className="form-select mb-3" onChange={handleSelectQuestion} value={selectedQuestion}>
            <option value="">-- Select a question --</option>
            <option value="custom">Enter your own</option>
            {questions.map((q, i) => (
              <option key={i} value={q.question}>{q.question}</option>
            ))}
          </select>

          {customQuestionVisible && (
            <>
              <label className="form-label">Custom question</label>
              <input
                className="form-control mb-3"
                value={realQuestion}
                onChange={(e) => setRealQuestion(e.target.value)}
              />
            </>
          )}

          <label className="form-label">Hint (to help you remember)</label>
          <input
            className="form-control mb-3"
            value={associativeQuestion}
            onChange={(e) => setAssociativeQuestion(e.target.value)}
          />

          <div className="input-group mb-3">
            <input
              type={showAnswer ? "text" : "password"}
              className="form-control"
              placeholder="Answer"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowAnswer(!showAnswer)}>
              <i className={`bi ${showAnswer ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          <button className="btn btn-success w-100" onClick={handleAdd}>
            {entriesList.length + 1 === totalQuestions ? "Finish" : "Next"}
          </button>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h4 className="mb-3">All Done!</h4>
        <button className="btn btn-primary" onClick={handleSignup}>
          Submit & Create Account
        </button>
      </div>
    );
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="mb-4">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${((step) / (totalQuestions + 2)) * 100}%`,
              backgroundColor: "#4caf50" // или другой зелёный HEX
            }}
            
          >
            Step {step} of {totalQuestions + 2}
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-center">Start Your Journey with EasyLink 🔒</h2>

      {renderStep()}
    </section>
  );
}

export default SignUp;
