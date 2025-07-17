import React, { useEffect, useState } from "react";
import VibeActions from "./VibeActions";
import VibePreviewForCustomers from "../../VibeViewForCustomers/VibePreviewForCustomers";
import parseFields from "../../../data/parseFields";
import { useParams, useSearchParams } from "react-router-dom";

export default function VibeView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const subscriberVibeId = searchParams.get("subscriberVibeId");
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    setLoading(true);

    fetch(`/api/v3/vibes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setVibe(data);
        setSubscribed(!!data.subscribed);
      })
      .catch(() => setError("Vibe not found for "))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error)
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  if (!vibe) return null;

  // Здесь уже точно есть vibe!
  const { name, description, contacts, extraBlocks } = parseFields(
    vibe.fieldsDTO
  );

  return (
    <div className="container-fluid py-4">
      <div
        className="row justify-content-center g-4"
        style={{ minHeight: 450 }}
      >
        {/* Левая колонка */}
        <div className="col-12 col-lg-8 d-flex align-items-stretch">
          <VibePreviewForCustomers
            id={vibe.id}
            name={vibe.name}
            description={vibe.description || description}
            photoFile={vibe.photoFile}
            contacts={contacts}
            type={vibe.type}
            extraBlocks={extraBlocks}
            mySubscriberVibeId={subscriberVibeId}
          />
        </div>
      </div>
    </div>
  );
}
