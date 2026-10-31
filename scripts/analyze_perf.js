const fs = require('fs');
const path = require('path');

function searchDir(dir, ext = ['.html']) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    if (e.name === 'node_modules' || e.name === '.git') return;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(searchDir(p, ext));
    else if (ext.includes(path.extname(e.name))) files.push(p);
  });
  return files;
}

const htmlFiles = searchDir('.');
console.log('Total HTML files:', htmlFiles.length);

const icons = new Set();
const googleFontFiles = [];
const missingImgDims = [];
const headingIssues = [];

htmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');

  // Icons
  const iconMatches = [...c.matchAll(/data-lucide=["']([^"']+)["']/g)];
  iconMatches.forEach(m => icons.add(m[1]));

  // Fonts
  if (c.includes('fonts.googleapis.com') || c.includes('fonts.gstatic.com')) {
    googleFontFiles.push(f);
  }

  // Images missing width or height
  const imgMatches = [...c.matchAll(/<img\s+[^>]*>/gi)];
  imgMatches.forEach(m => {
    const tag = m[0];
    if (!tag.includes('width=') || !tag.includes('height=')) {
      missingImgDims.push({ file: f, tag });
    }
  });

  // Heading order
  const headings = [...c.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map(h => ({
    level: parseInt(h[1][1], 10),
    tag: h[1],
    text: h[2].replace(/<[^>]+>/g, '').trim().slice(0, 30)
  }));
  
  let prevLevel = 0;
  headings.forEach(h => {
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      headingIssues.push({
        file: f,
        prev: 'h' + prevLevel,
        current: h.tag,
        text: h.text
      });
    }
    prevLevel = h.level;
  });
});

console.log('--- LUCIDE ICONS USED ---');
console.log([...icons]);

console.log('--- FILES WITH GOOGLE FONTS ---');
console.log(googleFontFiles.length, 'files');

console.log('--- IMAGES MISSING WIDTH/HEIGHT ---');
console.log(missingImgDims);

console.log('--- HEADING ORDER ISSUES ---');
console.log(headingIssues);
