import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";
import avatarPlaceholder from "../assets/avatarPlaceholder.png";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredVibe, setHoveredVibe] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [mode, setMode] = useState("feedback"); // "feedback" or "chat"
  const [feedbackText, setFeedbackText] = useState("");
  const [messages, setMessages] = useState([
    { from: "agent", text: "Hello! How can I help you today?" }
  ]);
  const [inputText, setInputText] = useState("");

  const vibeOptions = [
    { title: "💼 Business", text: "Share your professional profile, work-related info and business vibes.", type: "business" },
    { title: "🧍 Personal", text: "Highlight your interests, hobbies, and personal vibe stories.", type: "personal" },
    { title: "🎯 Other", text: "Store and share everything else — events, projects, creative ideas.", type: "other" },
  ];
  const profileCards = [
    { title: "❤️ My Vibes", text: "See the vibes you've already created!", background: "#fff8f0", hoverBackground: "#ffeedb", buttonText: "View My Vibes", buttonColor: "danger", onClick: () => navigate("/my-vibes") },
    { title: "💙 Create New Vibe", text: "Add a new personal, business, or event Vibe to your account.", background: "#e3f2fd", hoverBackground: "#d0e5f7", buttonText: "Create Vibe", buttonColor: "primary", onClick: () => navigate("/create-vibe") },
  ];
  const navItems = [
    { icon: "✏️", label: "Edit", route: "/edit-profile", variant: "outline-primary" },
    { icon: "⚙️", label: "Settings", route: "/settings", variant: "outline-secondary" },
    { icon: "🚪", label: "Logout", route: "/logout", variant: "outline-danger" },
  ];

  useEffect(() => {
    if (mode === "chat" && messages[messages.length - 1].from === "user") {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, { from: "agent", text: "Thanks for your message! We'll get back to you shortly." }]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, mode]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: inputText }]);
    setInputText("");
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedbackText);
    alert("Thank you for your feedback!");
    setFeedbackText("");
    setWidgetOpen(false);
  };

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Sidebar */}
      <aside
        className="bg-white p-3 shadow-sm d-flex flex-column align-items-center"
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        style={{
          position: 'fixed', top: 0, left: 0,
          height: '100vh', width: sidebarHover ? '260px' : '60px',
          transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 1000,
          justifyContent: sidebarHover ? 'flex-start' : 'center'
        }}
      >
        <img
          src={user?.avatarUrl || avatarPlaceholder}
          alt="User avatar"
          className="rounded-circle mb-3 animate-slideUp"
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
        {sidebarHover && (
          <div className="text-center mb-4 animate-slideUp">
            <h6 className="mb-0">{user?.name || 'User Name'}</h6>
            <small className="text-muted d-block">{user?.email}</small>
          </div>
        )}
        <nav className="nav flex-column w-100 mt-auto">
          {navItems.map(({ icon, label, route, variant }, idx) => (
            <button
              key={idx}
              className={`btn btn-${variant} mb-2 d-flex align-items-center justify-content-${sidebarHover ? 'start' : 'center'} animate-slideUp`}
              style={{ width: '100%' }}
              onClick={() => navigate(route)}
            >
              <span>{icon}</span>
              {sidebarHover && <span className="ms-2">{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="container py-5" style={{ marginLeft: '60px' }}>
        <div className="text-center bg-light p-5 rounded shadow mb-5 animate-slideUp">
          <h2 className="mb-4">Welcome to your Vibe account!</h2>
          <p className="lead text-muted">
            This is your personal dashboard. Manage your interests, hobbies,
            groups, and communities — and share what matters through different
            types of Vibes.
          </p>
        </div>

        {/* Vibe Options */}
        <div className="d-flex justify-content-between text-center mb-5">
          {vibeOptions.map((opt, idx) => (
            <div
              key={opt.type}
              className="flex-fill mx-2 p-4 shadow-sm rounded animate-slideUp"
              onClick={() => navigate(`/${opt.type}-vibes`)}
              onMouseEnter={() => setHoveredVibe(idx)}
              onMouseLeave={() => setHoveredVibe(null)}
              style={{
                backgroundColor: hoveredVibe === idx ? '#f9fafb' : '#f4f6f9',
                boxShadow: hoveredVibe === idx ? '0 10px 20px rgba(0,0,0,0.15)' : '0 .125rem .25rem rgba(0,0,0,.075)',
                transform: hoveredVibe === idx ? 'translateY(-8px)' : 'none',
                opacity: hoveredVibe === idx ? 1 : 0.9,
                transition: 'all 0.3s ease',
                minWidth: 0,
              }}
            >
              <h5 className="mb-2" style={{ fontSize: '1.2rem' }}>{opt.title}</h5>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>{opt.text}</p>
            </div>
          ))}
        </div>

        {/* Profile Cards */}
        <div className="d-flex flex-wrap justify-content-center">
          {profileCards.map((card, idx) => (
            <div
              key={idx}
              className="m-3 p-4 rounded shadow text-center animate-slideUp"
              onClick={card.onClick}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                width: 280,
                backgroundColor: hoveredCard === idx ? card.hoverBackground : card.background,
                boxShadow: hoveredCard === idx ? '0 10px 20px rgba(0,0,0,0.15)' : '0 .125rem .25rem rgba(0,0,0,.075)',
                transform: hoveredCard === idx ? 'translateY(-5px)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <h5 style={{ fontSize: '1.2rem' }}>{card.title}</h5>
              <p className="text-muted mb-3">{card.text}</p>
              <button className={`btn btn-${card.buttonColor} px-4`}>{card.buttonText}</button>
            </div>
          ))}
        </div>
      </main>

      {/* Support Widget */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1100 }}>
        {!widgetOpen && (
          <button
            className="btn btn-info rounded-circle animate-slideUp"
            style={{ width: 60, height: 60, fontSize: '1.5rem' }}
            onClick={() => setWidgetOpen(true)}
            aria-label="Open support"
          >💬</button>
        )}
        {widgetOpen && (
          <div className="card shadow animate-slideUp d-flex flex-column" style={{ width: 400, height: 600 }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <button className={`btn btn-sm ${mode==='feedback'? 'btn-primary':'btn-light'} me-3`} onClick={()=>setMode('feedback')}>Feedback</button>
                <button className={`btn btn-sm ${mode==='chat'? 'btn-primary':'btn-light'}`} onClick={()=>setMode('chat')}>Chat</button>
              </div>
              <button className="btn btn-sm btn-light" onClick={()=>setWidgetOpen(false)}>&times;</button>
            </div>
            {mode==='feedback' ? (
              <div className="p-3 flex-grow-1 overflow-auto animate-slideUp">
                <form onSubmit={submitFeedback} className="d-flex flex-column h-100">
                  <div className="form-group flex-grow-1">
                    <textarea
                      className="form-control animate-slideUp"
                      rows={6}
                      value={feedbackText}
                      onChange={e=>setFeedbackText(e.target.value)}
                      placeholder="Your feedback..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Send Feedback</button>
                </form>
              </div>
            ) : (
              <>
                <div className="p-3 flex-grow-1 overflow-auto animate-slideUp">
                  {messages.map((msg,i)=>(
                    <div key={i} className={`p-2 mb-2 rounded ${msg.from==='agent'? 'bg-light text-left':'bg-primary text-white text-right'}`}>{msg.text}</div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="card-footer bg-white">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a message..."
                      value={inputText}
                      onChange={e=>setInputText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
