import React, { useEffect, useState } from "react";
import { getUserVibes, deleteVibe } from "@/api/vibeApi";
import HeaderActions from "./components/HeaderActions";
import VibesList from "./components/VibesList";
import ShareModal from "./tools/ShareModal";
import Loader from "./components/Loader";
import { useTranslation } from "react-i18next";
import "./styles/UserVibes.css";

export default function UserVibes() {
  const { t } = useTranslation();
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareVibe, setShareVibe] = useState(null);
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    setLoading(true);
    getUserVibes(token)
      .then(setVibes)
      .catch((err) => {
        console.error("Error loading Vibes", err);
        setVibes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (vibeId) => {
    if (!window.confirm(t("myvibes.delete_confirm"))) return;
    setLoading(true);
    try {
      await deleteVibe(vibeId, token);
      setVibes((prev) => prev.filter((v) => v.id !== vibeId));
    } catch (err) {
      alert("Error: " + err.message);
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
    <div className="container py-5">
      <HeaderActions />
      {loading ? (
        <Loader />
      ) : vibes.length === 0 ? (
        <div className="text-center text-muted mt-4">
          {t("myvibes.no_vibes") || "You have no Vibes yet."}
        </div>
      ) : (
        <VibesList
          vibes={vibes}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      )}
      <ShareModal
        show={!!shareVibe}
        onClose={handleCloseShare}
        shareUrl={shareVibe ? `${window.location.origin}/view/${shareVibe.id}` : ""}
        copied={copied}
        onCopy={handleCopy}
      />
    </div>
  );
}
