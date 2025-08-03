import { useState } from "react";

export default function useVisibilityToggle(
  vibeId,
  initialVisible,
  initialCode
) {
  const [visible, setVisible] = useState(initialVisible);
  const [code, setCode] = useState(initialCode);
  const token = localStorage.getItem("jwt");

  const toggle = async () => {
    const next = !visible;
    setVisible(next);

    if (vibeId && token) {
      try {
        const response = await fetch(
          `/api/v3/vibes/visibility/${vibeId}?visible=${next}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to update visibility");

        if (next) {
          const data = await response.json();
          setCode(data.code);
        } else {
          setCode(null);
        }
      } catch (err) {
        console.error("Failed to update visibility:", err);
      }
    }
  };

  const button = (
    <label
      className="d-flex align-items-center gap-1"
      style={{ cursor: "pointer" }}
    >
      <input
        type="checkbox"
        checked={visible}
        onChange={toggle}
        className="form-check-input"
      />
      <span>{visible ? "Visible" : "Hidden"}</span>
    </label>
  );

  return [visible, code, button];
}
