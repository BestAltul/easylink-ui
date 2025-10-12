import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function InteractionsHome() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="container py-5 text-center" style={{ maxWidth: 900 }}>
      <h2 className="fw-bold mb-4">Interactions</h2>
      <p className="text-muted mb-5">Choose what you want to view.</p>

      <div className="row justify-content-center g-4">
        {/* My Circle */}
        <div className="col-md-5">
          <div className="p-4 rounded-4 shadow-sm bg-light h-100">
            <div className="fs-1 mb-3">🧑‍🤝‍🧑</div>
            <h4 className="fw-bold mb-2">My Circle</h4>
            <p className="text-muted">Businesses and profiles you follow.</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/vibes/${id}/interactions/circle`)}
            >
              View Circle
            </button>
          </div>
        </div>

        {/* My Offers */}
        <div className="col-md-5">
          <div className="p-4 rounded-4 shadow-sm bg-light h-100">
            <div className="fs-1 mb-3">🎁</div>
            <h4 className="fw-bold mb-2">My Offers</h4>
            <p className="text-muted">Active promotions from your circle.</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/vibes/${id}/interactions/offers`)}
            >
              View Offers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
