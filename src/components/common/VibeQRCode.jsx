import QRCode from "react-qr-code";

export default function VibeQRCode({ url, size = 128 }) {
  return (
    <div style={{ background: "#fff", padding: 10, borderRadius: 12 }}>
      <QRCode value={url} size={size} />
    </div>
  );
}
