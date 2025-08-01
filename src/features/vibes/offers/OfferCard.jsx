export default function OfferCard({ offer }) {
  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="w-100 border rounded p-3 shadow-sm"
      style={{ backgroundColor: "#fff0f5" }}
    >
      <h5 className="fw-bold">{offer.title}</h5>
      {/* <p>{offer.description}</p>
      <p className="fw-bold">-${offer.currentDiscount}</p> */}
      <p>
        {formatDate(offer.startTime)} – {formatDate(offer.endTime)}
      </p>
    </div>
  );
}
