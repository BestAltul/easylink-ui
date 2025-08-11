import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Sidebar from "./components/Sidebar";
import ProfileCards from "./components/ProfileCards";
import ProfileStats from "./components/ProfileStats";
import getProfileCards from "./utils/profileCardsConfig";
import useHasVibes from "../../components/common/hooks/useHasVibes";
import { useEffect } from "react";
import VibeSearch from "../../components/common/VibeSearch";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const vibesCount = 0;
  const profileCards = getProfileCards(t, navigate);

  const hasVibes = useHasVibes();

  // useEffect(() => {
  //   if (!isAuthenticated) return;
  //   if (hasVibes === false) {
  //     navigate("/create-vibe?redirectBackTo=/profile");
  //   }
  // }, [hasVibes, isAuthenticated, navigate]);
  return (
    <>
      {/* <Sidebar user={user} logout={logout} /> */}

      {/* <main className="py-5 px-4" style={{ marginLeft: "60px" }}> */}
      <main className="py-5 px-4">
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>
          <div className="text-center bg-light p-5 rounded shadow mb-5 animate-slideUp">
            <h2 className="mb-4">
              {t("profile.welcome", {
                name: user?.name || t("profile.user_name"),
              })}
            </h2>
            <p className="lead text-muted">{t("profile.dashboard")}</p>
          </div>
          <div className="d-flex justify-content-center mb-4">
            <VibeSearch />
          </div>
          {/* 
          <ProfileStats
            // vibesCount={vibesCount}
            friendsCount={user?.friendsCount ?? 0}
            streak={user?.streak ?? 0}
            t={t}
          /> */}

          <ProfileCards cards={profileCards} />
        </div>
      </main>
    </>
  );
}
