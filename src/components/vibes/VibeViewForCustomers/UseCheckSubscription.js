import { useEffect, useState } from "react";

export default function useCheckSubscription(subscriberVibeId, targetVibeId) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    if (!token || !subscriberVibeId || !targetVibeId) return;

    fetch(`/api/v3/interactions/${subscriberVibeId}/subscribed?targetVibeId=${targetVibeId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.ok && res.json())
      .then((data) => setSubscribed(data === true))
      .catch((err) => console.warn("Failed to check subscription:", err))
      .finally(() => setLoading(false));
  }, [subscriberVibeId, targetVibeId, token]);

  return { subscribed, loading };
}
