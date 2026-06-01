import { PageConfig } from '@shared/types';

export const energyPages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联技术 — 新能源充电站电气安全监测与电气隐患预警专家，提供充电桩电弧检测、谐波分析、电动自行车充电棚监测等电气安全数字化方案。',
    keywords: ['充电站电气安全', '微物联技术', '电气隐患监测', '充电桩安全检测'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'ev-charging',
    title: '充电站电气安全方案',
    description: '新能源充电站电气安全数字化保障方案，涵盖充电桩漏电监测、谐波指纹分析、电弧故障检测、绝缘监测等功能，保障充电运营安全。',
    keywords: ['充电站安全方案', '充电桩漏电监测', '谐波分析方案', '充电站电气安全'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'energy-storage',
    title: '储能安全方案',
    description: '储能电站安全监测系统，提供电池热失控预警、电气参数实时监测、绝缘状态诊断等多维安全防护。',
    keywords: ['储能安全', '储能电站监测', '电池安全预警', '储能电气安全'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'monitoring',
    title: '电气隐患监测',
    description: '电气隐患智能分析系统（谐波指纹），通过高频谐波指纹识别技术提前发现电气线路隐患，预防电气火灾。',
    keywords: ['电气隐患监测', '谐波指纹', '电气火灾预警', '故障电弧检测', '线路隐患分析'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'products',
    title: '产品中心',
    description: '电气安全监测产品系列，包括智能电气安全监测终端、谐波分析仪、电弧检测装置、充电站安全网关等。',
    keywords: ['电气安全产品', '安全监测终端', '谐波分析仪', '电弧检测装置'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '新能源充电站电气安全监测及电气隐患预警项目案例，涵盖充电站、电动自行车充电棚、公交场站、商业综合体等场景。',
    keywords: ['充电站安全案例', '电气监测项目', '电动自行车充电案例', '安全监测案例'],
    changeFreq: 'weekly',
    priority: 0.8
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '微物联技术电气安全业务咨询，充电站电气安全方案定制，全国服务热线与技术支持。',
    keywords: ['联系我们', '电气安全咨询', '充电站安全合作'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
