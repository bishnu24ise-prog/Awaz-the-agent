"use client";

import { useState, useEffect, useRef } from "react";

interface VoiceCommandHubProps {
  onCommand?: (text: string) => void;
  onStopSpeech?: () => void;
  size?: "small" | "large";
}

export default function VoiceCommandHub({
  onCommand,
  onStopSpeech,
  size = "large",
}: VoiceCommandHubProps) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setInterimText("");
          startAudioAnalysis();
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInterimText(currentTranscript);

          if (event.results[0].isFinal) {
            onCommand?.(currentTranscript);
            setIsListening(false);
            stopAudioAnalysis();
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          stopAudioAnalysis();
        };

        recognition.onend = () => {
          setIsListening(false);
          stopAudioAnalysis();
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopAudioAnalysis();
    };
  }, [onCommand]);

  // Audio stream visualizer using Web Audio API
  const startAudioAnalysis = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(avg / 128); // 0 to 1
          animFrameRef.current = requestAnimationFrame(checkAudio);
        };
        checkAudio();
      }
    } catch {
      // Audio capture failed or denied — fallback handled in canvas
    }
  };

  const stopAudioAnalysis = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    setAudioLevel(0);
  };

  // Keyboard shortcut: Spacebar trigger when not in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.code === "Space" && e.ctrlKey && !isInput) {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isListening]);

  // Smooth Canvas Waveform Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = size === "large" ? 28 : 16;
      const barWidth = 3;
      const gap = (width - numBars * barWidth) / (numBars - 1);

      phase += 0.08;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + gap);
        let amplitude: number;

        if (isListening) {
          // Dynamic reacting wave with frequency envelope
          const normalizedDist = 1 - Math.abs((i - numBars / 2) / (numBars / 2));
          const wave = Math.sin(phase + i * 0.35) * 0.5 + 0.5;
          const boost = Math.max(0.2, audioLevel * 1.6);
          amplitude = Math.max(4, wave * height * 0.8 * boost * normalizedDist);
        } else {
          // Subtle resting ambient pulse
          const subtle = Math.sin(phase * 0.5 + i * 0.2) * 0.5 + 0.5;
          amplitude = 3 + subtle * 4;
        }

        const y = (height - amplitude) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + amplitude);
        if (isListening) {
          grad.addColorStop(0, "#00f0ff");
          grad.addColorStop(0.5, "#836ef9");
          grad.addColorStop(1, "#f43f5e");
        } else {
          grad.addColorStop(0, "rgba(131, 110, 249, 0.4)");
          grad.addColorStop(1, "rgba(0, 240, 255, 0.6)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, amplitude, 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isListening, audioLevel, size]);

  const toggleListening = () => {
    onStopSpeech?.();
    if (!recognitionRef.current) {
      const simulated = prompt("Speech Recognition API unavailable in this browser. Enter voice command:");
      if (simulated) onCommand?.(simulated);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      stopAudioAnalysis();
    } else {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition already started or busy
      }
    }
  };

  const isLarge = size === "large";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}>
      {/* Central Acoustic Control Core */}
      <div
        onClick={toggleListening}
        role="button"
        tabIndex={0}
        aria-label={isListening ? "Listening to voice command. Click to finish." : "Click to speak voice command"}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: isLarge ? "20px" : "12px",
          padding: isLarge ? "14px 28px" : "8px 18px",
          borderRadius: "9999px",
          background: isListening
            ? "linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(131, 110, 249, 0.18) 100%)"
            : "linear-gradient(135deg, rgba(14, 20, 32, 0.88) 0%, rgba(20, 28, 44, 0.88) 100%)",
          border: isListening
            ? "1px solid rgba(244, 63, 94, 0.6)"
            : "1px solid rgba(131, 110, 249, 0.35)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          cursor: "pointer",
          boxShadow: isListening
            ? "0 0 40px rgba(244, 63, 94, 0.3), inset 0 0 20px rgba(131, 110, 249, 0.2)"
            : "0 12px 36px -8px rgba(0, 0, 0, 0.6), 0 0 24px rgba(131, 110, 249, 0.12)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          if (!isListening) {
            e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.6)";
            e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
            e.currentTarget.style.boxShadow = "0 16px 44px -8px rgba(0, 0, 0, 0.7), 0 0 32px rgba(131, 110, 249, 0.25)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isListening) {
            e.currentTarget.style.borderColor = "rgba(131, 110, 249, 0.35)";
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 12px 36px -8px rgba(0, 0, 0, 0.6), 0 0 24px rgba(131, 110, 249, 0.12)";
          }
        }}
      >
        {/* Dynamic Acoustic Beacon / Orb */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isListening && (
            <div
              style={{
                position: "absolute",
                inset: "-8px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(244, 63, 94, 0.4) 0%, transparent 70%)",
                animation: "beaconPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
          )}

          <div
            style={{
              width: isLarge ? "44px" : "32px",
              height: isLarge ? "44px" : "32px",
              borderRadius: "50%",
              background: isListening
                ? "linear-gradient(135deg, #f43f5e 0%, #836ef9 100%)"
                : "linear-gradient(135deg, rgba(131, 110, 249, 0.3) 0%, rgba(0, 240, 255, 0.2) 100%)",
              border: isListening ? "1px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: isListening ? "0 0 20px #f43f5e" : "0 4px 12px rgba(0, 0, 0, 0.4)",
              transition: "all 0.25s ease",
            }}
          >
            {isListening ? (
              // Stop square / pulse
              <svg width={isLarge ? "18" : "14"} height={isLarge ? "18" : "14"} viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              // High-tech microphone vector icon
              <svg
                width={isLarge ? "20" : "15"}
                height={isLarge ? "20" : "15"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            )}
          </div>
        </div>

        {/* Live Organic Equalizer Canvas */}
        <canvas
          ref={canvasRef}
          width={isLarge ? 160 : 90}
          height={isLarge ? 32 : 22}
          style={{ display: "block" }}
        />

        {/* Status Callout & Telemetry */}
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left", minWidth: isLarge ? "150px" : "110px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: isLarge ? "0.95rem" : "0.82rem",
                fontWeight: 700,
                color: isListening ? "#fda4af" : "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              {isListening ? "Listening Intent..." : "Tap to Speak"}
            </span>
          </div>

          <span
            style={{
              fontSize: "0.72rem",
              color: isListening ? "#fca5a5" : "#94a3b8",
              fontFamily: "var(--font-mono)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isListening ? (
              <span>Release or pause to run</span>
            ) : (
              <>
                <span>Natural Monad EVM</span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "4px",
                    padding: "1px 5px",
                    fontSize: "0.66rem",
                  }}
                >
                  Ctrl+Space
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Live Interim Transcript Bubble */}
      {isListening && interimText && (
        <div
          style={{
            maxWidth: "600px",
            padding: "8px 16px",
            borderRadius: "10px",
            background: "rgba(10, 14, 23, 0.9)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            color: "#e2e8f0",
            fontFamily: "var(--font-mono)",
            fontSize: "0.86rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.2s ease-out",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span style={{ color: "#00f0ff", fontWeight: 700 }}>&gt;</span>
          <span>&quot;{interimText}&quot;</span>
          <span
            style={{
              width: "6px",
              height: "14px",
              background: "#00f0ff",
              display: "inline-block",
              animation: "beaconPing 1s infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
