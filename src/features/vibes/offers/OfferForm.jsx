import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useGetOffer from "./useGetOffer";
import useCreateOffer from "./useCreateOffer";
import useUpdateOffer from "./useUpdateOffer";
import PageLayout from "../../../components/common/PageLayout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OfferForm() {
  const location = useLocation();
  const subscriberVibeId = location.state?.vibeId;
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] = useState("analytics");
  const [changedFields, setChangedFields] = useState({});
  const [viewsData, setViewsData] = useState([]);

  const token = localStorage.getItem("jwt");

  const { createOffer, loading } = useCreateOffer(token);
  const { offer } = useGetOffer(id, token);
  const { updateOffer } = useUpdateOffer(token);

  const navigate = useNavigate();

  // форматируем дату для input[type=datetime-local]
  const formatForInput = (date) => date.toISOString().slice(0, 16);

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [start, setStart] = useState(formatForInput(startOfDay));
  const [end, setEnd] = useState(formatForInput(endOfDay));

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "DYNAMIC",
    initialDiscount: 0,
    currentDiscount: 0,
    decreaseStep: 0,
    decreaseIntervalMinutes: 0,
    active: true,
    startTime: formatForInput(new Date()),
    endTime: formatForInput(new Date()),
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
          : formatForInput(new Date()),
        endTime: offer.endTime
          ? offer.endTime.slice(0, 16)
          : formatForInput(new Date()),
      });
      setChangedFields({});
    }
  }, [offer, isEditMode]);

  // --- загрузка аналитики ---
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!id) return;
      try {
        // формируем строку без использования new Date(...).toISOString()
        const url = `/api/v3/analytics/events?type=offer&id=${id}&start=${start}:00Z&end=${end}:59Z`;

        console.log("Fetching analytics with URL:", url);

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          console.log("Raw analytics data:", data);

          const chartData = data.map((ev) => ({
            date: new Date(ev.serverUploadTime).toLocaleDateString("en-US", {
              timeZone: "UTC",
              month: "short",
              day: "numeric",
            }),
            views: 1,
          }));

          const aggregated = chartData.reduce((acc, cur) => {
            const found = acc.find((x) => x.date === cur.date);
            if (found) {
              found.views += 1;
            } else {
              acc.push({ date: cur.date, views: cur.views });
            }
            return acc;
          }, []);

          aggregated.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          setViewsData(aggregated);
        } else {
          console.error("Bad response:", res.status);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, [id, start, end]);

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
      alert(t("Offer saved successfully"));
      navigate(-1);
    } else {
      alert(t("Error saving offer"));
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

            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "analytics" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  {t("Analytics")}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "edit" ? "active" : ""}`}
                  onClick={() => setActiveTab("edit")}
                >
                  {t("Edit Offer")}
                </button>
              </li>
            </ul>

            {activeTab === "analytics" && (
              <div>
                <h5>{t("Offer Analytics")}</h5>

                <div className="d-flex mb-3">
                  <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="form-control me-2"
                  />
                  <input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        label={{
                          value: "Date",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />

                      <YAxis
                        label={{
                          value: "Views",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip />
                      <Legend verticalAlign="top" align="right" />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#8884d8"
                        name="Views by customer"
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === "edit" && (
              <form onSubmit={handleSubmit}>
                {/* --- форма оффера --- */}
                <div className="row g-3">
                  <div className="col-12">
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

                  <div className="col-12">
                    <label className="form-label">{t("Description")}</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

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
                    <label className="form-label">
                      {t("Initial Discount")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="initialDiscount"
                      value={form.initialDiscount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mt-1">
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
                  <div className="col-md-6">
                    <label className="form-label">{t("Decrease Step")}</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      name="decreaseStep"
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
                      value={form.decreaseIntervalMinutes}
                      onChange={handleChange}
                    />
                    <label className="form-label">
                      {t("Current Discount")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="currentDiscount"
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
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
