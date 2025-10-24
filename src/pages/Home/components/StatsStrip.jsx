import React from "react";
import { motion } from "framer-motion";

export default function StatsStrip({ refEl, animate, fadeUp, satisfaction, views, t }) {
  return (
    <motion.div
      ref={refEl}
      className="home__stats glass mt-5"
      variants={fadeUp}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      aria-label={t("social_proof")}
    >
      <div>
        <span className="stat">{satisfaction}%</span>{" "}
        {t("stat_satisfaction", "say setup is under 2 minutes")}
      </div>
      <div>
        <span className="stat">{views.toLocaleString()}+</span>{" "}
        {t("stat_views", "Vibe views tracked")}
      </div>
      <div>
        <span className="stat">A/B</span>{" "}
        {t("stat_privacy", "privacy-first by design")}
      </div>
    </motion.div>
  );
}
