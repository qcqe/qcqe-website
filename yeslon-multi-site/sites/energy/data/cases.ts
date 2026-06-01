import { Case } from '@shared/types';

export const energyCases: Case[] = [
  {
    id: '1',
    slug: 'ksdsfe-harmonic-monitoring',
    title: 'KSDSFE3250220001 充电站谐波监测项目',
    description: '为KSDSFE3250220001大型公共充电站部署谐波监测与电气安全系统，实现全站充电桩的谐波指纹采集与实时分析，成功预警7起潜在电气故障。',
    client: 'KSDSFE3250220001 充电站运营方',
    image: '/images/energy/cases/ksdsfe-harmonic.jpg',
    solutionIds: ['1', '4'],
    publishedAt: '2024-07-15'
  },
  {
    id: '2',
    slug: 'city-ebike-shed-monitoring',
    title: '某市电动自行车充电棚安全监测项目',
    description: '为某市主城区200余个电动自行车集中充电棚部署电气安全监测终端，实现充电回路漏电、过载、温度的实时监测与远程告警，火灾事故率降低90%。',
    client: '某市消防救援支队',
    image: '/images/energy/cases/ebike-shed.jpg',
    solutionIds: ['2'],
    publishedAt: '2024-08-01'
  },
  {
    id: '3',
    slug: 'bus-depot-electrical-safety',
    title: '某新能源公交场站电气安全项目',
    description: '为某大型新能源公交场站建设电气安全监测系统，覆盖60余个公交充电桩及配套配电设施，实现电气隐患的实时监测与智能预警。',
    client: '某市公共交通集团有限公司',
    image: '/images/energy/cases/bus-depot.jpg',
    solutionIds: ['1', '5'],
    publishedAt: '2024-08-20'
  },
  {
    id: '4',
    slug: 'commercial-complex-monitoring',
    title: '某商业综合体充电站监测项目',
    description: '为某大型商业综合体地下停车场充电站区域提供电气安全整体解决方案，集成谐波指纹分析与电弧检测功能，保障商业体充电安全。',
    client: '某商业地产集团',
    image: '/images/energy/cases/commercial-complex.jpg',
    solutionIds: ['1', '4'],
    publishedAt: '2024-09-05'
  }
];
