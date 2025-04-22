// src/components/Footer.jsx
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p><strong>© 2025 EasyLink</strong>. All rights reserved.</p>
        <p style={{ marginTop: "0.2rem", fontSize: "0.9rem", color: "#666" }}>
          Contact us: support@easylink.io
        </p>
      </div>
    </footer>
  );
}
