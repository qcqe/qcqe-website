import { Solution } from '@shared/types';

export const lightningProtectionSolutions: Solution[] = [
  {
    id: 'lp-sol-001',
    slug: 'spd-online-monitoring',
    title: 'SPD在线监测与劣化预警方案',
    description: '基于FS-200/FSS-300/FSP-500系列电涌保护器监测仪，实时监测SPD的漏电流、热脱扣状态、雷击次数与能量，通过劣化趋势分析提前预警SPD失效风险。',
    features: [
      'SPD漏电流实时监测（μA级精度）',
      '热脱扣状态检测与远程指示',
      '雷击计数与能量记录',
      '劣化趋势AI分析与剩余寿命预测',
      '支持远程巡检替代人工月度巡检'
    ],
    category: 'spd-monitoring',
    image: '/images/lightning-protection/spd-solution.jpg',
    publishedAt: '2024-06-01'
  },
  {
    id: 'lp-sol-002',
    slug: 'lightning-peak-recording',
    title: 'FL雷电峰值监测与定位方案',
    description: '采用FL-100/FL-300雷电峰值监测仪，部署于建筑物接闪带、变电所避雷针等位置，精确记录雷电流峰值（0.1~200kA）与极性，结合GPS时间戳实现雷击点定位。',
    features: [
      '雷电流峰值测量范围0.1~200kA',
      '极性识别与波形记录',
      'GPS/北斗双模授时，时间精度±1μs',
      '多站点联合雷击定位算法',
      '雷暴日统计与雷电活动热力图'
    ],
    category: 'lightning-recording',
    image: '/images/lightning-protection/fl-solution.jpg',
    publishedAt: '2024-06-15'
  },
  {
    id: 'lp-sol-003',
    slug: 'ground-resistance-monitoring',
    title: 'FR/FRP接地电阻在线监测方案',
    description: '基于FR-200/FRP-300接地电阻监测仪，支持三极法（电位降法）与钳表法两种测量模式，实现接地电阻值的全天候在线监测与趋势分析。',
    features: [
      '支持三极法与钳表法双模式',
      '测量范围0.01Ω~200Ω',
      '土壤电阻率辅助测量',
      '接地电阻季节性变化趋势分析',
      '超标自动告警与工单派发'
    ],
    category: 'ground-monitoring',
    image: '/images/lightning-protection/fr-solution.jpg',
    publishedAt: '2024-07-01'
  },
  {
    id: 'lp-sol-004',
    slug: 'integrated-lightning-cloud',
    title: '综合防雷智能云平台',
    description: '通过FG-200/FG-500智能网关汇聚FS、FL、FR全系列设备数据，上传至防雷云平台进行统一监控、数据分析与告警管理，支持多站点集团化管理。',
    features: [
      'FS/FL/FR设备统一接入与管理',
      'FG网关边缘计算与协议转换',
      '多站点防雷设备资产总览',
      '智能告警规则引擎',
      '防雷设备全生命周期运维管理'
    ],
    category: 'cloud-platform',
    image: '/images/lightning-protection/cloud-solution.jpg',
    publishedAt: '2024-07-15'
  },
  {
    id: 'lp-sol-005',
    slug: 'petrochemical-lightning',
    title: '石油化工行业雷电防护整体方案',
    description: '针对石油化工行业易燃易爆环境的特殊要求，提供防爆型FS-EX系列SPD监测仪、FL-EX雷电峰值监测仪及本安型FRP-IS接地电阻监测仪，满足Ex ia IIC T4防爆等级。',
    features: [
      'Ex ia IIC T4本安防爆设计',
      '防爆型SPD漏电流监测',
      '罐区接地电阻在线监测',
      '雷电临近预警与联动控制',
      '满足GB 50057/SH/T 3169规范'
    ],
    category: 'petrochemical',
    image: '/images/lightning-protection/petro-solution.jpg',
    publishedAt: '2024-08-01'
  }
];
