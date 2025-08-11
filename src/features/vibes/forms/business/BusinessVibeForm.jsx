import React, { useState, useEffect } from "react";
import CONTACT_TYPES from "../../../../data/contactTypes.js";
import VibePreview from "../../components/VibePreview.jsx";
import iconMap from "../../../../data/contactIcons.jsx";
import { FaGlobe } from "react-icons/fa";
import INFO_BLOCK_TYPES from "../../../../data/infoBlockTypes.js";
import HoursBlock from "../../../../components/InfoBlocks/HoursBlock.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useBusinessVibeForm } from "./useBusinessVibeForm";
import { useTranslation } from "react-i18next";
import useGetOffersByVibeId from "../../../vibes/offers/useGetOfferByVibeId.js";
import OfferCard from "../../../vibes/offers/OfferCard.jsx";
import useItemsByVibeId from "../../catalog/useItemByVibeId.js";

export default function BusinessVibeForm({
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "main");

  const token = localStorage.getItem("jwt");

  const offers = useGetOffersByVibeId(initialData.id, token);

  const {
    items,
    loading: loadingItems,
    reload: reloadItems,
  } = useItemsByVibeId(initialData?.id, token);

  const itemIds = items.map((x) => x.id);

  const {
    name,
    setName,
    description,
    setDescription,
    photoFile,
    setPhotoFile,
    contacts,
    setContacts,
    showModal,
    setShowModal,
    extraBlocks,
    setExtraBlocks,
    showBlockModal,
    setShowBlockModal,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  } = useBusinessVibeForm({ navigate, initialData, mode, onSave });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "menu") reloadItems?.();
  };

  useEffect(() => {
    if (location.state?.tab && location.state.tab !== activeTab) {
      handleTabChange(location.state.tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.tab]);

  return (
    <div
      className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>
        <form
          className="bg-light p-4 rounded-4 shadow"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          <ul className="nav nav-tabs mb-4 w-100">
            <li className="nav-item flex-fill text-center">
              <button
                type="button"
                className={`nav-link w-100 ${
                  activeTab === "main" ? "active" : ""
                }`}
                onClick={() => handleTabChange("main")}
              >
                Main
              </button>
            </li>
            <li className="nav-item flex-fill text-center">
              <button
                type="button"
                className={`nav-link w-100 ${
                  activeTab === "menu" ? "active" : ""
                }`}
                onClick={() => handleTabChange("menu")}
              >
                Menu
              </button>
            </li>
            <li className="nav-item flex-fill text-center">
              <button
                type="button"
                className={`nav-link w-100 ${
                  activeTab === "offers" ? "active" : ""
                }`}
                onClick={() => handleTabChange("offers")}
              >
                Offers
              </button>
            </li>
          </ul>

          {/* ======= MAIN TAB ======= */}
          {activeTab === "main" && (
            <>
              <div className="mb-3">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter business name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contacts</label>
                {(contacts?.length ?? 0) === 0 && (
                  <div className="mb-2 text-muted">No contacts added</div>
                )}
                {Array.isArray(contacts) &&
                  contacts.map((c, i) => (
                    <div className="input-group mb-2" key={i}>
                      <span
                        className="input-group-text"
                        title={
                          CONTACT_TYPES.find((t) => t.key === c.type)?.label
                        }
                      >
                        {iconMap[c.type] || <FaGlobe />}
                      </span>
                      <input
                        type={
                          c.type === "email"
                            ? "email"
                            : c.type === "website"
                            ? "url"
                            : "text"
                        }
                        className="form-control"
                        placeholder={
                          CONTACT_TYPES.find((t) => t.key === c.type)?.label
                        }
                        value={c.value}
                        onChange={(e) => handleContactChange(i, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeContact(i)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                <button
                  type="button"
                  className="btn btn-outline-primary w-100"
                  onClick={() => setShowModal(true)}
                  disabled={contacts.length >= CONTACT_TYPES.length}
                >
                  Add Contact
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">Additional Info</label>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mb-2"
                  onClick={() => setShowBlockModal(true)}
                >
                  Add Info Block
                </button>
                {extraBlocks.map((block, i) => {
                  if (block.type === "hours") {
                    return (
                      <HoursBlock
                        key={i}
                        value={block.value}
                        onChange={(val) => handleBlockChange(i, val)}
                        onRemove={() => removeBlock(i)}
                      />
                    );
                  }
                  return (
                    <div className="input-group mb-2" key={i}>
                      <span
                        className="input-group-text"
                        style={{ minWidth: 80 }}
                      >
                        {block.label}
                      </span>
                      <input
                        type={block.type === "birthday" ? "date" : "text"}
                        className="form-control"
                        placeholder={
                          INFO_BLOCK_TYPES.find((b) => b.key === block.type)
                            ?.placeholder || "Enter info"
                        }
                        value={
                          typeof block.value === "string" ? block.value : ""
                        }
                        onChange={(e) => handleBlockChange(i, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeBlock(i)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mb-3">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                />
                <div className="form-text">
                  You can upload your business photo
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                {mode === "edit" && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? mode === "edit"
                      ? "Saving..."
                      : "Creating..."
                    : mode === "edit"
                    ? "Save"
                    : "Create"}
                </button>
              </div>
            </>
          )}

          {/* ======= MENU TAB======= */}
          {activeTab === "menu" && (
            <div className="d-flex flex-column gap-3 mb-3 w-100">
              <div className="d-flex justify-content-start gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate("/catalog/new", {
                      state: {
                        vibeId: initialData.id,
                        returnTo: `/vibes/${initialData.id}`,
                        tab: "menu",
                      },
                    })
                  }
                >
                  Add item
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled
                >
                  Delete
                </button>
              </div>

              {loadingItems ? (
                <div>Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-muted">No items yet</div>
              ) : (
                <div className="row row-cols-2 g-3">
                  {items.map((it) => (
                    <div className="col" key={it.id}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/catalog/${it.id}/edit`, {
                            state: {
                              vibeId: initialData.id,
                              returnTo: `/vibes/${initialData.id}`,
                              tab: "menu",
                              itemIds,
                              currentIndex: itemIds.indexOf(it.id),
                            },
                          })
                        }
                        className="p-0 border-0 bg-transparent w-100"
                        style={{ cursor: "pointer" }}
                        title="Edit item"
                      >
                        <div className="card overflow-hidden shadow-sm">
                          <div className="ratio ratio-1x1">
                            {it.imageUrl ? (
                              <img
                                src={it.imageUrl}
                                alt={it.title || "Item"}
                                className="w-100 h-100 object-fit-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center bg-light">
                                <span className="text-muted small">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>

                          <div
                            className="card-img-overlay d-flex align-items-end p-2"
                            style={{ pointerEvents: "none" }}
                          >
                            <div className="w-100 px-2 py-1 rounded-3 bg-dark bg-opacity-50 text-white text-truncate">
                              {it.title || "Untitled"}
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======= OFFERS TAB ======= */}
          {activeTab === "offers" && (
            <div className="w-100">
              <div className="d-flex justify-content-start gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate("/offers/new", {
                      state: {
                        vibeId: initialData.id,
                        returnTo: `/vibes/${initialData.id}`,
                        tab: "offers",
                      },
                    })
                  }
                >
                  + Add Offer
                </button>
              </div>

              <div className="d-grid gap-3">
                {offers.length > 0 &&
                  offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onEdit={(offer) =>
                        navigate(`/offers/${offer.id}`, {
                          state: {
                            vibeId: initialData.id,
                            returnTo: `/vibes/${initialData.id}`,
                            tab: "offers",
                          },
                        })
                      }
                    />
                  ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
