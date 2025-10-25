// src/api/authService.js

import { apiFetch } from "@/api/apiFetch";

export async function verifyEmailAPI(email) {
  const res = await apiFetch("/api/v3/auth/start", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * checkAnswersAPI — адаптирует "кривой" ответ бэка под ожидаемый фронтом формат.
 * Бэкенд сейчас шлёт: { "Authentication successful": "<jwt>" }
 * Мы приводим это к:   { accessToken: "<jwt>", cookieBased: false, user: {...} }
 */
export async function checkAnswersAPI(email, answers, timezone) {
  const res = await apiFetch("/api/v3/auth/check", {
    method: "POST",
    body: JSON.stringify({ email, answers, timezone }),
  });
  if (!res.ok) {
    const msg = (await res.text()) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  const raw = await res.json();

  const accessToken =
    raw?.accessToken ??
    raw?.token ??
    raw?.jwt ??
    raw?.["Authentication successful"] ??
    null;

  return {
    accessToken,
    cookieBased: false,
    user: { email },
    message: raw?.message,
  };
}

/**
 * signUpAPI — регистрация
 */
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
