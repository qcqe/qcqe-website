import { PageConfig } from '@shared/types';

export const pages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联技术（深圳）有限公司——工业分布式可编程控制器PLC、电气安全监测、智能防雷系统及工业物联网解决方案提供商。',
    keywords: ['微物联', 'Yeslon', 'PLC', '可编程控制器', '电气安全监测', '智能防雷', '工业物联网', '设备大脑'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'products',
    title: '产品中心',
    description: '工业分布式可编程控制器PLC（CC/CR/X系列）、电气安全监测（ESA智能电表、ESB三相不平衡监测器、EST无线测温）、智能防雷（FS监测仪、FSS/FSP智能SPD、FL雷电峰值监测、FR接地电阻监测、FG网关）、工业设备手环等产品。',
    keywords: ['PLC', '可编程控制器', 'CC系列', 'CR系列', 'X系列', 'ESA全要素智能电表', 'ESB三相不平衡监测器', 'EST无线温度监测', 'FS电涌保护器监测仪', 'FSS智能型SPD', 'FSP智能型SPD', 'FL雷电峰值监测仪', 'FR接地电阻监测仪', 'FRP接地电阻监测仪', 'FG智能网关', '工业设备手环'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'solutions',
    title: '解决方案',
    description: '分布式可编程控制系统、新能源充电站电气安全、电气安全隐患监测分析（谐波指纹）、接地电阻在线监测、智能防雷系统、配电监测与能耗管理等行业解决方案。',
    keywords: ['解决方案', '分布式可编程控制系统', '充电站电气安全', '谐波指纹分析', '接地电阻监测', '智能防雷', '配电监测', '能耗管理', '行业方案'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '阳茂高速电气安全监测项目、大连机场航站楼电气安全项目、新能源充电站谐波监测项目、工业园区配电监测项目、石化企业智能防雷项目等典型案例。',
    keywords: ['成功案例', '阳茂高速', '大连机场', '充电站谐波监测', '配电监测', '智能防雷', '项目案例'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'news',
    title: '新闻动态',
    description: '微物联新闻动态入口：公司新闻与行业知识两大栏目，了解企业动态、产品发布及电气安全、智能防雷、工业物联网等技术文档与行业解读。',
    keywords: ['新闻动态', '公司新闻', '行业知识', '微物联', 'Yeslon', '技术文档'],
    changeFreq: 'daily',
    priority: 0.8
  },
  {
    path: 'news/company',
    title: '公司新闻',
    description: '微物联技术公司新闻：产品发布、战略合作、荣誉奖项、项目进展与企业动态。',
    keywords: ['公司新闻', '企业动态', '产品发布', '战略合作', '微物联', 'Yeslon'],
    changeFreq: 'weekly',
    priority: 0.75
  },
  {
    path: 'news/knowledge',
    title: '行业知识',
    description: '电气安全、智能防雷、工业物联网行业知识库：技术解读、标准规范、应用指南、白皮书与专业文档。',
    keywords: ['行业知识', '技术文档', '电气安全', '智能防雷', '工业物联网', '标准解读', '应用指南', '白皮书'],
    changeFreq: 'weekly',
    priority: 0.85
  },
  {
    path: 'about',
    title: '关于我们',
    description: '微物联技术（深圳）有限公司成立于2016年，总部位于深圳福田，专注工业物联网、电气安全监测、智能防雷及工业分布式控制领域的国家高新技术企业。拥有从智能传感器、边缘计算网关到AI分析云平台的全栈自研能力，服务新能源充电站、机场、工业园区等200+客户。',
    keywords: ['关于我们', '公司介绍', '崔灿', 'EMBA', '微物联', 'Yeslon', '国家高新技术企业'],
    changeFreq: 'monthly',
    priority: 0.6
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '微物联技术（深圳）有限公司联系方式：深圳市福田深港科技合作区长富金茂大厦1908，电话0755-86536148，邮箱cc@fexlink.com。',
    keywords: ['联系我们', '联系方式', '深圳福田', '0755-86536148', '咨询', '商务合作'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
