import { useEffect, useState } from "react";

export default function useHasVibes() {
  const [hasVibes, setHasVibes] = useState(undefined);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      setHasVibes(false);
      return;
    }

    fetch("/api/v3/vibes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setHasVibes(Array.isArray(data) ? data.length > 0 : false);
      })
      .catch((err) => {
        console.error("Failed to check vibes:", err);
        setHasVibes(false);
      });
  }, [token]);

  return hasVibes;
}
