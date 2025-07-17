import React, { useState } from "react";
import "../styles/ProfileCards.css";

export default function ProfileCards({ cards }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="d-flex gap-4 justify-content-center cards-row">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="profile-card p-4 rounded shadow text-center animate-slideUp"
          tabIndex={0}
          style={{
            backgroundColor: hoveredCard === idx ? card.hoverBackground : card.background,
            minWidth: 280,
            maxWidth: 350,
            cursor: "pointer",
            outline: "none",
            marginBottom: 20,
          }}
          onClick={card.onClick}
          onMouseEnter={() => setHoveredCard(idx)}
          onMouseLeave={() => setHoveredCard(null)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && card.onClick()}
        >
          <h5 className="mb-2" style={{ fontWeight: 600, fontSize: 22 }}>{card.title}</h5>
          <p className="text-muted mb-4" style={{ minHeight: 38 }}>{card.text}</p>
          <button
            className={`btn btn-${card.buttonColor} px-4 py-2`}
            style={{ fontWeight: 500, fontSize: 17 }}
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              card.onClick();
            }}
          >
            {card.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
