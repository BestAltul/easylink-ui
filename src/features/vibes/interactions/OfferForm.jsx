// OfferAddNew.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGetOffer from "./useGetOffer";
import useCreateOffer from "./useCreateOffer";
import useUpdateOffer from "./useUpdateOffer";
import PageLayout from "../../../components/common/PageLayout";



export default function OfferForm() {
  const location = useLocation();
  const subscriberVibeId = location.state?.vibeId;
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [changedFields, setChangedFields] = useState({});

  const token = sessionStorage.getItem("jwt");

  const { createOffer, loading } = useCreateOffer(token);

  const { offer } = useGetOffer(id, token);
  const { updateOffer } = useUpdateOffer(token);

  console.log("offer we get", offer);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "DYNAMIC",
    initialDiscount: 0,
    currentDiscount: 0,
    decreaseStep: 0,
    decreaseIntervalMinutes: 0,
    active: true,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (isEditMode && offer) {
      setForm({
        title: offer.title || "",
        description: offer.description || "",
        discountType: offer.discountType || "DYNAMIC",
        initialDiscount: offer.initialDiscount ?? 0,
        currentDiscount: offer.currentDiscount ?? 0,
        decreaseStep: offer.decreaseStep ?? 0,
        decreaseIntervalMinutes: offer.decreaseIntervalMinutes ?? 0,
        active: offer.active ?? true,
        startTime: offer.startTime
          ? offer.startTime.slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        endTime: offer.endTime
          ? offer.endTime.slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });

      setChangedFields({});
    }
  }, [offer, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setChangedFields((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let success = false;

    if (isEditMode) {
      success = await updateOffer(id, changedFields, token);
    } else {
      success = await createOffer(form, subscriberVibeId);
    }

    if (success) {
      alert(t("Offer created successfully"));
    } else {
      alert(t("Error creating offer"));
    }
  };

  return (
    <PageLayout title={t("Offer Details")}>
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4 text-center">
              {isEditMode ? t("Edit Offer") : t("Create Offer")}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">{t("Title")}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder={t("Enter offer title")}
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">{t("Description")}</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    placeholder={t("Enter offer description")}
                    value={form.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Discount Type & Initial Discount на одной линии */}
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <label className="form-label">{t("Discount Type")}</label>
                  <select
                    className="form-select"
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                  >
                    <option value="PERCENTAGE">{t("Percentage")}</option>
                    <option value="FIXED">{t("Fixed Amount")}</option>
                    <option value="DYNAMIC">{t("Dynamic")}</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">{t("Initial Discount")}</label>
                  <input
                    type="number"
                    className="form-control"
                    name="initialDiscount"
                    placeholder="0"
                    value={form.initialDiscount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Две колонки: даты и остальные скидочные поля */}
              <div className="row g-3 mt-1">
                {/* Левая колонка */}
                <div className="col-md-6">
                  <label className="form-label">{t("Start Time")}</label>
                  <input
                    type="datetime-local"
                    className="form-control mb-3"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                  />

                  <label className="form-label">{t("End Time")}</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                  />
                </div>

                {/* Правая колонка */}
                <div className="col-md-6">
                  <label className="form-label">{t("Decrease Step")}</label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    name="decreaseStep"
                    placeholder="0"
                    value={form.decreaseStep}
                    onChange={handleChange}
                  />

                  <label className="form-label">
                    {t("Decrease Interval (minutes)")}
                  </label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    name="decreaseIntervalMinutes"
                    placeholder="0"
                    value={form.decreaseIntervalMinutes}
                    onChange={handleChange}
                  />

                  <label className="form-label">{t("Current Discount")}</label>
                  <input
                    type="number"
                    className="form-control"
                    name="currentDiscount"
                    placeholder="0"
                    value={form.currentDiscount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  id="activeCheck"
                />
                <label className="form-check-label" htmlFor="activeCheck">
                  {t("Active")}
                </label>
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg">
                  {isEditMode ? t("Save Changes") : t("Create Offer")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
