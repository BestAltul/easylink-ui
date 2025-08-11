export function useFileUpload() {
  const uploadFile = async (file) => {
    const token = localStorage.getItem("jwt");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/v3/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    return await res.text(); // imageUrl
  };

  return { uploadFile };
}
