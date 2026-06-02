import { Case } from '@shared/types';

export const industrialPlcCases: Case[] = [
  {
    id: 'plc-case-001',
    slug: 'ev-battery-line',
    title: '某新能源电池产线控制项目',
    description: '为某新能源车企电池模组PACK产线部署CR系列分布式PLC及边缘智能控制器，控制数百台伺服驱动器和数千I/O点，整线节拍大幅缩短，设备综合效率显著提升。',
    client: '某新能源汽车电池企业',
    image: '/images/industrial-plc/cases/ev-battery.jpg',
    solutionIds: ['plc-sol-001', 'plc-sol-002'],
    publishedAt: '2024-09-05'
  },
  {
    id: 'plc-case-002',
    slug: 'semiconductor-fab',
    title: '某半导体封测厂智能化改造项目',
    description: '对某半导体封测厂的多台设备进行PLC升级改造，采用微型PLC替换原有进口PLC，通过工业网关统一直连MES系统，设备联网率大幅提升。',
    client: '某半导体封测企业',
    image: '/images/industrial-plc/cases/semiconductor.jpg',
    solutionIds: ['plc-sol-003', 'plc-sol-004'],
    publishedAt: '2024-09-20'
  },
  {
    id: 'plc-case-003',
    slug: 'smart-building',
    title: '某超高层建筑楼宇自控项目',
    description: '为某超高层写字楼部署微型PLC控制暖通空调、智能照明、给排水、电梯等子系统，通过BACnet/IP统一接入楼宇管理平台，综合能耗显著降低。',
    client: '某商业地产集团',
    image: '/images/industrial-plc/cases/smart-building.jpg',
    solutionIds: ['plc-sol-003', 'plc-sol-004'],
    publishedAt: '2024-10-12'
  },
  {
    id: 'plc-case-004',
    slug: 'food-beverage-line',
    title: '某食品饮料灌装线控制项目',
    description: '为某知名饮料品牌灌装线提供高性能运动控制器及人机界面方案，实现灌装、旋盖、贴标、装箱全流程电子凸轮同步控制，生产速度大幅提升。',
    client: '某食品饮料企业',
    image: '/images/industrial-plc/cases/food-beverage.jpg',
    solutionIds: ['plc-sol-005', 'plc-sol-001'],
    publishedAt: '2024-10-30'
  }
];
