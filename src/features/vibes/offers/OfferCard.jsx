export default function OfferCard({
  offer,
  onEdit,
  onDelete,
  onDoubleClick,
  vibeId,
  selected,
  onSelect,
}) {
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const isExpired = new Date(offer.endTime) < new Date();

  return (
    <div
      className="w-100 border rounded p-3 shadow-sm d-flex align-items-start gap-3"
      style={{
        backgroundColor: selected ? "#ffeef0" : "#f8f8f8ff",
        cursor: "pointer",
        opacity: offer.active ? 1 : 0.5,
        borderLeft: isExpired ? "4px solid #ccc" : "4px solid #198754",
      }}
      onDoubleClick={() =>
        onDoubleClick ? onDoubleClick(offer) : onEdit?.(offer)
      }
    >
      <div className="flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <p className="fw-bold fs-6 mb-0">{offer.title}</p>
          <span
            className={`badge ms-2 ${
              offer.active ? "bg-success" : "bg-secondary"
            }`}
          >
            {offer.active ? "Active" : "Disabled"}
          </span>
        </div>

        <p className="mb-1 text-muted">
          {formatDate(offer.startTime)} – {formatDate(offer.endTime)}
        </p>

        <p className="mb-0 small">
          Discount:{" "}
          <strong>
            {offer.discountType === "PERCENTAGE"
              ? `${offer.currentDiscount}%`
              : `$${offer.currentDiscount}`}
          </strong>{" "}
          {offer.discountType === "DYNAMIC" && "(dynamic)"}
        </p>
      </div>
    </div>
  );
}
