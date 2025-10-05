import React from "react";

export default function TOC({ items, title = "On this page:" }) {
  return (
    <nav className="legal-toc" aria-label="Table of contents">
      <strong className="toc-title">{title}</strong>
      <ul>
        {items.map(({ id, label }) => (
          <li key={id}><a href={`#${id}`}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
