import { useEffect, useState } from "react";

export default function useOffers(id, token) {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch(`/api/v3/offers/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch(() => setOffers([]));
  }, [id, token]);

  return offers;
}
