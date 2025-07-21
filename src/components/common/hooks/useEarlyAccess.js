import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useEarlyAccess() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const email = user?.username;
  const token = user?.token;

  const requestEarlyAccess = async () => {
    setLoading(true);
    setError(null);

    const email = user?.username;
    const token = user?.token;

    try {
      const response = await fetch(
        `/api/v3/interactions/early-access?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ source: "header" }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSubscribed(true);
      //alert("✅ You’ve requested early access!");
    } catch (err) {
      console.error("Early access error:", err);
      setError(err);
      alert("⚠️ Server error");
    } finally {
      setLoading(false);
    }
  };

  return { requestEarlyAccess, loading, error, subscribed, setSubscribed };
}
