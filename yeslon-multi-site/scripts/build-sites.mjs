import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, posix } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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
    colorDark: re(c,/secondaryColor:\s*'([^']+)'/,1)||'',
    kw: (()=>{try{const m=readFileSync(c,'utf-8').match(/keywords:\s*\[([^\]]+)\]/);return m?[...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]).join(', '):'';}catch{return '';}})(),
    group: (()=>{try{const m=readFileSync(c,'utf-8').match(/companyGroup:\s*\[([\s\S]*?)\]/);return m?[...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]):[];}catch{return[];}})(),
  };
}
function pages(site) {
  const fp=join(root,'sites',site,'data','pages.ts');
  try{
    const c=readFileSync(fp,'utf-8');
    const p=[];
    for(const block of c.match(/\{[^{}]+\}/g)||[]){
      const pathM=block.match(/path:\s*'([^']*)'/);
      const titleM=block.match(/title:\s*'([^']+)'/);
      const descM=block.match(/description:\s*'([^']+)'/);
      const kwM=block.match(/keywords:\s*\[([^\]]+)\]/);
      if(titleM)p.push({
        path:pathM?pathM[1]:'',
        title:titleM[1],
        desc:descM?descM[1]:'',
        kw:kwM?[...kwM[1].matchAll(/'([^']+)'/g)].map(x=>x[1]).join(', '):''
      });
    }
    return p.length?p:[{path:'',title:'首页'}];
  }catch{return[{path:'',title:'首页'}];}
}

const CANONICAL_HOST = 'www.yeslon.com';
const BUILD_ID = Date.now().toString(36);
function twLink(){return`<link href="/tailwind.css?v=${BUILD_ID}" rel="stylesheet">`;}
function canonicalUrl(pfx, path=''){const base=`https://${CANONICAL_HOST}${pfx||''}`;return path?`${base}/${path}`:`${base}/`;}
const GEO_BANNER=`<div id="geo-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:999;background:#0f172a;color:#e2e8f0;padding:12px 20px;align-items:center;justify-content:center;gap:16px;font-size:13px;border-top:2px solid #1d4ed8">
  <span>检测到您可能位于中国，建议使用中文站点浏览。</span>
  <a href="javascript:void(0)" onclick="document.getElementById('geo-banner').style.display='none';document.cookie='region=CN;path=/;max-age=2592000'" style="padding:4px 14px;background:#1d4ed8;color:white;text-decoration:none;font-weight:500;font-size:12px">确认</a>
  <a href="javascript:void(0)" onclick="document.getElementById('geo-banner').style.display='none'" style="color:#94a3b8;font-size:12px;text-decoration:none">关闭</a>
</div>`;
const GEO_SCRIPT=`<script>(function(){function runGeo(){var saved=document.cookie.match(/(?:^| )region=([^;]*)/);var reg=saved?decodeURIComponent(saved[1]):"";if(reg==="CN")return;var ctrl=new AbortController();var t=setTimeout(function(){ctrl.abort()},5000);fetch("https://ipapi.co/json/",{signal:ctrl.signal}).then(function(r){return r.json()}).then(function(d){if(d&&d.country_code==="CN"){document.cookie="region=CN;path=/;max-age=2592000";var lang=(navigator.language||"").toLowerCase();if(lang.indexOf("zh")===-1){var b=document.getElementById("geo-banner");if(b)b.style.display="flex"}}}).catch(function(){var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}if(/Asia\\/(Shanghai|Hong_Kong|Chongqing|Urumqi)/.test(tz)){var b=document.getElementById("geo-banner");if(b)b.style.display="flex"}}).finally(function(){clearTimeout(t)})}if(document.readyState==="complete"){if("requestIdleCallback"in window){requestIdleCallback(runGeo,{timeout:2000})}else{setTimeout(runGeo,0)}}else{window.addEventListener("load",function(){if("requestIdleCallback"in window){requestIdleCallback(runGeo,{timeout:2000})}else{setTimeout(runGeo,0)}})}})()</script>`;
function h(t){return(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
let GA_ID='',SC_VERIFY='',BAIDU_VERIFY='',OG_DEFAULT='/logo.png';
try{const m=await import('../site-config.js');GA_ID=m.SITE_CONFIG.GA_ID||'';SC_VERIFY=m.SITE_CONFIG.SC_VERIFY||'';BAIDU_VERIFY=m.SITE_CONFIG.BAIDU_VERIFY||'';OG_DEFAULT=m.SITE_CONFIG.OG_IMAGE||'/logo.png';}catch(e){};
function lay(t,d,b,c){const u=arguments[4]||canonicalUrl(c.pfx||'');const ogPath=arguments[5]||OG_DEFAULT;const i=ogPath.startsWith('http')?ogPath:`https://${CANONICAL_HOST}${ogPath}`;const pageKw=arguments[6]||'';const kw=pageKw||c.kw||'微物联,工业物联网,电气安全,智能防雷,PLC';const sn=c.sn||'yeslon';return'<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>'+h(t)+'</title>\n<meta name="description" content="'+h(d||c.desc||'')+'">\n<meta name="keywords" content="'+h(kw)+'">\n<link rel="icon" type="image/svg+xml" href="/y-logo.svg"><link rel="canonical" href="'+h(u)+'">\n<meta name="robots" content="index,follow">\n<meta property="og:type" content="website">\n<meta property="og:title" content="'+h(t)+'">\n<meta property="og:description" content="'+h(d||c.desc||'')+'">\n<meta property="og:image" content="'+h(i)+'">\n<meta property="og:url" content="'+h(u)+'">\n<meta property="og:site_name" content="'+h(c.name||'')+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="'+h(t)+'">\n<meta name="twitter:description" content="'+h(d||c.desc||'')+'">\n<meta name="twitter:image" content="'+h(i)+'">\n'+(SC_VERIFY?'<meta name="google-site-verification" content="'+h(SC_VERIFY)+'">\n':'')+(BAIDU_VERIFY?'<meta name="baidu-site-verification" content="'+h(BAIDU_VERIFY)+'">\n':'')+'<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"'+h(c.name||'')+'","url":"https://'+CANONICAL_HOST+'","description":"'+h(c.desc||'')+'","contactPoint":{"@type":"ContactPoint","telephone":"'+h(c.phone||'')+'","contactType":"customer service"}}</script>\n'+(GA_ID?'<script async src="https://www.googletagmanager.com/gtag/js?id='+h(GA_ID)+'"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config","'+h(GA_ID)+'");</script>\n':'')+twLink()+UI_STYLES+themeCss(sn,c)+'\n</head>\n<body class="bg-slate-50 text-slate-900 font-sans antialiased">\n'+GEO_BANNER+'\n'+A+'\n'+b+GEO_SCRIPT+'\n</body>\n</html>';}
const A=`<div id="progress" style="position:fixed;top:0;left:0;height:2px;width:0%;z-index:999;background:linear-gradient(90deg,#2563eb,#60a5fa);transition:width 0.05s linear"></div>
<div id="search-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);backdrop-filter:blur(8px)" onclick="if(event.target===this)closeSearch()">
  <div style="max-width:640px;margin:80px auto 0;padding:0 20px">
    <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <div style="display:flex;align-items:center;padding:4px;border-bottom:1px solid #e2e8f0">
        <span style="padding:0 12px;color:#94a3b8;font-size:18px">🔍</span>
        <input id="search-input" type="text" placeholder="搜索产品、解决方案、案例..." style="flex:1;border:none;outline:none;padding:14px 4px;font-size:15px;background:transparent" oninput="doSearch(this.value)">
        <button style="padding:8px 16px;border:none;background:transparent;color:#94a3b8;font-size:18px;cursor:pointer" onclick="closeSearch()">✕</button>
      </div>
      <div id="search-results" style="max-height:60vh;overflow-y:auto;padding:8px"></div>
      <div id="search-empty" style="text-align:center;padding:40px 20px;color:#94a3b8;font-size:14px">输入关键词搜索产品、解决方案、案例</div>
    </div>
  </div>
</div>
<script>
var SI=[];fetch("/search-index.json").then(function(r){return r.json()}).then(function(d){SI=d}).catch(function(){});
function openSearch(){document.getElementById("search-overlay").style.display="block";document.getElementById("search-input").value="";document.getElementById("search-results").innerHTML="";document.getElementById("search-empty").style.display="block";setTimeout(function(){document.getElementById("search-input").focus()},100)}
function closeSearch(){document.getElementById("search-overlay").style.display="none"}
function doSearch(q){q=q.toLowerCase().trim();var r=document.getElementById("search-results");var e=document.getElementById("search-empty");if(!q||!SI.length){r.innerHTML="";e.style.display="block";return}
var hits=[];for(var i=0;i<SI.length;i++){var s=SI[i];if(s.t.toLowerCase().includes(q)||(s.d&&s.d.toLowerCase().includes(q))||(s.k&&s.k.toLowerCase().includes(q))){hits.push(s)}}
if(hits.length===0){r.innerHTML='<div style="text-align:center;padding:40px 20px;color:#94a3b8;font-size:14px">未找到与 "<b style=color:#64748b>'+q+'</b>" 相关的内容</div>';e.style.display="none";return}
e.style.display="none";var c=hits.length>50?50:hits.length;
var h='<div style="padding:8px 12px;font-size:12px;color:#94a3b8">找到 '+hits.length+' 个结果（显示前 '+c+' 个）</div>';
for(var i=0;i<c;i++){var s=hits[i];
  h+='<a href="'+s.u+'" style="display:block;padding:12px 14px;border-radius:10px;text-decoration:none;color:inherit"><div style="font-size:14px;font-weight:600;color:#1e293b">'+(s.t||"")+'</div><div style="font-size:12px;color:#64748b;margin-top:2px">'+(s.d?s.d.substring(0,100):"")+'</div><div style="font-size:11px;color:#94a3b8;margin-top:4px"><span style=display:inline-block;padding:1px 6px;border-radius:3px;background:#f1f5f9;color:#64748b;font-size:10px>'+s.g+'</span> '+s.u+'</div></a>'}
r.innerHTML=h;}
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeSearch();if(e.ctrlKey&&e.key==="k"){e.preventDefault();openSearch()}});
</script>
`;
function slug(s){return s.replace(/[\/\s]+/g,'-').replace(/[()（）]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'')||'p';}

const SITE_THEMES={
  yeslon:{kicker:'YESLON TECHNOLOGIES',tagline:'工业物联网 · 电气安全 · 智能防雷',primary:'#1d4ed8',primaryDark:'#1e3a8a',accent:'#3b82f6',heroFrom:'#0f172a',heroMid:'#1e293b',heroTo:'#1e3a5f',glow:'rgba(59,130,246,.15)'},
  energy:{kicker:'EV CHARGING SAFETY',tagline:'充电站 · 储能 · 充电棚电气安全',primary:'#dc2626',primaryDark:'#991b1b',accent:'#f87171',heroFrom:'#1a0505',heroMid:'#450a0a',heroTo:'#7f1d1d',glow:'rgba(248,113,113,.12)',
    title:'新能源充电电气安全监测',subtitle:'面向充电站、储能电站与电动自行车充电棚的谐波分析、漏电与电弧在线监测体系。',
    stats:[{v:'30天',l:'隐患预警'},{v:'256点',l:'谐波采样'},{v:'μA级',l:'漏电分辨率'}],
    links:[{t:'充电站方案',u:'/ev-charging'},{t:'储能安全',u:'/energy-storage'},{t:'产品目录',u:'/products'}]},
  'electrical-safety':{kicker:'ELECTRICAL SAFETY',tagline:'ESA · ESB · EST 全系列监测',primary:'#d97706',primaryDark:'#92400e',accent:'#fbbf24',heroFrom:'#1c1410',heroMid:'#451a03',heroTo:'#78350f',glow:'rgba(251,191,36,.1)',
    title:'电气安全智能监测系统',subtitle:'全要素电表、三相不平衡与无线测温协同，构建配电隐患感知与分级告警能力。',
    stats:[{v:'0.5S',l:'电能计量'},{v:'63次',l:'谐波分析'},{v:'±0.5℃',l:'测温精度'}],
    links:[{t:'ESA 智能电表',u:'/products/esa'},{t:'技术规格',u:'/specifications'},{t:'全部产品',u:'/products'}]},
  'lightning-protection':{kicker:'LIGHTNING PROTECTION',tagline:'SPD · 雷电流 · 接地电阻监测',primary:'#2563eb',primaryDark:'#1d4ed8',accent:'#60a5fa',heroFrom:'#0a0f1f',heroMid:'#172554',heroTo:'#1e3a8a',glow:'rgba(96,165,250,.12)',
    title:'智能防雷在线监测系统',subtitle:'电涌保护器状态、雷电流峰值与接地电阻连续监测，支撑防雷设施运维与合规管理。',
    stats:[{v:'μA级',l:'SPD漏电流'},{v:'0.1kA',l:'雷电流分辨'},{v:'0.01Ω',l:'接地测量'}],
    links:[{t:'FS 监测模块',u:'/products/fs-series'},{t:'方案总览',u:'/solutions'},{t:'产品中心',u:'/products'}]},
  'industrial-plc':{kicker:'INDUSTRIAL PLC',tagline:'CC/CR/X · IEC 61131-3 · 边缘网关',primary:'#059669',primaryDark:'#047857',accent:'#34d399',heroFrom:'#021a14',heroMid:'#064e3b',heroTo:'#065f46',glow:'rgba(52,211,153,.1)',
    title:'工业分布式可编程控制系统',subtitle:'模块化 PLC、远程 I/O 与边缘网关，满足产线控制、运动控制与过程自动化需求。',
    stats:[{v:'5种',l:'IEC编程语言'},{v:'-25~70℃',l:'工业宽温'},{v:'多协议',l:'EtherCAT/PN'}],
    links:[{t:'CC 系列 PLC',u:'/products/cc-series'},{t:'CR 工业分站',u:'/products/cr-series'},{t:'产品目录',u:'/products'}]},
};
function getTheme(sn,c){
  const t=SITE_THEMES[sn]||SITE_THEMES.yeslon;
  return {...t,primary:c.color||t.primary,primaryDark:c.colorDark||t.primaryDark};
}
function themeCss(sn,c){
  const t=getTheme(sn,c);
  return `<style>:root{--brand-50:#f8fafc;--brand-600:${t.accent};--brand-700:${t.primary};--brand-800:${t.primaryDark};--brand-900:${t.heroFrom};--hero-from:${t.heroFrom};--hero-mid:${t.heroMid};--hero-to:${t.heroTo};--hero-glow:${t.glow}}
.bg-primary-700,.btn-brand{background-color:var(--brand-700)!important}
.hover\\:bg-primary-800:hover,.btn-brand:hover{background-color:var(--brand-800)!important}
.hover\\:bg-primary-600:hover{background-color:var(--brand-600)!important}
.text-primary-700,.text-primary-800,.text-brand{color:var(--brand-700)!important}
.hover\\:text-primary-800:hover,.hover\\:text-primary-900:hover{color:var(--brand-800)!important}
.border-primary-600,.border-primary-700,.border-brand{border-color:var(--brand-700)!important}
.border-l-primary-700,.border-l-brand{border-left-color:var(--brand-700)!important}
.border-t-primary-700,.border-t-brand{border-top-color:var(--brand-700)!important}
.bg-primary-50{background-color:color-mix(in srgb,var(--brand-700) 8%,white)!important}
.mark-themed{border-color:color-mix(in srgb,var(--brand-700) 35%,#e2e8f0);color:var(--brand-800)}
.card-themed:hover{border-color:color-mix(in srgb,var(--brand-700) 45%,#94a3b8)}
.site-hero{background:linear-gradient(135deg,var(--hero-from) 0%,var(--hero-mid) 48%,var(--hero-to) 100%);position:relative;overflow:hidden}
.site-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 70% 40%,var(--hero-glow),transparent 70%);pointer-events:none}
.site-hero-grid{position:absolute;inset:0;opacity:.06;background-image:linear-gradient(var(--brand-600) 1px,transparent 1px),linear-gradient(90deg,var(--brand-600) 1px,transparent 1px);background-size:40px 40px}
.page-hero{background:linear-gradient(180deg,var(--hero-mid) 0%,var(--hero-from) 100%);border-bottom:3px solid var(--brand-700)}
.hero-main{background:linear-gradient(135deg,var(--hero-from) 0%,var(--hero-mid) 55%,var(--hero-to) 100%)}
.stat-pill{border:1px solid color-mix(in srgb,var(--brand-600) 40%,transparent);background:color-mix(in srgb,var(--brand-700) 12%,transparent)}
</style>`;
}
const HERO_SVG={
  energy:`<svg viewBox="0 0 400 320" class="w-full max-w-md ml-auto" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="200" width="320" height="8" fill="currentColor" opacity=".2"/><rect x="80" y="120" width="48" height="88" rx="4" stroke="currentColor" stroke-width="2" opacity=".9"/><rect x="88" y="128" width="32" height="20" rx="2" fill="currentColor" opacity=".3"/><path d="M104 88 L104 120 M92 100 L116 100" stroke="currentColor" stroke-width="2"/><rect x="176" y="100" width="56" height="108" rx="4" stroke="currentColor" stroke-width="2"/><path d="M204 60 L204 100" stroke="currentColor" stroke-width="2"/><circle cx="204" cy="52" r="8" stroke="currentColor" stroke-width="2"/><rect x="280" y="140" width="64" height="68" rx="4" stroke="currentColor" stroke-width="2" opacity=".7"/><path d="M128 164 H176 M232 164 H280" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" opacity=".5"/><path d="M60 208 Q200 180 340 208" stroke="currentColor" stroke-width="1" opacity=".25"/></svg>`,
  'electrical-safety':`<svg viewBox="0 0 400 320" class="w-full max-w-md ml-auto" fill="none"><rect x="60" y="60" width="280" height="200" rx="6" stroke="currentColor" stroke-width="2" opacity=".85"/><rect x="80" y="85" width="70" height="45" rx="2" stroke="currentColor" stroke-width="1.5"/><text x="95" y="115" fill="currentColor" font-size="14" font-family="monospace" opacity=".8">ESA</text><rect x="165" y="85" width="70" height="45" rx="2" stroke="currentColor" stroke-width="1.5"/><text x="178" y="115" fill="currentColor" font-size="14" font-family="monospace" opacity=".8">ESB</text><rect x="250" y="85" width="70" height="45" rx="2" stroke="currentColor" stroke-width="1.5"/><text x="263" y="115" fill="currentColor" font-size="14" font-family="monospace" opacity=".8">EST</text><path d="M80 160 H300" stroke="currentColor" stroke-width="1" opacity=".3"/><path d="M90 200 Q130 170 170 200 T250 200 T310 200" stroke="currentColor" stroke-width="2" opacity=".6"/><line x1="90" y1="230" x2="310" y2="230" stroke="currentColor" stroke-width="1" opacity=".2"/><line x1="90" y1="245" x2="260" y2="245" stroke="currentColor" stroke-width="1" opacity=".15"/></svg>`,
  'lightning-protection':`<svg viewBox="0 0 400 320" class="w-full max-w-md ml-auto" fill="none"><path d="M200 40 L120 160 H180 L160 280 L280 140 H220 L200 40Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity=".08"/><circle cx="200" cy="40" r="24" stroke="currentColor" stroke-width="1.5" opacity=".4"/><path d="M100 260 H300" stroke="currentColor" stroke-width="2" opacity=".3"/><rect x="130" y="240" width="40" height="30" rx="2" stroke="currentColor" stroke-width="1.5"/><text x="138" y="260" fill="currentColor" font-size="10" font-family="monospace">FS</text><rect x="190" y="240" width="40" height="30" rx="2" stroke="currentColor" stroke-width="1.5"/><text x="196" y="260" fill="currentColor" font-size="10" font-family="monospace">FL</text><rect x="250" y="240" width="40" height="30" rx="2" stroke="currentColor" stroke-width="1.5"/><text x="256" y="260" fill="currentColor" font-size="10" font-family="monospace">FR</text><path d="M150 240 V200 M210 240 V180 M270 240 V190" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity=".4"/></svg>`,
  'industrial-plc':`<svg viewBox="0 0 400 320" class="w-full max-w-md ml-auto" fill="none"><rect x="50" y="80" width="90" height="160" rx="4" stroke="currentColor" stroke-width="2"/><text x="68" y="110" fill="currentColor" font-size="11" font-family="monospace">CC-PLC</text><rect x="60" y="125" width="18" height="10" fill="currentColor" opacity=".25"/><rect x="82" y="125" width="18" height="10" fill="currentColor" opacity=".25"/><rect x="104" y="125" width="18" height="10" fill="currentColor" opacity=".25"/><rect x="155" y="100" width="70" height="50" rx="3" stroke="currentColor" stroke-width="1.5"/><rect x="155" y="160" width="70" height="50" rx="3" stroke="currentColor" stroke-width="1.5"/><rect x="155" y="220" width="70" height="50" rx="3" stroke="currentColor" stroke-width="1.5"/><rect x="245" y="80" width="105" height="160" rx="4" stroke="currentColor" stroke-width="2" opacity=".75"/><text x="262" y="108" fill="currentColor" font-size="11" font-family="monospace">I/O RACK</text><path d="M140 160 H155 M225 125 H245 M225 185 H245 M225 245 H245" stroke="currentColor" stroke-width="1.5"/><circle cx="140" cy="160" r="4" fill="currentColor" opacity=".5"/></svg>`,
};
function verticalHero(sn,c,pfx){
  const t=getTheme(sn,c);
  const svg=HERO_SVG[sn]||'';
  const stats=(t.stats||[]).map(s=>`<div class="stat-pill px-4 py-3 text-center"><div class="text-xl font-bold text-white">${h(s.v)}</div><div class="text-[11px] text-slate-300 mt-1 tracking-wide">${h(s.l)}</div></div>`).join('');
  const links=(t.links||[]).map(l=>`<a href="${pfx}${l.u.startsWith('/')?l.u:'/'+l.u}" class="px-4 py-2.5 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 no-underline">${h(l.t)}</a>`).join('');
  return `<div class="site-hero text-white border-b-4 border-brand">
<div class="site-hero-grid"></div>
<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
<div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
<div>
<p class="text-[11px] font-semibold tracking-[0.2em] text-slate-400 mb-4">${h(t.kicker)}</p>
<h1 class="text-3xl md:text-[2.35rem] font-bold leading-tight mb-4">${h(t.title||c.name)}</h1>
<p class="text-sm md:text-base text-slate-300 leading-relaxed mb-8 max-w-xl">${h(t.subtitle||c.desc)}</p>
<div class="flex flex-wrap gap-3 mb-10">${links}<a href="${pfx}/contact" class="px-4 py-2.5 border border-slate-500 text-slate-200 text-sm no-underline hover:border-slate-300">技术咨询</a></div>
<div class="grid grid-cols-3 gap-3 max-w-lg">${stats}</div>
</div>
<div class="text-slate-300/90 hidden md:block" aria-hidden="true">${svg}</div>
</div></div></div>
<div class="bg-white border-b border-slate-200"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
<span class="font-medium text-slate-700">${h(c.name)}</span>
<span>微物联技术旗下产品线</span>
<a href="/" class="text-brand hover:underline no-underline">返回主站</a>
</div></div>`;
}
function mainHero(pfx,slides){
  return `<div class="hero-main text-white relative overflow-hidden" id="hero-carousel">
<div class="absolute inset-0 opacity-[0.04]" style="background-image:linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px);background-size:48px 48px"></div>
${slides.map((s,i)=>`<div class="hero-slide absolute inset-0 ${i===0?'opacity-100':'opacity-0 pointer-events-none'}" data-idx="${i}"></div>`).join('')}
<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
${slides.map((s,i)=>`<div class="slide-content max-w-3xl ${i===0?'block':'hidden'}" data-idx="${i}">
  <p class="text-xs font-medium text-slate-300 mb-4 tracking-wide">${h(s.tag)}</p>
  <h1 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">${s.t}</h1>
  <p class="text-sm md:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">${s.d}</p>
  <div class="flex flex-wrap gap-3">
    <a href="${s.url}" class="px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 no-underline">${s.btn}</a>
    <a href="${pfx}/contact" class="px-5 py-2.5 border border-slate-500 text-slate-200 text-sm font-medium hover:border-slate-300 no-underline">技术咨询</a>
  </div></div>`).join('')}
<div class="flex gap-2 mt-10">${slides.map((_,i)=>`<button class="hero-dot h-1 rounded-none ${i===0?'w-8 bg-white':'w-4 bg-slate-500'}" onclick="goSlide(${i})" aria-label="幻灯片 ${i+1}"></button>`).join('')}</div>
</div>
<script>
var ci=0,ti;
function goSlide(n){document.querySelectorAll('.hero-slide').forEach(function(e,i){e.classList.toggle('opacity-100',i===n);e.classList.toggle('opacity-0',i!==n);e.classList.toggle('pointer-events-none',i!==n)});document.querySelectorAll('.slide-content').forEach(function(e,i){e.classList.toggle('block',i===n);e.classList.toggle('hidden',i!==n)});document.querySelectorAll('.hero-dot').forEach(function(e,i){e.classList.toggle('bg-white',i===n);e.classList.toggle('w-8',i===n);e.classList.toggle('bg-slate-500',i!==n);e.classList.toggle('w-4',i!==n)});ci=n;clearInterval(ti);ti=setInterval(function(){ci=(ci+1)%${slides.length};goSlide(ci)},7000)}
ti=setInterval(function(){ci=(ci+1)%${slides.length};goSlide(ci)},7000);
</script>
</div>`;
}

const UI_STYLES=`<style>
.section-label{font-size:12px;font-weight:600;letter-spacing:.06em;color:#64748b}
.section-title{font-size:1.65rem;font-weight:700;color:#0f172a;line-height:1.3}
.mark{display:inline-flex;align-items:center;justify-content:center;min-width:2.5rem;height:2.5rem;padding:0 .5rem;background:#f8fafc;border:1px solid #e2e8f0;font-size:11px;font-weight:700;letter-spacing:.04em;color:#334155;font-family:ui-monospace,monospace}
.card-panel{background:#fff;border:1px solid #e2e8f0;border-radius:2px;transition:border-color .2s,box-shadow .2s}
.card-panel:hover{border-color:#94a3b8;box-shadow:0 1px 3px rgba(15,23,42,.06)}
.page-hero{background:linear-gradient(180deg,var(--hero-mid,#1e293b) 0%,var(--hero-from,#0f172a) 100%);border-bottom:3px solid var(--brand-700,#1d4ed8)}
.hero-main{background:linear-gradient(135deg,var(--hero-from,#0f172a) 0%,var(--hero-mid,#1e293b) 55%,var(--hero-to,#1e3a5f) 100%)}
.hero-slide{transition:opacity .5s ease}
.scroll-mt-20{scroll-margin-top:80px}
.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.line-clamp-4{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
</style>`;
function sectionHead(label,title,desc='',center=false){
  const align=center?'text-center mx-auto':'';
  return `<div class="mb-10 max-w-2xl ${align}"><p class="section-label mb-2">${h(label)}</p><h2 class="section-title mb-2">${h(title)}</h2>${desc?`<p class="text-slate-600 text-sm leading-relaxed">${h(desc)}</p>`:''}</div>`;
}
function pageHero(title,desc=''){
  return `<div class="page-hero text-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14"><h1 class="text-2xl md:text-3xl font-bold tracking-tight">${h(title)}</h1>${desc?`<p class="text-slate-300 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">${h(desc)}</p>`:''}</div></div>`;
}
function catCode(cat){
  const m=[['可编程','PLC'],['工业智控','EDGE'],['电气安全','ES'],['智能防雷','SPD'],['智能断路','CB'],['软件平台','SW'],['充电站','EV'],['储能','ESS'],['温度','EST'],['监测','MON']];
  for(const [k,v] of m){if((cat||'').includes(k))return v;}
  return (cat||'PD').replace(/[^A-Za-z\u4e00-\u9fa5]/g,'').slice(0,3).toUpperCase()||'PD';
}
function catMark(cat){return `<span class="mark">${catCode(cat)}</span>`;}
function contactRow(label,val,link){
  const v=link?`<a href="${link}" class="text-slate-900 hover:text-primary-700 no-underline">${h(val)}</a>`:h(val);
  return `<div class="flex gap-4 py-4 border-b border-slate-200 last:border-0"><dt class="w-16 shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wide pt-0.5">${h(label)}</dt><dd class="text-sm text-slate-800 font-medium">${v}</dd></div>`;
}
const SVG_SEARCH='<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>';

function nav(pp, c, cur, prefix='') {
  const pfx=prefix||'';
  const sn=c.sn||'yeslon';
  const t=getTheme(sn,c);
  const navItems = pp.filter(p=>p.path).map(p=>{
    const href = pfx+'/'+p.path;
    return `<a href="${href}" class="block px-3 py-2 text-sm font-medium transition-colors ${href===cur?'text-brand border-l-2 border-brand bg-slate-50':'text-slate-600 hover:text-slate-900 hover:bg-slate-50'} no-underline">${h(p.title)}</a>`;
  }).join('');
  const brandName=(c.name||'微物联').replace(/（.*?）/,'').replace(/\(.*?\)/,'').trim();
  const subTag=sn==='yeslon'?'工业物联网 · 电气安全 · 智能防雷':t.tagline;
  return `<nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex justify-between items-center h-14">
<a href="${pfx||'/'}" class="flex items-center gap-3 no-underline hover:no-underline min-w-0">
<img src="/y-logo.svg" alt="微物联" class="h-8 w-auto shrink-0">
<span class="min-w-0"><span class="block text-base font-bold text-slate-900 leading-tight truncate">${h(brandName)}</span><span class="block text-[11px] text-slate-500 tracking-wide hidden sm:block">${h(subTag)}</span></span></a>
<button id="menu-btn" class="md:hidden p-2 text-slate-500 hover:bg-slate-100" onclick="var m=document.getElementById('mobile-menu');m.classList.toggle('hidden')" aria-label="菜单"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<div class="hidden md:flex items-center gap-0.5">${pp.filter(p=>p.path).map(p=>{const href=pfx+'/'+p.path;return `<a href="${href}" class="px-3 py-2 text-sm font-medium transition-colors ${href===cur?'text-brand':'text-slate-600 hover:text-slate-900'} no-underline">${h(p.title)}</a>`;}).join('')}
<button class="px-2.5 py-2 text-slate-500 hover:text-slate-800" onclick="openSearch()" aria-label="搜索">${SVG_SEARCH}</button>
${sn!=='yeslon'?`<a href="/" class="px-3 py-2 text-sm text-slate-500 hover:text-slate-800 no-underline">主站</a>`:'<a href="http://www.fexlink.com" target="_blank" class="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 no-underline" rel="external">集团官网</a>'}
<a href="${pfx}/contact" class="ml-1 px-4 py-2 text-sm font-medium btn-brand text-white no-underline">联系我们</a>
</div></div>
<div id="mobile-menu" class="hidden md:hidden border-t border-slate-200 py-2">${navItems}
${sn!=='yeslon'?'<a href="/" class="block px-3 py-2 text-sm text-slate-600 no-underline">返回主站</a>':'<a href="http://www.fexlink.com" target="_blank" class="block px-3 py-2 text-sm text-slate-600 no-underline" rel="external">集团官网</a>'}
<a href="${pfx}/contact" class="block mx-3 mt-2 px-4 py-2 text-sm text-center text-white btn-brand no-underline">联系我们</a>
</div></div></nav>`;
}
function ft(pp, c, prefix=''){
  const pfx=prefix||'';
  const grp=c.group||[];
  const brandName=(c.name||'微物联').replace(/（.*?）/,'').trim();
  return `<footer class="bg-slate-900 text-slate-400 border-t-4 border-brand">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div class="grid md:grid-cols-3 gap-10">
<div><h4 class="text-white font-semibold mb-3 text-sm tracking-wide">${h(brandName)}</h4><p class="text-sm leading-relaxed text-slate-400 line-clamp-4">${h(c.desc)}</p></div>
<div><h4 class="text-white font-semibold mb-3 text-sm tracking-wide">联系方式</h4>
<dl class="text-sm space-y-1">
<div><dt class="inline text-slate-500">电话：</dt><dd class="inline text-slate-300">${h(c.phone)}</dd></div>
<div><dt class="inline text-slate-500">邮箱：</dt><dd class="inline"><a href="mailto:${h(c.email)}" class="text-slate-300 hover:text-white no-underline">${h(c.email)}</a></dd></div>
<div><dt class="inline text-slate-500">地址：</dt><dd class="inline text-slate-300">${h(c.addr)}</dd></div>
</dl></div>
<div><h4 class="text-white font-semibold mb-3 text-sm tracking-wide">快速链接</h4>
<div class="space-y-2 text-sm"><a href="${pfx}/products" class="block text-slate-400 hover:text-white no-underline">产品中心</a>${(pp||[]).some(p=>p.path==='solutions')?'<a href="'+pfx+'/solutions" class="block text-slate-400 hover:text-white no-underline">解决方案</a>':''}${(pp||[]).some(p=>p.path==='cases')?'<a href="'+pfx+'/cases" class="block text-slate-400 hover:text-white no-underline">成功案例</a>':''}${(pp||[]).some(p=>p.path==='about')?'<a href="'+pfx+'/about" class="block text-slate-400 hover:text-white no-underline">关于我们</a>':''}<a href="http://www.fexlink.com" target="_blank" class="block text-slate-400 hover:text-white no-underline" rel="external">fexlink.com</a></div></div>
</div>
${grp.length?`<div class="border-t border-slate-800 mt-8 pt-6"><p class="text-xs text-slate-500 mb-3">集团成员</p><div class="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">${grp.map(g=>'<span>'+h(g)+'</span>').join('')}</div></div>`:''}
<div class="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">© ${new Date().getFullYear()} ${h(c.name)} · <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-slate-300 no-underline" rel="nofollow">粤ICP备15018521号</a></div>
</div></footer>`;
}

// ═══════════ COMPLETE PRODUCT CATALOG ═══════════
const PROD = {
yeslon:[
{cat:'可编程控制器',ico:'🧠',items:[
  {n:'CC系列可编程控制器 (PLC)',m:'CC100/CCXXX',d:'工业级通用PLC控制器，支持IEC 61131-3编程标准，EtherCAT/PROFINET/Modbus TCP多协议通信，适用于复杂逻辑控制、运动控制与过程控制场景。',s:['IEC 61131-3 五种编程语言','EtherCAT/PROFINET/Modbus TCP','模块化I/O灵活扩展','-25℃~70℃工业宽温','CE/FCC认证']},
  {n:'CR系列工业分站',m:'CR系列',d:'分布式远程I/O站，支持EtherCAT总线组网，适用于产线分布式控制场景，实现远程设备高速数据采集与控制。',s:['EtherCAT总线通信','分布式远程I/O扩展','防护等级IP20','DIN导轨安装']},
]},
{cat:'工业智控',ico:'⚙️',items:[
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
  sub:'分布式可编程控制系统', content:'工业分布式可编程控制系统是微物联技术的核心产品线之一，基于CC、CR、X三大系列可编程控制器构建完整的工业控制解决方案。CC系列高性能PLC采用瑞芯微RK3588M车规级芯片，支持IEC 61131-3五种编程语言，单控制器可管理最多256个EtherCAT轴和64000个I/O点，适用于复杂逻辑控制与运动控制场景。CR系列分布式PLC支持EtherCAT总线组网，适合产线分布式控制，大幅降低传统集中式架构60%的布线成本。X系列微型PLC以卡片式超薄设计实现设备级控制与I/O灵活扩展。配合DB系列"设备大脑"边缘AI控制器和IG系列工业网关，形成从底层控制到边缘计算再到云平台协同的完整闭环。该系统已广泛应用于新能源汽车电池模组PACK产线、半导体封测设备、食品饮料灌装线、超高层建筑楼宇自控等场景，帮助客户实现设备综合效率OEE提升22%、产线节拍提升35%、综合能耗降低26%。', stats:[
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
  sub:'新能源充电站电气安全数字化保障方案', content:'新能源充电站的电气安全问题是制约充电运营高质量发展的关键瓶颈。充电桩在运行过程中会产生大量谐波污染，同时充电枪插拔频繁导致接插件磨损、端子发热、绝缘下降等隐患，传统保护方式往往在故障发生后才被动响应。微物联技术提供的充电站电气安全数字化保障方案，通过在充电桩配电回路部署ESA全要素智能电表、ESB三相不平衡监测器、EST无线温度传感器和FA故障电弧探测器，实现充电回路全参数7×24小时实时监测。核心技术创新在于谐波指纹AI分析技术——以256点/周期精细采样为基础，结合深度学习模型识别不同充电桩类型的谐波特征，97.3%的电弧识别准确率和提前30天的隐患预警窗口，将充电站安全管理从"被动报警"升级为"主动预防"。系统通过ESX智能网关汇聚数据上云，FEXLINK平台提供PC看板与移动APP告警推送，支持多站点集中管理与远程运维。该方案已服务于多个大型集中式充电站、公交场站充电桩及电动自行车充电棚项目，客户电气火灾事故降低90%、运维人力成本降低60%。', stats:[
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
  sub:'电气安全隐患监测与AI分析系统', content:'电气安全隐患是引发电气火灾的主要原因，传统电气火灾监控系统仅基于剩余电流和温度阈值进行报警，无法识别电弧故障、绝缘老化、接触不良等早期隐蔽性隐患。微物联电气安全隐患监测与AI分析系统基于谐波指纹识别技术，通过ESA智能电表和FA故障电弧监测模块对线路电压电流进行256点/周期高频采样，提取不同故障类型的谐波特征图谱，由太一AI大模型体系中的千知引擎进行智能匹配与诊断。系统内置22个电气安全诊断模型和408项国家标准红线AI规则引擎，支持四级告警机制——正常、预警、告警、严重——从趋势偏移到紧急故障分级处置。故障电弧识别准确率达97.3%，较传统阈值法提升4倍，慢性绝缘退化隐患可提前30天识别。每个监测回路形成独立的健康评分与趋势档案，自动生成电气安全评估报告，为预防性维护提供数据依据。目前该技术已在阳茂高速、大连机场等多个项目中成功部署，累计预警电气隐患数十起，有效避免了潜在的电气火灾事故。', stats:[
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
  sub:'接地电阻在线监测系统', content:'接地电阻是衡量接地系统是否有效的核心指标。传统接地电阻测量依赖人工使用接地电阻测试仪定期巡检，测量周期长、效率低，恶劣天气下无法及时获取数据，且在雷击或故障发生后不能第一时间掌握接地状态变化。微物联接地电阻在线监测系统基于FR系列三极法监测仪和FRP系列钳表法监测仪，实现对接地电阻的7×24小时连续在线监测。FR系列采用电位降法测量原理，测量范围0.01Ω至200Ω，精度高、稳定性好，适用于新建接地系统的精准测量；FRP系列采用钳表法非接触测量，免辅助电极，特别适用于已建接地系统的快速普查和改造项目，并提供防爆型Ex ia IIC T4满足石化场景需求。所有监测数据通过FG智能网关统一汇聚至FEXLINK云平台，支持多测点同步采集、趋势变化智能分析、超限分级告警和雷击事件关联记录。系统已在变电站、通信基站、石化罐区、风电场及建筑防雷接地装置等场景广泛应用，帮助客户将巡检频率从月度降至按需，运维成本降低80%，接地故障响应时间缩短90%。', stats:[
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
  sub:'智能防雷系统解决方案', content:'雷电防护是工业设施和建筑安全的重要组成部分。传统防雷系统依赖电涌保护器SPD被动泄放雷电流，但SPD本身在运行过程中会因多次雷击冲击而逐渐劣化，当劣化发展到一定程度时保护功能丧失，可能引发电气火灾或设备损坏。微物联智能防雷系统解决方案基于FS/FSS/FSP电涌保护器监测仪、FL雷电峰值监测仪、FR/FRP接地电阻监测仪和FG智能网关，构建完整的防雷智能监测网络。FS系列监测仪可实时监测SPD漏电流至μA级别，精准判断SPD劣化趋势并预测剩余寿命；FL系列雷电峰值监测仪精确记录0.1kA至200kA雷电流峰值、极性及发生时间，GPS授时精度±1μs，支持多站联合雷击定位；FG智能网关搭载瑞芯微RK3588S边缘计算芯片，6 TOPS NPU算力可在本地运行SPD寿命预测模型。所有数据通过FEXLINK防雷云平台集中管理，形成从SPD状态监测到接地系统评估、从雷击事件记录到防雷综合报告的完整闭环。方案广泛应用于机场航站楼、石化炼化基地、海上风电场、地铁线路和数据中心等场景，帮助客户实现人工巡检减少90%、SPD失效前100%预警。', stats:[
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
  sub:'配电监测与能耗管理系统', content:'能源成本在企业运营支出中占比持续上升，而大多数企业对配电系统的运行状态缺乏精细化感知——配电回路电气参数不透明、能耗数据靠人工抄表、用电异常难以及时发现、节能优化缺少数据支撑。微物联配电监测与能耗管理系统以ESA全要素智能电表为核心感知设备，覆盖从进线到末端回路的全层级配电网络，实时采集电压、电流、功率、功率因数、谐波等20余项电气参数，0.5S级计量精度确保数据可靠。系统支持按回路、区域、设备类型三种维度进行分项能耗统计与分析，内置负荷预测、需量管理和太一AI能效优化模型，可自动识别高能耗环节和异常用能行为，并给出节能优化建议。特别值得一提的是"4×3×2"能碳自治治理框架——四个层级感知、三维数据分析、双向优化联动——将安全监测、能效管理和碳排追踪融合为统一平台，助力园区和企业实现能源精细化管理。该系统已在工业园区、商业综合体、数据中心、医院和政府机关等场景部署，帮助客户实现综合能耗降低15%至25%、电费支出减少20%、配电故障减少85%、投资回收期18至24个月。', stats:[
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
'busbar-monitoring-system': {
  sub:'母线智能监测管理系统（BusBMS）', content:'母线槽作为建筑供配电系统的关键组成部分，承担着从变压器到末端配电柜的电力传输功能。由于母线槽通常安装在封闭桥架或竖井内，传统巡检方式难以对其运行状态进行有效监测——温度异常在封闭空间中容易累积且不易及时发现，接触电阻增大导致的局部过热往往是电气火灾的前兆。微物联BusBMS母线智能监测管理系统采用物联网感知与AI预测技术相结合的方式，通过部署52个温度、电流及红外测温监测节点覆盖母线全回路，采集精度±0.3℃、数据刷新不超过30秒。系统核心优势在于基于LSTM神经网络的AI温度趋势预测模型，通过对历史负荷与温度数据的学习，可预测未来72小时母线温度变化趋势，94.7%的预测精度和提前48至72小时的预警窗口为运维人员提供了充足的检修时间。系统同时支持三维可视化数字孪生、四级智能告警与工单闭环、分回路能耗管理与碳足迹追踪等功能。该方案已经在政府办公楼、数据中心、商业综合体和医院等场景落地，实现电气事故降低85%、运维效率提升60%。', stats:[
    {v:'99.95%',l:'系统可用性'},{v:'52个',l:'在线监测节点'},{v:'94.7%',l:'AI预测精度'},{v:'48h',l:'隐患提前预警'},
  ],
  goals:[{ico:'🎯',t:'建设目标',d:'基于物联网感知+边缘计算+AI预测技术，构建母线槽全生命周期智能监测管理系统，实现母线温度、电流、绝缘状态的全天候在线监测与早期预警。'},{ico:'📈',t:'核心价值',d:'替代传统人工红外巡检方式，将母线安全从"定期巡检、事后抢修"转变为"实时感知、预测维护"，电气事故降低85%，运维效率提升60%。'},{ico:'🚀',t:'技术优势',d:'采用LoRa无线+RS485双模通信架构、LSTM神经网络AI预测模型（精度94.7%），支持三维可视化数字孪生，是国内少数具备"端-边-云"全栈能力的母线监测方案。'}],
  arch:[
    {ico:'🌡️',t:'感知层',d:'部署温度传感器（EST-A3）、电流传感器（EST-B2）、红外测温模块、光纤测温等52个监测节点，覆盖母线槽全回路。'},
    {ico:'📡',t:'通信层',d:'LoRa无线自组网 + RS485有线双模冗余通信，确保数据不中断。'},
    {ico:'🖥️',t:'边缘计算层',d:'边缘网关本地处理数据、断网缓存、毫秒级响应；支持本地告警与联动保护。'},
    {ico:'☁️',t:'云平台层',d:'BusBMS云平台：实时监测大屏、AI趋势预测（LSTM）、告警中心、能耗统计、碳足迹追踪。'},
  ],
  feats:[
    {ico:'🌡️',t:'实时温度在线监测',d:'覆盖母线槽接头、主干、分支全节点，测温精度±0.3℃，数据刷新≤30s，支持温度异常秒级告警。'},
    {ico:'⚡',t:'电流与负载监测',d:'穿心式CT高精度电流采集（0.1%精度），实时计算负载率，三相不平衡度智能分析。'},
    {ico:'🔮',t:'AI趋势预测（LSTM）',d:'基于LSTM神经网络的历史数据训练，预测未来72小时温度趋势，提前48~72小时发现隐患，MAE误差仅±0.8℃。'},
    {ico:'📊',t:'三维可视化数字孪生',d:'建筑三维立体视图，直观展示楼层母线布局与节点状态，点击节点查看实时数据，快速定位异常位置。'},
    {ico:'🔔',t:'智能告警与工单闭环',d:'四级告警机制（预警/警告/严重/紧急），多渠道推送（短信/微信/APP），自动生成维修工单，形成告警-工单-维修-闭环全流程。'},
    {ico:'💡',t:'能耗管理与碳足迹',d:'分楼层分回路能耗统计、同比环比分析、AI节能建议，自动核算碳排放并追踪减排效果。'},
  ],
  prods:['EST温度监测模组','ESA全要素智能电表','ESB三相不平衡监测器','FG智能防雷网关','FEXLINK工业互联网软件'],
  scenes:['政府办公楼母线槽温度与负载监测','数据中心精密配电柜温度在线监控','商业综合体母线安全运行管理','医院/学校关键配电回路监测','工业园区母线系统预测性维护'],
  benefits:['电气事故降低85%','运维效率提升60%','隐患平均提前48小时发现','能耗降低15-25%','投资回收期18-24个月'],
  problems:[{p:'母线温度靠人工红外巡检，周期长有盲区',s:'布设52个温度/电流感知节点，7×24h在线',a:'全覆盖实时监测'},{p:'故障发现滞后，往往起火才知道',s:'AI预测+四级告警，提前48h预警',a:'隐患提前发现'},{p:'能耗数据靠总表，无法分楼层统计',s:'回路级计量+分项能耗统计',a:'精细化能源管理'},{p:'设备台账混乱，维护记录缺失',s:'设备全生命周期管理+自动工单',a:'数字化运维管理'}],
  implementation:[{p:'Phase 1',t:'现场勘察设计',d:'2周·母线槽布线勘测+节点设计'},{p:'Phase 2',t:'设备安装部署',d:'3周·传感器+网关+通信调试'},{p:'Phase 3',t:'平台配置联调',d:'2周·云平台部署+AI模型训练'},{p:'Phase 4',t:'验收培训交付',d:'1周·系统联调+运维培训'}],
  standards:['GB 7251','GB 50054','GB 50116','GB/T 21431','IEC 60439'],
},
'industrial-park-smart-energy': {
  sub:'工业园区智慧能源与电气安全整体解决方案', content:'工业园区是能源消耗和电气安全风险高度集中的场景。园区内往往拥有多个配电室、数十台变压器、数百面配电柜和数千条用电回路，传统管理模式下电气参数不透明、隐患发现滞后、能耗统计靠人工、多站点管理分散等问题长期存在。微物联工业园区智慧能源与电气安全整体解决方案以"端-边-云"架构为底座，在园区各配电室和配电柜部署ESA智能电表、ESB三相不平衡监测器、ESF电气火灾测控器、EST温度传感器、FRP接地电阻监测仪等全系列终端，实现超过260个电气参数的实时采集。FG智能网关在边缘侧完成本地数据处理与告警判断，7寸嵌入式触控屏提供本地实时数据显示，即使网络中断也不影响本地安全逻辑。FEXLINK智慧园区云平台支持多站点集中管理、AI预警分析、告警-工单-维修闭环、能耗统计与碳追踪，以及APP移动端推送。特别设计的IP65户外防护和本地+远程双模管理机制，使系统兼具工业现场的可靠性和数字化管理的便捷性。该方案已在多个工业园区部署，实现电气事故降低85%、运维人力减少60%、综合能耗降低15%至25%。', stats:[
    {v:'200+',l:'服务企业客户'},{v:'30+',l:'园区项目经验'},{v:'260+',l:'监测参数/终端'},{v:'85%',l:'事故降低率'},
  ],
  goals:[{ico:'🎯',t:'建设目标',d:'面向工业园区场景，构建以"端-边-云"为架构的智慧能源与电气安全一体化管理平台，实现园区配电室、配电柜、用电回路的全维度电气参数实时监测、隐患预警与能效优化。'},{ico:'📈',t:'核心价值',d:'将园区配电管理从"分散巡检、事后抢修"升级为"集中监控、预测维护"，降低电气事故85%，减少运维人力60%，实现能源消耗精细化管理。'},{ico:'🚀',t:'技术优势',d:'融合ESA全要素智能电表、ESB三相不平衡监测、ESF电气火灾测控、FRP接地电阻监测、FG智能网关等全系列产品，支持IP65户外防护、本地+远程双模管理、边缘计算与断网缓存。'}],
  arch:[
    {ico:'🔌',t:'感知层',d:'部署ESA智能电表、ESF电气火灾测控器、ESB三相不平衡监测器、ESP零地电压监测仪、FRP接地电阻监测仪、EST温度传感器等终端设备，覆盖园区各配电室与配电柜。'},
    {ico:'📡',t:'通信层',d:'RS485总线组网+4G/NB-IoT无线上行，FG智能网关统一汇聚，Modbus RTU/TCP协议转换，支持断网续传与本地缓存。'},
    {ico:'🖥️',t:'边缘计算层',d:'FG-0121-E智能网关边缘计算，本地数据处理与告警判断，7寸嵌入式触控屏本地显示，声光报警器即时告警。'},
    {ico:'☁️',t:'云平台层',d:'FEXLINK智慧园区云平台：实时监测大屏、多站点集中管理、AI预警分析、告警-工单-维修闭环、能耗统计与碳追踪、APP移动端推送。'},
  ],
  feats:[
    {ico:'⚡',t:'全回路电气参数监测',d:'覆盖园区各级配电柜的电压、电流、功率、功率因数、谐波、温度、漏电流、零地电压、接地电阻等260+参数实时采集。'},
    {ico:'🔔',t:'多级智能告警联动',d:'零地电压超限、剩余电流越界、温度异常、接地电阻超标等多维度告警，本地声光报警+远程APP/短信推送，四级告警机制自动派工。'},
    {ico:'📊',t:'本地+远程双模管理',d:'7寸嵌入式触控屏本地实时显示数据与报警，FG网关4G/以太网上报云平台，支持PC Web端与移动APP远程监控。'},
    {ico:'📈',t:'AI能效分析与节能优化',d:'分回路/分区域能耗统计，同比环比分析，负载率与功率因数监测，AI节能建议，峰谷用电优化，助力园区降低运营成本。'},
    {ico:'🛡️',t:'电气安全全景防护',d:'漏电保护、绝缘监测、电弧故障检测、SPD状态监测、接地电阻在线监测、三相不平衡诊断、温度过热保护七位一体安全防护体系。'},
    {ico:'🌐',t:'多站点集中管理与扩展',d:'支持园区内多栋建筑、多个配电室统一接入，层级化设备管理，集团级数据看板，平滑扩展接入光伏/储能/充电桩等新能源系统。'},
  ],
  prods:['ESA全要素智能电表','ESB三相不平衡监测器','ESF电气火灾监测模组','EST温度监测模组','ESP零地电压监测器','FRP回路法接地电阻监测仪','FG智能防雷网关','FEXLINK工业互联网软件'],
  scenes:['工业园区配电室集中监测与运维管理','制造企业车间动力配电柜安全监控','园区公共建筑能耗分项计量与能效优化','园区光伏+储能+充电桩多能互补管理','化工/医药园区防爆区电气安全监测','园区物业配电系统远程运维'],
  benefits:['电气事故降低85%','运维人力减少60%','综合能耗降低15-25%','设备寿命延长20%','投资回收期18-24个月'],
  problems:[{p:'园区配电室分散，人工巡检效率低',s:'FG网关汇聚+云平台集中监控',a:'远程集中管理'},{p:'配电柜缺少实时电气参数监测',s:'ESA/ESF/ESP全系列终端部署',a:'全覆盖实时监测'},{p:'故障发现滞后，安全隐患大',s:'多级告警联动+AI预警分析',a:'隐患提前发现'},{p:'能耗数据靠总表，无法精细化管理',s:'回路级计量+分项能耗统计',a:'精细化能源管理'},{p:'设备台账混乱，维护无记录',s:'设备全生命周期+自动工单',a:'数字化运维管理'}],
  implementation:[{p:'Phase 1',t:'现场勘察设计',d:'2周·园区配电系统勘测+方案设计'},{p:'Phase 2',t:'设备部署安装',d:'4周·终端+网关+通信安装调试'},{p:'Phase 3',t:'平台联调上线',d:'3周·云平台部署+数据接入+联调'},{p:'Phase 4',t:'验收培训交付',d:'1周·系统验收+操作培训'}],
  standards:['GB 50054','GB 14287','GB 13955','GB 50116','GB 17167','GB/T 31960','IEC 61439'],
},
'hospital-electrical-safety': {
  sub:'医院电气安全智慧预警与透明监管体系', content:'医院是现代城市中供电可靠性要求最高的场所之一——手术室、ICU、血透中心、数据中心和冷链区域对供电连续性和电能质量有着极为严格的苛刻要求。0.1至3秒的电压暂降可能导致监护仪重启、呼吸机参数丢失、ECMO控制板异常等不可接受的临床后果。传统保障手段依靠双路电源、UPS和柴油发电机构成物理冗余，但这些设备的切换状态、电池健康度和绝缘趋势长期处于"黑箱"状态，真正风险往往不在停电那一刻，而在冗余设备切换失败的瞬间。微物联医院电气安全智慧预警方案以医用IT隔离电源绝缘趋势解算、UPS/ATS全生命周期管理、电能质量在线监测和边缘AI预警为核心能力，覆盖ICU、手术室、血透、冷链、数据中心和机器人充电区六大关键场景。方案采用太一智控三引擎架构——千知引擎负责50参数子模型与7维感知矩阵进行物理状态基线采集，万象引擎通过18级场景树与跨域规则将孤立告警连接为因果链并精准定位到楼层与回路，天衍引擎基于67个医疗专题AI模型对绝缘退化、温升异常、UPS电池SOH和电气火灾隐患给出预警窗口。系统采用端边云用四层架构，边缘网关在断网情况下仍能保障手术室和ICU的基础安全逻辑不中断，FEXLINK平台提供全院电力数字孪生驾驶舱，并支持三级联动透明监管——院内安全大脑、区域监管云、多角色协同。', stats:[
    {v:'0秒',l:'生命支持场景中断容忍边界'},{v:'4–12周',l:'慢性趋势预警窗口'},{v:'260+',l:'电气参数采集维度'},{v:'408',l:'合规条款库'},
  ],
  goals:[{ico:'🎯',t:'建设目标',d:'基于医用IT隔离电源、电能质量在线监测、μA/μs级物理感知、边缘AI与区域透明监管云，重构智慧医院的电力生命线，从"不断电"升级为"可感知、可预警、可处置"。'},{ico:'📈',t:'核心价值',d:'真正风险不在停电那一刻，而在停电前长期累积却没有被看见的电压暂降、谐波污染、绝缘劣化、接头温升、UPS电池衰减和备用切换逻辑黑箱。把"被动跳闸"升级为"主动预测"。'},{ico:'🚀',t:'技术优势',d:'太一智控三引擎（千知·万象·天衍）适配医院场景，兼容既有隔离电源、火灾监控、UPS与智能表计，补齐AI预测、场景定位和透明监管。'}],
  arch:[
    {ico:'🔌',t:'感知层',d:'AI智控终端、智能电表、IMD绝缘监测、温度贴片、剩余电流、UPS监测、电气火灾、热成像、烟感，覆盖全院关键回路。'},
    {ico:'🧠',t:'边缘计算层',d:'边缘网关本地高频采样、事件识别、联动策略与断网自治，守住手术室和ICU底线，确保生命支持回路不依赖云端。'},
    {ico:'☁️',t:'云平台层',d:'全院一次图、末端单线图、资产健康档案、PQ事件库、风险热力图、历史趋势模型与区域透明监管云。'},
    {ico:'📱',t:'应用层',d:'安全驾驶舱、移动工单、监管视图、评审报告、消防审计证据链、跨部门督办与三级联动闭环。'},
  ],
  feats:[
    {ico:'🏥',t:'医用IT隔离绝缘趋势解算',d:'超低频检测信号绕开分布电容干扰，解算真实对地绝缘电阻趋势，把声光报警升级为趋势漂移预警。'},
    {ico:'⚡',t:'电压暂降与电能质量监测',d:'0.1–3秒电压暂降分类记录，谐波溯源与三相不平衡分析，关联医疗设备扰动事件。'},
    {ico:'🔋',t:'UPS/ATS全生命周期管理',d:'电池SOH评估、旁路状态监测、切换录波核验、后备容量健康档案，杜绝冗余切换黑箱。'},
    {ico:'🔥',t:'故障电弧与电气隐患AI诊断',d:'高频波形+谐波指纹特征提取，识别插座松动、端子虚接、充电整流等电弧隐患，火灾综合评分。'},
    {ico:'📊',t:'全链路供电数字孪生',d:'从市电进线到末端插座，建立电力数字孪生模型，资产健康度评分与预测性维护建议。'},
    {ico:'🏛️',t:'三级联动透明监管',d:'院内安全大脑→区域监管云→多角色协同，风险热力图、整改进度、合规证据链穿透式管理。'},
  ],
  prods:['ESA全要素智能电表','ESB三相不平衡监测器','EST温度监测模组','FA故障电弧监测模块','ESX智能网关','FG智能防雷网关','FEXLINK工业互联网软件'],
  scenes:['ICU/急诊科电气安全监测','手术室医用IT隔离电源智慧化','医院数据中心UPS全生命周期管理','医技大设备电压暂降与谐波治理','冷链与机器人充电区安全监测','配电室/变压器资产健康管理','多院区集团透明监管云'],
  benefits:['电气事故避损率显著提升','人工运维频率降低60%','UPS电池故障提前发现率大幅提高','全院电力资产寿命延长20%','合规审计证据链自动生成','静态回收期8–12个月'],
  problems:[{p:'电气数据黑箱，慢性隐患无法前置捕捉',s:'智能电表+IMD+温度贴片全回路覆盖',a:'趋势预警窗口4–12周'},{p:'UPS/ATS切换黑箱，冗余成单点',s:'切换录波+SOH评估+后备容量核验',a:'关键切换记录100%'},{p:'人工巡检效率低，故障发现滞后',s:'边缘AI+移动工单闭环',a:'排查时间下降≥30%'},{p:'缺乏监管联动数据底座',s:'三级透明监管云+合规证据链',a:'年度安全态势报告'}],
  implementation:[{p:'Phase 1',t:'场所分级与勘察',d:'2周·0/1/2类医疗场所清单+关键回路确认'},{p:'Phase 2',t:'关键回路部署',d:'4周·IT隔离/UPS/电气火灾/温度/漏电终端安装'},{p:'Phase 3',t:'平台联调与模型训练',d:'3周·预警阈值校准+误报过滤+工单SLA'},{p:'Phase 4',t:'验收交付与培训',d:'1周·驾驶舱验收+运维培训+监管接口对接'}],
  standards:['GB/T 16895.24','IEC 60364-7-710','GB 51039','JGJ 312','GB 50116','GB 14287','GB 51348','IEEE 1159','IEC 61000-4-30'],
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

function genHome(pp, c, sls, cs, feat, sn, pfx, pageMeta) {
  const cats = PROD[sn] || PROD.yeslon;
  const isVertical=sn!=='yeslon';
  const feats = feat.length?feat:['工业PLC控制','电气安全监测','智能防雷系统','工业物联网平台'];
  const markCls=isVertical?'mark mark-themed':'mark';
  const cardCls=isVertical?'card-panel card-themed':'card-panel';
  const featCards = feats.map((f,i)=>
    `<div class="${cardCls} p-6 flex gap-4 items-start">
      <span class="${markCls} shrink-0">${String(i+1).padStart(2,'0')}</span>
      <h3 class="text-base font-semibold text-slate-900 leading-snug pt-1">${h(f)}</h3>
    </div>`).join('');
  const catCards = cats.map(cat=>`<a href="${pfx}/products" class="${cardCls} p-6 block no-underline group">
    <div class="flex items-start gap-4 mb-3"><span class="${markCls}">${catCode(cat.cat)}</span><div><h3 class="text-base font-semibold text-slate-900 group-hover:text-brand">${h(cat.cat)}</h3><p class="text-xs text-slate-500 mt-1">${cat.items.length} 款产品</p></div></div>
    <p class="text-xs text-brand font-medium">查看产品目录</p></a>`).join('');
  const solCards = sls.map((s)=>{const ss=s.slug||slug(s.title);return `<a href="${pfx}/solutions/${ss}" class="${cardCls} p-6 block no-underline border-l-4 border-l-brand group">
    <h3 class="font-semibold text-slate-900 group-hover:text-brand text-base mb-2">${h(s.title)}</h3>
    ${s.description?'<p class="text-sm text-slate-600 leading-relaxed line-clamp-2">'+h(s.description.slice(0,120))+'</p>':''}
    <p class="text-xs text-slate-500 mt-3">方案说明</p></a>`;}).join('');
  const caseCards = cs.slice(0,3).map(item=>`<a href="${pfx}/cases" class="${cardCls} p-6 block no-underline group">
    <div class="flex items-baseline justify-between gap-3 mb-2"><h3 class="font-semibold text-slate-900 group-hover:text-brand">${h(item.title)}</h3>${item.client?'<span class="text-[11px] text-slate-500 shrink-0">'+h(item.client)+'</span>':''}</div>
    ${item.description?'<p class="text-sm text-slate-600 leading-relaxed line-clamp-2">'+h(item.description.slice(0,120))+'</p>':''}</a>`).join('');

  const slides=[
    {t:'工业物联网与电气安全监测',d:'ESA/ESB/EST 全系列电气安全产品，覆盖配电监测、隐患分析与在线预警。',btn:'产品中心',url:pfx+'/products',tag:'电气安全'},
    {t:'智能防雷在线监测系统',d:'FS/FSS/FL/FR/FG 系列产品，实现 SPD 状态、雷电流与接地电阻连续监测。',btn:'防雷方案',url:pfx+'/solutions/smart-lightning-protection',tag:'智能防雷'},
    {t:'新能源充电站电气安全保障',d:'充电站与电动自行车充电棚的谐波分析、漏电与电弧监测整体方案。',btn:'充电安全',url:pfx+'/solutions/ev-charging-electrical-safety',tag:'新能源'},
  ];

  const heroBlock=isVertical?verticalHero(sn,c,pfx):mainHero(pfx,slides)+`
${!pfx?`<div class="bg-white border-b border-slate-200"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-2 text-xs">
<a href="/products" class="px-3 py-1.5 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand no-underline">产品中心</a>
<a href="/solutions/ev-charging-electrical-safety" class="px-3 py-1.5 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand no-underline">充电安全</a>
<a href="/solutions/electrical-hazard-monitoring" class="px-3 py-1.5 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand no-underline">隐患监测</a>
<a href="/solutions/smart-lightning-protection" class="px-3 py-1.5 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand no-underline">智能防雷</a>
<a href="/industrial-plc/" class="px-3 py-1.5 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand no-underline">工业PLC</a>
</div></div>`:''}`;

  const bd=`${nav(pp,c,pfx+'/',pfx)}
${heroBlock}

<section class="py-14 md:py-20 bg-white border-b border-slate-100"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead(isVertical?'核心能力':'业务能力',isVertical?'产品线核心能力':'核心产品与系统能力',isVertical?getTheme(sn,c).subtitle:c.desc)}
<div class="grid md:grid-cols-2 lg:grid-cols-${isVertical&&feats.length<=4?feats.length:3} gap-4">${featCards}</div>
</div></section>

<section class="py-14 md:py-20 bg-slate-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('产品目录','产品系列','按产品线浏览规格、型号与应用说明。')}
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${catCards}</div>
</div></section>

${sls.length?`<section class="py-14 md:py-20 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('行业应用','解决方案',isVertical?'面向典型场景的工程化部署方案。':'面向充电站、园区、机场、高速等场景的工程化方案。')}
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${solCards}</div>
</div></section>`:''}

${cs.length?`<section class="py-14 md:py-20 bg-slate-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('项目经验','典型案例','200+ 客户项目，覆盖新能源、交通、石化、园区等行业。')}
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${caseCards}</div>
<div class="mt-8"><a href="${pfx}/cases" class="text-sm font-medium text-brand hover:opacity-80 no-underline">查看全部案例</a></div>
</div></section>`:''}

${sn==='yeslon'&&!pfx?`<section class="py-14 md:py-20 bg-white border-t border-slate-100"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('专题站点','按产品线浏览','各产品线独立站点，独立视觉与专题内容。')}
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
<a href="/energy/" class="card-panel p-5 block no-underline border-l-4" style="border-left-color:#dc2626"><div class="flex gap-3 items-center mb-2"><span class="mark" style="border-color:#dc2626;color:#991b1b">EV</span><h3 class="font-semibold text-slate-900 text-sm">新能源充电与电气安全</h3></div><p class="text-xs text-slate-600 leading-relaxed">充电站谐波监测、储能安全、充电棚监测</p></a>
<a href="/electrical-safety/" class="card-panel p-5 block no-underline border-l-4" style="border-left-color:#d97706"><div class="flex gap-3 items-center mb-2"><span class="mark" style="border-color:#d97706;color:#92400e">ES</span><h3 class="font-semibold text-slate-900 text-sm">电气安全监测系统</h3></div><p class="text-xs text-slate-600 leading-relaxed">ESA、ESB、EST 及电气火灾监测</p></a>
<a href="/lightning-protection/" class="card-panel p-5 block no-underline border-l-4" style="border-left-color:#2563eb"><div class="flex gap-3 items-center mb-2"><span class="mark" style="border-color:#2563eb;color:#1d4ed8">SPD</span><h3 class="font-semibold text-slate-900 text-sm">智能防雷监测系统</h3></div><p class="text-xs text-slate-600 leading-relaxed">SPD、雷电流、接地电阻在线监测</p></a>
<a href="/industrial-plc/" class="card-panel p-5 block no-underline border-l-4" style="border-left-color:#059669"><div class="flex gap-3 items-center mb-2"><span class="mark" style="border-color:#059669;color:#047857">PLC</span><h3 class="font-semibold text-slate-900 text-sm">工业分布式PLC控制</h3></div><p class="text-xs text-slate-600 leading-relaxed">CC/CR/X 系列 PLC 与边缘网关</p></a>
</div></div></section>`:''}

<section class="bg-slate-900 text-white py-14 border-t-4 border-brand"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
<div><h2 class="text-xl font-bold mb-2">获取技术方案与报价</h2><p class="text-slate-400 text-sm">提供产品资料、系统方案书及项目配置建议</p></div>
<a href="${pfx}/contact" class="inline-flex px-6 py-3 btn-brand text-white text-sm font-semibold no-underline shrink-0">联系技术团队</a>
</div></section>${ft(pp,c,pfx)}`;
  const siteUrl=canonicalUrl(pfx);const pm=pageMeta||{};return lay('首页 - '+c.name,pm.desc||c.desc,bd,c,siteUrl,OG_DEFAULT,pm.kw||'');
}
function prodsPage(pp, c, sn, pfx, p) {
  const cats = PROD[sn] || PROD.yeslon;
  const tabLinks = cats.map((cat,i)=>`<button onclick="location.href='#${slug(cat.cat)}'" class="px-3 py-1.5 text-sm border transition-colors ${i===0?'border-primary-700 text-primary-800 bg-slate-50':'border-slate-200 text-slate-600 hover:border-slate-400'}">${h(cat.cat)}</button>`).join('');

  const tableRows = cats.flatMap(cat=>cat.items.map(item=>`<tr class="border-b border-slate-100 hover:bg-slate-50">
    <td class="py-3 px-4"><a href="${pfx}/products/${slug(item.n)}" class="text-primary-800 hover:text-primary-900 font-medium text-sm no-underline">${h(item.n)}</a></td>
    <td class="py-3 px-4 text-sm text-slate-500 font-mono text-xs">${item.m||'—'}</td>
    <td class="py-3 px-4 text-xs text-slate-600">${h(cat.cat)}</td>
    <td class="py-3 px-4 text-right"><a href="${pfx}/products/${slug(item.n)}" class="text-xs text-primary-800 font-medium no-underline">规格</a></td>
  </tr>`)).join('');

  const catSections = cats.map(cat=>`<section id="${slug(cat.cat)}" class="py-12 scroll-mt-20 ${cats.indexOf(cat)%2===0?'bg-white':'bg-slate-50'}">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
<div class="flex items-center gap-3">${catMark(cat.cat)}<h2 class="text-xl font-bold text-slate-900">${h(cat.cat)}</h2><span class="text-xs text-slate-500">${cat.items.length} 款</span></div>
<a href="${pfx}/products" class="text-xs text-slate-500 hover:text-primary-800 no-underline">返回目录</a>
</div>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">${cat.items.map(item=>`<div class="card-panel p-4 flex flex-col">
<h3 class="font-semibold text-slate-900 text-sm">${h(item.n)}</h3>${item.m?'<p class="text-xs text-slate-500 mt-1 font-mono">'+h(item.m)+'</p>':''}<p class="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2 flex-1">${h((item.d||item.desc||'').slice(0,100))}</p>
<a href="${pfx}/products/${slug(item.n)}" class="text-xs text-primary-800 font-medium mt-3 no-underline self-start">产品说明</a>
</div>`).join('')}
</div></div></section>`).join('');

  const bd=`${nav(pp,c,pfx+'/products',pfx)}
${pageHero('产品中心',c.name+' 产品目录与型号索引')}
<div class="bg-white border-b border-slate-200"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-2">${tabLinks}</div></div>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div class="card-panel overflow-hidden">
<div class="px-4 py-3 border-b border-slate-200 bg-slate-50"><h3 class="font-semibold text-sm text-slate-700">产品速查表</h3></div>
<div class="overflow-x-auto"><table class="w-full text-sm">
<thead><tr class="bg-slate-50 text-left text-xs text-slate-500">
<th class="py-3 px-4 font-medium">产品名称</th><th class="py-3 px-4 font-medium">型号</th><th class="py-3 px-4 font-medium">分类</th><th class="py-3 px-4 font-medium text-right">详情</th>
</tr></thead><tbody>${tableRows}</tbody>
</table></div></div></div>
${catSections}${ft(pp,c,pfx)}`;
  const siteU=canonicalUrl(pfx,'products');return lay('产品中心 - '+c.name,p?.desc||c.name+'产品中心',bd,c,siteU,OG_DEFAULT,p?.kw||'');
}

function aboutPage(pp,c,pfx,p){
  const bd=`${nav(pp,c,pfx+'/about',pfx)}
${pageHero('关于我们','有电，就有微物联 — 用数据重构能源效率')}

<section class="py-14 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid md:grid-cols-2 gap-12 items-start mb-16">
<div>${sectionHead('公司概况','微物联技术（深圳）有限公司')}
<p class="text-slate-600 leading-relaxed mb-4 text-sm">微物联技术成立于2016年，总部位于深圳市福田深港科技合作区，专注于工业物联网、电气安全监测、智能防雷及工业分布式控制领域的国家高新技术企业。</p>
<p class="text-slate-600 leading-relaxed mb-4 text-sm">公司拥有从智能传感器、边缘计算网关到 AI 分析平台、云平台的完整产品体系，具备"端-边-云"全栈自主研发能力。</p>
<p class="text-slate-600 leading-relaxed text-sm">服务新能源充电站、工业园区、机场、高速公路、商业综合体、数据中心等场景。</p></div>
<div class="card-panel p-8">
<div class="grid grid-cols-2 gap-6 text-center">
<div><div class="text-3xl font-bold text-slate-900">2016</div><p class="text-xs text-slate-500 mt-1">成立年份</p></div>
<div><div class="text-3xl font-bold text-slate-900">200+</div><p class="text-xs text-slate-500 mt-1">服务客户</p></div>
<div><div class="text-3xl font-bold text-slate-900">60+</div><p class="text-xs text-slate-500 mt-1">算法模型</p></div>
<div><div class="text-3xl font-bold text-slate-900">40+</div><p class="text-xs text-slate-500 mt-1">产品系列</p></div>
</div></div></div>
</div></section>

<section class="py-14 bg-slate-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('品牌定位','使命与技术理念')}
<div class="grid md:grid-cols-3 gap-4">
<div class="card-panel p-6"><h3 class="font-semibold text-slate-900 mb-2">企业使命</h3><p class="text-sm text-slate-600 leading-relaxed">让每一度电都可见、可懂、可优化，推动用电安全从被动报警走向主动预防。</p></div>
<div class="card-panel p-6"><h3 class="font-semibold text-slate-900 mb-2">品牌理念</h3><p class="text-sm text-slate-600 leading-relaxed">"有电，就有微物联"——专注电气安全与能效管理领域的长期技术投入。</p></div>
<div class="card-panel p-6"><h3 class="font-semibold text-slate-900 mb-2">技术理念</h3><p class="text-sm text-slate-600 leading-relaxed">以物联网感知为基础，以数据分析为核心，构建从采集到决策的完整闭环。</p></div>
</div></div></section>

<section class="py-14 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('技术能力','核心技术体系')}
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">全栈自研硬件</h3><p class="text-xs text-slate-600 leading-relaxed">传感器、PLC、边缘网关、智能断路器等完整硬件产品线</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">AI 算法引擎</h3><p class="text-xs text-slate-600 leading-relaxed">千知/万象/天衍模型体系，60+ 算法，408 项国标规则引擎</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">云边协同平台</h3><p class="text-xs text-slate-600 leading-relaxed">FEXLINK 平台：设备管理、数据分析、告警联动、远程运维</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">隐患分析</h3><p class="text-xs text-slate-600 leading-relaxed">谐波指纹识别，256 点/周期采样，提前预警电气隐患</p></div>
</div></div></section>

<section class="py-14 bg-slate-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('产品矩阵','主要产品线')}
<div class="grid md:grid-cols-3 gap-4">
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">工业智控</h3><p class="text-xs text-slate-600">CC/CR 系列 PLC、工业手环、边缘网关、HMI、I/O 模块</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">电气安全监测</h3><p class="text-xs text-slate-600">ESA、ESB、EST、FA 电弧探测、FAP 故障电弧</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">智能防雷</h3><p class="text-xs text-slate-600">FS/FSS/FSP、FL、FR/FRP、FG 网关</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">智能配电</h3><p class="text-xs text-slate-600">FECB2P 智能断路器、FECM2 网关、配电监测系统</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">软件平台</h3><p class="text-xs text-slate-600">FEXLINK 工业互联网平台、设备管理云平台</p></div>
<div class="card-panel p-5"><h3 class="font-semibold text-slate-900 text-sm mb-2">新能源安全</h3><p class="text-xs text-slate-600">充电站监测、充电棚安全、储能电站安全监测</p></div>
</div></div></section>

<section class="py-14 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('管理团队','核心团队')}
<div class="grid md:grid-cols-3 gap-6">
<div class="card-panel p-6 text-center"><h3 class="font-semibold text-slate-900">崔灿</h3><p class="text-sm text-slate-500 mt-1">创始人 / CEO</p><p class="text-xs text-slate-400 mt-2">香港城市大学 · BGS 全球终身会员</p></div>
<div class="card-panel p-6 text-center"><h3 class="font-semibold text-slate-900">邓博士</h3><p class="text-sm text-slate-500 mt-1">联合创始人</p><p class="text-xs text-slate-400 mt-2">清华大学 · 可编程逻辑控制</p></div>
<div class="card-panel p-6 text-center"><h3 class="font-semibold text-slate-900">李博士</h3><p class="text-sm text-slate-500 mt-1">联合创始人</p><p class="text-xs text-slate-400 mt-2">清华大学 · 嵌入式系统</p></div>
</div></div></section>

<section class="py-14 bg-slate-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('集团架构','集团成员')}
<div class="grid md:grid-cols-2 gap-3 max-w-4xl">${(c.group||[]).map((g,i)=>`<div class="card-panel p-4 ${i===0?'border-l-4 border-l-primary-700':''}"><p class="text-sm font-medium text-slate-900">${h(g)}</p></div>`).join('')}</div>
</div></section>

<section class="py-14 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('发展历程','荣誉与里程碑')}
<div class="max-w-3xl space-y-2">${[
  ['2016','深圳市最具投资价值企业50强'],
  ['2017','福田之星全国创业大赛第一名'],
  ['2018','全国高校校友创业大赛企业组第一名'],
  ['2019','航天云网杯工业互联网大赛一等奖'],
  ['2020','科技部部长、深圳市领导莅临视察'],
  ['2021-至今','太一智能大模型 · 谐波指纹分析 · 服务客户 200+'],
].map(([y,t])=>'<div class="flex gap-4 p-4 card-panel"><span class="text-primary-800 font-semibold text-sm w-20 shrink-0">'+y+'</span><p class="text-sm text-slate-600">'+t+'</p></div>').join('')}</div>
</div></section>

<section class="py-14 bg-slate-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${sectionHead('服务行业','主要应用行业')}
<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
${['新能源充电站','工业园区','机场/交通枢纽','数据中心','商业综合体','石油化工','市政工程','建筑楼宇'].map(i=>'<div class="card-panel p-4 text-center text-sm text-slate-700">'+i+'</div>').join('')}
</div></div></section>

<section class="py-14 bg-white"><div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="card-panel p-8"><h3 class="text-lg font-bold mb-4 text-slate-900">联系方式</h3><dl>
${contactRow('电话',c.phone)}
${contactRow('邮箱',c.email,'mailto:'+c.email)}
${contactRow('地址',c.addr)}
</dl></div></div></section>${ft(pp,c,pfx)}`;
  const siteU=canonicalUrl(pfx,'about');return lay('关于我们 - '+c.name,p?.desc||'',bd,c,siteU,OG_DEFAULT,p?.kw||'');
}
function contactPage(pp,c,pfx,p){
  const bd=`${nav(pp,c,pfx+'/contact',pfx)}
${pageHero('联系我们','技术咨询、方案对接与商务合作')}
<section class="py-14 bg-white"><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="card-panel p-6 md:p-8"><dl>
${contactRow('电话',c.phone)}
${contactRow('邮箱',c.email,'mailto:'+c.email)}
${contactRow('地址',c.addr)}
</dl></div></div></section>${ft(pp,c,pfx)}`;
  const siteU=canonicalUrl(pfx,'contact');return lay('联系我们 - '+c.name,p?.desc||'',bd,c,siteU,OG_DEFAULT,p?.kw||'');
}
function listPage(t, pp, c, items, path, pfx, p){
  const bd=`${nav(pp,c,pfx+'/'+path,pfx)}
${pageHero(t)}
<section class="py-14 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">${items.length?`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${items.slice(0,12).map(item=>`<article class="card-panel p-6"><h3 class="font-semibold text-slate-900 mb-2 text-base">${h(item.title||item.n)}</h3>${item.description?'<p class="text-sm text-slate-600 leading-relaxed">'+h(item.description.slice(0,150))+'</p>':''}${item.client?'<p class="mt-3 text-xs text-slate-500">客户：'+h(item.client)+'</p>':''}${item.category?'<p class="mt-1 text-xs text-slate-500">分类：'+h(item.category)+'</p>':''}</article>`).join('')}</div>`:'<p class="text-slate-500 text-sm py-8">内容更新中</p>'}</div></section>${ft(pp,c,pfx)}`;
  return lay(t+' - '+c.name,p?.desc||'',bd,c,canonicalUrl(pfx,path),OG_DEFAULT,p?.kw||'');
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

${sd.content?`
<div class="bg-white border-b border-gray-100">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
<div class="max-w-4xl mx-auto prose prose-gray prose-lg">
<p class="text-gray-700 leading-relaxed text-base" style="line-height:1.9">${h(sd.content)}</p>
</div></div></div>`:''}
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

 ${sk==='busbar-monitoring-system'||sk==='industrial-park-smart-energy'?`<section class="py-12 ${sk==='busbar-monitoring-system'?'bg-gradient-to-br from-blue-50 to-indigo-50':'bg-gradient-to-br from-emerald-50 to-cyan-50'}"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
<div class="grid md:grid-cols-2">
<div class="p-10 flex flex-col justify-center">
<div class="text-xs font-semibold text-primary-600 tracking-wider uppercase mb-2">🖥️ 在线体验</div>
<h2 class="text-2xl font-bold text-gray-900 mb-3">${sk==='busbar-monitoring-system'?'BusBMS 母线监测平台 DEMO':'🏭 智慧园区能源管理 DEMO'}</h2>
<p class="text-gray-500 mb-6">${sk==='busbar-monitoring-system'?'实时体验母线智能监测管理平台的全部功能：温度监测、AI趋势预测、三维可视化、告警中心、能耗统计等。':'实时体验工业园区智慧能源管理平台的全部功能：多楼栋监控、配电室监测、能耗统计、AI分析、告警中心等。'}</p>
<div class="flex gap-3">
<a href="/${sk==='busbar-monitoring-system'?'busbms-demo':'industrial-park-demo'}/" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all no-underline shadow-lg shadow-primary-200">🚀 打开在线演示</a>
</div>
</div>
<div class="${sk==='busbar-monitoring-system'?'bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800':'bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-800'} p-8 flex items-center justify-center">
<div class="text-center text-white">
<div class="text-5xl mb-4">${sk==='busbar-monitoring-system'?'📊':'🏭'}</div>
<div class="text-lg font-bold mb-2">${sk==='busbar-monitoring-system'?'实时数据监控面板':'园区能源总览看板'}</div>
<div class="flex gap-4 justify-center text-sm text-blue-200">
${sk==='busbar-monitoring-system'?'<div>🌡️ 48个在线节点</div><div>⚡ 847kW总负载</div><div>🎯 94.7%预测精度</div>':'<div>🏢 7栋建筑</div><div>⚡ 2,847kW总功率</div><div>🎯 84分健康评分</div>'}
</div>
</div>
</div>
</div>
</div>
</div></section>`:''}
<section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
<h2 class="text-2xl font-bold mb-3">获取完整方案文档</h2>
<p class="text-primary-100 mb-6">联系我们获取详细技术方案书、产品配置清单及项目报价</p>
<a href="${pfx}/contact" class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg no-underline">📞 立即咨询</a>
</div></section>${ft(pp,c,pfx)}`;
  const solUrl=canonicalUrl(pfx,'solutions/'+sk);return lay(title+' - '+c.name,desc,bd,c,solUrl);
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
var SLS_ALL=[],CS_ALL=[],NWS_ALL=[];

for(const d of defs){
  const c=cfg(d.n);c.pfx=d.pfx;c.sn=d.n;const pp=pages(d.n);
  const sls=reItems(join(root,'sites',d.n,'data','solutions.ts'),['title','description','category','slug']);
  const cs=reItems(join(root,'sites',d.n,'data','cases.ts'),['title','description','client']);
  const nws=reItems(join(root,'sites',d.n,'data','news.ts'),['title','description','category']);
  if(d.main){SLS_ALL=sls;CS_ALL=cs;NWS_ALL=nws;}
  const out=d.main?DIST:join(DIST,d.n);
  if(!existsSync(out))mkdirSync(out,{recursive:true});
  const siteBase=canonicalUrl(d.pfx).replace(/\/$/,'');

  // sitemap - include all pages
  var surls=[];
  // Structure pages
  pp.forEach(function(p){surls.push('<url><loc>'+siteBase+(p.path?'/'+p.path:'')+'</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>')});
  // Product detail pages
  var prodCats=PROD[d.n]||PROD.yeslon;
  prodCats.forEach(function(cat){cat.items.forEach(function(item){var s=slug(item.n);surls.push('<url><loc>'+siteBase+'/products/'+s+'</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>')})});
  // Solution detail pages (main site only)
  if(d.main) sls.forEach(function(s){var sk=s.slug||slug(s.title);surls.push('<url><loc>'+siteBase+'/solutions/'+sk+'</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>')});
  // Deduplicate
  surls=surls.filter(function(u,i,a){return a.indexOf(u)===i});
  writeFileSync(join(out,'sitemap.xml'),'<?xml version="1.0"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+surls.join('\n')+'\n</urlset>');
  writeFileSync(join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+siteBase+'/sitemap.xml'+(d.main?'\nSitemap: https://'+CANONICAL_HOST+'/sitemap-index.xml':'')+'\nCrawl-delay: 1');

  const pfx=d.pfx;
  for(const p of pp){
    const pt=p.path;let html;
    if(!pt)html=genHome(pp,c,sls,cs,c.feat,d.n,pfx,p);
    else if(pt==='about')html=aboutPage(pp,c,pfx,p);
    else if(pt==='contact')html=contactPage(pp,c,pfx,p);
    else if(pt==='products')html=prodsPage(pp,c,d.n,pfx,p);
    else if(pt==='solutions'){
      const solCards = sls.map(s=>{
        const sk = s.slug || slug(s.title);
        const sd=SOLS[sk];
        return `<a href="${pfx}/solutions/${sk}" class="card-panel p-6 block no-underline border-l-4 border-l-primary-700 group">
          <h3 class="font-semibold text-slate-900 group-hover:text-primary-800 mb-2">${h(s.title)}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-3">${h((s.description||'').slice(0,120))}</p>
          ${sd?`<div class="flex gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">${sd.stats.slice(0,3).map(st=>`<span>${h(st.v)} ${h(st.l)}</span>`).join('')}</div>`:''}
          <p class="text-xs text-slate-500 mt-3">方案说明</p>
        </a>`;
      }).join('');
      html=`${nav(pp,c,pfx+'/solutions',pfx)}
${pageHero(p.title,'行业经验与技术积累')}
<section class="py-14 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${solCards}</div></div></section>${ft(pp,c,pfx)}`;
      html=lay(p.title+' - '+c.name,p.desc||'',html,c,canonicalUrl(pfx,pt),OG_DEFAULT,p.kw||'');
    }
    else if(pt==='cases')html=listPage(p.title,pp,c,cs,pt,pfx,p);
    else if(pt==='news')html=listPage(p.title,pp,c,nws.length?nws:cs,pt,pfx,p);
    else html=listPage(p.title,pp,c,[],pt,pfx,p);
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
// Copy public/ directory (demos, etc.)
(function(){try{var d=join(root,'public');if(!existsSync(d))return;var go=function(s,t){try{var ee=readdirSync(s)}catch{return};for(var i=0;i<ee.length;i++){var sp=join(s,ee[i]);try{var st=statSync(sp)}catch{continue};if(st.isDirectory()){var tp=join(t,ee[i]);if(!existsSync(tp))mkdirSync(tp,{recursive:true});go(sp,tp)}else{copyFileSync(sp,join(t,ee[i]))}}};go(d,DIST);console.log('  📁 public/ copied');}catch(e){console.log('  ℹ️ copy public error:',e.message);}})();
// Generate search-index.json
try{var si=[];var addItem=function(t,d,u,g,k){si.push({t:t,d:d||'',u:u,g:g||'page',k:k||''})};
// Products
var allCats=[{name:'可编程控制器'},{name:'工业智控'},{name:'电气安全监测'},{name:'智能防雷'},{name:'智能断路器'},{name:'软件平台'}];
var siteUrl='https://www.yeslon.com';
for(var ci=0;ci<allCats.length;ci++){var cat=allCats[ci];var items=PROD.yeslon[ci]?PROD.yeslon[ci].items:[];for(var ii=0;ii<items.length;ii++){var item=items[ii];addItem(item.n,item.d||'',siteUrl+'/products/'+slug(item.n),'产品',cat.name)}}
// Solutions
for(var si2=0;si2<SLS_ALL.length;si2++){var sol=SLS_ALL[si2];addItem(sol.title,sol.description||'',siteUrl+'/solutions/'+(sol.slug||slug(sol.title)),'解决方案',sol.category||'')}
for(var ci2=0;ci2<CS_ALL.length;ci2++){var cas=CS_ALL[ci2];addItem(cas.title,cas.description||'',siteUrl+'/cases','案例',cas.client||'')}
for(var ni=0;ni<NWS_ALL.length;ni++){var nw=NWS_ALL[ni];addItem(nw.title,nw.description||'',siteUrl+'/news','新闻',nw.category||'')}
// Pages
var pagesList=[{t:'首页',d:'微物联技术首页',u:siteUrl+'/'},{t:'产品中心',d:'全部产品',u:siteUrl+'/products'},{t:'解决方案',d:'行业解决方案',u:siteUrl+'/solutions'},{t:'成功案例',d:'客户案例',u:siteUrl+'/cases'},{t:'新闻动态',d:'公司新闻',u:siteUrl+'/news'},{t:'关于我们',d:'公司介绍',u:siteUrl+'/about'},{t:'联系我们',d:'联系方式',u:siteUrl+'/contact'}];
for(var pi=0;pi<pagesList.length;pi++){var pg=pagesList[pi];addItem(pg.t,pg.d,pg.u,'页面')}
writeFileSync(join(DIST,'search-index.json'),JSON.stringify(si,null,0),'utf-8');
console.log('  🔍 search-index.json ('+si.length+' entries)');
}catch(e){console.log('  ℹ️ search index:',e.message);}
// Generate 404 page
try{
  const c404=cfg('yeslon');c404.pfx='';c404.sn='yeslon';
  const pp404=pages('yeslon');
  const body404=`${nav(pp404,c404,'/404','')}
${pageHero('页面未找到','您访问的页面不存在或已迁移')}
<section class="py-14 bg-white"><div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
<div class="flex flex-wrap justify-center gap-3 mb-10">
<a href="/" class="px-5 py-2.5 bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 no-underline">返回首页</a>
<a href="/products" class="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm no-underline hover:border-slate-500">产品中心</a>
<a href="/solutions" class="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm no-underline hover:border-slate-500">解决方案</a>
<a href="/contact" class="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm no-underline hover:border-slate-500">联系我们</a>
</div>
<div class="border-t border-slate-200 pt-8">
<p class="text-xs text-slate-500 mb-3">产品线站点</p>
<div class="flex flex-wrap justify-center gap-4 text-sm">
<a href="/energy/" class="text-primary-800 hover:text-primary-900 no-underline">新能源充电</a>
<a href="/electrical-safety/" class="text-primary-800 hover:text-primary-900 no-underline">电气安全</a>
<a href="/lightning-protection/" class="text-primary-800 hover:text-primary-900 no-underline">智能防雷</a>
<a href="/industrial-plc/" class="text-primary-800 hover:text-primary-900 no-underline">工业PLC</a>
</div></div></div></section>${ft(pp404,c404,'')}`;
  writeFileSync(join(DIST,'404.html'),lay('页面未找到 - 微物联技术','您访问的页面不存在',body404,c404,canonicalUrl('','404')));
  console.log('  📄 404.html generated');
}catch(e){console.error('  ❌ 404.html generation failed:',e.message);process.exit(1);}
// Sitemap index for all subsites
try{
  const smaps=defs.map(d=>{const loc=canonicalUrl(d.pfx,'sitemap.xml');return'<sitemap><loc>'+loc+'</loc></sitemap>';}).join('\n');
  writeFileSync(join(DIST,'sitemap-index.xml'),'<?xml version="1.0"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+smaps+'\n</sitemapindex>');
  console.log('  🗺️  sitemap-index.xml generated');
}catch(e){console.log('  ℹ️ sitemap index:',e.message);}
// Generate tailwind.css from built HTML files
try {
  console.log('\n  🎨 Generating tailwind.css...');
  execSync(`npx tailwindcss -i "${join(root, 'src', 'index.css')}" -o "${join(DIST, 'tailwind.css')}" --content "${join(DIST, '**', '*.html')}" --minify`, {
    stdio: 'inherit',
    cwd: root
  });
  if(!existsSync(join(DIST,'tailwind.css'))){throw new Error('tailwind.css not created');}
  console.log('  ✅ tailwind.css generated');
} catch(e) {
  console.error('  ❌ tailwind.css generation failed:', e.message);
  process.exit(1);
}
console.log('\n✅ Build complete');
