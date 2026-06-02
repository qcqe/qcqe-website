import { SiteConfig } from '@shared/types';

export const yeslonConfig: SiteConfig = {
  subdomain: 'www',
  domain: 'yeslon.com',
  siteName: '微物联技术（深圳）有限公司',
  siteNameEn: 'Yeslon Technologies',
  description: '微物联技术（深圳）有限公司成立于2016年，专注工业物联网与电气安全领域，拥有智能传感器、边缘计算网关、AI分析平台全栈自研能力。产品覆盖工业PLC、电气安全监测（ESA/ESB/EST/ESE/ESF等系列）、智能防雷（FS/FSS/FL/FR/FG系列）、智能断路器及FEXLINK云平台，为新能源充电站、工业园区、机场、数据中心等提供"端-边-云"一体化电气安全与能效管理解决方案。公司坚持"让每一度电都可见、可懂、可优化"的使命，以"有电，就有微物联"为品牌愿景。',
  keywords: ['PLC', '可编程控制器', '电气安全监测', '智能防雷', '电涌保护器监测', '接地电阻监测', '三相不平衡监测', '工业物联网', '设备大脑', '谐波分析', '配电监测', '微物联', 'Yeslon'],
  industry: 'technology',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#1E40AF',
  secondaryColor: '#1E3A5F',
  logo: '/images/yeslon-logo.svg',
  features: [
    '分布式可编程控制技术',
    '电气安全监测',
    '智能防雷系统',
    '工业物联网平台',
    '电气隐患预警分析',
    '设备智能化诊断'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 微物联技术 | Yeslon',
    description: '微物联技术（深圳）有限公司——工业PLC、电气安全监测、智能防雷系统及工业物联网解决方案提供商，服务新能源充电站、机场、高速公路、工业园区等场景。',
    keywords: ['PLC', '可编程控制器', '电气安全监测', '智能防雷', '电涌保护器监测', '接地电阻监测', '三相不平衡监测', '工业物联网', '设备大脑', '谐波分析', '配电监测', '微物联', 'Yeslon'],
    ogImage: '/images/yeslon-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'weiwulian_tech',
    linkedin: 'yeslon-technologies'
  },
  contact: {
    phone: '0755-86536148',
    email: 'cc@fexlink.com',
    address: '深圳市福田深港科技合作区长富金茂大厦1908',
    workingHours: '周一至周五 9:00-18:00',
    website: 'www.fexlink.com'
  }
};
