import React from "react";
import { BsClipboard } from "react-icons/bs";
import { FaTelegramPlane, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { trackEvent } from '@/services/amplitude';

export default function ShareModal({
  show,
  onClose,
  shareUrl,
  copied,
  onCopy,
}) {
  const { t } = useTranslation();

  if (!show) return null;

  return createPortal(
    <div
      className="vibe-share-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(34,42,75,.22)",
        zIndex: 1111,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          minWidth: 320,
          maxWidth: 370,
          borderRadius: 18,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn-close position-absolute"
          style={{ top: 10, right: 10 }}
          onClick={onClose}
        />
        <h5>{t("share_modal.title")}</h5>
        <div className="text-muted" style={{ fontSize: 15 }}>
          {t("share_modal.subtitle")}
        </div>
        <input
          className="form-control my-2"
          value={shareUrl}
          readOnly
          onClick={(e) => {
            e.target.select();
            onCopy(shareUrl);
            trackEvent('Link Copied', { method: 'input_click' });
          }}
        />
        <button
          className={`btn w-100 mb-2 ${
            copied ? "btn-success" : "btn-outline-primary"
          }`}
          onClick={() => {
            onCopy(shareUrl);
            trackEvent('Link Copied', { method: 'button' });
          }}
        >
          {copied ? (
            <>
              <span className="me-2">&#10003;</span>{" "}
              {t("share_modal.copied_button")}
            </>
          ) : (
            <>
              <BsClipboard /> {t("share_modal.copy_button")}
            </>
          )}
        </button>
        <div className="d-flex flex-column gap-2 mb-2">
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => {
              onCopy(false);
              trackEvent('Share Clicked', { method: 'telegram' });
            }}
          >
            <FaTelegramPlane /> {t("share_modal.telegram")}
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success d-flex align-items-center gap-2"
            onClick={() => {
              onCopy(false);
              trackEvent('Share Clicked', { method: 'whatsapp' });
            }}
          >
            <FaWhatsapp /> {t("share_modal.whatsapp")}
          </a>

          <a
            href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={() => {
              onCopy(false);
              trackEvent('Share Clicked', { method: 'instagram' });
            }}
          >
            <FaInstagram /> {t("share_modal.instagram")}
          </a>
        </div>
        <div className="text-center my-3">
          <QRCodeCanvas value={shareUrl} size={112} />
          <div style={{ fontSize: 12, color: "#888", marginTop: 7 }}>
            {t("share_modal.qr_note")}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
