# TaoXAI Web

这是 TaoXAI 的前端仓库，使用 Vite + React。

```text
.
└─ web/   前端代码，Vercel 部署目录
```

## 本地运行

```bash
corepack pnpm install
corepack pnpm dev
```

## 构建

```bash
corepack pnpm build
```

## Vercel 设置

- Root Directory: `web`
- Build Command: `pnpm build`
- Output Directory: `dist`

## 不要提交

```text
.env
node_modules/
dist/
支付宝/微信支付私钥和证书
阿里云 AccessKey
数据库连接地址和密码
营业执照、身份证、备案资料原图
```
