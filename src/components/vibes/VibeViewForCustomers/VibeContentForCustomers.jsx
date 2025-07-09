import React, { useState, useEffect } from "react";
import Avatar from "../tools/Avatar";
import ExtraBlock from "../tools/ExtraBlock";
import ContactButton from "../tools/ContactButton";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import useSubscribe from "../VibeViewForCustomers/UseSubscribe";
import SelectVibeModalWithLogic from "../VibeViewForCustomers/SelectVibeModalWithLogic";
import useCheckSubscription from "../VibeViewForCustomers/UseCheckSubscription";

export default function VibeContentForCustomers({
  id,
  name,
  description,
  photoFile,
  contacts,
  type,
  extraBlocks,
  subscriberVibeId,
}) {
  const [showModal, setShowModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const token = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  // we will need that later on when try to work with status
  // const {
  //   subscribed,
  //   loading: subscriptionLoading,
  //   setSubscribed,
  // } = useCheckSubscription(subscriberVibeId, id);

  const handleOpenModal = () => {
    if (!token) {
      navigate(`/signin?redirectTo=/view/${id}&subscribe=true`);
      return;
    }
    setShowModal(true);
  };

  useEffect(() => {
    if (subscriberVibeId != null && id != null) {
      setSubscribed(true);
    }
  }, [subscriberVibeId, id]);

  const handleSubscribed = () => {
    setSubscribed(true);
    setShowModal(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("subscribe") === "true" && token) {
      setShowModal(true);

      params.delete("subscribe");
      params.delete("redirectTo");
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, token]);
  return (
    <div className="d-flex flex-column align-items-center">
      <Avatar name={name} photoFile={photoFile} />
      <h3 className="mb-0" style={{ fontWeight: 700 }}>
        {name || "Your Name"}
      </h3>
      <div
        className="text-primary mb-2"
        style={{ fontWeight: 600, textTransform: "uppercase" }}
      >
        {type?.charAt(0).toUpperCase() + type?.slice(1) || "Business"}
      </div>
      <div
        style={{
          background: "rgba(250, 250, 255, 0.92)",
          border: "1.5px solid #eaeaf5",
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 18,
          width: "100%",
          fontSize: 16,
          color: "#4d4d61",
          textAlign: "center",
        }}
      >
        {description || (
          <span style={{ color: "#bbb" }}>Description goes here...</span>
        )}
      </div>
      <div
        style={{
          width: "40%",
          height: 2,
          background: "linear-gradient(90deg,#d8dffa,#f6eaff 80%)",
          borderRadius: 99,
          marginBottom: 16,
        }}
      />
      <div className="d-flex flex-wrap gap-2 justify-content-center w-100">
        {contacts && contacts.length > 0 ? (
          contacts.map((c, i) => (
            <ContactButton key={c.type + i} type={c.type} value={c.value} />
          ))
        ) : (
          <span className="text-muted" style={{ fontSize: 15 }}>
            No contacts yet
          </span>
        )}
      </div>
      {extraBlocks && extraBlocks.length > 0 && (
        <div className="w-100 mt-2">
          {extraBlocks.map((block, i) => (
            <ExtraBlock key={block.label + i} block={block} />
          ))}
        </div>
      )}
      <div className="mt-4 text-center">
        {id ? (
          <>
            <QRCodeCanvas
              value={`${window.location.origin}/vibes/${id}`}
              size={60}
            />
            <div style={{ fontSize: 12, color: "#aaa" }}>Share QR code</div>
            <button
              className="btn btn-primary mt-3"
              onClick={handleOpenModal}
              disabled={subscribed}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>

            {showModal && (
              <SelectVibeModalWithLogic
                targetVibeId={id}
                onSubscribed={handleSubscribed}
                onCancel={() => setShowModal(false)}
              />
            )}
          </>
        ) : (
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
            title="QR code will appear after creating the Vibe"
          >
            QR
          </div>
        )}
      </div>
    </div>
  );
}
