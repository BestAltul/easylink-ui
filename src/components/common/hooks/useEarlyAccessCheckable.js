import { useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useEarlyAccessCheckable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuth();

  const checkEarlyAccess = useCallback(async () => {
    if (!user?.username || !user?.token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v3/interactions/early-access/status?email=${encodeURIComponent(
          user.username
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      setSubscribed(result);
    } catch (err) {
      console.error("Early access check error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { checkEarlyAccess, loading, error, subscribed, setSubscribed };
}
