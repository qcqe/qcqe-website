import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const DIST = join(root, 'dist');

function grep(file, re, idx) {
  try { const m = readFileSync(file,'utf-8').match(re); return m ? m[idx].replace(/\\n/g,' ') : ''; } catch { return ''; }
}
function grepList(file, re) {
  try { const m = readFileSync(file,'utf-8').match(re); if(!m) return []; return [...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]); } catch { return []; }
}
function grepItems(file, fields) {
  try {
    const c=readFileSync(file,'utf-8'); const items=[];
    for(const b of c.split(/\n\s*\{/)){ const item={};
      for(const f of fields){ const r=new RegExp(f+":\\s*'([^']+)'"); const m=b.match(r); if(m) item[f]=m[1]; }
      if(item.title||item.name) items.push(item);
    } return items;
  } catch { return []; }
}

function cfg(site) {
  const base=join(root,'sites',site); const c=join(base,'data','config.ts');
  return {
    subdomain: grep(c,/subdomain:\s*'([^']+)'/,1),
    domain: grep(c,/(?<!sub)domain:\s*'([^']+)'/,1),
    siteName: grep(c,/siteName:\s*'([^']+)'/,1),
    desc: grep(c,/seo:\s*\{[\s\S]*?description:\s*'([^']+)'/,1)||grep(c,/^[^(seo)]*description:\s*'([^']+)'/m,1),
    phone: grep(c,/phone:\s*'([^']+)'/,1),
    email: grep(c,/email:\s*'([^']+)'/,1),
    address: grep(c,/address:\s*'([^']+)'/,1),
    features: grepList(c,/features:\s*\[([\s\S]*?)\]/),
    color: grep(c,/primaryColor:\s*'([^']+)'/,1)||'#1E40AF',
  };
}
function pg(site) {
  const fp=join(root,'sites',site,'data','pages.ts');
  try{const c=readFileSync(fp,'utf-8');const p=[{path:'',title:'首页'}];const r=/path:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'/g;let m;while((m=r.exec(c))!==null)p.push({path:m[1],title:m[2]});return p;}catch{return[{path:'',title:'首页'}];}
}

const TW=`<script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{primary:{50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'}},fontFamily:{sans:['Inter','Noto Sans SC','system-ui','sans-serif']}}}}</script>`;
function h(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function layout(t,d,bd,c){return'<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>'+h(t)+'</title>\n<meta name="description" content="'+h(d||'')+'">\n'+TW+'\n</head>\n<body class="bg-gray-50 text-gray-900 font-sans antialiased">\n'+bd+'\n</body>\n</html>';}

function nav(pp,c,cur){
  return `<nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex justify-between items-center h-16">
<a href="/" class="flex items-center gap-2 text-lg font-bold text-gray-900 no-underline hover:no-underline">
<span class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">Y</span>
${h(c.siteName)}
</a>
<div class="hidden md:flex items-center gap-1">
${pp.filter(p=>p.path&&p.path!='contact').map(p=>'<a href="/'+p.path+'" class="px-3 py-2 text-sm font-medium rounded-lg transition-colors '+( '/'+p.path===cur?'text-primary-600 bg-primary-50':'text-gray-600 hover:text-gray-900 hover:bg-gray-100')+' no-underline">'+h(p.title)+'</a>').join('')}
<a href="/contact" class="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors no-underline">联系我们</a>
</div></div></div></nav>`;
}
function ft(c){
  return `<footer class="bg-gray-900 text-gray-400">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div class="grid md:grid-cols-3 gap-8">
<div><h4 class="text-white font-semibold mb-3">${h(c.siteName)}</h4><p class="text-sm leading-relaxed">${h(c.desc)}</p></div>
<div><h4 class="text-white font-semibold mb-3">联系方式</h4>
<p class="text-sm mb-1">📞 ${h(c.phone)}</p><p class="text-sm mb-1">✉️ ${h(c.email)}</p><p class="text-sm">📍 ${h(c.address)}</p></div>
<div><h4 class="text-white font-semibold mb-3">快速链接</h4>
<div class="space-y-1 text-sm"><a href="/products" class="block text-gray-400 hover:text-white no-underline">产品中心</a><a href="/solutions" class="block text-gray-400 hover:text-white no-underline">解决方案</a><a href="/cases" class="block text-gray-400 hover:text-white no-underline">成功案例</a><a href="/about" class="block text-gray-400 hover:text-white no-underline">关于我们</a></div></div>
</div>
<div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">© ${new Date().getFullYear()} ${h(c.siteName)} 版权所有</div>
</div></footer>`;
}

// ═══════════════════════════════════════════
//  COMPLETE PRODUCT CATALOG
//  Based on actual product documentation
// ═══════════════════════════════════════════

const ALL_PRODUCTS = {
yeslon: [
{cat:'工业智控',icon:'⚙️',items:[
  {name:'CC系列可编程控制器 (PLC)',model:'CC100 / CCXXX',desc:'工业级通用PLC控制器，支持IEC 61131-3编程标准，EtherCAT/PROFINET/Modbus TCP多协议通信，适用于复杂逻辑控制、运动控制与过程控制场景。',specs:['支持IEC 61131-3 ST/LD/FBD/IL/SFC','EtherCAT/PROFINET/Modbus TCP','模块化I/O扩展','-25℃~70℃工业宽温','CE/FCC认证']},
  {name:'CR系列工业分站',model:'CR系列',desc:'分布式远程I/O站，支持EtherCAT总线组网，适用于产线分布式控制场景，实现远程设备的高速数据采集与控制。',specs:['EtherCAT总线通信','分布式远程I/O扩展','IP20防护','DIN导轨安装']},
  {name:'CX系列工业设备手环',model:'CX-08R06AI08',desc:'工业设备智能监测手环，集成振动、温度等多参数采集，实时监测设备运行状态，实现预测性维护。',specs:['振动/温度多参数采集','无线数据传输','IP67防护','电池续航≥2年','边缘预警算法']},
  {name:'CW系列边缘计算网关',model:'CW系列',desc:'工业边缘计算网关，支持多协议采集与数据上云，内置边缘计算能力，实现设备联网与数据预处理。',specs:['支持Modbus/PLC/DL645等多协议','4G/Wi-Fi/Ethernet上行','边缘计算与数据缓存','设备远程管理','MQTT/HTTP云对接']},
  {name:'HMI触摸屏',model:'HMI系列',desc:'工业人机界面，4.3"/7"/10"/12"/15.6"多规格，支持工业以太网与远程监控，IP65防护。',specs:['4.3"/7"/10"/12"/15.6"多尺寸','工业以太网通信','VNC远程访问','IP65防护等级','电容/电阻触摸可选']},
  {name:'I/O模块系列',model:'AI080/AO081/DI160/DM160/RO160等',desc:'丰富的I/O模块产品线，涵盖模拟量输入输出、数字量输入输出、温度测量、脉冲计数等，灵活组合满足各类控制需求。',specs:['AI080:8通道模拟量输入','AO081:8通道模拟量输出','DI160:16通道数字量输入','DM160/DM168/DM169:混合模块','RO080/RO160:继电器输出','PT050/TC060:温度测量模块']},
]},
{cat:'电气安全监测 (ES系列)',icon:'⚡',items:[
  {name:'ESA全要素智能电表',model:'ESA',desc:'全要素智能电表，集成电压、电流、有功无功功率、功率因数、谐波畸变率、温度等多参数高精度同步采集。',specs:['电压/电流/功率/谐波/温度全参数','0.5S级电能计量精度','2~63次谐波分析','Modbus RTU/TCP/DL645/MQTT','本地数据存储与断点续传']},
  {name:'ESB三相不平衡监测器',model:'ESB',desc:'三相不平衡专业监测器，实时监测三相电压电流不平衡度及零序电流，越限告警与事件记录。',specs:['三相电压/电流不平衡度计算','零序电流高精度采样','不平衡越限告警','历史趋势分析','支持补偿装置联动']},
  {name:'ESC漏电监测模组',model:'ESC',desc:'多路漏电测控器，实时监测线路剩余电流，支持多通道同步采集，适用于电气火灾隐患监测场景。',specs:['多通道漏电流同步监测','剩余电流高精度测量','越限告警与事件记录','RS485/Modbus通信','DIN导轨安装']},
  {name:'ESE电能质量监测器',model:'ESE',desc:'电能质量专业监测设备，分析电压暂降、暂升、谐波、闪变等电能质量事件，为电能质量治理提供数据支撑。',specs:['电压暂降/暂升/中断检测','2~63次谐波与间谐波','电压闪变测量','不平衡度分析','事件记录与波形捕获']},
  {name:'ESF电气火灾监测模组',model:'ESF',desc:'电气火灾测控器，集成剩余电流、温度等多参数监测，实现电气火灾隐患的早期预警。',specs:['剩余电流+温度双参数','多通道同步监测','分级告警策略','消防联动接口','符合GB 14287标准']},
  {name:'ESI数字量输入监测模组',model:'ESI',desc:'数字量状态监测器，采集开关量信号、脉冲计数等，适用于设备状态监测与运行统计。',specs:['多通道数字量输入','脉冲计数与累计','状态变化事件记录','RS485/Modbus通信','宽电压输入范围']},
  {name:'ESM防雷监测模组',model:'ESM（基础版/旗舰版）',desc:'全要素SPD监测模组，实时监测电涌保护器漏电流、热脱扣状态、雷击次数，基础版与旗舰版可选。',specs:['SPD漏电流μA级监测','热脱扣状态检测','雷击计数与能量记录','基础版:核心监测功能','旗舰版:含雷电流峰值+波形记录']},
  {name:'ESP零地电压监测器',model:'ESP',desc:'零地电压专业监测器，实时监测N-PE间电压，预警零地电压异常，保障敏感设备安全运行。',specs:['N-PE电压高精度测量','零地电压越限告警','异常事件记录','RS485/Modbus通信','DIN导轨安装']},
  {name:'EST温度监测模组',model:'EST',desc:'多路温度智控器，支持NTC/PT100/热电偶等多种温度传感器，适用于开关柜触头、电缆接头等关键部位温度监测。',specs:['多通道温度同步采集','NTC/PT100/热电偶兼容','-40℃~+200℃测温范围','±0.5℃精度','智能温升趋势分析']},
  {name:'ESX智能网关',model:'ESX',desc:'电气安全系列专用智能网关，汇聚ESA/ESB/ESC/ESE等设备数据，支持4G/Wi-Fi/Ethernet上云。',specs:['ESA/ESB/ESC等设备统一接入','4G/Wi-Fi/Ethernet多模上行','协议转换与数据汇聚','远程配置与管理','MQTT/HTTP云对接']},
]},
{cat:'智能防雷 (F系列)',icon:'🌩️',items:[
  {name:'FS防雷器监测模块',model:'FS（四要素/九要素/多要素）',desc:'电涌保护器在线监测仪，实时监测SPD漏电流、热脱扣状态、雷击次数，四要素/九要素/多要素多种规格可选。',specs:['SPD漏电流实时监测(μA级)','热脱扣状态检测','雷击计数(四要素)','雷击计数+能量+峰值(九要素)','多要素:含全参数+波形记录']},
  {name:'FSS智能型电涌保护器',model:'FSS（数码管/OLED）',desc:'内置监测模块的一体化智能电涌保护器，数码管或OLED显示可选，支持劣化预警与远程巡检。',specs:['SPD+监测模块一体化设计','数码管/OLED显示可选','漏电流/热脱扣/雷击计数','劣化趋势预警','RS485/4G远程通信']},
  {name:'FSP智能型电涌保护器(底座式)',model:'FSP',desc:'底座式智能电涌保护器监测底座，配合标准SPD模块使用，实现SPD状态在线监测。',specs:['底座式设计，适配标准SPD','漏电流监测','热脱扣检测','雷击计数','即插即用安装']},
  {name:'FL雷电流监测模块',model:'FL（室内/室外/瞬态电流）',desc:'雷电峰值监测仪，精确记录雷电流峰值、极性及发生时间，室内版/室外版/瞬态电流监测多种规格。',specs:['雷电流峰值0.1~200kA','极性识别与波形记录','GPS/北斗双模授时','室内版/室外版/瞬态电流版','IP67防护(室外版)']},
  {name:'FR接地电阻监测模块',model:'FR（室内导轨/室内螺丝/室外）',desc:'接地电阻在线监测仪，三极法(电位降法)测量，室内导轨式/室内螺丝式/室外型多规格可选。',specs:['三极法测量，0.01Ω~200Ω','室内导轨/DIN安装','室内螺丝固定安装','室外型IP67防护','土壤电阻率辅助测量']},
  {name:'FRP回路法接地电阻监测仪',model:'FRP（含防爆型）',desc:'回路法接地电阻监测仪，钳表法无需辅助极，适用于已建接地系统，另有防爆型满足石化等特殊场景需求。',specs:['钳表法非接触测量','0.01Ω~200Ω测量范围','免辅助极，适用于已建接地','防爆型Ex ia IIC T4','LoRa无线组网通信']},
  {name:'FA故障电弧监测模块',model:'FA',desc:'故障电弧监测器，实时检测线路电弧故障特征，识别串联/并联电弧，预防电气火灾。',specs:['串联/并联电弧检测','电弧特征智能识别','UL 1699B标准符合','越限告警输出','RS485/Modbus通信']},
  {name:'FD剩余电流监测模块',model:'FD',desc:'剩余电流专业监测模块，高精度采集线路剩余电流值，适用于电气火灾隐患监测与漏电保护。',specs:['剩余电流高精度测量','AC/DC兼容检测','越限分级告警','事件记录','RS485/Modbus通信']},
  {name:'FG智能防雷网关',model:'FG',desc:'智能防雷系统核心网关，汇聚FS/FL/FR/FSS/FSP全系列设备数据，4G/Wi-Fi上云，边缘计算与规约转换。',specs:['FS/FL/FR/FSS/FSP全系列接入','4G/Wi-Fi/Ethernet多模上行','边缘计算与协议转换','远程配置与OTA升级','支持128台设备同时接入']},
  {name:'FAP故障电弧探测器(一体式)',model:'FAP',desc:'一体式故障电弧探测器，集成电弧检测、漏电保护、过压保护等功能，适用于末端配电回路保护。',specs:['电弧+漏电+过压三合一','一体式紧凑设计','UL 1699B/GB 14287','导轨安装','本地声光报警+远程通信']},
]},
{cat:'智能断路器',icon:'🔌',items:[
  {name:'FECB2P智能断路器',model:'FECB2P',desc:'智能断路器，集成过载保护、短路保护、漏电保护功能，支持远程通断控制与电能计量。',specs:['过载/短路/漏电保护','远程通断控制','电能计量','RS485/无线通信','智能告警推送']},
  {name:'FECB2LP/FECB2SLP智能漏电断路器',model:'FECB2LP/FECB2SLP',desc:'智能漏电保护断路器，集成剩余电流保护与电气参数监测，适用于住宅、商业及工业配电场景。',specs:['剩余电流保护(30/100/300mA)','电气参数实时监测','远程通断控制','漏电自检功能','RS485/无线通信']},
  {name:'FECM2智能断路器网关',model:'FECM2',desc:'智能断路器专用网关，汇聚多回路断路器数据，统一上云管理，实现配电回路智能化监控。',specs:['多回路断路器统一接入','4G/Wi-Fi上云','数据汇聚与边缘处理','远程参数配置','告警联动与工单管理']},
]},
{cat:'软件平台',icon:'🖥️',items:[
  {name:'FEXLINK工业互联网软件',model:'V1.0',desc:'工业互联网软件平台，实现设备监控、数据可视化、远程管理、告警联动等功能，支持PC端与移动端访问。',specs:['设备实时监控看板','历史数据查询与分析','告警规则配置与推送','多级用户权限管理','OEE/能耗等KPI统计']},
  {name:'设备管理云平台',model:'云平台',desc:'微物联设备管理云平台，支持ESA/ESB/FS/FL/FR等全系列设备接入，实现设备远程管理、数据可视化、智能告警。',specs:['多设备类型统一接入','实时数据监控面板','告警策略自定义','数据报表自动生成','移动端APP支持']},
]},
],
energy: [
{cat:'充电站安全',icon:'🔋',items:[
  {name:'充电站电气安全监测终端',model:'',desc:'专为充电桩设计的电气安全监测终端，集成漏电、电弧、谐波、温度多参数监测，确保充电运营安全。',specs:['漏电流实时监测','故障电弧检测','谐波指纹分析','接点温度监测','远程告警推送']},
  {name:'谐波指纹分析仪',model:'',desc:'高频谐波采样分析仪，256点/周期精细采样，AI深度学习谐波特征识别，实现隐患提前预警。',specs:['256点/周期高频采样','AI谐波指纹识别','隐患提前30天预警','电能质量评估','自动生成分析报告']},
  {name:'电动自行车充电棚监测终端',model:'',desc:'充电棚专用电气安全监测终端，漏电+过载+温度+烟雾四合一，远程断电与消防联动。',specs:['漏电/过载/温度/烟雾监测','充电回路独立监控','远程断电控制','声光告警+平台推送','消防联动接口']},
]},
{cat:'储能安全',icon:'🔋',items:[
  {name:'储能电站安全监测系统',model:'',desc:'储能电站电气安全整体方案，电池簇电气参数监测、热失控预警、绝缘诊断、弧光检测。',specs:['电池簇电压/电流/温度','热失控早期预警','绝缘电阻在线诊断','弧光检测与保护','多级告警与消防联动']},
]},
],
'electrical-safety': [
{cat:'能效与电能质量',icon:'📊',items:[
  {name:'ESA全要素智能电表',model:'ESA',desc:'全要素智能电表，电压/电流/功率/谐波/温度全参数，0.5S级精度。',specs:['全要素同步采集','0.5S级计量','2~63次谐波','Modbus/DL645/MQTT']},
  {name:'ESE电能质量监测器',model:'ESE',desc:'专业电能质量监测，电压暂降/暂升/谐波/闪变分析。',specs:['暂降暂升检测','谐波分析','闪变测量','波形捕获']},
  {name:'SFE电能质量测控模组',model:'SFE',desc:'电能质量测控一体化模组，监测+控制+通信集成。',specs:['监测+控制+通信一体化','电能质量全参数','越限联动控制','RS485/4G通信']},
]},
{cat:'电气安全监测',icon:'⚡',items:[
  {name:'ESB三相不平衡监测器',model:'ESB',desc:'三相不平衡监测，实时计算不平衡度，预警中性线过载。',specs:['不平衡度实时计算','零序电流0.5%级','越限告警','趋势分析']},
  {name:'ESC多路漏电测控器',model:'ESC',desc:'多通道漏电监测，剩余电流高精度采集，电气火灾预警。',specs:['多通道同步监测','剩余电流高精度','分级告警','消防联动']},
  {name:'ESF电气火灾测控器',model:'ESF',desc:'电气火灾监测，剩余电流+温度双参数，早期预警。',specs:['剩余电流+温度双监测','多通道','分级告警','GB 14287符合']},
  {name:'EST多路温度智控器',model:'EST',desc:'多路温度监测，NTC/PT100/热电偶兼容，智能温升趋势分析。',specs:['多通道测温','NTC/PT100兼容','±0.5℃精度','温升趋势分析']},
  {name:'ESP零地电压监测器',model:'ESP',desc:'零地电压监测，N-PE电压高精度测量，预警零地异常。',specs:['N-PE高精度测量','越限告警','事件记录','DIN导轨安装']},
  {name:'ESI数字量状态监测器',model:'ESI',desc:'开关量/脉冲采集，设备状态监测与运行统计。',specs:['多通道DI','脉冲计数','状态事件记录','RS485通信']},
  {name:'FA故障电弧监测模块',model:'FA',desc:'电弧故障检测，串联/并联电弧识别，电气火灾预防。',specs:['串联/并联电弧','UL 1699B','智能识别','RS485通信']},
  {name:'FAP故障电弧探测器(一体式)',model:'FAP',desc:'电弧+漏电+过压三合一保护，末端配电回路保护。',specs:['三合一保护','一体式紧凑','本地报警+远程','导轨安装']},
  {name:'FD剩余电流监测模块',model:'FD',desc:'剩余电流高精度采集，漏电保护与火灾隐患监测。',specs:['高精度测量','AC/DC兼容','分级告警','事件记录']},
]},
{cat:'监测网关与通信',icon:'📡',items:[
  {name:'ESX智能网关',model:'ESX',desc:'电气安全全系列设备统一网关，4G/Wi-Fi上云。',specs:['全系列设备接入','4G/Wi-Fi/Ethernet','协议转换','远程管理']},
  {name:'FG智能防雷网关',model:'FG',desc:'防雷全系列设备汇聚网关，边缘计算与OTA升级。',specs:['FS/FL/FR/FSS接入','4G/Wi-Fi','边缘计算','OTA升级']},
]},
],
'lightning-protection': [
{cat:'SPD在线监测',icon:'🌩️',items:[
  {name:'FS防雷器监测模块',model:'FS-四要素/九要素/多要素',desc:'SPD在线监测，漏电流+热脱扣+雷击计数，多规格。',specs:['漏电流μA级','热脱扣检测','四要素:计数','九要素:计数+能量+峰值','多要素:全参数+波形']},
  {name:'FSS智能型电涌保护器',model:'FSS-数码管/OLED',desc:'一体化智能SPD，内置监测模块，数码管/OLED显示。',specs:['SPD+监测一体化','数码管/OLED','劣化预警','远程通信']},
  {name:'FSP电涌保护器底座',model:'FSP',desc:'底座式监测模块，适配标准SPD，即插即用。',specs:['底座式设计','漏电流监测','热脱扣检测','即插即用']},
  {name:'SPD监测器(红色计数器)',model:'SPD监测器',desc:'经济型SPD计数器，红色LED显示雷击次数。',specs:['雷击计数','红色LED显示','免维护','壁挂式安装']},
  {name:'ESM防雷监测模组',model:'ESM-基础版/旗舰版',desc:'全要素SPD监测，基础版核心监测/旗舰版含雷电流波形。',specs:['漏电流/热脱扣/计数','基础版:核心监测','旗舰版:含峰值+波形','RS485/4G通信']},
]},
{cat:'雷电峰值监测',icon:'⚡',items:[
  {name:'FL雷电流监测模块(室内版)',model:'FL-室内',desc:'室内型雷电流监测，记录峰值/极性/时间。',specs:['0.1~200kA','极性识别','GPS授时','室内安装']},
  {name:'FL雷电流监测模块(室外版)',model:'FL-室外',desc:'室外型雷电流监测，IP67防护，适应严苛环境。',specs:['0.1~200kA','极性识别','IP67防护','户外安装']},
  {name:'FL瞬态电流监测模块',model:'FL-瞬态电流',desc:'瞬态电流监测，捕获μs级瞬态电流事件。',specs:['μs级瞬态捕获','峰值记录','高速采样','事件时间戳']},
]},
{cat:'接地电阻监测',icon:'🌍',items:[
  {name:'FR接地电阻监测仪(室内导轨)',model:'FR-导轨',desc:'DIN导轨安装，三极法接地电阻在线监测。',specs:['三极法测量','0.01~200Ω','DIN导轨安装','RS485通信']},
  {name:'FR接地电阻监测仪(室内螺丝)',model:'FR-螺丝',desc:'螺丝固定安装，三极法接地电阻在线监测。',specs:['三极法测量','0.01~200Ω','螺丝壁挂安装','RS485通信']},
  {name:'FR接地电阻监测仪(室外)',model:'FR-室外',desc:'室外型接地电阻监测，IP67防护。',specs:['三极法测量','0.01~200Ω','IP67防护','户外安装']},
  {name:'FRP回路法接地电阻监测仪',model:'FRP',desc:'钳表法非接触测量，免辅助极，含防爆型。',specs:['钳表法测量','免辅助极','防爆型Ex ia IIC T4','LoRa通信']},
]},
{cat:'智能断路器',icon:'🔌',items:[
  {name:'FECB2P智能断路器',model:'FECB2P',desc:'智能断路器，过载/短路/漏电保护+远程控制。',specs:['过载/短路/漏电','远程通断','电能计量','无线通信']},
  {name:'FECB2LP智能漏电断路器',model:'FECB2LP',desc:'智能漏电保护，30/100/300mA可调，远程控制。',specs:['漏电保护可调','远程通断','漏电自检','RS485通信']},
  {name:'FECB2SLP智能漏电断路器',model:'FECB2SLP',desc:'智能漏电断路器，小型化设计，住宅/商业配电。',specs:['小型化设计','漏电保护','远程控制','无线通信']},
  {name:'FECM2智能断路器网关',model:'FECM2',desc:'多回路断路器统一网关，集中管理上云。',specs:['多回路接入','4G/Wi-Fi上云','参数远程配置','告警联动']},
]},
{cat:'智能网关',icon:'📡',items:[
  {name:'FG系列智能防雷网关',model:'FG',desc:'防雷全系列设备汇聚网关，128台设备同时接入。',specs:['FS/FL/FR/FSS/FSP全系列','128台设备接入','4G/Wi-Fi/Ethernet','边缘计算+OTA']},
]},
],
'industrial-plc': [
{cat:'可编程控制器PLC',icon:'⚙️',items:[
  {name:'CC系列可编程控制器',model:'CC100/CCXXX',desc:'通用高性能PLC控制器，支持IEC 61131-3编程。,多协议工业通信。',specs:['IEC 61131-3编程','EtherCAT/PROFINET/Modbus TCP','模块化I/O灵活扩展','-25℃~70℃宽温','CE/FCC认证','CODESYS运行时']},
  {name:'CR系列工业分站',model:'CR系列',desc:'分布式远程I/O站，EtherCAT总线组网，适用于产线分布式控制。',specs:['EtherCAT总线通信','分布式远程I/O','防护等级IP20','DIN导轨安装','高速数据采集']},
]},
{cat:'工业边缘智能',icon:'🧠',items:[
  {name:'CX系列工业设备手环',model:'CX-08R06AI08',desc:'设备智能监测终端，振动温度采集，预测性维护，IP67防护。',specs:['振动+温度采集','无线数据传输','IP67防护','电池续航≥2年','边缘预警AI算法']},
  {name:'CW系列边缘计算网关',model:'CW系列',desc:'边缘计算网关，多协议采集+4G/Wi-Fi上云+边缘数据处理。',specs:['100+工业协议支持','4G/Wi-Fi/Ethernet','边缘数据处理','设备远程管理','MQTT/HTTP云对接']},
]},
{cat:'I/O模块',icon:'🔌',items:[
  {name:'AI080模拟量输入模块',model:'AI080',desc:'8通道模拟量输入，0~10V/4~20mA多量程可选。'},
  {name:'AO081模拟量输出模块',model:'AO081',desc:'8通道模拟量输出，0~10V/4~20mA。'},
  {name:'DI160数字量输入模块',model:'DI160',desc:'16通道数字量输入，光电隔离。'},
  {name:'DM160/DM168/DM169混合模块',model:'DM160/DM168/DM169',desc:'数字量输入输出混合模块，灵活组合。'},
  {name:'PT050温度测量模块',model:'PT050',desc:'PT100/PT1000温度传感器接入模块。'},
  {name:'TC060热电偶测量模块',model:'TC060',desc:'热电偶温度测量模块，支持多种热电偶类型。'},
  {name:'RO080/RO160继电器输出模块',model:'RO080/RO160',desc:'继电器输出模块，8/16通道。'},
  {name:'TO160晶体管输出模块',model:'TO160',desc:'16通道晶体管输出，高速开关。'},
]},
{cat:'HMI人机界面',icon:'🖥️',items:[
  {name:'HMI工业触摸屏',model:'HMI系列',desc:'多规格工业触摸屏，4.3"/7"/10"/12"/15.6"，工业以太网+VNC远程。',specs:['4.3"/7"/10"/12"/15.6"','工业以太网','VNC远程访问','IP65防护']},
]},
{cat:'工业网关',icon:'📡',items:[
  {name:'IG系列工业通信网关',model:'IG系列',desc:'100+工业协议转换，OPC UA/MQTT，边缘缓存与断网续传。',specs:['100+协议转换','OPC UA/MQTT','边缘缓存+断网续传','阿里云/华为云/AWS']},
]},
],
};

function prodPage(cat, item, pp, c) {
  const body=`${nav(pp,c,'/products')}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<a href="/products" class="text-primary-200 hover:text-white text-sm no-underline">← 返回产品中心</a>
<h1 class="text-2xl md:text-3xl font-bold mt-4">${h(item.name)}</h1>
${item.model?'<p class="text-primary-200 mt-1">型号：'+h(item.model)+'</p>':''}
</div></div>
<section class="py-12 bg-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid md:grid-cols-3 gap-8">
<div class="md:col-span-2">
<h2 class="text-xl font-bold mb-4">产品概述</h2>
<p class="text-gray-600 leading-relaxed">${h(item.desc)}</p>
</div>
<div class="bg-gray-50 rounded-xl p-6">
<h3 class="font-semibold mb-3">产品分类</h3>
<span class="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">${h(cat)}</span>
</div></div>
${item.specs&&item.specs.length?`<div class="mt-12">
<h2 class="text-xl font-bold mb-6">技术规格</h2>
<div class="grid md:grid-cols-2 gap-4">
${item.specs.map(s=>`<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><span class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span><span class="text-sm text-gray-700">${h(s)}</span></div>`).join('')}
</div></div>`:''}
<div class="mt-12 text-center">
<a href="/contact" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors no-underline">📞 咨询该产品</a>
</div>
</div></section>
${ft(c)}`;
  return layout(item.name+' - '+c.siteName,item.desc||'',body,c);
}

function genHomepage(c,pp,sls,cases,features,cName,cnf){
  const body=`${nav(pp,cnf,'/')}
<div class="bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
<div class="max-w-3xl"><h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">${h(cnf.siteName)}</h1>
<p class="text-lg md:text-xl text-primary-100 leading-relaxed mb-8">${h(cnf.desc)}</p>
<div class="flex gap-4"><a href="/products" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">查看产品 →</a>
<a href="/contact" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors no-underline">联系我们</a></div></div></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">核心业务</h2><p class="text-lg text-gray-500 mt-2">专注工业物联网与电气安全领域</p></div>
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">${(features.length?features:['工业PLC控制','电气安全监测','智能防雷系统','工业物联网平台']).map(f=>`<div class="p-6 bg-gray-50 rounded-xl text-center hover:shadow-md transition-shadow"><div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4"><span class="text-primary-600 text-xl">◆</span></div><h3 class="font-semibold">${h(f)}</h3></div>`).join('')}</div></div></section>
<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">产品系列</h2><p class="text-lg text-gray-500 mt-2">自主研发、工业级品质</p></div>
<div class="grid md:grid-cols-3 gap-6">${Object.entries(ALL_PRODUCTS).filter(([k])=>k===cName||(cName==='yeslon')).flatMap(([,cats])=>cats).map(cat=>`<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onclick="location.href='/products'"><span class="text-3xl">${cat.icon}</span><h3 class="font-semibold mt-3 mb-2">${h(cat.cat)}</h3><p class="text-sm text-gray-500">${cat.items.length}款产品</p></div>`).join('')}</div></div></section>
${sls.length?`<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">解决方案</h2></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${sls.slice(0,6).map(s=>`<div class="bg-gray-50 rounded-xl p-6"><h3 class="font-semibold mb-2">${h(s.title)}</h3>${s.description?'<p class="text-sm text-gray-500 leading-relaxed">'+h(s.description.slice(0,150))+'</p>':''}</div>`).join('')}</div></div></section>`:''}
${cases.length?`<section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold">成功案例</h2></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${cases.slice(0,3).map(c=>`<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"><h3 class="font-semibold mb-2">${h(c.title)}</h3>${c.description?'<p class="text-sm text-gray-500">'+h(c.description.slice(0,120))+'</p>':''}${c.client?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">'+h(c.client)+'</span>':''}</div>`).join('')}</div></div></section>`:''}
<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-3xl font-bold mb-3">需要详细方案？</h2><p class="text-primary-100 text-lg mb-8">联系我们获取产品资料、技术方案与报价</p><a href="mailto:${h(cnf.email)}" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">✉️ 立即咨询</a></div></section>
${ft(cnf)}`;
  return layout('首页 - '+cnf.siteName,cnf.desc,body,cnf);
}

function prodsPage(pp,c,cName){
  const cats=ALL_PRODUCTS[cName]||ALL_PRODUCTS.yeslon;
  const body=`${nav(pp,c,'/products')}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"><h1 class="text-3xl md:text-4xl font-bold mb-3">产品中心</h1><p class="text-primary-100 text-lg">${h(c.siteName)} 全系列产品</p></div></div>
${cats.map(cat=>`<section class="py-12 ${cat===cats[0]?'bg-white':'bg-gray-50'}"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center gap-3 mb-8"><span class="text-3xl">${cat.icon}</span><h2 class="text-2xl font-bold">${h(cat.cat)}</h2><span class="text-sm text-gray-400">（${cat.items.length}款）</span></div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
${cat.items.map(item=>`<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
<h3 class="font-semibold text-gray-900">${h(item.name)}</h3>${item.model?'<p class="text-xs text-gray-400 mt-1">型号：'+h(item.model)+'</p>':''}
<p class="text-sm text-gray-500 mt-2 leading-relaxed">${h((item.desc||'').slice(0,120))}</p>
<a href="/products/${slug(item.name)}" class="inline-block mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium no-underline">查看详情 →</a>
</div>`).join('')}
</div></div></section>`).join('')}
${ft(c)}`;
  return layout('产品中心 - '+c.siteName,c.siteName+'全系列产品',body,c);
}

function slug(s){return s.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g,'-').replace(/^-|-$/g,'')||'product';}
function listPage(t,pp,c,items,path){
  const body=`${nav(pp,c,'/'+path)}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">${h(t)}</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${items.length?`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${items.slice(0,12).map(item=>`<div class="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
<h3 class="font-semibold mb-2">${h(item.title||item.name)}</h3>${item.description?'<p class="text-sm text-gray-500 leading-relaxed">'+h(item.description.slice(0,150))+'</p>':''}
${item.client?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-gray-100 rounded-full">'+h(item.client)+'</span>':''}
${item.category?'<span class="inline-block mt-3 text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full ml-1">'+h(item.category)+'</span>':''}
</div>`).join('')}</div>`:'<p class="text-gray-400 text-center py-8">内容更新中</p>'}
</div></section>${ft(c)}`;
  return layout(t+' - '+c.siteName,'',body,c);
}
function aboutPage(pp,c){
  const body=`${nav(pp,c,'/about')}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">关于我们</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-3xl mx-auto"><p class="text-lg text-gray-600 leading-relaxed mb-8">${h(c.desc)}</p>
<div class="bg-gray-50 rounded-xl p-8"><h3 class="text-xl font-semibold mb-4">联系方式</h3><div class="space-y-3 text-gray-600"><p>📞 ${h(c.phone)}</p><p>✉️ ${h(c.email)}</p><p>📍 ${h(c.address)}</p></div></div></div></div></section>${ft(c)}`;
  return layout('关于我们 - '+c.siteName,'',body,c);
}
function contactPage(pp,c){
  const body=`${nav(pp,c,'/contact')}
<div class="bg-gradient-to-r from-primary-700 to-primary-900 text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 class="text-3xl font-bold">联系我们</h1></div></div>
<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-2xl mx-auto">
<div class="space-y-4">${[
  ['📞','电话',c.phone],
  ['✉️','邮箱','<a href="mailto:'+h(c.email)+'" class="text-primary-600 no-underline hover:underline">'+h(c.email)+'</a>'],
  ['📍','地址',c.address],
].map(a=>`<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"><span class="text-2xl">${a[0]}</span><div><p class="text-sm text-gray-500">${a[1]}</p><p class="font-semibold text-gray-900">${a[2]}</p></div></div>`).join('')}</div>
</div></div></section>${ft(c)}`;
  return layout('联系我们 - '+c.siteName,'',body,c);
}

// ═══════════ BUILD ═══════════
const defs=[{name:'yeslon',main:true},{name:'energy'},{name:'electrical-safety'},{name:'lightning-protection'},{name:'industrial-plc'}];
console.log('Building...\n');
if(!existsSync(DIST))mkdirSync(DIST,{recursive:true});

for(const d of defs){
  const c=cfg(d.name);const pp=pg(d.name);
  const sls=(()=>{try{return grepItems(join(root,'sites',d.name,'data','solutions.ts'),['title','description','category']);}catch{return[];}})();
  const cs=(()=>{try{return grepItems(join(root,'sites',d.name,'data','cases.ts'),['title','description','client']);}catch{return[];}})();
  const nws=(()=>{try{return grepItems(join(root,'sites',d.name,'data','news.ts'),['title','description','category']);}catch{return[];}})();
  const out=d.main?DIST:join(DIST,d.name);
  if(!existsSync(out))mkdirSync(out,{recursive:true});
  const bu=d.main?c.domain:(c.subdomain?c.subdomain+'.'+c.domain:c.domain);
  const surls=pp.map(p=>'<url><loc>https://'+bu+'/'+p.path+'</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>');
  writeFileSync(join(out,'sitemap.xml'),'<?xml version="1.0"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+surls.join('\n')+'\n</urlset>');
  writeFileSync(join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://'+bu+'/sitemap.xml\nCrawl-delay: 1');

  for(const p of pp){
    const pt=p.path; let html;
    if(!pt)html=genHomepage(d.name,pp,sls,cs,c.features,d.name,c);
    else if(pt==='about')html=aboutPage(pp,c);
    else if(pt==='contact')html=contactPage(pp,c);
    else if(pt==='products')html=prodsPage(pp,c,d.name);
    else if(pt==='solutions')html=listPage(p.title,pp,c,sls,pt);
    else if(pt==='cases')html=listPage(p.title,pp,c,cs,pt);
    else if(pt==='news')html=listPage(p.title,pp,c,nws.length?nws:cs,pt);
    else html=listPage(p.title,pp,c,[],pt);
    const dir=pt?join(out,pt):out;
    if(!existsSync(dir))mkdirSync(dir,{recursive:true});
    writeFileSync(join(dir,'index.html'),html);
  }

  // Generate detailed per-product pages
  const cats=ALL_PRODUCTS[d.name]||ALL_PRODUCTS.yeslon;
  for(const cat of cats){
    for(const item of cat.items){
      const s=slug(item.name);
      const dir=join(out,'products',s);
      if(!existsSync(dir))mkdirSync(dir,{recursive:true});
      writeFileSync(join(dir,'index.html'),prodPage(cat.cat,item,pp,c));
    }
  }
  console.log(`  ${d.name}${d.main?' (main)':''} → ${pp.length} pages + product details`);
}

for(const f of['_redirects','_headers','_routes.json']){const s=join(root,f);if(existsSync(s))copyFileSync(s,join(DIST,f));}
console.log('\n✅ Complete');
