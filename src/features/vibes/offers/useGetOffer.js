import { useEffect, useState } from "react";

export default function useGetOffer(id, token) {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    if (!id) return;

    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`/api/v3/offers/${id}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setOffer(data))
      .catch(() => setOffer(null));
  }, [id, token]);

  return { offer };
}
