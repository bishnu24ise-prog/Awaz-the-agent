"use client";

interface GeetLogoProps {
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  showBadge?: boolean;
}

export function GeetLogo({ size = "medium", onClick, showBadge = true }: GeetLogoProps) {
  const isSmall = size === "small";
  const isLarge = size === "large";

  const markSize = isSmall ? 32 : isLarge ? 48 : 38;
  const fontSize = isSmall ? "1.2rem" : isLarge ? "2rem" : "1.5rem";

  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? "10px" : "14px",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.opacity = "1";
      }}
    >
      {/* Precision Geometric Mark */}
      <div
        style={{
          width: `${markSize}px`,
          height: `${markSize}px`,
          borderRadius: isSmall ? "9px" : "12px",
          background: "linear-gradient(135deg, #181d2c 0%, #0d111b 100%)",
          border: "1px solid rgba(131, 110, 249, 0.4)",
          boxShadow: "0 4px 16px rgba(131, 110, 249, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sleek SVG Waveform Icon */}
        <svg
          width={isSmall ? "18" : isLarge ? "26" : "22"}
          height={isSmall ? "18" : isLarge ? "26" : "22"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3V21M7 7V17M17 7V17M2 11V13M22 11V13"
            stroke="url(#geet-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="geet-grad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#836EF9" />
              <stop offset="0.5" stopColor="#A78BFA" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typographic Identity */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Geet
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: "#836ef9",
              background: "rgba(131, 110, 249, 0.1)",
              border: "1px solid rgba(131, 110, 249, 0.25)",
              padding: "2px 6px",
              borderRadius: "4px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Monad OS
          </span>
        </div>

        {showBadge && (
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "var(--font-mono)",
              color: "#64748b",
              fontWeight: 600,
              letterSpacing: "0.02em",
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ color: "#f59e0b" }}>⚓</span>
            <span>Team Pixel Pirates</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default GeetLogo;
