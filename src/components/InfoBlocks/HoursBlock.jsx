import React from "react";
import { useTranslation } from "react-i18next";

export default function HoursBlock({ value, onChange, onRemove }) {
  const { t } = useTranslation("extra_block");
  const { t: tDay } = useTranslation("extra_block", { keyPrefix: "weekdays" });

  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];

  return (
    <div
      className="mb-2 p-3 rounded-3"
      style={{
        background: "#f7f9fd",
        borderLeft: "4px solid #637bfd",
        fontSize: 15,
        color: "#3a405a",
        position: "relative"
      }}
    >
      <b>{t("hours", "Hours")}</b>
      <button
        onClick={onRemove}
        style={{
          position: "absolute", right: 10, top: 10,
          border: "none", background: "none", color: "#888",
          fontWeight: 700, fontSize: 20, cursor: "pointer"
        }}
        type="button"
        aria-label={t("remove_button_title", "Remove")}
      >
        ×
      </button>

      <table style={{ width: "100%", marginTop: 8 }}>
        <tbody>
          {weekDays.map((day) => (
            <tr key={day}>
              <td style={{ color: "#637bfd", width: 95 }}>
                {tDay(day)}:
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: 14, height: 32, padding: "2px 7px", width: 130, display: "inline-block" }}
                  placeholder={t("not_specified", "Closed")}
                  value={value?.[day] || ""}
                  onChange={(e) => onChange({ ...value, [day]: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
