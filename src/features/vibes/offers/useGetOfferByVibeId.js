import { useEffect, useState } from "react";

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s || "");

export default function useGetOfferByVibeId(id, token, opts = {}) {
  const { enabled = true } = opts;

  const [offers, setOffer] = useState([]);

  useEffect(() => {
    const can = enabled && isUUID(id);
    if (!can) {
      setOffer([]);
      return;
    }

    let abort = false;

    (async () => {
      try {
        const res = await fetch(`/api/v3/offers/vibe/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (abort) return;
        if (!res.ok) {
          setOffer([]);
          return;
        }

        const data = await res.json();
        if (!abort) setOffer(Array.isArray(data) ? data : []);
      } catch {
        if (!abort) setOffer([]);
      }
    })();

    return () => {
      abort = true;
    };
  }, [id, token, enabled]);

  return offers; 
}
