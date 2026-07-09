import { useEffect, useState } from "react";
import { HomePage } from "./components/HomePage";
import { ToolsPage } from "./components/ToolsPage";
import { MemberCenter, type MemberTab } from "./components/MemberCenter";
import { useFavicon } from "./useFavicon";

type Page = "home" | "tools" | "member";

export interface AuthUser {
  phone: string;
  isMember: boolean;
  vipExpiresAt?: string | null;
  credits?: number;
  membershipType?: "free" | "annual" | "founder";
  membershipStartedAt?: string | null;
  membershipExpiresAt?: string | null;
  founderNumber?: number | null;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [memberTab, setMemberTab] = useState<MemberTab>("dashboard");
  useFavicon();

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled && data.success && data.user) {
          setUser(data.user);
        }
      } catch {
        // Ignore session restore failures during local setup.
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogin(authUser: AuthUser) {
    setUser(authUser);
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Local state is still cleared so the user can continue.
    }

    setUser(null);
    setPage("home");
  }

  function handleMemberUpgrade(authUser: AuthUser) {
    setUser(authUser);
  }

  function handleGoToMember(tab: MemberTab = "dashboard") {
    setMemberTab(tab);
    setPage("member");
  }

  const commonProps = {
    isDark,
    onToggleTheme: () => setIsDark((v) => !v),
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onMemberUpgrade: handleMemberUpgrade,
    onGoToMember: handleGoToMember,
  };

  if (page === "member" && user) {
    return (
      <div className={`size-full ${isDark ? "" : "light"}`}>
        <MemberCenter
          user={user}
          initialTab={memberTab}
          onBack={() => setPage("home")}
          onLogout={handleLogout}
          onGoToTools={() => setPage("tools")}
          onMemberUpgrade={handleMemberUpgrade}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />
      </div>
    );
  }

  return (
    <div className={`size-full ${isDark ? "" : "light"}`}>
      {page === "home" ? (
        <HomePage {...commonProps} onGoToTools={() => setPage("tools")} />
      ) : (
        <ToolsPage {...commonProps} onBack={() => setPage("home")} />
      )}
    </div>
  );
}
