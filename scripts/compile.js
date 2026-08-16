const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

execSync('npx tsc', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

const src = path.join(__dirname, '..', 'src', 'generated');
const dest = path.join(__dirname, '..', 'dist', 'generated');

if (!fs.existsSync(src)) {
  console.error('src/generated is missing. Prisma generate must run before compile.');
  process.exit(1);
}

fs.cpSync(src, dest, { recursive: true });
console.log('Compiled to dist/');
