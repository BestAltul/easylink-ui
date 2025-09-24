// ==============================
// File: src/features/vibes/business/BusinessVibeForm/ui/TabNav.jsx
// Generic tab navigation used across forms.
// ==============================
import React from "react";

export default function TabNav({ active, onChange, tabs }) {
  return (
    <ul className="nav nav-tabs mb-4 w-100">
      {tabs.map((tab) => (
        <li className="nav-item flex-fill text-center" key={tab.id}>
          <button
            type="button"
            className={`nav-link w-100 ${active === tab.id ? "active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
