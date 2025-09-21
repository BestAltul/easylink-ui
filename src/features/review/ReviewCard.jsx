import React from "react";

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

function toDate(d) {
  if (d === null || d === undefined) return null;

  if (d instanceof Date) return isValidDate(d) ? d : null;

 
  if (typeof d === "number" || (typeof d === "string" && /^\d+$/.test(d))) {
    const t = new Date(Number(d));
    return isValidDate(t) ? t : null;
  }

  if (typeof d === "string") {
   
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, day] = d.split("-").map(Number);
      const t = new Date(Date.UTC(y, m - 1, day));
      return isValidDate(t) ? t : null;
    }
    
    if (/^\d{4}-\d{2}-\d{2}T/.test(d)) {
      const t = new Date(d);
      return isValidDate(t) ? t : null;
    }
    
    return null;
  }

  return null;
}

function formatDateEnSmart(d) {
  if (typeof d === "string") {
    const parsed = toDate(d);
    if (parsed) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(parsed);
    }
    return d;
  }

  const dt = toDate(d);
  if (!dt) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dt);
}

const ReviewCard = ({
  avatarUrl = "https://via.placeholder.com/64",
  text,
  rating = 5,
  author,
  location,
  date,
}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-warning" : "text-muted"}>
        &#9733;
      </span>
    );
  }

  const formattedDate = formatDateEnSmart(date);

  return (
    <div
      className="card mb-3 border-0"
      style={{
        maxWidth: "540px",
        backgroundColor: "#f8f9fa", 
      }}
    >
      <div className="row g-0 align-items-center">
        <div className="col-md-10">
          <div className="card-body">
            <p className="card-text fst-italic">«{text}»</p>
            <div className="mb-2">{stars}</div>
            <h6 className="card-subtitle mb-0">{author}</h6>
            <h6 className="card-subtitle mb-0">
              <small className="text-muted">{formattedDate}</small>
            </h6>
            <small className="text-muted">{location}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
