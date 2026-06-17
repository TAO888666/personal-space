import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "切换亮色模式" : "切换暗色模式"}
      className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-[#7c6dfa]/40 hover:bg-[#7c6dfa]/8 hover:text-foreground"
    >
      <span className="flex h-4 w-4 items-center justify-center">
        {isDark ? (
          <Sun size={14} className="text-amber-500" />
        ) : (
          <Moon size={14} className="text-[#7c6dfa]" />
        )}
      </span>
      <span className="text-xs font-mono">{isDark ? "亮色" : "暗色"}</span>
    </button>
  );
}
