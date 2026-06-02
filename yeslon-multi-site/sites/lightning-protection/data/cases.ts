import { Case } from '@shared/types';

export const lightningProtectionCases: Case[] = [
  {
    id: 'lp-case-001',
    slug: 'airport-lightning',
    title: '某国际机场智能防雷项目',
    description: '为某国际机场航站楼及飞行区部署FSS智能SPD监测仪、FL雷电峰值监测仪、FRP接地电阻监测仪及FG智能网关，实现航站楼配电系统SPD全在线监测、接地电阻远程巡检及飞行区雷击定位。',
    client: '某机场集团',
    image: '/images/lightning-protection/cases/airport.jpg',
    solutionIds: ['lp-sol-001', 'lp-sol-002', 'lp-sol-003', 'lp-sol-004'],
    publishedAt: '2024-08-30'
  },
  {
    id: 'lp-case-002',
    slug: 'chemical-plant-lightning',
    title: '某炼化厂防雷监测项目',
    description: '为某石化炼化一体化基地部署防爆型FS-EX监测仪、FL-EX雷电峰值监测仪、FRP-IS本安接地电阻监测仪及防爆网关，覆盖炼油装置、乙烯裂解、储罐区等全部防爆区域。',
    client: '某石油化工集团',
    image: '/images/lightning-protection/cases/chemical.jpg',
    solutionIds: ['lp-sol-005', 'lp-sol-004'],
    publishedAt: '2024-09-20'
  },
  {
    id: 'lp-case-003',
    slug: 'wind-farm-lightning',
    title: '某海上风电场防雷监测项目',
    description: '为某海上风电场多台风机部署FL耐候型雷电峰值监测仪及FRP防腐型接地电阻监测仪，通过LoRa组网上传至FG网关，同时监测风机叶片雷击与塔筒接地状况。',
    client: '某新能源发电企业',
    image: '/images/lightning-protection/cases/windfarm.jpg',
    solutionIds: ['lp-sol-002', 'lp-sol-003', 'lp-sol-004'],
    publishedAt: '2024-10-10'
  },
  {
    id: 'lp-case-004',
    slug: 'subway-lightning',
    title: '某地铁线路智能防雷监测项目',
    description: '为某地铁新建线路各车站及车辆段部署FS SPD监测仪、FR接地电阻监测仪及FG网关，实现全线SPD与接地系统的集中智能监测与运维。',
    client: '某地铁集团',
    image: '/images/lightning-protection/cases/subway.jpg',
    solutionIds: ['lp-sol-001', 'lp-sol-003', 'lp-sol-004'],
    publishedAt: '2024-10-28'
  }
];
