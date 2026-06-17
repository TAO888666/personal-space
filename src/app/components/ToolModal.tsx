import { useEffect } from "react";
import { X, ExternalLink, Star, Users, Tag } from "lucide-react";
import { Tool } from "./ToolCard";

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

export function ToolModal({ tool, onClose }: ToolModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Dim layer */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-secondary">
          <img
            src={(tool.imageLocal as string) ?? `${tool.image}?w=800&h=500&fit=crop&auto=format`}
            alt={tool.name}
            className="size-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

          {/* Badges on image */}
          <div className="absolute left-4 top-4 flex gap-2">
            {tool.isNew && (
              <span className="rounded-full bg-[#7c6dfa] px-3 py-1 text-xs font-medium text-white">
                NEW
              </span>
            )}
            {tool.isFeatured && (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-500 border border-amber-500/30">
                精选推荐
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <X size={16} />
          </button>

          {/* Category pill on image bottom */}
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full bg-[#7c6dfa]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {tool.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Title row */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">{tool.name}</h2>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 rounded-full bg-[#7c6dfa] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_20px_rgba(124,109,250,0.4)]"
            >
              立即使用
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Stats row */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              <span className="font-medium text-amber-500">{tool.rating}</span>
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users size={14} />
              <span>{tool.users} 用户在用</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-border" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide font-mono">工具介绍</h3>
            <p className="text-base leading-relaxed text-foreground">
              {tool.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground uppercase tracking-wide font-mono">
              <Tag size={12} />
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-mono text-muted-foreground"
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
