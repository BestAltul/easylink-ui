import { useState } from "react";
import axios from "axios";

export default function useCreateOffer(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOffer = async (form, subscriberVibeId) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        vibeId: subscriberVibeId,
        title: form.title,
        description: form.description,
        discountType: form.discountType,
        initialDiscount: Number(form.initialDiscount),
        currentDiscount: Number(form.currentDiscount),
        decreaseStep: Number(form.decreaseStep),
        decreaseIntervalMinutes: Number(form.decreaseIntervalMinutes),
        active: form.active,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };

      await axios.post("/api/v3/offers", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true; // успех
    } catch (err) {
      console.error(err);
      setError(err);
      return false; // ошибка
    } finally {
      setLoading(false);
    }
  };

  return { createOffer, loading, error };
}
