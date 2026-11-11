import { ImageResponse } from "next/og";

export const alt = "HopeNest — Social Development & Community Events Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #001F16 0%, #003D2B 52%, #05583F 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "14px",
              background: "rgba(16, 185, 129, 0.16)",
              border: "1px solid rgba(16, 185, 129, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
              <path
                d="M32 50C32 50 14 39.2 14 25.5C14 19.7 18.6 15 24.3 15C27.8 15 30.8 16.8 32 19.6C33.2 16.8 36.2 15 39.7 15C45.4 15 50 19.7 50 25.5C50 39.2 32 50 32 50Z"
                fill="#10B981"
              />
              <path
                d="M32 45C39.2 39.2 44.5 32.5 44.5 25.5C44.5 22.3 42.1 19.8 39 19.8C36 19.8 33.7 21.8 32 25.2V45Z"
                fill="#FACC15"
              />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 34, fontWeight: 800 }}>
            <span style={{ color: "#10B981" }}>Hope</span>
            <span style={{ color: "#FACC15" }}>Nest</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "940px" }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Discover Events That Empower Your Community
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.45,
              color: "#A7F3D0",
              display: "flex",
            }}
          >
            Volunteer drives, cleanups, tree plantations, donations, and neighborhood impact across HopeNest.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.16)",
            paddingTop: "24px",
            fontSize: 20,
            color: "#D1FAE5",
          }}
        >
          <span style={{ display: "flex" }}>Social Development &amp; Community Events</span>
          <span
            style={{
              display: "flex",
              padding: "8px 18px",
              borderTopRightRadius: "12px",
              borderBottomLeftRadius: "12px",
              background: "#059669",
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            Join the Impact
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

