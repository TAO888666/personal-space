import { useEffect } from "react";
import { X, ExternalLink, Star, Users, Tag } from "lucide-react";
import { Tool } from "./ToolCard";

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
  onOpenTool: (tool: Tool) => void;
}

export function ToolModal({ tool, onClose, onOpenTool }: ToolModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/*
       * Panel — fixed height for all tools, flex-col with 3 zones:
       *   ① Image      — large, fixed ~380px, object-contain (no crop)
       *   ② Header     — fixed, name + CTA + stats
       *   ③ Scroll     — unified scroll: review + description + tags
       */}
      <div
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        style={{ height: "min(760px, calc(100vh - 48px))" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── ① Image — full-width, natural height, no side gaps ── */}
        <div className="relative shrink-0 overflow-hidden rounded-t-2xl bg-secondary" style={{ maxHeight: 400 }}>
          <img
            src={(tool.imageLocal as string) ?? `${tool.image}?w=800&h=600&fit=clip&auto=format`}
            alt={tool.name}
            className="block w-full"
            style={{ height: "auto" }}
          />

          {/* Subtle gradient at bottom for pill readability */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badges — top-left */}
          <div className="absolute left-4 top-4 flex gap-2">
            {tool.isNew && (
              <span className="rounded-full bg-[#7c6dfa] px-3 py-1 text-xs font-medium text-white">
                NEW
              </span>
            )}
            {tool.isFeatured && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-500">
                精选推荐
              </span>
            )}
          </div>

          {/* Close — top-right, always fixed */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <X size={16} />
          </button>

          {/* Category pill — bottom-left */}
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full bg-[#7c6dfa]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {tool.category}
            </span>
          </div>
        </div>

        {/* ── ② Header — fixed, never scrolls ── */}
        <div className="shrink-0 border-b border-border px-6 py-4 sm:px-8">
          <div className="mb-2 flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold leading-snug text-foreground">{tool.name}</h2>
            <button
              type="button"
              onClick={() => onOpenTool(tool)}
              className="shrink-0 flex items-center gap-2 rounded-full bg-[#7c6dfa] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_20px_rgba(124,109,250,0.4)]"
            >
              立即使用
              <ExternalLink size={13} />
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Star size={13} className="fill-amber-500 text-amber-500" />
              <span className="font-medium text-amber-500">{tool.rating}</span>
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users size={13} />
              <span>{tool.users} 用户在用</span>
            </div>
          </div>
        </div>

        {/* ── ③ Scroll zone — single unified scroll: review + desc + tags ── */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 sm:px-8"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
        >
          {tool.review && (
            <div className="mb-5 rounded-xl border border-[#7c6dfa]/25 bg-[#7c6dfa]/8 px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[#7c6dfa]">💬</span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-[#7c6dfa]">
                  欧哥点评
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground italic">「{tool.review}」</p>
            </div>
          )}

          <div className="mb-5">
            <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              工具介绍
            </h3>
            <p className="text-sm leading-relaxed text-foreground">{tool.description}</p>
          </div>

          <div>
            <h3 className="mb-2.5 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Tag size={11} />
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-border bg-secondary px-3 py-1 text-xs font-mono text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
