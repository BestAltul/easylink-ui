export function useCreateItem() {
  const createItem = async ({
    title,
    description,
    price,
    imageUrl,
    vibeId,
  }) => {
    const token = localStorage.getItem("jwt");

    const res = await fetch("/api/v3/catalog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        price,
        imageUrl,
        vibeId,
      }),
    });

    if (!res.ok) {
      throw new Error("Item creation failed: " + (await res.text()));
    }

    return await res.json();
  };

  return { createItem };
}
