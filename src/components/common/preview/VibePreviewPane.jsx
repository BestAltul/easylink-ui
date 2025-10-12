import React from "react";
import VibePreview from "@/features/vibes/components/VibePreview";

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export default function VibePreviewPane(props) {
  const rawId = props?.id;
  const canUseId = isUUID(rawId);

  const safeProps = {
    ...props,
    editMode: true,
    id: canUseId ? rawId : undefined,
    ownerActionsEnabled: !!canUseId,
  };

  return (
    <div
      className="w-100"
      style={{ maxWidth: 900, margin: "0 auto", padding: "1rem 0" }}
    >
      <VibePreview {...safeProps} />
    </div>
  );
}