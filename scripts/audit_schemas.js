const fs = require('fs');
const glob = ['index.html', 'image-compressor/index.html', 'loan-calculator/index.html', 'age-calculator/index.html', 'fancy-text/index.html', '5-letter-words/index.html', 'about/index.html', 'contact/index.html', 'privacy-policy/index.html', 'terms/index.html', '404.html'];

glob.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  console.log(`=== ${file} (${matches.length} json-ld scripts) ===`);
  matches.forEach((m, i) => {
    try {
      const data = JSON.parse(m[1].trim());
      if (data['@graph']) {
        console.log(`  Script ${i+1}: @graph with types:`, data['@graph'].map(item => item['@type']));
      } else {
        console.log(`  Script ${i+1}: type:`, data['@type']);
      }
    } catch (e) {
      console.log(`  Script ${i+1}: INVALID JSON:`, e.message);
    }
  });
});
