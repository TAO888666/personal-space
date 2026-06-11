import { ArrowRight, Zap, Target, Layers, Star, TrendingUp } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const FEATURED_TOOLS = [
  {
    name: "Midjourney",
    category: "图像生成",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=280&fit=crop&auto=format",
    rating: 4.9,
  },
  {
    name: "Runway ML",
    category: "视频生成",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=280&fit=crop&auto=format",
    rating: 4.8,
  },
  {
    name: "ElevenLabs",
    category: "语音合成",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=280&fit=crop&auto=format",
    rating: 4.8,
  },
  {
    name: "Suno AI",
    category: "音乐创作",
    image: "https://images.unsplash.com/photo-1556196148-1fb724238998?w=400&h=280&fit=crop&auto=format",
    rating: 4.8,
  },
];

const STATS = [
  { value: "120+", label: "精选工具" },
  { value: "18", label: "工具分类" },
  { value: "每周", label: "持续更新" },
  { value: "100%", label: "亲测可用" },
];

const VALUES = [
  {
    icon: Target,
    title: "精准筛选",
    desc: "每款工具经过实际测试，只推荐真正好用、创作者能落地使用的工具。",
  },
  {
    icon: Zap,
    title: "效率优先",
    desc: "聚焦提升创作效率的工具，帮你从内容生产到分发全流程提速。",
  },
  {
    icon: Layers,
    title: "全栈覆盖",
    desc: "覆盖图像、视频、文字、音频、设计各个创作维度，一站式发现。",
  },
  {
    icon: TrendingUp,
    title: "持续跟踪",
    desc: "紧跟 AI 工具领域最新动态，每周更新，让你始终站在创作前沿。",
  },
];

interface HomePageProps {
  onGoToTools: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function HomePage({ onGoToTools, isDark, onToggleTheme }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-[#7c6dfa]">Creator</span>AI
          </span>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors px-2">关于</a>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <button
              onClick={onGoToTools}
              className="rounded-full bg-[#7c6dfa] px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_20px_rgba(124,109,250,0.4)]"
            >
              浏览工具
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#7c6dfa]/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-violet-500/8 blur-[80px]" />
        </div>

        {/* Grid overlay — color adapts to theme */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: isDark ? 0.4 : 0.6,
          }}
        />

        <div className="relative z-10 max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c6dfa]/30 bg-[#7c6dfa]/10 px-4 py-1.5 text-sm text-[#7c6dfa]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7c6dfa] animate-pulse" />
            AI 工具精选导航 · 持续更新
          </div>

          <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            为创作者找到
            <br />
            <span className="text-[#7c6dfa]">真正好用</span>的 AI 工具
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            在 AI 工具爆炸的时代，我们替你过滤噪音。
            <br />
            每款工具经过亲测，聚焦创作者真实需求，帮你高效完成内容生产。
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={onGoToTools}
              className="group flex items-center gap-2 rounded-full bg-[#7c6dfa] px-8 py-3.5 font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_30px_rgba(124,109,250,0.4)]"
            >
              探索全部工具
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onGoToTools}
              className="rounded-full border border-border px-8 py-3.5 font-medium text-muted-foreground transition-all hover:text-foreground hover:border-[#7c6dfa]/40"
            >
              查看精选推荐
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-xs tracking-widest text-[#7c6dfa] uppercase">Featured</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">精选推荐</h2>
            </div>
            <button
              onClick={onGoToTools}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部 <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_TOOLS.map((tool) => (
              <div
                key={tool.name}
                onClick={onGoToTools}
                className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-[#7c6dfa]/40 hover:shadow-[0_4px_30px_rgba(124,109,250,0.12)]"
              >
                <div className="relative h-44 overflow-hidden bg-secondary">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="size-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground group-hover:text-[#7c6dfa] transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      <span className="text-xs font-medium text-amber-500">{tool.rating}</span>
                    </div>
                  </div>
                  <span className="mt-2 inline-block rounded-full bg-[#7c6dfa]/10 px-2.5 py-0.5 text-xs text-[#7c6dfa] border border-[#7c6dfa]/20">
                    {tool.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="about" className="px-6 py-24 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-2 font-mono text-xs tracking-widest text-[#7c6dfa] uppercase">Why CreatorAI</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              我们的选工具哲学
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-[#7c6dfa]/40 hover:shadow-[0_4px_20px_rgba(124,109,250,0.08)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c6dfa]/12 text-[#7c6dfa] transition-colors group-hover:bg-[#7c6dfa]/20">
                  <v.icon size={20} />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative overflow-hidden rounded-2xl border border-[#7c6dfa]/20 bg-card p-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#7c6dfa]/8 via-transparent to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-40 w-80 bg-[#7c6dfa]/12 blur-[60px]" />
            <p className="relative mb-2 font-mono text-xs tracking-widest text-[#7c6dfa] uppercase">开始探索</p>
            <h2 className="relative mb-4 text-3xl font-semibold tracking-tight text-foreground">
              找到你的 AI 创作搭档
            </h2>
            <p className="relative mb-8 text-muted-foreground">
              120+ 款经过验证的 AI 工具，总有一款让你的内容创作更上一层楼
            </p>
            <button
              onClick={onGoToTools}
              className="group relative flex items-center gap-2 mx-auto rounded-full bg-[#7c6dfa] px-8 py-3.5 font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_30px_rgba(124,109,250,0.4)]"
            >
              立即探索工具库
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            <span className="text-[#7c6dfa]">Creator</span>AI
          </span>
          <span className="font-mono text-xs">© 2026 · 为创作者而生</span>
        </div>
      </footer>
    </div>
  );
}
