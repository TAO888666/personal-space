import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { ToolsPage } from "./components/ToolsPage";

type Page = "home" | "tools";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`size-full ${isDark ? "" : "light"}`}>
      {page === "home" ? (
        <HomePage
          onGoToTools={() => setPage("tools")}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />
      ) : (
        <ToolsPage
          onBack={() => setPage("home")}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />
      )}
    </div>
  );
}