import { SiteConfig } from '@shared/types';

export const yeslonConfig: SiteConfig = {
  subdomain: 'www',
  domain: 'yeslon.com',
  siteName: '微物联技术方案',
  siteNameEn: 'Yeslon Solutions',
  description: '提供跨行业技术解决方案，涵盖能源、制造、农业、物流、医疗等领域的技术创新服务。',
  keywords: ['技术方案', '数字化转型', 'IoT', '智能解决方案', '行业方案'],
  industry: 'technology',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#2563EB',
  secondaryColor: '#1E40AF',
  logo: '/images/yeslon-logo.svg',
  features: [
    '跨行业解决方案',
    'IoT物联网平台',
    '数据智能分析',
    '云端集成服务'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 微物联技术方案 | Yeslon',
    description: '提供专业的跨行业技术解决方案，包括能源、制造、农业、物流、医疗等领域的数字化转型服务。',
    keywords: ['技术方案', '数字化转型', 'IoT', '智能解决方案', '行业方案'],
    ogImage: '/images/yeslon-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'yeslon_tech',
    weibo: 'yeslon_tech',
    linkedin: 'yeslon-technology'
  },
  contact: {
    phone: '+86 400-123-4567',
    email: 'contact@yeslon.com',
    address: '北京市海淀区中关村科技园A座',
    workingHours: '周一至周五 9:00-18:00'
  }
};
