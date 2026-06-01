# Yeslon 多站点建站指南 v3.0

> 基于微物联SEO全案_v3.0 策略重构
> 每个站点均为静态页面，自动集成 SEO 优化 + Geo 地域智能

---

## 一、架构概述

```
yeslon-multi-site/
├── packages/          # 共享能力层（所有子站自动继承）
│   ├── seo/           # SEO 自动优化引擎
│   ├── geo/           # Geo 地域智能引擎
│   ├── shared/        # 通用组件库
│   └── build/         # 构建工具（待完善）
├── sites/             # 各子站数据层
│   ├── yeslon/        # 主站
│   ├── energy/        # 能源行业
│   ├── agriculture/   # 农业
│   ├── healthcare/    # 医疗
│   ├── logistics/     # 物流
│   └── manufacturing/ # 制造
├── scripts/           # 构建脚本
└── dist/              # 构建输出（静态文件）
```

**核心原则**：每个子站只需提供 `data/` 数据文件，框架自动完成 SEO + Geo + 页面渲染。

---

## 二、SEO 自动优化机制

每个站点 **零配置** 即获得以下 SEO 能力：

### 2.1 元标签自动生成（`packages/seo/metaGenerator.ts`）

每个页面的 `PageConfig` 自动生成：

| 标签 | 来源 | 说明 |
|------|------|------|
| `title` | `seo.titleTemplate` + `page.title` | 格式: `{pageTitle} - {siteName}` |
| `description` | `page.description` → `seo.description` | 页面级优先，站点级兜底 |
| `keywords` | `page.keywords` → `seo.keywords` | 同上 |
| `canonical` | 自动构建 URL | 防重复内容 |
| `robots` | `seo.noIndex` 控制 | 默认 `index, follow` |
| `og:title/image/description/url` | 同上 | Open Graph |
| `twitter:card/title/image` | 同上 | Twitter Card |

### 2.2 Sitemap 自动生成（`packages/seo/generateSitemap.ts`）

- 构建时根据 `pages.ts` 自动生成 `sitemap.xml`
- 支持配置 `changefreq`（更新频率）和 `priority`（优先级）
- 域名自动拼接 `subdomain + domain`

### 2.3 Robots.txt 自动生成（`packages/seo/generateRobots.ts`）

- 自动生成 `robots.txt`
- 自动指向 `sitemap.xml` 位置
- 屏蔽 `/api/`、`/admin/` 等无收录价值路径

### 2.4 结构化数据（`packages/seo/structuredData.ts`）

自动注入 JSON-LD 结构化数据：
- **Organization** — 公司名称、Logo、联系方式
- **WebSite** — 站点名称、描述、站内搜索
- **BreadcrumbList** — 面包屑导航

### 2.5 对标 SEO 全案策略

SEO全案要求（WordPress方案） | Yeslon 静态站实现
---|---
Rank Math SEO 插件 | ✅ SEO 引擎包（同等级自动元标签）
Sitemap.xml | ✅ 构建自动生成
Robots.txt | ✅ 构建自动生成
结构化数据 JSON-LD | ✅ 自动注入
OG/Twitter 社交标签 | ✅ 全页面覆盖
规范化URL (Canonical) | ✅ 自动处理
内链策略 | ✅ 通过路由自动生成
内容更新频率控制 | ✅ changefreq 配置

---

## 三、Geo 地域智能机制

每个站点自动获得 IP 地域识别和区域路由能力：

### 3.1 IP 地理位置识别（`packages/geo/ipDetector.ts`）

- 调用 `ipapi.co` 接口检测访客位置
- 返回：国家、地区、城市、经纬度、时区
- 5 秒超时兜底，失败不影响页面渲染

### 3.2 地域路由（`packages/geo/geoRouter.ts`）

```
访客访问 → IP检测 → 匹配区域 → 自动跳转 or 提示
```

- `auto` 策略：自动跳转到对应区域子域名
- `manual` 策略：显示 GeoBanner 让用户选择
- `none` 策略：禁用地域跳转

### 3.3 地域偏好保存

- Cookie 保存用户选择的区域偏好（默认 30 天）
- 支持用户手动切换区域
- 切换后刷新页面内容

### 3.4 应用场景

| 场景 | 配置 |
|------|------|
| 国内访客 → 中文站 | `countryCode: 'CN'` → `zh-CN.yeslon.com` |
| 海外访客 → 英文站 | `countryCode: 'US'` → `en.yeslon.com` |
| 各行业站 Geo 定制 | 每个行业子站可独立配置 region 策略 |

---

## 四、新建站点流程

### 4.1 创建数据文件

```bash
# 在 sites/ 下创建子站目录
sites/industry-name/
├── data/
│   ├── config.ts    # 站点配置（含 SEO、Geo 参数）
│   ├── pages.ts     # 页面列表（含 SEO 元数据）
│   ├── solutions.ts # 方案数据
│   ├── cases.ts     # 案例数据
│   └── news.ts      # 新闻数据
├── pages/           # 页面组件（可选，默认使用通用模板）
└── components/      # 组件覆盖（可选）
```

### 4.2 配置示例：`data/config.ts`

```ts
import { SiteConfig } from '@shared/types';

export const myConfig: SiteConfig = {
  subdomain: 'energy',           // 子域名，生成 energy.yeslon.com
  domain: 'yeslon.com',
  siteName: '微物联能源方案',
  description: '...',
  keywords: ['能源', 'IoT', '...'],
  seo: {
    titleTemplate: '{pageTitle} - 微物联能源方案 | Yeslon',
    description: '...',
    keywords: ['...'],
    ogImage: '/images/energy-og.jpg',
    twitterCard: 'summary_large_image',
    noIndex: false,              // true = 禁止收录
  },
  geo: {
    enabled: true,
    regions: [{ code: 'CN', name: '中国' }],
    redirectStrategy: 'manual',
  },
  // ...
};
```

### 4.3 配置示例：`data/pages.ts`

```ts
export const pages: PageConfig[] = [
  {
    path: '',                          // 首页
    title: '首页',
    description: '...',
    keywords: ['...'],
    changeFreq: 'daily',              // 更新频率: always|hourly|daily|weekly|monthly|yearly|never
    priority: 1.0,                    // 优先级 0.0-1.0
  },
  {
    path: 'solutions',
    title: '解决方案',
    changeFreq: 'weekly',
    priority: 0.9,
  },
  // ...
];
```

### 4.4 注册到构建脚本

在 `scripts/build-sites.js` 中添加：

```ts
import { myConfig } from '../sites/industry-name/data/config';
import { pages as myPages } from '../sites/industry-name/data/pages';

const sites = [
  // ... 已有站点
  { config: myConfig, pages: myPages, name: 'industry-name' },
];
```

### 4.5 构建

```bash
npm run build
```

输出到 `dist/industry-name/`，包含：
- `index.html` — 各页面静态 HTML（含完整 SEO 元标签）
- `sitemap.xml` — 站点地图
- `robots.txt` — 爬虫指令
- 结构化数据 JSON-LD 内嵌

---

## 五、SEO 内容策略（基于 SEO 全案）

### 5.1 每个子站的内容结构

| 内容类型 | 来源文件 | 目标 |
|----------|----------|------|
| 首页 | `pages.ts` 根路由 | 核心关键词排名 |
| 解决方案 | `solutions.ts` | 行业方案长尾词 |
| 成功案例 | `cases.ts` | 信任建立 + 转化 |
| 新闻动态 | `news.ts` | 持续更新信号 |

### 5.2 关键词布局（参考全案模型）

- **首页**：核心词（如"工业物联网解决方案"）
- **方案页**：行业+方案词（如"制造业数字化转型方案"）
- **案例页**：问题+解决方案词（如"某制造企业智能工厂案例"）
- **新闻页**：长尾词 + 时效词（如"2024物联网趋势"）

### 5.3 内容更新策略

- `changefreq: 'daily'` 首页 + 新闻 → 保持活跃
- `changefreq: 'weekly'` 方案 + 案例 → 定期优化
- `changefreq: 'monthly'` 关于 + 联系 → 低频维护

---

## 六、部署方案

每个子站构建后为纯静态文件，可部署至：

| 平台 | 配置 | 优势 |
|------|------|------|
| Cloudflare Pages | `npm run build`, 输出 `dist/` | 全球 CDN, 自动 HTTPS |
| Vercel | 同上 | 国内访问优化 |
| 自建 Nginx | 直接 serve `dist/` | 完全控制 |

**DNS 泛解析**：`*.yeslon.com CNAME → CDN`

---

## 七、检查清单

- [ ] `config.ts` — SEO 元数据完整（titleTemplate, ogImage, twitterCard）
- [ ] `pages.ts` — 每个页面有独立 description + keywords
- [ ] `pages.ts` — changefreq / priority 合理配置
- [ ] `geo` — enabled + regions 配置正确
- [ ] 运行 `npm run build` 无报错
- [ ] 检查 `dist/{site}/sitemap.xml` 生成正确
- [ ] 检查 `dist/{site}/robots.txt` 指向正确的 sitemap
- [ ] 检查页面 HTML 中包含完整 OG/Twitter 标签
- [ ] 关键词密度合理，不堆砌
