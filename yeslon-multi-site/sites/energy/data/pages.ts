import { PageConfig } from '@shared/types';

export const energyPages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联能源方案 - 专业的新能源技术解决方案提供商',
    keywords: ['能源方案', '智能电网', '能源管理', '光伏监控', '储能系统'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'solutions',
    title: '解决方案',
    description: '能源行业解决方案，包括智能电网、能源管理、光伏监控、储能系统等',
    keywords: ['能源解决方案', '智能电网方案', '能源管理系统'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '能源行业成功案例，包括电网、能源企业、光伏电站等项目',
    keywords: ['能源案例', '成功案例', '项目案例'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'news',
    title: '新闻资讯',
    description: '能源行业最新资讯、技术分享和政策解读',
    keywords: ['能源资讯', '行业动态', '技术分享'],
    changeFreq: 'daily',
    priority: 0.8
  },
  {
    path: 'about',
    title: '关于我们',
    description: '了解微物联能源方案团队和行业经验',
    keywords: ['关于我们', '能源团队'],
    changeFreq: 'monthly',
    priority: 0.6
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '能源方案咨询和合作联系',
    keywords: ['联系我们', '合作联系'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
