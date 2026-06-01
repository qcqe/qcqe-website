import { PageConfig } from '@shared/types';

export const electricalSafetyPages: PageConfig[] = [
  {
    path: '',
    title: '首页',
    description: '微物联电气安全监测系统 — ESA全要素智能电表·ESB三相不平衡监测·EST无线温度监测，AI守护用电安全',
    keywords: ['电气安全', '智能电表', 'ESA', 'ESB', 'EST'],
    changeFreq: 'daily',
    priority: 1.0
  },
  {
    path: 'products',
    title: '产品中心',
    description: 'ESA全要素智能电表、ESB三相不平衡监测器、EST无线温度监测器等电气安全产品',
    keywords: ['ESA智能电表', 'ESB监测器', 'EST测温', '电气安全产品'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'products/esa',
    title: 'ESA全要素智能电表',
    description: 'ESA系列全要素智能电表，集成电压、电流、功率、谐波、温度等多参数监测',
    keywords: ['ESA电表', '智能电表', '全要素监测', '多功能电表'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/esb',
    title: 'ESB三相不平衡监测器',
    description: 'ESB系列三相不平衡监测器，实时监测三相电压电流不平衡度及零序电流',
    keywords: ['ESB', '三相不平衡', '不平衡监测', '零序电流'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'products/est',
    title: 'EST无线温度监测',
    description: 'EST系列无线温度监测系统，支持接触式/非接触式测温，无线组网覆盖',
    keywords: ['EST', '无线测温', '温度监测', '无线温度传感器'],
    changeFreq: 'monthly',
    priority: 0.8
  },
  {
    path: 'solutions',
    title: '解决方案',
    description: '电气安全整体解决方案，覆盖配电回路监测、电气隐患AI分析、三相不平衡治理',
    keywords: ['电气安全方案', '配电监测', '隐患分析'],
    changeFreq: 'weekly',
    priority: 0.9
  },
  {
    path: 'specifications',
    title: '技术规格',
    description: 'ESA/ESB/EST系列产品详细技术参数与规格说明',
    keywords: ['技术规格', '产品参数', 'ESA参数', 'ESB参数', 'EST参数'],
    changeFreq: 'monthly',
    priority: 0.7
  },
  {
    path: 'cases',
    title: '成功案例',
    description: '电气安全监测系统在各行业中的成功应用案例',
    keywords: ['电气安全案例', 'ESA案例', 'ESB案例', 'EST案例'],
    changeFreq: 'weekly',
    priority: 0.8
  },
  {
    path: 'contact',
    title: '联系我们',
    description: '电气安全监测系统产品咨询与技术支持',
    keywords: ['联系我们', '电气安全咨询'],
    changeFreq: 'monthly',
    priority: 0.6
  }
];
