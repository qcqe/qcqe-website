/** 核心防雷 SEO 关键词（用户指定 + 检索变体） */
export const CORE_LIGHTNING_SEO_KEYWORDS = [
  '智慧防雷',
  '防雷',
  '智能防雷',
  '智能防雷监测',
  '智能防雷在线监测',
  '智能防雷监测系统',
  '智慧防雷监测系统',
  '雷电流监测',
  '接地电阻',
  '接地电阻监测系统',
  '智能接地电阻',
  '雷电防护监测',
  '雷电防护在线监测系统',
  '防雷监测发射器',
  '防雷发射器',
  '防雷接收器',
  '智能防雷发射器',
  '防雷器监测',
  'SPD监测',
  'spd监测',
  'SPD监测仪',
  'spd监测仪',
  '智能SPD',
  '智能spd',
  '智能防雷器',
] as const;

export function mergeKeywords(...lists: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const kw of list) {
      const key = kw.trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push(key);
      }
    }
  }
  return out;
}
