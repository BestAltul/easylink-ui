import React from "react";

export default function Loader() {
  return (
    <div className="d-flex flex-column align-items-center my-5">
      <div className="spinner-border text-primary" role="status"></div>
      <div className="mt-2">Loading Vibes...</div>
    </div>
  );
}
