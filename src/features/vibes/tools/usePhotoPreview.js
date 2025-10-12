import { useEffect, useState } from "react";

export default function usePhotoPreview(photoFile) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    let url;
    if (!photoFile) {
      setPreviewUrl(null);
    } else if (photoFile instanceof File) {
      url = URL.createObjectURL(photoFile);
      setPreviewUrl(url);
    } else if (typeof photoFile === "string") {
      setPreviewUrl(photoFile);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [photoFile]);

  return previewUrl;
}
