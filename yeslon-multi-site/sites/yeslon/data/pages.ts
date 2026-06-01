import { PageConfig } from '@shared/types';

export const pages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联技术方案 - 提供跨行业数字化转型解决方案',
    keywords: ['微物联', '技术方案', 'IoT', '数字化转型'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'solutions',
    title: '解决方案',
    description: '浏览我们的技术解决方案，包括能源、制造、农业、物流、医疗等行业的数字化转型方案',
    keywords: ['解决方案', '技术方案', 'IoT方案', '行业方案'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '了解我们为各行业客户提供的成功案例和项目实施经验',
    keywords: ['成功案例', '客户案例', '项目案例'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'news',
    title: '新闻资讯',
    description: '了解最新的行业动态、技术指南和产品发布',
    keywords: ['新闻', '资讯', '行业动态', '技术指南'],
    changeFreq: 'daily',
    priority: 0.8
  },
  {
    path: 'about',
    title: '关于我们',
    description: '了解微物联公司的发展历程、核心优势和团队实力',
    keywords: ['关于我们', '公司介绍', '团队'],
    changeFreq: 'monthly',
    priority: 0.6
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '获取联系方式和咨询表单，欢迎与我们联系',
    keywords: ['联系我们', '联系方式', '咨询'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
