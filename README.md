# 自媒体工具合集网站

一个面向自媒体创作者、内容团队和效率工具爱好者的 AI 工具导航站。项目以「好用、可落地、持续更新」为核心，整理图像生成、视频生成、视频编辑、文字创作、语音合成、音乐创作、编程开发、数据采集、设备管理等常用工具。

## 项目亮点

- 工具卡片展示：包含名称、分类、标签、评分、用户量、封面图和访问链接。
- 分类筛选：支持按工具类型快速浏览。
- 搜索功能：可按工具名称、描述、分类和标签检索。
- 工具详情弹窗：点击工具后查看更完整的介绍和跳转入口。
- 精选推荐：突出展示适合创作者优先尝试的工具。
- 明暗主题切换：适配不同使用环境。
- 响应式界面：兼容桌面端和移动端浏览。

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- lucide-react
- motion

## 本地运行

确保已经安装 Node.js，然后在项目目录执行：

```bash
npm install
npm run dev
```

启动后打开终端提示的本地地址即可预览。

## 构建

```bash
npm run build
```

构建产物会生成在 `dist/` 目录中，可部署到 GitHub Pages、Vercel、Netlify 或任意静态网站托管服务。

## 目录结构

```text
.
├── index.html
├── package.json
├── vite.config.ts
├── src
│   ├── app
│   │   ├── App.tsx
│   │   └── components
│   │       ├── HomePage.tsx
│   │       ├── ToolsPage.tsx
│   │       ├── ToolCard.tsx
│   │       ├── ToolModal.tsx
│   │       └── ui/
│   ├── imports/
│   ├── main.tsx
│   └── styles/
└── guidelines/
```

## 工具数据维护

当前工具列表主要维护在：

```text
src/app/components/ToolsPage.tsx
```

新增工具时，可在 `ALL_TOOLS` 数组中追加工具信息，包括：

- `name`：工具名称
- `description`：工具介绍
- `category`：工具分类
- `tags`：工具标签
- `rating`：评分
- `users`：用户量或热度描述
- `image` / `imageLocal`：远程图片或本地图片
- `url`：工具访问地址
- `isNew`：是否标记为新品
- `isFeatured`：是否加入精选推荐

## 原型来源

本项目基于 Figma 设计稿整理开发：

https://www.figma.com/design/MrAXz5HNY9JjEXIuW1tWIb/%E8%87%AA%E5%AA%92%E4%BD%93%E5%B7%A5%E5%85%B7%E5%90%88%E9%9B%86%E7%BD%91%E7%AB%99

## License

仅供个人学习、工具整理和项目展示使用。
