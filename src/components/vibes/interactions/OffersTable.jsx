import React from "react";
import { Link } from "react-router-dom";

export default function OffersTable({ offers, t }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{t("Offers")}</h5>
        <Link to="/offers/new" className="btn btn-primary">
          {t("Add Offer")}
        </Link>
      </div>

      {(!Array.isArray(offers) || offers.length === 0) ? (
        <div className="text-muted">{t("You don't have any offer yet")}</div>
      ) : (
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>{t("Offer")}</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((f) => (
              <tr key={f.id}>
                <td>
                  <Link to={`/offers/${f.id}`}>
                    {f.name}{" "}
                    <span
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        color: "#888",
                      }}
                    >
                      ({f.type})
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
