import React from "react";
import { BsShareFill } from "react-icons/bs";
import ShareModal from "../tools/ShareModal";
import VibeContent from "../tools/VibeContent";

export default function VibePreview({
  id,
  name,
  description,
  photoFile,
  contacts,
  type,
  extraBlocks,
  visible,
  publicCode,
}) {
  const [showShare, setShowShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const shareUrl = id
    ? `${window.location.origin}/view/${id}`
    : window.location.href;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="card shadow rounded-4 p-4 vibe-preview"
      style={{
        background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
        border: "none",
        maxWidth: 400,
        margin: "0 auto",
        position: "relative",
      }}
    >
      Share button
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <button
          className="btn btn-light shadow-sm"
          style={{ borderRadius: 99 }}
          onClick={() => setShowShare(true)}
        >
          <BsShareFill size={20} style={{ color: "#627bf7" }} />
        </button>
      </div>

      {/* Share modal */}
      <ShareModal
        show={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={shareUrl}
        copied={copied}
        onCopy={handleCopy}
      />

      {/* Main content */}
      <VibeContent
        id={id}
        name={name}
        description={description}
        photoFile={photoFile}
        contacts={contacts}
        type={type}
        extraBlocks={extraBlocks}
        visible={visible}
        publicCode={publicCode}
      />
    </div>
  );
}
