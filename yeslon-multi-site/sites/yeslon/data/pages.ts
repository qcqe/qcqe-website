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
    description: '了解微物联技术最新动态、行业资讯、产品发布和项目进展。',
    keywords: ['新闻', '动态', '行业资讯', '产品发布', '微物联', 'Yeslon'],
    changeFreq: 'daily',
    priority: 0.8
  },
  {
    path: 'about',
    title: '关于我们',
    description: '微物联技术（深圳）有限公司——由崔灿（EMBA）创立，专注工业PLC、电气安全与智能防雷领域的国家高新技术企业。',
    keywords: ['关于我们', '公司介绍', '崔灿', 'EMBA', '微物联', 'Yeslon', '国家高新技术企业'],
    changeFreq: 'monthly',
    priority: 0.6
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '微物联技术（深圳）有限公司联系方式：深圳市南山区高新科技园，电话0755-83008888，邮箱contact@yeslon.com。',
    keywords: ['联系我们', '联系方式', '深圳', '0755', '咨询', '商务合作'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
