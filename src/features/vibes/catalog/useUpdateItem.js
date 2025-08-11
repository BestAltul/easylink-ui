export function useUpdateItem() {
  const updateItem = async (id, patch) => {
    const token = localStorage.getItem("jwt");

    const res = await fetch(`/api/v3/catalog/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Patch failed: ${res.status} ${text}`);
    }

    return await res.json();
  };

  return { updateItem };
}
