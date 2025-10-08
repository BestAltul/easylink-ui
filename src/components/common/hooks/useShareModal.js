import { useState, useCallback } from "react";
import { trackEvent } from "@/services/amplitude";

/**
 * hook for ShareModal logic:
 */
export default function useShareModal(shareUrl, vibeId, origin = "unknown") {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = useCallback(() => {
    trackEvent?.("Vibe Share Button Clicked", {
      vibeId,
      origin,
      ts: Date.now(),
      path: window.location.pathname,
    });
    setShowShare(true);
  }, [vibeId, origin]);

  const handleClose = useCallback(() => setShowShare(false), []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.warn("Clipboard API failed");
    }
  }, [shareUrl]);

  return {
    showShare,
    copied,
    handleOpen,
    handleClose,
    handleCopy,
    ShareModalProps: {
      show: showShare,
      onClose: handleClose,
      shareUrl,
      copied,
      onCopy: handleCopy,
    },
  };
}
