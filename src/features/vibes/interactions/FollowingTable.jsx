import React from "react";
import { Link } from "react-router-dom";
import "./Interactions.css";
import { useTranslation } from "react-i18next";

export default function FollowingTable({ following, subscriberVibeId }) {
  const { t } = useTranslation("interactions");

  const rows = Array.isArray(following)
    ? following
    : Array.isArray(following?.content)
    ? following.content
    : [];

  if (rows.length === 0) {
    return <div className="text-muted">{t("following_empty")}</div>;
  }

  return (
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>{t("table.vibe")}</th>
          <th>{t("table.offer")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f, idx) => (
          <tr key={f.id ?? `${f.targetVibeId}-${idx}`}>
            <td>
              <Link
                to={`/view/${f.targetVibeId}?subscriberVibeId=${subscriberVibeId}`}
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
                to={`/offer-table-Users?vibeId=${f.targetVibeId}`}
                className={`btn btn-outline-primary btn-sm ${
                  (f.count ?? 0) > 0 ? "highlight" : ""
                }`}
              >
                {t("cta.offer")}
                {(f.count ?? 0) > 0 && ` (${f.count})`}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
