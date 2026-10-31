const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== AUDITING LIVE DEPLOYMENT ON https://tools.kitvane.workers.dev ===\n');

  // 1. Home
  const home = await fetchUrl('https://tools.kitvane.workers.dev/');
  console.log('--- HOME (/) ---');
  console.log('Status:', home.status);
  console.log('Canonical:', home.body.match(/<link\s+rel=["']canonical["'][^>]*>/)?.[0]);
  console.log('og:url:', home.body.match(/<meta\s+property=["']og:url["'][^>]*>/)?.[0]);
  console.log('Description length:', home.body.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/)?.[1]?.length);
  console.log('Has keywords?', home.body.includes('name="keywords"'));
  console.log('Has sr-only H2?', home.body.includes('class="sr-only">Why Choose Kitvane</h2>'));
  console.log('Contains kitvane.link?', home.body.includes('kitvane.link'));

  // 2. Image Compressor
  const img = await fetchUrl('https://tools.kitvane.workers.dev/image-compressor/');
  console.log('\n--- IMAGE COMPRESSOR (/image-compressor/) ---');
  console.log('Status:', img.status);
  console.log('Canonical:', img.body.match(/<link\s+rel=["']canonical["'][^>]*>/)?.[0]);
  console.log('Has keywords?', img.body.includes('name="keywords"'));
  console.log('Step 1 is H3?', img.body.includes('<h3 class="step-item__title">Choose or drag your image file</h3>'));
  console.log('Contains kitvane.link?', img.body.includes('kitvane.link'));

  // 3. Loan Calculator
  const loan = await fetchUrl('https://tools.kitvane.workers.dev/loan-calculator/');
  console.log('\n--- LOAN CALCULATOR (/loan-calculator/) ---');
  console.log('Status:', loan.status);
  console.log('Canonical:', loan.body.match(/<link\s+rel=["']canonical["'][^>]*>/)?.[0]);
  console.log('Principal value prefilled:', loan.body.match(/id="principal"[^>]*value="(\d+)"/)?.[1]);
  console.log('Calls calculate(false) onload?', loan.body.includes('calculate(false);'));
  console.log('Contains kitvane.link?', loan.body.includes('kitvane.link'));

  // 4. 5-Letter Word Finder
  const wf = await fetchUrl('https://tools.kitvane.workers.dev/5-letter-words/');
  console.log('\n--- 5-LETTER WORD FINDER (/5-letter-words/) ---');
  console.log('Status:', wf.status);
  console.log('Canonical:', wf.body.match(/<link\s+rel=["']canonical["'][^>]*>/)?.[0]);
  console.log('Badge text:', wf.body.match(/id="word-count-badge"[^>]*>([\s\S]*?)<\/span>/)?.[1]);
  console.log('Has "information theory proves"?', wf.body.includes('information theory proves'));
  console.log('Has "24 words"?', wf.body.includes('24 words'));
  console.log('Has OLIVE in colors?', wf.body.includes('BLACK, WHITE, BROWN, GREEN, CORAL, IVORY, OLIVE, ROUGE'));
  console.log('Has AMBER in colors?', wf.body.includes('BLACK, WHITE, BROWN, GREEN, CORAL, IVORY, AMBER, ROUGE'));
  console.log('Top 50 has word-chip?', wf.body.includes('<span class="word-chip">ABOUT</span>'));
  console.log('Links to A-Z pages?', wf.body.includes('/5-letter-words-starting-with-a/'));

  // 5. A-Z Page test
  const azA = await fetchUrl('https://tools.kitvane.workers.dev/5-letter-words-starting-with-a/');
  console.log('\n--- A-Z PAGE A (/5-letter-words-starting-with-a/) ---');
  console.log('Status:', azA.status);
  console.log('Canonical:', azA.body.match(/<link\s+rel=["']canonical["'][^>]*>/)?.[0]);
  console.log('Contains words?', azA.body.includes('ABOUT') && azA.body.includes('ALERT'));

  // 6. Check entire site for any kitvane.link
  const sitemap = await fetchUrl('https://tools.kitvane.workers.dev/sitemap.xml');
  console.log('\n--- SITEMAP (/sitemap.xml) ---');
  console.log('Contains kitvane.link?', sitemap.body.includes('kitvane.link'));
  console.log('Total URLs:', (sitemap.body.match(/<loc>/g) || []).length);

  const robots = await fetchUrl('https://tools.kitvane.workers.dev/robots.txt');
  console.log('\n--- ROBOTS (/robots.txt) ---');
  console.log('Body:', robots.body.trim());
}

run().catch(console.error);
