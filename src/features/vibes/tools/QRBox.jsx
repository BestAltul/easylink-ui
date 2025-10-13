import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRBox({ id, t }) {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  if (id) {
    return (
      <>
        <QRCodeCanvas
          value={`${origin}/vibes/${id}`}
          size={60}
          includeMargin={false}
          aria-label={t("qr_aria")}
        />
        <div style={{ fontSize: 12, color: "#aaa" }}>{t("share_qr")}</div>
      </>
    );
  }

  return (
    <div
      className="qr-preview"
      style={{
        width: 60,
        height: 60,
        background: "#fafafa",
        border: "1.5px dashed #ddd",
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#aaa",
      }}
      title={t("qr_hint")}
    >
      QR
    </div>
  );
}
