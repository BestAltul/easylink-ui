import React from "react";
import { Link } from "react-router-dom";

export default function FollowingTable({ following, t, subscriberVibeId }) {
  if (following.length === 0) {
    return (
      <div className="text-muted">{t("interactions.following_empty")}</div>
    );
  }

  return (
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>Vibe</th>
          <th>Offer</th>
        </tr>
      </thead>
      <tbody>
        {following.map((f) => (
          <tr key={f.id}>
            <td>
              <Link
                to={`/view/${f.id}?subscriberVibeId=${subscriberVibeId}`}
                style={{ textDecoration: "none", fontWeight: 500 }}
              >
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
            <td>
              <Link
                to={`/offers?vibeId=${f.id}`}
                className="btn btn-outline-primary btn-sm"
              >
                {t("interactions.view_offers")}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
