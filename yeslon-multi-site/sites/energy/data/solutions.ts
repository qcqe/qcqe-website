import { Solution } from '@shared/types';

export const energySolutions: Solution[] = [
  {
    id: '1',
    slug: 'smart-grid',
    title: '智能电网解决方案',
    description: '基于物联网和AI技术的智能电网管理系统，实现电网运行的实时监控和智能调度。',
    features: [
      '电网状态实时监控',
      '故障快速定位与隔离',
      '负荷预测与调度优化',
      '新能源消纳管理'
    ],
    category: 'smart-grid',
    image: '/images/energy/smart-grid.jpg',
    publishedAt: '2024-01-10'
  },
  {
    id: '2',
    slug: 'energy-management',
    title: '能源管理系统(EMS)',
    description: '企业级能源管理系统，帮助企业实现能源消耗的精细化管理。',
    features: [
      '多能源类型计量',
      '能耗数据实时采集',
      '能耗分析与报告',
      '节能潜力挖掘'
    ],
    category: 'energy-management',
    image: '/images/energy/ems.jpg',
    publishedAt: '2024-01-25'
  },
  {
    id: '3',
    slug: 'solar-monitoring',
    title: '光伏监控平台',
    description: '针对光伏电站的智能化监控和运维管理平台。',
    features: [
      '光伏组件发电监测',
      '逆变器状态监控',
      '发电量预测',
      '运维工单管理'
    ],
    category: 'renewable',
    image: '/images/energy/solar.jpg',
    publishedAt: '2024-02-15'
  },
  {
    id: '4',
    slug: 'energy-storage',
    title: '储能系统集成',
    description: '储能系统的整体解决方案，包括电池管理、系统集成和能量调度。',
    features: [
      '电池管理系统(BMS)',
      '能量管理系统(EMS)',
      '储能系统集成',
      '峰谷套利策略'
    ],
    category: 'storage',
    image: '/images/energy/storage.jpg',
    publishedAt: '2024-03-05'
  },
  {
    id: '5',
    slug: 'microgrid',
    title: '微电网解决方案',
    description: '面向园区或社区的微电网整体解决方案。',
    features: [
      '多能互补系统',
      '并网/离网切换',
      '智能调度控制',
      '本地能源消纳'
    ],
    category: 'microgrid',
    image: '/images/energy/microgrid.jpg',
    publishedAt: '2024-03-20'
  }
];
