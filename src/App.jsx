import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./shared/ui/Header";
import Footer from "./shared/ui/Footer";
import NarrowPage from "./components/common/NarrowPage";
import InteractionsHome from "./features/vibes/interactions/InteractionsHome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";

// ===== Features/Pages imports =====
import Profile from "./features/profile/Profile";
import SignUp from "./features/auth/SignUp";
import StartAuth from "./features/auth/StartAuth";
import Home from "./pages/Home";
import About from "./pages/About";
import Review from "./features/review/Review";
import CreateVibe from "./features/vibes/forms/CreateVibe";
import UserVibes from "./features/vibes/UserVibes";
import VibePage from "./features/vibes/VibePage";
import VibeView from "./features/vibes/VibeView/VibeView";
import InteractionsPage from "./features/vibes/interactions/InteractionsPage";
import InteractionsPageBasic from "./features/vibes/interactions/MyCircle";
import OfferForm from "./features/vibes/offers/OfferForm";
import ViewOfferForm from "./features/vibes/offers/ViewOfferForm";
import OfferViewAnalytics from "@/analytics/OfferViewAnalytics";
import OfferTableUsers from "./features/vibes/offers/OffersTableForUsers";
import MyCircle from "./features/vibes/interactions/MyCircle";
import MyOffers from "./features/vibes/interactions/MyOffers";

import EmailVerificationSent from "@/features/auth/EmailVerificationSent";
import EmailVerified from "@/features/auth/EmailVerified";

import CatalogForm from "./features/vibes/catalog/catalogForm";

import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Ads from "./pages/legal/Ads";
import "./i18n";

function App() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <NarrowPage>
              <SignUp />
            </NarrowPage>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/signin"
          element={
            <NarrowPage>
              <StartAuth questions={questions} setQuestions={setQuestions} />
            </NarrowPage>
          }
        />
        <Route path="/login" element={<Navigate to="/signin" />} />
        <Route path="/review" element={<Review />} />
        <Route path="/create-vibe" element={<CreateVibe />} />
        <Route path="/my-vibes" element={<UserVibes />} />
        <Route path="/vibes" element={<UserVibes />} />
        <Route path="/vibes/:id" element={<VibePage />} />
        <Route path="/vibes/:id/interactions" element={<InteractionsHome />} />
        <Route path="/vibes/:id/interactions/circle" element={<MyCircle />} />
        <Route path="/vibes/:id/interactions/offers" element={<MyOffers />} />
        <Route
          path="/vibes/:id/interactions-basic"
          element={<InteractionsPageBasic />}
        />
        <Route path="/view/:id" element={<VibeView />} />
        <Route path="/offers/new" element={<OfferForm />} />
        <Route path="/offers/:id" element={<OfferForm />} />
        <Route path="/offer-table-users" element={<OfferTableUsers />} />
        <Route
          path="/view-offer-form/:id"
          element={
            <>
              <OfferViewAnalytics />
              <ViewOfferForm />
            </>
          }
        />
        <Route
          path="/email-verification-sent"
          element={<EmailVerificationSent />}
        />
        <Route path="/email-verified" element={<EmailVerified />} />

        <Route path="/catalog/new" element={<CatalogForm />} />
        <Route path="/catalog/:id/edit" element={<CatalogForm />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/ads" element={<Ads />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
