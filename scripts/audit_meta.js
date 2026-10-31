const fs = require('fs');
const glob = ['index.html', 'image-compressor/index.html', 'loan-calculator/index.html', 'age-calculator/index.html', 'fancy-text/index.html', '5-letter-words/index.html', 'about/index.html', 'contact/index.html', 'privacy-policy/index.html', 'terms/index.html', '404.html'];

glob.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  const ogDescMatch = content.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
  const twDescMatch = content.match(/<meta\s+name=["']twitter:description["']\s+content=["'](.*?)["']/i);
  const keywordsMatch = content.match(/<meta\s+name=["']keywords["']/i);

  console.log(`=== ${file} ===`);
  console.log('  Title:', titleMatch ? titleMatch[1] : 'NONE');
  if (metaDescMatch) {
    console.log(`  Meta desc (${metaDescMatch[1].length} chars):`, metaDescMatch[1]);
  } else {
    console.log('  Meta desc: NONE');
  }
  console.log('  Has keywords tag:', !!keywordsMatch);
});
