import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ReviewCard from "./ReviewCard";

function Review() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
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

  // Универсальная функция загрузки отзывов
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
    e.preventDefault();

    if (!isAuthenticated) {
      alert(t("review.must_login"));
      return;
    }

    if (text.trim()) {
      const newReview = {
        username: user.username,
        content: text,
        createdAt: new Date().toISOString(),
        rating: rating,
        location: user.location || "Unknown",
        avatarUrl: user.avatarUrl || "https://via.placeholder.com/64",
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
          setRating(5);
          setTimeout(() => setSubmitted(false), 3000);
          scrollToBottom(true);
        })
        .catch((err) => console.error("Error posting review:", err));
    }
  };

  return (
    <div className="container d-flex justify-content-center py-5">
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <h2 className="text-center mb-4">{t("review.title")}</h2>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {reviews.map((review, index) => (
            <div key={index}>
              <ReviewCard
                avatarUrl={review.avatarUrl || "https://via.placeholder.com/64"}
                text={review.content}
                rating={review.rating || 5}
                author={review.username || t("review.anonymous")}
                date={review.createdAt || new Date().toLocaleDateString()}
                location={review.location || ""}
              />
              <div ref={index === reviews.length - 1 ? reviewsEndRef : null} />
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

          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= rating ? "text-warning fs-3" : "text-muted fs-3"
                }
                style={{ cursor: "pointer" }}
                onClick={() => setRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>

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
