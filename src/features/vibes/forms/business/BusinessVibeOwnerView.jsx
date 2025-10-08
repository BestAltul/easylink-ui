import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import { BsShareFill } from "react-icons/bs";

import { trackEvent } from "@/services/amplitude";

import Avatar from "@/features/vibes/tools/Avatar";
import HoursBlock from "@/features/vibes/tools/HoursBlock";
import ContactButton from "@/features/vibes/tools/ContactButton";
import ShareModal from "@/features/vibes/tools/ShareModal";
import useShareModal from "@/components/common/hooks/useShareModal";
import MenuTab from "@/features/vibes/forms/business/tabs/MenuTab";

import useGetOffersByVibeId from "@/features/vibes/offers/useGetOfferByVibeId";
import OfferCard from "@/features/vibes/offers/OfferCard";

import useItemsByVibeId from "@/features/vibes/catalog/useItemByVibeId";
import useVisibilityToggle from "@/features/vibes/useVisibilityToggle.jsx";

export default function BusinessVibeOwnerView({
  id,
  name,
  description,
  photoFile,
  contacts,
  type = "BUSINESS",
  extraBlocks,
  publicCode,
  visible = false,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwt");

  const { items, itemsLoading } = useItemsByVibeId(id, token);
  const [activeTab, setActiveTab] = useState("main");
  const offers = useGetOffersByVibeId(id, token);
  const itemIds = Array.isArray(items) ? items.map(i => i.id) : [];

  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };
  console.debug("[OwnerView] visible:", visible, "publicCode:", publicCode);

  const shareUrl = id
    ? `${window.location.origin}/view/${id}`
    : window.location.href;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t("Copied!", { defaultValue: "Copied!" }));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(t("Copied!", { defaultValue: "Copied!" }));
    }
  };
  const [vibeVisible, code, visibilityButton] = useVisibilityToggle(
    id,
    visible,
    publicCode
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: name || t("My business card", { defaultValue: "My business card" }),
          text: description || "",
          url: shareUrl,
        });
      } else {
        await copyToClipboard(shareUrl);
      }
    } catch {}
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "offers" || tab === "menu" || tab === "main") {
      setActiveTab(tab);
    }
  }, [location.search]);

  // ===== Share button + modal (just as in VibePreview) =====
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
      <div className="position-relative w-100" style={{ minHeight: 0 }}>
        Share button
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
              setShowShare(true);
            }}
          >
            <BsShareFill size={20} style={{ color: "#627bf7" }} />
          </button>
        </div>
      </div>

      {/* Visibility + Share code (same as в VibeContent) */}
      <div className="mb-3 w-100 px-3">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            {visibilityButton}
            {vibeVisible && code && (
              <div
                className="text-primary fw-bold d-flex align-items-center"
                style={{ fontSize: "1.15rem" }}
                onClick={() => {
                  navigator.clipboard
                    .writeText(String(code))
                    .then(() => showToast(t("Copied!", { defaultValue: "Copied!" })));
                }}
                title={t("Click to copy", { defaultValue: "Click to copy" })}
                role="button"
              >
                <span style={{ marginRight: 4 }}>
                  {t("vibe_content:share_code_label", "Share code")}
                </span>
                <strong>{code}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* Tabs */}
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
        {/* MAIN */}
        {activeTab === "main" && (
          <div className="tab-pane fade show active">
            <Avatar name={name} photoFile={photoFile} />
            <h3 className="mb-0" style={{ fontWeight: 700 }}>
              {name || t("Your Name", { defaultValue: "Your Name" })}
            </h3>
            <div
              className="text-primary mb-2"
              style={{ fontWeight: 600, textTransform: "uppercase" }}
            >
              {type || "Business"}
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
                  {t("Description goes here...", { defaultValue: "Description goes here..." })}
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
              {contacts?.length ? (
                contacts.map((c, i) => (
                  <ContactButton key={c.type + i} type={c.type} value={c.value} />
                ))
              ) : (
                <span className="text-muted" style={{ fontSize: 15 }}>
                  {t("No contacts yet", { defaultValue: "No contacts yet" })}
                </span>
              )}
            </div>

            {extraBlocks?.length > 0 && (
              <div className="w-100 mt-2">
                {extraBlocks.map((block, i) => (
                  <HoursBlock key={block.label + i} block={block} />
                ))}
              </div>
            )}

            {/* Share / QR for owner */}
            <div className="mt-4 text-center d-grid gap-2">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <div>
                  <QRCodeCanvas value={shareUrl} size={60} />
                  <div style={{ fontSize: 12, color: "#aaa" }}>
                    {t("Share QR code", { defaultValue: "Share QR code" })}
                  </div>
                </div>
              </div>

              {toast && (
                <div
                  className="alert alert-success py-1 px-2 mt-2"
                  style={{ width: "fit-content", margin: "0 auto" }}
                >
                  {toast}
                </div>
              )}
            </div>
          </div>
        )}

        {/* OFFERS */}
        {activeTab === "offers" && (
          <div className="tab-pane fade show active w-100">
            {offers?.length > 0 ? (
              <div className="d-grid gap-3">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onDoubleClick={() =>
                      navigate(`/offers/${offer.id}`, {
                        state: {
                          vibeId: id,
                          returnTo: `/vibes/${id}`,
                          tab: "offers",
                        },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="alert alert-info text-center">
                {t("No offers yet", { defaultValue: "No offers yet" })}
              </div>
            )}

            <div className="text-center mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  navigate("/offers/new", {
                    state: { vibeId: id, returnTo: `/vibes/${id}`, tab: "offers" },
                  })
                }
              >
                + {t("Add Offer", { defaultValue: "Add Offer" })}
              </button>
            </div>
          </div>
        )}

        {/* MENU */}
        {activeTab === "menu" && (
          <div className="tab-pane fade show active">
            <MenuTab
              t={t}
              loadingItems={itemsLoading}
              items={items}
              itemIds={itemIds}
              vibeId={id}
              onAddItem={() =>
                navigate("/catalog/new", {
                  state: {
                    vibeId: id,
                    returnTo: `/vibes/${id}`,
                    tab: "menu",
                  },
                })
              }
              onEditItem={(it) =>
                navigate(`/catalog/${it.id}/edit`, {
                  state: {
                    vibeId: id,
                    returnTo: `/vibes/${id}`,
                    tab: "menu",
                    itemIds,
                    currentIndex: itemIds.indexOf(it.id),
                  },
                })
              }
            />
          </div>
        )}
      </div>
      {/* Share modal */}
      <ShareModal {...ShareModalProps} />
    </div>
  );
}
