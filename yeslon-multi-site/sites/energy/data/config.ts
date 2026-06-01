import { SiteConfig } from '@shared/types';

export const energyConfig: SiteConfig = {
  subdomain: 'energy',
  domain: 'yeslon.com',
  siteName: '微物联能源方案',
  siteNameEn: 'Yeslon Energy Solutions',
  description: '专注于能源行业的技术解决方案，提供智能电网、能源管理、可再生能源等领域的创新技术方案。',
  keywords: ['能源方案', '智能电网', '能源管理', '可再生能源', '微电网', '光伏监控'],
  industry: 'energy',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#F59E0B',
  secondaryColor: '#D97706',
  logo: '/images/energy-logo.svg',
  features: [
    '智能电网解决方案',
    '能源管理系统',
    '光伏监控平台',
    '储能系统集成'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 微物联能源方案 | Yeslon',
    description: '提供专业的能源行业技术解决方案，包括智能电网、能源管理、可再生能源等领域的创新技术。',
    keywords: ['能源方案', '智能电网', '能源管理', '可再生能源'],
    ogImage: '/images/energy-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'yeslon_energy',
    weibo: 'yeslon_energy',
    linkedin: 'yeslon-energy'
  },
  contact: {
    phone: '+86 400-888-8888',
    email: 'energy@yeslon.com',
    address: '北京市朝阳区能源大厦A座',
    workingHours: '周一至周五 9:00-18:00'
  }
};
