// src/api/vibeApi.js

// GET ALL user's VIBES
export async function getUserVibes(token) {
  const res = await fetch("/api/v3/vibes", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load vibes");
  return res.json();
}

// Get Vibe by ID
export async function getVibe(id, token) {
  const res = await fetch(`/api/v3/vibes/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load vibe");
  return res.json();
}

// CREATE VIBE
export async function createVibe(data, token) {
  const res = await fetch("/api/v3/vibes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message || text;
    } catch {
      message = text;
    }
    throw new Error(message);
  }

  return res.json();
}

// PUT VIBE
export async function updateVibe(id, data, token) {
  const res = await fetch(`/api/v3/vibes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update vibe");
  return res.json();
}

// DELETE
export async function deleteVibe(id, token) {
  const res = await fetch(`/api/v3/vibes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete vibe");
  return true;
}
