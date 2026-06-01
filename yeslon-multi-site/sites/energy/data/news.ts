import { News } from '@shared/types';

export const energyNews: News[] = [
  {
    id: '1',
    slug: 'ev-charging-safety-mandate',
    title: '六部门联合发文：充电桩必须配备电气安全监测装置',
    description: '国家六部门联合发布新能源汽车充电基础设施安全监管新规，要求公共充电桩强制配备漏电监测、电弧检测等电气安全装置。',
    content: '近日，国家能源局、应急管理部等六部门联合印发《关于加强新能源汽车充电基础设施安全监管的指导意见》，明确要求新建公共充电桩必须配备电气安全监测装置，包括漏电流监测、故障电弧检测、绝缘监测等功能，并实现数据实时上传至监管平台。该政策标志着充电站电气安全正式进入强监管时代，微物联技术的充电站安全监测方案可全面满足新规要求。',
    category: '政策解读',
    image: '/images/energy/news/policy-safety.jpg',
    publishedAt: '2024-10-15'
  },
  {
    id: '2',
    slug: 'harmonic-fingerprint-tech',
    title: '谐波指纹识别技术在电气隐患监测中的应用突破',
    description: '微物联技术自主研发的高频谐波指纹识别算法在电气隐患识别准确率上取得重大突破，可实现线路隐患的提前30天预警。',
    content: '微物联技术研发团队宣布，基于高频谐波指纹识别的电气隐患智能分析系统在实测中取得重大突破，对线路接触不良、绝缘劣化、故障电弧等常见电气隐患的识别准确率达到97.3%，平均可在隐患发展为事故前30天发出预警。该技术通过提取供电线路中的高频特征谐波信号，利用AI深度学习模型进行模式识别，实现了从"被动报警"到"主动预防"的跨越。',
    category: '技术分享',
    image: '/images/energy/news/harmonic-breakthrough.jpg',
    publishedAt: '2024-09-25'
  },
  {
    id: '3',
    slug: 'ebike-fire-prevention',
    title: '电动自行车充电棚火灾事故分析与安全对策',
    description: '统计分析近两年电动自行车充电棚火灾事故，微物联技术提出充电棚电气安全标准化建设方案。',
    content: '据应急管理部消防救援局数据，2023年全国共发生电动自行车火灾事故2.1万余起，其中充电环节引发的占比超过65%。微物联技术针对充电棚电气安全痛点，提出"监测+保护+管理"三位一体的标准化建设方案，通过在充电回路部署智能电气安全监测终端，实现对漏电、过载、温度异常的实时监测与自动断电保护，从源头杜绝电气火灾隐患。',
    category: '行业观察',
    image: '/images/energy/news/ebike-fire.jpg',
    publishedAt: '2024-09-10'
  },
  {
    id: '4',
    slug: 'energy-storage-safety-standards',
    title: '储能电站安全监测新国标发布，电气安全成硬性要求',
    description: '新版《电化学储能电站安全规程》正式发布，明确要求储能电站必须部署电气安全监测系统。',
    content: '国家标准委正式发布新版《电化学储能电站安全规程》（GB/T 42288-2024），新规在电气安全方面提出了更高要求，包括电池簇电气参数实时监测、绝缘电阻在线检测、故障电弧检测以及多参数融合预警等。微物联技术储能电站安全监测系统全面对标新国标，已在多个项目实现部署，为客户提供符合标准要求的电气安全解决方案。',
    category: '政策解读',
    image: '/images/energy/news/storage-standards.jpg',
    publishedAt: '2024-08-20'
  }
];
