import React from "react";

const weekDays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function HoursBlock({ value, onChange, onRemove }) {
  // value — это объект: { Monday: "10:00-18:00", ... }
  return (
    <div className="mb-2 p-3 rounded-3"
         style={{
           background: "#f7f9fd",
           borderLeft: "4px solid #637bfd",
           fontSize: 15,
           color: "#3a405a",
           position: "relative"
         }}>
      <b>Hours</b>
      <button
        onClick={onRemove}
        style={{
          position: "absolute", right: 10, top: 10,
          border: "none", background: "none", color: "#888", fontWeight: 700, fontSize: 20, cursor: "pointer"
        }}
        type="button"
        aria-label="Remove"
      >×</button>
      <table style={{ width: "100%", marginTop: 8 }}>
        <tbody>
          {weekDays.map(day => (
            <tr key={day}>
              <td style={{ color: "#637bfd", width: 95 }}>{day}:</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: 14, height: 32, padding: "2px 7px", width: 130, display: "inline-block" }}
                  placeholder="Closed"
                  value={value?.[day] || ""}
                  onChange={e => {
                    // обновляем только это поле!
                    onChange({ ...value, [day]: e.target.value });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
