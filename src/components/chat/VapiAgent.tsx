"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Phone, PhoneOff, Mic, MicOff, Loader2 } from "lucide-react";

type CallStatus = "idle" | "connecting" | "active" | "ended";

export default function VapiAgent() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      vapiRef.current?.stop();
    };
  }, [stopTimer]);

  async function startCall() {
    if (!publicKey || !assistantId) {
      setError("Vapi keys not configured.");
      return;
    }

    // Request mic permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access denied. Please allow mic and try again.");
      return;
    }

    setError(null);
    setStatus("connecting");

    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setStatus("active");
        startTimer();
      });

      vapi.on("call-end", () => {
        setStatus("ended");
        stopTimer();
        setTimeout(() => setStatus("idle"), 3000);
      });

      vapi.on("speech-start", () => setAiSpeaking(true));
      vapi.on("speech-end", () => setAiSpeaking(false));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on("volume-level", (vol: number) => setUserSpeaking(vol > 0.05));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on("error", (e: any) => {
        console.error("Vapi error:", e);
        const msg = e?.message || e?.error?.message || "Call failed. Please try again.";
        setError(msg);
        setStatus("idle");
        stopTimer();
      });

      await vapi.start(assistantId);
    } catch (e) {
      console.error(e);
      setError("Failed to start call. Check your Vapi keys.");
      setStatus("idle");
    }
  }

  function endCall() {
    vapiRef.current?.stop();
    stopTimer();
    setStatus("ended");
    setTimeout(() => { setStatus("idle"); setDuration(0); }, 2000);
  }

  function toggleMute() {
    if (!vapiRef.current) return;
    const next = !isMuted;
    vapiRef.current.setMuted(next);
    setIsMuted(next);
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Idle state — just the call button ────────────────────────────────────
  if (status === "idle") {
    return (
      <div className="fixed bottom-6 right-[5.5rem] z-50 flex flex-col items-center gap-1">
        {error && (
          <p className="absolute bottom-full mb-2 w-56 text-[11px] text-red-400 bg-[var(--surface)] border border-red-500/30 rounded-xl px-3 py-2 text-center shadow-lg">
            {error}
          </p>
        )}
        <button
          onClick={startCall}
          title="Talk to AI Agent"
          className="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 bg-emerald-500 hover:bg-emerald-400"
          style={{ boxShadow: "0 8px 32px rgba(16,185,129,0.4)" }}
        >
          <Phone size={22} className="text-white" />
        </button>
      </div>
    );
  }

  // ── Active / connecting / ended — full call screen ────────────────────────
  return (
    <div className="fixed bottom-24 right-[5.5rem] z-50 w-72 rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col"
      style={{ background: "var(--surface)" }}>

      {/* Header */}
      <div
        className="flex flex-col items-center gap-1 pt-6 pb-4 px-4"
        style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
      >
        {/* Avatar with waveform ring */}
        <div className="relative">
          <div className={`w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl ${aiSpeaking ? "ring-4 ring-white/60 ring-offset-2 ring-offset-transparent animate-pulse" : ""}`}>
            🏠
          </div>
          {userSpeaking && status === "active" && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
              <Mic size={10} className="text-white" />
            </span>
          )}
        </div>

        <p className="text-white font-bold text-sm mt-2">EstateFlow AI Agent</p>

        {status === "connecting" && (
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <Loader2 size={11} className="animate-spin" /> Connecting…
          </div>
        )}
        {status === "active" && (
          <p className="text-white/80 text-xs font-mono">{fmt(duration)}</p>
        )}
        {status === "ended" && (
          <p className="text-white/80 text-xs">Call ended</p>
        )}
      </div>

      {/* Status label */}
      <div className="flex items-center justify-center py-3 px-4">
        {status === "active" && (
          <p className="text-xs text-[var(--foreground-subtle)]">
            {aiSpeaking ? "🔊 AI is speaking…" : userSpeaking ? "🎤 Listening…" : "Waiting for you to speak…"}
          </p>
        )}
        {status === "ended" && (
          <p className="text-xs text-[var(--foreground-subtle)]">Thanks for calling!</p>
        )}
      </div>

      {/* Controls */}
      {status === "active" && (
        <div className="flex items-center justify-center gap-4 pb-5 px-4">
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? "bg-yellow-500/20 text-yellow-400" : "bg-[var(--surface-2)] text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"}`}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors shadow-lg"
          >
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
      )}

      {status === "connecting" && (
        <div className="flex justify-center pb-5">
          <button
            onClick={endCall}
            className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-colors"
          >
            <PhoneOff size={18} className="text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}
