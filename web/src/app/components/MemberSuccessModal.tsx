import { Crown, Sparkles } from "lucide-react";

interface MemberSuccessModalProps {
  onStartUsing: () => void;
  onViewBenefits: () => void;
}

export function MemberSuccessModal({ onStartUsing, onViewBenefits }: MemberSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow top */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-32 w-56 bg-[#7c6dfa]/20 blur-[50px]" />

        <div className="relative px-8 pt-12 pb-8">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/25 bg-amber-500/10">
            <Crown size={36} className="text-amber-500" />
          </div>

          {/* Sparkle decoration */}
          <div className="absolute top-8 left-12 text-[#7c6dfa]/40">
            <Sparkles size={16} />
          </div>
          <div className="absolute top-10 right-14 text-amber-500/30">
            <Sparkles size={12} />
          </div>

          <h2 className="mb-2 text-2xl font-semibold text-foreground">会员开通成功</h2>
          <p className="mb-1 text-base font-medium text-[#7c6dfa]">欢迎加入 AI 自媒体会员</p>
          <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
            你的会员权益已经生效，现在可以使用全部会员工具
          </p>

          <button
            onClick={onStartUsing}
            className="w-full rounded-xl bg-[#7c6dfa] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_24px_rgba(124,109,250,0.35)]"
          >
            开始使用工具
          </button>
          <button
            onClick={onViewBenefits}
            className="mt-3 w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:border-[#7c6dfa]/30 hover:text-foreground transition-all"
          >
            查看会员权益
          </button>
        </div>
      </div>
    </div>
  );
}
