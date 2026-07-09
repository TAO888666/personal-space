import { useState } from "react";
import {
  LayoutDashboard, Gift, Settings, LogOut, Crown,
  ArrowLeft, ChevronRight, Menu, X,
} from "lucide-react";
import { MemberDashboard } from "./member/MemberDashboard";
import { MyBenefits } from "./member/MyBenefits";
import { AccountSettings } from "./member/AccountSettings";
import { MembershipModal } from "./MembershipModal";
import { MemberSuccessModal } from "./MemberSuccessModal";
import { ThemeToggle } from "./ThemeToggle";
import type { AuthUser } from "../App";

export type MemberTab = "dashboard" | "benefits" | "settings";

interface Props {
  user: AuthUser;
  initialTab?: MemberTab;
  onBack: () => void;
  onLogout: () => void;
  onGoToTools: () => void;
  onMemberUpgrade: (user: AuthUser) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

function maskPhone(p: string) {
  return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function getMembershipLabel(user: AuthUser) {
  if (user.membershipType === "founder") {
    return `创始会员${user.founderNumber ? ` · No.${user.founderNumber}` : ""}`;
  }

  if (user.membershipType === "annual") {
    return "年会员";
  }

  return "普通用户";
}

const NAV_ITEMS: { id: MemberTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "会员中心", icon: LayoutDashboard },
  { id: "benefits",  label: "我的权益", icon: Gift },
  { id: "settings",  label: "账号设置", icon: Settings },
];

function Sidebar({
  user,
  activeTab,
  onTabChange,
  onBack,
  onLogout,
  isDark,
  onToggleTheme,
  onClose,
}: {
  user: AuthUser;
  activeTab: MemberTab;
  onTabChange: (t: MemberTab) => void;
  onBack: () => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo + back */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <button
          onClick={onBack}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="返回主站"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-base font-semibold tracking-tight text-foreground">
          <span className="text-[#7c6dfa]">TaoX</span> AI
        </span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7c6dfa] text-base font-bold text-white">
            {user.phone.charAt(0)}
            {user.isMember && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 shadow-sm">
                <Crown size={9} className="text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-medium text-foreground">{maskPhone(user.phone)}</p>
            <p className="mt-0.5 text-xs">
              {user.isMember ? (
                <span className="text-amber-500">{getMembershipLabel(user)}</span>
              ) : (
                <span className="text-muted-foreground">普通用户</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { onTabChange(item.id); onClose?.(); }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              activeTab === item.id
                ? "bg-[#7c6dfa]/12 text-[#7c6dfa]"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon size={15} />
            {item.label}
            {activeTab === item.id && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7c6dfa]" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom: theme + logout */}
      <div className="border-t border-border px-3 py-4 space-y-1">
        <div className="px-3 py-1">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500/60 transition-all hover:bg-red-500/8 hover:text-red-500"
        >
          <LogOut size={15} />
          退出登录
        </button>
      </div>
    </div>
  );
}

export function MemberCenter({
  user,
  initialTab = "dashboard",
  onBack,
  onLogout,
  onGoToTools,
  onMemberUpgrade,
  isDark,
  onToggleTheme,
}: Props) {
  const [activeTab, setActiveTab] = useState<MemberTab>(initialTab);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function handleUpgrade(authUser: AuthUser) {
    onMemberUpgrade(authUser);
    setShowMembershipModal(false);
    setShowSuccessModal(true);
  }

  function handleLogout() {
    setShowLogoutModal(false);
    onLogout();
    onBack();
  }

  function handleSidebarLogout() {
    setMobileOpen(false);
    setShowLogoutModal(true);
  }

  const currentLabel = NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "";

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Desktop sidebar (fixed) ── */}
      <aside className="hidden lg:flex w-64 shrink-0 fixed left-0 top-0 bottom-0 flex-col border-r border-border bg-card z-40">
        <Sidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBack={onBack}
          onLogout={handleSidebarLogout}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border">
            <Sidebar
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onBack={onBack}
              onLogout={handleSidebarLogout}
              isDark={isDark}
              onToggleTheme={onToggleTheme}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col lg:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 backdrop-blur-xl px-4 py-3.5 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Menu size={17} />
          </button>
          <span className="text-sm font-semibold text-foreground">{currentLabel}</span>
          <div className="ml-auto">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-30 items-center justify-between border-b border-border bg-background/90 backdrop-blur-xl px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={onBack} className="hover:text-foreground transition-colors">
              TaoX AI
            </button>
            <ChevronRight size={13} />
            <span className="font-medium text-foreground">{currentLabel}</span>
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 pb-28 lg:pb-12">
            {activeTab === "dashboard" && (
              <MemberDashboard
                user={user}
                onGoToBenefits={() => setActiveTab("benefits")}
                onGoToSettings={() => setActiveTab("settings")}
                onGoToTools={onGoToTools}
                onOpenMembership={() => setShowMembershipModal(true)}
              />
            )}
            {activeTab === "benefits" && (
              <MyBenefits
                user={user}
                onGoToTools={onGoToTools}
                onOpenMembership={() => setShowMembershipModal(true)}
              />
            )}
            {activeTab === "settings" && (
              <AccountSettings
                user={user}
                onLogout={() => { onLogout(); onBack(); }}
              />
            )}
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="fixed bottom-0 inset-x-0 z-30 flex border-t border-border bg-card/95 backdrop-blur-xl lg:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                activeTab === item.id ? "text-[#7c6dfa]" : "text-muted-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Membership upgrade modal ── */}
      {showMembershipModal && (
        <MembershipModal
          onClose={() => setShowMembershipModal(false)}
          onUpgradeSuccess={handleUpgrade}
          isLoggedIn={true}
          onLoginRequired={() => {}}
        />
      )}
      {showSuccessModal && (
        <MemberSuccessModal
          onStartUsing={() => { setShowSuccessModal(false); onGoToTools(); }}
          onViewBenefits={() => { setShowSuccessModal(false); setActiveTab("benefits"); }}
        />
      )}

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div
            className="relative z-10 w-full max-w-[360px] rounded-2xl border border-border bg-card shadow-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-secondary">
              <LogOut size={20} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">确定退出当前账号吗？</h3>
            <p className="mt-2 mb-7 text-sm text-muted-foreground">退出后需重新登录才能访问会员功能</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white hover:bg-red-600 transition-all"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
