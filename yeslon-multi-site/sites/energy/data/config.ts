import { SiteConfig } from '@shared/types';

export const energyConfig: SiteConfig = {
  subdomain: 'energy',
  domain: 'qcqe.com',
  siteName: '新能源充电与电气安全',
  siteNameEn: 'EV Charging & Electrical Safety',
  description: '微物联技术专注新能源充电站电气安全监测与电气隐患预警，提供充电站谐波分析、电动自行车充电棚安全监测、储能电站安全监测等一站式电气安全数字化解决方案。',
  keywords: ['充电站电气安全', '电气隐患监测', '谐波分析', '充电桩安全', '电动自行车充电安全', '储能安全监测', '电弧检测', '电气火灾预警'],
  industry: 'energy',
  region: 'CN',
  language: 'zh-CN',
  primaryColor: '#DC2626',
  secondaryColor: '#991B1B',
  logo: '/images/energy-logo.svg',
  features: [
    '充电站电气安全监测',
    '谐波指纹分析',
    '电动自行车充电安全',
    '储能安全监测'
  ],
  seo: {
    titleTemplate: '{pageTitle} - 新能源充电与电气安全 | 微物联技术',
    description: '微物联技术专注新能源充电站电气安全监测、电气隐患预警、谐波分析及电动自行车充电棚安全监测，为充电运营提供全方位电气安全数字化保障。',
    keywords: ['充电站电气安全监测', '谐波指纹分析', '充电桩漏电检测', '电动自行车充电安全', '储能安全监测', '电气隐患预警', '新能源充电安全'],
    ogImage: '/images/energy-og.jpg',
    twitterCard: 'summary_large_image'
  },
  social: {
    wechat: 'yeslon_energy',
    linkedin: 'yeslon-energy'
  },
  contact: {
    phone: '0755-86536148',
    email: 'cc@fexlink.com',
    address: '深圳市福田深港科技合作区长富金茂大厦1908',
    workingHours: '周一至周五 9:00-18:00',
    website: 'www.fexlink.com'
  }
};
