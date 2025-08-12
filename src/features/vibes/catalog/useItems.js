import { useState, useEffect } from "react";

export function useItems(itemId, { auth = "optional" } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const url = `/api/v3/catalog/${encodeURIComponent(itemId)}`;
    const token = localStorage.getItem("jwt");

    const fetchOnce = async (useToken) => {
      const headers = {};
      if (useToken) {
        if (!token) {
          const err = new Error("NO_TOKEN");
          err.code = "NO_TOKEN";
          throw err;
        }
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(url, { headers, signal });
      if (!res.ok) {
        const e = new Error(`HTTP ${res.status}`);
        e.status = res.status;
        throw e;
      }
      return res.json();
    };

    (async () => {
      setLoading(true);
      setError(null);
      try {
        let data;

        if (auth === "required") {
          data = await fetchOnce(true);
        } else if (auth === "none") {
          data = await fetchOnce(false);
        } else {
          // optional
          try {
            data = await fetchOnce(!!token);
          } catch (e) {
            if (e.status === 401 && token) {
              data = await fetchOnce(false);
            } else {
              throw e;
            }
          }
        }

        const arr = Array.isArray(data) ? data : data ? [data] : [];
        setItems(arr);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Ошибка загрузки");
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [itemId, auth]);

  return { items, loading, error };
}
