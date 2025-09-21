import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
// import Sidebar from "./components/Sidebar";
import ProfileCards from "./components/ProfileCards";
// import ProfileStats from "./components/ProfileStats";
import getProfileCards from "./utils/profileCardsConfig";
import useHasVibes from "../../components/common/hooks/useHasVibes";
import VibeSearch from "../../components/common/VibeSearch";

export default function Profile() {
  const navigate = useNavigate();
  const { user /*, logout, isAuthenticated*/ } = useAuth();

  const { t } = useTranslation("profile");

  const profileCards = getProfileCards(t, navigate);
  const hasVibes = useHasVibes(); 

  return (
    <>
      {/* <Sidebar user={user} logout={logout} /> */}
      <main className="py-5 px-4">
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>
          <div className="text-center bg-light p-5 rounded shadow mb-5 animate-slideUp">
            <h2 className="mb-4">
              {t("welcome")}{" "}
            </h2>
            <p className="lead text-muted">{t("dashboard")}</p>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <VibeSearch />
          </div>

          {/* <ProfileStats friendsCount={user?.friendsCount ?? 0} streak={user?.streak ?? 0} /> */}
          <ProfileCards cards={profileCards} />
        </div>
      </main>
    </>
  );
}
