import avatarImg from "../../imports/image-3.png";

export function AboutCard() {
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
              height: 384,
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
            {/* Top background — SVG geometric pattern */}
            <div style={{ height: 192, width: "100%", flexShrink: 0, overflow: "hidden" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect fill="#7c6dfa" width="300" height="192" />
                <defs>
                  <linearGradient id="pg" gradientUnits="userSpaceOnUse" x1="0" x2="300" y1="0" y2="192">
                    <stop offset="0" stopColor="#7c6dfa" />
                    <stop offset="1" stopColor="#a78bfa" />
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

            {/* Avatar — centered, overlapping */}
            <div
              style={{
                position: "absolute",
                top: "calc(50% - 70px)",
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

            {/* Bottom content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 64,
                paddingBottom: 24,
                gap: 6,
                flex: 1,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 18, color: "var(--foreground)" }}>
                欧哥
              </div>
              <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
                AI工具导航 · 欧哥流量计划
              </div>

              {/* Buttons */}
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
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#7c6dfa";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#7c6dfa";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                >
                  抖音主页
                </a>
                <a
                  href="https://www.taoxai.top/"
                  target="_blank"
                  rel="noopener noreferrer"
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
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#7c6dfa";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#7c6dfa";
                  }}
                >
                  本站
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
