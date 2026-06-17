import { useEffect } from "react";

const FAVICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c6dfa"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text
    x="32" y="44"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="28"
    font-weight="700"
    fill="white"
    text-anchor="middle"
    letter-spacing="-1"
  >TX</text>
</svg>
`.trim();

export function useFavicon() {
  useEffect(() => {
    const svg64 = btoa(unescape(encodeURIComponent(FAVICON_SVG)));
    const dataUrl = `data:image/svg+xml;base64,${svg64}`;

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = dataUrl;

    document.title = "TaoX AI · AI工具精选导航";
  }, []);
}
