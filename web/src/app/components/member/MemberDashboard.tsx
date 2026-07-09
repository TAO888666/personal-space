import {
  Crown, User, Zap, BookOpen, Users, GitBranch,
  Clock, ArrowRight, ChevronRight, Sparkles, RefreshCw, ArrowUpCircle,
} from "lucide-react";
import type { AuthUser } from "../../App";

interface Props {
  user: AuthUser;
  onGoToBenefits: () => void;
  onGoToSettings: () => void;
  onGoToTools: () => void;
  onOpenMembership: () => void;
}

function maskPhone(p: string) {
  return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function formatDate(value?: string | null) {
  if (!value) return "长期有效";
  return new Date(value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getMembershipLabel(user: AuthUser) {
  if (user.membershipType === "founder") return "创始会员";
  if (user.membershipType === "annual") return "年会员";
  return "普通用户";
}

function getMemberNumber(user: AuthUser) {
  if (user.membershipType === "founder" && user.founderNumber) {
    return `No.${user.founderNumber}`;
  }

  return "年会员";
}

const QUICK_ACTIONS = [
  { icon: Zap,       title: "开始使用AI工具", desc: "访问全部AI工具库",     color: "#7c6dfa", bg: "bg-[#7c6dfa]/10", action: "tools" },
  { icon: GitBranch, title: "查看AI工作流",   desc: "完整自媒体创作工作流", color: "#06b6d4", bg: "bg-cyan-500/10",   action: null },
  { icon: BookOpen,  title: "学习使用教程",   desc: "工具教程与实战案例",   color: "#10b981", bg: "bg-emerald-500/10", action: null },
  { icon: Users,     title: "进入会员社群",   desc: "经验交流与运营方法",   color: "#f59e0b", bg: "bg-amber-500/10",  action: null },
];

// Real tools that exist in the site's tool library
const RECENT_TOOLS = [
  { name: "Midjourney",     category: "图像生成", lastUsed: "10分钟前" },
  { name: "Cc switch",      category: "编程开发", lastUsed: "昨天" },
  { name: "Video2X",        category: "视频编辑", lastUsed: "3天前" },
];

// Updates based on real tools in the site
const UPDATES = [
  { text: "Midjourney 使用指南更新",          time: "2天前",  dot: "bg-[#7c6dfa]" },
  { text: "Obsidian 工具详情优化",            time: "5天前",  dot: "bg-emerald-500" },
  { text: "Collection Center 数据采集更新",   time: "1周前",  dot: "bg-amber-500" },
];

const WORKFLOW_STEPS = ["选题分析", "生成脚本", "优化开头", "生成标题", "生成封面文案"];

// ── Free-user status card ──────────────────────────────────────────────────
function FreeUserCard({
  user,
  onGoToBenefits,
  onOpenMembership,
}: {
  user: AuthUser;
  onGoToBenefits: () => void;
  onOpenMembership: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">普通用户</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  免费账户
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-mono text-sm text-muted-foreground">{maskPhone(user.phone)}</p>
              <p className="text-sm text-muted-foreground">
                当前账号尚未开通 AI 自媒体会员
              </p>
              <p className="text-xs text-muted-foreground/70">
                升级会员后可使用会员专属工具、教程、工作流和会员服务。
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:items-end">
            <button
              onClick={onOpenMembership}
              className="flex items-center gap-2 rounded-xl bg-[#7c6dfa] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_16px_rgba(124,109,250,0.35)]"
            >
              <ArrowUpCircle size={14} />
              升级会员
            </button>
            <button
              onClick={onGoToBenefits}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-foreground"
            >
              查看会员权益
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Paid-member status card ────────────────────────────────────────────────
function MemberCard({
  user,
  onGoToBenefits,
}: {
  user: AuthUser;
  onGoToBenefits: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#7c6dfa]/20 bg-card">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#7c6dfa] via-violet-400/60 to-transparent" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/10">
                <Crown size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{getMembershipLabel(user)}</h2>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-500">状态正常</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-3">
              <div>
                <p className="text-xs text-muted-foreground">用户手机号</p>
                <p className="mt-0.5 font-mono text-sm font-medium text-foreground">{maskPhone(user.phone)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">会员编号</p>
                <p className="mt-0.5 font-mono text-sm font-medium text-foreground">{getMemberNumber(user)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">有效期</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {user.membershipType === "founder"
                    ? "长期有效"
                    : `${formatDate(user.membershipStartedAt)} – ${formatDate(user.membershipExpiresAt ?? user.vipExpiresAt)}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:items-end">
            <button
              onClick={onGoToBenefits}
              className="flex items-center gap-2 rounded-xl border border-[#7c6dfa]/30 bg-[#7c6dfa]/8 px-5 py-2.5 text-sm font-medium text-[#7c6dfa] transition-all hover:bg-[#7c6dfa]/14"
            >
              查看我的权益
              <ChevronRight size={14} />
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-foreground">
              <RefreshCw size={13} />
              续费会员
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function MemberDashboard({ user, onGoToBenefits, onGoToSettings, onGoToTools, onOpenMembership }: Props) {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">会员中心</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          管理你的会员权益，快速访问常用工具和会员内容。
        </p>
      </div>

      {/* Status card — conditional on user.isMember */}
      {user.isMember ? (
        <MemberCard user={user} onGoToBenefits={onGoToBenefits} />
      ) : (
        <FreeUserCard user={user} onGoToBenefits={onGoToBenefits} onOpenMembership={onOpenMembership} />
      )}

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          快捷入口
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.title}
              onClick={action.action === "tools" ? onGoToTools : undefined}
              className="group flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-[#7c6dfa]/25 hover:shadow-[0_4px_20px_rgba(124,109,250,0.07)]"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.bg} transition-transform group-hover:scale-110`}
              >
                <action.icon size={17} style={{ color: action.color }} />
              </div>
              <div>
                <p className="text-sm font-medium leading-snug text-foreground">{action.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent tools + Latest updates */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent tools — names from actual site tool library */}
        <div>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            最近使用
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
            {RECENT_TOOLS.map((t) => (
              <div key={t.name} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                      {t.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={10} />
                      {t.lastUsed}
                    </span>
                  </div>
                </div>
                <button className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-[#7c6dfa]">
                  再次使用
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Latest updates — based on real tools */}
        <div>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            最新更新
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
            {UPDATES.map((u) => (
              <div key={u.text} className="flex items-center gap-3 px-5 py-4">
                <div className={`h-2 w-2 shrink-0 rounded-full ${u.dot}`} />
                <p className="flex-1 text-sm text-foreground">{u.text}</p>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{u.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended workflow */}
      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          推荐工作流
        </h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#7c6dfa]" />
            <span className="font-medium text-foreground">短视频爆款创作流程</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-[#7c6dfa]/20 bg-[#7c6dfa]/8 px-3 py-2">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7c6dfa] text-[10px] font-bold text-white">
                    {i + 1}
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium text-foreground">{step}</span>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <ArrowRight size={13} className="shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <button className="flex items-center gap-2 rounded-xl bg-[#7c6dfa] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_16px_rgba(124,109,250,0.35)]">
              开始工作流
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
