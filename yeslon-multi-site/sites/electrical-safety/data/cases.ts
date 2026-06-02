import { Case } from '@shared/types';

export const electricalSafetyCases: Case[] = [
  {
    id: 'es-case-001',
    slug: 'hospital-electrical-safety',
    title: '某三甲医院电气安全监测项目',
    description: '为某三甲医院全院配电系统部署ESA智能电表及EST无线温度传感器，覆盖所有配电柜与关键用电回路，成功预警多起电气隐患，避免潜在电气火灾事故。',
    client: '某三甲医院',
    image: '/images/electrical-safety/cases/hospital.jpg',
    solutionIds: ['es-sol-001', 'es-sol-004', 'es-sol-005'],
    publishedAt: '2024-08-20'
  },
  {
    id: 'es-case-002',
    slug: 'data-center-monitoring',
    title: '某大型数据中心配电监测项目',
    description: '对某大型数据中心的UPS输入输出柜、列头柜及精密配电柜部署ESA微型智能电表及EST无线温度传感器，实现IT负载回路级能耗与温度全监测，显著降低PUE。',
    client: '某数据中心运营商',
    image: '/images/electrical-safety/cases/datacenter.jpg',
    solutionIds: ['es-sol-001', 'es-sol-005'],
    publishedAt: '2024-09-10'
  },
  {
    id: 'es-case-003',
    slug: 'manufacturing-unbalance',
    title: '某电子制造厂三相不平衡治理项目',
    description: '某大型电子制造企业车间配电房三相不平衡度持续超标，导致变压器发热和频繁跳闸。部署ESB监测器并配合自动补偿装置后，三相不平衡度降至安全范围以内，变压器寿命延长。',
    client: '某电子制造企业',
    image: '/images/electrical-safety/cases/manufacturing.jpg',
    solutionIds: ['es-sol-002'],
    publishedAt: '2024-09-25'
  },
  {
    id: 'es-case-004',
    slug: 'commercial-ai-analysis',
    title: '某商业综合体电气隐患AI分析项目',
    description: '为某大型商业综合体部署电气隐患AI分析系统，接入ESA电表及EST传感器，AI平台在运行首月即识别出多处隐蔽性电弧故障隐患，避免直接经济损失。',
    client: '某商业综合体管理公司',
    image: '/images/electrical-safety/cases/commercial.jpg',
    solutionIds: ['es-sol-003', 'es-sol-004'],
    publishedAt: '2024-10-15'
  }
];
