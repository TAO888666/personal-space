import { ExternalLink, Star } from "lucide-react";

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
  url: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-[#7c6dfa]/40 hover:shadow-[0_4px_30px_rgba(124,109,250,0.12)] cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={(tool.imageLocal as string) ?? `${tool.image}?w=600&h=400&fit=crop&auto=format`}
          alt={tool.name}
          className="size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {tool.isNew && (
            <span className="rounded-full bg-[#7c6dfa] px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-white">
              NEW
            </span>
          )}
          {tool.isFeatured && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-amber-600 border border-amber-500/30">
              精选
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-foreground group-hover:text-[#7c6dfa] transition-colors">
            {tool.name}
          </h3>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <ExternalLink size={14} />
          </a>
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
      </div>
    </div>
  );
}
