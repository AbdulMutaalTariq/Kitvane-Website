const fs = require('fs');
const tools = [
  'image-compressor/index.html',
  'loan-calculator/index.html',
  'age-calculator/index.html',
  'fancy-text/index.html',
  '5-letter-words/index.html'
];

tools.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  matches.forEach(m => {
    try {
      const data = JSON.parse(m[1].trim());
      const graph = data['@graph'] || [data];
      const faq = graph.find(x => x['@type'] === 'FAQPage');
      if (faq) {
        console.log(`=== ${file} FAQPage Schema ===`);
        console.log(`  Number of questions: ${faq.mainEntity.length}`);
        faq.mainEntity.forEach(q => console.log('   - ' + q.name));
      }
    } catch(e) {}
  });
});
