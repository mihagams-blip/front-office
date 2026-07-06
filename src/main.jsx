import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// The game saves its leaderboard through window.storage. That is not a built-in
// browser API, so we back it with the browser's own localStorage. This keeps the
// leaderboard working (saved on each player's own device/browser).
window.storage = {
  get: async (key) => {
    const value = localStorage.getItem(key);
    return value == null ? null : { value };
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
