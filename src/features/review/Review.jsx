import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ReviewCard from "./ReviewCard";

function Review() {
  const [text, setText] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const [rating, setRating] = React.useState(5);
  const [loadingReviews, setLoadingReviews] = React.useState(false);
  const [posting, setPosting] = React.useState(false);

  const { user, isAuthenticated } = useAuth();
  const reviewsEndRef = React.useRef(null);

  const { t, i18n } = useTranslation("review"); 

  const API_URL = "/api/v3/reviews";

  const formatDate = (iso) =>
    new Intl.DateTimeFormat(i18n.language || undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));

  const scrollToBottom = (smooth = false) => {
    reviewsEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  React.useEffect(() => {
    loadReviews();
  }, []);

  React.useEffect(() => {
    scrollToBottom(false);
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert(t("must_login"));
      return;
    }
    const message = text.trim();
    if (!message) return;

    const newReview = {
      username: user?.username || t("anonymous"),
      content: message,
      createdAt: new Date().toISOString(),
      rating,
      location: user?.location || "",
      avatarUrl: user?.avatarUrl || "https://via.placeholder.com/64",
    };

    try {
      setPosting(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      await loadReviews();
      setSubmitted(true);
      setText("");
      setRating(5);
      setTimeout(() => setSubmitted(false), 3000);
      scrollToBottom(true);
    } catch (err) {
      console.error("Error posting review:", err);
    } finally {
      setPosting(false);
    }
  };

  const isSubmitDisabled = posting || !text.trim();

  return (
    <div className="container d-flex justify-content-center py-5">
      <div className="w-100" style={{ maxWidth: 800 }}>
        <h2 className="text-center mb-4">{t("title")}</h2>

        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {loadingReviews ? (
            <div className="text-muted text-center py-3">{t("loading")}</div>
          ) : reviews.length === 0 ? (
            <div className="text-muted text-center py-3">{t("empty")}</div>
          ) : (
            reviews.map((review, index) => (
              <div key={index}>
                <ReviewCard
                  avatarUrl={review.avatarUrl || "https://via.placeholder.com/64"}
                  text={review.content}
                  rating={review.rating || 5}
                  author={review.username || t("anonymous")}
                  date={
                    review.createdAt
                      ? formatDate(review.createdAt)
                      : formatDate(new Date().toISOString())
                  }
                  location={review.location || ""}
                />
                <div ref={index === reviews.length - 1 ? reviewsEndRef : null} />
              </div>
            ))
          )}
        </div>

        <h4 className="mb-3">{t("leave")}</h4>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            className="form-control mb-3 shadow-sm"
            style={{ height: 120, resize: "none" }}
            disabled={posting}
          />

          <div className="mb-3" role="group" aria-label={t("rating_label")}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`btn btn-link p-0 me-1 ${
                  star <= rating ? "text-warning" : "text-muted"
                }`}
                style={{ fontSize: "1.75rem", textDecoration: "none", lineHeight: 1 }}
                aria-label={t("rating_star", { count: star })}
                aria-pressed={star <= rating}
              >
                ★
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-success px-4" disabled={isSubmitDisabled}>
            {posting ? t("submitting") : t("submit")}
          </button>
        </form>

        {submitted && <p className="mt-3 text-success">{t("thank_you")}</p>}
      </div>
    </div>
  );
}

export default Review;
