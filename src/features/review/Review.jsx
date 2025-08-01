import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function Review() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const reviewsEndRef = useRef(null);
  const { t } = useTranslation();

  const scrollToBottom = (smooth = false) => {
    reviewsEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [reviews]);

  const API_URL = "/api/v3/reviews";

  const loadReviews = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = (e) => {
    if (!isAuthenticated) {
      alert(t("review.must_login"));
      return;
    }
    e.preventDefault();
    if (text.trim()) {
      const newReview = {
        username: user.username,
        content: text,
        createdAt: new Date().toISOString(),
      };

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      })
        .then((res) => res.json())
        .then(() => {
          loadReviews(); 
          setSubmitted(true);
          setText("");
          setTimeout(() => setSubmitted(false), 3000);
          scrollToBottom(true);
        })
        .catch((err) => console.error("Error posting review:", err));
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
        <h2 className="text-center mb-4">{t("review.title")}</h2>

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
                {review.username || t("review.anonymous")}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#999",
                  textAlign: "left",
                }}
              >
                {new Date(review.createdAt).toLocaleString()}
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
                  {review.content}
                </span>
              </div>
              <div ref={reviewsEndRef} />
            </div>
          ))}
        </div>

        <h4 className="mb-3">{t("review.leave")}</h4>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("review.placeholder")}
            className="form-control mb-3 shadow-sm"
            style={{ height: "120px", resize: "none" }}
          />
          <button type="submit" className="btn btn-success px-4">
            {t("review.submit")}
          </button>
        </form>

        {submitted && (
          <p className="mt-3 text-success">{t("review.thank_you")}</p>
        )}
      </div>
    </div>
  );
}

export default Review;
