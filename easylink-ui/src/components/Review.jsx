import React, { useState } from "react";

function Review() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Отзыв отправлен:", text);
    setSubmitted(true);
    setText("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your feedback about EasyLink..."
          style={{ width: "100%", height: "120px", padding: "0.5rem" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Submit
        </button>
      </form>
      {submitted && <p style={{ marginTop: "1rem", color: "green" }}>Thank you for your review! 💬</p>}
    </div>
  );
}

export default Review;
