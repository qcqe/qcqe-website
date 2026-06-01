import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const DIST = join(root, 'dist');

function readLines(filePath, regex, idx) {
  try {
    const c = readFileSync(filePath, 'utf-8');
    const m = c.match(regex);
    return m ? m[idx].replace(/\\n/g, ' ') : '';
  } catch { return ''; }
}

function readConfig(site) {
  const base = join(root, 'sites', site);
  const cfg = join(base, 'data', 'config.ts');
  return {
    subdomain: readLines(cfg, /subdomain:\s*'([^']+)'/, 1),
    domain: readLines(cfg, /(?<!sub)domain:\s*'([^']+)'/, 1),
    siteName: readLines(cfg, /siteName:\s*'([^']+)'/, 1),
    titleTemplate: readLines(cfg, /titleTemplate:\s*'([^']+)'/, 1),
    description: readLines(cfg, /seo:\s*\{[\s\S]*?description:\s*'([^']+)'/, 1) || readLines(cfg, /description:\s*'([^']+)'/, 1),
    keywords: readLines(cfg, /keywords:\s*\[([^\]]+)\]/, 1),
    phone: readLines(cfg, /phone:\s*'([^']+)'/, 1),
    email: readLines(cfg, /email:\s*'([^']+)'/, 1),
    address: readLines(cfg, /address:\s*'([^']+)'/, 1),
    features: (() => { try {
      const c = readFileSync(cfg, 'utf-8');
      const m = c.match(/features:\s*\[([\s\S]*?)\]/);
      if (!m) return [];
      return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
    } catch { return []; }})(),
    primaryColor: readLines(cfg, /primaryColor:\s*'([^']+)'/, 1),
  };
}

function readPages(site) {
  const fp = join(root, 'sites', site, 'data', 'pages.ts');
  try {
    const c = readFileSync(fp, 'utf-8');
    const pages = [];
    const regex = /path:\s*'([^']*)'[\s\S]*?title:\s*'([^']*)'/g;
    let m;
    while ((m = regex.exec(c)) !== null) {
      pages.push({ path: m[1], title: m[2] });
    }
    return pages;
  } catch { return []; }
}

function parseArrayData(site, file, itemRegex, fields) {
  const fp = join(root, 'sites', site, 'data', file);
  try {
    const c = readFileSync(fp, 'utf-8');
    const items = [];
    const blocks = c.split(/\n\s*\{/);
    for (const block of blocks) {
      const item = {};
      for (const f of fields) {
        const re = new RegExp(f + ":\\s*'([^']+)'");
        const m = block.match(re);
        if (m) item[f] = m[1];
      }
      if (item.title) items.push(item);
    }
    return items;
  } catch { return []; }
}

function readSolutions(site) {
  return parseArrayData(site, 'solutions.ts', '', ['title', 'slug', 'description', 'category']);
}

function readCases(site) {
  return parseArrayData(site, 'cases.ts', '', ['title', 'slug', 'description', 'client']);
}

function readNews(site) {
  return parseArrayData(site, 'news.ts', '', ['title', 'slug', 'description', 'category']);
}

function escapeH(t) { return (t || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function cssVars(config) {
  return `--primary:${config.primaryColor || '#1E40AF'};--primary-light:${config.primaryColor || '#1E40AF'}22;`;
}

const STYLE = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans SC',sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6}
a{color:var(--primary);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:1200px;margin:0 auto;padding:0 20px}

nav{background:#fff;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:100}
nav .inner{display:flex;justify-content:space-between;align-items:center;height:64px}
nav .logo{font-size:1.25rem;font-weight:700;color:#1e293b;text-decoration:none}
nav .logo span{color:var(--primary)}
nav .links{display:flex;gap:24px}
nav .links a{color:#64748b;font-size:0.9rem;font-weight:500;padding:4px 0;border-bottom:2px solid transparent;transition:all 0.2s}
nav .links a:hover{color:var(--primary);border-bottom-color:var(--primary);text-decoration:none}

.hero{background:linear-gradient(135deg,var(--primary),#1e3a5f);color:#fff;padding:80px 0 60px}
.hero h1{font-size:2.5rem;font-weight:800;margin-bottom:16px;line-height:1.2}
.hero p{font-size:1.1rem;opacity:0.9;max-width:700px;line-height:1.7}

.section{padding:60px 0}
.section h2{font-size:1.75rem;font-weight:700;margin-bottom:8px;text-align:center}
.section .subtitle{color:#64748b;text-align:center;margin-bottom:40px;font-size:1rem}
.section-alt{background:#fff}

.grid-3{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px}
.grid-4{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}

.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;transition:all 0.2s}
.card:hover{box-shadow:0 4px 24px rgba(0,0,0,0.08);transform:translateY(-2px)}
.card .icon{width:48px;height:48px;border-radius:10px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:1.25rem}
.card h3{font-size:1.1rem;font-weight:600;margin-bottom:8px}
.card p{color:#64748b;font-size:0.9rem;line-height:1.6}
.card .tag{display:inline-block;padding:2px 10px;border-radius:20px;background:#f1f5f9;color:#64748b;font-size:0.75rem;margin-top:12px}

.cta{background:var(--primary);color:#fff;text-align:center;padding:60px 0}
.cta h2{font-size:1.75rem;font-weight:700;margin-bottom:12px;color:#fff}
.cta p{opacity:0.9;margin-bottom:24px}
.btn{display:inline-block;padding:12px 32px;border-radius:8px;font-weight:600;font-size:0.95rem;background:#fff;color:var(--primary);transition:all 0.2s}
.btn:hover{background:#f1f5f9;text-decoration:none;transform:translateY(-1px)}

footer{background:#0f172a;color:#94a3b8;padding:48px 0 32px}
footer .grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px}
footer h4{color:#fff;font-size:0.95rem;font-weight:600;margin-bottom:12px}
footer p,footer a{color:#94a3b8;font-size:0.85rem;line-height:1.8}
footer a:hover{color:#fff}
footer .copyright{border-top:1px solid #1e293b;margin-top:32px;padding-top:24px;text-align:center;font-size:0.8rem}

.page-header{background:var(--primary);color:#fff;padding:48px 0 40px}
.page-header h1{font-size:2rem;font-weight:700;margin-bottom:8px}
.page-header p{opacity:0.85;font-size:1rem}

@media(max-width:768px){.hero h1{font-size:1.75rem}.hero{padding:48px 0}}`;

function renderNav(pages, config, currentPath) {
  return `<nav><div class="container"><div class="inner">
    <a href="/" class="logo"><span>●</span> ${escapeH(config.siteName)}</a>
    <div class="links">
      ${pages.filter(p => p.path).map(p => `<a href="/${p.path}"${'/'+p.path === currentPath ? ' style="color:var(--primary);border-bottom-color:var(--primary)"' : ''}>${escapeH(p.title)}</a>`).join('')}
      <a href="/contact">联系我们</a>
    </div>
  </div></div></nav>`;
}

function renderFooter(config) {
  return `<footer><div class="container">
    <div class="grid">
      <div>
        <h4>${escapeH(config.siteName)}</h4>
        <p>${escapeH(config.description)}</p>
        <p style="margin-top:12px">${escapeH(config.address)}</p>
      </div>
      <div>
        <h4>联系方式</h4>
        <p>📞 ${escapeH(config.phone)}</p>
        <p>✉️ ${escapeH(config.email)}</p>
      </div>
      <div>
        <h4>快速链接</h4>
        <p><a href="/products">产品中心</a></p>
        <p><a href="/solutions">解决方案</a></p>
        <p><a href="/cases">成功案例</a></p>
        <p><a href="/about">关于我们</a></p>
      </div>
    </div>
    <div class="copyright">© ${new Date().getFullYear()} ${escapeH(config.siteName)} 版权所有</div>
  </div></footer>`;
}

function shell(title, content, config, pages, extra = '') {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeH(title)}</title>
<meta name="description" content="${escapeH(config.description)}">
<meta name="keywords" content="${escapeH(config.keywords)}">
<link rel="canonical" href="https://${config.subdomain ? config.subdomain + '.' : ''}${config.domain}/">
<meta property="og:title" content="${escapeH(title)}">
<meta property="og:description" content="${escapeH(config.description)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<style>:root{${cssVars(config)}}${STYLE}${extra}</style>
</head>
<body>
${renderNav(pages, config, '/')}
${content}
${renderFooter(config)}
</body>
</html>`;
}

function genHomepage(config, pages, solutions, cases, features) {
  const hero = `<section class="hero"><div class="container">
    <h1>${escapeH(config.siteName)}</h1>
    <p>${escapeH(config.description)}</p>
  </div></section>`;

  const featureCards = features.length ? `<section class="section"><div class="container">
    <h2>核心业务</h2>
    <p class="subtitle">专注工业物联网与电气安全领域的技术创新</p>
    <div class="grid-4">${features.map(f => `<div class="card"><div class="icon">◆</div><h3>${escapeH(f)}</h3></div>`).join('')}</div>
  </div></section>` : '';

  const solutionCards = solutions.length ? `<section class="section section-alt"><div class="container">
    <h2>解决方案</h2>
    <p class="subtitle">覆盖多个行业的技术方案</p>
    <div class="grid-3">${solutions.slice(0, 6).map(s => `<div class="card">
      <h3>${escapeH(s.title)}</h3>
      <p>${escapeH((s.description || '').slice(0, 120))}${(s.description || '').length > 120 ? '...' : ''}</p>
      <span class="tag">${escapeH(s.category || '')}</span>
    </div>`).join('')}</div>
  </div></section>` : '';

  const caseCards = cases.length ? `<section class="section"><div class="container">
    <h2>成功案例</h2>
    <p class="subtitle">实际项目经验，为客户创造价值</p>
    <div class="grid-3">${cases.slice(0, 3).map(c => `<div class="card">
      <h3>${escapeH(c.title)}</h3>
      <p>${escapeH((c.description || '').slice(0, 100))}${(c.description || '').length > 100 ? '...' : ''}</p>
      <span class="tag">${escapeH(c.client || '')}</span>
    </div>`).join('')}</div>
  </div></section>` : '';

  const cta = `<section class="cta"><div class="container">
    <h2>需要更详细的方案？</h2>
    <p>联系我们获取针对您业务场景的定制化解决方案</p>
    <a href="mailto:${escapeH(config.email)}" class="btn">立即咨询 →</a>
  </div></section>`;

  return shell(
    `首页 - ${config.siteName}`,
    hero + featureCards + solutionCards + caseCards + cta,
    config, pages
  );
}

function genPage(path, title, config, pages, extraContent) {
  return shell(
    `${title} - ${config.siteName}`,
    `<section class="page-header"><div class="container"><h1>${escapeH(title)}</h1></div></section>
    <section class="section"><div class="container">${extraContent}</div></section>`,
    config, pages
  );
}

function genListPage(path, title, config, pages, items, label) {
  const cards = items.map(item => `<div class="card">
    <h3>${escapeH(item.title)}</h3>
    ${item.description ? '<p>' + escapeH(item.description.slice(0, 150)) + '</p>' : ''}
    ${item.client ? '<span class="tag">' + escapeH(item.client) + '</span>' : ''}
    ${item.category ? '<span class="tag">' + escapeH(item.category) + '</span>' : ''}
  </div>`).join('');

  const content = items.length ? `<div class="grid-3">${cards}</div>` : '<p style="color:#94a3b8">暂无内容</p>';

  const heroDesc = title === '产品中心' ? '工业PLC、电气安全监测、智能防雷产品系列' :
                   title === '解决方案' ? '行业解决方案' :
                   title === '成功案例' ? '项目案例' : '';

  return shell(
    `${title} - ${config.siteName}`,
    `<section class="page-header"><div class="container"><h1>${escapeH(title)}</h1>${heroDesc ? '<p>' + heroDesc + '</p>' : ''}</div></section>
    <section class="section"><div class="container">${content}</div></section>`,
    config, pages
  );
}

function genAbout(config, pages) {
  return shell('关于我们 - ' + config.siteName,
    `<section class="page-header"><div class="container"><h1>关于我们</h1></div></section>
    <section class="section"><div class="container" style="max-width:800px">
      <p style="font-size:1.05rem;line-height:1.8;margin-bottom:24px">${escapeH(config.description)}</p>
      <div style="background:#f8fafc;border-radius:12px;padding:28px;margin-top:24px">
        <h3 style="margin-bottom:16px">联系方式</h3>
        <p style="margin-bottom:8px">📍 ${escapeH(config.address)}</p>
        <p style="margin-bottom:8px">📞 ${escapeH(config.phone)}</p>
        <p>✉️ ${escapeH(config.email)}</p>
      </div>
    </div></section>`,
    config, pages
  );
}

function genProductsPage(config, pages, siteName) {
  const products = {
    'yeslon': [
      { name: 'CC/CR/X系列PLC', desc: '工业级分布式可编程控制器，支持IEC 61131-3标准，EtherCAT/PROFINET多协议', tag: '工业控制' },
      { name: '"设备大脑"边缘控制器', desc: 'PLC+边缘计算一体化，ARM Cortex-A72+FPGA，支持AI推理', tag: '边缘智能' },
      { name: 'ESA全要素智能电表', desc: '电压/电流/功率/谐波/温度全参数同步采集，0.5S级计量精度', tag: '电气安全' },
      { name: 'ESB三相不平衡监测器', desc: '实时监测三相不平衡度与零序电流，预警中性线过载风险', tag: '电气安全' },
      { name: 'EST无线温度监测系统', desc: '接触式/非接触式测温，-40℃~+200℃，无线传输≥200m', tag: '电气安全' },
      { name: 'FS/FSS/FSP电涌保护器监测仪', desc: 'SPD漏电流μA级监测、热脱扣检测、雷击计数与劣化预警', tag: '智能防雷' },
      { name: 'FL雷电峰值监测仪', desc: '0.1~200kA雷电流峰值测量，GPS授时，多站联合定位', tag: '智能防雷' },
      { name: 'FR/FRP接地电阻监测仪', desc: '三极法/钳表法双模式，0.01Ω~200Ω，全天候在线监测', tag: '智能防雷' },
      { name: 'FG智能网关', desc: '汇聚FS/FL/FR数据，4G/5G/Wi-Fi上行，边缘计算与规约转换', tag: '智能防雷' },
      { name: 'HMI人机界面', desc: '4.3寸~15.6寸多规格触摸屏，工业以太网与远程监控', tag: '工业控制' },
    ],
    'electrical-safety': [
      { name: 'ESA-300/500全要素智能电表', desc: '0.5S级精度，2~63次谐波分析，Modbus/DL645/MQTT', tag: '智能电表' },
      { name: 'ESA-M301微型智能电表', desc: '回路级安装，微型化设计，适合配电柜密集部署', tag: '智能电表' },
      { name: 'ESB-200/400三相不平衡监测器', desc: '0.5%级零序电流精度，支持补偿装置联动', tag: '监测器' },
      { name: 'EST-TH/TC无线温度传感器', desc: 'NTC/PT100/红外三种模式，±0.5℃精度', tag: '温度监测' },
      { name: 'EST-R100接收终端', desc: '多传感器组网接收，RS485/4G上行', tag: '温度监测' },
    ],
    'lightning-protection': [
      { name: 'FS-200电涌保护器监测仪', desc: 'SPD漏电流+热脱扣+雷击计数三合一监测', tag: 'SPD监测' },
      { name: 'FSS-300智能型SPD', desc: '内置监测模块的一体化智能电涌保护器', tag: 'SPD监测' },
      { name: 'FSP-500智能型SPD', desc: '大通流容量，内置雷击能量记录', tag: 'SPD监测' },
      { name: 'FL-100/300雷电峰值监测仪', desc: '0.1~200kA，GPS授时，IP67防护', tag: '雷电监测' },
      { name: 'FR-200接地电阻监测仪', desc: '三极法测量，0.01Ω~200Ω，壁挂式安装', tag: '接地监测' },
      { name: 'FRP-300接地电阻监测仪', desc: '钳表法，免辅助极，适合已建接地系统', tag: '接地监测' },
      { name: 'FG-200/500/700智能网关', desc: '4G/Wi-Fi/5G多模，边缘NPU加速，兼容FS/FL/FR全系列', tag: '智能网关' },
    ],
    'industrial-plc': [
      { name: 'CC-500/800/900高性能PLC', desc: '多核处理器+FPU，8~256轴EtherCAT同步控制', tag: 'PLC' },
      { name: 'CR-200分布式PLC', desc: 'EtherCAT总线组网，远程I/O扩展，适合产线分布式控制', tag: 'PLC' },
      { name: 'X-100/200微型PLC', desc: '卡片式超薄设计，28mm厚度，I/O自由扩展', tag: 'PLC' },
      { name: '"设备大脑"DB-100/200', desc: 'PLC+边缘AI一体化，TensorFlow Lite推理，视觉/振动分析', tag: '边缘AI' },
      { name: 'HMI-1200人机界面', desc: '12寸高清触摸屏，内置VNC远程访问', tag: 'HMI' },
      { name: 'IG-500/1000工业网关', desc: '100+工业协议转换，OPC UA/MQTT，边缘缓存与断网续传', tag: '工业网关' },
    ],
    'energy': [
      { name: '充电站电气安全监测终端', desc: '集成漏电、电弧、谐波、温度多参数监测', tag: '充电安全' },
      { name: '谐波指纹分析仪', desc: '256点/周期高频采样，AI谐波特征识别', tag: '分析仪器' },
      { name: '电动自行车充电棚监测终端', desc: '漏电+过载+温度+烟雾四合一监测', tag: '充电安全' },
      { name: '储能电站安全监测系统', desc: '电池簇电气参数+热失控预警+绝缘诊断', tag: '储能安全' },
    ],
  };

  const items = products[siteName] || products['yeslon'];
  const cards = items.map(p => `<div class="card"><h3>${escapeH(p.name)}</h3><p>${escapeH(p.desc)}</p><span class="tag">${escapeH(p.tag)}</span></div>`).join('');

  return shell('产品中心 - ' + config.siteName,
    `<section class="page-header"><div class="container"><h1>产品中心</h1><p>${escapeH(config.siteName)}核心产品系列</p></div></section>
    <section class="section"><div class="container"><div class="grid-3">${cards}</div></div></section>`,
    config, pages
  );
}

// ---------- MAIN ----------
const siteDefs = [
  { name: 'yeslon', isMain: true },
  { name: 'energy' },
  { name: 'electrical-safety' },
  { name: 'lightning-protection' },
  { name: 'industrial-plc' },
];

console.log('Building all sites...\n');
if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

for (const def of siteDefs) {
  const { name, isMain } = def;
  const config = readConfig(name);
  const pages = readPages(name);
  const solutions = readSolutions(name);
  const cases = readCases(name);
  const news = readNews(name);
  const out = isMain ? DIST : join(DIST, name);

  if (!existsSync(out)) mkdirSync(out, { recursive: true });

  // Sitemap
  const baseUrl = config.subdomain ? `${config.subdomain}.${config.domain}` : config.domain;
  const sitemapUrls = pages.map(p => `<url><loc>https://${baseUrl}/${p.path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>`);

  // Robots
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${baseUrl}/sitemap.xml\nCrawl-delay: 1`);

  // Pages
  for (const page of pages) {
    const path = page.path;
    const title = page.title;
    let html;

    if (!path) {
      html = genHomepage(config, pages, solutions, cases, config.features);
    } else if (path === 'about') {
      html = genAbout(config, pages);
    } else if (path === 'products') {
      html = genProductsPage(config, pages, name);
    } else if (path === 'solutions') {
      html = genListPage(path, title, config, pages, solutions, '解决方案');
    } else if (path === 'cases') {
      html = genListPage(path, title, config, pages, cases, '案例');
    } else if (path === 'news') {
      html = genListPage(path, title, config, pages, news, '新闻');
    } else if (path === 'contact') {
      html = genPage(path, title, config, pages,
        `<div style="max-width:600px;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0">
          <p style="margin-bottom:16px">📞 <strong>电话：</strong>${escapeH(config.phone)}</p>
          <p style="margin-bottom:16px">✉️ <strong>邮箱：</strong><a href="mailto:${escapeH(config.email)}">${escapeH(config.email)}</a></p>
          <p style="margin-bottom:16px">📍 <strong>地址：</strong>${escapeH(config.address)}</p>
          <p>🕐 <strong>工作时间：</strong>周一至周五 9:00-18:00</p>
        </div>`
      );
    } else {
      html = genPage(path, title, config, pages, '<p style="color:#94a3b8">内容更新中</p>');
    }

    const pageDir = path ? join(out, path) : out;
    if (!existsSync(pageDir)) mkdirSync(pageDir, { recursive: true });
    writeFileSync(join(pageDir, 'index.html'), html);
  }

  console.log(`  ${name}${isMain ? ' (main)' : ''} → ${pages.length} pages`);
}

// Cloudflare config
for (const f of ['_redirects', '_headers', '_routes.json']) {
  const src = join(root, f);
  if (existsSync(src)) copyFileSync(src, join(DIST, f));
}

console.log('\n✅ All sites built!');
console.log('📁 ' + DIST);
