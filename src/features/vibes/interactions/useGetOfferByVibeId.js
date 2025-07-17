import { useEffect, useState } from "react";

export default function useGetOfferByVibeId(id, token) {
  const [offers, setOffer] = useState([]);

  useEffect(() => {
    fetch(`/api/v3/offers/vibe/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOffer(data))
      .catch(() => setOffer([]));
  }, [id, token]);

  return offers;
}
