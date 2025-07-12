import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useEarlyAccessCheckable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuth();

  const email = user?.username;
  const token = user?.token;

  const checkEarlyAccess = async () => {
    setLoading(true);
    setError(null);

    const email = user?.username;
    const token = user?.token;

    console.log("token from check", token);

    try {
      const response = await fetch(
        `/api/v3/interactions/early-access/status?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  };

  return { checkEarlyAccess, loading, error, subscribed };
}
