import { useState, useEffect } from "react";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    fetch("/api/v3/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}
