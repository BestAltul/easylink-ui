import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("is-target");
      const t = setTimeout(() => el.classList.remove("is-target"), 1200);
      return () => clearTimeout(t);
    }
  }, [hash]);
}
