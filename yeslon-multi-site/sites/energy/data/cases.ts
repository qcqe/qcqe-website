import { Case } from '@shared/types';

export const energyCases: Case[] = [
  {
    id: '1',
    slug: 'state-grid-project',
    title: '某省级电网智能调度项目',
    description: '为某省级电网建设的智能调度系统，实现了全省电网的实时监控和优化调度。',
    client: '某省级电网公司',
    image: '/images/energy/cases/state-grid.jpg',
    solutionIds: ['1'],
    publishedAt: '2024-01-20'
  },
  {
    id: '2',
    slug: 'steel-plant-ems',
    title: '某大型钢铁企业能源管理项目',
    description: '帮助某大型钢铁企业建立完善的能源管理系统，年节能效益超过2000万元。',
    client: '某大型钢铁企业',
    image: '/images/energy/cases/steel-plant.jpg',
    solutionIds: ['2'],
    publishedAt: '2024-02-10'
  },
  {
    id: '3',
    slug: 'solar-farm-monitoring',
    title: '某大型光伏电站监控项目',
    description: '为总装机容量500MW的光伏电站建设的智能化监控平台。',
    client: '某新能源公司',
    image: '/images/energy/cases/solar-farm.jpg',
    solutionIds: ['3'],
    publishedAt: '2024-02-25'
  },
  {
    id: '4',
    slug: 'industrial-park-storage',
    title: '某工业园区储能项目',
    description: '为某工业园区建设的储能系统，参与电网调峰，年收益超过500万元。',
    client: '某工业园区管理委员会',
    image: '/images/energy/cases/park-storage.jpg',
    solutionIds: ['4'],
    publishedAt: '2024-03-15'
  },
  {
    id: '5',
    slug: 'campus-microgrid',
    title: '某大学校园微电网项目',
    description: '为某知名大学建设的风光储一体化微电网系统，实现校园100%清洁能源供电。',
    client: '某知名大学',
    image: '/images/energy/cases/campus.jpg',
    solutionIds: ['5'],
    publishedAt: '2024-04-05'
  }
];
