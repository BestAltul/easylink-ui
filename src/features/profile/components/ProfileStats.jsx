import React from "react";
import "../styles/ProfileStats.css"

export default function ProfileStats({ vibesCount, friendsCount, streak, t }) {
  const stats = [
    {
      label: t("profile.vibes") || "Vibes",
      value: vibesCount,
      icon: "💫",
      color: "linear-gradient(135deg, #a770ef 0%, #f6d365 100%)",
    },
    {
      label: t("profile.friends") || "Friends",
      value: friendsCount,
      icon: "🧑‍🤝‍🧑", // Новая иконка друзей
      color: "linear-gradient(135deg, #4fd1ff 0%, #38a3fd 100%)", // Голубой градиент
    },
    {
      label: t("profile.streak") || "Streak",
      value: streak,
      icon: "🔥",
      color: "linear-gradient(135deg, #ff5858 0%, #f09819 100%)",
    },
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "1.3rem",
      marginBottom: "1.5rem",
      flexWrap: "wrap"
    }}>
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const streakClass = label.toLowerCase().includes("streak") ? "profile-stat-streak" : "";

  return (
    <div
      className={`profile-stat-card ${streakClass}`}
      tabIndex={0}
      style={{
        background: color,
        borderRadius: "1rem",
        boxShadow: "0 2px 8px rgba(120,90,180,0.07)",
        padding: "0.7rem 1.2rem",
        minWidth: 80,
        textAlign: "center",
        userSelect: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1d1d1d",
        position: "relative",
        zIndex: 1,
        margin: "0.4rem 0"
      }}
    >
      <div className="profile-stat-icon">{icon}</div>
      <div className="profile-stat-value">{value}</div>
      <div className="profile-stat-label">{label}</div>
    </div>
  );
}
