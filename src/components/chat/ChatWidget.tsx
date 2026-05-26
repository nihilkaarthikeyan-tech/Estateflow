"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Building2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  action?: string;
}

const WELCOME =
  "Hi! I'm the EstateFlow AI assistant. Ask me about properties, pricing, or book a site visit. You can also click the mic and speak!";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const lastInputWasVoice = useRef(false);

  // Lead capture state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showLeadForm]);

  // ── Voice input (Web Speech API — free, Chrome built-in) ──────────────────

  function toggleRecording() {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setRecording(true);
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript;
      lastInputWasVoice.current = true;
      sendMessage(transcript);
    };

    rec.start();
    recognitionRef.current = rec;
  }

  // ── Voice output (OpenAI TTS) ─────────────────────────────────────────────

  async function speakText(text: string, idx: number) {
    try {
      setSpeakingIdx(idx);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) { setSpeakingIdx(null); return; }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeakingIdx(null);
      audio.play();
    } catch {
      setSpeakingIdx(null);
    }
  }

  function stopSpeaking() {
    audioRef.current?.pause();
    setSpeakingIdx(null);
  }

  // ── Send message ──────────────────────────────────────────────────────────

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Sorry, something went wrong.";
      const assistantMsg: Message = { role: "assistant", content: reply, action: data.action };

      setMessages((prev) => {
        const next = [...prev, assistantMsg];

        // Auto-speak if last input was voice
        if (lastInputWasVoice.current) {
          lastInputWasVoice.current = false;
          setTimeout(() => speakText(reply, next.length - 1), 100);
        }

        return next;
      });

      if (data.action === "book_visit" && !leadSaved) {
        setShowLeadForm(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ── Lead capture ──────────────────────────────────────────────────────────

  async function submitLead() {
    if (!leadName.trim() || !leadPhone.trim()) return;
    setLeadSubmitting(true);

    const conversationSummary = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" | ");

    try {
      await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          conversationSummary,
        }),
      });
      setLeadSaved(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Perfect, ${leadName.split(" ")[0]}! Your visit request has been saved. Our team will call you at ${leadPhone} to confirm the timing. See you soon!`,
        },
      ]);
    } catch {
      // silently fail — don't break the chat experience
    } finally {
      setLeadSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
          style={{ background: "var(--surface)", height: "540px" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">EstateFlow AI</p>
              <p className="text-[11px] text-white/70 mt-0.5">Property Assistant · Voice enabled</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-[var(--foreground)] bg-[var(--surface-2)] border border-[var(--border)] rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }
                      : undefined
                  }
                >
                  {msg.content}
                </div>

                {/* Speak button on AI messages */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() =>
                      speakingIdx === i ? stopSpeaking() : speakText(msg.content, i)
                    }
                    className="mt-1 flex items-center gap-1 text-[10px] text-[var(--foreground-subtle)] hover:text-[var(--accent)] transition-colors"
                  >
                    {speakingIdx === i ? (
                      <><VolumeX size={11} /> Stop</>
                    ) : (
                      <><Volume2 size={11} /> Listen</>
                    )}
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-[var(--surface-2)] border border-[var(--border)]">
                  <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
                </div>
              </div>
            )}

            {/* Inline lead capture form */}
            {showLeadForm && !leadSaved && (
              <div className="bg-[var(--surface-2)] border border-[var(--accent)]/30 rounded-2xl p-3 flex flex-col gap-2">
                <p className="text-xs font-semibold text-[var(--accent)]">Book your site visit</p>
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none focus:border-[var(--accent)]"
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Phone number"
                  type="tel"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none focus:border-[var(--accent)]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitLead}
                    disabled={leadSubmitting || !leadName.trim() || !leadPhone.trim()}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50 transition-opacity flex items-center justify-center gap-1"
                    style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
                  >
                    {leadSubmitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Confirm Visit
                  </button>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 pb-3 pt-2 shrink-0 border-t border-[var(--border)]">
            <div className="flex gap-2 items-center bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-xl px-3 py-2">
              {speechSupported && (
                <button
                  onClick={toggleRecording}
                  title={recording ? "Stop recording" : "Speak your query"}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    recording
                      ? "bg-red-500/20 text-red-400 animate-pulse"
                      : "text-[var(--foreground-subtle)] hover:text-[var(--accent)]"
                  }`}
                >
                  {recording ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={recording ? "Listening…" : "Ask about properties…"}
                disabled={recording}
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
            {recording && (
              <p className="text-[10px] text-red-400 mt-1 text-center animate-pulse">
                Recording… speak now
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
          boxShadow: "0 8px 32px var(--accent-glow)",
        }}
        aria-label="Open chat"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>
    </>
  );
}
