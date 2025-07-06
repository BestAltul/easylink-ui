const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ExtraBlock({ block }) {
  return (
    <div
      className="mb-2 px-3 py-2 rounded-3"
      style={{
        background: "#f7f9fd",
        borderLeft: "4px solid #637bfd",
        fontSize: 15,
        color: "#3a405a",
      }}
    >
      <strong>{block.label}:</strong>{" "}
      {typeof block.value === "object" &&
      block.value !== null &&
      !Array.isArray(block.value) ? (
        <table style={{ fontSize: 15, marginTop: 4, marginBottom: 2 }}>
          <tbody>
            {weekDays.map((day) => (
              <tr key={day}>
                <td style={{ paddingRight: 7, color: "#637bfd" }}>{day}:</td>
                <td>
                  {block.value?.[day] || (
                    <span style={{ color: "#bbb" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span>
          {block.value || <span style={{ color: "#bbb" }}>not specified</span>}
        </span>
      )}
    </div>
  );
}
export default ExtraBlock;