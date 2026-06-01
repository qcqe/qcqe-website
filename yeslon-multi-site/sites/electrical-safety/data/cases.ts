import { Case } from '@shared/types';

export const electricalSafetyCases: Case[] = [
  {
    id: 'es-case-001',
    slug: 'sz-hospital-electrical-safety',
    title: '深圳市某三甲医院电气安全监测项目',
    description: '为深圳市某三甲医院全院配电系统部署ESA-500智能电表236台、EST-WS无线温度传感器412个、ESB-200三相不平衡监测器38台，覆盖所有配电柜与关键用电回路。运行半年后成功预警电气隐患27起，避免潜在电气火灾事故。',
    client: '深圳市某三甲医院',
    image: '/images/electrical-safety/cases/hospital.jpg',
    solutionIds: ['es-sol-001', 'es-sol-004', 'es-sol-005'],
    publishedAt: '2024-08-20'
  },
  {
    id: 'es-case-002',
    slug: 'gd-data-center',
    title: '广东某大型数据中心配电监测项目',
    description: '对广东某大型数据中心的UPS输入输出柜、列头柜及精密配电柜部署ESA-M301微型智能电表428台，配合EST无线温度传感器856个，实现IT负载回路级能耗与温度全监测。PUE降低0.15。',
    client: '广东某数据中心运营商',
    image: '/images/electrical-safety/cases/datacenter.jpg',
    solutionIds: ['es-sol-001', 'es-sol-005'],
    publishedAt: '2024-09-10'
  },
  {
    id: 'es-case-003',
    slug: 'gd-manufacturing-plant',
    title: '东莞某电子制造厂三相不平衡治理项目',
    description: '东莞某大型电子制造企业车间配电房三相不平衡度持续超过25%，导致变压器发热和频繁跳闸。部署ESB-400监测器并配合自动补偿装置后，三相不平衡度降至5%以内，变压器寿命延长。',
    client: '东莞某电子制造企业',
    image: '/images/electrical-safety/cases/manufacturing.jpg',
    solutionIds: ['es-sol-002'],
    publishedAt: '2024-09-25'
  },
  {
    id: 'es-case-004',
    slug: 'sz-commercial-complex',
    title: '深圳某商业综合体电气隐患AI分析项目',
    description: '为深圳某大型商业综合体（建筑面积28万m²）部署电气隐患AI分析系统，接入ESA电表183台、EST传感器356个。AI平台在运行首月即识别出3处隐蔽性电弧故障隐患，避免直接经济损失超千万元。',
    client: '深圳某商业综合体管理公司',
    image: '/images/electrical-safety/cases/commercial.jpg',
    solutionIds: ['es-sol-003', 'es-sol-004'],
    publishedAt: '2024-10-15'
  }
];
