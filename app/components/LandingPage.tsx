"use client";

import { useState, useEffect } from "react";
import GeetLogo from "./GeetLogo";
import VoiceCommandHub from "./VoiceCommandHub";

interface LandingPageProps {
  onExplore: (initialCommand?: string) => void;
}

export default function LandingPage({ onExplore }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "defi" | "dev" | "ai">("all");
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const agents = [
    {
      id: "transaction",
      category: "defi",
      title: "Transaction Nexus",
      status: "Production",
      tagline: "Autonomous Payment Routing",
      desc: "Route native MON transfers, token swaps, and multi-recipient distributions through voice prompts with automatic gas profiling.",
      command: "Send 1.5 MON to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      metrics: "Sub-second gas estimation",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: "hyperliquid",
      category: "defi",
      title: "Hyperliquid Perps Desk",
      status: "Audited",
      tagline: "Voice-Activated Order Books",
      desc: "Execute leveraged long/short positions on Monad and Hyperliquid with automated AI stop-loss guardrails and margin checks.",
      command: "Open Hyperliquid Perps Desk",
      metrics: "Cross-margin risk checks",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
    },
    {
      id: "contract_creator",
      category: "dev",
      title: "Smart Contract Studio",
      status: "EVM Ready",
      tagline: "Speech to Verified Bytecode",
      desc: "Synthesize and test ERC-20, staking vaults, and governance contracts on Monad EVM directly from natural descriptions.",
      command: "Create an ERC20 token named PirateMON",
      metrics: "Solidity 0.8.24 + Foundry",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
      ),
    },
    {
      id: "network",
      category: "dev",
      title: "Monad Telemetry Radar",
      status: "Live Stream",
      tagline: "Parallel Consensus Profiler",
      desc: "Real-time RPC health monitoring, sub-second block finality inspection, gas price indices, and parallel execution profiling.",
      command: "Check Monad network health",
      metrics: "10,000+ testnet TPS",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
    },
    {
      id: "conversational",
      category: "ai",
      title: "Awaz Live Studio",
      status: "Neural Core",
      tagline: "Continuous AI Assistant",
      desc: "Full-duplex conversational voice assistant with sub-200ms latency, context memory, and protocol-level documentation awareness.",
      command: "Start Awaz Live voice session",
      metrics: "< 180ms latency",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      ),
    },
    {
      id: "uic",
      category: "ai",
      title: "Sign Language Hub",
      status: "Accessibility",
      tagline: "Computer Vision Interface",
      desc: "Inclusive gesture and sign language recognition that translates physical gestures into deterministic Web3 transactions.",
      command: "Open Gesture Interface",
      metrics: "Non-verbal execution",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      ),
    },
  ];

  const filteredAgents =
    selectedCategory === "all" ? agents : agents.filter((a) => a.category === selectedCategory);

  const sampleCommands = [
    { label: "Transfer MON", cmd: "Send 1.5 MON" },
    { label: "Synthesize Token", cmd: "Create an ERC20 token named PirateMON" },
    { label: "Hyperliquid Trading", cmd: "Open Hyperliquid Perps Desk" },
    { label: "Inspect RPC Health", cmd: "Check Monad network health" },
    { label: "Launch Live Studio", cmd: "Start Awaz Live voice session" },
  ];

  // Interactive Live Calldata Demos
  const interactiveDemos = [
    {
      title: "Native MON Distribution",
      voiceInput: 'Send 1.5 MON to 0x742d...f44e',
      selector: "transfer(address,uint256)",
      calldata: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e00000000000000000000000000000000000000000000000014d1120d7b160000",
      gasEstimate: "21,000 gas • 1.2 Gwei",
      concurrency: "OCC Async State Track",
      command: "Send 1.5 MON to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
    {
      title: "ERC-20 Smart Contract Synthesis",
      voiceInput: 'Create an ERC20 token named PirateMON symbol PMON',
      selector: "constructor(string,string,uint256)",
      calldata: "0x608060405234801561001057600080fd5b506040516109f23803806109f283398101604081905261002f91610214565b600080546001600160a01b03191633179055...",
      gasEstimate: "842,109 gas • Parallel Deploy",
      concurrency: "Pipelined Bytecode Generation",
      command: "Create an ERC20 token named PirateMON",
    },
    {
      title: "Hyperliquid Perps Market Order",
      voiceInput: 'Open 5x Long on ETH with 2 MON collateral',
      selector: "executePerpOrder(uint32,bool,uint64,uint64)",
      calldata: "0x4b728a1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000005...",
      gasEstimate: "64,200 gas • Sub-second Fill",
      concurrency: "High-Frequency L1 Bridge",
      command: "Open Hyperliquid Perps Desk",
    },
  ];

  const handleLaunch = (cmd?: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    onExplore(cmd);
  };

  const [showConsent, setShowConsent] = useState(true);

  return (
    <div className="landing-container">
      {/* Precision Ambient Cyber Arc Light Rays (Matching Reference) */}
      <div className="bg-cyber-arcs-hero" />
      <div className="bg-bloom-core" />
      <div className="bg-ambient" />
      <div className="bg-dot-grid" />

      {/* Modern High-Impact Header */}
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <GeetLogo size="medium" onClick={() => handleLaunch()} showBadge={false} />

          <nav aria-label="Main Navigation" className="desktop-nav">
            <a href="#demo" className="nav-link">Terminal</a>
            <a href="#agents" className="nav-link">Agent Fleet</a>
            <a href="#architecture" className="nav-link">Architecture</a>
            <a href="#pirates" className="nav-link">Pixel Pirates</a>
            <a href="#metrics" className="nav-link">Network</a>
          </nav>

          <div className="header-actions">
            <div className="status-pill">
              <span className="beacon-dot" />
              <span>Monad Testnet 10143</span>
            </div>

            <button className="btn-launch" onClick={() => handleLaunch()}>
              <span>Enter Workspace</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero">
          {/* Top Pill Badge matching reference */}
          <div className="hero-badge">
            <span className="badge-icon">✦</span>
            <span className="badge-text font-mono">Revolutionizing Voice Finance</span>
            <span className="badge-sep">/</span>
            <span className="badge-sub font-mono">Monad Parallel EVM</span>
          </div>

          {/* High-Impact Headline matching reference */}
          <h1 className="hero-title">
            Innovative Voice Financial Solutions <br />
            <span className="shimmer-text">For Any Investment Challenge</span>
          </h1>

          <p className="hero-subtitle">
            We don&apos;t just route transactions. We power your entire decentralized portfolio with voice-controlled
            perpetuals, instant token distributions, and autonomous smart contract synthesis.
          </p>

          {/* Central Glass CTA Button matching 'Join Radika' in reference */}
          <div className="hero-cta-wrapper">
            <button className="btn-hero-glow" onClick={() => handleLaunch()}>
              <span>Launch Awaz Console</span>
              <span className="cta-arrow">→</span>
            </button>
          </div>

          {/* Central Voice Control */}
          <div className="voice-control-box">
            <VoiceCommandHub size="large" onCommand={(cmd) => handleLaunch(cmd)} />
          </div>

          {/* Interactive Prompt Pills */}
          <div className="prompts-bar">
            <span className="prompts-label">Instant voice commands:</span>
            <div className="prompts-list">
              {sampleCommands.map((item, idx) => (
                <button key={idx} className="prompt-btn" onClick={() => handleLaunch(item.cmd)}>
                  <span className="prompt-code font-mono">&gt;</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reference Image Scroll Indicator & Bottom Protocol Consent Bar */}
          <div className="hero-bottom-dock">
            <a href="#demo" className="scroll-indicator font-mono">
              <span>Scroll Down</span>
              <span className="scroll-arrow">↓</span>
            </a>

            {showConsent && (
              <div className="protocol-consent-pill">
                <div className="consent-left">
                  <span className="consent-icon">🛡️</span>
                  <span className="consent-text">
                    Client-side acoustic neural parsing &amp; zero-custody cryptographic signatures on Monad Testnet.
                  </span>
                </div>
                <div className="consent-actions">
                  <button className="consent-btn-decline" onClick={() => setShowConsent(false)}>
                    Decline
                  </button>
                  <button className="consent-btn-accept" onClick={() => { setShowConsent(false); handleLaunch(); }}>
                    Accept &amp; Launch
                  </button>
                </div>
              </div>
            )}

            <div className="hero-social-links font-mono">
              <a href="https://testnet.monadscan.com" target="_blank" rel="noreferrer" title="Monad Explorer">⬡ Scan</a>
              <a href="https://docs.monad.xyz" target="_blank" rel="noreferrer" title="Documentation">Docs</a>
              <a href="#pirates" title="Team Pixel Pirates">Pirates</a>
            </div>
          </div>

          {/* Live Telemetry Radar Strip */}
          <div id="metrics" className="metrics-strip">
            <div className="metric-cell">
              <div className="metric-value font-mono">10,000+</div>
              <div className="metric-label font-mono">TESTNET TPS</div>
            </div>
            <div className="metric-cell">
              <div className="metric-value font-mono">~800ms</div>
              <div className="metric-label font-mono">SINGLE-SLOT FINALITY</div>
            </div>
            <div className="metric-cell">
              <div className="metric-value font-mono">&lt; 180ms</div>
              <div className="metric-label font-mono">ACOUSTIC LATENCY</div>
            </div>
            <div className="metric-cell">
              <div className="metric-value font-mono">100%</div>
              <div className="metric-label font-mono">BYTECODE EQUIVALENT</div>
            </div>
          </div>
        </section>

        {/* Live Interactive Speech-to-Calldata Terminal Demo */}
        <section id="demo" className="section">
          <div className="section-head">
            <div className="section-eyebrow font-mono">INTERACTIVE ENGINE PREVIEW</div>
            <h2 className="section-heading">Speech to Parallel EVM Calldata</h2>
            <p className="section-subtext">
              Watch natural voice inputs instantly decompose into verified ABI calldata and concurrency profiles.
            </p>
          </div>

          <div className="demo-terminal">
            {/* Demo selector tabs */}
            <div className="demo-tabs">
              {interactiveDemos.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDemoIndex(idx)}
                  className={`demo-tab-btn ${activeDemoIndex === idx ? "active" : ""}`}
                >
                  <span className="demo-tab-index font-mono">0{idx + 1}</span>
                  <span>{demo.title}</span>
                </button>
              ))}
            </div>

            {/* Terminal Screen */}
            <div className="demo-screen">
              <div className="screen-header">
                <div style={{ display: "flex", gap: "6px" }}>
                  <span className="screen-dot red" />
                  <span className="screen-dot yellow" />
                  <span className="screen-dot green" />
                </div>
                <span className="screen-title font-mono">
                  MONAD_EVM_ROUTER // {interactiveDemos[activeDemoIndex].selector}
                </span>
                <span className="screen-live-tag font-mono">LIVE SYNTHESIS</span>
              </div>

              <div className="screen-content">
                {/* Voice Input Row */}
                <div className="screen-row">
                  <span className="screen-label font-mono">ACOUSTIC PROMPT:</span>
                  <div className="screen-voice-box">
                    <span className="voice-mic-icon">🎙️</span>
                    <span className="voice-quote font-sans">&quot;{interactiveDemos[activeDemoIndex].voiceInput}&quot;</span>
                  </div>
                </div>

                {/* Calldata Output */}
                <div className="screen-row">
                  <span className="screen-label font-mono">COMPILED CALLDATA:</span>
                  <div className="calldata-block font-mono">
                    {interactiveDemos[activeDemoIndex].calldata}
                  </div>
                </div>

                {/* Telemetry Footer */}
                <div className="screen-footer-telemetry">
                  <div>
                    <span className="telemetry-key font-mono">GAS BUDGET: </span>
                    <span className="telemetry-val font-mono">{interactiveDemos[activeDemoIndex].gasEstimate}</span>
                  </div>
                  <div>
                    <span className="telemetry-key font-mono">EXECUTION PATH: </span>
                    <span className="telemetry-val font-mono">{interactiveDemos[activeDemoIndex].concurrency}</span>
                  </div>
                  <button
                    className="demo-execute-btn"
                    onClick={() => handleLaunch(interactiveDemos[activeDemoIndex].command)}
                  >
                    <span>Execute Intent</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Autonomous Execution Matrix */}
        <section id="agents" className="section">
          <div className="section-head">
            <div className="section-eyebrow font-mono">SPECIALIZED FLEET</div>
            <h2 className="section-heading">Autonomous Execution Desks</h2>
            <p className="section-subtext">
              Awaz maps natural speech directly to verified smart contract payloads, executing across specialized agent modules.
            </p>

            <div className="category-filter">
              {(["all", "defi", "dev", "ai"] as const).map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? "All Modules" : cat === "defi" ? "DeFi Execution" : cat === "dev" ? "Dev Infrastructure" : "AI & Interface"}
                </button>
              ))}
            </div>
          </div>

          <div className="agents-matrix">
            {filteredAgents.map((ag) => (
              <div key={ag.id} className="agent-item" onClick={() => handleLaunch(ag.command)}>
                <div className="agent-item-header">
                  <div className="agent-icon-box">{ag.iconSvg}</div>
                  <span className="agent-status-tag font-mono">{ag.status}</span>
                </div>

                <div className="agent-tagline font-mono">{ag.tagline}</div>
                <h3 className="agent-name">{ag.title}</h3>
                <p className="agent-description">{ag.desc}</p>

                <div className="agent-command-preview font-mono">
                  <span className="preview-prefix">&gt;</span>
                  <span className="preview-cmd">&quot;{ag.command}&quot;</span>
                </div>

                <div className="agent-item-footer">
                  <span className="agent-metric font-mono">{ag.metrics}</span>
                  <div className="agent-item-action">
                    <span>Launch</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Architecture Pipeline */}
        <section id="architecture" className="section">
          <div className="section-head">
            <div className="section-eyebrow font-mono">CONSENSUS PIPELINE</div>
            <h2 className="section-heading">From Acoustic Input to Monad Finality</h2>
            <p className="section-subtext">
              Deterministic, safe, zero-custody voice pipeline built on top of parallelized EVM primitives.
            </p>
          </div>

          <div className="pipeline-grid">
            {[
              {
                step: "01",
                title: "Acoustic Neural Ingestion",
                detail: "Dual-stream Speech API with sub-80ms client-side acoustic feature extraction and dialect normalization.",
              },
              {
                step: "02",
                title: "Intent Verification Engine",
                detail: "Mandatory link-first validation. Analyzes gas parameters, recipient addresses, and slippage thresholds before prompting signature.",
              },
              {
                step: "03",
                title: "Bytecode & Calldata Synthesis",
                detail: "Synthesizes deterministic ABI calldata and prepares signed payloads for Monad JSON-RPC endpoint.",
              },
              {
                step: "04",
                title: "Parallel Monad Finality",
                detail: "Transactions settle at up to 10,000 TPS on Monad testnet with single-slot finality and sub-second confirmation.",
              },
            ].map((item, i) => (
              <div key={i} className="pipeline-card">
                <div className="pipeline-index font-mono">{item.step}</div>
                <h3 className="pipeline-step-title">{item.title}</h3>
                <p className="pipeline-step-detail">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Pixel Pirates Section */}
        <section id="pirates" className="section">
          <div className="team-pirates-banner">
            <div className="team-header-row">
              <div className="team-badge">
                <span style={{ color: "var(--electric-amber)" }}>⚓</span>
                <span className="font-mono">ENGINEERING LABS</span>
              </div>
              <span className="team-repo-tag font-mono">Pixel Pirates × Monad</span>
            </div>

            <h2 className="team-title">Engineered by Team Pixel Pirates.</h2>

            <p className="team-copy">
              We are Team Pixel Pirates — an engineering crew building next-generation infrastructure for high-throughput blockchains.
              Awaz eliminates the cognitive barrier of hexadecimal addresses, complex CLIs, and cumbersome wallet popups
              by giving Monad a voice-native execution layer.
            </p>

            <div className="creed-grid">
              <div className="creed-card">
                <h4 className="creed-title">Zero Silent Transactions</h4>
                <p className="creed-body">
                  Every voice intent is explicitly decomposed and previewed with full gas and destination clarity before user confirmation.
                </p>
              </div>
              <div className="creed-card">
                <h4 className="creed-title">Parallel EVM Optimization</h4>
                <p className="creed-body">
                  Architected to leverage Monad&apos;s parallelized execution engine, asynchronous state access, and high-frequency mempool.
                </p>
              </div>
              <div className="creed-card">
                <h4 className="creed-title">Accessibility By Design</h4>
                <p className="creed-body">
                  Integrated computer vision gesture engine (UIC) ensuring inclusive, non-verbal on-chain participation.
                </p>
              </div>
            </div>

            <div className="tech-stack-row font-mono">
              <span>Next.js 14</span>
              <span>•</span>
              <span>Ethers v6</span>
              <span>•</span>
              <span>Monad EVM</span>
              <span>•</span>
              <span>Fish Audio</span>
              <span>•</span>
              <span>Web Speech API</span>
              <span>•</span>
              <span>Team Pixel Pirates</span>
            </div>
          </div>
        </section>

        {/* Clean Call to Action */}
        <section className="section cta-section">
          <div className="cta-box">
            <h2 className="cta-heading">Ready to experience voice-native Web3?</h2>
            <p className="cta-copy">Launch Awaz and start commanding your Monad portfolio in seconds.</p>
            <button className="cta-btn" onClick={() => handleLaunch()}>
              <span>Launch Awaz Workspace</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <GeetLogo size="small" onClick={() => handleLaunch()} showBadge={false} />
            <p className="footer-blurb">
              Autonomous voice-native operating infrastructure for the Monad blockchain.
            </p>
            <div className="footer-credit font-mono">
              Engineered with precision by <strong>Team Pixel Pirates</strong>.
            </div>
          </div>

          <div className="footer-nav">
            <div className="footer-nav-col">
              <span className="col-heading font-mono">Modules</span>
              <a href="#agents" onClick={() => handleLaunch("Send MON")}>Transaction Nexus</a>
              <a href="#agents" onClick={() => handleLaunch("Open Hyperliquid")}>Hyperliquid Perps</a>
              <a href="#agents" onClick={() => handleLaunch("Create Contract")}>Smart Contract Studio</a>
              <a href="#agents" onClick={() => handleLaunch("Check Network")}>Monad Telemetry</a>
            </div>

            <div className="footer-nav-col">
              <span className="col-heading font-mono">Ecosystem</span>
              <a href="https://testnet.monadscan.com" target="_blank" rel="noreferrer">Monad Explorer</a>
              <a href="https://docs.monad.xyz" target="_blank" rel="noreferrer">Monad Docs</a>
              <a href="https://hyperliquid.xyz" target="_blank" rel="noreferrer">Hyperliquid L1</a>
              <a href="#pirates">Team Pixel Pirates</a>
            </div>

            <div className="footer-nav-col">
              <span className="col-heading font-mono">Network Specs</span>
              <span className="spec-item font-mono">Chain ID: 10143</span>
              <span className="spec-item font-mono">Consensus: MonadBFT</span>
              <span className="spec-item font-mono">Engine: Parallel EVM</span>
            </div>
          </div>
        </div>

        <div className="footer-sub">
          <span>© 2026 Awaz Protocol • Engineered by Team Pixel Pirates.</span>
          <span className="font-mono">Monad Blitz Hackathon • Production Deployment</span>
        </div>
      </footer>

      {/* Scoped CSS */}
      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-main);
          position: relative;
          overflow-x: hidden;
        }

        /* Fixed, Continuous Luminous Cyber Arcs Background - stays seamless on scroll */
        .bg-cyber-arcs-hero {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: 
            radial-gradient(circle at 50% 40%, rgba(0, 240, 255, 0.08) 0%, transparent 65%),
            radial-gradient(circle at 85% 85%, rgba(131, 110, 249, 0.06) 0%, transparent 55%),
            url('/images/landing-cyber-bg.jpg') no-repeat center center / cover;
          pointer-events: none;
          z-index: 0;
          opacity: 0.94;
        }

        /* Continuous Ambient Flare Bloom */
        .bg-bloom-core {
          position: fixed;
          top: 40vh;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 620px;
          height: 420px;
          background: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.18) 0%, rgba(94, 234, 212, 0.07) 35%, transparent 72%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 7s ease-in-out infinite;
        }

        /* Hero Central Glowing Button matching 'Join Radika' */
        .hero-cta-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .btn-hero-glow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 34px;
          border-radius: 9999px;
          background: rgba(14, 20, 32, 0.75);
          border: 1px solid rgba(0, 240, 255, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          color: #ffffff;
          font-size: 0.96rem;
          font-weight: 700;
          box-shadow: 0 0 28px rgba(0, 240, 255, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-hero-glow:hover {
          background: rgba(20, 30, 48, 0.9);
          border-color: rgba(94, 234, 212, 0.9);
          box-shadow: 0 0 45px rgba(0, 240, 255, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transform: translateY(-2px) scale(1.02);
        }

        .cta-arrow {
          font-size: 1.1rem;
          color: var(--neon-cyan);
          transition: transform 0.2s ease;
        }
        .btn-hero-glow:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* Hero Bottom Dock (Scroll Indicator + Consent Bar + Socials) */
        .hero-bottom-dock {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1140px;
          margin: 30px auto 40px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .scroll-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: rgba(14, 20, 32, 0.6);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.76rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .scroll-indicator:hover {
          color: #ffffff;
          border-color: rgba(0, 240, 255, 0.4);
        }

        .scroll-arrow {
          animation: bounceDown 2s infinite;
        }

        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        .protocol-consent-pill {
          flex: 1;
          min-width: 320px;
          max-width: 680px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 8px 14px 8px 18px;
          border-radius: 9999px;
          background: rgba(10, 16, 26, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .consent-left {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }

        .consent-icon {
          font-size: 1rem;
        }

        .consent-text {
          font-size: 0.74rem;
          color: #cbd5e1;
          line-height: 1.4;
        }

        .consent-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .consent-btn-decline {
          padding: 5px 12px;
          border-radius: 9999px;
          background: transparent;
          color: #94a3b8;
          font-size: 0.74rem;
          font-weight: 600;
          transition: color 0.15s ease;
        }
        .consent-btn-decline:hover {
          color: #ffffff;
        }

        .consent-btn-accept {
          padding: 5px 14px;
          border-radius: 9999px;
          background: #ffffff;
          color: #06080d;
          font-size: 0.74rem;
          font-weight: 700;
          transition: all 0.15s ease;
        }
        .consent-btn-accept:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .hero-social-links {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .hero-social-links a {
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(14, 20, 32, 0.6);
          border: 1px solid var(--border-subtle);
          transition: all 0.2s ease;
        }

        .hero-social-links a:hover {
          color: #ffffff;
          border-color: rgba(0, 240, 255, 0.4);
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(6, 8, 13, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .header.scrolled {
          background: rgba(6, 8, 13, 0.96);
          border-bottom: 1px solid var(--border-medium);
        }

        .header-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 500;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .btn-launch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
          color: #06080d;
          font-weight: 700;
          font-size: 0.86rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.12);
        }

        .btn-launch:hover {
          background: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25);
        }

        /* Hero */
        .hero {
          max-width: 980px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(14, 20, 32, 0.8);
          border: 1px solid var(--border-medium);
          font-size: 0.74rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .badge-icon {
          color: var(--neon-cyan);
        }

        .badge-sep {
          color: #475569;
        }

        .badge-sub {
          color: var(--text-muted);
        }

        .hero-title {
          font-size: clamp(2.8rem, 6vw, 4.6rem);
          font-weight: 800;
          line-height: 1.08;
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.22rem);
          color: var(--text-muted);
          max-width: 680px;
          margin: 0 auto 36px;
          line-height: 1.6;
          font-weight: 400;
        }

        .voice-control-box {
          margin-bottom: 28px;
        }

        .prompts-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 50px;
        }

        .prompts-label {
          font-size: 0.72rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .prompts-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          max-width: 820px;
        }

        .prompt-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          background: rgba(14, 20, 32, 0.6);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-size: 0.82rem;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .prompt-btn:hover {
          background: rgba(22, 30, 48, 0.9);
          border-color: rgba(131, 110, 249, 0.4);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .prompt-code {
          color: var(--monad-purple);
          font-weight: 700;
        }

        /* Metrics Strip */
        .metrics-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          max-width: 860px;
          margin: 0 auto;
        }

        .metric-cell {
          background: var(--bg-surface);
          padding: 22px 18px;
          text-align: center;
        }

        .metric-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Section Layout */
        .section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 70px 24px;
          position: relative;
          z-index: 10;
        }

        .section-head {
          max-width: 660px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .section-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--neon-cyan);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .section-heading {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: -0.03em;
        }

        .section-subtext {
          color: var(--text-muted);
          font-size: 0.98rem;
          line-height: 1.6;
        }

        /* Demo Terminal Component */
        .demo-terminal {
          background: rgba(8, 12, 20, 0.85);
          border: 1px solid var(--border-medium);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          max-width: 960px;
          margin: 0 auto;
        }

        .demo-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(14, 20, 32, 0.8);
          overflow-x: auto;
        }

        .demo-tab-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-muted);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .demo-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
        }

        .demo-tab-btn.active {
          color: #ffffff;
          border-bottom-color: var(--neon-cyan);
          background: rgba(0, 240, 255, 0.05);
        }

        .demo-tab-index {
          font-size: 0.72rem;
          color: var(--neon-cyan);
          background: rgba(0, 240, 255, 0.12);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .demo-screen {
          padding: 20px 24px;
        }

        .screen-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .screen-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .screen-dot.red { background: #f43f5e; }
        .screen-dot.yellow { background: #f59e0b; }
        .screen-dot.green { background: #10b981; }

        .screen-title {
          font-size: 0.74rem;
          color: #cbd5e1;
        }

        .screen-live-tag {
          font-size: 0.68rem;
          color: var(--emerald-beacon);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 1px 7px;
          border-radius: 4px;
        }

        .screen-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .screen-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .screen-label {
          font-size: 0.7rem;
          color: #64748b;
          letter-spacing: 0.06em;
        }

        .screen-voice-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(14, 20, 32, 0.8);
          border: 1px solid rgba(131, 110, 249, 0.25);
          border-radius: 8px;
        }

        .voice-mic-icon {
          font-size: 1rem;
        }

        .voice-quote {
          color: #f8fafc;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .calldata-block {
          padding: 12px 14px;
          background: rgba(6, 8, 13, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: #38bdf8;
          font-size: 0.78rem;
          word-break: break-all;
          line-height: 1.5;
        }

        .screen-footer-telemetry {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 12px;
        }

        .telemetry-key {
          font-size: 0.72rem;
          color: #64748b;
        }

        .telemetry-val {
          font-size: 0.76rem;
          color: #cbd5e1;
        }

        .demo-execute-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-purple-dark) 100%);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(131, 110, 249, 0.3);
        }

        .demo-execute-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        /* Category Filter */
        .category-filter {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 6px 14px;
          border-radius: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.15s ease;
        }

        .category-btn.active, .category-btn:hover {
          background: rgba(131, 110, 249, 0.15);
          border-color: rgba(131, 110, 249, 0.4);
          color: #ffffff;
        }

        /* Agents Matrix */
        .agents-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .agent-item {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          padding: 24px;
          cursor: pointer;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .agent-item:hover {
          background: var(--bg-card-hover);
          border-color: rgba(131, 110, 249, 0.45);
          transform: translateY(-2px);
          box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(131, 110, 249, 0.12);
        }

        .agent-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .agent-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(131, 110, 249, 0.12);
          border: 1px solid rgba(131, 110, 249, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c4b5fd;
        }

        .agent-status-tag {
          font-size: 0.68rem;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .agent-tagline {
          font-size: 0.72rem;
          color: var(--neon-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .agent-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .agent-description {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }

        .agent-command-preview {
          background: rgba(6, 8, 13, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 0.78rem;
          color: #cbd5e1;
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-prefix {
          color: var(--monad-purple);
          font-weight: 700;
        }

        .agent-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .agent-metric {
          font-size: 0.72rem;
          color: #64748b;
        }

        .agent-item-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--monad-purple);
        }

        .arrow {
          transition: transform 0.15s ease;
        }
        .agent-item:hover .arrow {
          transform: translateX(4px);
        }

        /* Pipeline Grid */
        .pipeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }

        .pipeline-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 24px;
          position: relative;
        }

        .pipeline-index {
          font-size: 1.8rem;
          font-weight: 800;
          color: rgba(131, 110, 249, 0.3);
          margin-bottom: 12px;
        }

        .pipeline-step-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .pipeline-step-detail {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        /* Team Pirates Section */
        .team-pirates-banner {
          background: linear-gradient(135deg, rgba(14, 20, 32, 0.9) 0%, rgba(20, 28, 44, 0.9) 100%);
          border: 1px solid var(--border-medium);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .team-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .team-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #cbd5e1;
        }

        .team-repo-tag {
          font-size: 0.72rem;
          color: #836ef9;
          background: rgba(131, 110, 249, 0.1);
          border: 1px solid rgba(131, 110, 249, 0.25);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .team-title {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .team-copy {
          color: var(--text-muted);
          font-size: 0.96rem;
          line-height: 1.6;
          max-width: 780px;
          margin-bottom: 28px;
        }

        .creed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .creed-card {
          background: rgba(6, 8, 13, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 18px;
        }

        .creed-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .creed-body {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .tech-stack-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: center;
          font-size: 0.74rem;
          color: #64748b;
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }

        /* CTA */
        .cta-section {
          padding-top: 20px;
        }

        .cta-box {
          text-align: center;
          background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(131, 110, 249, 0.15), rgba(6, 8, 13, 0.8));
          border: 1px solid var(--border-medium);
          border-radius: 20px;
          padding: 60px 24px;
        }

        .cta-heading {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: -0.03em;
        }

        .cta-copy {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 28px;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 10px;
          background: #ffffff;
          color: #06080d;
          font-weight: 800;
          font-size: 0.92rem;
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25);
          transition: all 0.2s ease;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4);
        }

        /* Footer */
        .footer {
          border-top: 1px solid var(--border-subtle);
          background: rgba(6, 8, 13, 0.9);
          padding: 60px 24px 30px;
          position: relative;
          z-index: 10;
        }

        .footer-content {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .footer-left {
          max-width: 320px;
        }

        .footer-blurb {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin: 12px 0 16px;
          line-height: 1.55;
        }

        .footer-credit {
          font-size: 0.74rem;
          color: #64748b;
        }

        .footer-nav {
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
        }

        .footer-nav-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .col-heading {
          font-size: 0.74rem;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .footer-nav-col a {
          color: var(--text-muted);
          font-size: 0.84rem;
          transition: color 0.15s ease;
        }
        .footer-nav-col a:hover {
          color: var(--neon-cyan);
        }

        .spec-item {
          font-size: 0.78rem;
          color: #64748b;
        }

        .footer-sub {
          max-width: 1240px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #475569;
          font-size: 0.74rem;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .metrics-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .team-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
