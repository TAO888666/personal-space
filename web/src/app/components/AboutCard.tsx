import { useState } from "react";
import { X } from "lucide-react";
import avatarImg from "../../imports/image-3.png";
import qrImg from "../../imports/___.png";

export function AboutCard() {
  const [showQR, setShowQR] = useState(false);

  return (
    <section className="px-6 py-24 border-t border-border">
      <div className="mx-auto max-w-7xl">

        {/* Section label */}
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-xs tracking-widest text-[#7c6dfa] uppercase">About</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">关于站长</h2>
        </div>

        {/* Card — centered */}
        <div className="flex justify-center">
          <div
            style={{
              width: 300,
              borderRadius: 20,
              background: "var(--card)",
              border: "1px solid var(--border)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(124,109,250,0.12)",
            }}
          >
            {/* Top background */}
            <div style={{ height: 192, width: "100%", flexShrink: 0, overflow: "hidden" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <linearGradient id="pg" gradientUnits="userSpaceOnUse" x1="0" x2="300" y1="0" y2="192">
                    <stop offset="0%" stopColor="#7c6dfa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                  <pattern patternUnits="userSpaceOnUse" id="tp" width="60" height="60" viewBox="0 0 60 60">
                    <g fillOpacity="0.15" fill="#fff">
                      <polygon points="30 0 60 30 30 60 0 30" />
                      <polygon points="0 0 30 0 0 30" fillOpacity="0.08" />
                      <polygon points="60 0 60 30 30 0" fillOpacity="0.08" />
                      <polygon points="0 60 30 60 0 30" fillOpacity="0.08" />
                      <polygon points="60 60 30 60 60 30" fillOpacity="0.08" />
                    </g>
                  </pattern>
                </defs>
                <rect x="0" y="0" fill="url(#pg)" width="100%" height="100%" />
                <rect x="0" y="0" fill="url(#tp)" width="100%" height="100%" />
              </svg>
            </div>

            {/* Avatar */}
            <div
              style={{
                position: "absolute",
                top: "calc(192px - 57px)",
                width: 114,
                height: 114,
                borderRadius: "50%",
                background: "var(--card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid var(--card)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <img
                src={avatarImg as unknown as string}
                alt="欧哥"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>

            {/* Content */}
            {showQR ? (
              /* QR Code view */
              <div style={{ paddingTop: 70, paddingBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>扫码联系欧哥</div>
                <img
                  src={qrImg as unknown as string}
                  alt="微信二维码"
                  style={{ width: 160, height: 160, borderRadius: 12, objectFit: "cover" }}
                />
                <button
                  onClick={() => setShowQR(false)}
                  style={{
                    marginTop: 4,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    height: 30,
                    padding: "0 14px",
                    borderRadius: 6,
                    border: "1.5px solid var(--border)",
                    background: "transparent",
                    color: "var(--muted-foreground)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  <X size={12} /> 关闭
                </button>
              </div>
            ) : (
              /* Normal view */
              <div style={{ paddingTop: 64, paddingBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 18, color: "var(--foreground)" }}>欧哥</div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
                  AI工具导航 · 欧哥流量计划
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <a
                    href="https://v.douyin.com/tWZKKQHTfUQ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      height: 32,
                      padding: "0 16px",
                      borderRadius: 6,
                      border: "2px solid #7c6dfa",
                      background: "#7c6dfa",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                    }}
                  >
                    抖音主页
                  </a>
                  <button
                    onClick={() => setShowQR(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 32,
                      padding: "0 16px",
                      borderRadius: 6,
                      border: "2px solid #7c6dfa",
                      background: "transparent",
                      color: "#7c6dfa",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                    }}
                  >
                    联系
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
