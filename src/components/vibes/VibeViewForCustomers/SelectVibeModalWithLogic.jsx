import React, { useState, useEffect } from "react";
import SelectVibeModal from "./SelectVibeModal";
import useSubscribe from "./UseSubscribe";

export default function SelectVibeModalWithLogic({
  targetVibeId,
  onSubscribed,
  onCancel,
}) {
  const [availableVibes, setAvailableVibes] = useState([]);
  const [selectedMyVibeId, setSelectedMyVibeId] = useState(null);
  const { subscribe } = useSubscribe(targetVibeId);

  useEffect(() => {
    fetch("/api/v3/vibes", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setAvailableVibes(data);
      })
      .catch((err) => {
        console.error("Error fetching my vibes", err);
      });
  }, []);

  const handleConfirm = async () => {
    await subscribe(selectedMyVibeId);
    onSubscribed();
  };

  return (
    <SelectVibeModal
      availableVibes={availableVibes}
      selectedMyVibeId={selectedMyVibeId}
      setSelectedMyVibeId={setSelectedMyVibeId}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
}
