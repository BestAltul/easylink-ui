import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import "./UserVibes.css";

function Loader() {
  return (
    <div className="d-flex flex-column align-items-center my-5">
      <div className="spinner-border text-primary" role="status"></div>
      <div className="mt-2">Loading Vibes...</div>
    </div>
  );
}

export default function MyVibes() {
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareVibe, setShareVibe] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("jwt");

  useEffect(() => {
    setLoading(true);
    fetch("/api/v3/vibes", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVibes(data))
      .catch((err) => {
        console.error("Error loading Vibes", err);
        setVibes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleShare(vibe) {
    setShareVibe(vibe);
    setCopied(false);
  }

  function closeShare() {
    setShareVibe(null);
    setCopied(false);
  }

  function handleCopy(link) {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const shareLink =
    shareVibe && window.location.origin + `/vibes/${shareVibe.id}`;

  return (
    <div className="container py-5">
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ maxWidth: 980, margin: "0 auto" }}
      >
        <h2 className="fw-bold" style={{ letterSpacing: ".02em" }}>
          My Vibes
        </h2>
        <button
          className="btn btn-primary"
          style={{
            borderRadius: 12,
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
          }}
          onClick={() => navigate("/create-vibe")}
        >
          + Create New Vibe
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : vibes.length === 0 ? (
        <div className="alert alert-secondary text-center" style={{ maxWidth: 500, margin: "30px auto" }}>
          <div style={{ fontSize: 54, marginBottom: 12 }}>🌊</div>
          No Vibes found.
          <br />
          <span style={{ fontSize: 15, color: "#68798a" }}>
            Create your first Vibe!
          </span>
        </div>
      ) : (
        <div className="position-relative" style={{ minHeight: 340 }}>
          <div
            className="d-flex flex-wrap gap-4 justify-content-center w-100"
            style={{ maxWidth: 980, transition: "margin-right 0.4s" }}
          >
            <AnimatePresence>
              {vibes.map((vibe, idx) => (
                <div
                  key={vibe.id}
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1}}
                  exit={{ opacity: 0}}
                  transition={{
                    duration: 0.23,
                    type: "tween"
                  }}
                  className="vibe-card position-relative myvibe-card"
                  tabIndex={0}
                  title="Click to view and edit"
                  onClick={() => navigate(`/vibes/${vibe.id}`)}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 12,
                      zIndex: 12,
                    }}
                  >
                    <button
                      className="btn btn-light btn-sm d-flex align-items-center"
                      style={{
                        borderRadius: 20,
                        boxShadow: "0 1px 4px #d6d7fc",
                        fontWeight: 500,
                        fontSize: 15,
                        gap: 6,
                        transition: "all .14s",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(vibe);
                      }}
                      tabIndex={-1}
                      title="Share"
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#4154ff"
                        strokeWidth="2"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="5" cy="10" r="2.1" />
                        <circle cx="15" cy="5" r="2.1" />
                        <circle cx="15" cy="15" r="2.1" />
                        <path d="M6.7 9l5.6-3.2M6.7 11l5.6 3.2" />
                      </svg>
                      Share
                    </button>
                  </div>
                  <div className="d-flex justify-content-center mb-2 mt-1">
                    {vibe.photo ? (
                      <img
                        src={vibe.photo}
                        alt={vibe.name}
                        style={{
                          width: 62,
                          height: 62,
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#f7f8fa",
                          boxShadow: "0 1px 7px rgba(0,0,0,0.07)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 62,
                          height: 62,
                          borderRadius: "50%",
                          background: "#eaf2ff",
                          color: "#748cb3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 27,
                          fontWeight: 700,
                          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                        }}
                      >
                        {vibe.name ? vibe.name[0].toUpperCase() : "?"}
                      </div>
                    )}
                  </div>
                  <h5 className="fw-semibold text-center mb-1">{vibe.name}</h5>
                  <div
                    style={{
                      textAlign: "center",
                      color: "#6574fd",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 8,
                      letterSpacing: ".01em",
                    }}
                  >
                    {vibe.type
                      ? vibe.type.charAt(0).toUpperCase() + vibe.type.slice(1)
                      : ""}
                  </div>
                  <p
                    className="text-muted text-center mb-0"
                    style={{
                      fontSize: 14,
                      lineHeight: "1.4",
                      minHeight: 20,
                      maxHeight: 46,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {vibe.description || (
                      <span style={{ color: "#adb5bd" }}>No description.</span>
                    )}
                  </p>
                </div>
              ))}
            </AnimatePresence>

            {/* Share Modal */}
            {shareVibe && (
              <div
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
                onClick={closeShare}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.19 }}
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
                    onClick={closeShare}
                  />
                  <div className="mb-3">
                    <h5>Share your Vibe</h5>
                    <div className="text-muted" style={{ fontSize: 15 }}>
                      Отправь ссылку на свой вайб или покажи QR-код!
                    </div>
                  </div>
                  <input
                    className="form-control mb-2"
                    value={shareLink}
                    readOnly
                    style={{
                      fontSize: 15,
                      background: "#f5f7fb",
                      borderRadius: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.target.select();
                      handleCopy(shareLink);
                    }}
                  />
                  <button
                    className={`btn w-100 mb-2 ${
                      copied ? "btn-success" : "btn-outline-primary"
                    }`}
                    onClick={() => handleCopy(shareLink)}
                  >
                    {copied ? (
                      <>
                        <span className="me-2">&#10003;</span> Copied!
                      </>
                    ) : (
                      "Copy Link"
                    )}
                  </button>
                  <div className="text-center my-3">
                    <QRCodeCanvas
                      value={shareLink}
                      size={112}
                      bgColor="#ffffff"
                      fgColor="#4154ff"
                      level="M"
                      style={{ margin: "0 auto", display: "block" }}
                    />
                    <div style={{ fontSize: 12, color: "#888", marginTop: 7 }}>
                      Отсканируй, чтобы открыть Vibe
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
