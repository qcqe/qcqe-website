# Yeslon Multi-Site 部署指南

## 部署架构

```
用户访问
  ├── https://yeslon.com      → 301 重定向 → https://www.yeslon.com
  └── https://www.yeslon.com  → Cloudflare Pages → 静态文件
```

## Cloudflare Pages 部署

### 1. 创建 GitHub 仓库

```bash
# 在 sites/ 目录下（已初始化 git）
git remote add origin git@github.com:你的用户名/yeslon-website.git
git add .
git commit -m "初始化 yeslon 多站点平台"
git push -u origin main
```

### 2. 连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** → **创建项目** → **连接到 Git**
3. 选择 `yeslon-website` 仓库
4. 配置构建设置：

| 配置项 | 值 |
|--------|-----|
| 项目名称 | `yeslon-website` |
| 生产分支 | `main` |
| 构建命令 | `cd yeslon-multi-site && npm install && npm run build` |
| 输出目录 | `yeslon-multi-site/dist` |
| 根目录 | （留空） |

5. 点击 **保存并部署**

### 3. 配置自定义域名

在 Cloudflare Pages 项目 → **自定义域**：

| 域名 | 类型 |
|------|------|
| `www.qcqe.com` | 主域名 |
| `qcqe.com` | 别名（在 DNS 页配置） |
| `www.yeslon.com` | 旧域名（已配置301跳转） |
| `yeslon.com` | 旧域名（已配置301跳转） |

### 4. 配置 DNS

在 Cloudflare DNS 设置中：

| 类型 | 名称 | 目标 | 说明 |
|------|------|------|------|
| CNAME | `www` | `yeslon-website.pages.dev` | Pages 项目域名 |
| CNAME | `@` | `www.yeslon.com` | 根域名指向 www（Cloudflare 自动添加） |

### 5. 验证

- `_redirects` 文件已配置：`https://yeslon.com/*` → `https://www.yeslon.com/:splat` (301)
- `_headers` 文件已配置：安全头 + 缓存策略

## SEO 验证

部署后检查：
- [ ] `https://www.yeslon.com/robots.txt` — 可访问
- [ ] `https://www.yeslon.com/sitemap.xml` — 可访问
- [ ] `https://yeslon.com/` → 301 到 `https://www.yeslon.com/`
- [ ] 页面 HTML 中包含完整 OG/Twitter 标签
- [ ] Google Search Console 添加 `www.yeslon.com`
