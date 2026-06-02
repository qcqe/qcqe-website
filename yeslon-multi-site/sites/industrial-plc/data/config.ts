import { SiteConfig } from '@shared/types';

export const industrialPlcConfig: SiteConfig = {
  subdomain: 'industrial-plc',
  domain: 'qcqe.com',
  siteName: '工业分布式可编程控制系统',
  siteNameEn: 'Industrial PLC Control',
  description: '专注于工业分布式可编程控制领域，提供CC/CR/X系列PLC、分布式可编程控制器"设备大脑"、HMI人机界面及工业网关产品，赋能智能制造与工业自动化。',
  keywords: ['PLC', '可编程控制器', '分布式控制', '工业控制', 'CC系列PLC', 'CR系列PLC', 'X系列PLC', 'HMI', '工业网关'],
  industry: 'industrial-plc',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#059669',
  secondaryColor: '#047857',
  logo: '/images/industrial-plc-logo.svg',
  features: [
    'CC/CR/X系列PLC',
    '分布式可编程控制器"设备大脑"',
    'HMI人机界面',
    '工业通信网关'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 工业分布式可编程控制系统 | Yeslon',
    description: '提供工业级CC/CR/X系列PLC、分布式可编程控制器、HMI及工业网关产品，支持IEC 61131-3编程标准，构建灵活可靠的分布式控制网络。',
    keywords: ['PLC', '可编程控制器', '分布式控制', 'CC系列', 'CR系列', 'X系列', 'HMI', '工业自动化'],
    ogImage: '/images/industrial-plc-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'yeslon_plc',
    linkedin: 'yeslon-industrial-plc'
  },
  contact: {
    phone: '0755-86536148',
    email: 'cc@fexlink.com',
    address: '深圳市福田深港科技合作区长富金茂大厦1908',
    workingHours: '周一至周五 9:00-18:00',
    website: 'www.fexlink.com'
  }
};
