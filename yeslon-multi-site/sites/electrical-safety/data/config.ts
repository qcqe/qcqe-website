import { SiteConfig } from '@shared/types';

export const electricalSafetyConfig: SiteConfig = {
  subdomain: 'electrical-safety',
  domain: 'qcqe.com',
  siteName: '电气安全监测系统',
  siteNameEn: 'Electrical Safety Monitoring',
  description: '专注于电气安全领域的智能监测解决方案，提供ESA全要素智能电表、ESB三相不平衡监测器、EST无线温度监测等产品，实现电气隐患的全面感知与AI智能分析。',
  keywords: ['电气安全', '智能电表', '三相不平衡', '温度监测', '电气隐患', 'ESA电表', 'ESB监测器', 'EST测温'],
  industry: 'electrical-safety',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#DC2626',
  secondaryColor: '#991B1B',
  logo: '/images/electrical-safety-logo.svg',
  features: [
    'ESA全要素智能电表',
    'ESB三相不平衡监测',
    'EST无线温度监测',
    '电气隐患AI分析'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 电气安全监测系统 | Yeslon',
    description: '提供全面的电气安全监测解决方案，ESA全要素智能电表、ESB三相不平衡监测器、EST无线温度监测，用AI守护用电安全。',
    keywords: ['电气安全', '智能电表', '三相不平衡', '温度监测', '电气隐患'],
    ogImage: '/images/electrical-safety-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'yeslon_elsafe',
    linkedin: 'yeslon-electrical-safety'
  },
  contact: {
    phone: '0755-86536148',
    email: 'cc@fexlink.com',
    address: '深圳市福田深港科技合作区长富金茂大厦1908',
    workingHours: '周一至周五 9:00-18:00',
    website: 'www.fexlink.com'
  }
};
