import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Profile from "./components/profile/Profile";
import SignUp from "./components/forms/SignUp";
import StartAuth from "./components/forms/StartAuth";
import Header from "./components/common/Header";
import Review from "./components/pages/Review";
import Footer from "./components/common/Footer";
import About from "./components/pages/About";
import Home from "./components/pages/Home";
import BusinessVibeExample from "./components/vibes/BusinessVibeExample";
import ConferenceVibeExample from "./components/vibes/ConferenceVibeExample";
import CreateVibe from "./components/forms/CreateVibe";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonalVibeExample from "./components/vibes/PersonalVibeExample";
import Settings from "./components/profile/Settings";
import NarrowPage from "./components/common/NarrowPage";
import { Navigate } from "react-router-dom";
import UserMapPage from "./components/pages/UserMapPage";
import UserVibes from "./components/vibes/UserVibes";
import VibePage from "./components/vibes/VibePage";

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
        <Route path="/business-vibes" element={<BusinessVibeExample />} />
        <Route path="/conference-vibes" element={<ConferenceVibeExample />} />
        <Route path="/personal-vibes" element={<PersonalVibeExample />} />
        <Route path="/create-vibe" element={<CreateVibe />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/map" element={<UserMapPage />} />
        <Route path="/my-vibes" element={<UserVibes />} />
        <Route path="/vibes" element={<UserVibes />} />
        <Route path="/vibes/:id" element={<VibePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
