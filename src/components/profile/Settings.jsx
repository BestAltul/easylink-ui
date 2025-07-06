import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);
  const [theme, setTheme] = useState("system");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const value = e.target.value;
    setTheme(value);
    localStorage.setItem("theme", value);
  };

  const handleDeleteAccount = () => setShowModal(true);

  const confirmDelete = async () => {
    setDeleting(true);

    try {
      const token = sessionStorage.getItem("jwt");
      const res = await fetch("/api/v1/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setDeleting(false);
        setDeleteSuccess(true);
        setShowModal(false);

        // Удаляем токен и редиректим пользователя
        sessionStorage.removeItem("jwt");
        setTimeout(() => {
          setDeleteSuccess(false);
          navigate("/goodbye"); // Или "/" если нет прощальной страницы
        }, 1500);
      } else {
        throw new Error("Server returned an error.");
      }
    } catch (err) {
      setDeleting(false);
      alert("Error deleting account: " + err.message);
    }
  };

  return (
    <div className="container py-5 animate-fadein" style={{ maxWidth: 700 }}>
      {/* Back + Title */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <button
            onClick={() => navigate("/profile")}
            className="btn btn-outline-secondary d-inline-flex align-items-center animate-slideUp"
            style={{
              gap: "0.5rem",
              borderRadius: "30px",
              padding: "0.4rem 1rem",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>←</span>
            <span>Back</span>
          </button>
        </div>
        <h2 className="text-center animate-slideUp">⚙️ Settings</h2>
      </div>

      {/* Privacy */}
      <div className="p-4 bg-light rounded-4 shadow-sm mb-4 animate-slideUp" style={{ animationDelay: ".06s" }}>
        <h5 className="mb-3">🔐 Privacy</h5>
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="privateMode"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label className="form-check-label" htmlFor="privateMode">
            Make my profile private
          </label>
        </div>
        <small className="text-muted ms-1">
          Only your friends can see your profile details.
        </small>
      </div>

      {/* Appearance */}
      <div className="p-4 bg-light rounded-4 shadow-sm mb-4 animate-slideUp" style={{ animationDelay: ".10s" }}>
        <h5 className="mb-3">🎨 Appearance</h5>
        <select
          className="form-select mb-2"
          value={theme}
          onChange={handleThemeChange}
          style={{ maxWidth: 240, display: "inline-block" }}
        >
          <option value="system">System default</option>
          <option value="light">Light mode</option>
          <option value="dark">Dark mode</option>
        </select>
        <br />
        <small className="text-muted ms-1">Your theme preference is saved locally.</small>
      </div>

      {/* Notifications */}
      <div className="p-4 bg-light rounded-4 shadow-sm mb-4 animate-slideUp" style={{ animationDelay: ".16s" }}>
        <h5 className="mb-3">🔔 Notifications</h5>
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="emailNotif"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label className="form-check-label" htmlFor="emailNotif">
            Receive emails
          </label>
        </div>
        <small className="text-muted ms-1">Updates and important info will come to your email.</small>
        <div className="form-check form-switch mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="smsNotif"
            checked={smsNotif}
            onChange={(e) => setSmsNotif(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label className="form-check-label" htmlFor="smsNotif">
            Receive SMS alerts
          </label>
        </div>
        <small className="text-muted ms-1">Enable for urgent alerts (like account changes).</small>
      </div>

      {/* Danger zone */}
      <div className="p-4 border border-danger rounded-4 animate-slideUp" style={{ animationDelay: ".24s", background: "#fff7f7" }}>
        <h5 className="text-danger mb-3">❌ Danger Zone</h5>
        <button
          className="btn btn-outline-danger"
          onClick={handleDeleteAccount}
          disabled={deleting || deleteSuccess}
          style={{ minWidth: 180, fontWeight: 500 }}
        >
          {deleting ? "Deleting..." : deleteSuccess ? "Account deleted!" : "Delete My Account"}
        </button>
        <div className="text-muted mt-2" style={{ fontSize: "0.92em" }}>
          Warning: This action is irreversible.
        </div>
      </div>

      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-content-custom animate-fadein">
            <h5 className="mb-3 text-danger">Delete your account?</h5>
            <div className="mb-3">Are you sure you want to permanently delete your account?</div>
            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local styles */}
      <style>{`
        .animate-fadein { animation: fadein .7s; }
        .animate-slideUp { animation: slideUp .55s cubic-bezier(.21,.76,.32,1.15); }
        @keyframes fadein { from {opacity:0} to {opacity:1} }
        @keyframes slideUp { from {transform:translateY(30px); opacity:0} to {transform:translateY(0); opacity:1} }
        .modal-backdrop-custom {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(50,50,70,0.14); z-index: 5000;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-content-custom {
          background: #fff; border-radius: 1.2em; padding: 2.2em 2em 1.4em;
          max-width: 370px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
