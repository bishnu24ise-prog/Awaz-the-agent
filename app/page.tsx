"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import GeetLogo from "./components/GeetLogo";
import LandingPage from "./components/LandingPage";

interface MasterRouterProps {
  initialCommand?: string;
  onBack?: () => void;
}

const WalletConnect = dynamic(() => import("./components/WalletConnect"), {
  ssr: false,
});

const MasterRouter = dynamic<MasterRouterProps>(() => import("./components/MasterRouter"), {
  ssr: false,
});

export default function Page() {
  const [showApp, setShowApp] = useState(false);
  const [initialCommand, setInitialCommand] = useState("");

  const handleExplore = (cmd?: string) => {
    if (cmd) setInitialCommand(cmd);
    setShowApp(true);
  };

  if (!showApp) {
    return <LandingPage onExplore={handleExplore} />;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-main)", position: "relative" }}>
      {/* Background Ambience */}
      <div className="bg-cyber-arcs" />
      <div className="bg-ambient" />
      <div className="bg-dot-grid" />

      {/* Main Content Area */}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: "60px" }}>
        {/* App Top Navigation Bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(6, 8, 13, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "12px 24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "1320px",
              margin: "0 auto",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* Left: Brand + Navigation Back */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <GeetLogo size="small" onClick={() => setShowApp(false)} showBadge={false} />

              <button
                onClick={() => setShowApp(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-subtle)",
                  color: "#94a3b8",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <span>←</span>
                <span>Overview</span>
              </button>
            </div>

            {/* Center: Live Monad Telemetry Heartbeat */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "5px 14px",
                borderRadius: "9999px",
                background: "rgba(14, 20, 32, 0.7)",
                border: "1px solid var(--border-medium)",
                fontSize: "0.74rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="beacon-dot" />
                <span style={{ color: "#ffffff", fontWeight: 600 }}>Monad Testnet</span>
              </div>
              <span style={{ color: "var(--border-medium)" }}>|</span>
              <span style={{ color: "#94a3b8" }}>10,000+ TPS</span>
              <span style={{ color: "var(--border-medium)" }}>|</span>
              <span style={{ color: "var(--neon-cyan)" }}>Parallel EVM</span>
            </div>

            {/* Right: Wallet Connect */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Master Workspace Container */}
        <main style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
          <MasterRouter initialCommand={initialCommand} onBack={() => setShowApp(false)} />
        </main>
      </div>
    </div>
  );
}
