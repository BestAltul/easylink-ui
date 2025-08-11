import React, { useState, useEffect, useRef } from "react";
import { useFileUpload } from "../catalog/useFileUpload";

export default function CatalogCard({
  data = {},
  mode = "view",
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(data.title || "");
  const [description, setDescription] = useState(data.description || "");
  const [price, setPrice] = useState(
    typeof data.price === "number" ? String(data.price) : data.price || ""
  );
  const [image, setImage] = useState(data.image || data.imageUrl || "");
  const [file, setFile] = useState(null);
  const { uploadFile } = useFileUpload();

  const readOnly = mode === "view";

  const resolveServerUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/uploads/")) return path;
    return `/uploads/${path}`;
  };

  // what comes from the server/props
  const [serverSrc, setServerSrc] = useState(
    resolveServerUrl(data.imageUrl || data.image || "")
  );
  useEffect(() => {
    setServerSrc(resolveServerUrl(data.imageUrl || data.image || ""));
  }, [data.imageUrl, data.image]);

  // preview for a newly selected file
  const [previewSrc, setPreviewSrc] = useState("");
  useEffect(() => {
    if (!file) {
      setPreviewSrc("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // keep other fields in sync with props
  useEffect(() => setTitle(data.title || ""), [data.title]);
  useEffect(() => {
    setDescription(data.description || "");
    setPrice(
      typeof data.price === "number" ? String(data.price) : data.price || ""
    );
    setImage(data.image || data.imageUrl || "");
  }, [data.description, data.price, data.image, data.imageUrl]);

  const inputRef = useRef(null);

  const handleSave = async () => {
    let imageUrl = image;
    if (file) {
      try {
        imageUrl = await uploadFile(file); // returns "/uploads/xxx.jpg"
      } catch (err) {
        alert("Upload failed: " + err.message);
        return;
      }
    }
    onSave?.({
      title: title?.trim(),
      description: description?.trim(),
      price: price === "" ? null : Number(price),
      image: imageUrl,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile); // preview will update via useEffect above
  };

  const imgSrc = previewSrc || serverSrc; // prefer freshly chosen file

  return (
    <div
      className="card p-0 overflow-hidden"
      style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}
    >
      <div
        className="w-100 bg-light border-bottom"
        style={{
          aspectRatio: "1 / 1",
          overflow: "hidden",
          position: "relative",
          cursor: readOnly ? "default" : "pointer",
        }}
        onClick={() => {
          if (!readOnly) inputRef.current?.click();
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title || "Image"}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100 text-muted">
            No image
          </div>
        )}

        {!readOnly && (
          <input
            ref={inputRef}
            id="imageInput"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        )}
      </div>

      <div className="p-4">
        {/* fields */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={readOnly}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={readOnly}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center gap-2">
          <div style={{ width: 150 }}>
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              readOnly={readOnly}
            />
          </div>

          {!readOnly ? (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
