import { useEffect, useState } from "react";

export default function useGetOffer(id, token) {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    if (!id || !token) return;

    fetch(`/api/v3/offers/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setOffer(data))
      .catch(() => setOffer(null));
  }, [id, token]);

  return { offer };
}
