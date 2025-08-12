import { useEffect, useState } from "react";
export default function useItemsByVibeId(vibeId, token) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!vibeId) return;
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/v3/catalog?vibeId=${vibeId}`, { headers });

      if (!res.ok) {
        if (res.status === 401) {
          setItems([]);
          return;
        }

        const text = await res.text().catch(() => "");
        console.warn("Catalog load failed:", res.status, text);
        setItems([]);
        return;
      }

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("Catalog load error:", e);
      setItems([]);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [vibeId, token]);

  return { items, loading, error, reload: load };
}
