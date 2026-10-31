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
      const webApp = graph.find(x => x['@type'] === 'WebApplication');
      if (webApp) {
        console.log(`=== ${file} WebApplication ===`);
        console.log(JSON.stringify(webApp, null, 2));
      }
    } catch(e) {}
  });
});
