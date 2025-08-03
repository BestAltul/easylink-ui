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

  // console.log("useGetOfferByVibeId");

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
                onClick={() => setActiveTab("main")}
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
                onClick={() => setActiveTab("menu")}
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
                onClick={() => setActiveTab("offers")}
              >
                Offers
              </button>
            </li>
          </ul>

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

          {activeTab === "menu" && (
            <div className="alert alert-info">
              Add your menu information here.
            </div>
          )}

          {activeTab === "offers" && (
            <div className="w-100">
              <div className="d-flex justify-content-start gap-2 mb-3">
                <button
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

                {/* <button className="btn btn-outline-danger" disabled>
                  Disable
                </button> */}
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

          {activeTab === "menu" && (
            <div className="alert alert-info">
              Add your menu information here.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
