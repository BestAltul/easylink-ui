import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useOffers from "./useOffers";
import "./Interactions.css";

export default function OffersTableForUsers() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vibeId = params.get("vibeId");
  const navigate = useNavigate();

  const token = sessionStorage.getItem("jwt");
  const offers = useOffers(vibeId, token);

  const handleRowClick = (id) => {
    navigate(`/offers/${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="table-wrapper">
          <div className="card-table">
            <table className="table table-hover align-middle compact-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    onClick={() => handleRowClick(offer.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{offer.title}</td>
                    <td>{offer.description}</td>
                    <td>{offer.startTime}</td>
                    <td>{offer.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer>© 2025 EasyLink. All rights reserved.</footer>
    </div>
  );
}
