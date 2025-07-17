import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @param {string} id - targetVibeId (тот вайб, на который хотим подписаться)
 * @param {string} token - jwt пользователя
 * @param {Array} myVibes - список вайбов пользователя (минимум [{id, name}])
 * @param {boolean} subscribed
 * @param {function} setSubscribed
 * @param {Array} comments
 * @param {function} setComments
 */
export default function VibeActions({
  id,
  token,
  myVibes = [],
  subscribed,
  setSubscribed,
  comments,
  setComments,
}) {
  const [selectedMyVibeId, setSelectedMyVibeId] = useState("");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Устанавливаем первый вайб по умолчанию
  useEffect(() => {
    if (myVibes.length > 0 && !selectedMyVibeId) {
      setSelectedMyVibeId(myVibes[0].id);
    }
  }, [myVibes, selectedMyVibeId]);

  function handleSubscribe() {
    if (!token) {
      navigate(`/signin?redirect=/view/${id}`);
      return;
    }
    if (!selectedMyVibeId) {
      alert("Выберите свой вайб для подписки");
      return;
    }
    fetch("/api/v3/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        myVibeId: selectedMyVibeId, // С какого вайба подписываемся
        targetVibeId: id,           // На какой вайб подписываемся
        interactionType: "SUBSCRIBE",
        anonymous: false,
        active: true,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setSubscribed(true);
      })
      .catch(() => alert("Ошибка подписки"));
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (!token) {
      navigate(`/signin?redirect=/view/${id}`);
      return;
    }
    fetch(`/api/v3/vibes/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: comment }),
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(newComment => {
        setComments([newComment, ...comments]);
        setComment("");
      })
      .catch(() => alert("Ошибка при отправке комментария"));
  }

  function handleRequestOffer() {
    if (!token) {
      navigate(`/signin?redirect=/view/${id}`);
      return;
    }
    alert("Запрос отправлен! (Тут твоя модалка)");
  }

  function handleCopy(link) {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  }

  const shareUrl = id ? `${window.location.origin}/view/${id}` : window.location.href;

  return (
    <div className="vibe-actions card p-4 shadow-sm" style={{
      minWidth: 310,
      maxWidth: 400,
      borderRadius: 18,
      background: "linear-gradient(135deg, #f9faff 65%, #f7f7fd 100%)"
    }}>
      {/* Выбор своего вайба */}
      <div className="mb-2">
        <label htmlFor="myVibeSelect" className="fw-semibold mb-2">Выберите свой вайб</label>
        <select
          id="myVibeSelect"
          className="form-select mb-3"
          value={selectedMyVibeId}
          onChange={e => setSelectedMyVibeId(e.target.value)}
          disabled={myVibes.length === 0}
        >
          {myVibes.length === 0 ? (
            <option value="">Нет доступных вайбов</option>
          ) : (
            myVibes.map(vibe => (
              <option key={vibe.id} value={vibe.id}>{vibe.name}</option>
            ))
          )}
        </select>
      </div>
      {/* Блок подписки */}
      <div className="mb-3">
        <div className="fw-semibold mb-2">Подписка на вайб</div>
        {subscribed ? (
          <button className="btn btn-success w-100 mb-2" disabled>Вы подписаны</button>
        ) : (
          <button
            className="btn btn-primary w-100"
            onClick={handleSubscribe}
            disabled={subscribed || !selectedMyVibeId}
          >
            {token ? "Подписаться" : "Войти и подписаться"}
          </button>
        )}
      </div>
      {/* Offer */}
      <div className="mb-3">
        <div className="fw-semibold mb-2">Бизнес-запрос</div>
        <button
          className="btn btn-outline-info w-100"
          onClick={handleRequestOffer}
          disabled={!token}
          title={!token ? "Войдите для запроса" : ""}
        >
          Request Offer
        </button>
      </div>
      {/* Поделиться */}
      <div className="mb-3">
        <div className="fw-semibold mb-2">Поделиться вайбом</div>
        <input className="form-control mb-2"
               value={shareUrl}
               readOnly
               onClick={e => {
                 e.target.select();
                 handleCopy(shareUrl);
               }}
               style={{ cursor: "pointer" }} />
        <button className={`btn w-100 ${copied ? "btn-success" : "btn-outline-primary"}`}
                onClick={() => handleCopy(shareUrl)}>
          {copied ? "Скопировано!" : "Скопировать ссылку"}
        </button>
      </div>
      {/* Комментарии */}
      <div>
        <div className="fw-semibold mb-2">Комментарии</div>
        <form onSubmit={handleCommentSubmit} className="mb-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={token ? "Оставить комментарий..." : "Войдите, чтобы оставить комментарий"}
              value={comment}
              onChange={e => setComment(e.target.value)}
              disabled={!token}
              maxLength={240}
            />
            <button className="btn btn-primary" type="submit" disabled={!token || !comment.trim()}>
              Отправить
            </button>
          </div>
        </form>
        <div style={{ maxHeight: 130, overflowY: "auto" }}>
          {comments.length === 0 ? (
            <div className="text-muted text-center">Нет комментариев</div>
          ) : comments.map((c, i) => (
            <div key={i} className="mb-1 pb-1 border-bottom">
              <strong>{c.authorName || "Гость"}</strong>: {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
