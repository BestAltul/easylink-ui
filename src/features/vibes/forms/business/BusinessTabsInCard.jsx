// BusinessTabsInCard.jsx
import React from "react";
import "./styles/BusinessTabsInCard.css";

export default function BusinessTabsInCard({ t, activeTab, onTabChange, renderMain, renderOffers, renderMenu }) {
  return (
    <div className="w-100">
    <ul className="nav nav-tabs mb-4 justify-content-center tabs-narrow" role="tablist">
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === "main" ? "active" : ""}`} onClick={() => onTabChange("main")} type="button" role="tab">
            {t("Main")}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === "offers" ? "active" : ""}`} onClick={() => onTabChange("offers")} type="button" role="tab">
            {t("Offers")}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === "menu" ? "active" : ""}`} onClick={() => onTabChange("menu")} type="button" role="tab">
            {t("Menu")}
          </button>
        </li>
      </ul>

      <div className="tab-content w-100">
        {activeTab === "main" && <div className="tab-pane fade show active">{renderMain?.()}</div>}
        {activeTab === "offers" && <div className="tab-pane fade show active w-100">{renderOffers?.()}</div>}
        {activeTab === "menu" && <div className="tab-pane fade show active">{renderMenu?.()}</div>}
      </div>
    </div>
  );
}
