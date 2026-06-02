import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname, posix } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const DIST = join(root, 'dist');

function re(f, rx, i) {
  try { const m = readFileSync(f,'utf-8').match(rx); return m ? m[i].replace(/\\n/g,' ') : ''; } catch { return ''; }
}
function reList(f, rx) {
  try { const m = readFileSync(f,'utf-8').match(rx); if(!m) return []; return [...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]); } catch { return []; }
}
function reItems(f, fields) {
  try { const c=readFileSync(f,'utf-8'); const r=[]; for(const b of c.split(/\n\s*\{/)){ const it={}; for(const g of fields){ const m=b.match(new RegExp(g+":\\s*'([^']+)'")); if(m) it[g]=m[1]; } if(it.title||it.name) r.push(it); } return r; } catch { return []; }
}

function cfg(site) {
  const c=join(root,'sites',site,'data','config.ts');
  return {
    sub: re(c,/subdomain:\s*'([^']+)'/,1),
    dom: re(c,/(?<!sub)domain:\s*'([^']+)'/,1),
    name: re(c,/siteName:\s*'([^']+)'/,1),
    desc: re(c,/seo:\s*\{[\s\S]*?description:\s*'([^']+)'/,1)||re(c,/^[^(seo)]*description:\s*'([^']+)'/m,1),
    phone: re(c,/phone:\s*'([^']+)'/,1),
    email: re(c,/email:\s*'([^']+)'/,1),
    addr: re(c,/address:\s*'([^']+)'/,1),
    feat: reList(c,/features:\s*\[([\s\S]*?)\]/),
    color: re(c,/primaryColor:\s*'([^']+)'/,1)||'#1E40AF',
    kw: (()=>{try{const m=readFileSync(c,'utf-8').match(/keywords:\s*\[([^\]]+)\]/);return m?[...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]).join(', '):'';}catch{return '';}})(),
  };
}
function pages(site) {
  const fp=join(root,'sites',site,'data','pages.ts');
  try{const c=readFileSync(fp,'utf-8');const p=[{path:'',title:'首页'}];const r=/path:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'/g;let m;while((m=r.exec(c))!==null)p.push({path:m[1],title:m[2]});return p;}catch{return[{path:'',title:'首页'}];}
}

const TW=`<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{primary:{50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'}},fontFamily:{sans:['Inter','Noto Sans SC','system-ui','sans-serif']}}}}</script>`;
function h(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function lay(t,d,b,c){const base='https://'+(c.sub?c.sub+'.'+c.dom:c.dom);const u=arguments[5]||base;const i=(arguments[6]||'/og-image.jpg').startsWith('http')?arguments[6]:base+(arguments[6]||'/og-image.jpg');const kw=c.kw||'微物联,工业物联网,电气安全,智能防雷,PLC';return'<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>'+h(t)+'</title>\n<meta name="description" content="'+h(d||c.desc||'')+'">\n<meta name="keywords" content="'+h(kw)+'">\n<link rel="canonical" href="'+h(u)+'">\n<meta name="robots" content="index,follow">\n<meta property="og:type" content="website">\n<meta property="og:title" content="'+h(t)+'">\n<meta property="og:description" content="'+h(d||c.desc||'')+'">\n<meta property="og:image" content="'+h(i)+'">\n<meta property="og:url" content="'+h(u)+'">\n<meta property="og:site_name" content="'+h(c.name||'')+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="'+h(t)+'">\n<meta name="twitter:description" content="'+h(d||c.desc||'')+'">\n<meta name="twitter:image" content="'+h(i)+'">\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"'+h(c.name||'')+'","url":"'+h(u.replace(/\/[^/]*$/,'')||'')+'","description":"'+h(c.desc||'')+'","contactPoint":{"@type":"ContactPoint","telephone":"'+h(c.phone||'')+'","contactType":"customer service"}}</script>\n'+TW+'\n<script>if(typeof window!="undefined"&&window.location){var _h=_h||{};_h.c=_h.c||function(i){return document.cookie.match(new RegExp("(^| )"+i+"=([^;]*)"))?unescape(RegExp.$2):null};var reg=_h.c("region")||"CN";fetch("https://ipapi.co/json/",{timeout:3000}).then(function(r){return r.json()}).then(function(d){if(d.country_code&&d.country_code!==reg&&d.country_code=="CN"){document.cookie="region=CN;path=/;max-age=2592000";var b=document.getElementById("geo-banner");if(b)b.style.display="flex"}}).catch(function(){})}</script>\n</head>\n<body class="bg-gray-50 text-gray-900 font-sans antialiased">\n<div id="geo-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:999;background:#2563eb;color:white;padding:12px 20px;align-items:center;justify-content:center;gap:16px;font-size:14px">\n  <span>🌏 检测到您可能在中国，是否切换到中文站点？</span>\n  <a href="javascript:void(0)" onclick="document.getElementById(\'geo-banner\').style.display=\'none\'" style="padding:4px 16px;background:white;color:#2563eb;border-radius:6px;text-decoration:none;font-weight:500;font-size:13px">确定</a>\n  <a href="javascript:void(0)" onclick="document.getElementById(\'geo-banner\').style.display=\'none\'" style="color:rgba(255,255,255,0.7);font-size:13px;text-decoration:none">关闭</a>\n</div>\n'+b+'\n</body>\n</html>';}
function slug(s){return s.replace(/[\/\s]+/g,'-').replace(/[()（）]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'')||'p';}

function nav(pp, c, cur, prefix='') {
  const pfx=prefix||'';
  const navItems = pp.filter(p=>p.path).map(p=>{
    const href = pfx+'/'+p.path;
    return `<a href="${href}" class="px-3 py-2 text-sm font-medium rounded-lg transition-colors ${href===cur?'text-primary-600 bg-primary-50':'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} no-underline">${h(p.title)}</a>`;
  }).join('');
  return `<nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex justify-between items-center h-16">
<a href="${pfx||'/'}" class="flex items-center gap-2 text-lg font-bold text-gray-900 no-underline hover:no-underline">
<span class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">Y</span>${h(c.name)}</a>
<div class="hidden md:flex items-center gap-1">${navItems}
<a href="${pfx}/contact" class="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors no-underline">联系我们</a>
</div></div></div></nav>`;
}
function ft(pp, c, prefix=''){
  const pfx=prefix||'';
  return `<footer class="bg-gray-900 text-gray-400">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div class="grid md:grid-cols-3 gap-8">
<div><h4 class="text-white font-semibold mb-3">${h(c.name)}</h4><p class="text-sm leading-relaxed">${h(c.desc)}</p></div>
<div><h4 class="text-white font-semibold mb-3">联系方式</h4>
<p class="text-sm mb-1">📞 ${h(c.phone)}</p><p class="text-sm mb-1">✉️ ${h(c.email)}</p><p class="text-sm">📍 ${h(c.addr)}</p></div>
<div><h4 class="text-white font-semibold mb-3">快速链接</h4>
<div class="space-y-1 text-sm"><a href="${pfx}/products" class="block text-gray-400 hover:text-white no-underline">产品中心</a>${(pp||[]).some(p=>p.path==='solutions')?'<a href="'+pfx+'/solutions" class="block text-gray-400 hover:text-white no-underline">解决方案</a>':''}${(pp||[]).some(p=>p.path==='cases')?'<a href="'+pfx+'/cases" class="block text-gray-400 hover:text-white no-underline">成功案例</a>':''}${(pp||[]).some(p=>p.path==='about')?'<a href="'+pfx+'/about" class="block text-gray-400 hover:text-white no-underline">关于我们</a>':''}</div></div>
</div>
<div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">© ${new Date().getFullYear()} ${h(c.name)} 版权所有</div>
</div></footer>`;
}

// ═══════════ COMPLETE PRODUCT CATALOG ═══════════
const PROD = {
yeslon:[
{cat:'工业智控',ico:'⚙️',items:[
  {n:'CC系列可编程控制器 (PLC)',m:'CC100/CCXXX',d:'工业级通用PLC控制器，支持IEC 61131-3编程标准，EtherCAT/PROFINET/Modbus TCP多协议通信，适用于复杂逻辑控制、运动控制与过程控制场景。',s:['IEC 61131-3 五种编程语言','EtherCAT/PROFINET/Modbus TCP','模块化I/O灵活扩展','-25℃~70℃工业宽温','CE/FCC认证']},
  {n:'CR系列工业分站',m:'CR系列',d:'分布式远程I/O站，支持EtherCAT总线组网，适用于产线分布式控制场景，实现远程设备高速数据采集与控制。',s:['EtherCAT总线通信','分布式远程I/O扩展','防护等级IP20','DIN导轨安装']},
  {n:'CX系列工业设备手环',m:'CX-08R06AI08',d:'工业设备智能监测手环，集成振动、温度等多参数采集，实时监测设备运行状态，实现预测性维护。',s:['振动/温度多参数采集','无线数据传输','IP67防护','电池续航≥2年','边缘预警AI算法']},
  {n:'CW系列边缘计算网关',m:'CW系列',d:'工业边缘计算网关，支持多协议采集与数据上云，内置边缘计算能力，实现设备联网与数据预处理。',s:['100+工业协议支持','4G/Wi-Fi/Ethernet上行','边缘数据处理','设备远程管理','MQTT/HTTP云对接']},
  {n:'HMI工业触摸屏',m:'HMI系列',d:'工业人机界面，4.3"/7"/10"/12"/15.6"多规格，支持工业以太网与远程监控，IP65防护。',s:['4.3"/7"/10"/12"/15.6"多尺寸','工业以太网通信','VNC远程访问','IP65防护等级']},
  {n:'AI080模拟量输入模块',m:'AI080',d:'8通道模拟量输入模块，0~10V/4~20mA多量程可选，12位分辨率。'},
  {n:'AO081模拟量输出模块',m:'AO081',d:'8通道模拟量输出模块，0~10V/4~20mA可选。'},
  {n:'DI160数字量输入模块',m:'DI160',d:'16通道数字量输入模块，光电隔离，24VDC输入。'},
  {n:'DM160/DM168/DM169混合模块',m:'DM系列',d:'数字量输入输出混合模块，灵活组合满足各类控制需求。'},
  {n:'PT050温度测量模块',m:'PT050',d:'PT100/PT1000温度传感器接入模块，2/4通道可选。'},
  {n:'TC060热电偶测量模块',m:'TC060',d:'热电偶温度测量模块，支持K/J/T/E型热电偶。'},
  {n:'RO080/RO160继电器输出模块',m:'RO系列',d:'继电器输出模块，8/16通道，2A触点容量。'},
  {n:'TO160晶体管输出模块',m:'TO160',d:'16通道晶体管输出，高速开关，适合频繁操作场景。'},
]},
{cat:'电气安全监测 (ES系列)',ico:'⚡',items:[
  {n:'ESA全要素智能电表',m:'ESA',d:'全要素智能电表，集成电压、电流、有功无功功率、功率因数、谐波畸变率、温度等多参数高精度同步采集。',s:['全参数同步采集','0.5S级电能计量','2~63次谐波分析','Modbus RTU/TCP/DL645/MQTT','断点续传']},
  {n:'ESB三相不平衡监测器',m:'ESB',d:'三相不平衡专业监测器，实时监测三相电压电流不平衡度及零序电流，越限告警与事件记录。',s:['不平衡度实时计算','零序电流0.5%级精度','越限告警与事件记录','趋势分析报表','支持补偿装置联动']},
  {n:'ESC漏电监测模组',m:'ESC',d:'多路漏电测控器，实时监测线路剩余电流，多通道同步采集，适用于电气火灾隐患监测。',s:['多通道漏电流同步监测','剩余电流高精度测量','越限分级告警','RS485/Modbus通信','DIN导轨安装']},
  {n:'ESE电能质量监测器',m:'ESE',d:'电能质量专业监测设备，分析电压暂降、暂升、谐波、闪变等电能质量事件。',s:['暂降/暂升/中断检测','2~63次谐波与间谐波','电压闪变测量','不平衡度分析','波形捕获']},
  {n:'ESF电气火灾监测模组',m:'ESF',d:'电气火灾测控器，集成剩余电流、温度等多参数监测，实现电气火灾隐患早期预警，符合GB 14287标准。',s:['剩余电流+温度双参数','多通道同步监测','分级告警策略','消防联动接口','GB 14287标准']},
  {n:'ESI输入监测模组',m:'ESI',d:'数字量状态监测器，采集开关量信号、脉冲计数等，适用于设备状态监测与运行统计。',s:['多通道数字量输入','脉冲计数与累计','状态事件记录','RS485/Modbus通信','宽电压输入范围']},
  {n:'ESM防雷监测模组',m:'ESM（基础版/旗舰版）',d:'全要素SPD监测模组，实时监测电涌保护器漏电流、热脱扣状态、雷击次数，基础版与旗舰版可选。',s:['SPD漏电流μA级监测','热脱扣状态检测','雷击计数与能量记录','基础版:核心监测','旗舰版:含雷电流波形']},
  {n:'ESP零地电压监测器',m:'ESP',d:'零地电压专业监测器，实时监测N-PE间电压，预警零地电压异常，保障敏感设备安全运行。',s:['N-PE电压高精度测量','零地电压越限告警','异常事件记录','RS485/Modbus通信','DIN导轨安装']},
  {n:'EST温度监测模组',m:'EST',d:'多路温度智控器，NTC/PT100/热电偶多种传感器兼容，适用于开关柜触头、电缆接头等关键部位温度监测。',s:['多通道温度同步采集','NTC/PT100/热电偶兼容','-40℃~+200℃','±0.5℃精度','温升趋势智能分析']},
  {n:'ESX智能网关',m:'ESX',d:'电气安全全系列设备专用网关，汇聚ESA/ESB/ESC等设备数据，支持4G/Wi-Fi/Ethernet上云。',s:['全系列统一接入','4G/Wi-Fi/Ethernet多模','协议转换与数据汇聚','远程配置与管理','MQTT/HTTP云对接']},
]},
{cat:'智能防雷 (F系列)',ico:'🌩️',items:[
  {n:'FS防雷器监测模块',m:'FS（四要素/九要素/多要素）',d:'电涌保护器监测仪，实时监测SPD漏电流、热脱扣、雷击次数，四要素/九要素/多要素规格可选。',s:['漏电流μA级监测','热脱扣检测','四要素:雷击计数','九要素:计数+能量+峰值','多要素:全参数+波形记录']},
  {n:'FSS智能型电涌保护器',m:'FSS（数码管/OLED）',d:'一体化智能SPD，内置监测模块，数码管/OLED显示可选，支持劣化预警与远程巡检。',s:['一体化紧凑设计','数码管/OLED显示','漏电流/热脱扣/计数','劣化趋势预警','RS485/4G远程通信']},
  {n:'FSP电涌保护器底座',m:'FSP',d:'底座式智能监测模块，配合标准SPD模块使用，实现SPD状态在线监测，即插即用。',s:['底座式即插即用','漏电流监测','热脱扣检测','雷击计数','适配标准SPD模块']},
  {n:'FL雷电流监测模块',m:'FL（室内/室外/瞬态电流）',d:'雷电峰值监测仪，精确记录雷电流峰值、极性及发生时间，室内/室外/瞬态电流多种规格。',s:['峰值0.1~200kA','极性识别与波形记录','GPS/北斗双模授时','IP67防护(室外版)','μs级瞬态捕获']},
  {n:'FR接地电阻监测模块',m:'FR（导轨/螺丝/室外）',d:'接地电阻在线监测仪，三极法(电位降法)测量，室内导轨/室内螺丝/室外型多规格。',s:['三极法0.01Ω~200Ω','DIN导轨/壁挂/室外','土壤电阻率辅助测量','超标自动告警','RS485/4G通信']},
  {n:'FRP回路法接地电阻监测仪',m:'FRP（含防爆型）',d:'钳表法接地电阻监测，免辅助极，适用于已建接地系统，防爆型满足石化场景。',s:['钳表法非接触测量','免辅助极','防爆型Ex ia IIC T4','LoRa无线组网','0.01Ω~200Ω']},
  {n:'FA故障电弧监测模块',m:'FA',d:'故障电弧监测器，检测串联/并联电弧特征，预防电气火灾，符合UL 1699B标准。',s:['串联/并联电弧检测','智能特征识别','UL 1699B标准','越限告警输出','RS485/Modbus通信']},
  {n:'FD剩余电流监测模块',m:'FD',d:'剩余电流专业监测模块，高精度采集AC/DC剩余电流，适用于漏电保护与火灾隐患监测。',s:['AC/DC兼容检测','剩余电流高精度','越限分级告警','事件记录','RS485/Modbus通信']},
  {n:'FG智能防雷网关',m:'FG',d:'智能防雷核心网关，汇聚FS/FL/FR/FSS/FSP全系列设备，4G/Wi-Fi上云，边缘计算与规约转换。',s:['全系列设备统一接入','4G/Wi-Fi/Ethernet多模','边缘计算与协议转换','远程配置与OTA升级','128台设备接入']},
  {n:'FAP故障电弧探测器(一体式)',m:'FAP',d:'一体式电弧探测器，集成电弧检测+漏电保护+过压保护，适用于末端配电回路。',s:['电弧+漏电+过压三合一','一体式紧凑设计','UL 1699B/GB 14287','导轨安装','声光报警+远程通信']},
]},
{cat:'智能断路器',ico:'🔌',items:[
  {n:'FECB2P智能断路器',m:'FECB2P',d:'智能断路器，过载/短路/漏电保护+远程通断+电能计量。',s:['过载/短路/漏电保护','远程通断控制','电能计量','RS485/无线通信','智能告警推送']},
  {n:'FECB2LP/FECB2SLP智能漏电断路器',m:'FECB2LP/FECB2SLP',d:'智能漏电保护断路器，30/100/300mA可调，远程控制，适用于住宅/商业配电。',s:['漏电保护三档可调','远程通断控制','漏电自检功能','RS485/无线通信','小型化设计']},
  {n:'FECM2智能断路器网关',m:'FECM2',d:'多回路断路器统一网关，汇聚多回路数据上云，实现配电回路智能化集中管理。',s:['多回路统一接入','4G/Wi-Fi上云','远程参数配置','告警联动与工单','数据统计分析']},
]},
{cat:'软件平台',ico:'🖥️',items:[
  {n:'FEXLINK工业互联网软件',m:'V1.0',d:'工业互联网软件平台，实现设备监控、数据可视化、远程管理、告警联动，支持PC与移动端。',s:['实时监控看板','历史数据查询与分析','告警规则配置推送','多级用户权限','OEE/能耗KPI统计']},
  {n:'设备管理云平台',m:'云平台',d:'微物联设备管理云平台，支持全系列设备接入，实现远程管理、数据可视化、智能告警。',s:['多设备类型接入','实时监控面板','告警策略自定义','报表自动生成','移动端APP']},
]},
],
energy:[{cat:'充电站安全',ico:'🔋',items:[
  {n:'充电站电气安全监测终端',d:'专为充电桩设计的电气安全监测终端，集成漏电/电弧/谐波/温度多参数监测。',s:['漏电流实时监测','故障电弧检测','谐波指纹分析','接点温度监测','远程告警推送']},
  {n:'谐波指纹分析仪',d:'256点/周期高频采样，AI深度学习谐波特征识别，隐患提前30天预警。',s:['256点/周期高频采样','AI谐波指纹识别','隐患提前30天预警','电能质量评估','分析报告自动生成']},
  {n:'电动自行车充电棚监测终端',d:'漏电+过载+温度+烟雾四合一，远程断电与消防联动，保障充电棚安全。',s:['四合一监测','充电回路独立监控','远程断电控制','声光告警+平台推送','消防联动接口']},
]},{cat:'储能安全',ico:'🔋',items:[
  {n:'储能电站安全监测系统',d:'电池簇电气参数监测、热失控预警、绝缘诊断、弧光检测，全方位储能安全方案。',s:['电池簇电压/电流/温度','热失控早期预警','绝缘电阻在线诊断','弧光检测与保护','多级告警与消防联动']},
]},
],
'electrical-safety':[
{cat:'能效与电能质量',ico:'📊',items:[{n:'ESA全要素智能电表',m:'ESA',d:'全要素智能电表，全参数采集',s:['全要素同步采集','0.5S级计量','2~63次谐波','Modbus/DL645/MQTT']},{n:'ESE电能质量监测器',m:'ESE',d:'专业电能质量监测',s:['暂降暂升检测','谐波分析','闪变测量','波形捕获']},{n:'SFE电能质量测控模组',m:'SFE',d:'监测+控制+通信一体化',s:['监测控制一体化','电能质量全参数','越限联动控制','RS485/4G通信']}]},
{cat:'电气安全监测',ico:'⚡',items:[
  {n:'ESB三相不平衡监测器',m:'ESB',d:'三相不平衡监测',s:['不平衡度实时计算','零序电流0.5%级','越限告警','趋势分析']},
  {n:'ESC多路漏电测控器',m:'ESC',d:'多通道漏电监测',s:['多通道同步监测','剩余电流高精度','分级告警','消防联动']},
  {n:'ESF电气火灾测控器',m:'ESF',d:'电气火灾监测',s:['剩余电流+温度','多通道','分级告警','GB 14287']},
  {n:'EST多路温度智控器',m:'EST',d:'多路温度监测',s:['多通道测温','NTC/PT100兼容','±0.5℃精度','温升趋势分析']},
  {n:'ESP零地电压监测器',m:'ESP',d:'零地电压监测',s:['N-PE高精度','越限告警','事件记录','DIN安装']},
  {n:'ESI数字量状态监测器',m:'ESI',d:'开关量/脉冲采集',s:['多通道DI','脉冲计数','状态事件','RS485']},
  {n:'FA故障电弧监测模块',m:'FA',d:'电弧故障检测',s:['串联/并联电弧','UL 1699B','智能识别','RS485']},
  {n:'FAP故障电弧探测器(一体式)',m:'FAP',d:'电弧+漏电+过压三合一',s:['三合一保护','一体式紧凑','本地+远程报警','导轨安装']},
  {n:'FD剩余电流监测模块',m:'FD',d:'剩余电流监测',s:['高精度测量','AC/DC兼容','分级告警','事件记录']},
]},
{cat:'网关与通信',ico:'📡',items:[{n:'ESX智能网关',m:'ESX',d:'全系列设备统一上云',s:['全系列接入','4G/Wi-Fi/Ethernet','协议转换','远程管理']},{n:'FG智能防雷网关',m:'FG',d:'防雷设备汇聚网关',s:['FS/FL/FR/FSS接入','4G/Wi-Fi','边缘计算','OTA升级']}]},
],
'lightning-protection':[
{cat:'SPD在线监测',ico:'🌩️',items:[
  {n:'FS防雷器监测模块',m:'FS四要素/九要素/多要素',d:'SPD漏电流+热脱扣+雷击计数',s:['漏电流μA级','热脱扣检测','三规格可选','远程通信']},
  {n:'FSS智能型电涌保护器',m:'FSS数码管/OLED',d:'一体化智能SPD',s:['SPD+监测一体化','数码管/OLED','劣化预警','远程通信']},
  {n:'FSP电涌保护器底座',m:'FSP',d:'底座式即插即用',s:['底座式设计','漏电流监测','热脱扣检测','适配标准SPD']},
  {n:'SPD监测器(红色计数器)',m:'经济型',d:'LED显示雷击次数',s:['雷击计数','红色LED','免维护','壁挂式']},
  {n:'ESM防雷监测模组',m:'ESM基础版/旗舰版',d:'全要素SPD监测',s:['漏电流/脱扣/计数','基础版核心监测','旗舰版含波形','RS485/4G']},
]},
{cat:'雷电峰值监测',ico:'⚡',items:[
  {n:'FL雷电流监测模块(室内版)',m:'FL室内',d:'室内型雷电流监测',s:['0.1~200kA','极性识别','GPS授时','室内安装']},
  {n:'FL雷电流监测模块(室外版)',m:'FL室外',d:'室外型IP67防护',s:['0.1~200kA','极性识别','IP67防护','户外安装']},
  {n:'FL瞬态电流监测模块',m:'FL瞬态',d:'μs级瞬态电流捕获',s:['μs级捕获','峰值记录','高速采样','事件时间戳']},
]},
{cat:'接地电阻监测',ico:'🌍',items:[
  {n:'FR接地电阻监测仪(室内导轨)',m:'FR导轨',d:'DIN导轨安装三极法',s:['三极法0.01~200Ω','DIN导轨','RS485通信','在线监测']},
  {n:'FR接地电阻监测仪(室内螺丝)',m:'FR螺丝',d:'壁挂安装三极法',s:['三极法0.01~200Ω','壁挂螺丝','RS485通信','在线监测']},
  {n:'FR接地电阻监测仪(室外)',m:'FR室外',d:'室外型IP67',s:['三极法0.01~200Ω','IP67防护','户外安装','4G通信']},
  {n:'FRP回路法接地电阻监测仪',m:'FRP/FRP防爆',d:'钳表法免辅助极',s:['钳表法测量','免辅助极','防爆型Ex ia IIC T4','LoRa通信']},
]},
{cat:'智能断路器',ico:'🔌',items:[
  {n:'FECB2P智能断路器',m:'FECB2P',d:'过载/短路/漏电+远程',s:['过载/短路/漏电','远程通断','电能计量','无线通信']},
  {n:'FECB2LP智能漏电断路器',m:'FECB2LP',d:'漏电保护可调+远程',s:['漏电30/100/300mA','远程通断','漏电自检','RS485通信']},
  {n:'FECB2SLP智能漏电断路器',m:'FECB2SLP',d:'小型化漏电保护',s:['小型化设计','漏电保护','远程控制','无线通信']},
  {n:'FECM2智能断路器网关',m:'FECM2',d:'多回路统一管理上云',s:['多回路接入','4G/Wi-Fi上云','参数远程配置','告警联动']},
]},
{cat:'智能网关',ico:'📡',items:[{n:'FG系列智能防雷网关',m:'FG',d:'128台设备同时接入',s:['全系列接入','128台接入','4G/Wi-Fi','边缘计算+OTA']}]},
],
'industrial-plc':[
{cat:'可编程控制器',ico:'⚙️',items:[
  {n:'CC系列可编程控制器',m:'CC100/CCXXX',d:'通用高性能PLC',s:['IEC 61131-3编程','EtherCAT/PROFINET','模块化扩展','-25℃~70℃','CE/FCC']},
  {n:'CR系列工业分站',m:'CR系列',d:'分布式远程I/O',s:['EtherCAT总线','远程I/O','IP20','DIN导轨']},
]},
{cat:'边缘智能',ico:'🧠',items:[
  {n:'CX系列工业设备手环',m:'CX-08R06AI08',d:'设备振动+温度监测',s:['振动/温度采集','无线传输','IP67','续航≥2年','AI预警']},
  {n:'CW系列边缘计算网关',m:'CW系列',d:'多协议+4G上云',s:['100+协议','4G/Wi-Fi','边缘处理','设备管理','MQTT/HTTP']},
]},
{cat:'I/O模块',ico:'🔌',items:[
  {n:'AI080模拟量输入模块',m:'AI080'},{n:'AO081模拟量输出模块',m:'AO081'},{n:'DI160数字量输入模块',m:'DI160'},
  {n:'DM160/DM168/DM169混合模块',m:'DM系列'},{n:'PT050温度测量模块',m:'PT050'},{n:'TC060热电偶测量模块',m:'TC060'},
  {n:'RO080/RO160继电器输出模块',m:'RO系列'},{n:'TO160晶体管输出模块',m:'TO160'},
]},
{cat:'HMI人机界面',ico:'🖥️',items:[{n:'HMI工业触摸屏',m:'HMI系列',d:'多规格触摸屏',s:['4.3"/7"/10"/12"/15.6"','工业以太网','VNC远程','IP65']}]},
{cat:'工业网关',ico:'📡',items:[{n:'IG系列工业通信网关',m:'IG系列',d:'100+协议+OPC UA',s:['100+协议转换','OPC UA/MQTT','边缘缓存/续传','阿里云/华为云/AWS']}]},
],
};

// ═══════════ SOLUTION DETAIL DATA ═══════════
const SOLS = {
'distributed-plc-control': {
  sub:'分布式可编程控制系统', stats:[
    {v:'99.99%',l:'系统可用性'},{v:'<100μs',l:'总线通信周期'},{v:'128轴',l:'最大同步控制'},{v:'1000+',l:'工业现场部署'},
  ],
  goals:[{ico:'🎯',t:'建设目标',d:'构建以CC/CR/X系列PLC为核心的分布式控制网络，实现工业现场设备的实时数据采集、逻辑控制与边缘AI推理。'},{ico:'📈',t:'核心价值',d:'替代传统集中式PLC架构，降低布线成本60%，提升系统灵活性与可扩展性，支持产线快速重构与柔性制造。'},{ico:'🚀',t:'技术优势',d:'国内首家实现CODESYS Runtime预装+边缘AI推理一体化的分布式PLC方案，支持TensorFlow Lite/ONNX模型本地部署。'}],
  arch:[
    {ico:'⚙️',t:'控制层',d:'CC-500/CC-900高性能PLC作为主站，EtherCAT总线连接远程I/O站与伺服驱动器，通信周期≤100μs。'},
    {ico:'🔌',t:'I/O层',d:'CR系列分布式I/O站，灵活组合AI/AO/DI/DO/温度/脉冲等模块，最大64000 I/O点。'},
    {ico:'🧠',t:'边缘智能层',d:'DB系列"设备大脑"控制器，ARM Cortex-A72+FPGA架构，本地运行AI推理模型。'},
    {ico:'📡',t:'通信层',d:'IG系列工业网关，支持100+协议转换，OPC UA/MQTT对接MES/SCADA/云平台。'},
  ],
  feats:[
    {ico:'📋',t:'IEC 61131-3全编程语言',d:'支持ST/LD/FBD/IL/SFC五种编程语言，兼容CODESYS/OpenPCS开发环境，降低工程师学习成本。'},
    {ico:'⚡',t:'EtherCAT高速总线',d:'100μs通信周期，纳秒级时钟同步精度，最多支持256个EtherCAT从站设备。'},
    {ico:'🛡️',t:'工业级可靠性',d:'-25℃~70℃宽温设计，CE/FCC/SIL 2功能安全认证，EMC三级防护，适应粉尘/振动/高温严苛工况。'},
    {ico:'🔗',t:'多协议互联互通',d:'支持EtherCAT/PROFINET/EtherNet/IP/Modbus TCP/OPC UA，产线设备一网到底。'},
    {ico:'🤖',t:'边缘AI推理',d:'内置TensorFlow Lite/ONNX Runtime，设备端实时运行视觉检测、振动分析、故障预测等AI模型。'},
    {ico:'☁️',t:'云边协同管理',d:'通过IG网关数据上云，支持远程编程调试、OTA升级、设备健康管理，运维效率提升80%。'},
  ],
  prods:['CC-900旗舰型PLC','CC-500高性能PLC','CR-200分布式PLC','X-200微型PLC','DB-200设备大脑','IG-1000工业网关'],
  scenes:['新能源汽车电池模组PACK产线控制','半导体封测设备PLC升级改造','食品饮料灌装线电子凸轮同步控制','超高层建筑楼宇自控系统','工业设备远程监控与预测性维护'],
  benefits:['产线节拍提升35%','设备综合效率(OEE)提升22%','设备联网率从15%提升至100%','综合能耗降低26%','维护成本降低40%'],
  problems:[{p:'传统集中式PLC架构布线复杂，扩展困难',s:'采用CR系列分布式I/O站，EtherCAT总线组网',a:'布线成本降低60%'},{p:'设备预警能力不足，故障停机损失大',s:'DB系列边缘AI控制器实时推理',a:'预测准确率≥85%'},{p:'多品牌设备协议不统一，数据孤岛',s:'IG网关100+协议转换',a:'设备联网率100%'},{p:'产线柔性不足，换型时间长',s:'模块化I/O+软件配置',a:'换型时间缩短70%'}],
  requirements:[{n:'PLC编程',d:'IEC 61131-3标准，支持ST/LD/FBD',src:'国标'},{n:'总线通信',d:'EtherCAT通信周期≤100μs',src:'行业标准'},{n:'可靠性',d:'-25℃~70℃，CE/FCC认证',src:'产品标准'},{n:'联网率',d:'设备联网率≥95%',src:'项目需求'}],
  implementation:[{p:'Phase 1',t:'方案设计',d:'2周·现场勘察+方案确认'},{p:'Phase 2',t:'设备交付',d:'3周·设备采购到货'},{p:'Phase 3',t:'安装调试',d:'4周·现场安装+通信调试'},{p:'Phase 4',t:'验收培训',d:'1周·联调验收+运维培训'}],
  standards:['IEC 61131-3','EtherCAT','PROFINET','Modbus TCP','CE','FCC','SIL 2'],
},
'ev-charging-electrical-safety': {
  sub:'新能源充电站电气安全数字化保障方案', stats:[
    {v:'97.3%',l:'电弧识别准确率'},{v:'256点',l:'谐波采样/周期'},{v:'30天',l:'隐患提前预警'},{v:'7×24',l:'实时在线监测'},
  ],
  goals:[{ico:'🎯',t:'方案目标',d:'为新能源汽车充电站提供从充电桩漏电监测、电弧故障检测、谐波分析到后台集中管理的一站式电气安全数字化保障方案。'},{ico:'📈',t:'核心价值',d:'将充电站电气安全从"被动报警"转变为"主动预警"，提前发现线路隐患，杜绝电气火灾事故，保障充电运营安全。'},{ico:'🚀',t:'技术优势',d:'基于谐波指纹AI分析技术，256点/周期精细采样，97.3%电弧识别准确率，可提前30天发现电气隐患。'}],
  arch:[
    {ico:'🔌',t:'感知层',d:'ESA智能电表、ESB三相不平衡监测器、EST无线温度传感器、FA故障电弧探测器，部署于充电桩配电回路。'},
    {ico:'📡',t:'通信层',d:'ESX/ESX智能网关集中采集感知层数据，通过4G/Wi-Fi/Ethernet上报云平台。'},
    {ico:'☁️',t:'平台层',d:'FEXLINK云平台数据汇聚、存储与分析，AI谐波指纹模型实时推理。'},
    {ico:'📱',t:'应用层',d:'PC端监控看板+移动端APP告警推送，支持远程巡检与运维工单管理。'},
  ],
  feats:[
    {ico:'⚡',t:'充电桩漏电流实时监测',d:'高精度漏电流传感器，AC/DC兼容检测，1mA级分辨率，越限秒级告警推送。'},
    {ico:'🔥',t:'故障电弧检测与报警',d:'串联/并联电弧智能识别，UL 1699B标准符合，杜绝充电桩电弧火灾隐患。'},
    {ico:'📊',t:'谐波指纹分析与电能质量评估',d:'256点/周期高频采样，AI深度学习谐波特征识别，电能质量全参数评估。'},
    {ico:'🌡️',t:'接点无线温度在线监测',d:'EST无线温度传感器，-40℃~+200℃，±0.5℃精度，无线传输≥200m。'},
    {ico:'🔄',t:'三相不平衡智能诊断',d:'ESB三相不平衡监测器，实时计算不平衡度，预警中性线过载风险。'},
    {ico:'📱',t:'云端集中管理与告警推送',d:'FEXLINK云平台多站点集中管理，告警分级推送至手机APP/短信/邮箱。'},
  ],
  prods:['ESA全要素智能电表','ESB三相不平衡监测器','EST温度监测模组','FA故障电弧监测模块','ESX智能网关','FEXLINK云平台'],
  scenes:['大型集中式充电站电气安全监测','公交场站充电桩安全监控','商业综合体地下停车场充电区监测','高速服务区充电站远程运维','电动自行车集中充电棚安全监测'],
  benefits:['电气火灾事故降低90%','运维人力成本降低60%','充电桩故障停机减少70%','满足最新国标监管要求','保险费用降低30%'],
  problems:[{p:'充电桩电气参数无实时监测',s:'ESA电表+ESB监测器+EST测温',a:'全覆盖实时监测'},{p:'电弧隐患无法识别',s:'FA电弧监测+AI谐波指纹',a:'准确率97.3%'},{p:'故障处理被动，响应慢',s:'FEXLINK云平台告警推送',a:'秒级告警通知'},{p:'多站点分散管理困难',s:'统一云平台集中管理',a:'运维成本降低60%'}],
  requirements:[{n:'漏电监测',d:'1mA级精度，AC/DC兼容',src:'GB 13955'},{n:'电弧检测',d:'UL 1699B标准',src:'UL标准'},{n:'温度监测',d:'±0.5℃精度，200m传输',src:'产品标准'},{n:'云平台',d:'告警推送+数据分析',src:'项目需求'}],
  implementation:[{p:'Phase 1',t:'勘察设计',d:'1周·现场勘察+回路确认'},{p:'Phase 2',t:'设备安装',d:'3周·监测模组部署'},{p:'Phase 3',t:'系统联调',d:'2周·通信调试+平台配置'},{p:'Phase 4',t:'验收交付',d:'1周·培训+验收报告'}],
  standards:['UL 1699B','GB 13955','GB 50116','IEC 62305','Modbus RTU','MQTT'],
},
'electrical-hazard-monitoring': {
  sub:'电气安全隐患监测与AI分析系统', stats:[
    {v:'97.3%',l:'隐患识别准确率'},{v:'30天',l:'隐患提前预警'},{v:'408项',l:'国标AI红线规则'},{v:'22个',l:'电气安全诊断模型'},
  ],
  goals:[{ico:'🎯',t:'方案目标',d:'基于谐波指纹AI分析技术，对线路电气参数进行高频采样与特征提取，实现电弧故障、接触不良、绝缘老化等早期隐患的精准识别与预警。'},{ico:'📈',t:'核心价值',d:'将电气安全从"被动维修"转变为"主动预警"，在隐患发展为事故前发出告警，避免电气火灾和经济损失。'},{ico:'🚀',t:'技术优势',d:'自研谐波指纹识别技术，256点/周期高频采样，深度学习模型97.3%识别准确率，较传统阈值法提升4倍。'}],
  arch:[
    {ico:'🔌',t:'数据采集层',d:'ESA智能电表、ESB监测器、EST温度传感器等设备，采集配电回路电压/电流/温度/谐波全参数。'},
    {ico:'🧠',t:'AI分析层',d:'太一智能大模型·千知中枢，22个电气安全诊断模型，408项国标红线AI规则引擎。'},
    {ico:'⚡',t:'预警处置层',d:'四级告警机制（正常→预警→告警→严重），自动生成工单并推送至运维人员。'},
    {ico:'📊',t:'报告层',d:'自动生成电气安全评估报告、隐患趋势分析、设备健康度评分。'},
  ],
  feats:[
    {ico:'🔬',t:'谐波指纹特征提取与识别',d:'256点/周期精细采样，提取不同故障类型的谐波特征图谱，AI模型精准匹配。'},
    {ico:'🔥',t:'电弧故障早期预警',d:'串联/并联电弧特征识别，较传统热 detection 法提前数周发现隐患。'},
    {ico:'📉',t:'绝缘老化趋势分析',d:'长期跟踪绝缘电阻变化趋势，预测剩余使用寿命，合理安排维修计划。'},
    {ico:'🌡️',t:'接触不良热隐患定位',d:'EST温度传感器+负荷电流分析，精确定位接点发热隐患位置。'},
    {ico:'📋',t:'电气安全评估报告自动生成',d:'定期生成设备级、回路级、系统级电气安全评估报告，支持导出PDF/Excel。'},
    {ico:'💡',t:'国标AI红线规则引擎',d:'内置408项国家标准红线规则，自动比对监测数据，违规即告警。'},
  ],
  prods:['ESA全要素智能电表','ESB三相不平衡监测器','EST温度监测模组','FA故障电弧监测模块','FD剩余电流监测模块','FEXLINK云平台'],
  scenes:['高速公路隧道/收费站配电回路监测','机场航站楼核心配电系统监控','大型商业综合体电气火灾预防','医院/学校等重要场所安全监测','老旧小区电气线路改造后监测'],
  benefits:['电气火灾风险降低85%','隐患平均提前30天发现','巡检人力减少60%','设备寿命延长20%','符合GB 50116/GB 14287标准'],
  problems:[{p:'配电回路无监测，人工巡检盲区',s:'ESA电表+EST测温全覆盖',a:'监测覆盖100%'},{p:'故障发现滞后，火灾风险高',s:'AI谐波指纹+电弧检测',a:'提前30天预警'},{p:'能耗数据靠人工抄表，滞后不准确',s:'自动采集+分项统计',a:'数据准确率100%'},{p:'缺少系统分析能力',s:'FEXLINK平台AI分析',a:'自动生成评估报告'}],
  implementation:[{p:'Phase 1',t:'回路勘察',d:'1周·配电回路梳理'},{p:'Phase 2',t:'设备部署',d:'3周·监测终端安装'},{p:'Phase 3',t:'平台搭建',d:'2周·FEXLINK部署配置'},{p:'Phase 4',t:'试运行验收',d:'2周·联调+培训'}],
  standards:['GB 50116','GB 14287','GB 13955','GB/T 31960','Modbus RTU'],
},
'ground-resistance-monitoring': {
  sub:'接地电阻在线监测系统', stats:[
    {v:'0.01Ω',l:'测量分辨率'},{v:'200Ω',l:'最大测量范围'},{v:'7×24',l:'全天候在线'},{v:'<5%',l:'测量误差'},
  ],
  goals:[{ico:'🎯',t:'方案目标',d:'采用FR/FRP系列接地电阻监测仪，对接地系统进行7×24小时在线监测，实现接地电阻值实时采集、趋势分析与分级告警。'},{ico:'📈',t:'核心价值',d:'替代传统人工月度巡检方式，实现接地电阻远程在线监测，降低运维成本80%，杜绝接地故障引发的人身与设备事故。'},{ico:'🚀',t:'技术优势',d:'支持三极法/钳表法双测量模式，防爆型Ex ia IIC T4满足石化场景，LoRa无线组网适合大面积分布式接地监测。'}],
  arch:[
    {ico:'🌍',t:'监测层',d:'FR系列三极法/FRP系列钳表法接地电阻监测仪，室内导轨/室内螺丝/室外型多规格。'},
    {ico:'📡',t:'通信层',d:'RS485有线组网或LoRa无线组网，FG智能网关数据汇聚，4G上云。'},
    {ico:'☁️',t:'平台层',d:'FEXLINK云平台接地电阻专题看板，趋势分析，分级告警。'},
    {ico:'📱',t:'应用层',d:'PC+移动端远程查看接地电阻数据，自动生成接地系统评估报告。'},
  ],
  feats:[
    {ico:'📐',t:'三极法/钳表法双模式',d:'FR系列支持三极法（电位降法）精准测量，FRP系列支持钳表法快速巡检，适应不同场景需求。'},
    {ico:'🎯',t:'高精度宽量程',d:'0.01Ω~200Ω测量范围，<5%测量误差，满足各行业接地标准要求。'},
    {ico:'🌡️',t:'多测点同步监测',d:'支持同一网络内多台监测仪同步采集，数据集中对比分析。'},
    {ico:'📈',t:'趋势变化智能分析',d:'自动分析接地电阻随季节/天气变化的趋势规律，科学评估接地系统状态。'},
    {ico:'🔔',t:'超限分级告警',d:'多级阈值可配置，越限自动告警并推送至责任人，支持短信/APP/邮件。'},
    {ico:'🌩️',t:'雷击事件记录',d:'自动关联雷电流监测数据，记录雷击时间与接地阻值变化，辅助防雷分析。'},
  ],
  prods:['FR接地电阻监测仪','FRP回路法接地电阻监测仪','FG智能防雷网关','FL雷电峰值监测仪'],
  scenes:['变电站/换流站接地网在线监测','通信基站/雷达站接地电阻巡检','石化罐区防爆区接地监测','风电场/光伏电站接地系统监测','建筑防雷接地装置定期检测'],
  benefits:['巡检频率从月度降至按需','运维成本降低80%','接地故障响应时间缩短90%','符合GB 50057/GB/T 21431标准','数据可追溯，审计无忧'],
  problems:[{p:'人工接地测量周期长、精度低',s:'FR/FRP全天候在线监测',a:'实时连续监测'},{p:'接地异常发现滞后',s:'阈值分级告警+趋势分析',a:'即时告警'},{p:'防爆区域人工测量风险高',s:'FRP防爆型本安设计',a:'Ex ia IIC T4安全'},{p:'多测点分散，管理困难',s:'FG网关统一汇聚上云',a:'集中平台管理'}],
  requirements:[{n:'测量范围',d:'0.01Ω~200Ω',src:'GB 50057'},{n:'测量精度',d:'±2%',src:'产品标准'},{n:'防护等级',d:'IP65',src:'户外要求'},{n:'防爆等级',d:'Ex ia IIC T4',src:'石化场景'}],
  implementation:[{p:'Phase 1',t:'现场勘察',d:'1周·接地网勘察'},{p:'Phase 2',t:'设备安装',d:'2周·监测仪安装'},{p:'Phase 3',t:'通信调试',d:'1周·网关+平台对接'},{p:'Phase 4',t:'验收培训',d:'1周·系统验收'}],
  standards:['GB 50057','GB/T 21431','IEC 62305','SH/T 3169','Ex ia IIC T4'],
},
'smart-lightning-protection': {
  sub:'智能防雷系统解决方案', stats:[
    {v:'200kA',l:'最大雷电流测量'},{v:'μA级',l:'SPD漏电流监测'},{v:'256台',l:'单网关接入设备'},{v:'40+',l:'产品系列数量'},
  ],
  goals:[{ico:'🎯',t:'方案目标',d:'基于FS电涌保护器监测仪、FSS/FSP智能型SPD、FL雷电峰值监测仪、FR/FRP接地电阻监测仪及FG智能网关，构建全方位智能防雷监测网络。'},{ico:'📈',t:'核心价值',d:'实现SPD劣化预警、雷电流峰值记录、接地状态监测及远程集中管理，将传统防雷系统从"哑设备"升级为"智能终端"。'},{ico:'🚀',t:'技术优势',d:'国内最完整的智能防雷产品线，FS/FSS/FSP/FL/FR/FRP/FG全系列自主研发，覆盖SPD监测、雷电流监测、接地监测全场景。'}],
  arch:[
    {ico:'🌩️',t:'感知层',d:'FS/FSS/FSP SPD监测仪、FL雷电峰值监测仪、FR/FRP接地电阻监测仪，部署于防雷系统各关键节点。'},
    {ico:'📡',t:'汇聚层',d:'FG智能网关，汇聚感知层全部设备数据，支持4G/Wi-Fi/Ethernet多模通信。'},
    {ico:'☁️',t:'云平台层',d:'FEXLINK防雷云平台，多站点集中管理，智能告警与数据分析。'},
    {ico:'📱',t:'应用层',d:'防雷看板、SPD健康度评分、雷暴日统计、防雷系统综合评估报告。'},
  ],
  feats:[
    {ico:'🔍',t:'SPD劣化趋势AI预测',d:'μA级漏电流监测，劣化趋势分析+剩余寿命预测，替代人工月度巡检。'},
    {ico:'⚡',t:'雷电流峰值精确记录',d:'0.1~200kA雷电流峰值测量，GPS授时精度±1μs，多站联合雷击定位。'},
    {ico:'🌍',t:'接地电阻全天候监测',d:'三极法/钳表法双模式，0.01Ω~200Ω，土壤电阻率辅助分析。'},
    {ico:'📡',t:'FG智能网关边缘计算',d:'瑞芯微RK3588S，6 TOPS NPU，本地运行SPD寿命预测模型，5G/Wi-Fi 6冗余通信。'},
    {ico:'📊',t:'综合防雷云平台',d:'防雷设备全生命周期管理，智能告警规则引擎，自动生成防雷系统评估报告。'},
    {ico:'🔧',t:'远程运维与OTA升级',d:'设备远程配置、固件OTA升级、一键巡检，运维效率提升90%。'},
  ],
  prods:['FS防雷器监测模块','FSS智能型电涌保护器','FSP电涌保护器底座','FL雷电流监测模块','FR/FRP接地电阻监测仪','FG智能防雷网关'],
  scenes:['机场航站楼及飞行区防雷监测','石化炼化一体化基地防雷','海上风电场防雷系统','地铁线路SPD集中监测','数据中心防雷系统智能管理'],
  benefits:['人工巡检减少90%','SPD失效前100%预警','雷击定位精度<50米','设备寿命延长30%','满足GB 50057/SH/T 3169'],
  problems:[{p:'SPD状态不可知，失效后才发现',s:'FS/FSS实时监测+劣化预测',a:'失效前100%预警'},{p:'雷击数据无法追溯',s:'FL精确记录峰值+时间',a:'定位精度<50m'},{p:'接地电阻人工测量低效',s:'FR/FRP在线监测',a:'7×24h连续监测'},{p:'多站点管理分散',s:'FG网关汇聚+云平台',a:'统一集中管理'}],
  implementation:[{p:'Phase 1',t:'勘测设计',d:'2周·防雷系统勘察'},{p:'Phase 2',t:'设备部署',d:'4周·全系列设备安装'},{p:'Phase 3',t:'系统联调',d:'2周·网关+平台联调'},{p:'Phase 4',t:'验收交付',d:'1周·培训验收'}],
  standards:['GB 50057','IEC 62305','GB/T 21431','SH/T 3169','GB 15599'],
},
'power-distribution-monitoring': {
  sub:'配电监测与能耗管理系统', stats:[
    {v:'0.5S级',l:'电能计量精度'},{v:'63次',l:'谐波分析'},{v:'20+',l:'能耗分析模型'},{v:'15-25%',l:'节能潜力'},
  ],
  goals:[{ico:'🎯',t:'方案目标',d:'面向工业园区、商业综合体、公共建筑等场景，通过ESA智能电表及分布式采集单元实现全回路电气参数采集、负荷分析与能效优化。'},{ico:'📈',t:'核心价值',d:'将配电系统从"盲管"升级为"可视化智能管理"，实现能耗精细化管理，降低运营成本15-25%。'},{ico:'🚀',t:'技术优势',d:'0.5S级高精度计量，2~63次谐波全分析，配合太一AI能源模型实现能源预测与优化调度。'}],
  arch:[
    {ico:'🔌',t:'感知层',d:'ESA全要素智能电表、ESA-M301微型电表、EST无线温度传感器，部署于各级配电柜。'},
    {ico:'📡',t:'通信层',d:'FG/ESX系列智能网关，RS485/4G/Wi-Fi多模通信，断点续传保障数据完整性。'},
    {ico:'☁️',t:'平台层',d:'FEXLINK能源管理平台，"4×3×2"能碳自治治理框架，安全·能效·碳排三维分析。'},
    {ico:'📱',t:'应用层',d:'能源看板、负荷预测、需量管理、碳排放核算、节能优化建议。'},
  ],
  feats:[
    {ico:'📊',t:'全回路电气参数实时采集',d:'电压/电流/功率/功率因数/谐波/温度全参数，覆盖从进线到末端回路全层级。'},
    {ico:'📈',t:'分项能耗统计与分析',d:'按回路/区域/设备类型分项统计，自动识别高能耗环节与异常用能。'},
    {ico:'📉',t:'负荷曲线与需量管理',d:'实时负荷曲线监控，需量越限预警，辅助制定需量优化策略，降低基本电费。'},
    {ico:'⚡',t:'电能质量在线评估',d:'2~63次谐波分析，电压暂降/暂升/闪变检测，综合电能质量评分。'},
    {ico:'🤖',t:'太一AI能效优化模型',d:'14个能源分析模型+10个节能优化模型，AI自动识别节能机会并给出建议。'},
    {ico:'📋',t:'碳排放核算与报告',d:'基于能耗数据自动核算碳排放，支持ISO 14064标准报告生成，助力碳达峰碳中和。'},
  ],
  prods:['ESA全要素智能电表','ESB三相不平衡监测器','EST温度监测模组','FG智能防雷网关','FEXLINK云平台'],
  scenes:['工业园区配电回路监测与能效管理','商业综合体能耗分项计量','数据中心PUE监测与优化','医院/校园能耗管理','政府机关建筑节能改造'],
  benefits:['综合能耗降低15-25%','电费支出减少20%','配电故障减少85%','碳排放数据自动核算','投资回收期18-24个月'],
  problems:[{p:'配电系统"盲管"，无实时数据',s:'ESA电表全回路覆盖',a:'全参数实时采集'},{p:'能耗数据人工抄表，滞后出错',s:'自动采集+分项统计',a:'数据准确率100%'},{p:'缺少能效分析手段',s:'太一AI能源模型',a:'节能建议自动生成'},{p:'碳排放核算困难',s:'自动碳排计算+报告',a:'ISO 14064标准报告'}],
  implementation:[{p:'Phase 1',t:'体系设计',d:'2周·计量体系设计'},{p:'Phase 2',t:'设备部署',d:'4周·电表+网关安装'},{p:'Phase 3',t:'平台上线',d:'3周·FEXLINK部署'},{p:'Phase 4',t:'试运行',d:'2周·验收+培训'}],
  standards:['GB 17167','GB/T 23331','ISO 50001','GB/T 31960','GB 50116'],
},
};

function prodFeatures(cat, name, desc) {
  const n=name.toLowerCase();
  if(cat.includes('电气安全')||cat.includes('ES')||n.includes('esa')||n.includes('esb')||n.includes('est')) return ['实时在线监测，24小时不间断守护用电安全','多参数同步采集，全面掌握电气运行状态','越限智能告警，分级推送，防患于未然','标准Modbus协议，无缝对接第三方系统','工业级设计，适应-25℃~70℃严苛环境'];
  if(cat.includes('防雷')||cat.includes('SPD')||n.includes('fs')||n.includes('fss')||n.includes('fsp')||n.includes('fl')||n.includes('fr')||n.includes('fg')) return ['7×24小时在线监测，替代人工月度巡检','μA级高精度采样，劣化趋势提前预警','国标/UL/IEC标准符合，品质可靠','支持远程配置与OTA升级，运维高效','多规格可选，适应不同场景需求'];
  if(cat.includes('工业智控')||cat.includes('PLC')||n.includes('plc')||n.includes('cc')||n.includes('cr')||n.includes('hmi')) return ['IEC 61131-3标准编程，兼容主流开发环境','EtherCAT/PROFINET多协议，互联互通','模块化设计，灵活组合按需配置','工业级宽温设计，-25℃~70℃稳定运行','通过CE/FCC认证，品质保障'];
  if(n.includes('断路器')||n.includes('fec')) return ['过载/短路/漏电多重保护，安全无忧','远程通断控制，随时随地管理配电','电能计量+数据分析，能耗可视化','无线通信上云，配电回路数字化管理','紧凑模块化设计，节省柜内空间'];
  if(cat.includes('软件')||cat.includes('平台')) return ['全系列设备统一接入，一站式管理','实时监控+数据分析，决策有据可依','告警策略自定义，智能推送直达手机','多级用户权限，企业级安全管理','支持PC/移动端，随时随地掌控'];
  return ['工业级品质，稳定可靠','标准通信协议，即装即用','智能告警，隐患早发现','宽温设计，适应严苛环境','支持远程运维，降低维护成本'];
}
function prodScenes(cat, name) {
  const n=name.toLowerCase();
  if(cat.includes('电气安全')||n.includes('esa')||n.includes('esb')||n.includes('est')||n.includes('esc')||n.includes('ese')||n.includes('esf')||n.includes('fa')||n.includes('fd')) return ['低压配电柜/配电箱电气参数监测','工厂车间动力配电回路安全监控','商业综合体/写字楼配电系统监测','数据中心精密配电柜温度与电能监测','医院/学校等重要场所电气火灾预防'];
  if(cat.includes('防雷')||n.includes('fs')||n.includes('fl')||n.includes('fr')||n.includes('fss')||n.includes('fg')) return ['建筑物防雷系统SPD状态在线监测','石油化工罐区防爆区域防雷监测','风电场/光伏电站防雷设备集中管理','通信基站/雷达站接地电阻远程巡检','机场/地铁/铁路变电所防雷系统'];
  if(cat.includes('工业智控')||n.includes('plc')||n.includes('cc')||n.includes('cr')||n.includes('cx')||n.includes('cw')||n.includes('hmi')) return ['产线自动化设备逻辑控制与数据采集','工业设备远程监控与预测性维护','楼宇自控系统暖通/照明/给排水控制','工业物联网边缘数据采集与上云'];
  if(n.includes('断路器')||n.includes('fec')) return ['住宅小区楼层配电回路保护','商业楼宇末端配电箱智能管理','工厂车间动力柜回路监控','充电桩配套配电保护'];
  if(cat.includes('软件')||cat.includes('平台')) return ['企业能源管理系统(EMS)搭建','设备远程运维与预测性维护平台','电气安全集中监控中心'];
  return ['工业/商业/民用各类型配电场景','新建项目配套或既有项目改造','需要电气安全监测与智能化管理的各类场所'];
}
function prodRelItems(cat, items, selfName, pfx) {
  const same=items.filter(i=>i.n!==selfName).slice(0,3);
  if(!same.length) return '';
  return same.map(i=>`<a href="${pfx}/products/${slug(i.n)}" class="block p-4 bg-gray-50 rounded-xl hover:shadow-sm transition-shadow no-underline"><p class="text-sm font-medium text-gray-900">${h(i.n)}</p>${i.m?'<p class="text-xs text-gray-400 mt-0.5">'+h(i.m)+'</p>':''}</a>`).join('');
}

function prodPageBody(cat, item, pp, c, pfx) {
  const flags=prodFeatures(cat,item.n,(item.d||''));
  const scenes=prodScenes(cat,item.n);
  const allCats=PROD[Object.keys(PROD).find(k=>PROD[k].some(cc=>cc.items.some(i=>i.n===item.n)))||'yeslon']||PROD.yeslon;
  const catData=allCats.find(cc=>cc.items.some(i=>i.n===item.n));
  const rel=catData?prodRelItems(cat,catData.items,item.n,pfx):'';

  return `${nav(pp,c,pfx+'/products',pfx)}
<style>.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}</style>
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<a href="${pfx}/products" class="text-primary-200 hover:text-white text-sm no-underline flex items-center gap-1">← 返回产品中心 <span class="text-primary-300">/ ${h(cat)}</span></a>
<h1 class="text-2xl md:text-3xl font-bold mt-4">${h(item.n)}</h1>
${item.m?'<p class="text-primary-200 mt-1 text-lg">型号：'+h(item.m)+'</p>':''}
<div class="flex flex-wrap gap-2 mt-4"><span class="px-3 py-1 bg-white/20 text-white text-sm rounded-full">${h(cat)}</span>${item.s?`<span class="px-3 py-1 bg-white/10 text-primary-200 text-sm rounded-full">${item.s.length}项技术规格</span>`:''}</div>
</div></div>

<section class="-mt-6 relative z-10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="bg-white rounded-xl shadow-md border border-gray-100 p-6">
<p class="text-gray-700 leading-relaxed">${h(item.d||item.desc||'')}</p>
</div></div></section>

<section class="py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 class="text-2xl font-bold mb-8 flex items-center gap-2">核心功能与优势</h2>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${flags.map(f=>`<div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"><span class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span class="text-primary-600 text-xs">✓</span></span><span class="text-sm text-gray-700">${h(f)}</span></div>`).join('')}
</div></div></section>

${item.s&&item.s.length?`<section class="py-12 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 class="text-2xl font-bold mb-8 flex items-center gap-2">📋 技术规格</h2>
<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
<table class="w-full text-sm"><tbody>${item.s.map((s,i)=>`<tr class="${i%2===0?'bg-white':'bg-gray-50'}"><td class="py-3 px-5 text-gray-600">${h(s)}</td></tr>`).join('')}</tbody></table>
</div></div></section>`:''}

<section class="py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 class="text-2xl font-bold mb-8 flex items-center gap-2">📍 典型应用场景</h2>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${scenes.map(s=>`<div class="flex items-center gap-3 p-4 border border-gray-100 rounded-xl"><span class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span><span class="text-sm text-gray-700">${h(s)}</span></div>`).join('')}
</div></div></section>

${rel?`<section class="py-12 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 class="text-2xl font-bold mb-8">同分类产品</h2>
<div class="grid md:grid-cols-3 gap-4">${rel}</div>
</div></section>`:''}

<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
<h2 class="text-2xl font-bold mb-3">需要详细资料或报价？</h2>
<p class="text-primary-100 mb-6">获取产品手册、技术规格书、CAD图纸及项目报价</p>
<a href="${pfx}/contact" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">📞 立即咨询</a>
</div></section>${ft(pp,c,pfx)}`;
}

function genHome(pp, c, sls, cs, feat, sn, pfx) {
  const cats = PROD[sn] || PROD.yeslon;
  const featCards = (feat.length?feat:['工业PLC控制','电气安全监测','智能防雷系统','工业物联网平台']).map(f=>`<div class="p-6 bg-gray-50 rounded-xl text-center hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4"><span class="text-primary-600 text-xl">◆</span></div><h3 class="font-semibold">${h(f)}</h3></div>`).join('');
  const catCards = cats.map(cat=>`<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow" onclick="location.href='${pfx}/products'"><span class="text-3xl">${cat.ico}</span><h3 class="font-semibold mt-3 mb-1">${h(cat.cat)}</h3><p class="text-sm text-gray-500">${cat.items.length}款产品</p></div>`).join('');
  const solCards = sls.slice(0,6).map(s=>{const ss=s.slug||slug(s.title);return `<a href="${pfx}/solutions/${ss}" class="block bg-gray-50 rounded-xl p-6 hover:shadow-md hover:border-primary-200 transition-all no-underline border border-transparent"><h3 class="font-semibold text-gray-900 mb-2">${h(s.title)}</h3>${s.description?'<p class="text-sm text-gray-500 leading-relaxed">'+h(s.description.slice(0,120))+'</p>':''}<span class="text-xs text-primary-600 font-medium mt-2 inline-block">查看详情 →</span></a>`;}).join('');
  const caseCards = cs.slice(0,3).map(c=>`<a href="/cases" class="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all no-underline"><h3 class="font-semibold text-gray-900 mb-2">${h(c.title)}</h3>${c.description?'<p class="text-sm text-gray-500">'+h(c.description.slice(0,120))+'</p>':''}${c.client?'<span class="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">'+h(c.client)+'</span>':''}</a>`).join('');

  const bd=`${nav(pp,c,pfx+'/',pfx)}
<div class="bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"><div class="max-w-3xl"><h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">${h(c.name)}</h1><p class="text-lg md:text-xl text-primary-100 leading-relaxed mb-8">${h(c.desc)}</p><div class="flex gap-4"><a href="${pfx}/products" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">查看产品 →</a><a href="${pfx}/contact" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors no-underline">联系我们</a></div></div></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">核心业务</h2><p class="text-lg text-gray-500 mt-2">专注工业物联网与电气安全领域</p></div><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">${featCards}</div></div></section>
<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">产品系列</h2><p class="text-lg text-gray-500 mt-2">自主研发、工业级品质</p></div><div class="grid md:grid-cols-3 gap-6">${catCards}</div></div></section>
${sls.length?`<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">解决方案</h2></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${solCards}</div></div></section>`:''}
${cs.length?`<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">成功案例</h2></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${caseCards}</div><div class="text-center mt-8"><a href="/cases" class="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium no-underline">查看全部案例 <span>→</span></a></div></div></section>`:''}
<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-3xl font-bold mb-3">需要详细方案？</h2><p class="text-primary-100 text-lg mb-8">联系我们获取产品资料、技术方案与报价</p><a href="mailto:${h(c.email)}" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">✉️ 立即咨询</a></div></section>${ft(pp,c,pfx)}`;
  const siteUrl='https://'+(c.sub?c.sub+'.'+c.dom:c.dom)+'/';return lay('首页 - '+c.name,c.desc,bd,c,siteUrl);
}
function prodsPage(pp, c, sn, pfx) {
  const cats = PROD[sn] || PROD.yeslon;
  const tabLinks = cats.map((cat,i)=>`<button onclick="location.href='#${slug(cat.cat)}'" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-primary-300 hover:text-primary-600 ${i===0?'bg-primary-50 text-primary-600 border-primary-200':'bg-white text-gray-600'}">${cat.ico} ${h(cat.cat)}</button>`).join('');

  // Quick reference table for all products
  const tableRows = cats.flatMap(cat=>cat.items.map(item=>`<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td class="py-3 px-4"><a href="${pfx}/products/${slug(item.n)}" class="text-primary-600 hover:text-primary-700 font-medium text-sm no-underline">${h(item.n)}</a></td>
    <td class="py-3 px-4 text-sm text-gray-500">${item.m||'-'}</td>
    <td class="py-3 px-4"><span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">${h(cat.cat)}</span></td>
    <td class="py-3 px-4 text-right"><a href="${pfx}/products/${slug(item.n)}" class="text-xs text-primary-600 hover:text-primary-700 font-medium no-underline">查看 →</a></td>
  </tr>`)).join('');

  const catSections = cats.map(cat=>`<section id="${slug(cat.cat)}" class="py-12 scroll-mt-20 ${cats.indexOf(cat)%2===0?'bg-white':'bg-gray-50'}">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center justify-between mb-8">
<div class="flex items-center gap-3"><span class="text-3xl">${cat.ico}</span><h2 class="text-2xl font-bold">${h(cat.cat)}</h2><span class="text-sm text-gray-400">（${cat.items.length}款）</span></div>
<a href="${pfx}/products" class="text-sm text-primary-600 hover:text-primary-700 no-underline">↑ 返回顶部</a>
</div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${cat.items.map(item=>`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
<div class="flex-1"><h3 class="font-semibold text-gray-900 text-sm">${h(item.n)}</h3>${item.m?'<p class="text-xs text-gray-400 mt-0.5">'+h(item.m)+'</p>':''}<p class="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">${h((item.d||item.desc||'').slice(0,100))}</p></div>
<a href="${pfx}/products/${slug(item.n)}" class="inline-block mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium no-underline self-start">查看详情 →</a>
</div>`).join('')}
</div></div></section>`).join('');

  const bd=`${nav(pp,c,pfx+'/products',pfx)}
<style>.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.scroll-mt-20{scroll-margin-top:80px}</style>
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
<h1 class="text-3xl md:text-4xl font-bold mb-3">产品中心</h1>
<p class="text-primary-100 text-lg mb-6">${h(c.name)} 全系列产品 · 点击分类快速定位</p>
<div class="flex flex-wrap gap-2">${tabLinks}</div>
</div></div>

<!-- Quick Reference Table -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
<div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
<div class="p-4 border-b border-gray-100 bg-gray-50"><h3 class="font-semibold text-sm text-gray-700">📋 全部产品速查表</h3></div>
<div class="overflow-x-auto"><table class="w-full text-sm">
<thead><tr class="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
<th class="py-3 px-4 font-medium">产品名称</th><th class="py-3 px-4 font-medium">型号</th><th class="py-3 px-4 font-medium">分类</th><th class="py-3 px-4 font-medium text-right">详情</th>
</tr></thead><tbody>${tableRows}</tbody>
</table></div></div></div>

${catSections}${ft(pp,c,pfx)}`;
  const siteU='https://'+(c.sub?c.sub+'.'+c.dom:c.dom)+'/';return lay('产品中心 - '+c.name,c.name+'产品中心',bd,c,siteU);
}

function aboutPage(pp,c,pfx){
  const bd=`${nav(pp,c,pfx+'/about',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">关于我们</h1><p class="text-primary-200 mt-2 text-lg max-w-2xl">有电，就有微物联．用数据重构能源效率</p></div></div>

<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid md:grid-cols-2 gap-16 items-center mb-20">
<div><span class="text-sm font-semibold text-primary-600 tracking-wider">COMPANY OVERVIEW</span>
<h2 class="text-3xl font-bold mt-3 mb-6">微物联技术（深圳）有限公司</h2>
<p class="text-gray-600 leading-relaxed mb-4">微物联技术成立于2016年，总部位于深圳市福田深港科技合作区，是一家专注于<span class="font-semibold text-gray-900">工业物联网、电气安全监测、智能防雷及工业分布式控制</span>领域的国家高新技术企业。</p>
<p class="text-gray-600 leading-relaxed mb-4">公司拥有从智能传感器、边缘计算网关到AI分析平台、云平台的完整产品体系，是国内少数具备<span class="font-semibold text-gray-900">"端-边-云"全栈自主研发能力</span>的工业物联网企业之一。</p>
<p class="text-gray-600 leading-relaxed">公司以"让每一度电都可见、可懂、可优化"为使命，致力于为新能源充电站、工业园区、机场、高速公路、商业综合体、数据中心等场景提供电气安全与能源管理的整体解决方案。</p></div>
<div class="bg-gray-50 rounded-2xl p-8">
<div class="grid grid-cols-2 gap-6">
<div class="text-center"><div class="text-4xl font-bold text-primary-600">2016</div><p class="text-sm text-gray-500 mt-1">公司成立</p></div>
<div class="text-center"><div class="text-4xl font-bold text-primary-600">200+</div><p class="text-sm text-gray-500 mt-1">服务客户</p></div>
<div class="text-center"><div class="text-4xl font-bold text-primary-600">60+</div><p class="text-sm text-gray-500 mt-1">算法模型</p></div>
<div class="text-center"><div class="text-4xl font-bold text-primary-600">40+</div><p class="text-sm text-gray-500 mt-1">产品系列</p></div>
</div></div></div>
</div></section>

<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center mb-12"><span class="text-sm font-semibold text-primary-600 tracking-wider">BRAND & MISSION</span><h2 class="text-3xl font-bold mt-3">品牌与使命</h2></div>
<div class="grid md:grid-cols-3 gap-8">
<div class="bg-white rounded-xl p-8 text-center"><div class="text-4xl mb-4">⚡</div><h3 class="font-bold text-lg mb-3">企业使命</h3><p class="text-gray-500 text-sm leading-relaxed">让每一度电都可见、可懂、可优化．通过物联网+AI技术，让用电安全从"被动报警"走向"主动预防"。</p></div>
<div class="bg-white rounded-xl p-8 text-center"><div class="text-4xl mb-4">🎯</div><h3 class="font-bold text-lg mb-3">品牌理念</h3><p class="text-gray-500 text-sm leading-relaxed">"有电，就有微物联"——我们相信电气安全是每个企业、每个家庭的刚需，微物联致力于成为电气安全与能效管理领域的首选品牌。</p></div>
<div class="bg-white rounded-xl p-8 text-center"><div class="text-4xl mb-4">🔬</div><h3 class="font-bold text-lg mb-3">技术理念</h3><p class="text-gray-500 text-sm leading-relaxed">"用数据重构能源效率"——以物联网感知层为基础，以AI算法为核心，实现从数据采集到智能决策的完整闭环。</p></div>
</div></div></section>

<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center mb-12"><span class="text-sm font-semibold text-primary-600 tracking-wider">TECHNOLOGY</span><h2 class="text-3xl font-bold mt-3">核心技术能力</h2></div>
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
<div class="p-6 border border-gray-100 rounded-xl"><span class="text-3xl">🔌</span><h3 class="font-bold mt-3 mb-2">全栈自研硬件</h3><p class="text-sm text-gray-500">覆盖智能传感器、分布式PLC、边缘计算网关、智能断路器等全套硬件产品线</p></div>
<div class="p-6 border border-gray-100 rounded-xl"><span class="text-3xl">🤖</span><h3 class="font-bold mt-3 mb-2">AI算法引擎</h3><p class="text-sm text-gray-500">千知/万象/天衍三大AI模型体系，60+专业算法模型，408项国标红线AI规则引擎</p></div>
<div class="p-6 border border-gray-100 rounded-xl"><span class="text-3xl">☁️</span><h3 class="font-bold mt-3 mb-2">云边协同平台</h3><p class="text-sm text-gray-500">FEXLINK工业互联网平台，支持设备管理、数据分析、告警联动、远程运维</p></div>
<div class="p-6 border border-gray-100 rounded-xl"><span class="text-3xl">📊</span><h3 class="font-bold mt-3 mb-2">电气隐患AI分析</h3><p class="text-sm text-gray-500">谐波指纹识别技术，256点/周期高频采样，隐患提前30天预警，准确率97.3%</p></div>
</div></div></section>

<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center mb-12"><span class="text-sm font-semibold text-primary-600 tracking-wider">PRODUCTS</span><h2 class="text-3xl font-bold mt-3">产品矩阵</h2></div>
<div class="grid md:grid-cols-3 gap-6">
<div class="bg-white rounded-xl p-6 shadow-sm"><span class="text-2xl">⚙️</span><h3 class="font-bold mt-2 mb-2">工业智控</h3><p class="text-sm text-gray-500">CC/CR系列PLC、CX工业手环、CW边缘网关、HMI、I/O模块</p></div>
<div class="bg-white rounded-xl p-6 shadow-sm"><span class="text-2xl">⚡</span><h3 class="font-bold mt-2 mb-2">电气安全监测</h3><p class="text-sm text-gray-500">ESA智能电表、ESB三相不平衡、EST温度监测、FA电弧探测、FAP故障电弧</p></div>
<div class="bg-white rounded-xl p-6 shadow-sm"><span class="text-2xl">🌩️</span><h3 class="font-bold mt-2 mb-2">智能防雷</h3><p class="text-sm text-gray-500">FS/FSS/FSP电涌保护器监测、FL雷电峰值、FR/FRP接地电阻、FG网关</p></div>
<div class="bg-white rounded-xl p-6 shadow-sm"><span class="text-2xl">🔌</span><h3 class="font-bold mt-2 mb-2">智能配电</h3><p class="text-sm text-gray-500">FECB2P智能断路器、FECB2LP漏电断路器、FECM2网关、配电监测系统</p></div>
<div class="bg-white rounded-xl p-6 shadow-sm"><span class="text-2xl">🖥️</span><h3 class="font-bold mt-2 mb-2">软件平台</h3><p class="text-sm text-gray-500">FEXLINK工业互联网平台、设备管理云平台、太一智能大模型AI分析平台</p></div>
<div class="bg-white rounded-xl p-6 shadow-sm"><span class="text-2xl">🔋</span><h3 class="font-bold mt-2 mb-2">新能源安全</h3><p class="text-sm text-gray-500">充电站电气安全监测、电动自行车充电棚安全、储能电站安全监测</p></div>
</div></div></section>

<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center mb-12"><span class="text-sm font-semibold text-primary-600 tracking-wider">TEAM</span><h2 class="text-3xl font-bold mt-3">核心团队</h2></div>
<div class="grid md:grid-cols-3 gap-8">
<div class="text-center"><div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">👤</span></div><h3 class="font-bold">崔灿</h3><p class="text-sm text-gray-500">创始人/CEO</p><p class="text-xs text-gray-400 mt-1">香港城市大学 · BGS全球终身会员</p></div>
<div class="text-center"><div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">👤</span></div><h3 class="font-bold">邓博士</h3><p class="text-sm text-gray-500">联合创始人</p><p class="text-xs text-gray-400 mt-1">清华大学 · 可编程逻辑控制</p></div>
<div class="text-center"><div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">👤</span></div><h3 class="font-bold">李博士</h3><p class="text-sm text-gray-500">联合创始人</p><p class="text-xs text-gray-400 mt-1">清华大学 · 嵌入式系统</p></div>
</div></div></section>

<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center mb-12"><span class="text-sm font-semibold text-primary-600 tracking-wider">HONORS</span><h2 class="text-3xl font-bold mt-3">荣誉与里程碑</h2></div>
<div class="max-w-3xl mx-auto space-y-4">
${[
  ['2016','深圳市最具投资价值企业50强'],
  ['2017','福田之星全国创业大赛第一名 · 创IN中国人工智能大赛深圳赛区第一名'],
  ['2018','全国高校校友创业大赛企业组第一名 · 全国工业互联网比赛第三名 · 入围物联网行业创新产品奖'],
  ['2019','航天云网杯工业互联网大赛一等奖 · 中国最具颠覆式创新潜力榜（腾讯/阿里/百度/赛迪/德勤/国网等联合评选）'],
  ['2020','科技部部长王志刚、深圳市委书记王伟中、市长陈如桂等领导莅临视察'],
  ['2021-至今','发布太一智能大模型 · 谐波指纹AI分析技术 · 服务客户200+ · 产品覆盖全国30+省市'],
].map(([y,t])=>'<div class="flex gap-4 p-4 bg-white rounded-lg"><span class="text-primary-600 font-bold text-sm w-16 flex-shrink-0">'+y+'</span><p class="text-sm text-gray-600">'+t+'</p></div>').join('')}
</div></div></section>

<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center mb-12"><span class="text-sm font-semibold text-primary-600 tracking-wider">INDUSTRIES</span><h2 class="text-3xl font-bold mt-3">服务行业</h2></div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
${['新能源充电站','工业园区','机场/交通枢纽','数据中心','商业综合体','石油化工','市政工程','建筑楼宇'].map(i=>'<div class="p-4 bg-gray-50 rounded-xl text-center text-sm font-medium text-gray-700">'+i+'</div>').join('')}
</div></div></section>

<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
<h3 class="text-xl font-bold mb-6 text-center">联系方式</h3>
<div class="space-y-4">${[
  ['📞','电话',c.phone],
  ['✉️','邮箱','<a href="mailto:'+h(c.email)+'" class="text-primary-600 hover:underline">'+h(c.email)+'</a>'],
  ['📍','地址',c.addr],
].map(a=>'<div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"><span class="text-xl w-8">'+a[0]+'</span><div><p class="text-xs text-gray-400">'+a[1]+'</p><p class="font-medium text-gray-900">'+a[2]+'</p></div></div>').join('')}</div>
</div></div></section>${ft(pp,c,pfx)}`;
  const siteU='https://'+(c.sub?c.sub+'.'+c.dom:c.dom)+'/';return lay('关于我们 - '+c.name,'',bd,c,siteU);
}
function contactPage(pp,c,pfx){
  const bd=`${nav(pp,c,pfx+'/contact',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">联系我们</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-2xl mx-auto"><div class="space-y-4">
<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">📞</span><div><p class="text-sm text-gray-500">电话</p><p class="font-semibold text-gray-900">${h(c.phone)}</p></div></div>
<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">✉️</span><div><p class="text-sm text-gray-500">邮箱</p><p class="font-semibold text-gray-900"><a href="mailto:${h(c.email)}" class="text-primary-600 no-underline hover:underline">${h(c.email)}</a></p></div></div>
<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">📍</span><div><p class="text-sm text-gray-500">地址</p><p class="font-semibold text-gray-900">${h(c.addr)}</p></div></div>
</div></div></div></section>${ft(pp,c,pfx)}`;
  const siteU='https://'+(c.sub?c.sub+'.'+c.dom:c.dom)+'/';return lay('联系我们 - '+c.name,'',bd,c,siteU);
}
function listPage(t, pp, c, items, path, pfx){
  const bd=`${nav(pp,c,pfx+'/'+path,pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">${h(t)}</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">${items.length?`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${items.slice(0,12).map(item=>`<div class="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"><h3 class="font-semibold mb-2">${h(item.title||item.n)}</h3>${item.description?'<p class="text-sm text-gray-500 leading-relaxed">'+h(item.description.slice(0,150))+'</p>':''}${item.client?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-gray-100 rounded-full">'+h(item.client)+'</span>':''}${item.category?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full ml-1">'+h(item.category)+'</span>':''}</div>`).join('')}</div>`:'<p class="text-gray-400 text-center py-8">内容更新中</p>'}</div></section>${ft(pp,c,pfx)}`;
  return lay(t+' - '+c.name,'',bd,c);
}

function solDetailPage(sk, title, desc, pp, c, pfx, sls) {
  const sd = SOLS[sk];
  if (!sd) return listPage(title, pp, c, [{title,description:desc}], 'solutions', pfx);

  const probRows = (sd.problems||[]).map(p=>`<tr><td class="py-3 px-3 text-sm text-gray-900 font-medium">${h(p.p)}</td><td class="py-3 px-3 text-sm text-gray-500">${h(p.s)}</td><td class="py-3 px-3 text-sm text-primary-600">${h(p.a)}</td></tr>`).join('');
  const reqRows = (sd.requirements||[]).map(r=>`<tr><td class="py-2.5 px-3 text-sm text-gray-900 font-medium">${h(r.n||'')}</td><td class="py-2.5 px-3 text-sm text-gray-500">${h(r.d||'')}</td><td class="py-2.5 px-3 text-sm text-gray-400 text-center">${h(r.src||'')}</td></tr>`).join('');
  const phases = sd.implementation||[{p:'第一阶段',t:'方案设计',d:'1周'},
    {p:'第二阶段',t:'设备采购',d:'2周'},{p:'第三阶段',t:'安装调试',d:'2周'},{p:'第四阶段',t:'验收培训',d:'1周'}];
  const standards = sd.standards||[];

  const bd = `${nav(pp,c,pfx+'/solutions',pfx)}
<style>
.sol-progress{height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden}
.sol-progress-fill{height:100%;background:linear-gradient(90deg,#2563eb,#60a5fa);border-radius:4px}
.sol-toc{position:sticky;top:80px}
.sol-toc a{display:block;padding:6px 12px;font-size:13px;color:#64748b;border-left:2px solid #e2e8f0;text-decoration:none;transition:all .2s}
.sol-toc a:hover,.sol-toc a.active{border-left-color:#2563eb;color:#2563eb;background:#eff6ff}
</style>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-400 flex gap-2">
<a href="${pfx}" class="hover:text-primary-600 no-underline">首页</a><span>/</span><a href="${pfx}/solutions" class="hover:text-primary-600 no-underline">解决方案</a><span>/</span><span class="text-gray-600">${h(title)}</span>
</div>

<div class="bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
<div class="flex flex-wrap gap-2 mb-4"><span class="text-xs px-2 py-1 bg-white/20 text-white/80 rounded-full">技术方案</span><span class="text-xs px-2 py-1 bg-white/10 text-primary-200 rounded-full">V1.0</span><span class="text-xs px-2 py-1 bg-white/10 text-primary-200 rounded-full">编制：微物联技术</span></div>
<h1 class="text-3xl md:text-4xl font-bold">${h(title)}</h1>
<p class="text-primary-200 text-lg mt-2 max-w-3xl">${h(sd.sub)}</p>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">${sd.stats.map(s=>`<div class="bg-white/10 rounded-xl p-4 text-center border border-white/5"><div class="text-2xl md:text-3xl font-bold text-white">${h(s.v)}</div><div class="text-primary-200 text-sm mt-1">${h(s.l)}</div></div>`).join('')}</div>
</div></div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div class="flex flex-wrap gap-3 text-sm">${[
  {id:'overview',l:'项目概述'},
  {id:'analysis',l:'现状分析'},
  {id:'architecture',l:'系统架构'},
  {id:'products',l:'产品构成'},
  {id:'features',l:'核心功能'},
  {id:'implementation',l:'实施部署'},
  {id:'benefits',l:'投资回报'},
  {id:'service',l:'售后服务'},
].map(s=>`<a href="#sol-${s.id}" class="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full text-gray-600 no-underline transition-colors">${s.l}</a>`).join('')}</div>
</div>

<!-- 1. 项目概述 -->
<section id="sol-overview" class="scroll-mt-20 py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">01</span><h2 class="text-2xl font-bold">项目概述</h2></div>
<div class="grid md:grid-cols-3 gap-6 mb-10">${sd.goals.map(g=>`<div class="bg-gray-50 rounded-xl p-6 border border-gray-100"><div class="text-2xl mb-2">${g.ico}</div><h3 class="font-bold text-gray-900 mb-2">${h(g.t)}</h3><p class="text-sm text-gray-600 leading-relaxed">${h(g.d)}</p></div>`).join('')}</div>
<p class="text-gray-600 leading-relaxed">${h(sd.sub)}。本方案覆盖从需求调研、方案设计、设备选型、安装调试到运维管理的全生命周期服务，确保项目落地效果。</p>
</div></section>

<!-- 2. 现状分析 -->
${probRows?`<section id="sol-analysis" class="scroll-mt-20 py-12 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">02</span><h2 class="text-2xl font-bold">现状分析与需求</h2></div>
<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><table class="w-full text-sm"><thead><tr class="bg-gray-50"><th class="py-3 px-3 text-left font-semibold text-gray-700">现状问题</th><th class="py-3 px-3 text-left font-semibold text-gray-700">解决方案</th><th class="py-3 px-3 text-left font-semibold text-gray-700">实现价值</th></tr></thead><tbody>${probRows}</tbody></table></div>
${reqRows?`<div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><table class="w-full text-sm"><thead><tr class="bg-gray-50"><th class="py-3 px-3 text-left font-semibold text-gray-700">需求项</th><th class="py-3 px-3 text-left font-semibold text-gray-700">说明</th><th class="py-3 px-3 text-center font-semibold text-gray-700 w-24">来源</th></tr></thead><tbody>${reqRows}</tbody></table></div>`:''}
</div></section>`:''}

<!-- 3. 系统架构 -->
<section id="sol-architecture" class="scroll-mt-20 py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">03</span><h2 class="text-2xl font-bold">系统架构</h2></div>
<div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-700 overflow-hidden relative">
<div class="absolute inset-0 opacity-[0.03]" style="background-image:radial-gradient(circle at 1px 1px,white 1px,transparent 0);background-size:24px 24px"></div>
<div class="relative z-10 flex flex-col items-center gap-1">
${sd.arch.map((a,i)=>{
  const colors=['from-blue-500 to-blue-600','from-cyan-500 to-cyan-600','from-amber-500 to-amber-600','from-emerald-500 to-emerald-600'];
  const c=colors[i%colors.length];
  return `<div class="w-full max-w-2xl">
    ${i>0?`<div class="flex justify-center py-1"><div class="flex flex-col items-center text-gray-500"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3v14M5 12l5 5 5-5"/></svg><span class="text-[10px] tracking-widest uppercase">数据流</span></div></div>`:''}
    <div class="bg-gradient-to-r ${c} rounded-xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-default">
      <div class="flex items-center gap-4">
        <span class="text-3xl w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">${a.ico}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <h3 class="font-bold text-white text-base">${h(a.t)}</h3>
            <span class="text-[10px] px-2 py-0.5 bg-white/20 text-white/90 rounded-full font-mono">L${sd.arch.length-i}</span>
          </div>
          <p class="text-white/80 text-sm leading-relaxed">${h(a.d)}</p>
        </div>
      </div>
    </div>
  </div>`;
}).join('')}
</div></div></div></section>

<!-- 4. 产品构成 -->
<section id="sol-products" class="scroll-mt-20 py-12 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">04</span><h2 class="text-2xl font-bold">产品构成</h2></div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${sd.prods.map(pn=>`<a href="${pfx}/products/${slug(pn)}" class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all no-underline flex items-center gap-3"><span class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold flex-shrink-0">P</span><div><p class="text-sm font-medium text-gray-900">${h(pn)}</p></div></a>`).join('')}</div>
</div></section>

<!-- 5. 核心功能 -->
<section id="sol-features" class="scroll-mt-20 py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">05</span><h2 class="text-2xl font-bold">核心功能</h2></div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">${sd.feats.map(f=>`<div class="bg-gray-50 rounded-xl p-5 border border-gray-100"><div class="flex items-center gap-2 mb-3"><span class="text-xl">${f.ico}</span><h3 class="font-semibold text-gray-900 text-sm">${h(f.t)}</h3></div><p class="text-sm text-gray-500 leading-relaxed">${h(f.d)}</p></div>`).join('')}</div>
</div></section>

<!-- 6. 实施部署 -->
<section id="sol-implementation" class="scroll-mt-20 py-12 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">06</span><h2 class="text-2xl font-bold">实施部署</h2></div>
<div class="grid md:grid-cols-4 gap-4">${phases.map((p,i)=>`<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100"><div class="text-xs font-semibold text-primary-600 mb-1">${h(p.p)}</div><h3 class="font-bold text-gray-900 text-sm mb-2">${h(p.t)}</h3><p class="text-xs text-gray-500 mb-3">${h(p.d||'')}</p><div class="w-full bg-gray-100 rounded-full h-1.5"><div class="bg-primary-500 h-1.5 rounded-full" style="width:${(i+1)*25}%"></div></div></div>`).join('')}</div>
</div></section>

<!-- 7. 投资回报 -->
<section id="sol-benefits" class="scroll-mt-20 py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">07</span><h2 class="text-2xl font-bold">投资回报</h2></div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">${sd.benefits.map((b,i)=>`<div class="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100"><div class="sol-progress mb-3"><div class="sol-progress-fill" style="width:${(i+1)*(100/sd.benefits.length)}%"></div></div><p class="text-sm font-semibold text-gray-800">${h(b)}</p></div>`).join('')}</div>
${sd.scenes.length?`<div class="mt-10 pt-8 border-t border-gray-200"><h3 class="text-lg font-bold mb-4">典型应用场景</h3><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">${sd.scenes.map(s=>`<div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"><span class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span><span class="text-sm text-gray-700">${h(s)}</span></div>`).join('')}</div></div>`:''}
</div></section>

<!-- 8. 售后服务 -->
<section id="sol-service" class="scroll-mt-20 py-12 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-sm font-semibold text-primary-600">08</span><h2 class="text-2xl font-bold">售后服务与支持</h2></div>
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">${[
  {ico:'📞',t:'技术支持',d:'7×24小时热线支持，即时响应'},
  {ico:'🔧',t:'故障处理',d:'紧急故障4小时内响应，24小时到场'},
  {ico:'📋',t:'定期巡检',d:'季度设备巡检与健康评估'},
  {ico:'🆙',t:'软件升级',d:'平台功能终身免费升级'},
].map(s=>`<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100"><div class="text-2xl mb-2">${s.ico}</div><h3 class="font-semibold text-gray-900 text-sm mb-1">${h(s.t)}</h3><p class="text-xs text-gray-500">${h(s.d)}</p></div>`).join('')}</div>
${standards.length?`<div class="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100"><h3 class="font-semibold text-gray-900 mb-4">相关标准</h3><div class="flex flex-wrap gap-2">${standards.map(s=>`<span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">${h(s)}</span>`).join('')}</div></div>`:''}
</div></section>

<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
<h2 class="text-2xl font-bold mb-3">获取完整方案文档</h2>
<p class="text-primary-100 mb-6">联系我们获取详细技术方案书、产品配置清单及项目报价</p>
<a href="${pfx}/contact" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">📞 立即咨询</a>
</div></section>${ft(pp,c,pfx)}`;
  return lay(title+' - '+c.name,desc,bd,c);
}

// ═══════════ BUILD ═══════════
const defs=[
  {n:'yeslon',main:true,pfx:''},
  {n:'energy',pfx:'/energy'},
  {n:'electrical-safety',pfx:'/electrical-safety'},
  {n:'lightning-protection',pfx:'/lightning-protection'},
  {n:'industrial-plc',pfx:'/industrial-plc'},
];
console.log('Building...\n');
if(!existsSync(DIST))mkdirSync(DIST,{recursive:true});

for(const d of defs){
  const c=cfg(d.n);const pp=pages(d.n);
  const sls=reItems(join(root,'sites',d.n,'data','solutions.ts'),['title','description','category','slug']);
  const cs=reItems(join(root,'sites',d.n,'data','cases.ts'),['title','description','client']);
  const nws=reItems(join(root,'sites',d.n,'data','news.ts'),['title','description','category']);
  const out=d.main?DIST:join(DIST,d.n);
  if(!existsSync(out))mkdirSync(out,{recursive:true});
  const bu=c.sub?c.sub+'.'+c.dom:c.dom;

  // sitemap
  const surls=pp.map(p=>'<url><loc>https://'+bu+'/'+p.path+'</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>');
  writeFileSync(join(out,'sitemap.xml'),'<?xml version="1.0"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+surls.join('\n')+'\n</urlset>');
  writeFileSync(join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://'+bu+'/sitemap.xml\nCrawl-delay: 1');

  const pfx=d.pfx;
  for(const p of pp){
    const pt=p.path;let html;
    if(!pt)html=genHome(pp,c,sls,cs,c.feat,d.n,pfx);
    else if(pt==='about')html=aboutPage(pp,c,pfx);
    else if(pt==='contact')html=contactPage(pp,c,pfx);
    else if(pt==='products')html=prodsPage(pp,c,d.n,pfx);
    else if(pt==='solutions'){
      const solCards = sls.map(s=>{
        const sk = s.slug || slug(s.title);
        const sd=SOLS[sk];
        return `<a href="${pfx}/solutions/${sk}" class="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all no-underline">
          <h3 class="font-semibold text-gray-900 mb-2">${h(s.title)}</h3>
          <p class="text-sm text-gray-500 leading-relaxed mb-3">${h((s.description||'').slice(0,120))}</p>
          ${sd?`<div class="flex gap-3 text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">${sd.stats.slice(0,3).map(st=>`<span>${h(st.v)} ${h(st.l)}</span>`).join('<span class="text-gray-300">|</span>')}</div>`:''}
          <span class="text-sm text-primary-600 font-medium mt-2 inline-block">查看详情 →</span>
        </a>`;
      }).join('');
      html=`${nav(pp,c,pfx+'/solutions',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">${h(p.title)}</h1><p class="text-primary-200 mt-2">行业经验与技术积累，为客户创造价值</p></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${solCards}</div></div></section>${ft(pp,c,pfx)}`;
      html=lay(p.title+' - '+c.name,'',html,c);
    }
    else if(pt==='cases')html=listPage(p.title,pp,c,cs,pt,pfx);
    else if(pt==='news')html=listPage(p.title,pp,c,nws.length?nws:cs,pt,pfx);
    else html=listPage(p.title,pp,c,[],pt,pfx);
    const dir=pt?join(out,pt):out;
    if(!existsSync(dir))mkdirSync(dir,{recursive:true});
    writeFileSync(join(dir,'index.html'),html);
  }

  // product detail pages
  const cats=PROD[d.n]||PROD.yeslon;
  for(const cat of cats) for(const item of cat.items){
    const s=slug(item.n);
    const dir=join(out,'products',s);
    if(!existsSync(dir))mkdirSync(dir,{recursive:true});
    const body=prodPageBody(cat.cat,item,pp,c,pfx);
    writeFileSync(join(dir,'index.html'),lay(item.n+' - '+c.name,item.d||'',body,c));
  }

  // solution detail pages (main site only)
  if(d.main) for(const s of sls){
    const sk = s.slug || slug(s.title);
    const sd = SOLS[sk];
    if(!sd) continue;
    const dir = join(out,'solutions',sk);
    if(!existsSync(dir)) mkdirSync(dir,{recursive:true});
    writeFileSync(join(dir,'index.html'),solDetailPage(sk,s.title,s.description||'',pp,c,pfx,sls));
  }

  console.log(`  ${d.n}${d.main?' (main)':''} → ${pp.length} pages + product details + solutions`);
}

for(const f of['_redirects','_headers','_routes.json']){const s=join(root,f);if(existsSync(s))copyFileSync(s,join(DIST,f));}
console.log('\n✅ Build complete');
