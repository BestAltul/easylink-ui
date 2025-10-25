// src/components/common/hooks/useHasVibes.js
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/api/apiFetch";

export default function useHasVibes() {
  const { isAuthenticated, accessToken } = useAuth();
  const [hasVibes, setHasVibes] = useState(undefined); // undefined = loading

  useEffect(() => {
    // если не авторизован — явно false и выходим
    if (!isAuthenticated || !accessToken) {
      setHasVibes(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      try {
        const res = await apiFetch("/api/v3/vibes", { signal: ac.signal });
        if (!res.ok) {
          // apiFetch сам вызовет logout() на 401,
          // а здесь просто считаем, что вайбов нет
          setHasVibes(false);
          return;
        }
        const data = await res.json();
        setHasVibes(Array.isArray(data) ? data.length > 0 : false);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Failed to check vibes:", e);
          setHasVibes(false);
        }
      }
    })();

    return () => ac.abort();
  }, [isAuthenticated, accessToken]);

  return hasVibes;
}
