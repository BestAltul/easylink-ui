import { useEffect, useState } from "react";

export default function useFollowing(id, token) {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetch(`/api/v3/interactions/${id}/following`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFollowing(data))
      .catch(() => setFollowing([]));
  }, [id, token]);

  return following;
}
