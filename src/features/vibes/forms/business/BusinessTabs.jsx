// src/features/vibes/forms/business/BusinessTabs.jsx
import React from "react";

/**
 * Unified shell for Business Vibe tabs (Main / Offers / Menu).
 * Responsible ONLY for navigation and layout — tab content is passed via render props.
 * props:
 * - t: i18n
 * - activeTab: "main" | "offers" | "menu"
 * - onTabChange: (tab) => void
 * - renderMain: () => ReactNode
 * - renderOffers: () => ReactNode
 * - renderMenu: () => ReactNode
 * - topSlot?: ReactNode 
 * - className?: string
 */
export default function BusinessTabs({
  t,
  activeTab,
  onTabChange,
  renderMain,
  renderOffers,
  renderMenu,
  topSlot = null,
  className = "",
}) {
  return (
    <div className={`d-flex flex-column align-items-center w-100 ${className}`}>
      {/* topSlot (for example, share/visibility) */}
      {topSlot}

      {/* Tabs (same for OwnerView и Form) */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "main" ? "active" : ""}`}
            onClick={() => onTabChange("main")}
            type="button"
            role="tab"
          >
            {t("Main")}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => onTabChange("offers")}
            type="button"
            role="tab"
          >
            {t("Offers")}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => onTabChange("menu")}
            type="button"
            role="tab"
          >
            {t("Menu")}
          </button>
        </li>
      </ul>

      {/* Tab content */}
      <div className="tab-content w-100">
        {activeTab === "main" && (
          <div className="tab-pane fade show active">
            {renderMain?.()}
          </div>
        )}
        {activeTab === "offers" && (
          <div className="tab-pane fade show active w-100">
            {renderOffers?.()}
          </div>
        )}
        {activeTab === "menu" && (
          <div className="tab-pane fade show active">
            {renderMenu?.()}
          </div>
        )}
      </div>
    </div>
  );
}
