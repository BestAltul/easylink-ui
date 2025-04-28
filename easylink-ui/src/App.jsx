import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import StartAuth from "./components/StartAuth";
import Header from "./components/Header";
import Review from "./components/Review";
import Footer from "./components/Footer";
import About from "./components/About";
import Home from "./components/Home";
import BusinessVibeExample from "./components/BusinessVibeExample";
import ConferenceVibeExample from "./components/ConferenceVibeExample";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonalVibeExample from "./components/PersonalVibeExample";

function App() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <ToastContainer />
      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          fontFamily: "sans-serif",
        }}
      >
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/signin"
            element={<StartAuth questions={questions} setQuestions={setQuestions} />}
          />
          <Route path="/review" element={<Review />} />
          <Route path="/business-vibes" element={<BusinessVibeExample />} />
          <Route path="/conference-vibes" element={<ConferenceVibeExample />} />
          <Route path="/personal-vibes" element={<PersonalVibeExample />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
