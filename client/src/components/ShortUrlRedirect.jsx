import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ShortUrlRedirect() {
  const { urlCode } = useParams();
  const serverBaseUrl = import.meta.env.VITE_APP_URI;

  useEffect(() => {
    if (urlCode) {
      const timer = setTimeout(() => {
        window.location.replace(`${serverBaseUrl}/${urlCode}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [urlCode]);

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>NeuroLinker</h1>
        <div style={spinnerStyle}></div>
        <p style={textStyle}>Redirecting you securely...</p>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "#080a0f",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Fira Code', monospace",
};

const cardStyle = {
  padding: "60px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(0,255,180,0.15)",
  borderRadius: "16px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 0 40px rgba(0,255,180,0.08)",
};

const headingStyle = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "36px",
  letterSpacing: "0.08em",
  color: "#00ffb4",
  marginBottom: "25px",
};

const textStyle = {
  marginTop: "20px",
  color: "rgba(255,255,255,0.7)",
  fontSize: "14px",
};

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "4px solid rgba(0,255,180,0.2)",
  borderTop: "4px solid #00ffb4",
  borderRadius: "50%",
  margin: "0 auto",
  animation: "spin 1s linear infinite",
};