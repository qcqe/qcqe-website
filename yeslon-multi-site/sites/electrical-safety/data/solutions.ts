import { Solution } from '@shared/types';

export const electricalSafetySolutions: Solution[] = [
  {
    id: 'es-sol-001',
    slug: 'esa-smart-meter',
    title: 'ESA全要素智能电表解决方案',
    description: '基于ESA-300/ESA-500系列全要素智能电表，实现配电回路的电压、电流、有功无功功率、功率因数、谐波畸变率、温度等多参数高精度同步采集，支持Modbus RTU/TCP、DL/T645、MQTT多协议输出。',
    features: [
      '电压/电流/功率/谐波/温度全要素同步采集',
      '0.5S级电能计量精度',
      '2~63次谐波分析',
      '支持Modbus RTU/TCP、DL/T645、MQTT协议',
      '本地数据存储与断点续传'
    ],
    category: 'smart-meter',
    image: '/images/electrical-safety/esa-solution.jpg',
    publishedAt: '2024-06-01'
  },
  {
    id: 'es-sol-002',
    slug: 'esb-unbalance-monitoring',
    title: 'ESB三相不平衡监测系统',
    description: '采用ESB-200/ESB-400三相不平衡监测器，对低压配电系统进行全时三相不平衡度监测，实时捕捉零序电流异常，提前预警中性线过载与变压器偏磁风险。',
    features: [
      '三相电压/电流不平衡度实时计算',
      '零序电流高精度采样（0.5%级）',
      '不平衡越限告警与事件记录',
      '支持自动补偿装置联动控制',
      '历史趋势分析与报表导出'
    ],
    category: 'unbalance-monitoring',
    image: '/images/electrical-safety/esb-solution.jpg',
    publishedAt: '2024-06-10'
  },
  {
    id: 'es-sol-003',
    slug: 'ai-hazard-analysis',
    title: '电气隐患AI分析系统',
    description: '基于EdgeAI推理引擎的电气隐患分析平台，融合ESA/ESB/EST多源数据，通过深度学习模型识别电弧故障、绝缘老化、接触电阻异常等隐蔽隐患，准确率超过95%。',
    features: [
      '多源数据融合与特征提取',
      '电弧故障检测与定位',
      '绝缘老化趋势预测',
      '接触电阻异常识别',
      '隐患等级自动分级与工单推送'
    ],
    category: 'ai-analysis',
    image: '/images/electrical-safety/ai-solution.jpg',
    publishedAt: '2024-07-01'
  },
  {
    id: 'es-sol-004',
    slug: 'distribution-circuit-monitoring',
    title: '配电回路综合监测方案',
    description: '面向低压配电柜/配电箱的回路级综合监测方案，每回路部署ESA-M301微型智能电表，配合EST-WS无线温度传感器采集接点温度，通过FG-500智能网关统一上云。',
    features: [
      '回路级电参数全采集',
      '接点无线测温全覆盖',
      'FG-500网关边缘计算与规约转换',
      '支持4G/Wi-Fi/Ethernet上行',
      '云平台远程监控与告警'
    ],
    category: 'distribution-monitoring',
    image: '/images/electrical-safety/distribution-solution.jpg',
    publishedAt: '2024-07-15'
  },
  {
    id: 'es-sol-005',
    slug: 'temperature-early-warning',
    title: 'EST无线测温预警系统',
    description: '基于EST-TH/EST-TC无线温度传感器和EST-R100接收终端的温度监测预警系统，适用于开关柜触头、电缆接头、母线连接点等关键部位的温度在线监测。',
    features: [
      '支持接触式(NTC/PT100)与非接触式(红外)测温',
      '无线传输距离≥200m（视距）',
      '测温范围-40℃~+200℃',
      '精度±0.5℃',
      '智能温升趋势分析与提前预警'
    ],
    category: 'temperature-monitoring',
    image: '/images/electrical-safety/est-solution.jpg',
    publishedAt: '2024-08-01'
  }
];
