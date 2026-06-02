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

function prodPageBody(cat, item, pp, c, pfx) {
  return `${nav(pp,c,pfx+'/products',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<a href="${pfx}/products" class="text-primary-200 hover:text-white text-sm no-underline">← 返回产品中心</a>
<h1 class="text-2xl md:text-3xl font-bold mt-4">${h(item.n)}</h1>
${item.m?'<p class="text-primary-200 mt-1">型号：'+h(item.m)+'</p>':''}
</div></div>
<section class="py-12 bg-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid md:grid-cols-3 gap-8">
<div class="md:col-span-2"><h2 class="text-xl font-bold mb-4">产品概述</h2><p class="text-gray-600 leading-relaxed">${h(item.d||item.desc||'')}</p></div>
<div class="bg-gray-50 rounded-xl p-6"><h3 class="font-semibold mb-3">产品分类</h3><span class="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">${h(cat)}</span></div>
</div>
${item.s&&item.s.length?`<div class="mt-12"><h2 class="text-xl font-bold mb-6">技术规格</h2>
<div class="grid md:grid-cols-2 gap-4">${item.s.map(s=>`<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><span class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span><span class="text-sm text-gray-700">${h(s)}</span></div>`).join('')}</div></div>`:''}
<div class="mt-12 text-center"><a href="${pfx}/contact" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors no-underline">📞 咨询该产品</a></div>
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
  const bd=`${nav(pp,c,pfx+'/products',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"><h1 class="text-3xl md:text-4xl font-bold mb-3">产品中心</h1><p class="text-primary-100 text-lg">${h(c.name)} 全系列产品</p></div></div>
${cats.map((cat,i)=>`<section class="py-12 ${i===0?'bg-white':'bg-gray-50'}"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center gap-3 mb-8"><span class="text-3xl">${cat.ico}</span><h2 class="text-2xl font-bold">${h(cat.cat)}</h2><span class="text-sm text-gray-400">（${cat.items.length}款）</span></div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">${cat.items.map(item=>`<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"><h3 class="font-semibold text-gray-900">${h(item.n)}</h3>${item.m?'<p class="text-xs text-gray-400 mt-1">型号：'+h(item.m)+'</p>':''}<p class="text-sm text-gray-500 mt-2 leading-relaxed">${h((item.d||item.desc||'').slice(0,120))}</p><a href="${pfx}/products/${slug(item.n)}" class="inline-block mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium no-underline">查看详情 →</a></div>`).join('')}
</div></div></section>`).join('')}${ft(pp,c,pfx)}`;
  return lay('产品中心 - '+c.name,c.name+'产品中心',bd,c);
}

function aboutPage(pp,c,pfx){
  const bd=`${nav(pp,c,pfx+'/about',pfx)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">关于我们</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-3xl mx-auto"><p class="text-lg text-gray-600 leading-relaxed mb-8">${h(c.desc)}</p><div class="bg-gray-50 rounded-xl p-8"><h3 class="text-xl font-semibold mb-4">联系方式</h3><div class="space-y-3 text-gray-600"><p>📞 ${h(c.phone)}</p><p>✉️ ${h(c.email)}</p><p>📍 ${h(c.addr)}</p></div></div></div></div></section>${ft(pp,c,pfx)}`;
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
