// OfferAddNew.jsx
import React, { useState } from "react";
import axios from "axios";

export default function OfferAddNew({ t = (s) => s }) {
  const vibeId = "some-vibe-id-or-uuid"; // Замени на актуальный ID

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "PERCENTAGE",
    initialDiscount: 0,
    currentDiscount: 0,
    decreaseStep: 0,
    decreaseIntervalMinutes: 0,
    active: true,
    startTime: new Date().toISOString().slice(0, 16), // формат datetime-local
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const token = sessionStorage.getItem("jwt");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  await axios.post(
    "/api/v3/offers",
  {
    ...form,
    vibeId,
    startTime: new Date(form.startTime).toISOString(),
    initialDiscount: Number(form.initialDiscount),
    currentDiscount: Number(form.currentDiscount),
    decreaseStep: Number(form.decreaseStep),
    decreaseIntervalMinutes: Number(form.decreaseIntervalMinutes),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert(t("Offer created successfully"));
    } catch (err) {
      console.error(err);
      alert(t("Error creating offer"));
    }
  };

  return (
    <div className="container mt-3">
      <h3>{t("Create Offer")}</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="mb-2">
          <label className="form-label">{t("Title")}</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">{t("Description")}</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">{t("Discount Type")}</label>
          <select
            className="form-select"
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
          >
            <option value="PERCENTAGE">PERCENTAGE</option>
            <option value="FIXED">FIXED</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">{t("Initial Discount")}</label>
          <input
            type="number"
            className="form-control"
            name="initialDiscount"
            value={form.initialDiscount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">{t("Current Discount")}</label>
          <input
            type="number"
            className="form-control"
            name="currentDiscount"
            value={form.currentDiscount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">{t("Decrease Step")}</label>
          <input
            type="number"
            className="form-control"
            name="decreaseStep"
            value={form.decreaseStep}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">{t("Decrease Interval (minutes)")}</label>
          <input
            type="number"
            className="form-control"
            name="decreaseIntervalMinutes"
            value={form.decreaseIntervalMinutes}
            onChange={handleChange}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          <label className="form-check-label">{t("Active")}</label>
        </div>

        <div className="mb-3">
          <label className="form-label">{t("Start Time")}</label>
          <input
            type="datetime-local"
            className="form-control"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          {t("Create Offer")}
        </button>
      </form>
    </div>
  );
}
