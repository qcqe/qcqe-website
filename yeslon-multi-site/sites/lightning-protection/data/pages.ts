import { PageConfig } from '@shared/types';

export const lightningProtectionPages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联智能防雷监测系统 — FS/FSS/FSP电涌保护器监测·FL雷电峰值监测·FR/FRP接地电阻监测·FG智能网关',
    keywords: ['智能防雷', 'SPD监测', 'FL雷电峰值', 'FR接地电阻', 'FG网关'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'products',
    title: '产品中心',
    description: 'FS/FSS/FSP电涌保护器监测仪、FL雷电峰值监测仪、FR/FRP接地电阻监测仪、FG智能网关',
    keywords: ['FS监测仪', 'FSS监测仪', 'FSP监测仪', 'FL监测仪', 'FR监测仪', 'FG网关'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'products/fs-series',
    title: 'FS/FSS/FSP电涌保护器监测仪',
    description: 'FS/FSS/FSP系列电涌保护器(SPD)在线监测仪，实时监测SPD漏电流、劣化状态及雷击计数',
    keywords: ['FS', 'FSS', 'FSP', 'SPD监测', '电涌保护器', '雷击计数'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/fl',
    title: 'FL雷电峰值监测仪',
    description: 'FL系列雷电峰值监测仪，实时记录雷电流峰值、极性及发生时间，支持远程查询',
    keywords: ['FL', '雷电峰值', '雷电流监测', '雷击记录'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/fr-series',
    title: 'FR/FRP接地电阻监测仪',
    description: 'FR/FRP系列接地电阻在线监测仪，支持三极法/钳表法实时监测接地电阻值',
    keywords: ['FR', 'FRP', '接地电阻', '接地监测', '接地电阻在线监测'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/fg',
    title: 'FG智能网关',
    description: 'FG系列智能防雷网关，汇聚FS/FL/FR数据，支持4G/以太网上报，边缘计算与远程配置',
    keywords: ['FG网关', '智能网关', '防雷网关', '数据汇聚'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'solutions',
    title: '解决方案',
    description: '智能防雷整体解决方案，覆盖SPD在线监测、雷电峰值记录、接地电阻监测、综合防雷云平台',
    keywords: ['防雷方案', 'SPD监测方案', '雷电监测方案', '接地监测方案'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'specifications',
    title: '技术规格',
    description: 'FS/FSS/FSP/FL/FR/FRP/FG系列产品详细技术参数',
    keywords: ['技术规格', '防雷产品参数', 'FS参数', 'FL参数', 'FR参数', 'FG参数'],
    changeFreq: 'monthly',
    priority: 0.7
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '智能防雷监测系统在各行业的成功应用案例',
    keywords: ['防雷案例', 'SPD监测案例', '接地监测案例'],
    changeFreq: 'weekly',
    priority: 0.8
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '智能防雷监测系统产品咨询与技术支持',
    keywords: ['联系我们', '防雷咨询'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
