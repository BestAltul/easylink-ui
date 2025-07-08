import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VibeActions from "./VibeActions";
import VibePreviewForCustomers from "../VibeViewForCustomers/VibePreviewForCustomers";
import parseFields from "../../../data/parseFields";

export default function VibeView() {
  const { id } = useParams();
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const token = sessionStorage.getItem("jwt");

  // useEffect(() => {
  //   setLoading(true);
  //   Promise.all([
  //     fetch(`/api/v3/vibes/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...(token && { Authorization: `Bearer ${token}` }),
  //       },
  //     }).then((res) => res.ok ? res.json() : Promise.reject(res)),
  //     fetch(`/api/v3/vibes/${id}/comments`).then(res => res.ok ? res.json() : [])
  //   ])
  //     .then(([data, commentsData]) => {
  //       setVibe(data);
  //       setSubscribed(!!data.subscribed);
  //       setComments(commentsData);
  //     })
  //     .catch(() => setError("Vibe not found"))
  //     .finally(() => setLoading(false));
  // }, [id, token]);

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
      .catch(() => setError("Vibe not found"))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="text-center py-5">Загрузка...</div>;
  if (error)
    return <div className="text-center py-5 text-danger">Ошибка: {error}</div>;
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
          />
        </div>
      </div>
    </div>
  );
}
