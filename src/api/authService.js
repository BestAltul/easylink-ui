// src/api/authService.js

export async function verifyEmailAPI(email) {
  const res = await fetch("/api/v3/auth/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let message = "Email verification failed";

    if (contentType.includes("application/json")) {
      const errorData = await res.json();
      message = errorData?.message || message;
    } else {
      const errorText = await res.text();
      message = errorText || message;
    }

    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function signUpAPI(email, entriesList) {
  const res = await fetch("/api/v3/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, entries: entriesList }),
  });

  const contentType = res.headers.get("content-type") || "";
  let data = null;
  let text = null;

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      text = await res.text();
    }

    const error = new Error(data?.message || text || "Failed to sign up");
    error.response = { data };
    throw error;
  }

  return res.text();
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
