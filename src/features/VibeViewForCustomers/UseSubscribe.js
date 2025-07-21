import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useSubscribe(targetVibeId) {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async (myVibeId) => {
    if (!token) {
      navigate(`/signin?redirectTo=/vibes/${targetVibeId}&subscribe=true`);
      return;
    }

    try {
      await fetch(`/api/v3/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetVibeId: targetVibeId,
          myVibeId: myVibeId,
          userEmail: null,
          anonymous: false,
          active: true,
          interactionType: "SUBSCRIBE",
        }),
      });
      setSubscribed(true);
    } catch (error) {
      console.error("Subscribe failed", error);
    }
  };

  return { subscribed, subscribe, token };
}
