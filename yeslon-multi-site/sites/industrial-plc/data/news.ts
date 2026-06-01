import { News } from '@shared/types';

export const industrialPlcNews: News[] = [
  {
    id: 'plc-news-001',
    slug: 'cc-900-plc-launch',
    title: 'CC-900旗舰型PLC正式发布',
    description: 'CC-900搭载4核Cortex-A76+2核Cortex-M7处理器，单机支持256轴EtherCAT控制。',
    content: '微物联技术发布CC-900旗舰型可编程逻辑控制器。CC-900采用瑞芯微RK3588M车规级芯片（4×Cortex-A76 + 2×Cortex-M7），配备8GB DDR4和64GB eMMC，单控制器可支持最多256个EtherCAT轴、64000个I/O点。内置双千兆TSN交换机端口，支持PROFINET IRT与EtherCAT双协议实时通信。CC-900已通过CE、UL及SIL 2功能安全认证。',
    category: '产品更新',
    image: '/images/industrial-plc/news/cc-900.jpg',
    publishedAt: '2024-11-15'
  },
  {
    id: 'plc-news-002',
    slug: 'codesys-partnership',
    title: '微物联与CODESYS达成战略合作协议',
    description: '微物联成为CODESYS中国区官方授权合作伙伴，全系列PLC预装CODESYS运行时。',
    content: '微物联技术（深圳）有限公司与德国3S-Smart Software Solutions GmbH签署战略合作协议。微物联CC/CR/X全系列PLC将预装CODESYS Control运行时，用户可直接使用CODESYS IDE进行编程调试。同时双方将联合推出基于IEC 61499标准的分布式控制解决方案。',
    category: '公司新闻',
    image: '/images/industrial-plc/news/codesys.jpg',
    publishedAt: '2024-10-20'
  },
  {
    id: 'plc-news-003',
    slug: 'industrial-plc-national-lab',
    title: '微物联工业PLC通过国家电控检测中心A级认证',
    description: 'CC-500和CR-200两款PLC产品通过国家电控配电设备质量检验检测中心A级认证。',
    content: '国家电控配电设备质量检验检测中心（天津）公布最新PLC产品检测结果，微物联CC-500及CR-200 PLC以A级通过全部测试项目。其中电磁兼容（EMC）测试中，静电放电±8kV、射频辐射10V/m、快速瞬变脉冲群±4kV均无任何异常。环境可靠性测试中，-40℃~+85℃高低温循环、95%湿度、20g振动等指标表现优异。',
    category: '行业动态',
    image: '/images/industrial-plc/news/national-lab.jpg',
    publishedAt: '2024-09-28'
  },
  {
    id: 'plc-news-004',
    slug: 'db-edge-ai-workshop',
    title: '微物联举办"设备大脑"边缘AI解决方案研讨会',
    description: '来自华南地区200余家制造业企业的技术负责人参会，探讨边缘AI在工业控制中的应用。',
    content: '微物联技术在深圳举办"设备大脑"DB系列边缘AI解决方案研讨会，来自比亚迪、富士康、华为制造、美的等200余家制造业企业的技术负责人参会。会上发布了DB-200边缘AI控制器的工业视觉检测、预测性维护、能源优化三大典型应用案例包，以及配套的AI模型训练与部署工具链。',
    category: '公司新闻',
    image: '/images/industrial-plc/news/workshop.jpg',
    publishedAt: '2024-09-05'
  }
];
