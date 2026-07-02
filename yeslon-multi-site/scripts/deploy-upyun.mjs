import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const DIST = join(root, 'dist');

const envPath = join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^(\w+)=(.+)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const UPYUN_BUCKET = process.env.UPYUN_BUCKET || 'yeslon';
const UPYUN_OPERATOR = process.env.UPYUN_OPERATOR;
const UPYUN_PASSWORD = process.env.UPYUN_PASSWORD;

if (!UPYUN_OPERATOR || !UPYUN_PASSWORD) {
  console.error('❌ 请在 .env 中配置 UPYUN_OPERATOR 和 UPYUN_PASSWORD');
  process.exit(1);
}

const AUTH = Buffer.from(`${UPYUN_OPERATOR}:${UPYUN_PASSWORD}`).toString('base64');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.gz': 'application/gzip',
};

function mime(path) {
  const ext = path.match(/\.(\w+)$/)?.[1];
  if (!ext) return 'application/octet-stream';
  for (const [k, v] of Object.entries(MIME)) {
    if (path.endsWith(k)) return v;
  }
  return 'application/octet-stream';
}

function uploadFile(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    const content = readFileSync(localPath);
    const req = https.request({
      hostname: 'v0.api.upyun.com',
      port: 443,
      path: `/${UPYUN_BUCKET}${remotePath}`,
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Length': content.length,
        'Content-Type': mime(remotePath),
      },
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`  ✅ ${remotePath}`);
          resolve();
        } else {
          console.error(`  ❌ ${remotePath} (${res.statusCode}: ${body})`);
          reject(new Error(`${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(content);
    req.end();
  });
}

async function uploadDir(dir, prefix = '') {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    const remote = `${prefix}/${entry}`;
    if (stat.isDirectory()) {
      await uploadDir(full, remote);
    } else {
      await uploadFile(full, remote);
    }
  }
}

async function main() {
  console.log('\n🚀 构建...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });

  if (!existsSync(DIST)) {
    console.error('❌ dist/ 不存在');
    process.exit(1);
  }

  console.log(`\n📤 上传到又拍云 (${UPYUN_BUCKET})...\n`);
  try {
    await uploadDir(DIST);
    console.log('\n✅ 全部上传完成！');
  } catch (e) {
    console.error('\n❌ 上传失败:', e.message);
    process.exit(1);
  }
}

main();
