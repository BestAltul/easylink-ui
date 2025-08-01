// src/api/authService.js

export async function verifyEmailAPI(email) {
  const res = await fetch("/api/v3/auth/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok && res.status !== 404) {
    throw new Error("Network response was not ok");
  }

  if (res.status === 404) {
    return null; 
  }

  return res.json();
}

export async function signUpAPI(email, entriesList) {
  const res = await fetch("/api/v3/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, entries: entriesList }),
  });

  const message = await res.text();

  if (!res.ok) {
    throw new Error(message || "Failed to sign up");
  }
  return message;
}

export async function checkAnswersAPI(email, answers, timezone) {
  const res = await fetch("/api/v3/auth/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, answers, timezone }),
  });

  const contentType = res.headers.get("content-type") || "";

  let errorData = null;
  let errorText = null;

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      errorData = await res.json();
    } else {
      errorText = await res.text();
    }
    const error = new Error(
      errorData?.message || errorText || "Error checking answers"
    );
    error.status = res.status;
    throw error;
  }

  return res.json();
}