import { PageConfig } from '@shared/types';

export const industrialPlcPages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联工业分布式可编程控制系统 — CC/CR/X系列PLC · 设备大脑 · HMI · 工业网关，赋能智能制造',
    keywords: ['PLC', '分布式控制', 'CC系列', 'CR系列', 'X系列', 'HMI'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'products',
    title: '产品中心',
    description: 'CC/CR/X系列PLC、分布式可编程控制器、HMI人机界面、工业通信网关',
    keywords: ['PLC产品', 'CC系列PLC', 'CR系列PLC', 'X系列PLC', 'HMI', '工业网关'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'products/cc-series',
    title: 'CC系列PLC',
    description: 'CC系列高性能PLC，支持IEC 61131-3五类编程语言，适用于复杂逻辑与运动控制',
    keywords: ['CC系列', 'CC-PLC', '高性能PLC', '运动控制'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/cr-series',
    title: 'CR系列分布式PLC',
    description: 'CR系列分布式可编程控制器，支持EtherCAT总线组网，适用于分布式控制场景',
    keywords: ['CR系列', '分布式PLC', 'CR-PLC', 'EtherCAT'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/x-series',
    title: 'X系列微型PLC',
    description: 'X系列超微型PLC，卡片式设计，支持I/O自由扩展，适用于设备级控制',
    keywords: ['X系列', '微型PLC', '卡片式PLC', '设备控制'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/brain',
    title: '分布式可编程控制器"设备大脑"',
    description: '"设备大脑"是一款集成PLC与边缘计算的分布式智能控制器，支持本地决策与云边协同',
    keywords: ['设备大脑', '边缘控制器', '分布式控制', '云边协同'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/hmi',
    title: 'HMI人机界面',
    description: 'HMI系列人机界面，4.3寸~15.6寸多规格，支持工业以太网与远程监控',
    keywords: ['HMI', '人机界面', '触摸屏', '工业显示'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'solutions',
    title: '解决方案',
    description: '工业分布式控制解决方案，覆盖产线自动化、设备控制、能源管理、楼宇自控',
    keywords: ['工业控制方案', 'PLC方案', '分布式方案', '产线自动化'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'specifications',
    title: '技术规格',
    description: 'CC/CR/X系列PLC及HMI产品详细技术参数与编程手册',
    keywords: ['技术规格', 'PLC参数', 'CC参数', 'CR参数', 'X参数', 'HMI参数'],
    changeFreq: 'monthly',
    priority: 0.7
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '工业分布式可编程控制系统在各行业的成功应用案例',
    keywords: ['PLC案例', '工业控制案例', '分布式控制案例'],
    changeFreq: 'weekly',
    priority: 0.8
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '工业PLC控制产品咨询与技术支持',
    keywords: ['联系我们', 'PLC咨询'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
