import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const DIST = join(root, 'dist');

function re(file, regex, idx) {
  try {
    const c = readFileSync(file, 'utf-8');
    const m = c.match(regex);
    return m ? m[idx].replace(/\\n/g, ' ') : '';
  } catch { return ''; }
}

function parseList(file, regex) {
  try {
    const c = readFileSync(file, 'utf-8');
    const m = c.match(regex);
    if (!m) return [];
    return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
  } catch { return []; }
}

function parseItems(file, fields) {
  try {
    const c = readFileSync(file, 'utf-8');
    const items = [];
    const blocks = c.split(/\n\s*\{/);
    for (const block of blocks) {
      const item = {};
      for (const f of fields) {
        const r = new RegExp(f + ":\\s*'([^']+)'");
        const m = block.match(r);
        if (m) item[f] = m[1];
      }
      if (item.title || item.name) items.push(item);
    }
    return items;
  } catch { return []; }
}

function readConfig(site) {
  const base = join(root, 'sites', site);
  const cfg = join(base, 'data', 'config.ts');
  return {
    subdomain: re(cfg, /subdomain:\s*'([^']+)'/, 1),
    domain: re(cfg, /(?<!sub)domain:\s*'([^']+)'/, 1),
    siteName: re(cfg, /siteName:\s*'([^']+)'/, 1),
    description: re(cfg, /seo:\s*\{[\s\S]*?description:\s*'([^']+)'/, 1) || re(cfg, /^[^(seo)]*description:\s*'([^']+)'/m, 1),
    phone: re(cfg, /phone:\s*'([^']+)'/, 1),
    email: re(cfg, /email:\s*'([^']+)'/, 1),
    address: re(cfg, /address:\s*'([^']+)'/, 1),
    features: parseList(cfg, /features:\s*\[([\s\S]*?)\]/),
    primaryColor: re(cfg, /primaryColor:\s*'([^']+)'/, 1) || '#1E40AF',
  };
}

function readPages(site) {
  const fp = join(root, 'sites', site, 'data', 'pages.ts');
  try {
    const c = readFileSync(fp, 'utf-8');
    const pages = [{ path: '', title: '首页' }];
    const r = /path:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'/g;
    let m;
    while ((m = r.exec(c)) !== null) pages.push({ path: m[1], title: m[2] });
    return pages;
  } catch { return [{ path: '', title: '首页' }]; }
}

const TW_CDN = '<script src="https://cdn.tailwindcss.com"></script>';
const TW_CONFIG = `<script>tailwind.config={theme:{extend:{colors:{primary:{50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'}},fontFamily:{sans:['Inter','Noto Sans SC','system-ui','sans-serif']}}}}</script>`;

function h(t) { return (t || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function layout(title, desc, keywords, body, config) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${h(title)}</title>
<meta name="description" content="${h(desc || config.description)}">
<meta name="keywords" content="${h(keywords || '')}">
<meta property="og:title" content="${h(title)}">
<meta property="og:description" content="${h(desc || config.description)}">
<meta name="twitter:card" content="summary_large_image">
${TW_CDN}
${TW_CONFIG}
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">
</head>
<body class="bg-gray-50 text-gray-900 font-sans antialiased">
${body}
</body>
</html>`;
}

function nav(pages, config, current) {
  return `<nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <a href="/" class="flex items-center gap-2 text-xl font-bold text-gray-900 no-underline hover:no-underline">
        <span class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">Y</span>
        ${h(config.siteName)}
      </a>
      <div class="hidden md:flex items-center gap-1">
        ${pages.filter(p => p.path && p.path !== 'contact').map(p =>
          `<a href="/${p.path}" class="px-3 py-2 text-sm font-medium rounded-lg transition-colors ${'/'+p.path === current ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} no-underline">${h(p.title)}</a>`
        ).join('')}
        <a href="/contact" class="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors no-underline">联系我们</a>
      </div>
    </div>
  </div>
</nav>`;
}

function footer(config) {
  return `<footer class="bg-gray-900 text-gray-400">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-3 gap-8">
      <div>
        <h4 class="text-white font-semibold mb-3">${h(config.siteName)}</h4>
        <p class="text-sm leading-relaxed">${h(config.description)}</p>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">联系方式</h4>
        <p class="text-sm mb-1">📞 ${h(config.phone)}</p>
        <p class="text-sm mb-1">✉️ ${h(config.email)}</p>
        <p class="text-sm">📍 ${h(config.address)}</p>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">快速链接</h4>
        <div class="space-y-1 text-sm">
          <a href="/products" class="block text-gray-400 hover:text-white no-underline">产品中心</a>
          <a href="/solutions" class="block text-gray-400 hover:text-white no-underline">解决方案</a>
          <a href="/cases" class="block text-gray-400 hover:text-white no-underline">成功案例</a>
          <a href="/about" class="block text-gray-400 hover:text-white no-underline">关于我们</a>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
      © ${new Date().getFullYear()} ${h(config.siteName)} 版权所有
    </div>
  </div>
</footer>`;
}

// ------- PRODUCTS DATA -------
const PRODUCTS = {
  yeslon: [
    { name: 'CC/CR/X系列PLC', desc: '工业级分布式可编程控制器，支持IEC 61131-3编程标准，EtherCAT/PROFINET/Modbus TCP多协议通信，模块化设计灵活扩展。', tag: '工业控制' },
    { name: '"设备大脑"边缘控制器', desc: 'PLC+边缘计算一体化架构，ARM Cortex-A72处理器+FPGA，支持TensorFlow Lite/ONNX边缘AI推理。', tag: '边缘智能' },
    { name: 'ESA全要素智能电表', desc: '电压/电流/功率/谐波/温度全参数同步采集，0.5S级计量精度，2~63次谐波分析，支持Modbus/DL645/MQTT。', tag: '电气安全' },
    { name: 'ESB三相不平衡监测器', desc: '实时监测三相电压电流不平衡度及零序电流，0.5%级精度，越限告警与事件记录。', tag: '电气安全' },
    { name: 'EST无线温度监测系统', desc: '接触式/非接触式测温，-40℃~+200℃，±0.5℃精度，无线传输≥200m。', tag: '电气安全' },
    { name: 'FS/FSS/FSP电涌保护器监测仪', desc: 'SPD漏电流μA级实时监测、热脱扣检测、雷击计数、劣化趋势AI分析与寿命预测。', tag: '智能防雷' },
    { name: 'FL雷电峰值监测仪', desc: '0.1~200kA雷电流峰值精确测量，GPS/北斗双模授时，多站联合雷击定位。', tag: '智能防雷' },
    { name: 'FR/FRP接地电阻监测仪', desc: '三极法/钳表法双测量模式，0.01Ω~200Ω测量范围，全天候在线监测。', tag: '智能防雷' },
    { name: 'FG智能网关', desc: '汇聚FS/FL/FR全系列数据，4G/5G/Wi-Fi多模通信，边缘NPU运算与规约转换。', tag: '智能防雷' },
    { name: 'HMI人机界面', desc: '4.3寸~15.6寸多规格工业触摸屏，内置VNC远程访问，IP65防护等级。', tag: '工业控制' },
  ],
  energy: [
    { name: '充电站电气安全监测终端', desc: '集成漏电监测、电弧检测、谐波分析、温度监测于一体，专为充电桩场景设计。', tag: '充电安全' },
    { name: '谐波指纹分析仪', desc: '256点/周期高频采样，AI深度学习谐波特征识别，隐患提前30天预警。', tag: '分析仪器' },
    { name: '电动自行车充电棚监测终端', desc: '漏电+过载+温度+烟雾四合一监测，远程断电控制，消防联动。', tag: '充电安全' },
    { name: '储能电站安全监测系统', desc: '电池簇电气参数实时监测、热失控预警、绝缘诊断、弧光检测。', tag: '储能安全' },
  ],
  'electrical-safety': [
    { name: 'ESA-300/500全要素智能电表', desc: '0.5S级精度，2~63次谐波分析，支持Modbus RTU/TCP、DL/T645、MQTT协议输出。', tag: '智能电表' },
    { name: 'ESA-M301微型智能电表', desc: '回路级安装微型化设计，适合配电柜密集部署，本地数据存储与断点续传。', tag: '智能电表' },
    { name: 'ESB-200/400三相不平衡监测器', desc: '0.5%级零序电流精度，支持自动补偿装置联动控制，历史趋势分析。', tag: '监测器' },
    { name: 'EST-TH/TC无线温度传感器', desc: 'NTC/PT100/红外三种测温模式，IP67防护，电池续航≥3年。', tag: '温度监测' },
    { name: '电气隐患AI分析系统', desc: 'EdgeAI引擎，融合ESA/ESB/EST多源数据，电弧故障+绝缘老化+接触异常识别，准确率>95%。', tag: 'AI分析' },
  ],
  'lightning-protection': [
    { name: 'FS-200电涌保护器监测仪', desc: 'SPD漏电流+热脱扣+雷击计数三合一监测，RS485/4G双模通信。', tag: 'SPD监测' },
    { name: 'FSS-300智能型SPD', desc: '内置监测模块的一体化智能电涌保护器，支持劣化预警和远程巡检。', tag: 'SPD监测' },
    { name: 'FL-100/300雷电峰值监测仪', desc: '0.1~200kA雷电流峰值测量，GPS授时精度±1μs，IP67防护。', tag: '雷电监测' },
    { name: 'FR-200接地电阻监测仪', desc: '三极法测量，0.01Ω~200Ω，壁挂式安装，支持远程配置。', tag: '接地监测' },
    { name: 'FRP-300接地电阻监测仪', desc: '钳表法无需辅助极，适合已建接地系统，支持LoRa组网。', tag: '接地监测' },
    { name: 'FG-700 5G智能网关', desc: '瑞芯微RK3588S，6 TOPS NPU，5G/Wi-Fi 6三网冗余，接入256台设备。', tag: '智能网关' },
  ],
  'industrial-plc': [
    { name: 'CC-900旗舰型PLC', desc: '4×Cortex-A76+2×Cortex-M7，8GB DDR4，单机支持256轴EtherCAT、64000 I/O点。', tag: 'PLC' },
    { name: 'CC-500高性能PLC', desc: '多核处理器+硬件FPU，8轴EtherCAT同步，支持电子凸轮与飞剪功能。', tag: 'PLC' },
    { name: 'CR-200分布式PLC', desc: 'EtherCAT总线组网，通信周期≤100μs，支持128轴同步，CODESYS运行时。', tag: 'PLC' },
    { name: 'X-200微型PLC', desc: '卡片式超薄设计28mm，I/O自由组合最大256点，支持BACnet/Modbus/KNX。', tag: 'PLC' },
    { name: '"设备大脑"DB-200', desc: 'PLC+边缘AI一体化，TensorFlow Lite推理引擎，内置SQLite与MQTT。', tag: '边缘AI' },
    { name: 'IG-1000工业网关', desc: '100+工业协议转换，OPC UA/MQTT/阿里云/华为云，边缘缓存与断网续传。', tag: '工业网关' },
  ],
};

function productIcons(name) {
  const icons = { '工业控制':'⚙️','边缘智能':'🧠','电气安全':'⚡','智能防雷':'🌩️','充电安全':'🔋','储能安全':'🔋','SPD监测':'🌩️','雷电监测':'⚡','接地监测':'🌍','智能网关':'📡','PLC':'⚙️','边缘AI':'🧠','工业网关':'📡','智能电表':'📊','监测器':'📈','温度监测':'🌡️','AI分析':'🤖','分析仪器':'🔬' };
  for (const [k,v] of Object.entries(icons)) {
    if (name.includes(k)) return v;
  }
  return '🔹';
}

function pageHeader(title, subtitle) {
  return `<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h1 class="text-3xl md:text-4xl font-bold mb-3">${h(title)}</h1>
      ${subtitle ? `<p class="text-primary-100 text-lg max-w-2xl">${h(subtitle)}</p>` : ''}
    </div>
  </div>`;
}

function featureSection(config) {
  const features = config.features.length ? config.features : ['工业PLC控制','电气安全监测','智能防雷系统','工业物联网平台'];
  return `<section class="py-16 md:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">核心业务</h2>
        <p class="text-lg text-gray-500 mt-2">专注工业物联网与电气安全领域</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${features.map(f => `<div class="p-6 bg-gray-50 rounded-xl text-center hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-primary-600 text-xl">◆</span>
          </div>
          <h3 class="font-semibold text-gray-900">${h(f)}</h3>
        </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function productSection(config, siteName) {
  const prods = PRODUCTS[siteName] || PRODUCTS.yeslon;
  return `<section class="py-16 md:py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">核心产品</h2>
        <p class="text-lg text-gray-500 mt-2">自主研发、工业级品质</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${prods.map(p => `<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">${productIcons(p.tag)}</span>
            <span class="text-xs font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded-full">${h(p.tag)}</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">${h(p.name)}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">${h(p.desc)}</p>
        </div>`).join('')}
      </div>
      <div class="text-center mt-8">
        <a href="/products" class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium no-underline">
          查看全部产品 <span>→</span>
        </a>
      </div>
    </div>
  </section>`;
}

function ctaSection(config) {
  return `<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold mb-3">需要更详细的方案？</h2>
      <p class="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">联系我们获取针对您业务场景的定制化解决方案与产品报价</p>
      <a href="mailto:${h(config.email)}" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">
        ✉️ 立即咨询
      </a>
    </div>
  </section>`;
}

function listItems(items, labelKey) {
  if (!items.length) return '<p class="text-gray-400 text-center py-8">暂无内容</p>';
  return `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${items.slice(0, 12).map(item => {
      const label = item.client || item.category || item.tag || '';
      return `<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 class="font-semibold text-gray-900 mb-2">${h(item.title || item.name)}</h3>
        ${item.description ? `<p class="text-sm text-gray-500 leading-relaxed mb-3">${h(item.description.slice(0, 150))}</p>` : ''}
        ${label ? `<span class="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">${h(label)}</span>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

// ------- PAGE GENERATORS -------
function homePage(config, pages, solutions, cases, siteName) {
  const body = `
${nav(pages, config, '/')}
<div class="bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
    <div class="max-w-3xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">${h(config.siteName)}</h1>
      <p class="text-lg md:text-xl text-primary-100 leading-relaxed mb-8">${h(config.description)}</p>
      <div class="flex gap-4">
        <a href="/products" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">了解产品 →</a>
        <a href="/contact" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors no-underline">联系我们</a>
      </div>
    </div>
  </div>
</div>
${featureSection(config)}
${productSection(config, siteName)}
${solutions.length ? `<section class="py-16 md:py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900">解决方案</h2>
      <p class="text-lg text-gray-500 mt-2">行业经验与技术积累</p>
    </div>
    ${listItems(solutions)}
  </div>
</section>` : ''}
${cases.length ? `<section class="py-16 md:py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900">成功案例</h2>
      <p class="text-lg text-gray-500 mt-2">实际项目经验，为客户创造价值</p>
    </div>
    ${listItems(cases)}
  </div>
</section>` : ''}
${ctaSection(config)}
${footer(config)}`;
  return layout(`首页 - ${config.siteName}`, config.description, '', body, config);
}

function productsPage(config, pages, siteName) {
  const prods = PRODUCTS[siteName] || PRODUCTS.yeslon;
  const body = `
${nav(pages, config, '/products')}
${pageHeader('产品中心', `${config.siteName} 核心产品系列`)}
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${prods.map(p => `<div class="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">${productIcons(p.tag)}</span>
          <span class="text-xs font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded-full">${h(p.tag)}</span>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">${h(p.name)}</h3>
        <p class="text-sm text-gray-500 leading-relaxed">${h(p.desc)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>
${ctaSection(config)}
${footer(config)}`;
  return layout('产品中心 - ' + config.siteName, config.siteName + '核心产品系列', '', body, config);
}

function listPage(title, config, pages, items, path) {
  const body = `
${nav(pages, config, '/' + path)}
${pageHeader(title, '')}
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    ${listItems(items)}
  </div>
</section>
${footer(config)}`;
  return layout(`${title} - ${config.siteName}`, '', '', body, config);
}

function aboutPage(config, pages) {
  const body = `
${nav(pages, config, '/about')}
${pageHeader('关于我们', config.siteName)}
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <p class="text-lg text-gray-600 leading-relaxed mb-8">${h(config.description)}</p>
      <div class="bg-gray-50 rounded-xl p-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">联系方式</h3>
        <div class="space-y-3 text-gray-600">
          <p>📞 ${h(config.phone)}</p>
          <p>✉️ ${h(config.email)}</p>
          <p>📍 ${h(config.address)}</p>
        </div>
      </div>
    </div>
  </div>
</section>
${footer(config)}`;
  return layout('关于我们 - ' + config.siteName, '', '', body, config);
}

function contactPage(config, pages) {
  const body = `
${nav(pages, config, '/contact')}
${pageHeader('联系我们', '欢迎咨询与合作')}
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-gray-50 rounded-xl p-8 space-y-4">
        <div class="flex items-center gap-4 p-4 bg-white rounded-lg">
          <span class="text-2xl">📞</span>
          <div><p class="text-sm text-gray-500">电话</p><p class="font-semibold text-gray-900">${h(config.phone)}</p></div>
        </div>
        <div class="flex items-center gap-4 p-4 bg-white rounded-lg">
          <span class="text-2xl">✉️</span>
          <div><p class="text-sm text-gray-500">邮箱</p><p class="font-semibold text-gray-900"><a href="mailto:${h(config.email)}" class="text-primary-600 no-underline hover:underline">${h(config.email)}</a></p></div>
        </div>
        <div class="flex items-center gap-4 p-4 bg-white rounded-lg">
          <span class="text-2xl">📍</span>
          <div><p class="text-sm text-gray-500">地址</p><p class="font-semibold text-gray-900">${h(config.address)}</p></div>
        </div>
      </div>
    </div>
  </div>
</section>
${footer(config)}`;
  return layout('联系我们 - ' + config.siteName, '', '', body, config);
}

// ------- BUILD -------
const siteDefs = [
  { name: 'yeslon', isMain: true },
  { name: 'energy' },
  { name: 'electrical-safety' },
  { name: 'lightning-protection' },
  { name: 'industrial-plc' },
];

console.log('Building sites...\n');
if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

for (const def of siteDefs) {
  const { name, isMain } = def;
  const config = readConfig(name);
  const pages = readPages(name);
  const solutions = (() => { try { return parseItems(join(root, 'sites', name, 'data', 'solutions.ts'), ['title','description','category']); } catch { return []; }})();
  const cases = (() => { try { return parseItems(join(root, 'sites', name, 'data', 'cases.ts'), ['title','description','client']); } catch { return []; }})();
  const news = (() => { try { return parseItems(join(root, 'sites', name, 'data', 'news.ts'), ['title','description','category']); } catch { return []; }})();

  const out = isMain ? DIST : join(DIST, name);
  if (!existsSync(out)) mkdirSync(out, { recursive: true });

  const baseUrl = config.subdomain ? `${config.subdomain}.${config.domain}` : config.domain;

  // Sitemap
  const surls = pages.map(p => `<url><loc>https://${baseUrl}/${p.path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${surls.join('\n')}\n</urlset>`);

  // Robots
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${baseUrl}/sitemap.xml\nCrawl-delay: 1`);

  // HTML pages
  for (const page of pages) {
    const path = page.path;
    const title = page.title;
    let html;

    if (!path) {
      html = homePage(config, pages, solutions, cases, name);
    } else if (path === 'about') {
      html = aboutPage(config, pages);
    } else if (path === 'contact') {
      html = contactPage(config, pages);
    } else if (path === 'products') {
      html = productsPage(config, pages, name);
    } else if (path === 'solutions') {
      html = listPage(title, config, pages, solutions, path);
    } else if (path === 'cases') {
      html = listPage(title, config, pages, cases, path);
    } else if (path === 'news' || path === '产品' || path === '案例') {
      html = listPage(title, config, pages, news.length ? news : cases, path);
    } else {
      html = listPage(title, config, pages, [], path);
    }

    const pageDir = path ? join(out, path) : out;
    if (!existsSync(pageDir)) mkdirSync(pageDir, { recursive: true });
    writeFileSync(join(pageDir, 'index.html'), html);
  }

  console.log(`  ${name}${isMain ? ' (main)' : ''} → ${pages.length} pages, ${config.siteName}`);
}

for (const f of ['_redirects', '_headers', '_routes.json']) {
  const src = join(root, f);
  if (existsSync(src)) copyFileSync(src, join(DIST, f));
}

console.log('\n✅ Build complete');
