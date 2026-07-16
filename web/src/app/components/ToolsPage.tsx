import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ToolCard, Tool } from "./ToolCard";
import { ToolModal } from "./ToolModal";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";
import { MembershipModal } from "./MembershipModal";
import { MemberSuccessModal } from "./MemberSuccessModal";
import { UserMenu } from "./UserMenu";
import type { AuthUser } from "../App";
import type { MemberTab } from "./MemberCenter";
import ccSwitchImg from "../../imports/ChatGPT_Image_2026_6_10__12_00_16.png";
import video2xImg from "../../imports/ChatGPT_Image_2026_6_11__11_43_39.png";
import vibeImg from "../../imports/ChatGPT_Image_2026_6_11__12_11_32.png";
import ObsidianImg from "../../imports/ChatGPT_Image_2026_6_11__12_25_26.png";
import opendesignImg from "../../imports/ChatGPT_Image_2026_6_11__14_46_10.png";
import collectionCenterImg from "../../imports/ChatGPT_Image_2026_6_11__15_45_43.png";
import autoUploadImg from "../../imports/ChatGPT_Image_2026_6_22.png";
import HtmlVideoImg from "../../imports/ChatGPT_Image_2026_7_3__12_11_41.png";
import aiCopyWorkbenchImg from "../../imports/ai-copy-workbench.png";

const ALL_TOOLS: Tool[] = [
  {
    id: "midjourney",
    name: "Midjourney",
    description:
      "业界顶级的AI图像生成工具，通过自然语言描述创作令人惊叹的艺术作品，广泛用于内容配图与创意设计。",
    category: "图像生成",
    tags: ["图像", "创意", "设计"],
    rating: 4.9,
    users: "2000万+",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    isFeatured: true,
    review:
      "以前做自媒体配图要找素材、找设计师，现在一句话描述出图，省下的钱比会员费多十倍。",
  },
  {
    id: "runway-ml",
    name: "Runway ML",
    description:
      "专业级AI视频生成与编辑平台，支持文字转视频、视频风格迁移，是视频创作者的核心生产力工具。",
    category: "视频生成",
    tags: ["视频", "编辑", "特效"],
    rating: 4.8,
    users: "500万+",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d",
    isNew: true,
    isFeatured: true,
    requiresMember: true,
    review:
      "拍了一段普通素材，用它加完特效发出去，粉丝以为我请了专业团队拍摄。",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description:
      "最逼真的AI语音合成平台，支持多语言声音克隆，为播客、有声书和视频配音提供专业级语音输出。",
    category: "语音合成",
    tags: ["语音", "配音", "克隆"],
    rating: 4.8,
    users: "300万+",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    isFeatured: true,
    requiresMember: true,
    review:
      "不想出镜又想做视频？克隆自己的声音，让AI替你说话，听不出任何违和感。",
  },
  {
    id: "vibe",
    name: "Vibe",
    description:
      "本地优先的离线音视频转录工具，支持多语言识别、字幕导出与隐私安全保护，基于 Whisper 引擎，无需联网即可使用。",
    category: "文字创作",
    tags: ["转录", "字幕", "离线"],
    rating: 4.9,
    users: "1000万+",
    image: "",
    imageLocal: vibeImg,
    review:
      "录完采访/会议直接扔进去，几分钟出字幕，不用联网不怕隐私泄露，手动转录的时代结束了。",
  },
  {
    id: "video2x",
    name: "Video2X",
    description:
      "Video2X 是一款基于 AI 的视频处理工具，可实现视频超分辨率增强与智能插帧，使低清视频变得清晰流畅。",
    category: "视频编辑",
    tags: ["超分辨率", "插帧", "画质增强"],
    rating: 4.7,
    users: "开源社区",
    image: "",
    imageLocal: video2xImg,
    isNew: true,
    review:
      "早年拍的低画质素材本来要废掉，丢进去跑一遍，直接变高清，省了重新拍的功夫。",
  },
  {
    id: "canva-ai",
    name: "Canva AI",
    description:
      "集成AI的在线设计平台，提供一键生成海报、封面、社交媒体图片，让设计零门槛。",
    category: "图像生成",
    tags: ["设计", "海报", "社交"],
    rating: 4.6,
    users: "1.5亿+",
    image:
      "https://images.unsplash.com/photo-1697033300784-6c9d143a30e2",
    review:
      "不会PS也不会设计，但我做的封面总被人问是谁设计的——就是它。",
  },
  {
    id: "udio",
    name: "Udio",
    description:
      "下一代AI音乐创作平台，输入风格描述即可生成专业级完整音乐作品，覆盖各类曲风。",
    category: "音乐创作",
    tags: ["音乐", "生成", "创作"],
    rating: 4.7,
    users: "50万+",
    image:
      "https://images.unsplash.com/photo-1741746239350-9021ddfa3d59",
    isNew: true,
    review:
      "视频背景音乐再也不用去买版权了，想要什么风格直接生成，完全免版权。",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description:
      "本地化知识管理与笔记工具，支持 Markdown 语法、双向链接和插件扩展，能够帮助用户构建个人知识库。通过直观的笔记结构和可视化知识图谱，用户可以高效整理和管理想法、项目与信息，同时保持数据完全掌控和隐私安全。",
    category: "文字创作",
    tags: ["笔记", "协作", "摘要"],
    rating: 4.6,
    users: "2000万+",
    image: "",
    imageLocal: ObsidianImg,
    review:
      "选题、脚本、参考资料全部扔进去管理，再也不会出现「那个素材我存哪了」的情况。",
  },
  {
    id: "pika-labs",
    name: "Pika Labs",
    description:
      "快速崛起的AI视频生成工具，支持图片转视频和文字转视频，生成质量高、速度快。",
    category: "视频生成",
    tags: ["视频", "动画", "转化"],
    rating: 4.5,
    users: "100万+",
    image:
      "https://images.unsplash.com/photo-1550275994-cdc89cd1948f",
    isNew: true,
    requiresMember: true,
    review:
      "发一张产品图进去，出来一段动态视频，发小红书的转化率直接翻倍。",
  },
  {
    id: "open-design",
    name: "Open Design",
    description:
      "一款集矢量图形设计、动效制作、图文排版于一体的开源神器，不用切换软件，一站式搞定自媒体封面、插图与视频视觉元素！AI生成 Web、桌面、移动端原型、PPT、海报和设计系统稿",
    category: "图像生成",
    tags: ["AI", "免费", "图像"],
    rating: 4.5,
    users: "3000万+",
    image: "",
    imageLocal: opendesignImg,
    review:
      "以前设计封面要开好几个软件来回切，现在一个搞定，创作者必备的瑞士军刀。",
  },
  {
    id: "suno-ai",
    name: "Suno AI",
    description:
      "极简操作的AI音乐生成器，只需一句话描述即可生成带人声的完整歌曲，创作门槛极低。",
    category: "音乐创作",
    tags: ["歌曲", "人声", "简单"],
    rating: 4.8,
    users: "200万+",
    image:
      "https://images.unsplash.com/photo-1556196148-1fb724238998",
    isFeatured: true,
    review:
      "写一句歌词描述，一分钟生成一首完整的歌，我用它给视频做片头曲，粉丝以为我专门制作的。",
  },
  {
    id: "ai-video-generator",
    name: "AI一站式视频生成软件",
    description:
      "AI代码生成动画，只需给一个标题自动生成完整的短视频，一站式配音导出。",
    category: "视频编辑",
    tags: ["短视频", "创作", "AI"],
    rating: 4.8,
    users: "5亿+",
    image: "",
    imageLocal: HtmlVideoImg,
    requiresMember: true,
    review: "非常适合文字展示类，科普讲解赛道，条条爆款。",
  },
  {
    id: "cc-switch",
    name: "Cc switch",
    description:
      "一键切换 AI Coding 工具的效率神器。统一管理 Claude、Codex、Gemini CLI 等多个 AI 编程助手，快速切换、多平台支持，让开发者告别反复配置的烦恼。",
    category: "编程开发",
    tags: ["Coding", "CLI", "效率"],
    rating: 4.8,
    users: "持续增长",
    image: "",
    imageLocal: ccSwitchImg,
    isNew: true,
    isFeatured: true,
    review:
      "同时用好几个AI编程助手？一个工具统一管理，再也不用反复登录切换账号了。",
  },
  {
    id: "collection-center",
    name: "Collection Center",
    description:
      "本地运行的信息采集辅助工具，可实时监控账号作品意向评论，覆盖小红书、抖音、B站、知乎等主流平台，适合学习、研究与个人数据整理场景。",
    category: "数据采集",
    tags: ["采集", "多平台", "数据导出"],
    rating: 4.8,
    users: "持续增长",
    image: "",
    imageLocal: collectionCenterImg,
    isNew: true,
    requiresMember: true,
    review:
      "市面上卖你好几千的截流系统，它能实时监控账号作品评论区意向用户，仅供学习参考",
  },
  {
    id: "ultimate-screen-cast",
    name: "极限投屏",
    description:
      "批量投屏管理安卓设备的高性能工具，基于 QtScrcpy 开发，单台电脑可同时管理 500+ 台手机。USB 投屏 1080p 延迟 30ms 以内，支持分组管理、WiFi 投屏、文件传输、APK 安装与完美中文输入。",
    category: "设备管理",
    tags: ["投屏", "Android", "批量控制"],
    rating: 4.9,
    users: "持续增长",
    image:
      "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7",
    isNew: true,
    isFeatured: true,
    review:
      "做手机矩阵的必备神器，500台手机一台电脑管，延迟低到感觉不出来是远程操控。",
  },
  {
    id: "auto-publish-system",
    name: "批量自动发布系统",
    description:
      "抖音快手小红书视频账号，四大平台自动发布，AI 生成标题文案。",
    category: "批量发布",
    tags: ["发布", "视频", "图文"],
    rating: 4.9,
    users: "持续增长",
    image: "",
    imageLocal: autoUploadImg,
    isFeatured: false,
    requiresMember: true,
    review:
      "不管是发多个平台还是多个账号，都能自动生成标题文案，视频量大，账号多的时候，终于不用自己写标题和文案，生成到自动发布一条链跑通，效率提升非常明显。",
  },
  {
    id: "ai-copy-workbench",
    name: "AI文案工作台",
    description:
      "面向短视频运营和内容团队的AI文案提效工具，支持批量下载无水印视频与封面、提取文案，并完成文案分析、诊断、拆解和爆款框架复用。",
    category: "文字创作",
    tags: ["文案", "AI", "批量"],
    rating: 4.8,
    users: "持续增长",
    image: "",
    imageLocal: aiCopyWorkbenchImg,
    requiresMember: true,
    review:
      "以前拆爆款要手工采集、下载、复制和归类，一条条做很耗时间。这个工作台把素材采集、文案提取、分析诊断和框架复用串成一条完整流程，特别适合短视频运营者沉淀自己的爆款文案资产。",
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
  "批量发布",
];

interface ToolsPageProps {
  onBack: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onMemberUpgrade: (user: AuthUser) => void;
  onGoToMember: (tab?: MemberTab) => void;
}

type ModalState = "none" | "auth" | "membership" | "memberSuccess";

export function ToolsPage({
  onBack,
  isDark,
  onToggleTheme,
  user,
  onLogin,
  onLogout,
  onMemberUpgrade,
  onGoToMember,
}: ToolsPageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [modal, setModal] = useState<ModalState>("none");
  const [accessError, setAccessError] = useState("");
  const hasActiveMembership = user?.membershipType === "annual" || user?.membershipType === "founder";

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

  async function handleOpenTool(tool: Tool) {
    setAccessError("");
    if (tool.comingSoon) return;

    if (!user) {
      setModal("auth");
      return;
    }

    if (tool.requiresMember) {
      if (!hasActiveMembership) {
        setModal("membership");
        return;
      }
    }

    try {
      const response = await fetch("/api/tools/access", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id }),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        setModal("auth");
        return;
      }

      if (response.status === 403) {
        setModal("membership");
        return;
      }

      if (!response.ok || !data?.success) {
        setAccessError(data?.message || "工具访问失败，请稍后再试");
        return;
      }

      const accessUrl = data.tool?.url;
      if (!accessUrl) {
        setAccessError("工具链接暂未配置");
        return;
      }

      if (data.tool?.extractCode) {
        void navigator.clipboard?.writeText(data.tool.extractCode).catch(() => {});
        setAccessError(`提取码：${data.tool.extractCode}`);
      }

      window.open(accessUrl, "_blank", "noopener,noreferrer");
    } catch {
      setAccessError("网络异常，请稍后再试");
    }
  }

  function handleLoginSuccess(authUser: AuthUser) {
    onLogin(authUser);
    setModal("none");
  }

  function handleUpgrade(authUser: AuthUser) {
    onMemberUpgrade(authUser);
    setModal("none");
    setModal("memberSuccess");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modals */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          onOpenTool={handleOpenTool}
        />
      )}
      {accessError && (
        <div className="fixed left-1/2 top-20 z-[120] -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground shadow-2xl">
          {accessError}
        </div>
      )}
      {modal === "auth" && (
        <AuthModal
          onClose={() => setModal("none")}
          onSuccess={handleLoginSuccess}
        />
      )}
      {modal === "membership" && (
        <MembershipModal
          onClose={() => setModal("none")}
          onUpgradeSuccess={handleUpgrade}
          isLoggedIn={!!user}
          onLoginRequired={() => setModal("auth")}
        />
      )}
      {modal === "memberSuccess" && (
        <MemberSuccessModal
          onStartUsing={() => setModal("none")}
          onViewBenefits={() => setModal("none")}
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
              <span className="text-[#7c6dfa]">TaoX</span> AI
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
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            {user ? (
              <UserMenu
                user={user}
                onLogout={onLogout}
                onOpenMembership={() => setModal("membership")}
                onGoToMember={onGoToMember}
              />
            ) : (
              <button
                onClick={() => setModal("auth")}
                className="rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/40 hover:text-foreground"
              >
                登录
              </button>
            )}
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
                isMember={hasActiveMembership}
                onClick={() => setSelectedTool(tool)}
                onOpenTool={() => handleOpenTool(tool)}
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
