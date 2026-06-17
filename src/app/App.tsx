import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { ToolsPage } from "./components/ToolsPage";
import { useFavicon } from "./useFavicon";

type Page = "home" | "tools";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isDark, setIsDark] = useState(true);
  useFavicon();

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
