// ==============================
// File: src/features/vibes/business/BusinessVibeForm/tabs/MenuTab.jsx
// Items (menu) grid; no business logic here other than callbacks.
// ==============================
import React from "react";

export default function MenuTab({ t, loadingItems, items = [], itemIds = [], vibeId, onAddItem, onEditItem }) {
  return (
    <div className="d-flex flex-column gap-3 mb-3 w-100">
      <div className="d-flex justify-content-start gap-2">
        <button type="button" className="btn btn-outline-primary" onClick={onAddItem}>
          {t("business.add_item", "Add item")}
        </button>
        <button type="button" className="btn btn-outline-primary" disabled>
          {t("common.delete", "Delete")}
        </button>
      </div>

      {loadingItems ? (
        <div>{t("common.loading", "Loading…")}</div>
      ) : items.length === 0 ? (
        <div className="text-muted">{t("business.no_items", "No items yet")}</div>
      ) : (
        <div className="row row-cols-2 g-3">
          {items.map((it) => (
            <div className="col" key={it.id}>
              <button
                type="button"
                onClick={() => onEditItem(it)}
                className="p-0 border-0 bg-transparent w-100"
                style={{ cursor: "pointer" }}
                title={t("business.edit_item", "Edit item")}
              >
                <div className="card overflow-hidden shadow-sm">
                  <div className="ratio ratio-1x1">
                    {it.imageUrl ? (
                      <img src={it.imageUrl} alt={it.title || t("business.item", "Item")} className="w-100 h-100 object-fit-cover" loading="lazy" />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light">
                        <span className="text-muted small">{t("business.no_image", "No image")}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-img-overlay d-flex align-items-end p-2" style={{ pointerEvents: "none" }}>
                    <div className="w-100 px-2 py-1 rounded-3 bg-dark bg-opacity-50 text-white text-truncate">
                      {it.title || t("business.untitled", "Untitled")}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
