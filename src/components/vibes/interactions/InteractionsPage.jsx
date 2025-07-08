import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FollowingTable from "./FollowingTable";

export default function InteractionsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { id: subscriberVibeId } = useParams();

  const [following, setFollowing] = useState([]);
  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    fetch(`/api/v3/interactions/${id}/following`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFollowing(data))
      .catch(() => setFollowing([]));
  }, [id, token]);

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
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

      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        <h5 className="mb-3" style={{ color: "#476dfe" }}>
          {t("interactions.following")}
        </h5>
        <FollowingTable following={following} t={t} subscriberVibeId={subscriberVibeId}/>
      </div>
    </div>
  );
}
