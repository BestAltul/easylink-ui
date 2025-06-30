import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import avatarPlaceholder from "../../assets/avatarPlaceholder.png";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const sidebarRef = useRef();

  const profileCards = [
    {
      title: "❤️ My Vibes",
      text: "See the vibes you've already created!",
      background: "#fff8f0",
      hoverBackground: "#ffeedb",
      buttonText: "View My Vibes",
      buttonColor: "danger",
      onClick: () => navigate("/my-vibes"),
    },
    {
      title: "💙 Create New Vibe",
      text: "Add a new personal, business, or event Vibe to your account.",
      background: "#e3f2fd",
      hoverBackground: "#d0e5f7",
      buttonText: "Create Vibe",
      buttonColor: "primary",
      onClick: () => navigate("/create-vibe"),
    },
  ];

  const navItems = [
    { icon: "✏️", label: "Edit", route: "/edit-profile", variant: "outline-primary" },
    { icon: "⚙️", label: "Settings", route: "/settings", variant: "outline-secondary" },
    { icon: "🚪", label: "Logout", route: "/", variant: "outline-danger", isLogout: true },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        if (e.clientX < rect.right) {
          setSidebarHover(true);
        } else {
          setSidebarHover(false);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(.21,.7,.44,1.12); }

        .profile-card {
          transition: background 0.22s, box-shadow 0.22s, transform 0.17s;
          box-shadow: 0 .125rem .8rem rgba(110,110,140,0.09);
        }
        .profile-card:hover, .profile-card:focus-visible {
          box-shadow: 0 8px 28px 0 rgba(60,60,60,0.11), 0 1.5px 6px 0 rgba(60,60,60,0.08);
          transform: translateY(-6px) scale(1.018);
        }
        .profile-card:active {
          transform: scale(0.97);
        }
        @media (max-width: 850px) {
          .cards-row { flex-direction: column !important; align-items: center; }
        }
      `}</style>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="bg-white p-3 shadow-sm d-flex flex-column align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarHover ? "240px" : "60px",
          transition: "width 0.3s",
          overflow: "hidden",
          zIndex: 1000,
          boxShadow: "inset -1px 0 0 rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={user?.avatarUrl || avatarPlaceholder}
            alt="User avatar"
            className="rounded-circle mb-3 animate-slideUp"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: 10,
              height: 10,
              backgroundColor: "limegreen",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>

        {sidebarHover && (
          <div className="text-center mb-2 animate-slideUp">
            <h6 className="mb-0">{user?.name || "User Name"}</h6>
            <small className="text-muted d-block">{user?.email}</small>
          </div>
        )}

        <nav className="nav flex-column w-100 mt-auto">
          {navItems.map(({ icon, label, route, variant, isLogout }, idx) => (
            <button
              key={idx}
              className={`btn btn-${variant} mb-2 d-flex align-items-center justify-content-${
                sidebarHover ? "start" : "center"
              } animate-slideUp ${location.pathname === route ? "active" : ""}`}
              style={{ width: "100%" }}
              onClick={isLogout ? handleLogout : () => navigate(route)}
            >
              <span>{icon}</span>
              {sidebarHover && <span className="ms-2">{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="py-5 px-4" style={{ marginLeft: "60px" }}>
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>
          <div className="text-center bg-light p-5 rounded shadow mb-5 animate-slideUp">
            <h2 className="mb-4">Welcome back, {user?.name || "friend"}!</h2>
            <p className="lead text-muted">
              This is your personal dashboard. Manage your interests, hobbies,
              groups, and communities — and share what matters through different types of Vibes.
            </p>
          </div>
          <div className="d-flex gap-4 justify-content-center mb-4 animate-slideUp">
            <div className="bg-white rounded p-3 shadow-sm text-center" style={{ minWidth: 110 }}>
              <div style={{ fontSize: 26, fontWeight: 600 }}>{user?.vibesCount ?? 0}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>Vibes</div>
            </div>
            <div className="bg-white rounded p-3 shadow-sm text-center" style={{ minWidth: 110 }}>
              <div style={{ fontSize: 26, fontWeight: 600 }}>{user?.friendsCount ?? 0}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>Friends</div>
            </div>
            <div className="bg-white rounded p-3 shadow-sm text-center" style={{ minWidth: 110 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#6a1b9a" }}>🔥</div>
              <div className="text-muted" style={{ fontSize: 13 }}>Streak: {user?.streak ?? 0}d</div>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-4">
            <div
              className="profile-card p-4 rounded shadow text-center animate-slideUp"
              style={{
                backgroundColor: "#fafbfc",
                minWidth: 280,
                maxWidth: 400,
                cursor: "pointer",
              }}
              onClick={() => navigate("/map")}
              tabIndex={0}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && navigate("/map")}
            >
              <h5 className="mb-2" style={{ fontWeight: 600, fontSize: 22 }}>🗺️ Show My Map</h5>
              <p className="text-muted mb-3" style={{ minHeight: 38 }}>See your Vibes on the world map!</p>
              <button className="btn btn-outline-primary px-4 py-2" style={{ fontWeight: 500, fontSize: 17 }}>
                Open Map
              </button>
            </div>
          </div>
          {/* Cards row */}
          <div className="d-flex gap-4 justify-content-center cards-row">
            {profileCards.map((card, idx) => (
              <div
                key={idx}
                className="profile-card p-4 rounded shadow text-center animate-slideUp"
                tabIndex={0}
                style={{
                  backgroundColor: hoveredCard === idx ? card.hoverBackground : card.background,
                  minWidth: 280,
                  maxWidth: 350,
                  cursor: "pointer",
                  outline: "none",
                  marginBottom: 20,
                }}
                onClick={card.onClick}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && card.onClick()}
              >
                <h5 className="mb-2" style={{ fontWeight: 600, fontSize: 22 }}>{card.title}</h5>
                <p className="text-muted mb-4" style={{ minHeight: 38 }}>{card.text}</p>
                <button
                  className={`btn btn-${card.buttonColor} px-4 py-2`}
                  style={{ fontWeight: 500, fontSize: 17 }}
                  tabIndex={-1}
                  onClick={e => { e.stopPropagation(); card.onClick(); }}
                >
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
