import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VibePreview from "../../vibes/VibePreview";
import iconMap from "../../../data/contactIcons.jsx";
import { FaGlobe } from "react-icons/fa";

// Allowed contacts for event cards
const ALLOWED_CONTACTS = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "website", label: "Website" },
];

// Info blocks for event cards
const EVENT_INFO_BLOCKS = [
  { key: "date", label: "Event Date", placeholder: "YYYY-MM-DD" },
  { key: "location", label: "Location", placeholder: "Venue / City" },
  { key: "organizer", label: "Organizer", placeholder: "Organizer Name" },
];

export default function EventVibeForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [extraBlocks, setExtraBlocks] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const navigate = useNavigate();

  const handlePhotoChange = (e) => setPhotoFile(e.target.files[0]);

  // Contacts
  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts([...contacts, { type, value: "" }]);
    setShowModal(false);
  };
  const handleContactChange = (i, val) => {
    const updated = [...contacts];
    updated[i].value = val;
    setContacts(updated);
  };
  const removeContact = (i) => {
    const updated = [...contacts];
    updated.splice(i, 1);
    setContacts(updated);
  };

  // Info blocks
  const handleBlockChange = (i, val) => {
    const updated = [...extraBlocks];
    updated[i].value = val;
    setExtraBlocks(updated);
  };
  const removeBlock = (i) => {
    const updated = [...extraBlocks];
    updated.splice(i, 1);
    setExtraBlocks(updated);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsDTO = [
      { type: "name", value: name, label: "Name" },
      ...contacts.map((c) => ({
        type: c.type,
        value: c.value,
        label: c.type,
      })),
      ...extraBlocks.map((b) => ({
        type: b.type,
        value: b.value,
        label: b.label || null,
      })),
    ];

    const dto = {
      name,
      description,
      type: "EVENT",
      fieldsDTO,
    };

    try {
      const token = sessionStorage.getItem("jwt");
      const response = await fetch("/api/v3/vibes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error("Failed to create Vibe");
      alert("Event Vibe created!");
      navigate("/my-vibes");
    } catch (err) {
      console.error("Error:", err);
      alert("Error creating Vibe");
    }
  };

  return (
    <div
      className="d-flex flex-column flex-lg-row gap-5 align-items-start justify-content-center w-100"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      {/* Form */}
      <div style={{ flex: "1 1 500px", maxWidth: 540, minWidth: 320 }}>
        <form
          className="bg-light p-4 rounded-4 shadow"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          {/* Event Name */}
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          {/* Contacts */}
          <div className="mb-3">
            <label className="form-label">Contacts</label>
            {contacts.length === 0 && (
              <div className="mb-2 text-muted" style={{ fontSize: 15 }}>
                No contacts added yet.
              </div>
            )}
            {contacts.map((c, i) => (
              <div className="input-group mb-2" key={i}>
                <span
                  className="input-group-text"
                  title={ALLOWED_CONTACTS.find((t) => t.key === c.type)?.label}
                >
                  {iconMap[c.type] || <FaGlobe />}
                </span>
                <input
                  type={c.type === "email" ? "email" : "text"}
                  className="form-control"
                  placeholder={
                    ALLOWED_CONTACTS.find((t) => t.key === c.type)?.label
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
              disabled={contacts.length >= ALLOWED_CONTACTS.length}
            >
              + Add Contact
            </button>
          </div>
          {/* Info Blocks */}
          <div className="mb-3">
            <label className="form-label">Event Details</label>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mb-2"
              onClick={() => setShowBlockModal(true)}
            >
              + Add Info Block
            </button>
            {extraBlocks.map((block, i) => (
              <div className="input-group mb-2" key={i}>
                <span className="input-group-text" style={{ minWidth: 80 }}>
                  {block.label}
                </span>
                <input
                  type={block.type === "date" ? "date" : "text"}
                  className="form-control"
                  placeholder={block.placeholder || ""}
                  value={block.value}
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
            ))}
          </div>
          {/* Photo */}
          <div className="mb-3">
            <label className="form-label">Event Photo / Poster</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <div className="form-text">PNG or JPG, up to 2MB</div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Create Event Card
          </button>
        </form>
        {/* Modal for Contact Types */}
        {showModal && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{
              background: "rgba(0,0,0,0.25)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add contact type</h5>
                </div>
                <div className="modal-body d-flex flex-wrap gap-2">
                  {ALLOWED_CONTACTS.map((type) => (
                    <button
                      key={type.key}
                      className="btn btn-light"
                      style={{
                        width: 110,
                        height: 70,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => addContact(type.key)}
                      disabled={contacts.some((c) => c.type === type.key)}
                    >
                      <span style={{ fontSize: 28 }}>
                        {iconMap[type.key] || <FaGlobe />}
                      </span>
                      <span style={{ fontSize: 14 }}>{type.label}</span>
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Info Blocks */}
        {showBlockModal && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{
              background: "rgba(0,0,0,0.22)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1010,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Info Block</h5>
                </div>
                <div className="modal-body d-flex flex-wrap gap-2">
                  {EVENT_INFO_BLOCKS.map((block) => (
                    <button
                      key={block.key}
                      className="btn btn-light"
                      style={{
                        minWidth: 110,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setExtraBlocks([
                          ...extraBlocks,
                          {
                            type: block.key,
                            label: block.label,
                            value: "",
                            placeholder: block.placeholder,
                          },
                        ]);
                        setShowBlockModal(false);
                      }}
                      disabled={extraBlocks.some((b) => b.type === block.key)}
                    >
                      {block.label}
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowBlockModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Preview */}
      <div
        style={{
          flex: "1 1 400px",
          minWidth: 320,
          maxWidth: 480,
        }}
        className="d-none d-lg-block"
      >
        <div className="sticky-top" style={{ top: 90, zIndex: 1 }}>
          <VibePreview
            name={name}
            description={description}
            photoFile={photoFile}
            contacts={contacts}
            type="EVENT"
            extraBlocks={extraBlocks}
          />
        </div>
      </div>
    </div>
  );
}
