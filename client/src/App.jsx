import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Homepage";
import ShortUrlRedirect from "./components/ShortUrlRedirect";
import Analytics from "./pages/Analytics";
import Header from "./components/Header";
import React, { useState } from "react";

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={isDark ? "app dark" : "app light"}>
      <Header isDark={isDark} setIsDark={setIsDark} />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Homepage isDark={isDark} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/:urlCode" element={<ShortUrlRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;