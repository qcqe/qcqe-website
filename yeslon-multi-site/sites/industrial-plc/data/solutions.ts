import { Solution } from '@shared/types';

export const industrialPlcSolutions: Solution[] = [
  {
    id: 'plc-sol-001',
    slug: 'production-line-control',
    title: '产线自动化分布式控制方案',
    description: '以CR-200分布式PLC为控制核心，通过EtherCAT总线连接远程I/O站与伺服驱动器，实现产线级高速协同控制。支持IEC 61131-3 ST/LD/FBD/IL/SFC五种编程语言，单控制器支持最多128个轴同步控制。',
    features: [
      'CR-200主站+远程I/O分布式架构',
      'EtherCAT总线，通信周期≤100μs',
      '最多128轴同步控制',
      'ST/LD/FBD/IL/SFC五种编程语言',
      '支持CODESYS/OpenPCS开发环境'
    ],
    category: 'production-line',
    image: '/images/industrial-plc/production-line.jpg',
    publishedAt: '2024-06-01'
  },
  {
    id: 'plc-sol-002',
    slug: 'device-brain-edge',
    title: '"设备大脑"分布式智能控制器方案',
    description: '"设备大脑"DB-100/DB-200系列集成了PLC逻辑控制与边缘计算能力，内置ARM Cortex-A72处理器+FPGA协处理架构，可在设备端实时运行视觉检测、振动分析等AI推理任务。',
    features: [
      'PLC+边缘计算一体化架构',
      'ARM Cortex-A72 + FPGA',
      '支持TensorFlow Lite/ONNX模型推理',
      'EtherCAT/PROFINET/EtherNet/IP多协议',
      '内置SQLite本地数据库与MQTT上报'
    ],
    category: 'edge-control',
    image: '/images/industrial-plc/brain-solution.jpg',
    publishedAt: '2024-06-20'
  },
  {
    id: 'plc-sol-003',
    slug: 'building-automation-plc',
    title: '楼宇自控PLC解决方案',
    description: '基于X-100/X-200微型PLC的楼宇自控方案，卡片式超薄设计可安装于标准配电箱内，支持BACnet、Modbus、KNX等楼宇协议，适用于暖通空调、照明、给排水等子系统控制。',
    features: [
      '超薄卡片式设计，厚度仅28mm',
      '支持BACnet/IP、Modbus、KNX',
      'I/O模块自由组合，最大256点',
      '内置RTC与周定时任务',
      '可选配Wi-Fi/4G无线通信'
    ],
    category: 'building-automation',
    image: '/images/industrial-plc/building-solution.jpg',
    publishedAt: '2024-07-10'
  },
  {
    id: 'plc-sol-004',
    slug: 'industrial-iot-gateway',
    title: '工业通信网关与数据采集方案',
    description: 'IG-500/IG-1000工业网关支持100+种工业协议转换（PROFINET/EtherNet/IP/Modbus TCP/OPC UA等），内置数据清洗与边缘存储引擎，无缝对接主流IoT云平台。',
    features: [
      '支持100+种工业协议解析',
      '协议转换与数据整形',
      '边缘数据缓存与断网续传',
      '支持阿里云/华为云/AWS IoT Core',
      '内置防火墙与VPN安全隧道'
    ],
    category: 'iot-gateway',
    image: '/images/industrial-plc/gateway-solution.jpg',
    publishedAt: '2024-07-25'
  },
  {
    id: 'plc-sol-005',
    slug: 'cc-series-motion',
    title: 'CC系列高性能运动控制方案',
    description: 'CC-500/CC-800高性能PLC搭载多核处理器与硬件浮点运算单元，支持EtherCAT CoE/CSP/CSV模式，可实现电子凸轮、插补、飞剪等复杂运动控制功能。',
    features: [
      '多核处理器+硬件FPU',
      '8轴EtherCAT同步控制（1ms周期）',
      '电子凸轮与飞剪功能',
      '支持G代码解析与CNC控制',
      '内置安全STO/SS1功能安全'
    ],
    category: 'motion-control',
    image: '/images/industrial-plc/motion-solution.jpg',
    publishedAt: '2024-08-10'
  }
];
