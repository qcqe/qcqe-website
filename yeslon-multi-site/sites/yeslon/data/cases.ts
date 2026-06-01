import { Case } from '@shared/types';

export const cases: Case[] = [
  {
    id: '1',
    slug: 'yangmao-highway-safety',
    title: '阳茂高速电气安全监测项目',
    description: '为阳茂高速公路沿线配电设施部署电气安全隐患监测系统，通过谐波指纹分析技术实现隧道照明、收费站、服务区配电回路的故障前预警，有效降低电气火灾风险，保障高速公路运营安全。',
    client: '广东阳茂高速公路有限公司',
    image: '/images/cases/yangmao-highway.jpg',
    solutionIds: ['3'],
    publishedAt: '2024-06-15'
  },
  {
    id: '2',
    slug: 'dalian-airport-safety',
    title: '大连机场航站楼电气安全项目',
    description: '为大连国际机场航站楼配电系统部署电气安全隐患监测与接地电阻在线监测系统，覆盖航站楼核心配电回路及接地网，实现电气参数7×24小时监控与隐患预警，提升机场电气系统可靠性。',
    client: '大连国际机场集团有限公司',
    image: '/images/cases/dalian-airport.jpg',
    solutionIds: ['3', '4'],
    publishedAt: '2024-08-20'
  },
  {
    id: '3',
    slug: 'ev-station-harmonic-monitoring',
    title: '新能源充电站谐波监测项目',
    description: '为某新能源运营公司旗下大型集中式充电站部署电气安全监测系统，重点针对充电桩产生的谐波污染进行特征分析与电能质量评估，制定谐波治理方案，保障充电站安全稳定运行。',
    client: '某新能源运营有限公司',
    image: '/images/cases/ev-station-harmonic.jpg',
    solutionIds: ['2'],
    publishedAt: '2024-10-10'
  },
  {
    id: '4',
    slug: 'industrial-park-monitoring',
    title: '工业园区配电监测项目',
    description: '为某大型工业园区实施配电回路监测与能耗管理系统，搭建覆盖全园区配电房的电气参数采集网络，实现分项能耗统计、负荷分析和能效优化，帮助园区年节约电费超15%。',
    client: '某工业园区管理委员会',
    image: '/images/cases/industrial-park.jpg',
    solutionIds: ['6'],
    publishedAt: '2024-11-05'
  },
  {
    id: '5',
    slug: 'petrochemical-lightning-protection',
    title: '某石化企业智能防雷项目',
    description: '为某石化集团生产基地部署智能防雷系统，安装FS电涌保护器监测仪及FSS智能型SPD，配置FL雷电峰值监测与FR接地电阻监测装置，通过FG智能网关实现防雷系统智慧化管理。',
    client: '某石化集团有限公司',
    image: '/images/cases/petrochemical-lightning.jpg',
    solutionIds: ['5'],
    publishedAt: '2025-01-20'
  }
];
