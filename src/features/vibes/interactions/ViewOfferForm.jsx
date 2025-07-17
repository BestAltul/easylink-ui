import React from "react";
import { useParams } from "react-router-dom";
import useGetOffer from "../interactions/useGetOffer";
import PageLayout from "../../../components/common/PageLayout";
import { useTranslation } from "react-i18next";

export default function ViewOfferView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const token = sessionStorage.getItem("jwt");

  const { offer } = useGetOffer(id, token);

  if (!offer) return <div>{t("Loading...")}</div>;

  return (
    <PageLayout title={t("Offer Details")}>
      <div className="container mt-5" style={{ maxWidth: 700 }}>
        <div
          className="card"
          style={{
            border: "1px solid #ccc",
            borderRadius: "1rem",
            boxShadow: "0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body">
            <h4 className="card-title mb-4">{t("Offer Details")}</h4>

            <div className="mb-3">
              <strong>{t("Title")}:</strong> {offer.title}
            </div>

            <div className="mb-3">
              <strong>{t("Description")}:</strong> {offer.description}
            </div>

            <div className="mb-3">
              <strong>{t("Discount Type")}:</strong> {offer.discountType}
            </div>

            <div className="mb-3">
              <strong>{t("Initial Discount")}:</strong> {offer.initialDiscount}
            </div>

            <div className="mb-3">
              <strong>{t("Current Discount")}:</strong> {offer.currentDiscount}
            </div>

            <div className="mb-3">
              <strong>{t("Start Time")}:</strong> {offer.startTime}
            </div>

            <div className="mb-3">
              <strong>{t("End Time")}:</strong> {offer.endTime}
            </div>

            <div className="mb-0">
              <strong>{t("Active")}:</strong>{" "}
              {offer.active ? t("Yes") : t("No")}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
