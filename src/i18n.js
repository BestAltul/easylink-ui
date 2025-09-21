// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/**
 * Автоподхват всех JSON в src/locales/<lng>/<ns>.json
 * (Vite/webpack поддерживают import.meta.glob)
 */
const modules = import.meta.glob("./locales/*/*.json", { eager: true });

const resources = {};
const namespaces = new Set();

for (const filePath in modules) {
  // ./locales/en/profile.json -> lng=en, ns=profile
  const m = filePath.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!m) continue;
  const [, lng, ns] = m;
  const json = modules[filePath]?.default ?? modules[filePath];

  resources[lng] ??= {};
  resources[lng][ns] = json;
  namespaces.add(ns);
}

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",                // общий неймспейс по умолчанию
    ns: Array.from(namespaces),        // все найденные ns
    resources,
    interpolation: { escapeValue: false },
    returnNull: false,
  });

export default i18n;
