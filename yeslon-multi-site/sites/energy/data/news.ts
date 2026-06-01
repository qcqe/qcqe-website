import { News } from '@shared/types';

export const energyNews: News[] = [
  {
    id: '1',
    slug: 'energy-storage-policy',
    title: '国家储能政策解读与市场机遇',
    description: '深度解读国家最新储能产业政策，分析市场发展机遇。',
    content: '随着双碳目标的推进，储能产业迎来了前所未有的发展机遇...',
    category: '政策解读',
    image: '/images/energy/news/policy.jpg',
    publishedAt: '2024-06-05'
  },
  {
    id: '2',
    slug: 'smart-grid-tech',
    title: '智能电网关键技术与发展趋势',
    description: '探讨智能电网领域的关键技术和未来发展趋势。',
    content: '智能电网作为能源互联网的重要支撑，正在经历技术变革...',
    category: '技术分享',
    image: '/images/energy/news/tech.jpg',
    publishedAt: '2024-05-28'
  },
  {
    id: '3',
    slug: 'solar-monitoring-case',
    title: '案例：大型光伏电站运维效率提升50%的秘密',
    description: '通过智能化监控平台，某光伏电站运维效率大幅提升。',
    content: '某总装机容量300MW的光伏电站在部署我们的监控平台后...',
    category: '成功案例',
    image: '/images/energy/news/case.jpg',
    publishedAt: '2024-05-20'
  },
  {
    id: '4',
    slug: 'ems-product-update',
    title: '能源管理系统新版本发布',
    description: '全新版本能源管理系统，更强大的数据分析能力和更友好的用户体验。',
    content: '我们很高兴宣布能源管理系统新版本正式发布...',
    category: '产品更新',
    image: '/images/energy/news/product.jpg',
    publishedAt: '2024-05-15'
  }
];
