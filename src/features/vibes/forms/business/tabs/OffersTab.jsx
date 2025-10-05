// ==============================
// File: src/features/vibes/business/BusinessVibeForm/tabs/OffersTab.jsx
// Offer list + add button; delegates card rendering to existing OfferCard.
// ==============================
import React from "react";
import OfferCard from "@/features/vibes/offers/OfferCard";


export default function OffersTab({ t, offers = [], vibeId, onAddOffer, onEditOffer }) {
  return (
    <div className="w-100">
      <div className="d-flex justify-content-start gap-2 mb-3">
        <button type="button" className="btn btn-outline-primary" onClick={onAddOffer}>
          + {t("business.add_offer", "Add Offer")}
        </button>
      </div>

      <div className="d-grid gap-3">
        {offers?.length > 0 ? (
          offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onEdit={() => onEditOffer(offer)} />
          ))
        ) : (
          <div className="text-muted">{t("business.no_offers", "No offers yet")}</div>
        )}
      </div>
    </div>
  );
}
