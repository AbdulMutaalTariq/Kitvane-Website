const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function searchDir(dir, ext = ['.html']) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'scripts') return;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(searchDir(p, ext));
    else if (ext.includes(path.extname(e.name))) files.push(p);
  });
  return files;
}

const htmlFiles = searchDir(ROOT_DIR);
const missingFooterA = [];

htmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (!c.includes('/5-letter-words-starting-with-a/')) {
    missingFooterA.push(f);
  }
});

console.log('Files missing link to /5-letter-words-starting-with-a/:', missingFooterA.length);
console.log(missingFooterA);
