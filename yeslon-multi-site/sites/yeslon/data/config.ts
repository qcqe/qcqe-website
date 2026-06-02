import { SiteConfig } from '@shared/types';

export const yeslonConfig: SiteConfig = {
  subdomain: '',
  domain: 'qcqe.com',
  siteName: '微物联技术（深圳）有限公司',
  siteNameEn: 'Yeslon Technologies',
  description: '微物联技术（深圳）有限公司成立于2016年，总部位于深圳福田深港科技合作区，国家高新技术企业。专注工业物联网、电气安全监测、智能防雷及工业分布式控制领域，拥有从智能传感器、边缘计算网关到AI分析平台、云平台的完整"端-边-云"全栈自研能力。产品覆盖工业PLC、电气安全监测（ESA/ESB/EST/ESE/ESF等系列）、智能防雷（FS/FSS/FL/FR/FG系列）、智能断路器及FEXLINK工业互联网平台，服务新能源充电站、工业园区、机场、高速公路、数据中心等200+客户。以"让每一度电都可见、可懂、可优化"为使命，"有电，就有微物联"为品牌愿景，"用数据重构能源效率"为技术理念。',
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
    description: '微物联技术（深圳）有限公司——国家高新技术企业，专注工业物联网、电气安全监测、智能防雷及工业分布式控制领域，拥有"端-边-云"全栈自研能力，服务新能源充电站、机场、工业园区等200+客户。',
    keywords: ['微物联技术', '工业物联网', 'PLC', '电气安全监测', '智能防雷', 'ESA智能电表', 'ESB三相不平衡', 'FS防雷监测', 'FSS智能SPD', '接地电阻监测', '工业分布式控制', '新能源充电安全'],
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
