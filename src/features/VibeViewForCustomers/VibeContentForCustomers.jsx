import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../vibes/tools/Avatar";
import ExtraBlock from "../vibes/tools/HoursBlock";
import ContactButton from "../vibes/tools/ContactButton";
import { QRCodeCanvas } from "qrcode.react";
import SelectVibeModalWithLogic from "./SelectVibeModalWithLogic";
import { useTranslation } from "react-i18next";
import useGetOffersByVibeId from "../vibes/offers/useGetOfferByVibeId";
import OfferCard from "../vibes/offers/OfferCard";
import { trackEvent } from "@/services/amplitude";
import useItemsByVibeId from "../vibes/catalog/useItemByVibeId";

export default function VibeContentForCustomers({
  id,
  name,
  description,
  photo,
  contacts,
  type,
  extraBlocks,
  subscriberVibeId,
  publicCode,
}) {
  const [showModal, setShowModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [previewImage, setPreviewImage] = useState(null);
  const { t } = useTranslation();
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const location = useLocation();
  const offers = useGetOffersByVibeId(id);
  const { items, loading: itemsLoading } = useItemsByVibeId(id, token);

  const resolveServerUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/uploads/")) return path;
    return `/uploads/${path}`;
  };

  useEffect(() => {
    const normalizedSubscriberVibeId =
      subscriberVibeId === "null" || subscriberVibeId === ""
        ? null
        : subscriberVibeId;
    if (normalizedSubscriberVibeId) {
      setSubscribed(true);
    }
  }, [subscriberVibeId, id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("subscribe") === "true" && token) {
      setShowModal(true);
      params.delete("subscribe");
      params.delete("redirectTo");
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, token]);

  const handleOpenModal = () => {
    if (!token) {
      navigate(`/signin?redirectTo=/view/${id}&subscribe=true`);
      return;
    }
    setShowModal(true);
  };

  const handleSubscribed = () => {
    setSubscribed(true);
    setShowModal(false);
  };
  
  const shareUrl = id
    ? `${window.location.origin}/view/${id}`
    : window.location.href;

  const {
    showShare,
    copied,
    handleCopy,
    handleOpen,
    handleClose,
    ShareModalProps
  } = useShareModal(shareUrl, id, "VibeContentForCustomers");
  
  return (
    <div className="d-flex flex-column align-items-center w-100"> 
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <button
          className="btn btn-light shadow-sm"
          style={{ borderRadius: 99 }}
          onClick={() => {
            trackEvent("Vibe Share Button Clicked", {
              vibeId: id,
              name,
              publicCode,
              location: "VibePreview",
            });
            handleOpen();
          }}
        >
          <BsShareFill size={20} style={{ color: "#627bf7" }} />
        </button>
      </div>
      {type !== "PERSONAL" && (
        <>
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "main" ? "active" : ""}`}
                onClick={() => setActiveTab("main")}
                type="button"
                role="tab"
              >
                {t("Main")}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "offers" ? "active" : ""}`}
                onClick={() => setActiveTab("offers")}
                type="button"
                role="tab"
              >
                {t("Offers")}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "menu" ? "active" : ""}`}
                onClick={() => setActiveTab("menu")}
                type="button"
                role="tab"
              >
                {t("Menu")}
              </button>
            </li>
          </ul>

          <div className="tab-content w-100">
            {activeTab === "main" && (
              <div className="tab-pane fade show active">
                <Avatar name={name} photo={photo} />
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
                  className="p-3 mb-3 w-100 text-center"
                  style={{
                    background: "rgba(250, 250, 255, 0.92)",
                    border: "1.5px solid #eaeaf5",
                    borderRadius: 14,
                    fontSize: 16,
                    color: "#4d4d61",
                  }}
                >
                  {description || (
                    <span style={{ color: "#bbb" }}>
                      Description goes here...
                    </span>
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
                  {contacts?.length > 0 ? (
                    contacts.map((c, i) => (
                      <ContactButton
                        key={c.type + i}
                        type={c.type}
                        value={c.value}
                      />
                    ))
                  ) : (
                    <span className="text-muted" style={{ fontSize: 15 }}>
                      No contacts yet
                    </span>
                  )}
                </div>
                {extraBlocks?.length > 0 && (
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
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        Share QR code
                      </div>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={handleOpenModal}
                        disabled={subscribed}
                      >
                      {subscribed ? t("Subscribed") : t("Subscribe")}
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
                    >
                      QR
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "offers" && (
              <div className="tab-pane fade show active w-100">
                {offers.filter((o) => o.active).length > 0 ? (
                  <div className="d-grid gap-3">
                    {offers
                      .filter((o) => o.active)
                      .map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          onDoubleClick={() => {
                            trackEvent("Offer Clicked", {
                              offerId: offer.id,
                              origin: "vibe_view_offers",
                              ownerVibeId: id,
                              viewerVibeId: subscriberVibeId || null,
                              path: window.location.pathname,
                              ts: Date.now(),
                            });

                            navigate(`/view-offer-form/${offer.id}`, {
                              state: {
                                origin: "vibe_view_offers",
                                ownerVibeId: id,
                                viewerVibeId: subscriberVibeId || null,
                              },
                            });
                          }}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="alert alert-info text-center">
                    {t("No offers yet")}
                  </div>
                )}
              </div>
            )}

            {activeTab === "menu" && (
              <div className="tab-pane fade show active">
                <div className="w-100">
                  {itemsLoading ? (
                    <div className="text-center text-muted">Loading…</div>
                  ) : items.length === 0 ? (
                    <div className="alert alert-info text-center">No items</div>
                  ) : (
                    <div className="row row-cols-2 g-3">
                      {items.map((it) => {
                        const img = resolveServerUrl(it.imageUrl);
                        return (
                          <div className="col" key={it.id}>
                            <div
                              className="position-relative w-100"
                              style={{
                                borderRadius: 12,
                                overflow: "hidden",
                                background: "#f6f6f6",
                              }}
                              aria-label={it.title}
                            >
                              <div
                                onDoubleClick={() =>
                                  img && setPreviewImage(img)
                                }
                                style={{
                                  paddingTop: "100%",
                                  backgroundImage: img ? `url(${img})` : "none",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                  cursor: img ? "zoom-in" : "default",
                                  transition: "transform 0.2s ease",
                                }}
                              />
                              <div
                                className="position-absolute bottom-0 start-0 end-0 p-2"
                                style={{
                                  background:
                                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.6) 100%)",
                                  color: "#fff",
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                                title={it.title}
                              >
                                {it.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {type === "PERSONAL" && (
        <div className="w-100">
          <Avatar name={name} photo={photo} />
          <h3 className="mb-0" style={{ fontWeight: 700 }}>
            {name || "Your Name"}
          </h3>
          <div
            className="text-primary mb-2"
            style={{ fontWeight: 600, textTransform: "uppercase" }}
          >
            Personal
          </div>
          <div
            className="p-3 mb-3 w-100 text-center"
            style={{
              background: "rgba(250, 250, 255, 0.92)",
              border: "1.5px solid #eaeaf5",
              borderRadius: 14,
              fontSize: 16,
              color: "#4d4d61",
            }}
          >
            {description || (
              <span style={{ color: "#bbb" }}>Description goes here...</span>
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-center w-100">
            {contacts?.length > 0 ? (
              contacts.map((c, i) => (
                <ContactButton key={c.type + i} type={c.type} value={c.value} />
              ))
            ) : (
              <span className="text-muted" style={{ fontSize: 15 }}>
                No contacts yet
              </span>
            )}
          </div>
          {extraBlocks?.length > 0 && (
            <div className="w-100 mt-2">
              {extraBlocks.map((block, i) => (
                <ExtraBlock key={block.label + i} block={block} />
              ))}
            </div>
          )}
          <div className="mt-4 text-center d-grid gap-2">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <div>
                <QRCodeCanvas value={shareUrl} size={60} />
                <div style={{ fontSize: 12, color: "#aaa" }}>
                  {t("Share QR code", { defaultValue: "Share QR code" })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={previewImage}
            alt="preview"
            onDoubleClick={() => setPreviewImage(null)}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
}
