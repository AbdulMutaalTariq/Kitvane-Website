/**
 * Kitvane Performance & Accessibility Polish
 * - Self-hosts Inter variable woff2 font (latin subset, weights 400-800)
 * - Removes Google Fonts preconnects and stylesheets
 * - Inlines all Lucide icons as native SVG elements (removes lucide.js script)
 * - Minifies production CSS to assets/css/style.min.css (with @font-face & system fallback)
 * - Fixes heading order (adds .sr-only h2 before trust cards on index.html)
 * - Ensures images have width & height (no lazy on logo)
 * - Removes HTML comments and unnecessary empty whitespace
 */

const fs = require('fs');
const path = require('path');
const lucide = require('lucide');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('Starting Performance & Accessibility Polish...');

// ----------------------------------------------------
// 1. Setup Font & CSS
// ----------------------------------------------------
const fontPath = path.join(ROOT_DIR, 'assets', 'fonts', 'inter-variable-latin.woff2');
if (!fs.existsSync(fontPath)) {
  throw new Error('inter-variable-latin.woff2 does not exist in assets/fonts!');
}

const fontFaceCss = `@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url('/assets/fonts/inter-variable-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;

const srOnlyCss = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;

const cssPath = path.join(ROOT_DIR, 'assets', 'css', 'style.css');
let readableCss = fs.readFileSync(cssPath, 'utf8');

// Ensure font-face is included
if (!readableCss.includes('inter-variable-latin.woff2')) {
  readableCss = fontFaceCss + '\n' + readableCss;
}

// Ensure .sr-only is included
if (!readableCss.includes('.sr-only')) {
  readableCss += '\n' + srOnlyCss;
}

// Ensure system font fallback stack
readableCss = readableCss.replace(
  /font-family:\s*['"]Inter['"],\s*sans-serif/g,
  "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
);

fs.writeFileSync(cssPath, readableCss, 'utf8');

// Minify CSS
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const minCss = minifyCss(readableCss);
fs.writeFileSync(path.join(ROOT_DIR, 'assets', 'css', 'style.min.css'), minCss, 'utf8');
console.log(`Minified CSS saved to assets/css/style.min.css (${minCss.length} bytes, was ${readableCss.length} bytes).`);

// ----------------------------------------------------
// 2. Lucide Icon to SVG Converter
// ----------------------------------------------------
function toCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, g => g[1].toUpperCase()).replace(/^[a-z]/, g => g.toUpperCase());
}

function renderLucideSvg(iconName, size = 20, extraClass = '') {
  const camel = toCamelCase(iconName);
  const iconData = lucide[camel] || lucide.icons[camel];
  if (!iconData) {
    throw new Error('Unknown icon: ' + iconName);
  }
  const cls = ['lucide', `lucide-${iconName}`, extraClass].filter(Boolean).join(' ');
  const inner = iconData.map(([tag, attrs]) => {
    const attrStr = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
    return `<${tag} ${attrStr} />`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${inner}</svg>`;
}

function replaceLucideTags(html) {
  return html.replace(/<i\s+([^>]*?)data-lucide=["']([^"']+)["']([^>]*?)(?:><\/i>|\/>)/gi, (match, pre, name, post) => {
    const allAttrs = (pre + ' ' + post).trim();
    const sizeMatch = allAttrs.match(/data-size=["'](\d+)["']/i) || allAttrs.match(/size=["'](\d+)["']/i);
    const size = sizeMatch ? parseInt(sizeMatch[1], 10) : 20;
    const classMatch = allAttrs.match(/class=["']([^"']+)["']/i);
    const extraClass = classMatch ? classMatch[1] : '';
    return renderLucideSvg(name, size, extraClass);
  });
}

// ----------------------------------------------------
// 3. Process All HTML Files
// ----------------------------------------------------
function searchDir(dir, ext = ['.html']) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'scripts') return;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(searchDir(p, ext));
    else if (ext.includes(path.extname(e.name))) files.push(p);
  });
  return files;
}

const htmlFiles = searchDir(ROOT_DIR);
console.log(`Processing ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');

  // A) Remove Google Fonts preconnects and stylesheet links
  html = html.replace(/<!--\s*Preconnect Fonts\s*-->/gi, '');
  html = html.replace(/<link\s+rel=["']preconnect["']\s+href=["']https:\/\/fonts\.googleapis\.com["']\s*\/?>\s*/gi, '');
  html = html.replace(/<link\s+rel=["']preconnect["']\s+href=["']https:\/\/fonts\.gstatic\.com["']\s*(?:crossorigin)?\s*\/?>\s*/gi, '');
  html = html.replace(/<link\s+href=["']https:\/\/fonts\.googleapis\.com\/css2\?[^"']+["']\s+rel=["']stylesheet["']\s*\/?>\s*/gi, '');

  // B) Add Font Preload if not present
  const fontPreload = '<link rel="preload" href="/assets/fonts/inter-variable-latin.woff2" as="font" type="font/woff2" crossorigin>';
  if (!html.includes('inter-variable-latin.woff2')) {
    html = html.replace(/(<meta\s+name=["']theme-color["'][^>]*>)/i, `$1\n  ${fontPreload}`);
  }

  // C) Switch stylesheet to /assets/css/style.min.css
  html = html.replace(/href=["'](?:\.\.\/|\/)?assets\/css\/style\.css["']/g, 'href="/assets/css/style.min.css"');

  // D) In-line Lucide SVGs & Remove Lucide runtime scripts
  html = replaceLucideTags(html);
  html = html.replace(/<!--\s*Lucide Icons\s*-->/gi, '');
  html = html.replace(/<script\s+src=["'][^"']*lucide[^"']*["'][^>]*><\/script>\s*/gi, '');

  // E) Ensure main.js has defer and correct path
  html = html.replace(/<script\s+src=["'](?:\.\.\/|\/)?assets\/js\/common\.js["'][^>]*><\/script>/gi, '<script src="/assets/js/main.js" defer></script>');
  html = html.replace(/<script\s+src=["'](?:\.\.\/|\/)?assets\/js\/main\.js["'](?!\s+defer)[^>]*><\/script>/gi, '<script src="/assets/js/main.js" defer></script>');

  // F) Heading Order Fix on index.html
  if (file.endsWith('index.html') && !file.includes('-') && !file.includes('about') && !file.includes('contact') && !file.includes('privacy') && !file.includes('terms')) {
    if (!html.includes('class="sr-only">Why Choose Kitvane')) {
      html = html.replace(
        '<div class="why-grid"',
        '<h2 class="sr-only">Why Choose Kitvane</h2>\n        <div class="why-grid"'
      );
    }
  }

  // G) Add width/height to preview images in image-compressor
  if (file.includes('image-compressor')) {
    html = html.replace(
      /<img\s+id="preview-original"\s+src=""\s+alt="Original image preview"\s*\/?>/i,
      '<img id="preview-original" src="" alt="Original image preview" width="300" height="200" style="aspect-ratio:3/2;object-fit:contain;" />'
    );
    html = html.replace(
      /<img\s+id="preview-compressed"\s+src=""\s+alt="Compressed image preview"\s*\/?>/i,
      '<img id="preview-compressed" src="" alt="Compressed image preview" width="300" height="200" style="aspect-ratio:3/2;object-fit:contain;" />'
    );
  }

  // H) User Request: Remove comments & empty spaces/lines safely
  // Remove HTML comments (except if conditional)
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  // Remove trailing whitespace from each line
  html = html.replace(/[ \t]+$/gm, '');
  // Collapse 3 or more blank lines into a single clean empty line
  html = html.replace(/\n{3,}/g, '\n\n');
  html = html.trim() + '\n';

  fs.writeFileSync(file, html, 'utf8');
});

console.log('Successfully polished all HTML files.');
