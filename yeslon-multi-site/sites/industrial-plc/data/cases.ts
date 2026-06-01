import { Case } from '@shared/types';

export const industrialPlcCases: Case[] = [
  {
    id: 'plc-case-001',
    slug: 'gd-ev-battery-line',
    title: '广东某新能源汽车电池模组产线项目',
    description: '为某头部新能源车企电池模组PACK产线部署CR-200分布式PLC 36套、DB-200"设备大脑"12台、IG-500工业网关8台，控制186台伺服驱动器和4200+ I/O点。整线节拍从120s缩短至78s，设备综合效率(OEE)提升22%。',
    client: '某新能源汽车电池企业',
    image: '/images/industrial-plc/cases/ev-battery.jpg',
    solutionIds: ['plc-sol-001', 'plc-sol-002'],
    publishedAt: '2024-09-05'
  },
  {
    id: 'plc-case-002',
    slug: 'gd-semiconductor-fab',
    title: '深圳某半导体封测厂智能化改造项目',
    description: '对深圳某半导体封测厂的划片机、固晶机、焊线机等37台设备进行PLC升级改造，采用X-200微型PLC替换原有进口PLC，通过IG-1000网关统一直连MES系统。设备联网率从15%提升至100%，OEE提升18%。',
    client: '深圳某半导体封测企业',
    image: '/images/industrial-plc/cases/semiconductor.jpg',
    solutionIds: ['plc-sol-003', 'plc-sol-004'],
    publishedAt: '2024-09-20'
  },
  {
    id: 'plc-case-003',
    slug: 'sz-smart-building',
    title: '深圳某超高层建筑楼宇自控项目',
    description: '为深圳某356米超高层写字楼部署X-100微型PLC 128台，控制暖通空调（AHU/FCU/VRF）、智能照明、给排水、电梯等子系统，通过BACnet/IP统一接入楼宇管理平台(BMS)，综合能耗降低26%。',
    client: '深圳某商业地产集团',
    image: '/images/industrial-plc/cases/smart-building.jpg',
    solutionIds: ['plc-sol-003', 'plc-sol-004'],
    publishedAt: '2024-10-12'
  },
  {
    id: 'plc-case-004',
    slug: 'gd-food-beverage',
    title: '广东某食品饮料灌装线控制系统项目',
    description: '为某知名饮料品牌的PET瓶灌装线提供CC-500运动控制器+HMI-1200人机界面方案，实现灌装、旋盖、贴标、装箱全流程电子凸轮同步控制，灌装精度±1.5ml，生产速度达48000瓶/小时。',
    client: '某知名食品饮料企业',
    image: '/images/industrial-plc/cases/food-beverage.jpg',
    solutionIds: ['plc-sol-005', 'plc-sol-001'],
    publishedAt: '2024-10-30'
  }
];
