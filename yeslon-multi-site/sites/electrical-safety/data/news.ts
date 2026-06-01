import { News } from '@shared/types';

export const electricalSafetyNews: News[] = [
  {
    id: 'es-news-001',
    slug: 'esa-700-launch',
    title: 'ESA-700系列全要素智能电表正式发布',
    description: 'ESA-700系列在ESA-500基础上新增4G cat.1直连通信与边缘AI推理能力，可实现本地电弧故障识别。',
    content: '微物联技术正式发布ESA-700系列全要素智能电表。新品搭载海思Hi3861V100边缘计算芯片，支持在电表本地运行轻量级电弧故障检测模型，识别准确率达97.3%。同时内置4G cat.1模组，无需外接网关即可直接上云，大幅降低部署成本。ESA-700系列已通过国网电科院型式试验认证。',
    category: '产品更新',
    image: '/images/electrical-safety/news/esa-700.jpg',
    publishedAt: '2024-11-05'
  },
  {
    id: 'es-news-002',
    slug: 'electrical-safety-standard',
    title: '参编《电气安全物联网监测系统技术规范》团体标准发布',
    description: '微物联技术作为主要起草单位参与的T/CESA XXXX-2024团体标准正式发布实施。',
    content: '由中国电子工业标准化技术协会归口的《电气安全物联网监测系统技术规范》正式发布。微物联技术（深圳）有限公司作为主要起草单位，主导了其中"数据采集与传输协议"和"智能分析与预警"两个核心章节的编写。该标准填补了国内电气安全物联网监测领域的技术标准空白。',
    category: '行业动态',
    image: '/images/electrical-safety/news/standard.jpg',
    publishedAt: '2024-10-20'
  },
  {
    id: 'es-news-003',
    slug: 'sz-fire-department-cooperation',
    title: '微物联与深圳市消防协会达成战略合作',
    description: '双方将共同推进电气火灾监控预警技术在城中村、老旧小区等场景的规模化应用。',
    content: '微物联技术与深圳市消防协会签署战略合作协议。双方计划在未来两年内，在深圳市1000个以上城中村出租屋和老旧小区部署电气安全监测终端不少于5万台，构建覆盖全市的电气火灾监控预警网络。首期项目已在福田区沙头街道启动。',
    category: '公司新闻',
    image: '/images/electrical-safety/news/fire-dept.jpg',
    publishedAt: '2024-10-08'
  },
  {
    id: 'es-news-004',
    slug: 'ai-hazard-analysis-award',
    title: '电气隐患AI分析系统获工信部创新应用大赛一等奖',
    description: '微物联"基于多源数据融合的电气隐患AI分析系统"在工信部举办的2024年物联网创新应用大赛中荣获一等奖。',
    content: '微物联技术参赛项目"基于ESA/ESB/EST多源数据融合的电气隐患AI分析系统"在全国286个参赛项目中脱颖而出，荣获工信部2024年物联网创新应用大赛一等奖。评审专家组认为该系统在电弧故障识别率、隐患预测准确率等关键指标上达到国际先进水平。',
    category: '公司新闻',
    image: '/images/electrical-safety/news/award.jpg',
    publishedAt: '2024-09-15'
  }
];
