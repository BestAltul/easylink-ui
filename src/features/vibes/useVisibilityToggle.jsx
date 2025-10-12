import { useMemo, useState } from "react";

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

/**
 * useVisibilityToggle
 * @param {string|undefined} vibeId
 * @param {boolean} initialVisible
 * @param {string|null} initialCode
 * @param {{enabled?: boolean, labels?: {visible?: string, hidden?: string}}} options
 *   enabled — разрешить сетевые вызовы и клики (по умолчанию true)
 *   labels  — подписи для свитча
 */
export default function useVisibilityToggle(
  vibeId,
  initialVisible = false,
  initialCode = null,
  options = {}
) {
  const { enabled = true, labels = {} } = options;
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  // локальное состояние
  const [visible, setVisible] = useState(!!initialVisible);
  const [code, setCode] = useState(initialCode ?? null);

  const canUseId = isUUID(vibeId);
  const canCallApi = enabled && canUseId && !!token;

  const toggle = async () => {
    // если нельзя — просто игнорим клик
    if (!canCallApi) return;

    const next = !visible;
    // оптимистично переключаем
    setVisible(next);

    try {
      const res = await fetch(`/api/v3/vibes/visibility/${vibeId}?visible=${next}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Visibility update failed: ${res.status}`);

      const data = await res.json().catch(() => ({}));
      // при включении публичности сервер может вернуть код
      if (next) {
        const newCode = data?.code ?? data?.publicCode ?? code ?? null;
        setCode(newCode);
      } else {
        setCode(null);
      }
    } catch (err) {
      // откат видимости при ошибке
      console.error("Failed to update visibility:", err);
      setVisible(!next);
    }
  };

  const button = useMemo(
    () => (
      <label className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={visible}
          onChange={toggle}
          className="form-check-input"
          disabled={!enabled} 
        />
        <span>
          {visible ? labels.visible ?? "Visible" : labels.hidden ?? "Hidden"}
        </span>
      </label>
    ),
    [visible, toggle, enabled, labels.visible, labels.hidden]
  );

  return [visible, code, button];
}
