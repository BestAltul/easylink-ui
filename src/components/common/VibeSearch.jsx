import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VibeSearch() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError("");
    if (!/^\d{4,5}$/.test(code)) {
      setError("Please enter a valid 4–5 digit code");
      return;
    }
    try {
      const res = await axios.get(`/api/v3/vibes/visibility/${code}`);
      console.log("ew",res);
      navigate(`/view/${res.data.id}`);
    } catch (err) {
      setError("Vibe not found");
    }
  };

  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className="d-flex justify-content-end align-items-center mb-4"
      style={{ gap: 12, maxWidth: 300 }}
    >
      <input
        type="text"
        className="form-control"
        placeholder="Enter 4–5 digit Vibe code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}
