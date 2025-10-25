// src/components/common/hooks/useEarlyAccessCheckable.js
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export function useEarlyAccessCheckable() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const { user, accessToken } = useAuth();
  const email = user?.email || "";

  const checkEarlyAccess = useCallback(async () => {
    // если нет email — нечего проверять
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const headers = new Headers({ "Content-Type": "application/json" });
      // добавляем Bearer только если реально есть JWT
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

      const res = await fetch(
        `/api/v3/interactions/early-access/status?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers,
          credentials: "include", // критично для cookie-сессий
        }
      );

      if (!res.ok) {
        const msg = (await res.text()) || "Request failed";
        throw new Error(msg);
      }

      // бэк может вернуть boolean или объект
      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json") ? await res.json() : await res.text();

      const value =
        typeof body === "boolean"
          ? body
          : (typeof body === "object" && body !== null && "subscribed" in body
              ? !!body.subscribed
              : body === "true");

      setSubscribed(!!value);
    } catch (e) {
      console.error("[useEarlyAccessCheckable] error:", e);
      setError(e);
      // НЕ делай здесь logout — если будет 401, общий слой/guard сам разрулит
    } finally {
      setLoading(false);
    }
  }, [email, accessToken]);

  return { checkEarlyAccess, loading, error, subscribed, setSubscribed };
}
