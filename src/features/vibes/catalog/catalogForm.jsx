import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CatalogCard from "./catalogCard";

export default function CatalogForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vibeId, returnTo, tab } = location.state || {};

  const handleSave = (item) => {
    navigate(returnTo || "/my-vibes", { state: { tab } });
  };

  const handleCancel = () => {
    navigate(returnTo || "/my-vibes", { state: { tab } });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Add item</h2>
      <CatalogCard mode="create" onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
