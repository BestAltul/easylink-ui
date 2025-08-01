import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import VibeCard from "./VibeCard";

export default function VibesList({ vibes, onDelete, onShare }) {
  return (
    <div className="position-relative" style={{ minHeight: 340 }}>
      <div
        className="d-flex flex-wrap justify-content-center"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          gap: "24px 20px", 
        }}
      >
        <AnimatePresence>
          {vibes.map((vibe) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.23 }}
              style={{ flex: "0 1 260px" }} 
            >
              <VibeCard
                vibe={vibe}
                onDelete={() => onDelete(vibe.id)}
                onShare={() => onShare(vibe)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
