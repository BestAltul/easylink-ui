import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CatalogCard from "./catalogCard";
import { useCreateItem } from "./useCreateItem";
import { useItems } from "./useItems";
import { useState } from "react";

export default function CatalogForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vibeId, returnTo, tab } = location.state || {};

  const { createItem } = useCreateItem();
  const { items, loading } = useItems();

  const handleSave = async ({ title, description, price, image }) => {
    try {
      await createItem({
        vibeId,
        title,
        description,
        price,
        imageUrl: image,        
      });
      navigate(returnTo || "/my-vibes", { state: { tab } });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    navigate(returnTo || "/my-vibes", { state: { tab } });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Add item</h2>

      <CatalogCard mode="create" onSave={handleSave} onCancel={handleCancel} />

      <hr />

      <h4>Existing items</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.title} – ${item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
