import React, { useState } from "react";

export default function CatalogCard({
  data = {},
  mode = "view", // "view" | "create" | "edit"
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(data.title || "");
  const [description, setDescription] = useState(data.description || "");
  const [price, setPrice] = useState(data.price || "");
  const [image, setImage] = useState(data.image || "");

  const handleSave = () => {
    if (onSave) {
      onSave({ title, description, price, image });
    }
  };

  // === READ-ONLY CARD ===
  if (mode === "view") {
    return (
      <div
        className="card"
        style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
      >
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="card-img-top"
            style={{ height: "250px", objectFit: "cover" }}
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{data.title}</h5>
          <p className="card-text">{data.description}</p>
          <p className="text-end fw-bold text-success">${data.price}</p>
        </div>
      </div>
    );
  }

  // === CREATE / EDIT FORM ===
  return (
    <div
      className="card p-0 overflow-hidden"
      style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
    >
      {/* IMAGE PREVIEW OR PLACEHOLDER */}
      <div
        className="w-100 bg-light border-bottom"
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("imageInput").click()}
      >
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100 text-muted">
            Click to upload image
          </div>
        )}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      {/* FORM FIELDS */}
      <div className="p-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center gap-2">
          <div style={{ width: "150px" }}>
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
