import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Типы интеракций, если нужно (можно импортировать)
const INTERACTION_TYPES = [
  { key: "subscribe", label: "Subscribe" },
  { key: "like", label: "Like" },
  // ...другие типы
];

export default function InteractionPage() {
  const { id } = useParams(); // id вайба, к которому идём
  const [loading, setLoading] = useState(true);
  const [interactions, setInteractions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Для "подписаться"
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Фетчим все интеракции на этот вайб
  useEffect(() => {
    setLoading(true);
    fetch(`/api/v3/interactions/vibe/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка получения интеракций");
        return res.json();
      })
      .then((data) => setInteractions(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, success]);

  // Подписка на вайб
  const handleSubscribe = async () => {
    setSubmitting(true);
    setSuccess(false);
    try {
      const body = {
        targetVibeId: id,
        interactionType: "subscribe", // или любой другой тип
        // ...сюда добавь userEmail, myVibeId, anonymous, active если нужно
      };
      const res = await fetch(`/api/v3/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Не удалось подписаться");
      setSuccess(true);
    } catch (err) {
      alert("Ошибка: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h2 className="mb-3">Interactions</h2>
      <div className="mb-4 text-muted">
        Здесь отображаются все подписчики и ваши взаимодействия с этим вайбом.
      </div>
      <button
        className="btn btn-primary mb-4"
        onClick={handleSubscribe}
        disabled={submitting}
      >
        {submitting ? "Подписка..." : success ? "Вы подписаны!" : "Подписаться на вайб"}
      </button>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : interactions.length === 0 ? (
        <div className="alert alert-info">Нет интеракций с этим вайбом.</div>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Тип</th>
              <th>Active</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {interactions.map((item, i) => (
              <tr key={item.id || i}>
                <td>{item.userEmail || "—"}</td>
                <td>{item.interactionType}</td>
                <td>{item.active ? "✔️" : "—"}</td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
