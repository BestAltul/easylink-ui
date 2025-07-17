import React from "react";
import VibeContent from "./VibeContentForCustomers";


export default function VibePreviewForCustomers({
  id,
  name,
  description,
  photoFile,
  contacts,
  type,
  extraBlocks,
  mySubscriberVibeId,
}) {
  return (
    <div
      className="card shadow rounded-4 p-4 vibe-preview"
      style={{
        background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
        border: "none",
        maxWidth: 400,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <VibeContent
        id={id}
        name={name}
        description={description}
        photoFile={photoFile}
        contacts={contacts}
        type={type}
        extraBlocks={extraBlocks}
        subscriberVibeId={mySubscriberVibeId}
      />
    </div>
  );
}
