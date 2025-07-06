import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const typeColor = {
  BUSINESS: "#4b7bfd",
  PERSONAL: "#fc6736",
  EVENT: "#1fc48d",
};

export default function InteractionsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [vibe, setVibe] = useState(null);
  const [loadingVibe, setLoadingVibe] = useState(true);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    setLoadingVibe(true);
    fetch(`/api/v3/vibes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVibe(data))
      .catch(() => setVibe(null))
      .finally(() => setLoadingVibe(false));

    // DUMMY DATA (replace with API)
    setTimeout(() => {
      setFollowers([
        { id: "1", name: "Vasya Pupkin", type: "PERSONAL" },
        { id: "2", name: "Music Festival", type: "EVENT" },
      ]);
      setFollowing([
        { id: "3", name: "Local Library", type: "BUSINESS" },
        { id: "4", name: "Tech Meetup", type: "EVENT" },
      ]);
    }, 400);
  }, [id]);

  return (
    <div className="container py-5" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          {t("interactions.back")}
        </button>
        <h2 className="fw-bold mx-auto mb-0" style={{ letterSpacing: ".02em" }}>
          {t("interactions.title")}
        </h2>
      </div>

      <div className="row g-5">
        {/* Левая колонка — реальные данные о вайбе */}
        <div className="col-md-4">
          <div
            className="card p-4 mb-4 shadow"
            style={{ borderRadius: 18, minHeight: 170 }}
          >
            {loadingVibe ? (
              <div className="text-muted">{t("interactions.loading_vibe")}</div>
            ) : !vibe ? (
              <div className="text-danger">{t("interactions.not_found")}</div>
            ) : (
              <>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {vibe.name || <span style={{ color: "#aaa" }}>{t("interactions.no_name")}</span>}
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontWeight: 500,
                    color: typeColor[vibe.type] || "#607d8b",
                    textTransform: "uppercase",
                    letterSpacing: ".03em",
                    fontSize: 15,
                  }}
                >
                  {vibe.type}
                </div>
                <div style={{ fontSize: 14, color: "#999", marginTop: 8 }}>
                  {t("interactions.info_text")}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Правая колонка — Followers & Following */}
        <div className="col-md-8">
          <div className="row g-4">
            {/* Following */}
            <div className="col-md-6">
              <div className="card p-4 shadow" style={{ borderRadius: 18, minHeight: 210 }}>
                <h5 className="mb-3" style={{ color: "#476dfe" }}>{t("interactions.following")}</h5>
                {following.length === 0 ? (
                  <div className="text-muted">{t("interactions.following_empty")}</div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {following.map((f) => (
                      <li
                        className="list-group-item d-flex align-items-center"
                        key={f.id}
                        style={{
                          border: "none",
                          padding: "12px 0",
                          fontSize: 16,
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: typeColor[f.type] || "#adb5bd",
                            display: "inline-block",
                            marginRight: 10,
                          }}
                        />
                        <span>{f.name}</span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#aaa",
                            marginLeft: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          {f.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Followers */}
            <div className="col-md-6">
              <div className="card p-4 shadow" style={{ borderRadius: 18, minHeight: 210 }}>
                <h5 className="mb-3" style={{ color: "#1fc48d" }}>{t("interactions.followers")}</h5>
                {followers.length === 0 ? (
                  <div className="text-muted">{t("interactions.followers_empty")}</div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {followers.map((f) => (
                      <li
                        className="list-group-item d-flex align-items-center"
                        key={f.id}
                        style={{
                          border: "none",
                          padding: "12px 0",
                          fontSize: 16,
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: typeColor[f.type] || "#adb5bd",
                            display: "inline-block",
                            marginRight: 10,
                          }}
                        />
                        <span>{f.name}</span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#aaa",
                            marginLeft: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          {f.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
