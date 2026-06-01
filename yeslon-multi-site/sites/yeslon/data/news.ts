import { News } from '@shared/types';

export const news: News[] = [
  {
    id: '1',
    slug: 'industry-trends-2024',
    title: '2024年物联网行业发展趋势展望',
    description: '深度解析2024年物联网行业的技术趋势、市场机遇和挑战。',
    content: '随着5G技术的普及和AI技术的发展，物联网行业正在经历新一轮的变革...',
    category: '行业动态',
    image: '/images/news/iot-trends.jpg',
    publishedAt: '2024-06-01'
  },
  {
    id: '2',
    slug: 'digital-transformation-guide',
    title: '企业数字化转型完全指南',
    description: '从战略规划到落地实施，全方位指导企业进行数字化转型。',
    content: '数字化转型已成为企业发展的必由之路。本文将从战略、技术、组织三个维度...',
    category: '技术指南',
    image: '/images/news/digital-guide.jpg',
    publishedAt: '2024-05-25'
  },
  {
    id: '3',
    slug: 'success-story-energy',
    title: '案例：某能源企业如何实现15%节能目标',
    description: '通过智能能源管理系统，某能源企业在一年内实现了显著的节能效果。',
    content: '通过部署微物联的智能能源管理系统，该企业实现了对全厂能源数据的实时监控...',
    category: '成功案例',
    image: '/images/news/energy-success.jpg',
    publishedAt: '2024-05-20'
  },
  {
    id: '4',
    slug: 'new-product-launch',
    title: '新品发布：新一代IoT边缘计算网关',
    description: '全新发布的IoT边缘计算网关具备更强的算力和更丰富的接口。',
    content: '我们很高兴宣布推出新一代IoT边缘计算网关，该产品具备以下核心特性...',
    category: '产品发布',
    image: '/images/news/new-product.jpg',
    publishedAt: '2024-05-15'
  }
];
