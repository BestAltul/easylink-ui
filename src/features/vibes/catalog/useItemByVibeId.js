import { useEffect, useState } from "react";

export default function useItemsByVibeId(vibeId, token) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!vibeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v3/catalog?vibeId=${vibeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No items found for this vibe ID");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [vibeId, token]);

  return { items, loading, reload: load };
}
