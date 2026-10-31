/**
 * Verification Script for Kitvane SEO & Link Preview fixes
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://tools.kitvane.workers.dev';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('=== 1. Checking for any remaining kitvane.link references ===');
function searchDir(dir, extFilter = ['.html', '.xml', '.txt', '.js', '.css', '.json']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(searchDir(fullPath, extFilter));
    } else if (extFilter.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = searchDir(ROOT_DIR);
let kitvaneLinkFound = false;
allFiles.forEach(file => {
  // skip scripts/build-all.js or verify-all.js where regex might mention it
  if (file.includes('scripts')) return;
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('kitvane.link')) {
    console.error(`  Found kitvane.link in: ${path.relative(ROOT_DIR, file)}`);
    kitvaneLinkFound = true;
  }
});
assert(!kitvaneLinkFound, 'Zero references to kitvane.link across all published files');

console.log('\n=== 2. Checking robots.txt ===');
const robotsContent = fs.readFileSync(path.join(ROOT_DIR, 'robots.txt'), 'utf8');
assert(robotsContent.includes(`Sitemap: ${BASE_URL}/sitemap.xml`), `robots.txt points to ${BASE_URL}/sitemap.xml`);
assert(robotsContent.includes('User-agent: *'), 'robots.txt allows all user agents');

console.log('\n=== 3. Checking sitemap.xml ===');
const sitemapContent = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
assert(sitemapContent.includes(`<loc>${BASE_URL}/</loc>`), 'sitemap.xml includes home page');
assert(sitemapContent.includes(`<loc>${BASE_URL}/image-compressor/</loc>`), 'sitemap.xml includes image compressor');
assert(sitemapContent.includes(`<loc>${BASE_URL}/5-letter-words-starting-with-a/</loc>`), 'sitemap.xml includes A-Z letter page A');
assert(sitemapContent.includes(`<loc>${BASE_URL}/5-letter-words-starting-with-z/</loc>`), 'sitemap.xml includes A-Z letter page Z');
const sitemapUrls = (sitemapContent.match(/<loc>/g) || []).length;
assert(sitemapUrls === 35, `sitemap.xml has exactly 35 URLs (found ${sitemapUrls})`);

console.log('\n=== 4. Checking Core Pages & Letter Pages Meta, Canonical, OpenGraph ===');
const testPages = [
  'index.html',
  'image-compressor/index.html',
  'loan-calculator/index.html',
  'age-calculator/index.html',
  'fancy-text/index.html',
  '5-letter-words/index.html',
  '5-letter-words-starting-with-a/index.html',
  '5-letter-words-starting-with-s/index.html',
  '5-letter-words-starting-with-z/index.html',
  'about/index.html',
  'contact/index.html',
  'privacy-policy/index.html',
  'terms/index.html'
];

testPages.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');

  // Title
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  assert(titleMatch && titleMatch[1].trim().length > 0, `${file}: Title tag present`);

  // Meta description (120 - 155 chars)
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  assert(descMatch && descMatch[1].length >= 120 && descMatch[1].length <= 155, `${file}: Description is ${descMatch ? descMatch[1].length : 0} chars (must be 120-155)`);

  // Canonical
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  assert(canonMatch && canonMatch[1].startsWith(BASE_URL), `${file}: Canonical points to BASE_URL`);

  // og:url
  const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["'](.*?)["']/i);
  assert(ogUrlMatch && canonMatch && ogUrlMatch[1] === canonMatch[1], `${file}: og:url equals canonical`);

  // og:image
  const ogImgMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
  assert(ogImgMatch && ogImgMatch[1] === `${BASE_URL}/og-image.png`, `${file}: og:image is ${BASE_URL}/og-image.png`);

  // og:image:width and og:image:height
  assert(content.includes('property="og:image:width" content="1200"'), `${file}: og:image:width is 1200`);
  assert(content.includes('property="og:image:height" content="630"'), `${file}: og:image:height is 630`);
  assert(content.includes('property="og:image:alt" content="Kitvane Tools: free online tools"'), `${file}: og:image:alt present`);

  // twitter tags
  assert(content.includes('name="twitter:card" content="summary_large_image"'), `${file}: twitter:card summary_large_image present`);
  assert(content.includes(`name="twitter:image" content="${BASE_URL}/og-image.png"`), `${file}: twitter:image matches og:image`);

  // Favicons
  assert(content.includes('<link rel="icon" href="/favicon.svg" type="image/svg+xml">'), `${file}: favicon.svg present`);
  assert(content.includes('<link rel="icon" href="/favicon.ico" sizes="any">'), `${file}: favicon.ico present`);
  assert(content.includes('<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">'), `${file}: favicon-32.png present`);
  assert(content.includes('<link rel="apple-touch-icon" href="/apple-touch-icon.png">'), `${file}: apple-touch-icon present`);
  assert(content.includes('<meta name="theme-color" content="#1d4ed8">'), `${file}: theme-color present`);

  // Keywords removed
  assert(!content.includes('<meta name="keywords"'), `${file}: No meta keywords`);

  // Valid JSON-LD
  const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(jsonLdMatch !== null, `${file}: JSON-LD script present`);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      assert(data['@context'] === 'https://schema.org', `${file}: JSON-LD context is schema.org`);
    } catch (e) {
      assert(false, `${file}: JSON-LD is valid JSON (${e.message})`);
    }
  }
});

console.log('\n=== 5. Checking Image Compressor H3 tags ===');
const imgHtml = fs.readFileSync(path.join(ROOT_DIR, 'image-compressor/index.html'), 'utf8');
assert(imgHtml.includes('<h3 class="step-item__title">Choose or drag your image file</h3>'), 'Step 1 title is <h3>');
assert(imgHtml.includes('<h3 class="step-item__title">Set your target size and options</h3>'), 'Step 2 title is <h3>');
assert(imgHtml.includes('<h3 class="step-item__title">Compress and download</h3>'), 'Step 3 title is <h3>');

console.log('\n=== 6. Checking Loan Calculator Prefills & Auto-Calculation ===');
const loanHtml = fs.readFileSync(path.join(ROOT_DIR, 'loan-calculator/index.html'), 'utf8');
assert(loanHtml.includes('id="principal" min="100" step="100" placeholder="e.g. 25000" value="25000"'), 'Principal prefilled with 25000');
assert(loanHtml.includes('id="rate" min="0.1" max="100" step="0.1" placeholder="e.g. 7.5" value="7.5"'), 'Rate prefilled with 7.5');
assert(loanHtml.includes('id="tenure" min="1" max="360" step="1" placeholder="e.g. 5" value="5"'), 'Tenure prefilled with 5');
assert(loanHtml.includes('calculate(false);'), 'calculate(false) called on page load');

console.log('\n=== 7. Checking 5-Letter Word Finder Fixes ===');
const wordHtml = fs.readFileSync(path.join(ROOT_DIR, '5-letter-words/index.html'), 'utf8');
assert(wordHtml.includes('Showing 636 Words'), 'Showing 636 Words in badge');
assert(!wordHtml.includes('information theory proves'), 'Unsourced claim "information theory proves" softened');
assert(!wordHtml.includes('<td>24 words'), 'Unsourced claim "24 words" softened');
assert(!wordHtml.includes('15% of all'), 'Unsourced claim "15%" softened');
assert(!wordHtml.includes('CORAL, IVORY, OLIVE, ROUGE'), 'Duplicate OLIVE in Colors replaced');
assert(wordHtml.includes('CORAL, IVORY, AMBER, ROUGE'), 'Color AMBER present in place of OLIVE');
assert(wordHtml.includes('Browse 5-Letter Words by Starting Letter'), 'A-Z directory links present');

console.log('\n=== 8. Checking og-image.png and logo-512.png files ===');
const ogStat = fs.statSync(path.join(ROOT_DIR, 'og-image.png'));
assert(ogStat.size > 0 && ogStat.size < 300 * 1024, `og-image.png is under 300KB (actual: ${(ogStat.size / 1024).toFixed(1)} KB)`);
assert(fs.existsSync(path.join(ROOT_DIR, 'logo-512.png')), 'logo-512.png exists in root');

console.log(`\n========================================`);
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
