import { Case } from '@shared/types';

export const cases: Case[] = [
  {
    id: '1',
    slug: 'airport-electrical-safety',
    title: '某机场航站楼电气安全监测项目',
    description: '为某国际机场航站楼配电系统部署电气安全隐患监测与接地电阻在线监测系统，覆盖航站楼核心配电回路及接地网，实现电气参数7×24小时监控与隐患预警，提升机场电气系统可靠性。',
    client: '某机场集团',
    image: '/images/cases/airport.jpg',
    solutionIds: ['3', '4'],
    publishedAt: '2024-06-15'
  },
  {
    id: '2',
    slug: 'highway-electrical-monitoring',
    title: '某高速公路电气安全监测项目',
    description: '为某高速公路沿线配电设施部署电气安全隐患监测系统，通过谐波指纹分析技术实现隧道照明、收费站、服务区配电回路的故障前预警，有效降低电气火灾风险，保障高速公路运营安全。',
    client: '某高速公路有限公司',
    image: '/images/cases/highway.jpg',
    solutionIds: ['3'],
    publishedAt: '2024-07-20'
  },
  {
    id: '3',
    slug: 'petrochemical-lightning-protection',
    title: '某炼化厂智能防雷监测项目',
    description: '为某大型炼化一体化生产基地部署防爆型智能防雷监测系统，安装FS-EX防爆SPD监测仪及FSS智能型SPD，配置FL雷电峰值监测与FRP接地电阻监测装置，通过FG智能网关实现防雷系统智慧化管理。',
    client: '某石油化工集团',
    image: '/images/cases/petrochemical.jpg',
    solutionIds: ['5'],
    publishedAt: '2024-08-10'
  },
  {
    id: '4',
    slug: 'hydropower-monitoring',
    title: '某水电站电气安全监测项目',
    description: '为某大型水电站部署电气安全监测与配电监测系统，覆盖发电机组、升压站及厂用电配电回路，实现全站电气参数的实时采集与智能预警，保障电站安全稳定运行。',
    client: '某水电开发公司',
    image: '/images/cases/hydropower.jpg',
    solutionIds: ['3', '6'],
    publishedAt: '2024-09-05'
  },
  {
    id: '5',
    slug: 'subway-spd-monitoring',
    title: '某地铁线路智能防雷监测项目',
    description: '为某地铁新建线路各车站及车辆段部署SPD在线监测系统，安装FS电涌保护器监测仪及FR接地电阻监测仪，通过FG网关统一汇聚，实现全线SPD与接地系统的集中智能监测与运维。',
    client: '某地铁集团',
    image: '/images/cases/subway.jpg',
    solutionIds: ['5'],
    publishedAt: '2024-10-15'
  },
  {
    id: '6',
    slug: 'railway-grounding',
    title: '某铁路变电所接地监测项目',
    description: '为某铁路沿线牵引变电所及分区所部署FR系列接地电阻在线监测系统，实现接地电阻全天候监测与趋势分析，确保铁路供电系统接地安全，保障行车安全。',
    client: '某铁路局',
    image: '/images/cases/railway.jpg',
    solutionIds: ['4'],
    publishedAt: '2024-11-01'
  },
  {
    id: '7',
    slug: 'smart-park-energy',
    title: '某智慧园区能源管理项目',
    description: '为某智慧产业园区实施配电监测与能耗管理系统，搭建覆盖全园区配电房的电气参数采集网络，实现分项能耗统计、负荷分析和能效优化，帮助园区年节约电费超15%。',
    client: '某智慧园区管理公司',
    image: '/images/cases/smart-park.jpg',
    solutionIds: ['6'],
    publishedAt: '2024-11-20'
  },
  {
    id: '8',
    slug: 'data-center-power',
    title: '某数据中心配电监测项目',
    description: '为某大型数据中心实施配电回路监测与能耗管理系统，覆盖UPS输入输出柜、列头柜及精密配电柜，实现IT负载回路级能耗与温度全监测，显著降低PUE值。',
    client: '某数据中心运营商',
    image: '/images/cases/data-center.jpg',
    solutionIds: ['6'],
    publishedAt: '2024-12-10'
  },
  {
    id: '9',
    slug: 'hospital-electrical-safety',
    title: '某三甲医院电气安全监测项目',
    description: '为某三甲医院全院配电系统部署电气安全监测系统，覆盖所有配电柜与关键用电回路，通过AI谐波指纹分析与温度监测实现电气隐患早期预警，保障医院供电安全。',
    client: '某三甲医院',
    image: '/images/cases/hospital.jpg',
    solutionIds: ['3'],
    publishedAt: '2025-01-15'
  },
  {
    id: '10',
    slug: 'commercial-complex-safety',
    title: '某商业综合体电气安全项目',
    description: '为某大型商业综合体配电系统部署电气安全隐患AI分析系统，接入ESA智能电表及EST温度传感器，AI平台自动识别隐蔽性电弧故障隐患，保障人员密集场所电气安全。',
    client: '某商业地产集团',
    image: '/images/cases/commercial.jpg',
    solutionIds: ['3'],
    publishedAt: '2025-02-20'
  },
  {
    id: '11',
    slug: 'ev-station-harmonic',
    title: '某新能源充电站谐波监测项目',
    description: '为某新能源运营公司旗下大型集中式充电站部署电气安全监测系统，重点针对充电桩产生的谐波污染进行特征分析与电能质量评估，制定谐波治理方案，保障充电站安全稳定运行。',
    client: '某新能源运营公司',
    image: '/images/cases/ev-station.jpg',
    solutionIds: ['2'],
    publishedAt: '2025-03-10'
  },
  {
    id: '12',
    slug: 'manufacturing-plc-control',
    title: '某制造工厂PLC控制系统项目',
    description: '为某大型制造企业产线部署CR系列分布式PLC控制系统，实现产线自动化逻辑控制与设备互联，通过IG工业网关对接MES系统，大幅提升生产效率和设备综合利用率。',
    client: '某制造企业',
    image: '/images/cases/manufacturing.jpg',
    solutionIds: ['1'],
    publishedAt: '2025-04-05'
  }
];
