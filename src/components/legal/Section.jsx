import React from "react";

export default function Section({ id, title, children, copyAnchor, ariaPrefix = "section" }) {
  return (
    <section id={id} className="legal-section" aria-labelledby={`${ariaPrefix}-${id}`}>
      <h2 className="legal-h2" id={`${ariaPrefix}-${id}`}>
        <button
          type="button"
          className="anchor-btn"
          aria-label={`Copy link to ${title}`}
          onClick={() => copyAnchor(id)}
        >
          #
        </button>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}
