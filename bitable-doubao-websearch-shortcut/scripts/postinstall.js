const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'vendor', 'feishu-devtools-core');
const destDir = path.join(projectRoot, 'node_modules', '@bdeefe', 'feishu-devtools-core');

const ensureDirSync = (dir) => {
  if (fs.existsSync(dir)) return;
  ensureDirSync(path.dirname(dir));
  fs.mkdirSync(dir);
};

const copyRecursiveSync = (from, to) => {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    ensureDirSync(to);
    for (const entry of fs.readdirSync(from)) {
      copyRecursiveSync(path.join(from, entry), path.join(to, entry));
    }
    return;
  }
  ensureDirSync(path.dirname(to));
  fs.copyFileSync(from, to);
};

try {
  if (!fs.existsSync(srcDir)) {
    process.exit(0);
  }
  copyRecursiveSync(srcDir, destDir);
} catch (e) {
  process.exit(0);
}

