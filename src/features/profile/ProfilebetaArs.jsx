// Updated Profile.jsx with additional "views", "contacts", and "Travel Memories" elements

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import avatarPlaceholder from "../../assets/avatarPlaceholder.png";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredVibe, setHoveredVibe] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const sidebarRef = useRef();
  
  const profileCards = [
    { title: "❤️ My Vibes", text: "See the vibes you've already created!", background: "#fff8f0", hoverBackground: "#ffeedb", buttonText: "View My Vibes", buttonColor: "danger", onClick: () => navigate("/my-vibes") },
    { title: "💙 Create New Vibe", text: "Add a new personal, business, or event Vibe to your account.", background: "#e3f2fd", hoverBackground: "#d0e5f7", buttonText: "Create Vibe", buttonColor: "primary", onClick: () => navigate("/create-vibe") },
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
  // const userVibes = [
  //   { name: "UX Portfolio", type: "Business", link: "/vibe/ux" },
  //   { name: "Travel Memories", type: "Personal", link: "/vibe/travel" },
  // ];

  // const stats = [
  //   { title: "Vibes Created", value: userVibes.length },
  //   { title: "Views", value: 42 },
  //   { title: "Contacts Shared", value: 9 },
  // ];

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
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        }
      `}</style>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="bg-white p-3 shadow-sm d-flex flex-column align-items-center"
        style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: sidebarHover ? '240px' : '60px', transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 1000, boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.1)' }}
      >
        <div style={{ position: 'relative' }}>
          <img src={user?.avatarUrl || avatarPlaceholder} alt="User avatar" className="rounded-circle mb-3 animate-slideUp" style={{ width: 50, height: 50, objectFit: 'cover' }} />
          <span style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 10,
            height: 10,
            backgroundColor: 'limegreen',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        </div>

        {sidebarHover && (
          <div className="text-center mb-2 animate-slideUp">
            <h6 className="mb-0">{user?.name || 'User Name'}</h6>
            <small className="text-muted d-block">{user?.email}</small>
          </div>
        )}

        <nav className="nav flex-column w-100 mt-auto">
          {navItems.map(({ icon, label, route, variant, isLogout }, idx) => (
            <button
              key={idx}
              className={`btn btn-${variant} mb-2 d-flex align-items-center justify-content-${sidebarHover ? 'start' : 'center'} animate-slideUp ${location.pathname === route ? 'active' : ''}`}
              style={{ width: '100%' }}
              onClick={isLogout ? handleLogout : () => navigate(route)}
            >
              <span>{icon}</span>
              {sidebarHover && <span className="ms-2">{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="py-5 px-4" style={{ marginLeft: '60px' }}>
        <div className="mx-auto" style={{ maxWidth: '1200px' }}>
          <div className="text-center bg-light p-5 rounded shadow mb-5 animate-slideUp">
            <h2 className="mb-4">Welcome back, {user?.name || 'friend'}!</h2>
            <p className="lead text-muted">
              This is your personal dashboard. Manage your interests, hobbies,
              groups, and communities — and share what matters through different types of Vibes.
            </p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate('/map')}
          >
            Show My Map
          </button>
          {/* Stats */}
          {/* <div className="d-flex justify-content-around mb-5">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <h5>{s.value}</h5>
                <small className="text-muted">{s.title}</small>
              </div>
            ))}
          </div> */}

          {/* User Vibes */}
          {/* {userVibes.length > 0 && (
            <div className="mb-5">
              <h4 className="mb-3">Your Vibes</h4>
              <div className="d-flex flex-wrap gap-3">
                {userVibes.map((vibe, i) => (
                  <div key={i} onClick={() => navigate(vibe.link)} className="p-3 shadow-sm rounded bg-white" style={{ cursor: "pointer", minWidth: 200 }}>
                    <h6 className="mb-1">{vibe.name}</h6>
                    <span className="badge bg-secondary">{vibe.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          <div className="row g-4 justify-content-center">
            {profileCards.map((card, idx) => (
              <div key={idx} className="col-md-4 col-lg-3">
                <div
                  className="p-4 rounded shadow text-center animate-slideUp h-100"
                  onClick={card.onClick}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    backgroundColor: hoveredCard === idx ? card.hoverBackground : card.background,
                    boxShadow: hoveredCard === idx ? '0 10px 20px rgba(0,0,0,0.15)' : '0 .125rem .25rem rgba(0,0,0,.075)',
                    transform: hoveredCard === idx ? 'translateY(-5px)' : 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <h5>{card.title}</h5>
                  <p className="text-muted mb-3">{card.text}</p>
                  <button className={`btn btn-${card.buttonColor} px-4`}>{card.buttonText}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
