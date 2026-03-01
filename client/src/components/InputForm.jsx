// InputForm.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Code:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Fira Code', monospace;
      background: #080a0f;
      height: 100vh;
      overflow: hidden;
    }

    .url-page {
      height: 100vh; width: 100vw;
      display: grid; grid-template-columns: 1fr 1fr;
      position: relative;
      /* ✅ FIX: was overflow:hidden — now visible so panels can scroll */
      overflow: visible;
      background: #080a0f; transition: background 0.4s ease;
    }
    .url-page.light { background: #0a1628; }

    .url-page::after {
      content: ''; position: fixed; inset: 0;
      background-image: radial-gradient(circle, rgba(0,255,200,0.07) 1px, transparent 1px);
      background-size: 30px 30px; pointer-events: none; z-index: 0;
    }
    .url-page.light::after {
      background-image: radial-gradient(circle, rgba(100,160,255,0.1) 1px, transparent 1px);
    }

    /* LEFT PANEL — never grows, always centred */
    .left-panel {
      position: relative; z-index: 10;
      height: 100vh;
      display: flex; flex-direction: column;
      justify-content: center; align-items: flex-start;
      padding: 60px 56px; overflow: hidden;
    }
    .left-panel::before {
      content: ''; position: absolute;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,255,180,0.1), transparent 65%);
      top: -120px; left: -160px; pointer-events: none;
    }
    .url-page.light .left-panel::before { background: radial-gradient(circle, rgba(59,130,246,0.18), transparent 65%); }
    .left-panel::after {
      content: ''; position: absolute;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(168,85,247,0.1), transparent 65%);
      bottom: -60px; right: -40px; pointer-events: none;
    }
    .url-page.light .left-panel::after { background: radial-gradient(circle, rgba(99,102,241,0.14), transparent 65%); }

    .brand-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(64px, 7vw, 96px);
      line-height: 0.92; letter-spacing: 0.04em;
      background: linear-gradient(135deg, #00ffb4 0%, #00c8ff 55%, #a855f7 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 18px;
    }
    .url-page.light .brand-title {
      background: linear-gradient(135deg, #60a5fa 0%, #a5b4fc 55%, #c4b5fd 100%);
      -webkit-background-clip: text; background-clip: text;
    }

    .brand-desc {
      font-size: 12.5px; font-weight: 300; line-height: 1.8;
      color: rgba(255,255,255,0.33); max-width: 360px; margin-bottom: 24px;
    }
    .url-page.light .brand-desc { color: rgba(160,200,255,0.5); }

    .feature-list { display: flex; flex-direction: column; gap: 9px; margin-bottom: 28px; }
    .feature-item {
      display: flex; align-items: flex-start; gap: 12px;
      font-size: 11.5px; letter-spacing: 0.04em;
      color: rgba(255,255,255,0.42); line-height: 1.5;
    }
    .url-page.light .feature-item { color: rgba(160,200,255,0.55); }
    .feature-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #00ffb4; flex-shrink: 0; margin-top: 5px;
      box-shadow: 0 0 8px rgba(0,255,180,0.5);
    }
    .url-page.light .feature-dot { background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,0.5); }
    .feature-sub { font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.06em; margin-top: 1px; }
    .url-page.light .feature-sub { color: rgba(147,197,253,0.35); }

    .stats-row { display: flex; gap: 0; margin-bottom: 8px; width: 100%; }
    .stat-item {
      flex: 1; display: flex; flex-direction: column; gap: 5px;
      padding: 14px 16px;
      border: 1px solid rgba(0,255,180,0.1);
      background: rgba(0,255,180,0.03); transition: background 0.2s;
    }
    .stat-item:first-child { border-radius: 10px 0 0 10px; }
    .stat-item:last-child  { border-radius: 0 10px 10px 0; }
    .stat-item + .stat-item { border-left: none; }
    .stat-item:hover { background: rgba(0,255,180,0.06); }
    .url-page.light .stat-item { border-color: rgba(96,165,250,0.15); background: rgba(96,165,250,0.03); }
    .url-page.light .stat-item:hover { background: rgba(96,165,250,0.07); }

    .stat-num {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px; letter-spacing: 0.04em;
      color: #00ffb4; line-height: 1;
      animation: countIn 0.4s ease both;
    }
    .url-page.light .stat-num { color: #60a5fa; }
    .stat-label { font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
    .url-page.light .stat-label { color: rgba(147,197,253,0.4); }

    .stat-num-skeleton {
      height: 26px; width: 60px; border-radius: 4px;
      background: linear-gradient(90deg, rgba(0,255,180,0.06) 0%, rgba(0,255,180,0.14) 50%, rgba(0,255,180,0.06) 100%);
      background-size: 200% auto; animation: shimmer 1.5s linear infinite;
    }
    .url-page.light .stat-num-skeleton {
      background: linear-gradient(90deg, rgba(96,165,250,0.07) 0%, rgba(96,165,250,0.16) 50%, rgba(96,165,250,0.07) 100%);
      background-size: 200% auto;
    }

    .live-row { display: flex; align-items: center; gap: 7px; margin-bottom: 20px; }
    .live-dot {
      display: inline-block; width: 6px; height: 6px; border-radius: 50%;
      background: #00ffb4; animation: livePulse 2s ease-in-out infinite;
    }
    .url-page.light .live-dot { background: #60a5fa; }
    .live-label { font-size: 9px; letter-spacing: 0.18em; color: rgba(0,255,180,0.45); }
    .url-page.light .live-label { color: rgba(96,165,250,0.5); }

    @keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 5px currentColor; } 50% { opacity: 0.35; box-shadow: none; } }
    @keyframes countIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer  { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes spin     { to { transform: rotate(360deg); } }
    @keyframes slideUp  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .social-links { display: flex; gap: 12px; margin-top: 4px; }
    .social-icon {
      width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
      border-radius: 50%; text-decoration: none; font-size: 13px;
      color: rgba(0,255,180,0.45); border: 1px solid rgba(0,255,180,0.2); transition: all 0.22s ease;
    }
    .social-icon:hover { color: #00ffb4; border-color: #00ffb4; box-shadow: 0 0 12px rgba(0,255,180,0.45); transform: translateY(-2px); }
    .url-page.light .social-icon { color: rgba(96,165,250,0.55); border-color: rgba(96,165,250,0.25); }
    .url-page.light .social-icon:hover { color: #93c5fd; border-color: #60a5fa; box-shadow: 0 0 12px rgba(96,165,250,0.45); }

    .left-footer {
      position: absolute; bottom: 26px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
      font-size: 10px; letter-spacing: 0.08em; color: rgba(255,255,255,0.15);
    }
    .url-page.light .left-footer { color: rgba(160,200,255,0.3); }
    .left-footer span { color: #ff6b6b; }

    .panel-divider {
      position: fixed; top: 0; bottom: 0; left: 50%; width: 1px;
      background: linear-gradient(180deg, transparent 0%, rgba(0,255,180,0.08) 20%, rgba(0,255,180,0.14) 50%, rgba(0,255,180,0.08) 80%, transparent 100%);
      z-index: 5; pointer-events: none;
    }
    .url-page.light .panel-divider {
      background: linear-gradient(180deg, transparent 0%, rgba(96,165,250,0.1) 20%, rgba(96,165,250,0.18) 50%, rgba(96,165,250,0.1) 80%, transparent 100%);
    }

    /* ✅ RIGHT PANEL — KEY FIX
       min-height: 100vh  → fills screen when short
       height: auto        → grows naturally when QR appears
       overflow-y: auto    → scrolls if it ever gets taller than viewport
       justify-content: center inside a min-height wrapper keeps content centred
       when small, but lets it expand downward when QR is added            */
    .right-panel {
      position: relative; z-index: 10;
      min-height: 100vh; height: auto;
      display: flex; flex-direction: column;
      justify-content: center;
      padding: 60px 56px;
      overflow-y: auto;
    }
    /* scrollbar styling */
    .right-panel::-webkit-scrollbar { width: 3px; }
    .right-panel::-webkit-scrollbar-track { background: transparent; }
    .right-panel::-webkit-scrollbar-thumb { background: rgba(0,255,180,0.2); border-radius: 2px; }

    .right-panel::before {
      content: ''; position: absolute;
      width: 350px; height: 350px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,200,255,0.07), transparent 65%);
      bottom: -80px; right: -80px; pointer-events: none;
    }

    .form-eyebrow { font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(0,255,180,0.45); margin-bottom: 8px; }
    .url-page.light .form-eyebrow { color: rgba(96,165,250,0.55); }
    .form-heading { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.06em; color: rgba(255,255,255,0.82); margin-bottom: 28px; }
    .url-page.light .form-heading { color: rgba(200,220,255,0.88); }

    .field-group { margin-bottom: 18px; }
    .field-label { display: block; font-size: 9px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(0,255,180,0.55); margin-bottom: 7px; }
    .url-page.light .field-label { color: rgba(96,165,250,0.7); }

    .url-input {
      width: 100%; padding: 12px 16px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03);
      color: rgba(255,255,255,0.88); font-family: 'Fira Code', monospace; font-size: 13px;
      outline: none; transition: all 0.2s ease;
    }
    .url-page.light .url-input { background: rgba(255,255,255,0.05); border-color: rgba(96,165,250,0.18); color: #dbeafe; }
    .url-input::placeholder { color: rgba(255,255,255,0.18); }
    .url-page.light .url-input::placeholder { color: rgba(147,197,253,0.3); }
    .url-input:focus { border-color: rgba(0,255,180,0.45); background: rgba(0,255,180,0.03); box-shadow: 0 0 0 3px rgba(0,255,180,0.07); }
    .url-page.light .url-input:focus { border-color: rgba(96,165,250,0.55); background: rgba(96,165,250,0.04); box-shadow: 0 0 0 3px rgba(96,165,250,0.1); }
    .url-input.error { border-color: rgba(255,80,80,0.45); box-shadow: 0 0 0 3px rgba(255,80,80,0.06); }

    .helper-text { font-size: 10px; margin-top: 6px; color: rgba(255,255,255,0.2); letter-spacing: 0.04em; }
    .url-page.light .helper-text { color: rgba(147,197,253,0.4); }
    .helper-text.error { color: rgba(255,110,110,0.8); }

    .code-row {
      display: flex; border-radius: 10px; overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07); transition: border-color 0.2s, box-shadow 0.2s;
    }
    .code-row:focus-within { border-color: rgba(0,255,180,0.4); box-shadow: 0 0 0 3px rgba(0,255,180,0.06); }
    .url-page.light .code-row { border-color: rgba(96,165,250,0.18); }
    .url-page.light .code-row:focus-within { border-color: rgba(96,165,250,0.5); box-shadow: 0 0 0 3px rgba(96,165,250,0.09); }
    .code-addon {
      padding: 12px 14px; background: rgba(0,255,180,0.04); color: rgba(0,255,180,0.38);
      font-family: 'Fira Code', monospace; font-size: 11.5px;
      border-right: 1px solid rgba(255,255,255,0.05);
      max-width: 52%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      display: flex; align-items: center;
    }
    .url-page.light .code-addon { background: rgba(96,165,250,0.05); color: rgba(96,165,250,0.5); border-right-color: rgba(96,165,250,0.12); }
    .code-input {
      flex: 1; padding: 12px 14px; background: rgba(255,255,255,0.025);
      color: rgba(255,255,255,0.85); font-family: 'Fira Code', monospace; font-size: 13px;
      border: none; outline: none;
    }
    .url-page.light .code-input { background: rgba(255,255,255,0.04); color: #dbeafe; }
    .code-input::placeholder { color: rgba(255,255,255,0.16); }
    .url-page.light .code-input::placeholder { color: rgba(147,197,253,0.28); }

    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,255,180,0.08), transparent); margin: 20px 0; }
    .url-page.light .divider { background: linear-gradient(90deg, transparent, rgba(96,165,250,0.12), transparent); }

    .submit-btn {
      width: 100%; padding: 13px; border-radius: 10px; border: none; cursor: pointer;
      font-family: 'Fira Code', monospace; font-size: 12px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      background: linear-gradient(135deg, #00ffb4 0%, #00d4ff 100%);
      color: #080a0f; transition: all 0.2s ease; position: relative; overflow: hidden;
    }
    .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent); opacity: 0; transition: opacity 0.2s; }
    .submit-btn:hover::after { opacity: 1; }
    .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,255,180,0.28), 0 2px 8px rgba(0,212,255,0.18); }
    .submit-btn:active { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .result-row { display: flex; gap: 8px; margin-top: 14px; animation: slideUp 0.3s ease; }
    .result-input {
      flex: 1; padding: 11px 14px; border-radius: 9px;
      border: 1px solid rgba(0,255,180,0.2); background: rgba(0,255,180,0.03); color: #00ffb4;
      font-family: 'Fira Code', monospace; font-size: 12px;
      outline: none; overflow: hidden; text-overflow: ellipsis;
    }
    .url-page.light .result-input { border-color: rgba(96,165,250,0.3); background: rgba(96,165,250,0.05); color: #93c5fd; }

    .copy-btn {
      padding: 11px 20px; border-radius: 9px;
      border: 1px solid rgba(0,255,180,0.22); background: transparent; color: rgba(0,255,180,0.65);
      font-family: 'Fira Code', monospace; font-size: 11px; font-weight: 600;
      letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
    }
    .copy-btn:hover { background: rgba(0,255,180,0.07); border-color: rgba(0,255,180,0.5); color: #00ffb4; }
    .copy-btn.copied { background: rgba(0,255,180,0.1); border-color: #00ffb4; color: #00ffb4; }
    .url-page.light .copy-btn { border-color: rgba(96,165,250,0.3); color: #93c5fd; }
    .url-page.light .copy-btn:hover { background: rgba(96,165,250,0.08); border-color: #60a5fa; color: #bfdbfe; }
    .url-page.light .copy-btn.copied { background: rgba(96,165,250,0.12); border-color: #60a5fa; color: #bfdbfe; }

    .spinner {
      display: inline-block; width: 12px; height: 12px;
      border: 2px solid rgba(8,10,15,0.25); border-top-color: #080a0f;
      border-radius: 50%; animation: spin 0.6s linear infinite;
      margin-right: 8px; vertical-align: middle;
    }

    /* ── QR box ── */
    .qr-box {
      margin-top: 16px; padding: 16px 18px; border-radius: 12px;
      background: rgba(0,255,180,0.03); border: 1px solid rgba(0,255,180,0.18);
      display: flex; align-items: center; gap: 18px;
      animation: slideUp 0.35s ease;
    }
    .url-page.light .qr-box { border-color: rgba(96,165,250,0.22); background: rgba(96,165,250,0.03); }

    .qr-image {
      /* ✅ white background baked in so dark-mode doesn't hide the QR pattern */
      width: 108px; height: 108px; flex-shrink: 0;
      border-radius: 8px;
      background: #ffffff;
      padding: 7px;
      display: block;
    }

    .qr-info { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }
    .qr-label { font-size: 9px; letter-spacing: 0.18em; color: rgba(0,255,180,0.5); text-transform: uppercase; }
    .url-page.light .qr-label { color: rgba(96,165,250,0.55); }
    .qr-hint { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.6; }
    .url-page.light .qr-hint { color: rgba(160,200,255,0.4); }
    .qr-dl-btn {
      margin-top: 4px; width: fit-content;
      padding: 8px 16px; border-radius: 8px;
      border: 1px solid rgba(0,255,180,0.25); background: transparent;
      color: rgba(0,255,180,0.7);
      font-family: 'Fira Code', monospace; font-size: 11px; font-weight: 600;
      letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s ease;
    }
    .qr-dl-btn:hover { background: rgba(0,255,180,0.08); border-color: rgba(0,255,180,0.55); color: #00ffb4; }
    .url-page.light .qr-dl-btn { border-color: rgba(96,165,250,0.3); color: #93c5fd; }
    .url-page.light .qr-dl-btn:hover { background: rgba(96,165,250,0.08); border-color: #60a5fa; }
  `}</style>
);

/* ── Animated number ── */
const AnimatedNum = ({ value, loading }) => {
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    if (value === null || value === undefined) return;
    if (typeof value === "string") { setDisplay(value); return; }
    const end = value;
    const start = display ?? 0;
    if (start === end) return;
    const steps = 28;
    const step = (end - start) / steps;
    let current = start;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      current += step;
      if (count >= steps) { setDisplay(end); clearInterval(timer); }
      else { setDisplay(Math.round(current)); }
    }, 800 / steps);
    return () => clearInterval(timer);
  }, [value]);

  if (loading) return <div className="stat-num-skeleton" />;
  return <div className="stat-num">{display !== null ? (display.toLocaleString?.() ?? display) : "—"}</div>;
};

/* ══════════════════════════════════════════════════════════════ */
export const InputForm = ({ isDark }) => {
  const [input, setInput]         = useState({ longUrl: "", urlCode: "" });
  const [url, setUrl]             = useState("");
  const [qrCode, setQrCode]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [stats, setStats]         = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const clientBaseUrl = typeof window !== "undefined" ? window.location.origin + "/" : "http://localhost:3000/";

  useEffect(() => {
    axios.get("/api/url/dashboard-stats")
      .then(res  => { setStats(res.data); setStatsLoading(false); })
      .catch(()  => setStatsLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
    setIsError(false);
  };

  const handleEnter = (e) => { if (e.key === "Enter") handleSubmit(); };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!input.longUrl) { setIsError(true); setUrl("URL is required."); return; }
    setIsLoading(true);
    setUrl("");
    setQrCode(null);
    axios.post('/api/url/shorten', input)
      .then(res => {
        console.log("[NeuroLinker] shorten response:", res.data); // debug
        setUrl(res.data.shortUrl);
        setQrCode(res.data.qrCode ?? null);
        setIsLoading(false);
      })
      .catch(err => {
        setUrl(err.response?.data?.error || "Something went wrong");
        setQrCode(null);
        setIsLoading(false);
      });
  };

  const handleDownloadQr = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "neurolinker-qr.png";
    link.click();
  };

  return (
    <>
      <GlobalStyles />
      <div className={`url-page${isDark ? "" : " light"}`}>
        <div className="panel-divider" />

        {/* ════ LEFT ════ */}
        <div className="left-panel">
          <div className="brand-title">NeuroLinker</div>
          <div className="brand-desc">
            Transform unwieldy links into clean, shareable URLs in seconds.
            Create custom aliases and get detailed analytics — all in one place.
          </div>

          <div className="feature-list">
            {[
              ["Instant link compression",    "Shorten any URL in under 50ms"],
              ["Custom memorable aliases",     "Pick your own slug — e.g. /my-portfolio"],
              ["Per-link analytics",           "Track total clicks, creation date & link age"],
              ["One-click copy to clipboard",  "Share instantly — no extra steps"],
            ].map(([title, sub]) => (
              <div className="feature-item" key={title}>
                <div className="feature-dot" />
                <div>
                  <div>{title}</div>
                  <div className="feature-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="live-row">
            <span className="live-dot" />
            <span className="live-label">LIVE PLATFORM DATA</span>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <AnimatedNum value={stats?.totalLinks}       loading={statsLoading} />
              <div className="stat-label">Links Created</div>
            </div>
            <div className="stat-item">
              <AnimatedNum value={stats?.totalRedirects}   loading={statsLoading} />
              <div className="stat-label">Total Redirects</div>
            </div>
            <div className="stat-item">
              <AnimatedNum value={stats?.avgRedirectSpeed ?? "<50ms"} loading={statsLoading} />
              <div className="stat-label">Avg Speed</div>
            </div>
          </div>

          <div className="left-footer">
            <div>Made with <span>♥</span> by Vinay Chand Ramola</div>
            <div className="social-links">
              <a href="https://github.com/vinayRamola/url-Shortener" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/vinay-chand-ramola-970061223/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>

        {/* ════ RIGHT ════ */}
        <div className="right-panel">
          <div className="form-eyebrow">// get started</div>
          <div className="form-heading">Shorten Your Link</div>

          <div className="field-group">
            <label className="field-label">Long URL</label>
            <input
              className={`url-input${isError ? " error" : ""}`}
              id="longUrl" type="url"
              value={input.longUrl}
              placeholder="https://your-very-long-url.com/with/a/long/path"
              onChange={handleInputChange} onKeyDown={handleEnter}
            />
            <div className={`helper-text${isError ? " error" : ""}`}>
              {isError ? "⚠ A valid URL is required" : "_ paste any URL to get started"}
            </div>
          </div>

          <div className="divider" />

          <div className="field-group">
            <label className="field-label">
              Custom Alias&nbsp;
              <span style={{ opacity: 0.4, fontWeight: 300, textTransform: "none", letterSpacing: "0.04em" }}>— optional</span>
            </label>
            <div className="code-row">
              <div className="code-addon">{clientBaseUrl}</div>
              <input
                className="code-input"
                id="urlCode" type="text"
                placeholder="my-custom-link"
                value={input.urlCode}
                onChange={handleInputChange} onKeyDown={handleEnter}
              />
            </div>
          </div>

          <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <><span className="spinner" />Processing...</> : "→ Shorten URL"}
          </button>

          {/* Short URL */}
          {url && (
            <div className="result-row">
              <input className="result-input" value={url} readOnly />
              <button className={`copy-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          )}

          {/* ✅ QR Code — always rendered if qrCode is truthy */}
          {qrCode && (
            <div className="qr-box">
              <img
                src={qrCode}
                alt="QR Code for your shortened link"
                className="qr-image"
                onError={(e) => console.error("[NeuroLinker] QR img failed to load", e)}
              />
              <div className="qr-info">
                <div className="qr-label">// QR Code</div>
                <div className="qr-hint">
                  Scan with any camera app to open your short link on any device.
                </div>
                <button className="qr-dl-btn" onClick={handleDownloadQr}>
                  ↓ Download PNG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputForm;