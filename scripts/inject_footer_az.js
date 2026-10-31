const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const files = [
  '404.html',
  'about/index.html',
  'age-calculator/index.html',
  'contact/index.html',
  'fancy-text/index.html',
  'image-compressor/index.html',
  'index.html',
  'loan-calculator/index.html',
  'privacy-policy/index.html',
  'terms/index.html'
];

const azBlock = `        <div>
          <p class="footer__col-title">5-Letter Words</p>
          <ul class="footer__links">
            <li><a href="/5-letter-words-starting-with-a/">Words Starting with A</a></li>
            <li><a href="/5-letter-words-starting-with-b/">Words Starting with B</a></li>
            <li><a href="/5-letter-words-starting-with-c/">Words Starting with C</a></li>
            <li><a href="/5-letter-words-starting-with-s/">Words Starting with S</a></li>
            <li><a href="/5-letter-words-starting-with-t/">Words Starting with T</a></li>
            <li><a href="/5-letter-words/">All 636 5-Letter Words &rarr;</a></li>
          </ul>
        </div>`;

files.forEach(rel => {
  const file = path.join(ROOT_DIR, rel);
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes('/5-letter-words-starting-with-a/')) {
    // Find the Tools column in footer and inject after it
    // Look for <p class="footer__col-title">Tools</p>...</ul></div>
    html = html.replace(
      /(<p class="footer__col-title">Tools<\/p>[\s\S]*?<\/ul>\s*<\/div>)/i,
      `$1\n\n${azBlock}`
    );
  }

  // Ensure root-relative links in footer
  html = html.replace(/href="image-compressor\/"/g, 'href="/image-compressor/"');
  html = html.replace(/href="loan-calculator\/"/g, 'href="/loan-calculator/"');
  html = html.replace(/href="age-calculator\/"/g, 'href="/age-calculator/"');
  html = html.replace(/href="fancy-text\/"/g, 'href="/fancy-text/"');
  html = html.replace(/href="5-letter-words\/"/g, 'href="/5-letter-words/"');
  html = html.replace(/href="about\/"/g, 'href="/about/"');
  html = html.replace(/href="contact\/"/g, 'href="/contact/"');
  html = html.replace(/href="privacy-policy\/"/g, 'href="/privacy-policy/"');
  html = html.replace(/href="terms\/"/g, 'href="/terms/"');

  fs.writeFileSync(file, html, 'utf8');
  console.log('Injected A-Z footer links into:', rel);
});

// Update style.css footer grid to handle 5 columns gracefully
const cssPath = path.join(ROOT_DIR, 'assets', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(
  /\.footer__grid\s*\{[\s\S]*?grid-template-columns:\s*2fr 1fr 1fr 1fr;/i,
  `.footer__grid {\n  display: grid;\n  grid-template-columns: 2fr repeat(4, 1fr);`
);
fs.writeFileSync(cssPath, css, 'utf8');

// Minify CSS
function minifyCss(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}
fs.writeFileSync(path.join(ROOT_DIR, 'assets', 'css', 'style.min.css'), minifyCss(css), 'utf8');
console.log('Updated style.css and style.min.css for 5-column footer grid.');
