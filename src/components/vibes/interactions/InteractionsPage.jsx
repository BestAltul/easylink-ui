import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FollowingTable from "./FollowingTable";
import OffersTable from "./OffersTable";
import useOffers from "../interactions/useOffers";
import useFollowing from "../interactions/useFollowing";

export default function InteractionsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const token = sessionStorage.getItem("jwt");

  const following = useFollowing(id, token);

  const offers = useOffers(id, token);

  const [activeTab, setActiveTab] = useState("offers");

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

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            {t("Offers")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            {t("Following")}
          </button>
        </li>
      </ul>

      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        {activeTab === "offers" && (
          <>
            <h5 className="mb-3" style={{ color: "#476dfe" }}>
              {t("Offers")}
            </h5>
            <OffersTable offers={offers} t={t} subscriberVibeId={id} />
          </>
        )}
        {activeTab === "following" && (
          <>
            <h5 className="mb-3" style={{ color: "#476dfe" }}>
              {t("Following")}
            </h5>
            <FollowingTable following={following} t={t} subscriberVibeId={id} />
          </>
        )}
      </div>
    </div>
  );
}
