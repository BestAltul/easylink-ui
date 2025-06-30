import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__links">
        <a href="/terms">Conditions of Use</a>
        <a href="/privacy">Privacy Notice</a>
        <a href="/ads">Interest-Based Ads</a>
      </div>

      {/* <div className="footer__copyright">
        © {new Date().getFullYear()} EasyLink, Inc. or its affiliates
      </div> */}

      <div className="footer__address">
        © 2025 EasyLink. All rights reserved.
      </div>
    </footer>
  );
}
