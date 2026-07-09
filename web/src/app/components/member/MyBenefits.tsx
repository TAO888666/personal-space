import {
  Crown, User, Wrench, BookOpen, Users, RefreshCw,
  Check, Clock, AlertCircle, ChevronRight, Lock, ArrowUpCircle,
} from "lucide-react";
import type { AuthUser } from "../../App";

interface Props {
  user: AuthUser;
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

// ── Status badge ──────────────────────────────────────────────────────────
type BenefitStatus = "unlocked" | "active" | "free" | "locked" | "memberOnly" | "coming" | "expired";

function StatusBadge({ status }: { status: BenefitStatus }) {
  const config: Record<BenefitStatus, { label: string; cls: string; icon?: React.ReactNode }> = {
    unlocked:   { label: "已解锁",  cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",   icon: <Check size={9} /> },
    active:     { label: "正常",    cls: "bg-[#7c6dfa]/10 border-[#7c6dfa]/20 text-[#7c6dfa]",         icon: <span className="h-1.5 w-1.5 rounded-full bg-[#7c6dfa] animate-pulse" /> },
    free:       { label: "可使用",  cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",   icon: <Check size={9} /> },
    locked:     { label: "需要升级", cls: "bg-border border-border text-muted-foreground",              icon: <Lock size={9} /> },
    memberOnly: { label: "会员专属", cls: "bg-amber-500/10 border-amber-500/20 text-amber-500",        icon: <Crown size={9} /> },
    coming:     { label: "即将上线", cls: "bg-amber-500/10 border-amber-500/20 text-amber-500",        icon: <Clock size={9} /> },
    expired:    { label: "已过期",  cls: "bg-red-500/10 border-red-500/20 text-red-500",               icon: <AlertCircle size={9} /> },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${c.cls}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

// ── Benefits data — two versions ──────────────────────────────────────────
const PAID_BENEFITS = [
  {
    icon: Wrench,
    title: "全部AI工具使用权限",
    desc: "解锁会员专属AI工具，包括选题、脚本、标题、文案、图片和视频创作工具。",
    status: "unlocked" as BenefitStatus,
    btnLabel: "进入工具中心",
    action: "tools",
  },
  {
    icon: BookOpen,
    title: "会员课程与使用教程",
    desc: "获得工具使用教程、AI工作流课程和真实案例拆解。",
    status: "unlocked" as BenefitStatus,
    btnLabel: "开始学习",
    action: null,
  },
  {
    icon: Users,
    title: "会员交流社群",
    desc: "获得项目经验分享、运营方法交流、案例复盘和新玩法分享。",
    status: "unlocked" as BenefitStatus,
    btnLabel: "查看加入方式",
    action: null,
  },
  {
    icon: RefreshCw,
    title: "持续更新服务",
    desc: "会员有效期内获得新工具、新功能、新教程和AI玩法更新。",
    status: "active" as BenefitStatus,
    btnLabel: "查看更新日志",
    action: null,
  },
];

const FREE_BENEFITS = [
  {
    icon: Wrench,
    title: "基础免费AI工具",
    desc: "可使用网站内全部免费工具，包括 Midjourney、Vibe、Canva AI 等精选工具。",
    status: "free" as BenefitStatus,
    btnLabel: "进入工具中心",
    action: "tools",
    isLocked: false,
  },
  {
    icon: Wrench,
    title: "全部会员AI工具",
    desc: "会员专属工具包含 Runway ML、ElevenLabs、Pika Labs 等更多高级工具。升级后全部解锁。",
    status: "locked" as BenefitStatus,
    btnLabel: "升级解锁",
    action: "upgrade",
    isLocked: true,
  },
  {
    icon: BookOpen,
    title: "会员课程与使用教程",
    desc: "AI工作流课程、工具使用教程和真实案例拆解，升级会员后完整获取。",
    status: "locked" as BenefitStatus,
    btnLabel: "升级解锁",
    action: "upgrade",
    isLocked: true,
  },
  {
    icon: Users,
    title: "会员交流社群",
    desc: "项目经验分享、运营方法交流、案例复盘，升级会员后可加入。",
    status: "locked" as BenefitStatus,
    btnLabel: "了解会员",
    action: "upgrade",
    isLocked: true,
  },
  {
    icon: RefreshCw,
    title: "持续更新服务",
    desc: "会员有效期内持续获得新工具、新功能和AI玩法更新。",
    status: "memberOnly" as BenefitStatus,
    btnLabel: "查看会员权益",
    action: "upgrade",
    isLocked: true,
  },
];

// ── Paid member benefits view ─────────────────────────────────────────────
function PaidBenefitsView({ user, onGoToTools }: { user: AuthUser; onGoToTools: () => void }) {
  return (
    <>
      {/* Package card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#7c6dfa]/20 bg-card">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#7c6dfa] via-violet-400/60 to-transparent" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/10">
              <Crown size={22} className="text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-semibold text-foreground">{getMembershipLabel(user)}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  状态正常
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4">
                {[
                  ["会员有效期", user.membershipType === "founder" ? "长期有效" : "365天"],
                  ["会员编号", getMemberNumber(user)],
                  ["加入时间", formatDate(user.membershipStartedAt)],
                  ["到期时间", user.membershipType === "founder" ? "长期有效" : formatDate(user.membershipExpiresAt ?? user.vipExpiresAt)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-mono text-xs font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits grid */}
      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          权益详情
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PAID_BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 transition-all hover:border-[#7c6dfa]/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7c6dfa]/10">
                  <b.icon size={18} className="text-[#7c6dfa]" />
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
              <button
                onClick={b.action === "tools" ? onGoToTools : undefined}
                className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-foreground"
              >
                {b.btnLabel}
                <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Free user benefits view ────────────────────────────────────────────────
function FreeBenefitsView({
  user,
  onGoToTools,
  onOpenMembership,
}: {
  user: AuthUser;
  onGoToTools: () => void;
  onOpenMembership: () => void;
}) {
  return (
    <>
      {/* Free user account card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
              <User size={22} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-semibold text-foreground">普通用户</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  免费账户
                </span>
              </div>
              <p className="mt-2 font-mono text-sm text-muted-foreground">{maskPhone(user.phone)}</p>
              <p className="mt-1 text-sm text-muted-foreground">当前尚未开通 AI 自媒体会员</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenMembership}
              className="flex items-center gap-2 rounded-xl bg-[#7c6dfa] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_16px_rgba(124,109,250,0.35)]"
            >
              <ArrowUpCircle size={14} />
              升级会员
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-muted-foreground hover:border-[#7c6dfa]/30 hover:text-foreground transition-all">
              了解会员权益
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Free vs locked benefits */}
      <div>
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          权益详情
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FREE_BENEFITS.map((b) => (
            <div
              key={b.title}
              className={`flex flex-col gap-5 rounded-xl border bg-card p-6 transition-all ${
                b.isLocked ? "border-border opacity-80" : "border-border hover:border-[#7c6dfa]/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    b.isLocked ? "bg-secondary" : "bg-[#7c6dfa]/10"
                  }`}
                >
                  <b.icon
                    size={18}
                    className={b.isLocked ? "text-muted-foreground" : "text-[#7c6dfa]"}
                  />
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div>
                <h3 className={`font-medium ${b.isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                  {b.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
              <button
                onClick={
                  b.action === "tools" ? onGoToTools :
                  b.action === "upgrade" ? onOpenMembership :
                  undefined
                }
                className={`mt-auto flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                  b.isLocked
                    ? "border-[#7c6dfa]/20 bg-[#7c6dfa]/8 text-[#7c6dfa] hover:bg-[#7c6dfa]/14"
                    : "border-border bg-secondary text-muted-foreground hover:border-[#7c6dfa]/30 hover:text-foreground"
                }`}
              >
                {b.btnLabel}
                {b.isLocked ? <ArrowUpCircle size={13} /> : <ChevronRight size={13} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function MyBenefits({ user, onGoToTools, onOpenMembership }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">我的权益</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          查看你当前拥有的工具、教程、社群和持续更新权益。
        </p>
      </div>

      {user.isMember ? (
        <PaidBenefitsView user={user} onGoToTools={onGoToTools} />
      ) : (
        <FreeBenefitsView user={user} onGoToTools={onGoToTools} onOpenMembership={onOpenMembership} />
      )}

      {/* Status legend — shown for paid members only */}
      {user.isMember && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            权益状态说明
          </p>
          <div className="flex flex-wrap gap-4">
            {(["unlocked", "active", "coming", "expired"] as BenefitStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <StatusBadge status={s} />
                <span className="text-xs text-muted-foreground">
                  {s === "unlocked" && "权益已解锁，可使用"}
                  {s === "active"   && "服务运行正常"}
                  {s === "coming"   && "功能开发中"}
                  {s === "expired"  && "权益已失效"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
