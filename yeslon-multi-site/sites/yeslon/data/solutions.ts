import { Solution } from '@shared/types';

export const solutions: Solution[] = [
  {
    id: '1',
    slug: 'distributed-plc-control',
    title: '分布式可编程控制系统',
    description: '基于CC/CR/X系列工业分布式可编程控制器PLC（"设备大脑"），实现工业现场设备的高速采集、逻辑控制与边缘计算，支持IEC 61131-3编程标准，适用于智能制造、能源管理、基础设施自动化等场景。',
    features: [
      'CC/CR/X系列分布式PLC控制器',
      '支持IEC 61131-3标准编程语言',
      '高速实时数据采集与边缘计算',
      '模块化设计，灵活扩展',
      'EtherCAT/PROFINET/Modbus TCP多协议通信',
      '工业级可靠性，适应严苛环境'
    ],
    category: 'industrial-control',
    image: '/images/solutions/plc-control.jpg',
    publishedAt: '2024-01-15'
  },
  {
    id: '2',
    slug: 'ev-charging-electrical-safety',
    title: '新能源充电站电气安全解决方案',
    description: '面向新能源汽车充电站/换电站的电气安全整体方案，集成ESA全要素智能电表、ESB三相不平衡监测器、EST无线温度监测装置，实现充电桩电气参数实时监测、故障预警和远程运维。',
    features: [
      '充电桩电气参数实时监测',
      '三相不平衡智能诊断',
      '接点无线温度在线监测',
      '漏电流与电弧故障检测',
      '谐波分析与电能质量评估',
      '远程告警与运维管理平台'
    ],
    category: 'energy',
    image: '/images/solutions/ev-charging.jpg',
    publishedAt: '2024-02-10'
  },
  {
    id: '3',
    slug: 'electrical-hazard-monitoring',
    title: '电气安全隐患监测与分析系统',
    description: '基于谐波指纹分析的电气隐患监测系统，对线路电气参数进行高频采样与特征提取，识别电弧、接触不良、绝缘老化等早期隐患，实现从"被动维修"到"主动预警"的转变。',
    features: [
      '谐波指纹特征提取与识别',
      '电弧故障早期预警',
      '绝缘老化趋势分析',
      '接触不良热隐患定位',
      '负荷特征异常检测',
      '电气安全评估报告自动生成'
    ],
    category: 'safety',
    image: '/images/solutions/hazard-monitoring.jpg',
    publishedAt: '2024-03-05'
  },
  {
    id: '4',
    slug: 'ground-resistance-monitoring',
    title: '接地电阻在线监测系统',
    description: '采用FR/FRP系列接地电阻监测仪，对接地系统的电阻值进行7×24小时在线监测，支持多测点同步采集、趋势分析及阈值告警，广泛应用于变电站、通信基站、石化设施等场景。',
    features: [
      '接地电阻实时在线测量',
      '多测点同步监测与对比',
      '阻值趋势变化智能分析',
      '超限阈值分级告警',
      '雷击事件记录与分析',
      '远程集中管理平台'
    ],
    category: 'safety',
    image: '/images/solutions/ground-resistance.jpg',
    publishedAt: '2024-03-20'
  },
  {
    id: '5',
    slug: 'smart-lightning-protection',
    title: '智能防雷系统解决方案',
    description: '基于FS电涌保护器监测仪、FSS/FSP智能型SPD、FL雷电峰值监测仪、FR/FRP接地电阻监测仪及FG智能网关的完整智能防雷体系，实现SPD劣化预警、雷电流峰值记录、接地状态监测及远程管理。',
    features: [
      'SPD劣化状态实时监测',
      '雷电流峰值幅值记录',
      '电涌保护器寿命预测',
      '接地电阻在线监测',
      '智能网关数据汇聚上云',
      '防雷系统综合评估报告'
    ],
    category: 'lightning-protection',
    image: '/images/solutions/lightning-protection.jpg',
    publishedAt: '2024-04-10'
  },
  {
    id: '6',
    slug: 'power-distribution-monitoring',
    title: '配电监测与能耗管理系统',
    description: '面向工业园区、商业综合体、公共建筑等场景的配电回路监测与能源管理方案，通过ESA智能电表及分布式采集单元实现全回路电气参数采集、负荷分析与能效优化。',
    features: [
      '全回路电气参数实时采集',
      '分项能耗统计与分析',
      '负荷曲线与需量管理',
      '电能质量在线评估',
      '设备运行效率分析',
      '节能优化策略辅助决策'
    ],
    category: 'energy',
    image: '/images/solutions/power-monitoring.jpg',
    publishedAt: '2024-04-25'
  }
];
