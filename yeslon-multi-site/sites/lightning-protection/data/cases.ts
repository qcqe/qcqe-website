import { Case } from '@shared/types';

export const lightningProtectionCases: Case[] = [
  {
    id: 'lp-case-001',
    slug: 'sz-airport-lightning',
    title: '深圳宝安国际机场智能防雷项目',
    description: '为深圳宝安国际机场T3航站楼及飞行区部署FSS-300 SPD监测仪186台、FL-300雷电峰值监测仪12台、FRP-300接地电阻监测仪45台、FG-500网关28台。实现航站楼配电系统SPD全在线监测、接地电阻远程巡检及飞行区雷击定位。',
    client: '深圳宝安国际机场',
    image: '/images/lightning-protection/cases/airport.jpg',
    solutionIds: ['lp-sol-001', 'lp-sol-002', 'lp-sol-003', 'lp-sol-004'],
    publishedAt: '2024-08-30'
  },
  {
    id: 'lp-case-002',
    slug: 'gd-chemical-plant',
    title: '广东某大型石化企业防雷监测项目',
    description: '为广东某石化炼化一体化基地部署防爆型FS-EX监测仪237台、FL-EX雷电峰值监测仪28台、FRP-IS本安接地电阻监测仪64台及FG-500Ex防爆网关35台，覆盖炼油装置、乙烯裂解、储罐区等全部防爆区域。',
    client: '广东某石化企业',
    image: '/images/lightning-protection/cases/chemical.jpg',
    solutionIds: ['lp-sol-005', 'lp-sol-004'],
    publishedAt: '2024-09-20'
  },
  {
    id: 'lp-case-003',
    slug: 'gd-wind-farm',
    title: '广东某海上风电场防雷监测项目',
    description: '为广东某海上风电场36台风机部署FL-300H耐候型雷电峰值监测仪及FRP-300H防腐型接地电阻监测仪，通过LoRa组网上传至FG-500网关，同时监测风机叶片雷击与塔筒接地状况。',
    client: '广东某新能源发电企业',
    image: '/images/lightning-protection/cases/windfarm.jpg',
    solutionIds: ['lp-sol-002', 'lp-sol-003', 'lp-sol-004'],
    publishedAt: '2024-10-10'
  },
  {
    id: 'lp-case-004',
    slug: 'sz-subway-lightning',
    title: '深圳地铁线路智能防雷监测项目',
    description: '为深圳地铁某新建线路16个车站及车辆段部署FS-200 SPD监测仪420台、FR-200接地电阻监测仪96台、FG-200网关32台，实现全线SPD与接地系统的集中智能监测与运维。',
    client: '深圳地铁集团',
    image: '/images/lightning-protection/cases/subway.jpg',
    solutionIds: ['lp-sol-001', 'lp-sol-003', 'lp-sol-004'],
    publishedAt: '2024-10-28'
  }
];
