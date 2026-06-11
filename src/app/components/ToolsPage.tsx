import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ToolCard, Tool } from "./ToolCard";
import { ToolModal } from "./ToolModal";
import { ThemeToggle } from "./ThemeToggle";
import ccSwitchImg from "../../imports/ChatGPT_Image_2026_6_10__12_00_16.png";
import video2xImg from "../../imports/ChatGPT_Image_2026_6_11__11_43_39.png";
import vibeImg from "../../imports/ChatGPT_Image_2026_6_11__12_11_32.png";
import ObsidianImg from "../../imports/ChatGPT_Image_2026_6_11__12_25_26.png";
import opendesignImg from "../../imports/ChatGPT_Image_2026_6_11__14_46_10.png";
import collectionCenterImg from "../../imports/ChatGPT_Image_2026_6_11__15_45_43.png";

const ALL_TOOLS: Tool[] = [
  {
    id: "1",
    name: "Midjourney",
    description:
      "业界顶级的AI图像生成工具，通过自然语言描述创作令人惊叹的艺术作品，广泛用于内容配图与创意设计。",
    category: "图像生成",
    tags: ["图像", "创意", "设计"],
    rating: 4.9,
    users: "2000万+",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    url: "https://midjourney.com",
    isFeatured: true,
  },
  {
    id: "2",
    name: "Runway ML",
    description:
      "专业级AI视频生成与编辑平台，支持文字转视频、视频风格迁移，是视频创作者的核心生产力工具。",
    category: "视频生成",
    tags: ["视频", "编辑", "特效"],
    rating: 4.8,
    users: "500万+",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d",
    url: "https://runwayml.com",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "3",
    name: "ElevenLabs",
    description:
      "最逼真的AI语音合成平台，支持多语言声音克隆，为播客、有声书和视频配音提供专业级语音输出。",
    category: "语音合成",
    tags: ["语音", "配音", "克隆"],
    rating: 4.8,
    users: "300万+",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    url: "https://elevenlabs.io",
    isFeatured: true,
  },
  {
    id: "4",
    name: "Vibe",
    description:
      "本地优先的离线音视频转录工具，支持多语言识别、字幕导出与隐私安全保护，基于 Whisper 引擎，无需联网即可使用。",
    category: "文字创作",
    tags: ["转录", "字幕", "离线"],
    rating: 4.9,
    users: "1000万+",
    image: "",
    imageLocal: vibeImg,
    url: "https://pan.quark.cn/s/63d94107daeb",
  },
  {
    id: "5",
    name: "Video2X",
    description:
      "Video2X 是一款基于 AI 的视频处理工具，可实现视频超分辨率增强与智能插帧，使低清视频变得清晰流畅。",
    category: "视频编辑",
    tags: ["超分辨率", "插帧", "画质增强"],
    rating: 4.7,
    users: "开源社区",
    image: "",
    imageLocal: video2xImg,
    url: "https://pan.quark.cn/s/742bc27e559f",
    isNew: true,
  },
  {
    id: "6",
    name: "Canva AI",
    description:
      "集成AI的在线设计平台，提供一键生成海报、封面、社交媒体图片，让设计零门槛。",
    category: "图像生成",
    tags: ["设计", "海报", "社交"],
    rating: 4.6,
    users: "1.5亿+",
    image:
      "https://images.unsplash.com/photo-1697033300784-6c9d143a30e2",
    url: "https://canva.com",
  },
  {
    id: "7",
    name: "Udio",
    description:
      "下一代AI音乐创作平台，输入风格描述即可生成专业级完整音乐作品，覆盖各类曲风。",
    category: "音乐创作",
    tags: ["音乐", "生成", "创作"],
    rating: 4.7,
    users: "50万+",
    image:
      "https://images.unsplash.com/photo-1741746239350-9021ddfa3d59",
    url: "https://udio.com",
    isNew: true,
  },
  {
    id: "8",
    name: "Obsidian",
    description:
      "本地化知识管理与笔记工具，支持 Markdown 语法、双向链接和插件扩展，能够帮助用户构建个人知识库。通过直观的笔记结构和可视化知识图谱，用户可以高效整理和管理想法、项目与信息，同时保持数据完全掌控和隐私安全。",
    category: "文字创作",
    tags: ["笔记", "协作", "摘要"],
    rating: 4.6,
    users: "2000万+",
    image: "",
    imageLocal: ObsidianImg,
    url: "https://pan.quark.cn/s/17b300580712",
  },
  {
    id: "9",
    name: "Pika Labs",
    description:
      "快速崛起的AI视频生成工具，支持图片转视频和文字转视频，生成质量高、速度快。",
    category: "视频生成",
    tags: ["视频", "动画", "转化"],
    rating: 4.5,
    users: "100万+",
    image:
      "https://images.unsplash.com/photo-1550275994-cdc89cd1948f",
    url: "https://pika.art",
    isNew: true,
  },
  {
    id: "10",
    name: "Open Design",
    description:
      "一款集矢量图形设计、动效制作、图文排版于一体的开源神器，不用切换软件，一站式搞定自媒体封面、插图与视频视觉元素！AI生成 Web、桌面、移动端原型、PPT、海报和设计系统稿",
    category: "图像生成",
    tags: ["AI", "免费", "图像"],
    rating: 4.5,
    users: "3000万+",
    image: "",
    imageLocal: opendesignImg,
    url: "https://pan.quark.cn/s/58c7d9434869",
  },
  {
    id: "11",
    name: "Suno AI",
    description:
      "极简操作的AI音乐生成器，只需一句话描述即可生成带人声的完整歌曲，创作门槛极低。",
    category: "音乐创作",
    tags: ["歌曲", "人声", "简单"],
    rating: 4.8,
    users: "200万+",
    image:
      "https://images.unsplash.com/photo-1556196148-1fb724238998",
    url: "https://suno.com",
    isFeatured: true,
  },
  {
    id: "12",
    name: "CapCut AI",
    description:
      "面向短视频创作者的全能剪辑工具，AI自动字幕、智能剪辑、一键成片，是抖音创作者首选。",
    category: "视频编辑",
    tags: ["短视频", "字幕", "剪辑"],
    rating: 4.7,
    users: "5亿+",
    image:
      "https://images.unsplash.com/photo-1724862936518-ae7fcfc052c1",
    url: "https://capcut.com",
  },
  {
    id: "13",
    name: "Cc switch",
    description:
      "一键切换 AI Coding 工具的效率神器。统一管理 Claude、Codex、Gemini CLI 等多个 AI 编程助手，快速切换、多平台支持，让开发者告别反复配置的烦恼。",
    category: "编程开发",
    tags: ["Coding", "CLI", "效率"],
    rating: 4.8,
    users: "持续增长",
    image: "",
    imageLocal: ccSwitchImg,
    url: "https://pan.quark.cn/s/7506cd1a62e7",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "14",
    name: "Collection Center",
    description:
      "本地运行的信息采集辅助工具，支持通过可视化界面配置采集任务，覆盖小红书、抖音、B站、知乎等主流平台，支持 JSON / CSV / Excel / SQLite 多格式导出，适合学习、研究与个人数据整理场景。",
    category: "数据采集",
    tags: ["采集", "多平台", "数据导出"],
    rating: 4.8,
    users: "持续增长",
    image: "",
    imageLocal: collectionCenterImg,
    url: "https://pan.quark.cn/s/2250fd28c409",
    isNew: true,
  },
  {
    id: "15",
    name: "极限投屏",
    description:
      "批量投屏管理安卓设备的高性能工具，基于 QtScrcpy 开发，单台电脑可同时管理 500+ 台手机。USB 投屏 1080p 延迟 30ms 以内，支持分组管理、WiFi 投屏、文件传输、APK 安装与完美中文输入。",
    category: "设备管理",
    tags: ["投屏", "Android", "批量控制"],
    rating: 4.9,
    users: "持续增长",
    image: "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7",
    url: "https://pan.quark.cn/s/d2e9b80d3e87",
    isNew: true,
    isFeatured: true,
  },
];

const CATEGORIES = [
  "全部",
  "图像生成",
  "视频生成",
  "视频编辑",
  "文字创作",
  "语音合成",
  "音乐创作",
  "编程开发",
  "数据采集",
  "设备管理",
];

interface ToolsPageProps {
  onBack: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function ToolsPage({
  onBack,
  isDark,
  onToggleTheme,
}: ToolsPageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(
    null,
  );

  const filtered = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchCat =
        activeCategory === "全部" ||
        tool.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-lg font-semibold tracking-tight text-foreground">
              <span className="text-[#7c6dfa]">Creator</span>AI
            </span>
          </button>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              onClick={onBack}
              className="hover:text-foreground transition-colors px-2"
            >
              首页
            </button>
            <span className="text-foreground font-medium px-2">
              工具库
            </span>
            <ThemeToggle
              isDark={isDark}
              onToggle={onToggleTheme}
            />
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            AI 工具库
          </h1>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="搜索工具名称、功能、标签..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-[#7c6dfa]/50 focus:ring-1 focus:ring-[#7c6dfa]/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal size={14} />
            <span className="font-mono">
              {filtered.length} 个结果
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#7c6dfa] text-white shadow-[0_0_20px_rgba(124,109,250,0.3)]"
                  : "border border-border bg-secondary text-muted-foreground hover:border-[#7c6dfa]/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => setSelectedTool(tool)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-foreground font-medium mb-1">
              没有找到相关工具
            </p>
            <p className="text-muted-foreground text-sm">
              尝试其他关键词或分类
            </p>
          </div>
        )}
      </div>
    </div>
  );
}