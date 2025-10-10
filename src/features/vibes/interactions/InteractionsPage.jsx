import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OffersTable from "../offers/OffersTable";
import useGetOfferByVibeId from "../offers/useGetOfferByVibeId";
import useFollowing from "../interactions/useFollowing";
import VibeCircleList from "../interactions/VibeCircleList";

export default function InteractionsPage() {
  const { t } = useTranslation("interactions");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");

  const following = useFollowing(id, token);
  const offers = useGetOfferByVibeId(id, token);

  const [activeTab, setActiveTab] = useState("offers");

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      {/* header */}
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

      {/* tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            {t("tabs.offers")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "circle" ? "active" : ""}`}
            onClick={() => setActiveTab("circle")}
          >
            {t("circle")}
          </button>
        </li>
      </ul>

      {/* content */}
      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        {activeTab === "offers" && (
          <>
            <h5 className="mb-3" style={{ color: "#476dfe" }}>
              {t("offers")}
            </h5>
            <OffersTable offers={offers} subscriberVibeId={id} t={t} />
          </>
        )}

        {activeTab === "circle" && (
          <>
            <h5 className="mb-3" style={{ color: "#476dfe" }}>
              {t("circle")}
            </h5>
            <VibeCircleList vibes={following} t={t} />
          </>
        )}
      </div>
    </div>
  );
}
