// ==============================
// File: src/features/vibes/business/BusinessVibeForm/index.jsx
// Orchestrator component: owns routing, tabs, data hooks, and modals.
// ==============================

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CONTACT_TYPES from "@/data/contactTypes";
import INFO_BLOCK_TYPES from "@/data/infoBlockTypes";
import iconMap from "@/data/contactIcons";

import useItemsByVibeId from "@/features/vibes/catalog/useItemByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/useGetOfferByVibeId";

import { useBusinessVibeForm } from "./useBusinessVibeForm";

import TabNav from "./ui/TabNav.jsx";
import MainTab from "./tabs/MainTab.jsx";
import MenuTab from "./tabs/MenuTab.jsx";
import OffersTab from "./tabs/OffersTab.jsx";

import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";
import InfoBlockTypeModal from "@/features/vibes/components/Modals/InfoBlockTypeModal";

export default function BusinessVibeForm({
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("business_form");

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
    photo,
    setPhoto,
    contacts,
    setContacts,
    extraBlocks,
    setExtraBlocks,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
    showModal,
    setShowModal,
    showBlockModal,
    setShowBlockModal,
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
          <TabNav
            active={activeTab}
            onChange={handleTabChange}
            tabs={[
              { id: "main", label: t("business.tabs.main", "Main") },
              { id: "menu", label: t("business.tabs.menu", "Menu") },
              { id: "offers", label: t("business.tabs.offers", "Offers") },
            ]}
          />

          {activeTab === "main" && (
            <MainTab
              t={t}
              mode={mode}
              loading={loading}
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              contacts={contacts}
              onContactChange={handleContactChange}
              onContactRemove={removeContact}
              onOpenContactPicker={() => setShowModal(true)} // ← здесь
              extraBlocks={extraBlocks}
              onBlockChange={handleBlockChange}
              onBlockRemove={removeBlock}
              onOpenBlockPicker={() => setShowBlockModal(true)} // ← и здесь
              photo={photo}
              setPhoto={setPhoto}
              onCancel={onCancel}
              CONTACT_TYPES={CONTACT_TYPES}
              INFO_BLOCK_TYPES={INFO_BLOCK_TYPES}
              iconMap={iconMap}
            />
          )}
          {activeTab === "menu" && (
            <MenuTab
              t={t}
              loadingItems={loadingItems}
              items={items}
              itemIds={itemIds}
              vibeId={initialData.id}
              onAddItem={() =>
                navigate("/catalog/new", {
                  state: {
                    vibeId: initialData.id,
                    returnTo: `/vibes/${initialData.id}`,
                    tab: "menu",
                  },
                })
              }
              onEditItem={(it) =>
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
            />
          )}

          {activeTab === "offers" && (
            <OffersTab
              t={t}
              offers={offers}
              vibeId={initialData.id}
              onAddOffer={() =>
                navigate("/offers/new", {
                  state: {
                    vibeId: initialData.id,
                    returnTo: `/vibes/${initialData.id}`,
                    tab: "offers",
                  },
                })
              }
              onEditOffer={(offer) =>
                navigate(`/offers/${offer.id}`, {
                  state: {
                    vibeId: initialData.id,
                    returnTo: `/vibes/${initialData.id}`,
                    tab: "offers",
                  },
                })
              }
            />
          )}
        </form>

        {showModal && (
          <ContactTypeModal
            contacts={contacts}
            onClose={() => setShowModal(false)}
            onSelect={(typeKey) => {
              addContact(typeKey);
              setShowModal(false);
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

              if (
                isHours &&
                extraBlocks.some(
                  (b) =>
                    String(b.type).toLowerCase() === "hours" ||
                    String(b.label).toLowerCase() === "hours"
                )
              ) {
                setShowBlockModal(false);
                return;
              }

              const initHours = {
                monday: "",
                tuesday: "",
                wednesday: "",
                thursday: "",
                friday: "",
                saturday: "",
                sunday: "",
              };

              setExtraBlocks((prev) => [
                ...prev,
                {
                  type: isHours ? "hours" : block.key,
                  label: block.label || (isHours ? "Hours" : "Custom"),
                  value: isHours ? initHours : "",
                  placeholder: isHours ? undefined : block.placeholder,
                },
              ]);
              setShowBlockModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
