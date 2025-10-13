import React from "react";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const alias = {
  mon: "monday", monday: "monday",
  tue: "tuesday", tues: "tuesday", tuesday: "tuesday",
  wed: "wednesday", weds: "wednesday", wednesday: "wednesday",
  thu: "thursday", thur: "thursday", thurs: "thursday", thursday: "thursday",
  fri: "friday", friday: "friday",
  sat: "saturday", saturday: "saturday",
  sun: "sunday", sunday: "sunday",
};

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function parseMaybeJSON(v) {
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
}

// нормализуем объект часов -> { monday: "9-17", ... }
function toHoursObject(input) {
  const v = parseMaybeJSON(input);
  if (!isPlainObject(v)) return null;

  const out = {};
  for (const [k, val] of Object.entries(v)) {
    const norm = String(k).trim().toLowerCase().replace(/\.$/, "");
    const day = alias[norm];
    if (day) out[day] = typeof val === "string" ? val : "";
  }
  const hasAny = DAYS.some(d => Object.prototype.hasOwnProperty.call(out, d.key));
  if (!hasAny) return null;

  // заполним отсутствующие дни пустыми строками
  for (const d of DAYS) if (!(d.key in out)) out[d.key] = "";
  return out;
}

export default function ExtraBlock({ block }) {
  const label = block?.label || (block?.type === "hours" ? "Hours" : "Custom");
  const raw = parseMaybeJSON(block?.value);
  const hours = block?.type === "hours" ? toHoursObject(raw) : toHoursObject(raw);

  // если это «часы» — рисуем таблицу
  if (hours) {
    return (
      <div
        className="mb-2 px-3 py-2 rounded-3"
        style={{ background: "#f7f9fd", borderLeft: "4px solid #637bfd", fontSize: 15, color: "#3a405a" }}
      >
        <strong>{label}:</strong>
        <table style={{ fontSize: 15, marginTop: 6, marginBottom: 2, width: "100%" }}>
          <tbody>
            {DAYS.map(({ key, label }) => (
              <tr key={key}>
                <td style={{ paddingRight: 7, color: "#637bfd" }}>{label}:</td>
                <td>{hours[key] ? hours[key] : <span style={{ color: "#bbb" }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // дефолтный кейс: никогда не рендерим объект как текст
  const safeText =
    typeof raw === "string" || typeof raw === "number"
      ? String(raw)
      : ""; // объект/массив/null -> пусто + плейсхолдер

  return (
    <div
      className="mb-2 px-3 py-2 rounded-3"
      style={{ background: "#f7f9fd", borderLeft: "4px solid #637bfd", fontSize: 15, color: "#3a405a" }}
    >
      <strong>{label}:</strong>{" "}
      {safeText ? safeText : <span style={{ color: "#bbb" }}>not specified</span>}
    </div>
  );
}
