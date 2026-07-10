import { useState, useRef } from "react";
import { ArrowRight, Zap, Target, Layers, Star, TrendingUp, Check, Minus, Crown, Flame } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AboutCard } from "./AboutCard";
import { AuthModal } from "./AuthModal";
import { MembershipModal } from "./MembershipModal";
import { MemberSuccessModal } from "./MemberSuccessModal";
import { UserMenu } from "./UserMenu";
import type { AuthUser } from "../App";
import type { MemberTab } from "./MemberCenter";

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

type ModalState = "none" | "auth" | "membership" | "memberSuccess";

interface HomePageProps {
  onGoToTools: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onMemberUpgrade: (user: AuthUser) => void;
  onGoToMember: (tab?: MemberTab) => void;
}

export function HomePage({ onGoToTools, isDark, onToggleTheme, user, onLogin, onLogout, onMemberUpgrade, onGoToMember }: HomePageProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [modal, setModal] = useState<ModalState>("none");
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleAboutClick = () => {
    const next = !showAbout;
    setShowAbout(next);
    if (next) {
      setTimeout(() => {
        if (!aboutRef.current) return;
        const rect = aboutRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - 80;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }, 350);
    }
  };

  function handleLoginSuccess(authUser: AuthUser) {
    onLogin(authUser);
    setModal("none");
  }

  function handleUpgrade(authUser: AuthUser) {
    onMemberUpgrade(authUser);
    setModal("none");
    setModal("memberSuccess");
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Modals */}
      {modal === "auth" && (
        <AuthModal
          onClose={() => setModal("none")}
          onSuccess={handleLoginSuccess}
        />
      )}
      {modal === "membership" && (
        <MembershipModal
          onClose={() => setModal("none")}
          onUpgradeSuccess={handleUpgrade}
          isLoggedIn={!!user}
          onLoginRequired={() => setModal("auth")}
        />
      )}
      {modal === "memberSuccess" && (
        <MemberSuccessModal
          onStartUsing={() => setModal("none")}
          onViewBenefits={() => setModal("none")}
        />
      )}

      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-[#7c6dfa]">TaoX</span> AI
          </span>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              onClick={handleAboutClick}
              className={`px-2 transition-colors ${showAbout ? "text-[#7c6dfa]" : "hover:text-foreground"}`}
            >
              关于站长
            </button>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            {user ? (
              <UserMenu
                user={user}
                onLogout={onLogout}
                onOpenMembership={() => setModal("membership")}
                onGoToMember={onGoToMember}
              />
            ) : (
              <button
                onClick={() => setModal("auth")}
                className="rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/40 hover:text-foreground"
              >
                登录
              </button>
            )}
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

        {/* Grid overlay */}
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
            <p className="mb-2 font-mono text-xs tracking-widest text-[#7c6dfa] uppercase">Why TaoX AI</p>
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

      {/* Pricing */}
      <section className="px-6 py-24 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-2 font-mono text-xs tracking-widest text-[#7c6dfa] uppercase">Membership</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">选择适合你的方案</h2>
            <p className="mt-3 text-muted-foreground">
              开通会员，解锁工具库、教程内容和社群权益
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <div className="mb-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  免费用户
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">¥0</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">适合先体验工具库</p>
              </div>

              <div className="flex flex-1 flex-col gap-3 border-t border-border pt-5">
                {[
                  { text: "浏览免费工具", on: true },
                  { text: "查看基础工具信息", on: true },
                  { text: "体验部分公开内容", on: true },
                  { text: "会员专属工具", on: false },
                  { text: "教程内容", on: false },
                  { text: "社群与项目分享", on: false },
                ].map(({ text, on }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    {on ? (
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                        <Check size={10} className="text-emerald-500" />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-border">
                        <Minus size={10} className="text-muted-foreground/40" />
                      </div>
                    )}
                    <span className={`text-sm ${on ? "text-foreground" : "text-muted-foreground/50 line-through"}`}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onGoToTools}
                className="mt-6 w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-[#7c6dfa]/25 hover:text-foreground"
              >
                免费使用
              </button>
            </div>

            <div className="flex flex-col rounded-2xl border border-[#7c6dfa]/35 bg-card p-6">
              <div className="mb-6">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-[#7c6dfa]">
                  年会员
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-muted-foreground">¥</span>
                  <span className="text-3xl font-bold text-foreground">299</span>
                  <span className="text-sm text-muted-foreground">/ 年</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">适合持续使用 AI 工具的个人创作者</p>
              </div>

              <div className="flex flex-1 flex-col gap-3 border-t border-border pt-5">
                {[
                  "解锁全部会员工具",
                  "工具库持续更新",
                  "教程内容可查看",
                  "会员身份有效期一年",
                  "适合个人学习与创作提效",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7c6dfa]/15">
                      <Check size={10} className="text-[#7c6dfa]" />
                    </div>
                    <span className="text-sm text-foreground">{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModal(user ? "membership" : "auth")}
                className="mt-6 w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-semibold text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_24px_rgba(124,109,250,0.38)]"
              >
                开通年会员
              </button>
            </div>

            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-amber-500/35 bg-card p-6">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500/70 via-amber-400/40 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 bg-amber-500/5 blur-[50px]" />

              <div className="relative mb-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-500">
                    <Crown size={10} />
                    创始会员
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/8 px-2.5 py-0.5 text-[11px] font-medium text-red-400">
                    <Flame size={10} />
                    限量 50 席
                  </span>
                </div>
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-amber-500">
                  创始会员
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-muted-foreground">¥</span>
                  <span className="text-3xl font-bold text-foreground">499</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">适合早期深度用户和项目型创作者</p>
              </div>

              <div className="relative flex flex-1 flex-col gap-3 border-t border-border pt-5">
                {[
                  "当前工具库长期使用权",
                  "已上线教程内容永久查看",
                  "首年社群权益",
                  "首年项目分享",
                  "首年更新服务",
                  "创始会员身份标识",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                      <Check size={10} className="text-amber-500" />
                    </div>
                    <span className="text-sm text-foreground">{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModal(user ? "membership" : "auth")}
                className="relative mt-6 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-3 text-sm font-semibold text-amber-500 transition-all hover:border-amber-500/60 hover:bg-amber-500/18"
              >
                抢占创始席位
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground/50">
            创始会员长期权益指当前工具库与已上线教程内容；未来独立课程、项目服务或高成本工具可能单独定价。
          </p>
        </div>
      </section>

      {/* About — toggleable */}
      <div
        ref={aboutRef}
        style={{
          display: "grid",
          gridTemplateRows: showAbout ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <AboutCard />
        </div>
      </div>

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
            <span className="text-[#7c6dfa]">TaoX</span> AI
          </span>
          <span className="font-mono text-xs">© 2026 · 为创作者而生</span>
        </div>
      </footer>
    </div>
  );
}
