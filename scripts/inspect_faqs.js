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
  console.log(`=== ${file} ===`);
  // Find visible FAQ questions and answers
  // Usually .faq-item or details / summary or similar
  const qMatches = [...content.matchAll(/class=["']faq-item__question["'][^>]*>([\s\S]*?)<\/(?:button|div|h3|summary)>/gi)];
  if (qMatches.length > 0) {
    console.log(`  Found ${qMatches.length} questions:`);
    qMatches.forEach(q => console.log('   - ' + q[1].replace(/<[^>]+>/g, '').trim()));
  } else {
    // try summary or other FAQ classes
    const sumMatches = [...content.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/gi)];
    console.log(`  Found ${sumMatches.length} summaries:`);
    sumMatches.forEach(s => console.log('   - ' + s[1].replace(/<[^>]+>/g, '').trim()));
  }
});
