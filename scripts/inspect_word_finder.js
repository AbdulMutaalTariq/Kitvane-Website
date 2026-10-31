const fs = require('fs');
const html = fs.readFileSync('5-letter-words/index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('OLIVE')) {
    console.log('OLIVE at line ' + (idx + 1) + ': ' + line.trim());
  }
});

['information theory', '24 words', '15%', '380', '400', 'Top 50'].forEach(phrase => {
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(phrase.toLowerCase())) {
      console.log('[' + phrase + '] line ' + (idx + 1) + ': ' + line.trim());
    }
  });
});
