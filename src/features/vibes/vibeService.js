// src/features/vibes/vibeService.js
export async function createVibe(dto, token) {
  const response = await fetch("/api/v3/vibes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error("Failed to create Vibe");
  return response.json();
}

export async function updateVibe(vibe, token) {
  const body = {
    description: vibe.description,
    fieldsDTO: vibe.fieldsDTO
  };

  console.log("📤 PUT body:", body);

  const response = await fetch(`/api/v3/vibes/${vibe.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Ошибка при сохранении Vibe:", err);
    throw new Error("Ошибка при сохранении Vibe");
  }

  return await response.json();
}
