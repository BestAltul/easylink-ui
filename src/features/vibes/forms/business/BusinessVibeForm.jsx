// ==============================
// File: src/features/vibes/business/BusinessVibeForm/index.jsx
// Orchestrator component: owns routing, tabs, data hooks, and modals.
// ==============================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useItemsByVibeId from "@/features/vibes/catalog/useItemByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/useGetOfferByVibeId";
import OfferCard from "@/features/vibes/offers/OfferCard";

import { useBusinessVibeForm } from "./useBusinessVibeForm";
import MenuTab from "./tabs/MenuTab.jsx";

import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";
import InfoBlockTypeModal from "@/features/vibes/components/Modals/InfoBlockTypeModal";
import { VibePreviewPane } from "@/components/common/preview";
import VibeContent from "@/features/vibes/tools/VibeContent";
import BusinessTabsInCard from "./BusinessTabsInCard";

// helper: UUID v1-5
const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export default function BusinessVibeForm({
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("business_form");

  // локальные состояния для inline-редактирования
  const [typeIndex, setTypeIndex] = React.useState(null);
  const [refocusIndex, setRefocusIndex] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showBlockModal, setShowBlockModal] = React.useState(false);

  const token = localStorage.getItem("jwt");
  const vibeId = initialData?.id;
  const safeVibeId = isUUID(vibeId) ? vibeId : undefined; 
  const ownerActionsEnabled = !!safeVibeId;
  const offers = useGetOffersByVibeId(safeVibeId, token);
  const {
    items,
    loading: loadingItems,
    reload: reloadItems,
  } = useItemsByVibeId(safeVibeId, token);
  const itemIds = Array.isArray(items) ? items.map((x) => x.id) : [];

  const {
    name, setName,
    description, setDescription,
    photoFile, setPhotoFile,
    contacts, setContacts,
    extraBlocks, setExtraBlocks,
    loading,
    handleContactChange, removeContact,
    handleBlockChange, removeBlock,
    handleSubmit,
  } = useBusinessVibeForm({ navigate, initialData, mode, onSave });

  const readTabFromSearch = () => {
    const qp = new URLSearchParams(location.search);
    const tab = qp.get("tab");
    return (tab === "main" || tab === "offers" || tab === "menu") ? tab : "main";
  };
  const [activeTab, setActiveTab] = React.useState(readTabFromSearch());
  const setTab = (tab) => {
    setActiveTab(tab);
    if (tab === "menu") reloadItems?.();
  };

  return (
    <div
      className="d-flex flex-column gap-4 align-items-center w-100"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <div className="d-flex gap-2 w-100" style={{ maxWidth: 420 }}>
        {mode === "edit" && (
          <button
            type="button"
            className="btn btn-outline-secondary w-50"
            onClick={onCancel}
            disabled={loading}
          >
            {t("cancel")}
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? (mode === "edit" ? t("saving") : t("creating"))
            : (mode === "edit" ? t("save_button") : t("create_button"))}
        </button>
      </div>

      <form className="w-100" onSubmit={(e) => e.preventDefault()}>
        <VibePreviewPane
          id={safeVibeId}                   
          ownerActionsEnabled={ownerActionsEnabled}  
          name={name}
          description={description}
          photoFile={photoFile}
          contacts={contacts}
          extraBlocks={extraBlocks}
          type="BUSINESS"
          editMode={true}                   
          onChangeName={setName}
          onChangeDescription={setDescription}
          onChangePhotoFile={setPhotoFile}
          resumeEditAt={refocusIndex}
          onOpenContactPicker={(idx) => {
            setTypeIndex(Number.isInteger(idx) ? idx : null);
            setShowModal(true);
          }}
          onRemoveContact={(idx) => removeContact(idx)}
          onChangeContactValue={(idx, val) => handleContactChange(idx, val)}
          onBlockChange={(i, v) => handleBlockChange(i, v)}
          onBlockRemove={(i) => removeBlock(i)}
          onOpenBlockPicker={() => setShowBlockModal(true)}
          cardBody={
            <BusinessTabsInCard
              t={t}
              activeTab={activeTab}
              onTabChange={setTab}
              renderMain={() => (
                <VibeContent
                  id={safeVibeId}
                  name={name}
                  description={description}
                  photoFile={photoFile}
                  contacts={contacts}
                  type="BUSINESS"
                  extraBlocks={extraBlocks}
                  editMode={true}
                  onChangeName={setName}
                  onChangeDescription={setDescription}
                  onChangePhotoFile={setPhotoFile}
                  resumeEditAt={refocusIndex}
                  onOpenContactPicker={(idx) => {
                    setTypeIndex(Number.isInteger(idx) ? idx : null);
                    setShowModal(true);
                  }}
                  onRemoveContact={(idx) => removeContact(idx)}
                  onChangeContactValue={(idx, val) => handleContactChange(idx, val)}
                  onBlockChange={(i, v) => handleBlockChange(i, v)}
                  onBlockRemove={(i) => removeBlock(i)}
                  onOpenBlockPicker={() => setShowBlockModal(true)}
                />
              )}
              renderOffers={() => (
                <>
                  {offers?.length ? (
                    <div className="d-grid gap-3">
                      {offers.map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          onDoubleClick={() =>
                            navigate(`/offers/${offer.id}`, {
                              state: { vibeId: safeVibeId, returnTo: `/vibes/${safeVibeId}`, tab: "offers" },
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
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() =>
                        navigate("/offers/new", {
                          state: { vibeId: safeVibeId, returnTo: `/vibes/${safeVibeId}`, tab: "offers" },
                        })
                      }
                      disabled={!ownerActionsEnabled} 
                    >
                      + {t("Add Offer", { defaultValue: "Add Offer" })}
                    </button>
                  </div>
                </>
              )}
              renderMenu={() => (
                <MenuTab
                  t={t}
                  loadingItems={loadingItems}
                  items={items}
                  itemIds={itemIds}
                  vibeId={safeVibeId}
                  onAddItem={() =>
                    navigate("/catalog/new", {
                      state: { vibeId: safeVibeId, returnTo: `/vibes/${safeVibeId}`, tab: "menu" },
                    })
                  }
                  onEditItem={(it) =>
                    navigate(`/catalog/${it.id}/edit`, {
                      state: {
                        vibeId: safeVibeId,
                        returnTo: `/vibes/${safeVibeId}`,
                        tab: "menu",
                        itemIds,
                        currentIndex: itemIds.indexOf(it.id),
                      },
                    })
                  }
                />
              )}
            />
          }
        />
      </form>

      {/* modals */}
      {showModal && (
        <ContactTypeModal
          contacts={contacts}
          onClose={() => { setShowModal(false); setTypeIndex(null); }}
          onSelect={(typeKey) => {
            if (typeIndex != null) {
              setContacts(prev => {
                const updated = [...prev];
                updated[typeIndex] = { ...updated[typeIndex], type: typeKey };
                return updated;
              });
              setRefocusIndex({ index: typeIndex, nonce: Date.now() });
              Promise.resolve().then(() => setRefocusIndex(null));
            } else {
              const newIndex = contacts.length;
              setContacts(prev => [...prev, { type: typeKey, value: "" }]);
              setRefocusIndex({ index: newIndex, nonce: Date.now() });
              Promise.resolve().then(() => setRefocusIndex(null));
            }
            setShowModal(false);
            setTypeIndex(null);
          }}
        />
      )}

      {showBlockModal && (
        <InfoBlockTypeModal
          extraBlocks={extraBlocks}
          onClose={() => setShowBlockModal(false)}
          onSelect={(block) => {
            const isHours =
              String(block.key).toLowerCase() === "hours" ||
              String(block.label).toLowerCase() === "hours";

            if (isHours && extraBlocks.some(b =>
              String(b.type).toLowerCase() === "hours" ||
              String(b.label).toLowerCase() === "hours"
            )) {
              setShowBlockModal(false);
              return;
            }

            const initHours = {
              monday: "", tuesday: "", wednesday: "",
              thursday: "", friday: "", saturday: "", sunday: ""
            };

            setExtraBlocks(prev => ([
              ...prev,
              {
                type: isHours ? "hours" : block.key,
                label: block.label || (isHours ? "Hours" : "Custom"),
                value: isHours ? initHours : "",
                placeholder: isHours ? undefined : block.placeholder,
              },
            ]));
            setShowBlockModal(false);
          }}
        />
      )}
    </div>
  );
}
