import { Case } from '@shared/types';

export const cases: Case[] = [
  {
    id: '1',
    slug: 'energy-company-case',
    title: '某大型能源集团能源管理项目',
    description: '为年耗电量超过10亿度的能源集团部署智能能源管理系统，实现年节能15%的目标。',
    client: '某大型能源集团',
    image: '/images/cases/energy-case.jpg',
    solutionIds: ['1'],
    publishedAt: '2024-01-20'
  },
  {
    id: '2',
    slug: 'manufacturing-company-case',
    title: '某汽车制造企业智能工厂项目',
    description: '帮助某知名汽车制造企业建设智能工厂，产能提升20%，产品不良率降低35%。',
    client: '某汽车制造企业',
    image: '/images/cases/manufacturing-case.jpg',
    solutionIds: ['2'],
    publishedAt: '2024-02-25'
  },
  {
    id: '3',
    slug: 'agriculture-company-case',
    title: '某农业科技公司智慧农业项目',
    description: '在东北地区建设万亩智慧农田，水资源节省40%，农作物产量提升25%。',
    client: '某农业科技公司',
    image: '/images/cases/agriculture-case.jpg',
    solutionIds: ['3'],
    publishedAt: '2024-03-15'
  },
  {
    id: '4',
    slug: 'logistics-company-case',
    title: '某大型物流企业智慧仓储项目',
    description: '为某知名物流企业建设智能化仓储中心，仓储效率提升60%，人力成本降低45%。',
    client: '某大型物流企业',
    image: '/images/cases/logistics-case.jpg',
    solutionIds: ['4'],
    publishedAt: '2024-04-10'
  },
  {
    id: '5',
    slug: 'hospital-case',
    title: '某三甲医院智慧医疗项目',
    description: '帮助某三甲医院实现全院信息化升级，患者满意度提升30%，医护人员效率提升40%。',
    client: '某三甲医院',
    image: '/images/cases/healthcare-case.jpg',
    solutionIds: ['5'],
    publishedAt: '2024-05-18'
  }
];
