import { Solution } from '@shared/types';

export const energySolutions: Solution[] = [
  {
    id: '1',
    slug: 'ev-station-safety',
    title: '新能源充电站电气安全数字化保障方案',
    description: '针对新能源充电站场景，提供从充电桩漏电监测、电弧故障检测、谐波分析到后台集中管理的一站式电气安全数字化解决方案，实现充电站电气隐患的实时预警与快速处置。',
    features: [
      '充电桩漏电流实时监测',
      '故障电弧检测与报警',
      '谐波指纹分析及异常识别',
      '绝缘电阻在线监测',
      '电气火灾预警联动',
      '云端集中管理与告警推送'
    ],
    category: 'ev-charging',
    image: '/images/energy/ev-station-safety.jpg',
    publishedAt: '2024-06-01'
  },
  {
    id: '2',
    slug: 'ebike-charging-safety',
    title: '电动自行车充电棚电气安全方案',
    description: '面向小区、园区及公共区域的电动自行车集中充电棚，提供电气安全监测与火灾预警方案，有效防范充电过载、漏电、短路等引发的安全事故。',
    features: [
      '充电回路漏电监测',
      '过载与短路保护',
      '温度异常检测',
      '烟雾监测联动',
      '充电行为智能分析',
      '远程断电控制'
    ],
    category: 'ev-charging',
    image: '/images/energy/ebike-charging.jpg',
    publishedAt: '2024-06-10'
  },
  {
    id: '3',
    slug: 'storage-station-safety',
    title: '储能电站安全监测系统',
    description: '针对储能电站电气安全需求，提供电池簇电气参数监测、热失控预警、绝缘诊断及环境参数采集等全方位安全监测系统。',
    features: [
      '电池簇电压/电流/温度监测',
      '热失控早期预警',
      '绝缘电阻在线诊断',
      '电气弧光检测',
      '环境温湿度及气体监测',
      '多级告警与消防联动'
    ],
    category: 'energy-storage',
    image: '/images/energy/storage-safety.jpg',
    publishedAt: '2024-06-15'
  },
  {
    id: '4',
    slug: 'harmonic-fingerprint',
    title: '电气隐患智能分析系统（谐波指纹）',
    description: '基于高频谐波指纹识别技术的电气隐患智能分析系统，通过提取线路特征谐波信号，精准识别各类电气故障前兆，实现隐患的提前预警。',
    features: [
      '高频谐波信号采集',
      '谐波指纹特征提取与建模',
      '故障电弧提前识别',
      '线路接触不良检测',
      '绝缘劣化趋势分析',
      'AI智能诊断与报告生成'
    ],
    category: 'monitoring',
    image: '/images/energy/harmonic-fingerprint.jpg',
    publishedAt: '2024-06-20'
  },
  {
    id: '5',
    slug: 'station-ops-management',
    title: '充电站运维管理系统',
    description: '充电站综合运维管理平台，整合电气安全监测、设备管理、工单派发、数据分析等功能，提升充电站运营效率与安全管理水平。',
    features: [
      '充电设备实时状态监控',
      '电气安全数据可视化',
      '智能工单与巡检管理',
      '运维数据统计分析',
      '告警分级与自动派单',
      '移动端远程管理'
    ],
    category: 'ev-charging',
    image: '/images/energy/station-ops.jpg',
    publishedAt: '2024-07-01'
  }
];
