import { useState } from "react";
import "./App.css";
import SignUp from "./components/SignUp";
import StartAuth from "./components/StartAuth";
import CheckAnswers from "./components/CheckAnswers";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>EasyLink Auth</h1>

      {page === "home" && (
        <div>
          <button
            onClick={() => setPage("signup")}
            style={{ padding: "1rem", margin: "1rem", width: "100%" }}
          >
            Sign Up
          </button>
          <button
            onClick={() => setPage("signin")}
            style={{ padding: "1rem", margin: "1rem", width: "100%" }}
          >
            Sign In
          </button>
        </div>
      )}

      {page === "signup" && <SignUp onBack={() => setPage("home")} />}
      {page === "signin" && (
        <>
          <StartAuth />
          <CheckAnswers />
          <button
            onClick={() => setPage("home")}
            style={{ marginTop: "1rem", padding: "0.5rem" }}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}

export default App;
