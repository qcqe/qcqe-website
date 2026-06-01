import { News } from '@shared/types';

export const lightningProtectionNews: News[] = [
  {
    id: 'lp-news-001',
    slug: 'fg-700-gateway-launch',
    title: 'FG-700系列5G智能防雷网关正式发布',
    description: 'FG-700支持5G/Wi-Fi 6双模通信，内置NPU加速单元，可本地运行SPD劣化预测模型。',
    content: '微物联技术发布FG-700系列5G智能防雷网关。新品搭载瑞芯微RK3588S处理器（6 TOPS NPU），可同时接入256台FS/FSS/FL/FR系列设备，内置SPD劣化寿命预测模型与雷电波形分类算法，支持5G/Wi-Fi 6/以太网三网冗余上行。FG-700已在深圳宝安机场T3航站楼完成试点部署。',
    category: '产品更新',
    image: '/images/lightning-protection/news/fg-700.jpg',
    publishedAt: '2024-11-10'
  },
  {
    id: 'lp-news-002',
    slug: 'national-lightning-standard',
    title: '微物联参与修订GB 50057《建筑物防雷设计规范》',
    description: '微物联技术作为参编单位参与新版GB 50057中"智能防雷监测系统"章节的修订工作。',
    content: '住房和城乡建设部标准定额研究所公布GB 50057《建筑物防雷设计规范》局部修订编制组名单，微物联技术（深圳）有限公司入选参编单位，负责新增"智能防雷监测系统"章节的起草工作。该章节将首次在国标层面规范SPD在线监测、接地电阻在线监测及雷电峰值记录的技术要求。',
    category: '行业动态',
    image: '/images/lightning-protection/news/gb50057.jpg',
    publishedAt: '2024-10-25'
  },
  {
    id: 'lp-news-003',
    slug: 'guangdong-lightning-drill',
    title: '微物联助力广东省2024年防雷安全应急演练',
    description: '微物联智能防雷监测系统作为技术支撑平台参与广东省气象局组织的防雷安全应急演练。',
    content: '广东省气象局在广州市举办2024年防雷安全应急演练，微物联智能防雷监测平台作为全省防雷数字化监管试点系统亮相。演练模拟广州塔遭雷击场景，系统在1.2秒内完成雷电流峰值记录、雷击定位及受影响SPD设备清单生成，全程自动化响应，获省气象局高度评价。',
    category: '公司新闻',
    image: '/images/lightning-protection/news/drill.jpg',
    publishedAt: '2024-09-30'
  },
  {
    id: 'lp-news-004',
    slug: 'spd-life-prediction-paper',
    title: '微物联SPD剩余寿命预测算法在国际期刊发表',
    description: '基于深度学习的SPD剩余寿命预测方法在IEEE Transactions on Power Delivery上发表。',
    content: '微物联技术研发团队与华南理工大学合作的论文"A Deep Learning Approach for Surge Protective Device Remaining Useful Life Prediction Based on Leakage Current Characteristics"被IEEE Transactions on Power Delivery录用。该研究基于FS系列监测仪采集的百万级SPD漏电流数据，实现了±8%以内的SPD剩余寿命预测精度。',
    category: '技术分享',
    image: '/images/lightning-protection/news/paper.jpg',
    publishedAt: '2024-09-10'
  }
];
