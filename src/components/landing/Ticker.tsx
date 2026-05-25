const items = [
  "🏠 12 Indian cities",
  "⚡ AI response in 1.2s",
  "📊 2,400+ leads processed",
  "💰 ₹18 Crore+ deals closed",
  "🤖 24/7 AI chatbot",
  "📞 Voice AI agent",
  "✅ 94% agent satisfaction",
  "🔒 Bank-grade security",
  "📱 WhatsApp lead capture",
  "🎯 AI lead scoring 0–100",
];

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div className="relative border-y border-[var(--border)] overflow-hidden py-3.5 bg-[var(--surface)]/60">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

      <div className="ticker-track flex gap-10 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide select-none"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
