// ═══════════════════════════════════════════
// Yeslon Multi-Site 全局配置
// 修改后需要重新运行 npm run build
// ═══════════════════════════════════════════

export const SITE_CONFIG = {
  // ========== Google Analytics 4 ==========
  // 留空则不启用GA
  GA_ID: '',      // 例如: 'G-XXXXXXXXXX'

  // ========== Google Search Console ==========
  // 留空则不启用验证
  SC_VERIFY: '',  // 例如: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  // ========== 百度站长验证 ==========
  // 留空则不启用
  BAIDU_VERIFY: 'codeva-Gw7FVtUTBA',

  // ========== 默认OG图片 ==========
  // 建议尺寸 1200×630px，PNG/JPG格式最佳
  // 将图片放在 yeslon-multi-site/dist/ 目录下，修改此处路径
  OG_IMAGE: '/logo.png',
};
