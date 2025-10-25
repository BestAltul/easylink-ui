// src/debug/authDebug.js
if (typeof window !== "undefined") {
  window.__authlog = (...args) => console.log("%c[AUTH]", "color:#fff;background:#4b8", ...args);
  window.__navlog  = (...args) => console.log("%c[NAV]",  "color:#fff;background:#86f", ...args);
  window.__guard   = (...args) => console.log("%c[GUARD]","color:#fff;background:#e85", ...args);
  window.__api     = (...args) => console.log("%c[API]",  "color:#000;background:#ff0", ...args);
  window.__err     = (...args) => console.log("%c[ERR]",  "color:#fff;background:#c00", ...args);
}
window.addEventListener("unhandledrejection", e => {
  console.log("%c[PROMISE-UNHANDLED]", "color:#fff;background:#c00", e.reason);
});
window.addEventListener("error", e => {
  console.log("%c[ERROR]", "color:#fff;background:#c00", e.message, e.error);
});
