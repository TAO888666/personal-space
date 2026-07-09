import { X, Check, Minus, Crown, Flame } from "lucide-react";
import { useState } from "react";
import type { AuthUser } from "../App";

interface MembershipModalProps {
  onClose: () => void;
  onUpgradeSuccess: (user: AuthUser) => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

type MembershipPlan = "annual" | "founder";

const WECHAT_QR_SRC = "/wechat-qr.png";

const FREE_PERKS = [
  { text: "浏览免费工具", included: true },
  { text: "查看基础工具信息", included: true },
  { text: "体验部分公开内容", included: true },
  { text: "会员专属工具", included: false },
  { text: "教程内容", included: false },
  { text: "社群与项目分享", included: false },
];

const ANNUAL_PERKS = [
  { text: "解锁全部会员工具" },
  { text: "工具库持续更新" },
  { text: "教程内容可查看" },
  { text: "会员身份有效期一年" },
  { text: "适合个人学习与创作提效" },
];

const FOUNDING_PERKS = [
  { text: "当前工具库长期使用权" },
  { text: "已上线教程内容永久查看" },
  { text: "首年社群权益" },
  { text: "首年项目分享" },
  { text: "首年更新服务" },
  { text: "创始会员身份标识" },
];

function PerkRow({ text, included = true }: { text: string; included?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      {included ? (
        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
          <Check size={10} className="text-emerald-500" />
        </div>
      ) : (
        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-border">
          <Minus size={10} className="text-muted-foreground/50" />
        </div>
      )}
      <span className={`text-sm leading-snug ${included ? "text-foreground" : "text-muted-foreground/50 line-through"}`}>
        {text}
      </span>
    </div>
  );
}

export function MembershipModal({ onClose, isLoggedIn, onLoginRequired }: MembershipModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  function getPlanLabel(plan: MembershipPlan) {
    return plan === "annual" ? "年会员" : "创始会员";
  }

  function getPlanAmount(plan: MembershipPlan) {
    return plan === "annual" ? "¥299 / 年" : "¥499";
  }

  function handleSelectPlan(plan: MembershipPlan) {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    setSelectedPlan(plan);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto p-4 py-8 sm:items-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-8 pb-6 text-center sm:px-10">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#7c6dfa]">
            TaoX AI 会员
          </p>
          <h2 className="text-xl font-semibold text-foreground">选择适合你的方案</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            开通会员，解锁工具库、教程和社群权益
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-3 sm:px-8 sm:pb-8">
          <div className="flex flex-col rounded-xl border border-border bg-background p-5">
            <div className="mb-4">
              <p className="text-xs font-mono font-medium uppercase tracking-wide text-muted-foreground">免费用户</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">¥0</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                适合先体验工具库
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 border-t border-border pt-4">
              {FREE_PERKS.map((p) => (
                <PerkRow key={p.text} text={p.text} included={p.included} />
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-[#7c6dfa]/20 hover:text-foreground"
            >
              当前权益
            </button>
          </div>

          <div className="flex flex-col rounded-xl border border-[#7c6dfa]/30 bg-background p-5">
            <div className="mb-4">
              <p className="text-xs font-mono font-medium uppercase tracking-wide text-[#7c6dfa]">年会员</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">¥</span>
                <span className="text-2xl font-bold text-foreground">299</span>
                <span className="text-xs text-muted-foreground">/ 年</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                适合持续使用 AI 工具的个人创作者
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 border-t border-border pt-4">
              {ANNUAL_PERKS.map((p) => (
                <PerkRow key={p.text} text={p.text} />
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan("annual")}
              className="mt-5 w-full rounded-xl bg-[#7c6dfa] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_20px_rgba(124,109,250,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggedIn ? "开通年会员" : "登录后开通"}
            </button>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-xl border border-amber-500/35 bg-background p-5">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500/60 via-amber-400/40 to-transparent" />

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-500">
                <Crown size={10} />
                创始会员
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/8 px-2.5 py-0.5 text-[11px] font-medium text-red-400">
                <Flame size={10} />
                限量 50 席
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs font-mono font-medium uppercase tracking-wide text-amber-500">创始会员</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">¥</span>
                <span className="text-2xl font-bold text-foreground">499</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                适合早期深度用户和项目型创作者
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 border-t border-border pt-4">
              {FOUNDING_PERKS.map((p) => (
                <PerkRow key={p.text} text={p.text} />
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan("founder")}
              className="mt-5 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 text-sm font-semibold text-amber-500 transition-all hover:bg-amber-500/18 hover:border-amber-500/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggedIn ? "抢占创始席位" : "登录后抢占"}
            </button>
          </div>
        </div>

        {selectedPlan && (
          <div className="mx-6 mb-5 grid gap-4 rounded-xl border border-[#7c6dfa]/25 bg-[#7c6dfa]/8 p-4 sm:mx-8 sm:grid-cols-[128px_1fr] sm:items-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2">
              <img
                src={WECHAT_QR_SRC}
                alt="微信二维码"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#7c6dfa]">
                {getPlanLabel(selectedPlan)} · {getPlanAmount(selectedPlan)}
              </p>
              <h3 className="mt-1 text-base font-semibold text-foreground">添加微信人工开通会员</h3>
              <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                <p>添加微信联系负责人完成付款升级，请发送你的登录手机号。</p>
                <p>确认付款后为你开通会员权限，并邀请进入会员社群。</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-border px-6 py-4 sm:px-8">
          <p className="text-center text-xs leading-relaxed text-muted-foreground/60">
            创始会员长期权益指当前工具库与已上线教程内容；未来独立课程、项目服务或高成本工具可能单独定价。
          </p>
        </div>
      </div>
    </div>
  );
}
