import React, { useState } from "react";

function Review() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([
    { user: "Anna", message: "Great concept! Super easy to share my details." },
    { user: "Mark", message: "Perfect for networking at events." },
    { user: "Sophia", message: "Love the clean design and simplicity!" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      setReviews([{ user: "You", message: text }, ...reviews]);
      setSubmitted(true);
      setText("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="container d-flex justify-content-center py-5">
      <div
        className="bg-white rounded-4 shadow p-4"
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#f8f9fa",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <h2 className="text-center mb-4">What People Say</h2>

        <div className="mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {reviews.map((review, index) => (
            <div key={index} className="mb-3 w-100">
              <div
                className="text-start"
                style={{
                  fontSize: "0.85rem",
                  color: "#2e7d32",
                  marginBottom: "0.2rem",
                }}
              >
                {review.user}
              </div>
              <div
                style={{
                  backgroundColor: "#d9fdd3",
                  borderRadius: "15px",
                  padding: "0.75rem 1rem",
                  width: "100%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ fontSize: "0.95rem", color: "#333" }}>
                  {review.message}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h4 className="mb-3">Leave a Review</h4>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your feedback about EasyLink..."
            className="form-control mb-3 shadow-sm"
            style={{ height: "120px", resize: "none" }}
          />
          <button type="submit" className="btn btn-success px-4">
            Submit
          </button>
        </form>

        {submitted && (
          <p className="mt-3 text-success">Thank you for your review! 💬</p>
        )}
      </div>
    </div>
  );
}

export default Review;
