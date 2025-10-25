// src/api/apiFetch.js
import { getAuthSidecar } from "@/context/AuthContext";

export async function apiFetch(input, init = {}) {
  const sc = getAuthSidecar();
  let access = sc.getAccess?.();
  if (!access) {
    try {
      access = localStorage.getItem("jwt") || null;
    } catch {}
  }

  const url = typeof input === "string" ? input : input?.url || "";

  const headers = new Headers(init.headers || {});
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (access && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${access}`);

  const res = await fetch(input, { ...init, headers, credentials: "include" });

  const hasAuth = headers.has("Authorization");
  // console.debug(
  //   `[api] ${init.method || "GET"} ${url} -> ${res.status} ${
  //     hasAuth ? "[AUTH]" : "[NO-AUTH]"
  //   }`
  // );

  if (res.status === 401 || res.status === 403) {
    try {
      localStorage.removeItem("jwt");
    } catch {}
    try {
      sc.forceLogout?.("expired");
    } catch {}
    const err = new Error("auth.session_expired");
    err.status = res.status;
    throw err;
  }

  return res; 
}
