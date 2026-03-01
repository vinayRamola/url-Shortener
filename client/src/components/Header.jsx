import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();

  return (
    <div style={headerStyle}>
      <div
        style={logoStyle}
        onClick={() => navigate("/")}
      >
        NeuroLinker
      </div>

      <div style={rightStyle}>
        <button
          style={analyticsBtn}
          onClick={() => navigate("/analytics")}
        >
          Analytics
        </button>

        <button
          style={toggleBtn}
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </div>
  );
};

export default Header;

/* ---------- Styles ---------- */

const headerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "70px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 40px",
  backdropFilter: "blur(10px)",
  zIndex: 1000,
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  background: "rgba(8,10,15,0.85)"
};

const logoStyle = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "24px",
  color: "#00ffb4",
  letterSpacing: "0.1em",
  cursor: "pointer" // 👈 makes it clickable
};

const rightStyle = {
  display: "flex",
  gap: "12px"
};

const toggleBtn = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(0,255,180,0.3)",
  background: "transparent",
  color: "#00ffb4",
  cursor: "pointer",
  fontFamily: "'Fira Code', monospace",
  fontSize: "12px"
};

const analyticsBtn = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(96,165,250,0.4)",
  background: "transparent",
  color: "#60a5fa",
  cursor: "pointer",
  fontFamily: "'Fira Code', monospace",
  fontSize: "12px"
};