"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import GeetLogo from "./GeetLogo";

const TransactionAgent = dynamic(() => import("./TransactionAgent"), { ssr: false });
const SmartContractCreator = dynamic(() => import("./SmartContractCreator"), { ssr: false });
const SmartContractOptimizer = dynamic(() => import("./SmartContractOptimizer"), { ssr: false });
const NetworkAnalyzer = dynamic(() => import("./NetworkAnalyzer"), { ssr: false });
const VoiceAgentMarketplace = dynamic(() => import("./VoiceAgentMarketplace"), { ssr: false });
const ConversationalAgent = dynamic<{ onStopSpeech?: () => void; isLiveOnMount?: boolean }>(
  () => import("./ConversationalAgent"),
  { ssr: false }
);
const ExploreSection = dynamic(() => import("./ExploreSection"), { ssr: false });
const HyperliquidAgent = dynamic(() => import("./HyperliquidAgent"), { ssr: false });
const VoiceCommandHub = dynamic(() => import("./VoiceCommandHub"), { ssr: false });
const UICAgent = dynamic(() => import("./UICAgent"), { ssr: false });

type AgentId =
  | "router"
  | "transaction"
  | "contract_creator"
  | "network"
  | "optimizer"
  | "marketplace"
  | "conversational"
  | "explore"
  | "hyperliquid"
  | "uic";

interface MasterRouterProps {
  initialCommand?: string;
  onBack?: () => void;
}

export default function MasterRouter({ initialCommand, onBack }: MasterRouterProps) {
  const [activeAgent, setActiveAgent] = useState<AgentId>("router");
  const [messages, setMessages] = useState<{ role: "user" | "system"; text: string; intent?: string }[]>([
    {
      role: "system",
      text: "Awaz Autonomous Operating System initialized. Voice & natural language execution is ready on Monad Testnet.",
    },
  ]);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isRouting, setIsRouting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speakText = (text: string) => {
    if (activeAgent === "conversational") return;
    if (!voiceEnabled) return;

    const performSpeech = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        const premiumVoices = voices.filter(
          (v) =>
            (v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Natural")) &&
            v.lang.startsWith("en")
        );

        if (premiumVoices.length > 0) {
          utterance.voice = premiumVoices[Math.floor(Math.random() * premiumVoices.length)];
        }

        utterance.pitch = text.toLowerCase().includes("bachchan") || text.toLowerCase().includes("big b") ? 0.7 : 1.05;
        utterance.rate = 0.95;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = performSpeech;
    } else {
      performSpeech();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "system") {
        speakText(lastMsg.text);
      }
    }
  }, [messages, voiceEnabled]);

  useEffect(() => {
    if (initialCommand) {
      handleTextCommand(initialCommand);
    }
  }, [initialCommand]);

  const handleTextCommand = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    const userMsg = text;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    const lower = userMsg.toLowerCase();
    setAgentPrompt(userMsg);
    setIsRouting(true);
    setMessages((prev) => [...prev, { role: "system", text: "Analyzing acoustic intent against Monad execution matrix..." }]);

    setTimeout(() => {
      const isBuy =
        lower.includes("buy") ||
        lower.includes("purchase") ||
        lower.includes("get") ||
        lower.includes("swap");
      const isSol = lower.includes("sol") || lower.includes("native") || lower.includes("mon");

      if (
        (lower.includes("create") ||
          lower.includes("make") ||
          lower.includes("build") ||
          lower.includes("generate") ||
          lower.includes("write")) &&
        (lower.includes("contract") || lower.includes("program") || lower.includes("token"))
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Recognized Smart Contract Synthesis intent. Launching Smart Contract Studio...",
            intent: "CONTRACT_SYNTHESIS",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("contract_creator");
          setIsRouting(false);
        }, 800);
      } else if (
        (lower.includes("optimize") ||
          lower.includes("analyze") ||
          lower.includes("audit") ||
          lower.includes("security")) &&
        lower.includes("contract")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Opening Security & Gas Optimizer module...",
            intent: "SECURITY_AUDIT",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("optimizer");
          setIsRouting(false);
        }, 800);
      } else if (
        lower.includes("hyperliquid") ||
        lower.includes("trade") ||
        lower.includes("perp") ||
        lower.includes("leverage") ||
        lower.includes("long") ||
        lower.includes("short")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Connecting to Hyperliquid Perps Trading Desk...",
            intent: "PERPS_TRADING",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("hyperliquid");
          setIsRouting(false);
        }, 800);
      } else if (
        lower.includes("network") ||
        lower.includes("tps") ||
        lower.includes("health") ||
        lower.includes("rpc") ||
        lower.includes("finality")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Streaming live Monad parallel execution telemetry...",
            intent: "TELEMETRY_RADAR",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("network");
          setIsRouting(false);
        }, 800);
      } else if (
        isBuy ||
        lower.includes("transaction") ||
        lower.includes("send") ||
        lower.includes("transfer") ||
        isSol ||
        lower.includes("balance") ||
        lower.includes("address") ||
        lower.includes("pay")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Routing transaction payload to Payment Nexus...",
            intent: "TRANSACTION_TRANSFER",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("transaction");
          setIsRouting(false);
        }, 800);
      } else if (
        lower.includes("gesture") ||
        lower.includes("sign") ||
        lower.includes("camera") ||
        lower.includes("vision") ||
        lower.includes("uic")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Initializing Computer Vision Accessibility interface...",
            intent: "GESTURE_VISION",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("uic");
          setIsRouting(false);
        }, 800);
      } else if (lower.includes("live") || lower.includes("chat") || lower.includes("talk")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Switching to full-duplex Awaz Live Studio...",
            intent: "FULL_DUPLEX_AUDIO",
          },
        ]);
        setTimeout(() => {
          setActiveAgent("conversational");
          setIsRouting(false);
        }, 800);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Intent recognized: General inquiry. You can command payments ('Send 1 MON'), contract builds ('Create ERC20 token'), or launch specialized desks.",
          },
        ]);
        setIsRouting(false);
        setAgentPrompt("");
      }
    }, 700);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleTextCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const agentConfig: Record<
    AgentId,
    { label: string; badge: string; category: string; description: string }
  > = {
    router: {
      label: "Autonomous Console",
      badge: "Core Router",
      category: "Operating System",
      description: "Central intent routing and acoustic command processing",
    },
    transaction: {
      label: "Transaction Nexus",
      badge: "Production",
      category: "DeFi Execution",
      description: "Direct MON payments, token swaps & gas estimation",
    },
    contract_creator: {
      label: "Smart Contract Studio",
      badge: "EVM Ready",
      category: "Development",
      description: "Natural language to Solidity bytecode synthesis",
    },
    hyperliquid: {
      label: "Hyperliquid Perps",
      badge: "Audited",
      category: "Trading Desk",
      description: "Voice-controlled high-leverage order books",
    },
    network: {
      label: "Monad Radar",
      badge: "Real-time",
      category: "Telemetry",
      description: "Sub-second block finality & parallel EVM metrics",
    },
    optimizer: {
      label: "Security & Gas",
      badge: "Static Analysis",
      category: "Auditing",
      description: "Vulnerability detection and opcode gas pruning",
    },
    conversational: {
      label: "Awaz Live Studio",
      badge: "Neural Core",
      category: "Voice Assistant",
      description: "Sub-200ms continuous voice dialogue with memory",
    },
    uic: {
      label: "Gesture Hub",
      badge: "Vision AI",
      category: "Accessibility",
      description: "Computer vision sign language to Web3 translation",
    },
    marketplace: {
      label: "Voice Clone NFT",
      badge: "Fish Audio",
      category: "Creator",
      description: "Synthesized AI voice agents & persona tokenization",
    },
    explore: {
      label: "Ecosystem Hub",
      badge: "Monad Blitz",
      category: "Discovery",
      description: "Curated Monad testnet protocols and developer tools",
    },
  };

  const navigationTabs: { id: AgentId; label: string }[] = [
    { id: "router", label: "Console" },
    { id: "transaction", label: "Payments" },
    { id: "contract_creator", label: "Contract Studio" },
    { id: "hyperliquid", label: "Perps Desk" },
    { id: "network", label: "Telemetry" },
    { id: "conversational", label: "Live Voice" },
    { id: "uic", label: "Gesture Hub" },
    { id: "marketplace", label: "Voice Market" },
    { id: "explore", label: "Ecosystem" },
  ];

  // Workspace subheader when inside an agent
  const WorkspaceBreadcrumb = () => {
    const current = agentConfig[activeAgent];
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          marginBottom: "20px",
          background: "rgba(14, 20, 32, 0.65)",
          border: "1px solid var(--border-medium)",
          borderRadius: "12px",
          backdropFilter: "blur(16px)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              stopSpeech();
              setActiveAgent("router");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#cbd5e1",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "var(--monad-purple)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#cbd5e1";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <span>←</span>
            <span>Console</span>
          </button>

          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>/</span>

          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.88rem" }}>
            {current.label}
          </span>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              background: "rgba(131, 110, 249, 0.12)",
              border: "1px solid rgba(131, 110, 249, 0.3)",
              color: "#c4b5fd",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {current.badge}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "#64748b",
            }}
          >
            Parallel EVM • Monad Testnet
          </span>
        </div>
      </div>
    );
  };

  const renderAgentContent = () => {
    const commonProps = {
      onSpeak: speakText,
      onStopSpeech: stopSpeech,
      initialCommand: agentPrompt,
    };

    switch (activeAgent) {
      case "transaction":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <TransactionAgent {...commonProps} />
          </div>
        );
      case "contract_creator":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <SmartContractCreator {...commonProps} />
          </div>
        );
      case "network":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <NetworkAnalyzer {...commonProps} />
          </div>
        );
      case "optimizer":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <SmartContractOptimizer {...commonProps} />
          </div>
        );
      case "marketplace":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <VoiceAgentMarketplace onSelectAgent={() => {}} onStopSpeech={stopSpeech} />
          </div>
        );
      case "uic":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <UICAgent
              onSpeak={speakText}
              onStopSpeech={stopSpeech}
              onAction={(agent: any, command) => {
                setAgentPrompt(command);
                setActiveAgent(agent);
              }}
            />
          </div>
        );
      case "conversational":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <ConversationalAgent onStopSpeech={stopSpeech} isLiveOnMount={true} />
          </div>
        );
      case "explore":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <ExploreSection />
          </div>
        );
      case "hyperliquid":
        return (
          <div className="agent-stage">
            <WorkspaceBreadcrumb />
            <HyperliquidAgent {...commonProps} />
          </div>
        );

      default:
        // Main Autonomous Console
        return (
          <div className="console-wrapper">
            {/* Top Acoustic Centerpiece */}
            <div className="console-hero">
              <VoiceCommandHub
                size="large"
                onCommand={(cmd) => {
                  stopSpeech();
                  handleTextCommand(cmd);
                }}
              />
            </div>

            {/* Quick Command Suggestions */}
            <div className="suggestions-bar">
              <span className="suggestions-label font-mono">Suggested intents:</span>
              <div className="suggestions-chips">
                {[
                  { label: "Send 0.5 MON", cmd: "Send 0.5 MON to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
                  { label: "Create ERC20 Token", cmd: "Create an ERC20 token named PirateMON" },
                  { label: "Hyperliquid Trading", cmd: "Open Hyperliquid Perps Desk" },
                  { label: "Monad Network Radar", cmd: "Check Monad network health" },
                  { label: "Continuous Voice Studio", cmd: "Start Awaz Live voice session" },
                  { label: "Sign Language Hub", cmd: "Open Gesture Interface" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="suggestion-pill"
                    onClick={() => handleTextCommand(item.cmd)}
                  >
                    <span className="font-mono prompt-symbol">&gt;</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modern Interactive Execution Console Stream */}
            <div className="terminal-panel">
              {/* Terminal Titlebar */}
              <div className="terminal-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="terminal-title font-mono">AWAZ://EXECUTION_STREAM • TESTNET_10143</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Voice synthesis toggle */}
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="audio-toggle-btn font-mono"
                    title={voiceEnabled ? "Mute audio synthesis" : "Enable audio synthesis"}
                  >
                    <span style={{ color: voiceEnabled ? "var(--emerald-beacon)" : "#94a3b8" }}>
                      {voiceEnabled ? "AUDIO: ON" : "AUDIO: MUTED"}
                    </span>
                    <span style={{ fontSize: "0.8rem" }}>{voiceEnabled ? "🔊" : "🔇"}</span>
                  </button>

                  <button
                    onClick={() =>
                      setMessages([
                        {
                          role: "system",
                          text: "Execution stream reset. Standing by for voice or text prompt.",
                        },
                      ])
                    }
                    className="clear-stream-btn font-mono"
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              {/* Console Message Stream */}
              <div className="stream-viewport">
                {messages.map((m, i) => (
                  <div key={i} className={`stream-entry ${m.role}`}>
                    <div className="entry-header">
                      <span className="entry-sender font-mono">
                        {m.role === "system" ? "AWAZ NEURAL AGENT" : "USER TRANSACTION PROMPT"}
                      </span>
                      {m.intent && (
                        <span className="intent-badge font-mono">{m.intent}</span>
                      )}
                    </div>

                    <div className="entry-body">
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Integrated Command Input Bar */}
              <div className="terminal-input-bar">
                <span className="input-prompt font-mono">&gt;</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type an intent (e.g., 'Transfer 0.1 MON to 0x...', 'Synthesize token', 'Open perps')..."
                  className="terminal-text-input font-sans"
                />
                <button onClick={handleSend} className="terminal-send-btn">
                  <span>Execute</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Specialized Modules Grid */}
            <div className="modules-section">
              <div className="modules-header">
                <div>
                  <h3 className="modules-heading">Autonomous Module Fleet</h3>
                  <p className="modules-sub">Direct access to specialized Monad execution desks</p>
                </div>
              </div>

              <div className="modules-grid">
                {(
                  [
                    "transaction",
                    "contract_creator",
                    "hyperliquid",
                    "network",
                    "optimizer",
                    "conversational",
                    "uic",
                    "marketplace",
                    "explore",
                  ] as AgentId[]
                ).map((id) => {
                  const item = agentConfig[id];
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        stopSpeech();
                        setActiveAgent(id);
                      }}
                      className="module-card"
                    >
                      <div className="card-top">
                        <span className="card-category font-mono">{item.category}</span>
                        <span className="card-badge font-mono">{item.badge}</span>
                      </div>
                      <h4 className="card-title">{item.label}</h4>
                      <p className="card-desc">{item.description}</p>
                      <div className="card-action">
                        <span>Open Workspace</span>
                        <span className="action-arrow">→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="master-router-wrapper">
      {/* Workspace Quick Navigation Bar */}
      <nav aria-label="Workspace Navigation" className="workspace-nav">
        <div className="nav-tabs-scroll">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                stopSpeech();
                setActiveAgent(tab.id);
              }}
              className={`nav-tab-btn ${activeAgent === tab.id ? "active" : ""}`}
            >
              <span>{tab.label}</span>
              {activeAgent === tab.id && <span className="active-pill-dot" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Routing Loading Overlay */}
      {isRouting && (
        <div className="routing-modal">
          <div className="routing-spinner" />
          <div style={{ textAlign: "center" }}>
            <h4 style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 700, marginBottom: "4px" }}>
              Routing Execution Intent
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
              Decomposing natural speech into verified Monad calldata...
            </p>
          </div>
        </div>
      )}

      {/* Main Workspace Stage */}
      {renderAgentContent()}

      {/* Embedded CSS */}
      <style jsx>{`
        .master-router-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Workspace Top Nav */
        .workspace-nav {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 12px;
          overflow-x: auto;
        }

        .nav-tabs-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: max-content;
        }

        .nav-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          font-size: 0.84rem;
          font-weight: 600;
          transition: all 0.15s ease;
        }

        .nav-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-tab-btn.active {
          color: #ffffff;
          background: rgba(131, 110, 249, 0.14);
          border: 1px solid rgba(131, 110, 249, 0.4);
        }

        .active-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--neon-cyan);
          box-shadow: 0 0 6px var(--neon-cyan);
        }

        /* Console Hero */
        .console-hero {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        /* Suggestions Bar */
        .suggestions-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }

        .suggestions-label {
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .suggestions-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          max-width: 820px;
        }

        .suggestion-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          background: rgba(14, 20, 32, 0.6);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .suggestion-pill:hover {
          background: rgba(22, 30, 48, 0.85);
          border-color: rgba(131, 110, 249, 0.4);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .prompt-symbol {
          color: var(--monad-purple);
          font-weight: 700;
        }

        /* Terminal Window */
        .terminal-panel {
          background: rgba(8, 12, 20, 0.85);
          border: 1px solid var(--border-medium);
          border-radius: 14px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: hidden;
          margin-bottom: 40px;
        }

        .terminal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 18px;
          background: rgba(14, 20, 32, 0.9);
          border-bottom: 1px solid var(--border-subtle);
        }

        .terminal-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .terminal-dot.red { background: #f43f5e; }
        .terminal-dot.yellow { background: #f59e0b; }
        .terminal-dot.green { background: #10b981; }

        .terminal-title {
          font-size: 0.72rem;
          color: #94a3b8;
          letter-spacing: 0.05em;
          margin-left: 6px;
        }

        .audio-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-size: 0.72rem;
          cursor: pointer;
        }

        .clear-stream-btn {
          padding: 4px 10px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: #64748b;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .clear-stream-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .stream-viewport {
          padding: 20px;
          min-height: 200px;
          max-height: 320px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stream-entry {
          padding: 12px 16px;
          border-radius: 10px;
          max-width: 90%;
          line-height: 1.55;
          font-size: 0.88rem;
          animation: fadeIn 0.2s ease-out;
        }

        .stream-entry.system {
          align-self: flex-start;
          background: rgba(14, 20, 32, 0.7);
          border: 1px solid var(--border-subtle);
          color: #e2e8f0;
        }

        .stream-entry.user {
          align-self: flex-end;
          background: rgba(131, 110, 249, 0.16);
          border: 1px solid rgba(131, 110, 249, 0.35);
          color: #ffffff;
        }

        .entry-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }

        .entry-sender {
          font-size: 0.68rem;
          color: #836ef9;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .intent-badge {
          font-size: 0.64rem;
          background: rgba(0, 240, 255, 0.12);
          border: 1px solid rgba(0, 240, 255, 0.3);
          color: #38bdf8;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .terminal-input-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          background: rgba(10, 14, 23, 0.95);
          border-top: 1px solid var(--border-subtle);
        }

        .input-prompt {
          color: var(--neon-cyan);
          font-weight: 800;
          font-size: 1rem;
        }

        .terminal-text-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.92rem;
          outline: none;
        }

        .terminal-text-input::placeholder {
          color: #64748b;
        }

        .terminal-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-purple-dark) 100%);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(131, 110, 249, 0.3);
        }

        .terminal-send-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        /* Modules Fleet Section */
        .modules-section {
          margin-top: 20px;
        }

        .modules-header {
          margin-bottom: 20px;
        }

        .modules-heading {
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .modules-sub {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 2px;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .module-card {
          background: rgba(14, 20, 32, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .module-card:hover {
          background: rgba(20, 28, 44, 0.8);
          border-color: rgba(131, 110, 249, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.5);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-category {
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .card-badge {
          font-size: 0.66rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #c4b5fd;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .card-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 16px;
          flex: 1;
        }

        .card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--monad-purple);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .action-arrow {
          transition: transform 0.15s ease;
        }
        .module-card:hover .action-arrow {
          transform: translateX(4px);
        }

        /* Routing Modal */
        .routing-modal {
          position: fixed;
          inset: 0;
          background: rgba(6, 8, 13, 0.92);
          backdrop-filter: blur(20px);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .routing-spinner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(131, 110, 249, 0.2);
          border-top-color: var(--neon-cyan);
          border-right-color: var(--monad-purple);
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .agent-stage {
          width: 100%;
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
