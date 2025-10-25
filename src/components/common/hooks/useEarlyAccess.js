// src/components/common/hooks/useEarlyAccess.js
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export function useEarlyAccess() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const { user, accessToken } = useAuth();
  const email = user?.email || ""; // в твоём контексте именно email

  const requestEarlyAccess = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = new Headers({ "Content-Type": "application/json" });
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

      const res = await fetch(
        `/api/v3/interactions/early-access?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers,
          credentials: "include",               // <— критично для cookie-сессии
          body: JSON.stringify({ source: "header" }),
        }
      );

      if (!res.ok) {
        const msg = (await res.text()) || "Request failed";
        throw new Error(msg);
      }

      setSubscribed(true);
    } catch (e) {
      console.error("[useEarlyAccess] error:", e);
      setError(e);
      // тут лучше показать тост, а не alert
    } finally {
      setLoading(false);
    }
  }, [email, accessToken]);

  return { requestEarlyAccess, loading, error, subscribed, setSubscribed };
}
