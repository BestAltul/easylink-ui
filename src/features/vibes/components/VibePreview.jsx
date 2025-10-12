// VibePreview.jsx
import React from "react";
import { BsShareFill } from "react-icons/bs";
import ShareModal from "../tools/ShareModal";
import VibeContent from "../tools/VibeContent";
import { trackEvent } from "@/services/amplitude";
import useVisibilityToggle from "@/features/vibes/useVisibilityToggle.jsx";
import useShareModal from "@/components/common/hooks/useShareModal";
import { useTranslation } from "react-i18next";
import "./VibePreview.css"; 

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export default function VibePreview({
  id,
  name,
  description,
  photoFile,
  contacts,
  type,
  extraBlocks: extraBlocksProp,
  visible = false,
  publicCode,

  editMode = false,
  cardBody = null,
  onChangeName = () => {},
  onChangeDescription = () => {},
  onChangePhotoFile = () => {},
  onOpenContactPicker = () => {},
  onRemoveContact = () => {},
  onChangeContactValue = () => {},
  onOpenBlockPicker = () => {},
  onBlockChange: parentOnBlockChange,
  onBlockRemove: parentOnBlockRemove,
  resumeEditAt,
}) {
  const { t } = useTranslation();

  const [localExtraBlocks, setLocalExtraBlocks] = React.useState(extraBlocksProp || []);
  React.useEffect(() => {
    setLocalExtraBlocks(Array.isArray(extraBlocksProp) ? extraBlocksProp : []);
  }, [extraBlocksProp]);

  const hasId = isUUID(id);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const currentHref = typeof window !== "undefined" ? window.location.href : "";
  const shareUrl = hasId ? `${origin}/view/${id}` : currentHref;

  const [vibeVisible, code, visibilityButton] = useVisibilityToggle(
    id,
    visible,
    publicCode,
    {
      enabled: hasId,
      labels: {
        visible: t("vibe_preview:public", "Visible"),
        hidden:  t("vibe_preview:hidden", "Hidden"),
      },
    }
  );

  const {
    showShare,
    copied: modalCopied,
    handleCopy,
    handleOpen,
    handleClose,
    ShareModalProps,
  } = useShareModal(shareUrl, id, "VibePreview");

  const onShareClick = () => {
    trackEvent("Vibe Share Button Clicked", {
      vibeId: id,
      name,
      publicCode,
      location: "VibePreview",
    });
    handleOpen();
  };

  const [codeCopied, setCodeCopied] = React.useState(false);

  const handleCopyCode = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = String(text);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  const handleBlockChange = React.useCallback(
    (index, valueOrPatch) => {
      if (editMode && typeof parentOnBlockChange === "function") {
        parentOnBlockChange(index, valueOrPatch);
      } else {
        setLocalExtraBlocks((prev) =>
          prev.map((b, i) => (i === index ? { ...b, value: valueOrPatch } : b)),
        );
      }
    },
    [editMode, parentOnBlockChange],
  );

  const handleBlockRemove = React.useCallback(
    (index) => {
      if (editMode && typeof parentOnBlockRemove === "function") {
        parentOnBlockRemove(index);
      } else {
        setLocalExtraBlocks((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [editMode, parentOnBlockRemove],
  );

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
      <div className="position-relative w-100" style={{ minHeight: 0 }}>
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <button
            className="btn btn-light shadow-sm"
            style={{ borderRadius: 99 }}
            onClick={onShareClick}
            disabled={!hasId}
            title={
              hasId
                ? t("vibe_preview:share", "Share")
                : t("vibe_preview:save_first_to_share", "Save first to get share link")
            }
          >
            <BsShareFill size={20} style={{ color: "#627bf7" }} />
          </button>
        </div>
      </div>

      <div className="mb-3 w-100 px-3">
        <div className="vv-label">
          {t("vibe_preview:sharing_section", "Visibility")}
        </div>

        <div className="vv-wrap visibility-compact">
          {hasId && visibilityButton}

          {hasId && vibeVisible && code && (
            <>
              <button
                type="button"
                className="vv-code"
                onClick={() => handleCopyCode(code)}
                title={t("Click to copy", { defaultValue: "Click to copy" })}
              >
                <span className="vv-code-label">
                  {t("vibe_content:share_code_label", "Share code")}
                </span>
                <span className="vv-code-value">{code}</span>
              </button>

              {codeCopied && (
                <span className="vv-copied" role="status" aria-live="polite">
                  {t("Copied!", { defaultValue: "Copied!" })}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <ShareModal
        {...ShareModalProps}
        show={showShare}
        onClose={handleClose}
        shareUrl={shareUrl}
        copied={modalCopied}
        onCopy={handleCopy}
      />

      {cardBody ? (
        cardBody
      ) : (
        <VibeContent
          id={id}
          name={name}
          description={description}
          photoFile={photoFile}
          contacts={contacts}
          type={type}
          extraBlocks={editMode ? extraBlocksProp || [] : localExtraBlocks}
          visible={visible}
          publicCode={publicCode}
          editMode={editMode}
          onChangeName={onChangeName}
          onChangeDescription={onChangeDescription}
          onChangePhotoFile={onChangePhotoFile}
          onOpenContactPicker={onOpenContactPicker}
          onRemoveContact={onRemoveContact}
          onChangeContactValue={onChangeContactValue}
          resumeEditAt={resumeEditAt}
          onBlockChange={handleBlockChange}
          onBlockRemove={handleBlockRemove}
          onOpenBlockPicker={onOpenBlockPicker}
        />
      )}
    </div>
  );
}
