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
  };
}
function pages(site) {
  const fp=join(root,'sites',site,'data','pages.ts');
  try{const c=readFileSync(fp,'utf-8');const p=[{path:'',title:'首页'}];const r=/path:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'/g;let m;while((m=r.exec(c))!==null)p.push({path:m[1],title:m[2]});return p;}catch{return[{path:'',title:'首页'}];}
}

const TW=`<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{primary:{50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'}},fontFamily:{sans:['Inter','Noto Sans SC','system-ui','sans-serif']}}}}</script>`;
function h(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function lay(t,d,b,c){return'<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>'+h(t)+'</title>\n<meta name="description" content="'+h(d||'')+'">\n'+TW+'\n</head>\n<body class="bg-gray-50 text-gray-900 font-sans antialiased">\n'+b+'\n</body>\n</html>';}
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
  const solCards = sls.slice(0,6).map(s=>`<div class="bg-gray-50 rounded-xl p-6"><h3 class="font-semibold mb-2">${h(s.title)}</h3>${s.description?'<p class="text-sm text-gray-500">'+h(s.description.slice(0,150))+'</p>':''}</div>`).join('');
  const caseCards = cs.slice(0,3).map(c=>`<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"><h3 class="font-semibold mb-2">${h(c.title)}</h3>${c.description?'<p class="text-sm text-gray-500">'+h(c.description.slice(0,120))+'</p>':''}${c.client?'<span class="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 rounded-full">'+h(c.client)+'</span>':''}</div>`).join('');

  const bd=`${nav(pp,c,pfx+'/',pfx)}
<div class="bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"><div class="max-w-3xl"><h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">${h(c.name)}</h1><p class="text-lg md:text-xl text-primary-100 leading-relaxed mb-8">${h(c.desc)}</p><div class="flex gap-4"><a href="${pfx}/products" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">查看产品 →</a><a href="${pfx}/contact" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors no-underline">联系我们</a></div></div></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">核心业务</h2><p class="text-lg text-gray-500 mt-2">专注工业物联网与电气安全领域</p></div><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">${featCards}</div></div></section>
<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">产品系列</h2><p class="text-lg text-gray-500 mt-2">自主研发、工业级品质</p></div><div class="grid md:grid-cols-3 gap-6">${catCards}</div></div></section>
${sls.length?`<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">解决方案</h2></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${solCards}</div></div></section>`:''}
${cs.length?`<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">成功案例</h2></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${caseCards}</div></div></section>`:''}
<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-3xl font-bold mb-3">需要详细方案？</h2><p class="text-primary-100 text-lg mb-8">联系我们获取产品资料、技术方案与报价</p><a href="mailto:${h(c.email)}" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">✉️ 立即咨询</a></div></section>${ft(pp,c,pfx)}`;
  return lay('首页 - '+c.name,c.desc,bd,c);
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
  return lay('产品中心 - '+c.name,c.name+'产品中心',bd,c);
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
  return lay('关于我们 - '+c.name,'',bd,c);
}
function contactPage(pp,c,pfx){
  const bd=`${nav(pp,c,pfx+'/contact',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">联系我们</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-2xl mx-auto"><div class="space-y-4">
<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">📞</span><div><p class="text-sm text-gray-500">电话</p><p class="font-semibold text-gray-900">${h(c.phone)}</p></div></div>
<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">✉️</span><div><p class="text-sm text-gray-500">邮箱</p><p class="font-semibold text-gray-900"><a href="mailto:${h(c.email)}" class="text-primary-600 no-underline hover:underline">${h(c.email)}</a></p></div></div>
<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">📍</span><div><p class="text-sm text-gray-500">地址</p><p class="font-semibold text-gray-900">${h(c.addr)}</p></div></div>
</div></div></div></section>${ft(pp,c,pfx)}`;
  return lay('联系我们 - '+c.name,'',bd,c);
}
function listPage(t, pp, c, items, path, pfx){
  const bd=`${nav(pp,c,pfx+'/'+path,pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">${h(t)}</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">${items.length?`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${items.slice(0,12).map(item=>`<div class="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"><h3 class="font-semibold mb-2">${h(item.title||item.n)}</h3>${item.description?'<p class="text-sm text-gray-500 leading-relaxed">'+h(item.description.slice(0,150))+'</p>':''}${item.client?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-gray-100 rounded-full">'+h(item.client)+'</span>':''}${item.category?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full ml-1">'+h(item.category)+'</span>':''}</div>`).join('')}</div>`:'<p class="text-gray-400 text-center py-8">内容更新中</p>'}</div></section>${ft(pp,c,pfx)}`;
  return lay(t+' - '+c.name,'',bd,c);
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
  const sls=reItems(join(root,'sites',d.n,'data','solutions.ts'),['title','description','category']);
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
    else if(pt==='solutions')html=listPage(p.title,pp,c,sls,pt,pfx);
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
  console.log(`  ${d.n}${d.main?' (main)':''} → ${pp.length} pages + product details`);
}

for(const f of['_redirects','_headers','_routes.json']){const s=join(root,f);if(existsSync(s))copyFileSync(s,join(DIST,f));}
console.log('\n✅ Build complete');
