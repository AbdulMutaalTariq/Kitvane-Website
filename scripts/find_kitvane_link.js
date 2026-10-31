const fs = require('fs');
const files = ['about/index.html', 'contact/index.html', 'privacy-policy/index.html', 'terms/index.html'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  content.split('\n').forEach((line, idx) => {
    if (line.includes('kitvane.link')) {
      console.log(`${f}:${idx + 1}: ${line.trim()}`);
    }
  });
});
