import { SiteConfig } from '@shared/types';

export const lightningProtectionConfig: SiteConfig = {
  subdomain: 'lightning-protection',
  domain: 'yeslon.com',
  siteName: '智能防雷监测系统',
  siteNameEn: 'Smart Lightning Protection',
  description: '专注于智能防雷监测领域，提供FS/FSS/FSP电涌保护器监测仪、FL雷电峰值监测仪、FR/FRP接地电阻监测仪及FG智能网关，构建全方位的雷电防护智能监测网络。',
  keywords: ['智能防雷', '电涌保护器监测', '雷电峰值监测', '接地电阻监测', 'SPD监测', 'FL监测仪', 'FG网关'],
  industry: 'lightning-protection',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#2563EB',
  secondaryColor: '#1D4ED8',
  logo: '/images/lightning-protection-logo.svg',
  features: [
    'FS/FSS/FSP电涌保护器监测仪',
    'FL雷电峰值监测仪',
    'FR/FRP接地电阻监测仪',
    'FG智能网关'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 智能防雷监测系统 | Yeslon',
    description: '提供全面的智能防雷监测解决方案，FS/FSS/FSP电涌保护器状态监测、FL雷电峰值记录、FR/FRP接地电阻在线监测，用科技守护设施防雷安全。',
    keywords: ['智能防雷', '电涌保护器监测', '雷电峰值监测', '接地电阻监测', 'FG智能网关'],
    ogImage: '/images/lightning-protection-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'yeslon_lp',
    linkedin: 'yeslon-lightning-protection'
  },
  contact: {
    phone: '0755-86536148',
    email: 'cc@fexlink.com',
    address: '深圳市福田深港科技合作区长富金茂大厦1908',
    workingHours: '周一至周五 9:00-18:00',
    website: 'www.fexlink.com'
  }
};
