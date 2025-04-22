import React from "react";

export default function About() {
  const steps = [
    {
      title: "1. No passwords",
      text: "You don’t need to remember complex passwords. Just create 2-3 questions and your answers – that’s your new secure login method.",
    },
    {
      title: "2. Private & Secure",
      text: "Your data is encrypted. No need to share emails or phone numbers unless you want to. Only your answers give you access.",
    },
    {
      title: "3. Fast Auth",
      text: "When logging in, simply answer the questions. If answers match, you're in. No emails, codes, or password resets.",
    },
    {
      title: "4. Your Vibe, your rules",
      text: "Each user creates their unique Vibe — a digital space with all the info they want to share: contacts, links, photos, interests. Say goodbye to messy exchanges.",
    },
  ];
  const colors = ["#fff4b2", "#ffd6e7", "#f3e8ff", "#fff7d6"];





  return (
    <div className="container py-5">
      <div
        className="bg-white rounded-4 shadow p-4 mb-5"
        style={{
          fontFamily: "Segoe UI, sans-serif",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h2 className="mb-4 text-center">About EasyLink</h2>
        <p className="text-muted">
          <strong>EasyLink</strong> is a fast and modern way to connect. You
          create a digital Vibe instead of using paper cards or repeating your
          username again and again.
        </p>
        <p className="text-muted">
          With associative authentication, you log in using personal hints and
          answers, not passwords. It’s faster, easier, and safer.
        </p>
        <p className="text-muted mb-0">
          Thank you for choosing <strong>EasyLink</strong> — the future of
          digital identity sharing.
        </p>
      </div>

      <div className="row g-4">
        {steps.map((step, index) => (
          <div className="col-md-6" key={index}>
            <div
              className="p-4 h-100 rounded-4 shadow-sm"
              style={{
                backgroundColor: colors[index % colors.length],
                transition: "all 0.3s ease",
                border: "1px solid #ddd",
              }}
            >
              <h5 className="mb-2">{step.title}</h5>
              <p className="text-muted mb-0">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
