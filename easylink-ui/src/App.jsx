import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import StartAuth from "./components/StartAuth";
import CheckAnswers from "./components/CheckAnswers";
import Header from "./components/Header";
import Review from "./components/Review";
import Footer from "./components/Footer";
import About from "./components/About";
import Home from "./components/Home"; 

function App() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  return (
    <>
      <Header />
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
            element={
              <>
                <StartAuth questions={questions} setQuestions={setQuestions} />
                <CheckAnswers questions={questions} />
              </>
            }
          />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
