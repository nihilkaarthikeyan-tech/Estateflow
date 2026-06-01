import { ImageResponse } from "next/og";

export const alt = "EstateFlow — AI Real Estate CRM for UAE Agencies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d0f0e 0%, #131816 60%, #1a1f1d 100%)",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "linear-gradient(90deg, #c9a96e 0%, #e8c87a 100%)",
            display: "flex",
          }}
        />

        {/* Top — brand + badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #c9a96e 0%, #e8c87a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
              }}
            >
              🏠
            </div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#f0ebe3",
                letterSpacing: "0.08em",
              }}
            >
              ESTATEFLOW
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "18px",
              color: "#c9a96e",
              letterSpacing: "0.04em",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "99px",
                background: "#34d399",
                display: "flex",
              }}
            />
            AI REAL ESTATE CRM · BUILT FOR UAE AGENCIES
          </div>
        </div>

        {/* Middle — headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Never Lose a
          </div>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 800,
              color: "#c9a96e",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Hot Lead Again.
          </div>
        </div>

        {/* Bottom — value props + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "32px" }}>
            {[
              "Bayut & PF capture",
              "AI scoring in 2s",
              "Arabic + English",
            ].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "20px",
                  color: "#8a847a",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "99px",
                    background: "#c9a96e",
                    display: "flex",
                  }}
                />
                {t}
              </div>
            ))}
          </div>

          {/* CTA pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "99px",
              background: "linear-gradient(135deg, #c9a96e 0%, #e8c87a 100%)",
              color: "#131816",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Request a Free Demo →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
