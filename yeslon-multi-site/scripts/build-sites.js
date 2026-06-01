#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { MetaGenerator } from '../packages/seo/metaGenerator';
import { SitemapGenerator } from '../packages/seo/generateSitemap';
import { RobotsGenerator } from '../packages/seo/generateRobots';
import { yeslonConfig } from '../sites/yeslon/data/config';
import { pages as yeslonPages } from '../sites/yeslon/data/pages';
import { energyConfig } from '../sites/energy/data/config';
import { pages as energyPages } from '../sites/energy/data/pages';
const sites = [
  { config: yeslonConfig, pages: yeslonPages, name: 'yeslon' },
  { config: energyConfig, pages: energyPages, name: 'energy' }
];

const outputDir = './dist';

async function generateSite(site: typeof sites[0]) {
  console.log(`Generating site: ${site.name}...`);
  
  const metaGenerator = new MetaGenerator(site.config);
  const sitemapGenerator = new SitemapGenerator(site.config);
  const robotsGenerator = new RobotsGenerator(site.config);

  const siteOutputDir = join(outputDir, site.name);
  if (!existsSync(siteOutputDir)) {
    mkdirSync(siteOutputDir, { recursive: true });
  }

  const sitemap = sitemapGenerator.generate(site.pages);
  writeFileSync(join(siteOutputDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`  ✓ sitemap.xml`);

  const robots = robotsGenerator.generate();
  writeFileSync(join(siteOutputDir, 'robots.txt'), robots, 'utf-8');
  console.log(`  ✓ robots.txt`);

  const pagesDir = join(siteOutputDir, 'pages');
  if (!existsSync(pagesDir)) {
    mkdirSync(pagesDir, { recursive: true });
  }

  for (const page of site.pages) {
    const meta = metaGenerator.generate(page);
    const pageFile = join(pagesDir, page.path || 'index', 'index.html');
    const pageDir = join(pagesDir, page.path || 'index');
    
    if (!existsSync(pageDir)) {
      mkdirSync(pageDir, { recursive: true });
    }

    const html = generatePageHTML(site.config.siteName, meta);
    writeFileSync(pageFile, html, 'utf-8');
  }

  console.log(`  ✓ ${site.pages.length} pages generated`);
  console.log(`  ✓ ${site.name} site complete!\n`);
}

function generatePageHTML(siteName: string, meta: any): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <meta name="keywords" content="${meta.keywords}">
  <link rel="canonical" href="${meta.canonical}">
  <meta name="robots" content="${meta.robots}">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="${meta.ogTitle}">
  <meta property="og:description" content="${meta.ogDescription}">
  <meta property="og:image" content="${meta.ogImage}">
  <meta property="og:url" content="${meta.ogUrl}">
  <meta property="og:site_name" content="${siteName}">
  
  <meta name="twitter:card" content="${meta.twitterCard}">
  <meta name="twitter:title" content="${meta.twitterTitle}">
  <meta name="twitter:description" content="${meta.twitterDescription}">
  
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root">
    <h1>${meta.title}</h1>
    <p>${meta.description}</p>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🏗️  Starting multi-site build...\n');
  
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const site of sites) {
    await generateSite(site);
  }

  console.log('✅ Multi-site build complete!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🌐 Sites generated:`);
  sites.forEach(site => {
    console.log(`   - ${site.config.subdomain ? site.config.subdomain + '.' : ''}${site.config.domain}`);
  });

  // Copy main site (yeslon) to dist/ root for Cloudflare Pages
  const mainSite = sites.find(s => s.name === 'yeslon');
  if (mainSite) {
    const mainDist = join(outputDir, 'yeslon');
    if (existsSync(mainDist)) {
      copyRecursiveSync(mainDist, outputDir);
      console.log(`\n📌 Main site copied to dist/ root for Cloudflare Pages`);
    }
  }

  // Copy Cloudflare config files to dist/
  const cfFiles = ['_redirects', '_headers', '_routes.json'];
  cfFiles.forEach(file => {
    const src = join(process.cwd(), file);
    if (existsSync(src)) {
      copyFileSync(src, join(outputDir, file));
      console.log(`  ✓ ${file}`);
    }
  });
}

function copyRecursiveSync(src, dest) {
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyRecursiveSync(srcPath, destPath);
    } else if (!existsSync(destPath)) {
      copyFileSync(srcPath, destPath);
    }
  }
}

main().catch(console.error);
