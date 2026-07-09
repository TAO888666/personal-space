import { useState, useRef, useEffect } from "react";
import { Crown, Settings, LogOut, ChevronDown, Gift, LayoutDashboard } from "lucide-react";
import type { MemberTab } from "./MemberCenter";

interface UserMenuProps {
  phone: string;
  isMember: boolean;
  membershipType?: "free" | "annual" | "founder";
  founderNumber?: number | null;
  onLogout: () => void;
  onOpenMembership: () => void;
  onGoToMember: (tab?: MemberTab) => void;
}

function maskPhone(phone: string) {
  if (phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function getInitial(phone: string) {
  return phone.charAt(0) || "U";
}

function getMembershipLabel(membershipType?: "free" | "annual" | "founder", founderNumber?: number | null) {
  if (membershipType === "founder") {
    return `创始会员${founderNumber ? ` · No.${founderNumber}` : ""}`;
  }

  if (membershipType === "annual") {
    return "年会员";
  }

  return "免费用户";
}

export function UserMenu({
  phone,
  isMember,
  membershipType,
  founderNumber,
  onLogout,
  onOpenMembership,
  onGoToMember,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const membershipLabel = getMembershipLabel(membershipType, founderNumber);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm transition-all hover:border-[#7c6dfa]/30"
      >
        {/* Avatar */}
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c6dfa] text-[11px] font-bold text-white">
          {getInitial(phone)}
          {isMember && (
            <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500">
              <Crown size={7} className="text-white" />
            </div>
          )}
        </div>
        <span className="font-mono text-xs text-foreground">{maskPhone(phone)}</span>
        <ChevronDown
          size={12}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {/* Header */}
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7c6dfa] text-sm font-bold text-white">
                {getInitial(phone)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-medium text-foreground">{maskPhone(phone)}</p>
                {isMember ? (
                  <div className="mt-0.5 flex items-center gap-1">
                    <Crown size={9} className="text-amber-500" />
                    <span className="text-[10px] text-amber-500">{membershipLabel}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-muted-foreground">{membershipLabel}</span>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <button
              onClick={() => { setOpen(false); onGoToMember("dashboard"); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LayoutDashboard size={14} className="text-[#7c6dfa]" />
              会员中心
            </button>
            <button
              onClick={() => { setOpen(false); onGoToMember("benefits"); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Gift size={14} className="text-amber-500" />
              我的权益
            </button>
            <button
              onClick={() => { setOpen(false); onGoToMember("settings"); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Settings size={14} />
              账号设置
            </button>
            <div className="my-1 border-t border-border" />
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500/80 transition-colors hover:bg-red-500/8 hover:text-red-500"
            >
              <LogOut size={14} />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
