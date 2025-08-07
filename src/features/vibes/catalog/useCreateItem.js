import { useFileUpload } from "./useFileUpload";

export function useCreateItem() {
  const { uploadFile } = useFileUpload();

  const createItem = async ({ title, description, price, file, vibeId }) => {
    let imageUrl = "";

    if (file) {
      imageUrl = await uploadFile(file);
    }

    const token = localStorage.getItem("jwt");

    const res = await fetch("/api/v3/catalog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vibeId,
        title,
        description,
        imageUrl,
        price,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error("Item creation failed: " + msg);
    }

    return await res.json(); // ItemResponse
  };

  return { createItem };
}
