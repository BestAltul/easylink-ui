import React from "react";
import VibePreview from "@/features/vibes/components/VibePreview"; 
export default function VibePreviewPane({
  name, description, photoFile, contacts, extraBlocks, type = "PERSONAL",
}) {
  return (
    <div style={{ flex: "1 1 400px", minWidth: 300, maxWidth: 460 }} className="d-none d-lg-block">
      <div className="sticky-top" style={{ top: 90, zIndex: 1 }}>
        <VibePreview
          name={name}
          description={description}
          photoFile={photoFile}
          contacts={contacts}
          type={type}
          extraBlocks={extraBlocks}
        />
      </div>
    </div>
  );
}
