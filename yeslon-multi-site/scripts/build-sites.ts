import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';
import { yeslonConfig } from '../sites/yeslon/data/config';
import { pages as yeslonPages } from '../sites/yeslon/data/pages';
import { energyConfig } from '../sites/energy/data/config';
import { energyPages } from '../sites/energy/data/pages';
import { MetaGenerator } from '../packages/seo/metaGenerator';
import { SitemapGenerator } from '../packages/seo/generateSitemap';
import { RobotsGenerator } from '../packages/seo/generateRobots';

const sites = [
  { config: yeslonConfig, pages: yeslonPages, name: 'yeslon' },
  { config: energyConfig, pages: energyPages, name: 'energy' }
];

const outputDir = './dist';

async function generateSite(site) {
  const isMainSite = site.name === 'yeslon';
  console.log(`Generating site: ${site.name}${isMainSite ? ' (main → dist/ root)' : ''}...`);

  const metaGenerator = new MetaGenerator(site.config);
  const sitemapGenerator = new SitemapGenerator(site.config);
  const robotsGenerator = new RobotsGenerator(site.config);

  // Main site output goes to dist/ root, others go to dist/{name}/
  const siteOutputDir = isMainSite ? outputDir : join(outputDir, site.name);
  if (!existsSync(siteOutputDir)) {
    mkdirSync(siteOutputDir, { recursive: true });
  }

  // Sitemap and robots at site root
  const sitemap = sitemapGenerator.generate(site.pages);
  writeFileSync(join(siteOutputDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`  sitemap.xml`);

  const robots = robotsGenerator.generate();
  writeFileSync(join(siteOutputDir, 'robots.txt'), robots, 'utf-8');
  console.log(`  robots.txt`);

  for (const page of site.pages) {
    const meta = metaGenerator.generate(page);
    // Homepage → index.html at root, others → {path}/index.html
    const isHome = !page.path;
    const pageDir = isHome ? siteOutputDir : join(siteOutputDir, page.path);
    const pageFile = join(pageDir, 'index.html');

    if (!existsSync(pageDir)) {
      mkdirSync(pageDir, { recursive: true });
    }

    const html = generatePageHTML(site.config.siteName, meta);
    writeFileSync(pageFile, html, 'utf-8');
  }

  console.log(`  ${site.pages.length} pages generated`);
  console.log(`  ${site.name} site complete!\n`);
}

function generatePageHTML(siteName, meta) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <meta name="keywords" content="${escapeHtml(meta.keywords)}">
  <link rel="canonical" href="${escapeHtml(meta.canonical)}">
  <meta name="robots" content="${escapeHtml(meta.robots)}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(meta.ogTitle)}">
  <meta property="og:description" content="${escapeHtml(meta.ogDescription)}">
  <meta property="og:image" content="${escapeHtml(meta.ogImage)}">
  <meta property="og:url" content="${escapeHtml(meta.ogUrl)}">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">

  <meta name="twitter:card" content="${escapeHtml(meta.twitterCard)}">
  <meta name="twitter:title" content="${escapeHtml(meta.twitterTitle)}">
  <meta name="twitter:description" content="${escapeHtml(meta.twitterDescription)}">

  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root">
    <h1>${escapeHtml(meta.title)}</h1>
    <p>${escapeHtml(meta.description)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return String(text || '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function main() {
  console.log('Building multi-site...\n');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const site of sites) {
    await generateSite(site);
  }

  console.log('Multi-site build complete!');
  console.log(`Output directory: ${outputDir}`);
  console.log(`Sites generated:`);
  sites.forEach(site => {
    const subdomain = site.config.subdomain ? site.config.subdomain + '.' : '';
    console.log(`   - ${subdomain}${site.config.domain}`);
  });

  // Copy Cloudflare config files to dist/
  const cfFiles = ['_redirects', '_headers', '_routes.json'];
  for (const file of cfFiles) {
    const src = join(process.cwd(), file);
    if (existsSync(src)) {
      copyFileSync(src, join(outputDir, file));
      console.log(`  ${file}`);
    }
  }
}

main().catch(console.error);
