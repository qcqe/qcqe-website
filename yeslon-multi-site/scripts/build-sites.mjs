import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function readConfig(siteName) {
  const filePath = join(root, 'sites', siteName, 'data', 'config.ts');
  const content = readFileSync(filePath, 'utf-8');
  const subdomain = content.match(/subdomain:\s*'([^']+)'/)?.[1] || '';
  const domain = content.match(/(?<!sub)domain:\s*'([^']+)'/)?.[1] || '';
  const siteNameMatch = content.match(/siteName:\s*'([^']+)'/)?.[1] || '';
  const titleTemplate = content.match(/titleTemplate:\s*'([^']+)'/)?.[1] || '{pageTitle}';
  const seoDesc = content.match(/description:\s*'([^']+)'/)?.[1] || '';
  const ogImage = content.match(/ogImage:\s*'([^']+)'/)?.[1] || '/images/og.jpg';
  return { subdomain, domain, siteName: siteNameMatch, titleTemplate, seoDesc, ogImage };
}

function readPages(siteName) {
  const filePath = join(root, 'sites', siteName, 'data', 'pages.ts');
  const content = readFileSync(filePath, 'utf-8');

  // Parse pages array
  const pageRegex = /{\s*path:\s*'([^']*)'[\s\S]*?title:\s*'([^']*)'[\s\S]*?description:\s*'([^']*)'[\s\S]*?keywords:\s*\[([^\]]*)\][\s\S]*?changeFreq:\s*'([^']*)'[\s\S]*?priority:\s*([\d.]+)/g;
  const pages = [];
  let match;
  while ((match = pageRegex.exec(content)) !== null) {
    pages.push({
      path: match[1],
      title: match[2],
      description: match[3],
      keywords: match[4].split(',').map(k => k.trim().replace(/'/g, '')),
      changeFreq: match[5],
      priority: parseFloat(match[6])
    });
  }
  return pages;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return String(text || '');
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(meta.ogImage)}">

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

function generateSitemap(pages, baseUrl) {
  const urls = pages.map(p => ({
    loc: `https://${baseUrl}/${p.path}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: p.changeFreq,
    priority: p.priority
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function generateRobots(baseUrl) {
  return `# robots.txt for ${baseUrl}
User-agent: *
Allow: /

Sitemap: https://${baseUrl}/sitemap.xml

Crawl-delay: 1

Disallow: /api/
Disallow: /*.json$
Disallow: /admin/`;
}

const sites = [
  { name: 'yeslon', isMain: true },
  { name: 'energy' },
  { name: 'electrical-safety' },
  { name: 'lightning-protection' },
  { name: 'industrial-plc' }
];

const outputDir = join(root, 'dist');

async function generateSite(siteInfo) {
  const { name, isMain } = siteInfo;
  console.log(`Generating site: ${name}${isMain ? ' (main → dist/ root)' : ''}...`);

  const config = readConfig(name);
  const pages = readPages(name);
  const baseUrl = config.subdomain ? `${config.subdomain}.${config.domain}` : config.domain;

  const siteOutputDir = isMain ? outputDir : join(outputDir, name);
  if (!existsSync(siteOutputDir)) {
    mkdirSync(siteOutputDir, { recursive: true });
  }

  // Sitemap
  const sitemap = generateSitemap(pages, baseUrl);
  writeFileSync(join(siteOutputDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`  sitemap.xml`);

  // Robots
  const robots = generateRobots(baseUrl);
  writeFileSync(join(siteOutputDir, 'robots.txt'), robots, 'utf-8');
  console.log(`  robots.txt`);

  // Pages
  for (const page of pages) {
    const title = config.titleTemplate
      .replace('{pageTitle}', page.title)
      .replace('{siteName}', config.siteName);

    const meta = {
      title,
      description: page.description || config.seoDesc,
      keywords: page.keywords.join(', '),
      canonical: `https://${baseUrl}/${page.path}`,
      robots: 'index, follow',
      ogTitle: title,
      ogDescription: page.description || config.seoDesc,
      ogImage: config.ogImage,
      ogUrl: `https://${baseUrl}/${page.path}`
    };

    const isHome = !page.path;
    const pageDir = isHome ? siteOutputDir : join(siteOutputDir, page.path);
    const pageFile = join(pageDir, 'index.html');

    if (!existsSync(pageDir)) {
      mkdirSync(pageDir, { recursive: true });
    }

    const html = generatePageHTML(config.siteName, meta);
    writeFileSync(pageFile, html, 'utf-8');
  }

  console.log(`  ${pages.length} pages generated`);
  console.log(`  ${name} site complete!\n`);
}

async function main() {
  console.log('Building multi-site...\n');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const site of sites) {
    await generateSite(site);
  }

  // Copy Cloudflare config
  const cfFiles = ['_redirects', '_headers', '_routes.json'];
  for (const file of cfFiles) {
    const src = join(root, file);
    if (existsSync(src)) {
      copyFileSync(src, join(outputDir, file));
      console.log(`  ${file}`);
    }
  }

  console.log('\nMulti-site build complete!');
  console.log(`Output: ${outputDir}`);
}

main().catch(console.error);
