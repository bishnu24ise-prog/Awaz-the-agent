"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { MONAD_MAINNET_RPC_URL, MONAD_RPC_URL, MONAD_TESTNET, type MonadNetwork, getExplorerAddressUrl } from "../lib/monad";

export default function WalletConnect() {
  const {
    connected,
    address,
    balance,
    connecting,
    chainId,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
    hasMetaMask,
    network,
  } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onConnect = async () => {
    setError(null);
    try {
      await connect();
    } catch (err: any) {
      setError(err?.message || "Failed to connect MetaMask");
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await refreshBalance();
    } catch (err: any) {
      setError(err?.message || "Failed to refresh balance");
    } finally {
      setLoading(false);
    }
  };

  const onSwitch = async (target: MonadNetwork) => {
    setError(null);
    try {
      await switchNetwork(target);
    } catch (err: any) {
      setError(err?.message || "Failed to switch network");
    }
  };

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const onCorrectNetwork = chainId === (network === "mainnet" ? 143 : MONAD_TESTNET.chainId);
  const explorerUrl = address ? getExplorerAddressUrl(address, network) : "#";

  if (!connected) {
    return (
      <div style={{ position: "relative", display: "inline-flex" }}>
        <button
          onClick={onConnect}
          disabled={connecting || !hasMetaMask}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, rgba(131, 110, 249, 0.9) 0%, rgba(95, 56, 251, 0.9) 100%)",
            border: "1px solid rgba(131, 110, 249, 0.4)",
            color: "#ffffff",
            fontSize: "0.84rem",
            fontWeight: 700,
            cursor: connecting || !hasMetaMask ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(131, 110, 249, 0.25)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            if (!connecting && hasMetaMask) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(131, 110, 249, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(131, 110, 249, 0.25)";
          }}
        >
          {/* MetaMask fox / wallet vector icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          <span>
            {connecting
              ? "Connecting..."
              : hasMetaMask
              ? "Connect Wallet"
              : "Install MetaMask"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-flex" }}>
      {/* Sleek Compact Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 12px 6px 10px",
          borderRadius: "10px",
          background: "rgba(14, 20, 32, 0.8)",
          border: onCorrectNetwork ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(244, 63, 94, 0.4)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(131, 110, 249, 0.5)";
          e.currentTarget.style.background = "rgba(20, 28, 44, 0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = onCorrectNetwork ? "rgba(255, 255, 255, 0.12)" : "rgba(244, 63, 94, 0.4)";
          e.currentTarget.style.background = "rgba(14, 20, 32, 0.8)";
        }}
      >
        {/* Network indicator dot */}
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: onCorrectNetwork ? "#10b981" : "#f43f5e",
            boxShadow: onCorrectNetwork ? "0 0 8px #10b981" : "0 0 8px #f43f5e",
          }}
        />

        {/* Balance chip */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.01em",
          }}
        >
          {balance !== null ? `${balance.toFixed(3)} MON` : "—"}
        </span>

        {/* Address badge */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "#cbd5e1",
            background: "rgba(255, 255, 255, 0.06)",
            padding: "2px 7px",
            borderRadius: "6px",
          }}
        >
          {shortAddress}
        </span>

        {/* Chevron icon */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: "#94a3b8",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Floating Glass Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "300px",
            zIndex: 100,
            background: "rgba(10, 14, 23, 0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(131, 110, 249, 0.15)",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {/* Header row: Account & copy */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              Connected Wallet
            </span>
            <span style={{ fontSize: "0.72rem", color: onCorrectNetwork ? "#34d399" : "#f43f5e", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
              {network === "testnet" ? "Testnet 10143" : "Mainnet 143"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "8px",
              padding: "8px 10px",
              marginBottom: "14px",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#f8fafc" }}>
              {shortAddress}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={copyAddress}
                title="Copy Address"
                style={{
                  background: "transparent",
                  color: copied ? "#10b981" : "#94a3b8",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                title="View on Explorer"
                style={{
                  color: "#836ef9",
                  padding: "4px 6px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Explorer ↗
              </a>
            </div>
          </div>

          {/* Balance Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Available Balance</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-mono)" }}>
                {balance !== null ? `${balance.toFixed(4)} MON` : "—"}
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#cbd5e1",
                fontSize: "0.75rem",
              }}
            >
              <span>{loading ? "⟳" : "↻"}</span>
              <span>Refresh</span>
            </button>
          </div>

          {/* Network Switcher */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "6px" }}>Monad Network</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <button
                onClick={() => onSwitch("testnet")}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  background: network === "testnet" ? "rgba(131, 110, 249, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  border: network === "testnet" ? "1px solid rgba(131, 110, 249, 0.5)" : "1px solid rgba(255, 255, 255, 0.06)",
                  color: network === "testnet" ? "#ffffff" : "#94a3b8",
                }}
              >
                Testnet (10143)
              </button>
              <button
                onClick={() => onSwitch("mainnet")}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  background: network === "mainnet" ? "rgba(131, 110, 249, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  border: network === "mainnet" ? "1px solid rgba(131, 110, 249, 0.5)" : "1px solid rgba(255, 255, 255, 0.06)",
                  color: network === "mainnet" ? "#ffffff" : "#94a3b8",
                }}
              >
                Mainnet
              </button>
            </div>
          </div>

          {/* Faucet Link if low balance */}
          {network === "testnet" && (
            <a
              href={MONAD_TESTNET.faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                background: "rgba(0, 240, 255, 0.08)",
                border: "1px solid rgba(0, 240, 255, 0.2)",
                color: "#38bdf8",
                fontSize: "0.78rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Get Free Testnet MON ↗
            </a>
          )}

          {/* Disconnect button */}
          <button
            onClick={() => {
              setIsOpen(false);
              disconnect();
            }}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.25)",
              color: "#fca5a5",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
              e.currentTarget.style.color = "#fca5a5";
            }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
