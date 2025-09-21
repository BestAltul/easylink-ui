import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FollowingTable from "./FollowingTable";
import useFollowingWithOffer from "../interactions/useFollowingWithOffer";

export default function InteractionsPageBasics() {
  const { t } = useTranslation("interactions");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const followingWithOffer = useFollowingWithOffer(id, token);

  const [activeTab, setActiveTab] = useState("following");

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
        <h2 className="fw-bold mx-auto mb-0" style={{ letterSpacing: ".02em" }}>
          {t("title")}
        </h2>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            {t("tabs.following")}
          </button>
        </li>
      </ul>

      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        {activeTab === "following" && (
          <>
            <h5 className="mb-3" style={{ color: "#476dfe" }}>
              {t("sections.following")}
            </h5>
            <FollowingTable
              following={followingWithOffer}
              t={t}
              subscriberVibeId={id}
            />
          </>
        )}
      </div>
    </div>
  );
}
