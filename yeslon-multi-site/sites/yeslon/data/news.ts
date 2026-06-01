import { News } from '@shared/types';

export const news: News[] = [
  {
    id: '1',
    slug: 'yeslon-new-plc-series-launch',
    title: 'Yeslon发布新一代X系列分布式可编程控制器，定义"设备大脑"新标准',
    description: 'X系列PLC采用多核处理器架构，支持EtherCAT高速总线与边缘AI推理能力，为工业自动化提供更强大的控制核心。',
    content: '微物联技术（深圳）有限公司正式发布新一代X系列分布式可编程控制器（PLC）。X系列采用ARM Cortex-A72多核处理器，主频高达1.8GHz，配备双千兆以太网接口，支持EtherCAT、PROFINET、Modbus TCP等多种工业实时以太网协议。同时，X系列内置轻量级AI推理引擎，可在边缘端完成设备故障预测与工艺参数优化，真正实现从"控制"到"智能"的跨越。该产品已通过CE、FCC及工业四级EMC认证，可在-40℃至85℃的宽温范围内稳定运行。',
    category: '产品发布',
    image: '/images/news/new-plc-series.jpg',
    publishedAt: '2025-05-10'
  },
  {
    id: '2',
    slug: 'ev-charging-electrical-safety-standard',
    title: '微物联参编《新能源充电站电气安全监测技术规范》团体标准发布',
    description: '由微物联技术参与起草的团体标准正式发布，填补了充电站电气安全在线监测领域的技术标准空白。',
    content: '由广东省充电设施协会归口、微物联技术（深圳）有限公司参与起草的《新能源充电站电气安全监测技术规范》团体标准正式发布实施。该标准规定了充电站电气安全监测系统的架构要求、功能规范、性能指标及数据接口，涵盖了谐波监测、温度监测、漏电流检测、SPD状态监测等关键技术要求。微物联在此次标准制定中贡献了在充电站电气安全监测领域的工程实践与技术积累。',
    category: '行业动态',
    image: '/images/news/charging-standard.jpg',
    publishedAt: '2025-04-22'
  },
  {
    id: '3',
    slug: 'dalian-airport-project-delivery',
    title: '大连机场航站楼电气安全监测系统通过验收',
    description: '微物联为大连国际机场部署的电气安全隐患监测与接地电阻在线监测系统正式通过验收，运行稳定。',
    content: '微物联技术承建的大连国际机场航站楼电气安全监测系统项目顺利通过竣工验收。该项目覆盖T1、T2航站楼的12个配电室、200余条核心配电回路，部署了ESA智能电表、ESB三相不平衡监测器、EST无线温度传感器及FR接地电阻监测仪等设备。系统上线运行三个月以来，累计发出早期预警14次，成功避免2起由接点发热引起的电气故障，得到机场管理部门的高度认可。',
    category: '项目进展',
    image: '/images/news/dalian-airport-delivery.jpg',
    publishedAt: '2025-03-15'
  },
  {
    id: '4',
    slug: 'harmonic-fingerprint-technology',
    title: '谐波指纹分析技术：电气隐患的"DNA鉴定"',
    description: '微物联自主研发的谐波指纹分析技术，通过对电气线路高频谐波特征的学习与匹配，实现隐患的精准识别。',
    content: '微物联技术团队在电气安全隐患监测领域取得重要突破——谐波指纹分析技术。该技术通过对线路电压、电流波形进行最高256点/周期的精细采样，提取不同电气设备及故障类型产生的谐波特征图谱，结合深度学习模型实现隐患精准分类识别。实验数据显示，该技术对电弧故障的识别准确率达97.3%，对绝缘老化早期迹象的检出率较传统阈值法提升了4倍以上。目前该技术已应用于阳茂高速等多个试点项目。',
    category: '技术指南',
    image: '/images/news/harmonic-fingerprint.jpg',
    publishedAt: '2025-02-28'
  }
];
