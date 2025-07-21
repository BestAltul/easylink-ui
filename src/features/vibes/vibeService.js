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