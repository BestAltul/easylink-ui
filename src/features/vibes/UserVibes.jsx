// src/features/vibes/UserVibes.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserVibes, deleteVibe } from "@/api/vibeApi";
import HeaderActions from "./components/HeaderActions";
import VibesList from "./components/VibesList";
import ShareModal from "./tools/ShareModal";
import Loader from "./components/Loader";
import { useTranslation } from "react-i18next";
import "./styles/UserVibes.css";

export default function UserVibes() {
  const { t } = useTranslation("myvibes");
  const { isAuthenticated } = useAuth();

  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareVibe, setShareVibe] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      setVibes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const data = await getUserVibes(); // токен приклеит apiFetch
        if (!cancelled) setVibes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading Vibes", err);
        if (!cancelled) setVibes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const handleDelete = async (vibeId) => {
    if (!window.confirm(t("delete_confirm"))) return;
    setLoading(true);
    try {
      await deleteVibe(vibeId); // токен приклеит apiFetch
      setVibes((prev) => prev.filter((v) => v.id !== vibeId));
    } catch (err) {
      console.error(err);
      alert(t("toast_error") ?? "Error: " + (err?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (vibe) => {
    setShareVibe(vibe);
    setCopied(false);
  };

  const handleCloseShare = () => {
    setShareVibe(null);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!shareVibe) return;
    const link = `${window.location.origin}/view/${shareVibe.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main
      className="container myvibes py-5"
      style={{
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
      aria-labelledby="myvibes-title"
    >
      <HeaderActions />

      <h1 id="myvibes-title" className="visually-hidden">
        {t("title", "My Vibes")}
      </h1>

      {loading ? (
        <Loader />
      ) : vibes.length === 0 ? (
        <div className="text-center text-muted mt-4">
          <div>{t("no_vibes")}</div>
          <div className="small">{t("no_vibes_hint")}</div>
        </div>
      ) : (
        <section className="vibes-grid" role="list" aria-label={t("list_aria", "Your vibes")}>
          <VibesList
            vibes={vibes}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        </section>
      )}

      <ShareModal
        show={!!shareVibe}
        onClose={handleCloseShare}
        shareUrl={shareVibe ? `${window.location.origin}/view/${shareVibe.id}` : ""}
        copied={copied}
        onCopy={handleCopy}
      />
    </main>
  );
}
