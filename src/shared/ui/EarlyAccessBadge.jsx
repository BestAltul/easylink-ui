import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./EarlyAccessBadge.css"

export default function EarlyAccessHoverCard({
  isAuthenticated,
  requestEarlyAccess,
  loadingSubscribe,
  navigate,
  subscribed,
}) {
  const { t } = useTranslation(); // <== ВОТ ЭТО ДОБАВЬ
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 2000);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

    return (
    <div
      className="early-access-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="early-access-badge">
        <div
        className={`early-access-minimal ${subscribed ? "subscribed-green" : ""}`}
        >
        {subscribed ? "✅ Subscribed!" : t("header.early_subscribtion")}
        </div>


        <div className={`early-access-expanded ${isHovered ? "visible" : ""}`}>
          <div className="early-access-title">
            {t("header.lifetime_offer")}
          </div>

            {subscribed ? (
                <button className="early-access-claim subscribed-green">
                🎉 You're in! Enjoy lifetime access.
                 </button>
                 ) : (
                <button
                    className="early-access-claim"
                    onClick={() => {
                    if (!isAuthenticated) navigate("/signin");
                    else requestEarlyAccess();
                    }}
                    disabled={loadingSubscribe}
                >
                {loadingSubscribe ? "⏳ Joining..." : "🔥 Claim Access"}
            </button>
            )}
        </div>
      </div>
    </div>
  );
}