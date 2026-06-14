# Yeslon Multi-Site 多站点静态网站平台

微物联多租户静态网站系统，基于 Vite + React 开发，生产环境输出预渲染静态 HTML，部署于 Cloudflare Pages。

## 快速开始

```bash
npm install
npm run dev      # 本地开发（Vite SPA）
npm run build    # 构建所有站点到 dist/
npm run preview  # 预览构建结果
```

## 项目结构

- `packages/` — 共享包（组件、SEO、Geo）
- `sites/` — 各子站配置与数据
- `scripts/build-sites.mjs` — 生产构建脚本
- `dist/` — 构建输出（部署目录）

## 文档

- [建站指南（含 SEO/Geo）](./docs/YESLON建站指南.md)
- [部署说明](./docs/DEPLOY.md)

## 站点列表

所有子站统一部署在 `www.yeslon.com`，通过路径前缀区分：

| 子站 | 访问路径 | 状态 |
|------|----------|------|
| yeslon（主站） | https://www.yeslon.com/ | ✅ 已上线 |
| energy（新能源充电） | https://www.yeslon.com/energy/ | ✅ 已上线 |
| electrical-safety（电气安全） | https://www.yeslon.com/electrical-safety/ | ✅ 已上线 |
| lightning-protection（智能防雷） | https://www.yeslon.com/lightning-protection/ | ✅ 已上线 |
| industrial-plc（工业PLC） | https://www.yeslon.com/industrial-plc/ | ✅ 已上线 |

> 旧子域名（如 `energy.yeslon.com`）会自动 301 重定向到对应路径。

## 部署

- **平台**: Cloudflare Pages
- **构建命令**: `cd yeslon-multi-site && npm install && npm run build`
- **输出目录**: `yeslon-multi-site/dist`
- **主域名**: https://www.yeslon.com
