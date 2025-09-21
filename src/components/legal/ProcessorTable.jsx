// ProcessorTable.jsx
import React from "react";

export default function ProcessorTable({ rows = [], headers = [] }) {
  return (
    <div className="legal-table-wrap">
      <table className="legal-table" role="table" aria-label="Processors">
        <thead>
          <tr role="row">
            {headers.map((h, i) => (
              <th key={i} role="columnheader" scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: "center", color: "var(--legal-muted)" }}>
                —
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx} role="row">
                <td role="cell">{r.provider}</td>
                <td role="cell">{r.purpose}</td>
                <td role="cell">
                  {Array.isArray(r.categories)
                    ? r.categories.map((c, i) => (i ? [", ", c] : c))
                    : r.categories}
                </td>
                <td role="cell">{r.region}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
