import { ExternalLink, Star, Crown, Clock } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  users: string;
  image: string;
  imageLocal?: unknown; // imported local asset (Vite module)
  review?: string; // 欧哥点评
  url: string;
  isNew?: boolean;
  isFeatured?: boolean;
  memberOnly?: boolean;  // requires membership
  comingSoon?: boolean;  // not yet available
}

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
  isMember?: boolean;
}

export function ToolCard({ tool, onClick, isMember }: ToolCardProps) {
  const isLocked = tool.memberOnly && !isMember;
  const isComing = tool.comingSoon;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 ${
        isComing
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-[#7c6dfa]/40 hover:shadow-[0_4px_30px_rgba(124,109,250,0.12)] cursor-pointer"
      }`}
      onClick={isComing ? undefined : onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={(tool.imageLocal as string) ?? `${tool.image}?w=600&h=400&fit=crop&auto=format`}
          alt={tool.name}
          className={`size-full object-cover transition-transform duration-500 ${
            isComing ? "opacity-50" : "opacity-80 group-hover:scale-105 group-hover:opacity-100"
          }`}
        />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {tool.isNew && !tool.comingSoon && (
            <span className="rounded-full bg-[#7c6dfa] px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-white">
              NEW
            </span>
          )}
          {tool.isFeatured && !tool.comingSoon && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-amber-600 border border-amber-500/30">
              精选
            </span>
          )}
          {tool.comingSoon && (
            <span className="flex items-center gap-1 rounded-full bg-secondary/90 border border-border px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
              <Clock size={10} />
              即将上线
            </span>
          )}
        </div>

        {/* Top-right: member badge */}
        {tool.memberOnly && !tool.comingSoon && (
          <div className="absolute right-3 top-3">
            <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-600 backdrop-blur-sm">
              <Crown size={9} />
              会员专属
            </span>
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex flex-col items-center gap-1.5">
              <Crown size={20} className="text-amber-400" />
              <span className="text-xs font-medium text-white">升级会员解锁</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-foreground group-hover:text-[#7c6dfa] transition-colors">
            {tool.name}
          </h3>
          {!isComing && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-mono text-muted-foreground border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">{tool.rating}</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">{tool.users} 用户</span>
          <span className="rounded-full bg-[#7c6dfa]/10 px-2.5 py-0.5 text-[11px] text-[#7c6dfa] border border-[#7c6dfa]/20">
            {tool.category}
          </span>
        </div>

        {/* Action button */}
        <div className="mt-1">
          {isComing ? (
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary py-2 text-xs font-medium text-muted-foreground">
              <Clock size={12} />
              敬请期待
            </div>
          ) : isLocked ? (
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/8 py-2 text-xs font-medium text-amber-600">
              <Crown size={12} />
              升级会员使用
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#7c6dfa]/20 bg-[#7c6dfa]/8 py-2 text-xs font-medium text-[#7c6dfa]">
              立即使用
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
