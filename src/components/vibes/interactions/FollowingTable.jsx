import React from "react";
import { Link } from "react-router-dom";
import "./Interactions.css";

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
                {f.targetVibeName}{" "}
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    color: "#888",
                  }}
                >
                  ({f.targetVibeType})
                </span>
              </Link>
            </td>
            <td>
              <Link
                to={`/offers?vibeId=${f.id}`}
                className={`btn btn-outline-primary btn-sm ${
                  f.count > 0 ? "highlight" : ""
                }`}
              >
                {t("Don't miss it! ")}
                {f.count > 0 && ` (${f.count})`}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
