import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // для анимации
import UserMap from "../maps/UserMap";
import VibeDetailInfo from "../vibes/VibeDetailInfo";

export default function UserMapPage() {
  const [selectedVibe, setSelectedVibe] = useState(null);

  // Демо-объект для знакомства
  const demoVibe = {
    name: "Sample Vibe",
    description: "Just a demo vibe so you can see how it works. 😊",
    contacts: [],
    // ... остальные нужные поля
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
      minHeight: 540,
      marginTop: 30,
      gap: 36,
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Левая колонка: карта */}
      <div style={{ flex: "0 0 660px", maxWidth: 680 }}>
        <UserMap onVibeSelect={setSelectedVibe} selectedVibe={selectedVibe} />
      </div>
      {/* Правая колонка: подробная инфа */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        style={{
          width: 380,
          height: 460,
          background: "#fafdff",
          borderRadius: 20,
          boxShadow: selectedVibe
            ? "0 8px 32px #bdd0fb60, 0 2px 16px #e9eafe"
            : "0 2px 16px #e9eafe",
          marginLeft: 32,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          position: "relative",
          overflowY: "auto",
          scrollBehavior: "smooth",
          border: selectedVibe ? "2px solid #7b91fa" : "2px solid #fafdff",
          transition: "border 0.2s"
        }}
      >
        {/* UX надпись сверху */}
        <div style={{
          position: "absolute",
          left: 0, top: 0,
          width: "100%",
          height: 28,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          background: "linear-gradient(90deg,#e2eaff 70%,#fafdff 100%)",
          fontWeight: 700,
          fontSize: 15.5,
          color: "#627bf7",
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
          boxShadow: "0 1px 0 #e9eafe"
        }}>
          Vibe Details
        </div>
        <div style={{ marginTop: 36, flex: 1 }}>
          <AnimatePresence mode="wait">
            {!selectedVibe ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.33 }}
                style={{
                  color: "#aaa",
                  textAlign: "center",
                  marginTop: 82,
                  fontSize: 17,
                  lineHeight: 1.6,
                  userSelect: "none"
                }}
              >
                <span role="img" aria-label="map-pin" style={{ fontSize: 48, filter: "drop-shadow(0 2px 4px #dde8fa)" }}>📍</span>
                <div style={{ marginTop: 16 }}>
                  <b>Tap a marker on the map</b>
                  <div style={{ fontSize: 15, marginTop: 6, color: "#b4b7cb" }}>
                    Curious? Click on any vibe marker to see more info.<br />
                    <span style={{ color: "#8ba6f7" }}>Or try a demo 👇</span>
                  </div>
                  <button
                    style={{
                      marginTop: 18,
                      padding: "8px 18px",
                      background: "linear-gradient(90deg, #7b91fa 40%, #b2c5fd 100%)",
                      border: "none",
                      borderRadius: 10,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 2px 10px #e5e9fc80",
                      transition: "background 0.18s"
                    }}
                    onClick={() => setSelectedVibe(demoVibe)}
                  >
                    Show demo vibe
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vibe-details"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.35 }}
                style={{ height: "100%" }}
              >
                <VibeDetailInfo vibe={selectedVibe} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
