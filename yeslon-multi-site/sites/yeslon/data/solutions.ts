import { Solution } from '@shared/types';

export const solutions: Solution[] = [
  {
    id: '1',
    slug: 'smart-energy',
    title: '智能能源管理方案',
    description: '基于物联网技术的智慧能源管理系统，实现能源数据实时监控、智能调度和节能优化。',
    features: [
      '实时数据采集与分析',
      '智能用电调度',
      '能耗预测与优化',
      '多能源协同管理'
    ],
    category: 'energy',
    image: '/images/solutions/energy.jpg',
    publishedAt: '2024-01-15'
  },
  {
    id: '2',
    slug: 'smart-manufacturing',
    title: '智能制造解决方案',
    description: '面向制造业的数字化转型方案，实现生产流程自动化、设备互联和智能决策。',
    features: [
      'MES生产执行系统',
      '设备预测性维护',
      '质量追溯管理',
      '柔性生产调度'
    ],
    category: 'manufacturing',
    image: '/images/solutions/manufacturing.jpg',
    publishedAt: '2024-02-20'
  },
  {
    id: '3',
    slug: 'smart-agriculture',
    title: '智慧农业解决方案',
    description: '运用IoT和AI技术，打造精准农业管理系统，实现农作物全程智能监控与管理。',
    features: [
      '环境监测系统',
      '精准灌溉控制',
      '病虫害预警',
      '农产品溯源'
    ],
    category: 'agriculture',
    image: '/images/solutions/agriculture.jpg',
    publishedAt: '2024-03-10'
  },
  {
    id: '4',
    slug: 'smart-logistics',
    title: '智慧物流解决方案',
    description: '端到端的物流数字化方案，提升仓储效率、优化配送路径、降低运营成本。',
    features: [
      '智能仓储系统',
      '路径优化算法',
      '冷链全程监控',
      '最后一公里配送'
    ],
    category: 'logistics',
    image: '/images/solutions/logistics.jpg',
    publishedAt: '2024-04-05'
  },
  {
    id: '5',
    slug: 'smart-healthcare',
    title: '智慧医疗解决方案',
    description: '面向医疗机构的数字化转型方案，提升医疗服务效率和质量。',
    features: [
      '智慧医院信息系统',
      '远程医疗平台',
      '医疗设备管理',
      '患者随访管理'
    ],
    category: 'healthcare',
    image: '/images/solutions/healthcare.jpg',
    publishedAt: '2024-05-12'
  }
];
