import { useEffect, useState } from "react";

const toAbsoluteUrl = (u) => {
  if (!u) return "";
  return u.startsWith("http") ? u : `${window.location.origin}${u}`;
};

export function useGetFile(itemId) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(!!itemId);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!itemId) return;

    (async () => {
      try {
        const res = await fetch(`/api/v3/catalog/${itemId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to load item");

        const data = await res.json();

        const imageUrl = toAbsoluteUrl(data.imageUrl || data.image || "");
        setItem({ ...data, imageUrl });
      } catch (e) {
        console.error(e);
        setItem(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId, token]);

  return { item, loading };
}
