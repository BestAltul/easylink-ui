import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CatalogCard from "./catalogCard";
import { useCreateItem } from "./useCreateItem";
import { useItems } from "./useItems";
import { useUpdateItem } from "./useUpdateItem";
import { buildItemDiff } from "./buildItemDiff";

export default function CatalogForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: itemId } = useParams();

  const {
    vibeId,
    returnTo,
    tab,
    itemIds = [],
    currentIndex = 0,
  } = location.state || {};

  const [index, setIndex] = useState(currentIndex);

  const { createItem } = useCreateItem();
  const { updateItem } = useUpdateItem();

  const goToIndex = (i) => {
    if (!itemIds.length) return;
    const next = (i + itemIds.length) % itemIds.length;
    setIndex(next);
    const nextId = itemIds[next];
    navigate(`/catalog/${nextId}/edit`, {
      replace: true,
      state: { vibeId, returnTo, tab, itemIds, currentIndex: next },
    });
  };

  const handleCancel = () => {
    navigate(returnTo || "/my-vibes", { state: { tab } });
  };

  const handleSwipeLeft = () => goToIndex(index + 1);
  const handleSwipeRight = () => goToIndex(index - 1);

  if (itemId) {
    const { items, loading, error } = useItems(itemId);
    const item = Array.isArray(items) ? items?.[0] : items;

    if (loading) return <div className="container py-4">Loading...</div>;
    if (error)
      return <div className="container py-4">Error: {String(error)}</div>;
    if (!item) return <div className="container py-4">Item not found</div>;

    const handleUpdate = async (payloadFromCard) => {
      const normalized = {
        ...payloadFromCard,
        imageUrl: payloadFromCard.image ?? null,
      };

      const diff = buildItemDiff(item, normalized);

      if ("image" in diff) delete diff.image;

      if (!diff || Object.keys(diff).length === 0) {
        navigate(returnTo || "/my-vibes", { state: { tab } });
        return;
      }

      try {
        await updateItem(item.id, diff);
        navigate(returnTo || "/my-vibes", { state: { tab } });
      } catch (e) {
        alert(e.message || "Failed to update item");
      }
    };

    return (
      <div className="container py-4">
        <h2 className="mb-3">Item edit</h2>
        <CatalogCard
          mode="edit"
          data={item}
          onSave={handleUpdate}
          onCancel={handleCancel}
          onSweptLeft={handleSwipeLeft}
          onSweptRight={handleSwipeRight}
        />
      </div>
    );
  }

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
      alert(err.message || "Failed to create item");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Add item</h2>
      <CatalogCard
        mode="create"
        onSave={handleSave}
        onCancel={handleCancel}
        onSweptLeft={handleSwipeLeft}
        onSweptRight={handleSwipeRight}
      />
      <hr />
    </div>
  );
}
