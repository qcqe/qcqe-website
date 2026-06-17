/**
 * 微物联产品目录（主站 + 垂直站）
 * 参数来源：市场部产品数据库 / 规格书
 */

const S = (k, v) => ({ k, v });

const YESLON = [
  {
    id: 'electrical-safety',
    cat: '电气安全监测',
    desc: 'ESA/ESB/EST/ESF 等 ES 系列，覆盖电能计量、三相不平衡、温度、漏电、电弧与电气火灾监测。',
    items: [
      {
        n: 'ESA全要素智能电表',
        m: 'ESA-1001-R / ESA-1002-R / ESA-1003-R',
        d: '多功能智能电表，同步采集电压、电流、功率、功率因数、2~31次谐波、电能等全要素参数，支持 RS485 Modbus 与 DL645，适用于配电监测与隐患分析数据源。',
        priority: 100,
        features: ['全要素同步采集', '0.5级电压电流 / 1级有功电能', '2~31次谐波分析', 'OLED 本地显示', 'Modbus RTU / DL645'],
        specs: [
          S('工作电压', 'DC 4.75~5.25V / AC 180~250V'),
          S('功耗', '≤2W'),
          S('工作温度', '-20~+60℃'),
          S('防护等级', 'IP20，35mm 导轨安装'),
          S('电压量程', '0~660V，精度 0.5 级'),
          S('电流量程', '5A 直接 / 100A·400A·600A（经 CT）'),
          S('频率范围', '45~65Hz，分辨率 0.01Hz'),
          S('谐波分析', '2~31 次，精度 ±1%'),
          S('通讯', 'RS485，Modbus RTU，地址 1~247'),
        ],
        models: ['ESA-1001-R（5A 直接）', 'ESA-1002-R（100A/5A CT）', 'ESA-1003-R（400A/5A CT）', 'ESA-2001-E（以太网）'],
        scenes: ['低压配电柜全参数监测', '充电站回路谐波与电能采集', '楼宇分项计量', '数据中心机柜监测'],
      },
      {
        n: 'ESB三相不平衡监测器',
        m: 'ESB 系列',
        d: '实时计算三相电压、电流不平衡度及零序分量，支持越限告警与趋势记录，适用于变压器负荷均衡与电动机保护场景。',
        priority: 95,
        features: ['不平衡度实时计算', '零序电流高精度采集', '上下限阈值告警', 'RS485 Modbus 上传'],
        specs: [
          S('监测参数', '三相电压/电流不平衡度、零序电流'),
          S('不平衡度范围', '0~100%'),
          S('工作电压', 'DC12V / DC24V / AC220V 可选'),
          S('通讯协议', 'RS485 Modbus RTU'),
          S('安装方式', '35mm DIN 导轨'),
        ],
        scenes: ['变压器三相负荷监测', '电动机不平衡保护', '配电系统平衡优化'],
      },
      {
        n: 'ESE电能质量监测器',
        m: 'ESE-1001 / ESE-2001 / ESE-3001',
        d: '面向电能质量专业分析，支持电压暂降/暂升/中断事件、谐波、闪变与三相不平衡等综合评估。',
        priority: 90,
        features: ['电压暂降/暂升/中断记录', '2~31次谐波与间谐波', '电压闪变测量', '波形捕获与事件追溯'],
        specs: [
          S('监测功能', '电能质量综合监测'),
          S('谐波', '2~31 次谐波分析'),
          S('通讯', 'Modbus RTU / MQTT'),
          S('工作电压', 'DC12V / DC24V'),
          S('安装', '35mm DIN 导轨'),
        ],
        scenes: ['敏感负荷电能质量评估', '电网扰动事件分析', '大型充电站电能质量监测'],
      },
      {
        n: 'ESF电气火灾监测模组',
        m: 'ESF 系列',
        d: '集成剩余电流、线缆温度与故障电弧监测，符合 GB 14287 要求，实现电气火灾隐患早期识别与联动告警。',
        priority: 88,
        features: ['漏电+温度+电弧多参数', '分级告警与继电器输出', '消防联动接口', 'GB 14287 符合'],
        specs: [
          S('漏电监测', '30mA~1000mA 可调'),
          S('温度监测', '0~150℃，多点接入'),
          S('电弧监测', '串联/并联故障电弧识别'),
          S('输出', '继电器报警输出'),
          S('通讯', 'RS485 Modbus'),
        ],
        scenes: ['配电箱电气火灾预警', '电缆桥架温升监测', '人员密集场所用电安全'],
      },
      {
        n: 'EST温度监测模组',
        m: 'EST 系列',
        d: '多路温度采集模组，兼容 NTC/PT100/热电偶及无线测温传感器，适用于开关柜触头、母排与电缆接头热点监测。',
        priority: 85,
        features: ['1~16 点可扩展', 'NTC/PT100/热电偶兼容', '温升趋势分析', '超温分级告警'],
        specs: [
          S('监测点数', '1~16 点（可扩展）'),
          S('温度范围', '-20~+150℃（传感器相关）'),
          S('精度', '±0.5℃（视传感器）'),
          S('通讯', 'RS485 Modbus'),
          S('安装', '35mm DIN 导轨'),
        ],
        scenes: ['高压柜触头测温', '变压器接头温升监测', '电缆沟/桥架温度巡检'],
      },
      {
        n: 'ESC漏电监测模组',
        m: 'ESC 系列',
        d: '多通道剩余电流采集，支持同步监测多条馈线漏电状态，用于电气火灾隐患与漏电保护策略联动。',
        priority: 80,
        features: ['多通道漏电同步采集', 'μA/mA 级分辨率', '越限分级告警', 'DIN 导轨安装'],
        specs: [
          S('监测对象', '剩余电流（漏电流）'),
          S('通道数', '多通道（按型号）'),
          S('通讯', 'RS485 Modbus'),
          S('安装', '35mm DIN 导轨'),
        ],
        scenes: ['馈线漏电集中监测', '充电回路漏电分析', '老旧线路隐患排查'],
      },
      {
        n: 'ESP零地电压监测器',
        m: 'ESP 系列',
        d: '监测 N-PE 间电压，识别零地电压异常，保护敏感电子设备与充电设施安全运行。',
        priority: 75,
        features: ['N-PE 电压高精度测量', '异常事件记录', '越限告警输出'],
        specs: [
          S('监测参数', '零地电压（N-PE）'),
          S('通讯', 'RS485 Modbus'),
          S('安装', '35mm DIN 导轨'),
        ],
        scenes: ['数据中心零地监测', '充电站零地异常预警', '精密设备配电监测'],
      },
      {
        n: 'FA故障电弧监测模块',
        m: 'FA 系列',
        d: '检测串联/并联电弧故障特征，符合 UL 1699B，用于配电回路电弧火灾预防。',
        priority: 70,
        features: ['串联/并联电弧识别', 'UL 1699B', '智能特征算法', 'RS485 上传'],
        specs: [
          S('监测类型', '故障电弧（AFCI）'),
          S('标准', 'UL 1699B'),
          S('通讯', 'RS485 Modbus'),
        ],
        scenes: ['末端配电电弧监测', '老旧线路电弧预警', '充电回路安全监测'],
      },
      {
        n: 'FAP故障电弧探测器(一体式)',
        m: 'FAP 系列',
        d: '电弧检测、漏电保护与过压保护一体化末端设备，支持本地声光报警与远程通信。',
        priority: 68,
        features: ['电弧+漏电+过压三合一', '导轨安装', '本地声光+远程告警'],
        specs: [
          S('保护功能', '电弧 / 漏电 / 过压'),
          S('标准', 'UL 1699B / GB 14287'),
          S('安装', '35mm DIN 导轨'),
        ],
        scenes: ['住户/商铺末端配电', '充电桩配套回路', '小型配电箱改造'],
      },
      {
        n: 'ESX智能网关',
        m: 'ESX 系列',
        d: '电气安全系列设备汇聚网关，统一接入 ESA/ESB/EST 等终端，支持 4G/Wi-Fi/以太网上云与协议转换。',
        priority: 60,
        features: ['ES 系列统一接入', '4G/Wi-Fi/以太网', 'Modbus/MQTT 双协议', '远程配置管理'],
        specs: [
          S('上行通讯', '4G / Wi-Fi / Ethernet'),
          S('下行接口', 'RS485 多设备汇聚'),
          S('协议', 'Modbus RTU/TCP、MQTT'),
        ],
        scenes: ['配电房数据集中上云', '多回路监测组网', '园区电气安全平台接入'],
      },
    ],
  },
  {
    id: 'lightning-protection',
    cat: '智能防雷系统',
    desc: 'FS/FSS/FSP SPD 监测、FL 雷电流、FR/FRP 接地电阻、FG 网关，构成完整防雷在线监测体系。',
    items: [
      {
        n: 'FS防雷器监测模块',
        m: 'FS-33211 / FS-00011 等',
        d: '电涌保护器（SPD）在线监测仪，μA 级漏电流、热脱扣状态、雷击计数与接地状态监测，四要素/九要素/多要素规格可选。',
        priority: 100,
        features: ['漏电流 μA 级监测', '热脱扣状态检测', '雷击计数与能量记录', '劣化趋势分析'],
        specs: [
          S('监测要素', '四要素 / 九要素 / 多要素可选'),
          S('漏电流范围', '50μA~1600μA（全要素型）'),
          S('温度监测', '-20~+105℃（多通道）'),
          S('工作电压', 'DC12V / DC24V / AC220V'),
          S('通讯', 'RS485 / Zigbee / Ethernet / MQTT'),
          S('防护等级', 'IP65'),
        ],
        models: ['FS-33211（全要素）', 'FS-00011（四要素）'],
        scenes: ['配电柜 SPD 状态监测', '机场/石化 SPD 巡检替代', '防雷设施运维管理'],
      },
      {
        n: 'FSS智能型电涌保护器',
        m: 'FSS（数码管 / OLED）',
        d: '一体化智能 SPD，内置监测模块，支持劣化预警、雷击记录与远程通信，减少外置监测布线。',
        priority: 95,
        features: ['SPD+监测一体化', '数码管/OLED 本地显示', '劣化预警', 'RS485/4G 远程'],
        specs: [
          S('结构', '一体化智能 SPD'),
          S('显示', '数码管或 OLED'),
          S('监测', '漏电流 / 热脱扣 / 雷击计数'),
          S('通讯', 'RS485 / 4G'),
        ],
        scenes: ['新建配电 SPD 智能化', '无人值守站房', '防雷改造升级'],
      },
      {
        n: 'FSP电涌保护器底座',
        m: 'FSP 系列',
        d: '底座式 SPD 监测模块，配合标准 SPD 插拔模块，即插即用实现在线状态监测。',
        priority: 90,
        features: ['底座式即插即用', '适配标准 SPD 模块', '漏电流与脱扣监测', '雷击计数'],
        specs: [
          S('安装方式', '底座式，配合标准 SPD'),
          S('监测参数', '漏电流 / 热脱扣 / 雷击计数'),
          S('通讯', 'RS485'),
        ],
        scenes: ['现有 SPD 智能化改造', '标准导轨 SPD 监测', '防雷巡检自动化'],
      },
      {
        n: 'FL雷电流监测模块',
        m: 'FL室内 / FL室外 / FL瞬态',
        d: '雷电峰值监测仪，记录雷电流峰值、极性、发生时间与能量参数，支持 GPS/北斗授时，室外型 IP67。',
        priority: 88,
        features: ['峰值 0.1~200kA', '极性识别与波形记录', 'GPS/北斗授时', 'IP67 室外型'],
        specs: [
          S('峰值范围', '0.1~200kA（系列相关）'),
          S('极性', '正/负识别'),
          S('授时', 'GPS/北斗，μs 级时间戳'),
          S('室外防护', 'IP67（室外版）'),
          S('通讯', 'RS485 / 4G'),
        ],
        scenes: ['接闪带雷电流记录', '变电站雷击事件分析', '多站雷击定位组网'],
      },
      {
        n: 'FR接地电阻监测模块',
        m: 'FR导轨 / FR螺丝 / FR室外',
        d: '三极法（电位降法）接地电阻在线监测仪，量程 0.01~200Ω，支持室内导轨、壁挂与室外安装。',
        priority: 86,
        features: ['三极法标准测量', '0.01~200Ω', '土壤电阻率辅助', '超标自动告警'],
        specs: [
          S('测量原理', '三极法（电位降法）'),
          S('量程', '0.1~200Ω（系列相关）'),
          S('精度', '±1%'),
          S('测量时间', '≤3s'),
          S('工作温度', '-20~+60℃'),
          S('防护', 'IP65（室外型）'),
          S('通讯', 'RS485 Modbus'),
        ],
        scenes: ['变电站接地网监测', '通信基站接地巡检', '建筑防雷接地定期检测'],
      },
      {
        n: 'FRP回路法接地电阻监测仪',
        m: 'FRP-01111-R 等',
        d: '回路法在线接地监测，免辅助接地极，适合已建成接地系统长期监测；可选防爆 ExdbIIBT4Gb。',
        priority: 84,
        features: ['回路法在线监测', '0.01~2000Ω', '免辅助极', '防爆型可选'],
        specs: [
          S('测量原理', '回路法（工作电流注入）'),
          S('量程', '0.01~2000Ω'),
          S('精度', '±2% rdg ±3dgt'),
          S('分辨率', '0.01Ω'),
          S('防爆', 'ExdbIIBT4Gb（可选）'),
          S('通讯', 'RS485 / Zigbee / Ethernet / 4G'),
          S('防护', 'IP65，-20~+60℃'),
        ],
        models: ['FRP-01111-R（DC12V·防爆·RS485）', 'FRP-03111-E（AC220V·以太网）', 'FRP-01111-G（4G 上云）'],
        scenes: ['石化罐区接地监测', '风电场接地网', '防雷接地长期在线监测'],
      },
      {
        n: 'FG智能防雷网关',
        m: 'FG-200 / FG-500 等',
        d: '防雷监测核心网关，汇聚 FS/FL/FR/FSS/FSP 数据，支持最多 128 点接入，4G/以太网上云与边缘告警判断。',
        priority: 80,
        features: ['128 台设备接入', 'Modbus/MQTT', '边缘计算与告警', 'OTA 远程升级'],
        specs: [
          S('接入容量', '最多 128 监测点'),
          S('下行', '多路 RS485'),
          S('上行', 'Ethernet / 4G / Wi-Fi'),
          S('协议', 'Modbus RTU/TCP、MQTT'),
        ],
        scenes: ['多站点防雷集中监控', '防雷云平台接入', '石化/机场防雷组网'],
      },
      {
        n: 'ESM防雷监测模组',
        m: 'ESM基础版 / 旗舰版',
        d: '导轨式 SPD 状态监测模组，监测漏电流、温度、脱扣与雷击计数，基础版核心监测、旗舰版含波形记录。',
        priority: 70,
        features: ['SPD 劣化监测', '漏电流/温度/脱扣', '雷击计数', '寿命预警'],
        specs: [
          S('监测对象', 'SPD 电涌保护器'),
          S('版本', '基础版 / 旗舰版（含波形）'),
          S('通讯', 'RS485 Modbus'),
          S('安装', '35mm DIN 导轨'),
        ],
        scenes: ['配电 SPD 状态监控', 'ES 系列防雷监测补充'],
      },
    ],
  },
  {
    id: 'plc',
    cat: '工业PLC与控制系统',
    desc: 'CC/CR 系列可编程控制器与分布式 I/O，支持 IEC 61131-3 与 EtherCAT/PROFINET 工业总线。',
    items: [
      {
        n: 'CC系列可编程控制器 (PLC)',
        m: 'CC100 / CCXXX',
        d: '基于 M7 处理器的高性能 PLC，Fexlink 与背板双总线架构，支持 IEC 61131-3 五种语言，适用于逻辑控制、运动控制与过程控制。',
        priority: 100,
        features: ['IEC 61131-3 五种语言', 'EtherCAT/PROFINET/Modbus TCP', '64 点 I/O 扩展', 'M7 处理器'],
        specs: [
          S('处理器', 'M7'),
          S('I/O 规模', 'Fexlink 32 + 背板 32，最多 64 模块'),
          S('供电', 'DC24V（18~30V）'),
          S('典型功耗', '65mA'),
          S('工作温度', '0~+60℃（储存 -20~+85℃）'),
          S('防护等级', 'IP20'),
          S('EMC', 'EN 61000-6-2 / 6-4'),
        ],
        scenes: ['产线逻辑与运动控制', '分布式设备控制', '工艺过程自动化'],
      },
      {
        n: 'CR系列工业分站',
        m: 'CR 系列',
        d: 'EtherCAT 分布式远程 I/O 站，实现产线设备高速数据采集与远程控制，DIN 导轨安装。',
        priority: 90,
        features: ['EtherCAT 总线', '远程 I/O 扩展', 'DIN 导轨', 'IP20'],
        specs: [
          S('总线', 'EtherCAT'),
          S('应用', '分布式远程 I/O'),
          S('安装', 'DIN 导轨'),
          S('防护', 'IP20'),
        ],
        scenes: ['产线分布式采集', '远程设备控制', '模块化产线扩展'],
      },
    ],
  },
  {
    id: 'edge-iot',
    cat: '边缘网关与物联终端',
    desc: 'CW 工业网关、CX 设备手环、HMI 人机界面，连接现场设备与云平台。',
    items: [
      {
        n: 'CW系列边缘计算网关',
        m: 'CW 系列',
        d: '工业边缘网关，100+ 协议采集，4G/Wi-Fi/以太网上云，支持边缘预处理与断点续传。',
        priority: 90,
        features: ['100+ 工业协议', '4G/Wi-Fi/Ethernet', '边缘缓存续传', 'MQTT/HTTP 上云'],
        specs: [
          S('工作电源', 'DC24V±20%'),
          S('工作温度', '0~+55℃'),
          S('上行', '4G / Wi-Fi / Ethernet'),
          S('协议', 'Modbus / OPC UA / MQTT 等'),
        ],
        scenes: ['设备联网上云', '多协议数据采集', '边缘预处理'],
      },
      {
        n: 'CX系列工业设备手环',
        m: 'CX-08R06AI08 等',
        d: '工业设备状态监测终端，振动/温度等多参数采集，无线传输，用于预测性维护与设备健康管理。',
        priority: 85,
        features: ['振动+温度采集', '无线传输', 'IP67', '长续航设计'],
        specs: [
          S('监测参数', '振动、温度等（按型号）'),
          S('防护等级', 'IP65/IP67'),
          S('通讯', 'LoRa / NB-IoT / 4G 可选'),
          S('续航', '低功耗长续航设计'),
        ],
        scenes: ['旋转设备振动监测', '泵机健康诊断', '远程设备状态采集'],
      },
      {
        n: 'HMI工业触摸屏',
        m: 'HMI 4.3"~15.6"',
        d: '工业人机界面，多尺寸电容/电阻屏，工业以太网与 VNC 远程访问，IP65 前面板防护。',
        priority: 80,
        features: ['4.3"/7"/10"/12"/15.6"', '工业以太网', 'VNC 远程', 'IP65 前面板'],
        specs: [
          S('尺寸', '4.3 / 7 / 10 / 12 / 15.6 英寸'),
          S('通讯', '工业以太网'),
          S('远程', 'VNC'),
          S('防护', 'IP65（前面板）'),
        ],
        scenes: ['产线本地操作', '设备状态可视化', 'SCADA 现场站'],
      },
    ],
  },
  {
    id: 'plc-io',
    cat: 'PLC I/O 扩展模块',
    desc: '模拟量、数字量、温度、继电器等模块化 I/O，与 CC/CR 控制器配套组成完整控制站。',
    items: [
      { n: 'AI080模拟量输入模块', m: 'AI080', d: '8 通道模拟量输入，0~10V / 4~20mA，12 位分辨率。', priority: 50, specs: [S('通道', '8 路 AI'), S('量程', '0~10V / 4~20mA'), S('分辨率', '12 位')] },
      { n: 'AO081模拟量输出模块', m: 'AO081', d: '8 通道模拟量输出，0~10V / 4~20mA 可选。', priority: 49, specs: [S('通道', '8 路 AO'), S('量程', '0~10V / 4~20mA')] },
      { n: 'DI160数字量输入模块', m: 'DI160', d: '16 路数字量输入，24VDC，光电隔离。', priority: 48, specs: [S('通道', '16 路 DI'), S('输入', '24VDC'), S('隔离', '光电隔离')] },
      { n: 'DM160/DM168/DM169混合模块', m: 'DM 系列', d: '数字量输入输出混合模块，灵活组合。', priority: 47, specs: [S('类型', 'DI/DO 混合'), S('应用', '灵活 I/O 配置')] },
      { n: 'PT050温度测量模块', m: 'PT050', d: 'PT100/PT1000 温度接入，2/4 通道。', priority: 46, specs: [S('传感器', 'PT100/PT1000'), S('通道', '2/4 通道')] },
      { n: 'TC060热电偶测量模块', m: 'TC060', d: 'K/J/T/E 型热电偶测量模块。', priority: 45, specs: [S('类型', 'K/J/T/E 热电偶')] },
      { n: 'RO080/RO160继电器输出模块', m: 'RO 系列', d: '8/16 路继电器输出，2A 触点。', priority: 44, specs: [S('通道', '8/16 路'), S('触点', '2A')] },
      { n: 'TO160晶体管输出模块', m: 'TO160', d: '16 路晶体管高速输出。', priority: 43, specs: [S('通道', '16 路 TO'), S('特点', '高速开关')] },
    ],
  },
  {
    id: 'smart-breaker',
    cat: '智能配电与断路器',
    desc: '智能断路器与回路网关，实现过载/漏电保护与远程通断、计量与上云。',
    items: [
      {
        n: 'FECB2P智能断路器',
        m: 'FECB2P',
        d: '智能微型断路器，过载/短路/漏电保护，支持远程分合闸与电能计量。',
        priority: 80,
        features: ['过载/短路/漏电保护', '远程通断', '电能计量', 'RS485/无线'],
        specs: [
          S('保护', '过载 / 短路 / 漏电'),
          S('功能', '远程通断、电能计量'),
          S('通讯', 'RS485 / 无线'),
        ],
        scenes: ['住宅/商业配电智能化', '分项能耗管理', '远程断电控制'],
      },
      {
        n: 'FECB2LP/FECB2SLP智能漏电断路器',
        m: 'FECB2LP / FECB2SLP',
        d: '漏电保护电流 30/100/300mA 可调，支持漏电自检与远程控制。',
        priority: 75,
        features: ['漏电保护可调', '漏电自检', '远程通断', '小型化设计'],
        specs: [
          S('漏电档位', '30 / 100 / 300mA'),
          S('通讯', 'RS485 / 无线'),
        ],
        scenes: ['充电回路保护', '商铺/住户末端配电', '漏电风险回路'],
      },
      {
        n: 'FECM2智能断路器网关',
        m: 'FECM2',
        d: '多回路智能断路器汇聚网关，4G/Wi-Fi 上云，统一参数配置与告警联动。',
        priority: 70,
        features: ['多回路汇聚', '4G/Wi-Fi', '告警联动', '能耗统计'],
        specs: [
          S('功能', '多回路断路器汇聚'),
          S('上行', '4G / Wi-Fi'),
        ],
        scenes: ['配电箱集中上云', '多回路能耗管理', '智慧楼宇配电'],
      },
    ],
  },
  {
    id: 'software',
    cat: '软件与云平台',
    desc: 'FEXLINK 工业互联网平台与设备管理云，实现监控、告警、报表与远程运维。',
    items: [
      {
        n: 'FEXLINK工业互联网软件',
        m: 'V1.0',
        d: '工业互联网软件平台，设备监控、数据可视化、告警联动、权限管理与 KPI 统计，支持 PC 与移动端。',
        priority: 90,
        features: ['实时监控看板', '告警规则引擎', '历史数据与报表', '多级权限', 'OEE/能耗 KPI'],
        specs: [
          S('部署', '私有云 / 本地服务器'),
          S('接入', '全系列硬件与网关'),
          S('终端', 'Web + 移动端'),
        ],
        scenes: ['设备远程运维', '能源管理 EMS', '电气安全监控中心'],
      },
      {
        n: '设备管理云平台',
        m: 'SaaS 云平台',
        d: '微物联设备管理云平台，支持全系列设备接入、可视化监控、智能告警与报表导出。',
        priority: 85,
        features: ['多设备类型接入', '可视化面板', '告警策略自定义', '报表导出'],
        specs: [
          S('模式', 'SaaS 云服务'),
          S('协议', 'MQTT / HTTP API'),
        ],
        scenes: ['多站点设备纳管', '防雷/电气安全云监控', '集团级运维'],
      },
    ],
  },
];

function sortCatalog(cats) {
  return cats.map((c) => ({
    ...c,
    items: [...c.items].sort((a, b) => (b.priority || 0) - (a.priority || 0)),
  }));
}

function pickItems(cats, names) {
  const set = new Set(names);
  const out = [];
  for (const c of cats) {
    const items = c.items.filter((i) => set.has(i.n));
    if (items.length) out.push({ ...c, items });
  }
  return sortCatalog(out);
}

const YESLON_SORTED = sortCatalog(YESLON);

export const PROD_CATALOG = {
  yeslon: YESLON_SORTED,
  energy: sortCatalog([
    {
      id: 'ev-safety',
      cat: '充电站电气安全',
      desc: '面向充电站与充电棚的谐波、漏电、电弧与温度一体化监测终端。',
      items: [
        {
          n: '充电站电气安全监测终端',
          m: '定制终端',
          d: '专为充电桩回路设计，集成漏电、电弧、谐波、温度多参数监测，支持远程告警与平台联动。',
          priority: 100,
          features: ['漏电/电弧/谐波/温度', '谐波指纹分析接口', '远程告警', '4G/RS485 上云'],
          specs: [S('应用', '直流/交流充电回路'), S('监测', '漏电、电弧、谐波、温度'), S('通讯', 'RS485 / 4G')],
          scenes: ['公共充电站', '重卡充电站', '园区充电设施'],
        },
        {
          n: '谐波指纹分析仪',
          m: '256点/周期',
          d: '256 点/周期高频采样，AI 谐波特征识别，电气隐患提前预警，适用于充电站背景谐波诊断。',
          priority: 95,
          features: ['256点/周期采样', 'AI 谐波指纹', '隐患提前预警', '自动分析报告'],
          specs: [S('采样', '256 点/周期'), S('分析', 'AI 谐波特征识别'), S('预警', '趋势与阈值告警')],
          scenes: ['充电站谐波诊断', '背景谐波溯源', '电能质量评估'],
        },
        {
          n: '电动自行车充电棚监测终端',
          m: '四合一终端',
          d: '漏电、过载、温度、烟雾多参数监测，支持远程断电与消防联动，保障充电棚安全。',
          priority: 90,
          features: ['漏电/过载/温度/烟雾', '远程断电', '消防联动', '声光+平台告警'],
          specs: [S('监测', '漏电、过载、温度、烟雾'), S('控制', '远程分闸'), S('联动', '消防接口')],
          scenes: ['社区充电棚', '园区非机动车充电', '城中村充电治理'],
        },
      ],
    },
    {
      id: 'ess-safety',
      cat: '储能电站安全',
      desc: '储能系统电气安全与热失控早期预警监测方案配套硬件。',
      items: [
        {
          n: '储能电站安全监测系统',
          m: '系统级方案',
          d: '电池簇电压/电流/温度监测、绝缘诊断、弧光检测与多级告警，面向储能电气安全。',
          priority: 80,
          features: ['簇级电气监测', '热失控预警', '绝缘监测', '弧光检测', '消防联动'],
          specs: [S('层级', '电池簇 / 舱 / 站'), S('告警', '多级联动'), S('通讯', '网关集中上云')],
          scenes: ['电网侧储能', '工商业储能', '新能源配储'],
        },
      ],
    },
  ]),
};

// Rebuild vertical catalogs with proper category grouping
PROD_CATALOG['electrical-safety'] = sortCatalog([
  { id: 'pq', cat: '能效与电能质量', desc: '电能计量与电能质量专业分析。', items: YESLON_SORTED.find((c) => c.id === 'electrical-safety').items.filter((i) => ['ESA全要素智能电表', 'ESE电能质量监测器'].includes(i.n)) },
  { id: 'safety', cat: '电气安全监测', desc: '不平衡、漏电、温度、电弧与火灾监测。', items: YESLON_SORTED.find((c) => c.id === 'electrical-safety').items.filter((i) => !['ESA全要素智能电表', 'ESE电能质量监测器', 'ESX智能网关'].includes(i.n)) },
  { id: 'gw', cat: '网关与通信', desc: '电气安全设备汇聚与上云。', items: YESLON_SORTED.find((c) => c.id === 'electrical-safety').items.filter((i) => i.n === 'ESX智能网关').concat(YESLON_SORTED.find((c) => c.id === 'lightning-protection').items.filter((i) => i.n === 'FG智能防雷网关')) },
].filter((c) => c.items.length));

PROD_CATALOG['lightning-protection'] = sortCatalog([
  { id: 'spd', cat: 'SPD在线监测', desc: '电涌保护器状态、漏电流与雷击计数监测。', items: YESLON_SORTED.find((c) => c.id === 'lightning-protection').items.filter((i) => ['FS防雷器监测模块', 'FSS智能型电涌保护器', 'FSP电涌保护器底座', 'ESM防雷监测模组'].includes(i.n)) },
  { id: 'fl', cat: '雷电峰值监测', desc: '雷电流峰值、极性与时间记录。', items: YESLON_SORTED.find((c) => c.id === 'lightning-protection').items.filter((i) => i.n === 'FL雷电流监测模块') },
  { id: 'gr', cat: '接地电阻监测', desc: '三极法与回路法接地电阻在线监测。', items: YESLON_SORTED.find((c) => c.id === 'lightning-protection').items.filter((i) => ['FR接地电阻监测模块', 'FRP回路法接地电阻监测仪'].includes(i.n)) },
  { id: 'breaker', cat: '智能断路器', desc: '智能断路器与回路网关。', items: YESLON_SORTED.find((c) => c.id === 'smart-breaker').items },
  { id: 'gw', cat: '智能网关', desc: '防雷设备数据汇聚与上云。', items: YESLON_SORTED.find((c) => c.id === 'lightning-protection').items.filter((i) => i.n === 'FG智能防雷网关') },
].filter((c) => c.items.length));

PROD_CATALOG['industrial-plc'] = sortCatalog([
  { id: 'plc', cat: '可编程控制器', desc: 'CC/CR 系列 PLC 与分布式 I/O 站。', items: YESLON_SORTED.find((c) => c.id === 'plc').items },
  { id: 'edge', cat: '边缘智能', desc: '工业手环与边缘计算网关。', items: YESLON_SORTED.find((c) => c.id === 'edge-iot').items.filter((i) => ['CX系列工业设备手环', 'CW系列边缘计算网关'].includes(i.n)) },
  { id: 'io', cat: 'I/O 扩展模块', desc: '与 CC/CR 配套的模块化 I/O。', items: YESLON_SORTED.find((c) => c.id === 'plc-io').items },
  { id: 'hmi', cat: 'HMI 人机界面', desc: '工业触摸屏本地监控与操作。', items: YESLON_SORTED.find((c) => c.id === 'edge-iot').items.filter((i) => i.n === 'HMI工业触摸屏') },
]);
