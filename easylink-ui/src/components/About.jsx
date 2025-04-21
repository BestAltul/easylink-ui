import React from "react";

export default function About() {
  return (
    <div className="container d-flex justify-content-center py-5">
      <div
        className="bg-white rounded-4 shadow p-4"
        style={{
          maxWidth: "700px",
          width: "100%",
          backgroundColor: "#f8f9fa", // мягкий серовато-белый
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <h2 className="mb-4 text-center">About EasyLink</h2>
        <p className="text-muted">
          <strong>Easy-link</strong> is a simple, fast service for sharing your
          contact information instantly. Store and share your email, phone
          number, social media profiles, and more — all in one place without any
          hassle.
        </p>
        <p className="text-muted">
          Our mission is to streamline the way people connect and stay in touch:
          no more paper business cards, scribbled notes, or endless copy‑paste.
          Just one click, and your details are ready to share.
        </p>
        <p className="text-muted">
          Thank you for choosing <strong>Easy-link</strong>. We’re here to make
          networking effortless!
        </p>
      </div>
    </div>
  );
}
