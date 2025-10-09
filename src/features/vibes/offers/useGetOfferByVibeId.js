import { useEffect, useState } from "react";

export default function useGetOfferByVibeId(id, token) {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (!id) return;

    const headers = { "Content-Type": "application/json" };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`/api/v3/offers/vibe/${id}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setOffers(data))
      .catch((err) => {
        console.error("Failed to load offers:", err);
        setOffers([]);
      });
  }, [id, token]);

  return offers;
}
