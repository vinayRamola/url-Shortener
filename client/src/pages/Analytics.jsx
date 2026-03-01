import React, { useEffect, useState } from "react";
import axios from "axios";

/* ─── Keyframe injection ──────────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("nl-analytics-styles")) return;
  const el = document.createElement("style");
  el.id = "nl-analytics-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Code:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 16px rgba(0,255,180,0.10); }
      50%       { box-shadow: 0 0 32px rgba(0,255,180,0.26); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes livePulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 6px #00ffb4; }
      50%       { opacity: 0.4; box-shadow: 0 0 2px #00ffb4; }
    }

    .nl-stat-card {
      animation: fadeSlideUp 0.45s ease both, pulseGlow 3.5s ease-in-out infinite;
      transition: background 0.2s, transform 0.15s;
    }
    .nl-stat-card:hover { transform: translateX(4px); }
    .nl-stat-card:nth-child(1) { animation-delay: 0.06s, 0s;   }
    .nl-stat-card:nth-child(2) { animation-delay: 0.14s, 0.9s; }
    .nl-stat-card:nth-child(3) { animation-delay: 0.22s, 1.8s; }
    .nl-stat-card:nth-child(4) { animation-delay: 0.30s, 2.7s; }

    .nl-result-row:nth-child(1) { animation: fadeSlideUp 0.28s ease 0.00s both; }
    .nl-result-row:nth-child(2) { animation: fadeSlideUp 0.28s ease 0.06s both; }
    .nl-result-row:nth-child(3) { animation: fadeSlideUp 0.28s ease 0.12s both; }
    .nl-result-row:nth-child(4) { animation: fadeSlideUp 0.28s ease 0.18s both; }
    .nl-result-row:nth-child(5) { animation: fadeSlideUp 0.28s ease 0.24s both; }
    .nl-result-row:nth-child(6) { animation: fadeSlideUp 0.28s ease 0.30s both; }

    .nl-input:focus {
      border-color: rgba(0,255,180,0.65) !important;
      box-shadow: 0 0 0 3px rgba(0,255,180,0.09);
    }
    .nl-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 26px rgba(0,255,180,0.38);
    }
    .nl-btn:active:not(:disabled) { transform: translateY(0); }
    .nl-btn:disabled { opacity: 0.65; cursor: not-allowed; }

    .nl-live-dot {
      display: inline-block;
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #00ffb4;
      animation: livePulse 2s ease-in-out infinite;
    }

    .nl-skeleton {
      background: linear-gradient(90deg,
        rgba(255,255,255,0.04) 0%,
        rgba(255,255,255,0.09) 50%,
        rgba(255,255,255,0.04) 100%
      );
      background-size: 200% auto;
      animation: shimmer 1.6s linear infinite;
    }

    .nl-scroll::-webkit-scrollbar { width: 3px; }
    .nl-scroll::-webkit-scrollbar-track { background: transparent; }
    .nl-scroll::-webkit-scrollbar-thumb {
      background: rgba(0,255,180,0.18);
      border-radius: 2px;
    }
  `;
  document.head.appendChild(el);
};

/* ══════════════════════════════════════════════════════════════════════════ */
const Analytics = () => {
  const [stats,    setStats]    = useState(null);
  const [code,     setCode]     = useState("");
  const [selected, setSelected] = useState(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => { injectStyles(); fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/url/dashboard-stats");
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAnalytics = async () => {
    if (!code.trim()) return;
    setLoading(true); setSelected(null); setError("");
    try {
      let extracted = code.trim();
      if (extracted.includes("/")) extracted = extracted.split("/").pop();
      const res = await axios.get(`/api/url/analytics/${extracted}`);
      setSelected(res.data);
    } catch { setError("No link found for that code."); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.root}>

      {/* ── Background ── */}
      <div style={s.grid} />
      <Blob top="8%"    left="2%"   size={480} color="rgba(0,255,180,0.07)"   />
      <Blob bottom="5%" right="2%"  size={400} color="rgba(168,85,247,0.07)"  />
      <Blob top="45%"   left="47%"  size={260} color="rgba(0,212,255,0.05)"   />

      {/* ── Centre divider (mirrors homepage vertical line) ── */}
      <div style={s.vDivider} />

      {/* ════════ LEFT — Global Stats ════════ */}
      <section style={s.panel} className="nl-scroll">
        <CornerTick pos={{ top: 32, left: 32 }} rotate={0}   />
        <CornerTick pos={{ bottom: 32, right: 32 }} rotate={180} />

        <p style={s.eyebrow}>// PLATFORM OVERVIEW</p>
        <h1 style={s.hero}>GLOBAL<br/>METRICS</h1>
        <p style={s.desc}>Live statistics across<br/>the entire NeuroLinker network.</p>

        <div style={s.statList}>
          {stats ? (
            <>
              <StatCard label="Total Links"     value={stats.totalLinks}       icon="🔗" color="#00ffb4" />
              <StatCard label="Last 24 Hours"   value={stats.linksLast24Hours} icon="⚡" color="#00d4ff" />
              <StatCard label="Total Redirects" value={stats.totalRedirects}   icon="↗"  color="#a855f7" />
              <StatCard label="Avg Redirect Speed" value={stats.avgRedirectSpeed} icon="⏱" color="#f59e0b" />
            </>
          ) : (
            [0,1,2,3].map(i => <SkeletonCard key={i} />)
          )}
        </div>

        <div style={s.liveRow}>
          <span className="nl-live-dot" />
          <span style={s.liveLabel}>LIVE · AUTO-REFRESH</span>
        </div>
      </section>

      {/* ════════ RIGHT — Search ════════ */}
      <section style={s.panel} className="nl-scroll">
        <CornerTick pos={{ top: 32, right: 32 }} rotate={90}  />
        <CornerTick pos={{ bottom: 32, left: 32 }} rotate={270} />

        <p style={s.eyebrow}>// SEARCH ANALYTICS</p>
        <h1 style={s.hero}>LINK<br/>INSIGHTS</h1>
        <p style={s.desc}>Enter any short code or full URL<br/>to pull up click analytics.</p>

        {/* Input */}
        <div style={s.inputRow}>
          <div style={s.inputWrap}>
            <span style={s.searchIcon}>⌕</span>
            <input
              className="nl-input"
              type="text"
              placeholder="abc123  or  https://nlnk.r/abc123"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchAnalytics()}
              style={s.input}
            />
          </div>
          <button className="nl-btn" onClick={fetchAnalytics} style={s.btn} disabled={loading}>
            {loading ? <Spinner /> : "→ SEARCH"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={s.errorBox}>
            <span style={{ marginRight: 8 }}>⚠</span>{error}
          </div>
        )}

        {/* Result */}
        {selected && <ResultCard data={selected} />}

        {/* Empty */}
        {!selected && !error && !loading && (
          <div style={s.empty}>
            <div style={s.emptyGlyph}>◈</div>
            <p style={s.emptyText}>No link searched yet.<br/>Results will appear here.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Analytics;

/* ══════════════════════════════════════════════════════════════════════════ */
/*  ATOMS                                                                     */
/* ══════════════════════════════════════════════════════════════════════════ */

const Blob = ({ top, bottom, left, right, size, color }) => (
  <div style={{
    position: "absolute",
    top, bottom, left, right,
    width: size, height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    filter: "blur(72px)",
    pointerEvents: "none",
    zIndex: 0,
  }} />
);

const CornerTick = ({ pos, rotate }) => (
  <div style={{
    position: "absolute",
    width: 15, height: 15,
    borderTop: "2px solid rgba(0,255,180,0.42)",
    borderLeft: "2px solid rgba(0,255,180,0.42)",
    transform: `rotate(${rotate}deg)`,
    ...pos,
  }} />
);

const StatCard = ({ label, value, icon, color }) => (
  <div
    className="nl-stat-card"
    style={{ ...s.statCard, borderColor: `${color}25`, background: `${color}07` }}
  >
    <div style={{ ...s.statIconBox, background: `${color}18`, color }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ ...s.statVal, color }}>{value ?? "—"}</div>
      <div style={s.statLbl}>{label}</div>
    </div>
    <div style={{
      position: "absolute", right: 0, top: "18%", bottom: "18%",
      width: 3, borderRadius: 4,
      background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
      opacity: 0.5,
    }} />
  </div>
);

const SkeletonCard = () => (
  <div className="nl-skeleton" style={{ height: 68, borderRadius: 12 }} />
);

const ResultCard = ({ data }) => {
  const age = data.createdAt
    ? Math.floor((Date.now() - new Date(data.createdAt)) / 86400000)
    : null;

  return (
    <div style={s.resultCard}>
      <div style={s.resultHeader}>
        <span style={s.resultCode}>/{data.urlCode}</span>
        <span style={s.badge}>● ACTIVE</span>
      </div>
      <div style={s.hdivider} />
      <div style={s.resultGrid}>
        <RRow label="TOTAL CLICKS"  value={data.totalClicks ?? 0}  color="#00ffb4" />
        <RRow label="SHORT CODE"    value={data.urlCode}            color="#00d4ff" />
        <RRow label="CREATED"       value={data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US",{ day:"numeric", month:"short", year:"numeric" }) : "—"} color="#a855f7" />
        <RRow label="LINK AGE"      value={age !== null ? `${age} day${age !== 1 ? "s" : ""}` : "—"} color="#f59e0b" />
        {data.expiresAt && <RRow label="EXPIRES" value={new Date(data.expiresAt).toLocaleDateString()} color="#ff6b6b" />}
        {data.longUrl && (
          <div className="nl-result-row" style={{ ...s.rRow, gridColumn: "1 / -1" }}>
            <div style={s.rLabel}>DESTINATION</div>
            <div style={{ fontSize: 11, color: "#00d4ff", wordBreak: "break-all", fontFamily: "'Fira Code', monospace", marginTop: 4 }}>
              {data.longUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RRow = ({ label, value, color }) => (
  <div className="nl-result-row" style={s.rRow}>
    <div style={s.rLabel}>{label}</div>
    <div style={{ ...s.rVal, color }}>{value}</div>
  </div>
);

const Spinner = () => (
  <div style={{
    width: 15, height: 15, margin: "0 auto",
    border: "2px solid rgba(0,0,0,0.15)",
    borderTop: "2px solid #000",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  }} />
);

/* ══════════════════════════════════════════════════════════════════════════ */
/*  STYLES                                                                    */
/* ══════════════════════════════════════════════════════════════════════════ */
const s = {
  /* Root — full viewport, side-by-side */
  root: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    background: "#080a0f",
    color: "#fff",
    fontFamily: "'Fira Code', monospace",
    position: "relative",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(0,255,200,0.055) 1px, transparent 1px)",
    backgroundSize: "30px 30px",
    pointerEvents: "none", zIndex: 0,
  },
  vDivider: {
    position: "absolute", top: 0, bottom: 0, left: "50%",
    width: 1,
    background: "linear-gradient(to bottom, transparent 0%, rgba(0,255,180,0.22) 20%, rgba(0,255,180,0.22) 80%, transparent 100%)",
    zIndex: 2, pointerEvents: "none",
  },

  /* Panels */
  panel: {
    flex: 1,
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px clamp(32px, 5vw, 72px)",
    overflowY: "auto",
  },

  /* Typography */
  eyebrow: {
    margin: "0 0 16px",
    fontSize: 10,
    letterSpacing: "0.22em",
    color: "rgba(0,255,180,0.55)",
    textTransform: "uppercase",
  },
  hero: {
    margin: "0 0 14px",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(48px, 5.5vw, 76px)",
    letterSpacing: "0.04em",
    lineHeight: 0.94,
    background: "linear-gradient(135deg, #00ffb4 0%, #00c8ff 55%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  desc: {
    margin: "0 0 32px",
    fontSize: 12,
    color: "rgba(255,255,255,0.42)",
    lineHeight: 1.75,
  },

  /* Stat cards */
  statList: { display: "flex", flexDirection: "column", gap: 10 },
  statCard: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "13px 16px",
    borderRadius: 12, border: "1px solid",
    position: "relative", overflow: "hidden", cursor: "default",
  },
  statIconBox: {
    width: 40, height: 40, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 17, flexShrink: 0,
  },
  statVal: {
    fontSize: 24, fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: "0.05em", lineHeight: 1.1,
    animation: "countUp 0.4s ease both",
  },
  statLbl: {
    fontSize: 9, color: "rgba(255,255,255,0.38)",
    letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 2,
  },

  /* Live row */
  liveRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 24 },
  liveLabel: { fontSize: 9, letterSpacing: "0.2em", color: "rgba(0,255,180,0.45)" },

  /* Input */
  inputRow: { display: "flex", gap: 10, marginBottom: 16 },
  inputWrap: { flex: 1, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: {
    position: "absolute", left: 14, fontSize: 18,
    color: "rgba(0,255,180,0.42)", pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "13px 14px 13px 42px",
    borderRadius: 10, border: "1px solid rgba(0,255,180,0.22)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff", outline: "none",
    fontFamily: "'Fira Code', monospace", fontSize: 12,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  btn: {
    padding: "13px 22px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #00ffb4, #00d4ff)",
    cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: "0.12em", fontSize: 14, fontWeight: "bold",
    color: "#080a0f", transition: "transform 0.15s, box-shadow 0.15s",
    whiteSpace: "nowrap", minWidth: 108,
  },
  errorBox: {
    padding: "10px 14px", borderRadius: 10,
    background: "rgba(255,107,107,0.08)",
    border: "1px solid rgba(255,107,107,0.22)",
    color: "#ff6b6b", fontSize: 12, marginBottom: 14,
  },

  /* Empty */
  empty: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, padding: "44px 0", opacity: 0.28, textAlign: "center",
  },
  emptyGlyph: { fontSize: 42, color: "#00ffb4", lineHeight: 1 },
  emptyText: { fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 },

  /* Result card */
  resultCard: {
    borderRadius: 14, overflow: "hidden",
    background: "rgba(0,255,180,0.03)",
    border: "1px solid rgba(0,255,180,0.17)",
    animation: "slideInRight 0.32s ease both",
  },
  resultHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "14px 18px",
  },
  resultCode: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 28,
    letterSpacing: "0.06em",
    background: "linear-gradient(90deg, #00ffb4, #00c8ff)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  badge: {
    fontSize: 9, letterSpacing: "0.14em", color: "#00ffb4",
    padding: "4px 10px", borderRadius: 6,
    border: "1px solid rgba(0,255,180,0.28)",
    background: "rgba(0,255,180,0.07)",
  },
  hdivider: {
    height: 1,
    background: "linear-gradient(to right, transparent, rgba(0,255,180,0.2), transparent)",
    margin: "0 18px",
  },
  resultGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    padding: "4px 18px 12px",
  },
  rRow: { padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  rLabel: {
    fontSize: 9, color: "rgba(255,255,255,0.33)",
    letterSpacing: "0.18em", marginBottom: 3, textTransform: "uppercase",
  },
  rVal: {
    fontSize: 15, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em",
  },
};