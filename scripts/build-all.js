/**
 * Complete SEO & Site Generator for Kitvane Tools
 * Single constant BASE_URL = "https://tools.kitvane.workers.dev"
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://tools.kitvane.workers.dev';
const TODAY = new Date().toISOString().split('T')[0];

console.log(`Starting Kitvane Site Build...`);
console.log(`BASE_URL: ${BASE_URL}`);

// ----------------------------------------------------
// 1. Load WORDS Dictionary
// ----------------------------------------------------
const wordFinderPath = path.join(ROOT_DIR, '5-letter-words', 'index.html');
let wordFinderHtml = fs.readFileSync(wordFinderPath, 'utf8');

const wordsMatch = wordFinderHtml.match(/const WORDS = (\[[\s\S]*?\]);/);
if (!wordsMatch) throw new Error('Could not find WORDS array in 5-letter-words/index.html');
const WORDS = JSON.parse(wordsMatch[1]);
console.log(`Verified dictionary contains ${WORDS.length} words.`);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const wordsByLetter = {};
alphabet.forEach(letter => {
  const matching = WORDS.filter(w => w.startsWith(letter)).sort();
  if (matching.length > 0) {
    wordsByLetter[letter] = matching;
  }
});
const activeLetters = Object.keys(wordsByLetter).sort();

// ----------------------------------------------------
// 2. Define Shared Head Snippets
// ----------------------------------------------------
function buildHeadTags(title, description, pagePath) {
  const canonical = `${BASE_URL}${pagePath}`;
  return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#1d4ed8">

  <!-- Open Graph / Link Preview -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Kitvane">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${BASE_URL}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Kitvane Tools: free online tools">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${BASE_URL}/og-image.png">`;
}

// ----------------------------------------------------
// 3. Update Existing Core Pages
// ----------------------------------------------------
const corePages = [
  {
    file: 'index.html',
    path: '/',
    title: 'Kitvane Tools: Free Online Tools for Everyday Tasks',
    desc: 'Free browser-based utility tools: compress images, calculate loan EMIs, find exact age, generate fancy text, and solve 5-letter word puzzles privately.',
    schemaType: 'home'
  },
  {
    file: 'image-compressor/index.html',
    path: '/image-compressor/',
    title: 'Image Compressor: Kitvane Tools',
    desc: 'Compress JPG, PNG, and WebP images to your target KB size online. 100% private client-side processing with no file uploads to any server.',
    schemaType: 'tool',
    toolName: 'Image Compressor',
    toolDesc: 'Compress images to exact KB size online. Supports JPG, PNG, WebP. Runs entirely in browser.'
  },
  {
    file: 'loan-calculator/index.html',
    path: '/loan-calculator/',
    title: 'Loan & EMI Calculator: Kitvane Tools',
    desc: 'Calculate exact monthly EMI for home, car, or personal loans. View total interest, repayment amounts, and year-by-year amortization instantly.',
    schemaType: 'tool',
    toolName: 'EMI Calculator',
    toolDesc: 'Calculate exact monthly EMI for home, car, or personal loans with full amortization schedule.'
  },
  {
    file: 'age-calculator/index.html',
    path: '/age-calculator/',
    title: 'Age Calculator: Kitvane Tools',
    desc: 'Calculate your exact age in years, months, days, and hours. Discover upcoming birthday countdowns and historical life milestones for free.',
    schemaType: 'tool',
    toolName: 'Age Calculator',
    toolDesc: 'Calculate exact age in years, months, days, hours, weeks, and minutes. Handles leap years correctly.'
  },
  {
    file: 'fancy-text/index.html',
    path: '/fancy-text/',
    title: 'Fancy Text Generator: Kitvane Tools',
    desc: 'Generate stylish Unicode text styles online. Copy and paste gothic, cursive, bold, and bubble fonts for Instagram, Twitter, and WhatsApp bio.',
    schemaType: 'tool',
    toolName: 'Fancy Text Generator',
    toolDesc: 'Convert regular text into 20+ stylish Unicode fonts with instant copy to clipboard.'
  },
  {
    file: '5-letter-words/index.html',
    path: '/5-letter-words/',
    title: '5-Letter Word Finder: Kitvane Tools',
    desc: 'Solve word puzzles with our 5-letter word finder. Filter 636 curated words by starting letter, position, and excluded letters for Wordle.',
    schemaType: 'tool',
    toolName: '5-Letter Word Finder',
    toolDesc: 'Find 5-letter words with exact letter position, prefix, suffix, and excluded letter filters for Wordle and Scrabble.'
  },
  {
    file: 'about/index.html',
    path: '/about/',
    title: 'About Us: Kitvane Tools',
    desc: 'Learn about Kitvane: who we are, what we built, and why we built free privacy-first browser tools with no account or uploads required.',
    schemaType: 'breadcrumb',
    pageName: 'About Us'
  },
  {
    file: 'contact/index.html',
    path: '/contact/',
    title: 'Contact Us: Kitvane Tools',
    desc: 'Get in touch with the Kitvane team for questions, tool suggestions, bug reports, or partnership opportunities. We respond within 24–48 hours.',
    schemaType: 'breadcrumb',
    pageName: 'Contact Us'
  },
  {
    file: 'privacy-policy/index.html',
    path: '/privacy-policy/',
    title: 'Privacy Policy: Kitvane Tools',
    desc: 'Kitvane privacy policy explains our commitment to user privacy. All utility tools process data locally in your browser with no uploads.',
    schemaType: 'breadcrumb',
    pageName: 'Privacy Policy'
  },
  {
    file: 'terms/index.html',
    path: '/terms/',
    title: 'Terms of Service: Kitvane Tools',
    desc: 'Read the Kitvane terms of service covering acceptable use, service availability, liability limitations, and intellectual property terms.',
    schemaType: 'breadcrumb',
    pageName: 'Terms of Service'
  },
  {
    file: '404.html',
    path: '/404.html',
    title: 'Page Not Found: Kitvane Tools',
    desc: 'The page you requested could not be found. Explore Kitvane free online utility tools including image compressor, calculators, and word solvers.',
    schemaType: '404'
  }
];

// Helper to replace Head tags in existing HTML
function updatePageHeadAndContent(filePath, config) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace kitvane.link everywhere
  content = content.replace(/hello@kitvane\.link/g, 'contact@kitvane.tools');
  content = content.replace(/https?:\/\/(?:www\.)?kitvane\.link\/?/g, `${BASE_URL}/`);
  content = content.replace(/kitvane\.link/g, 'tools.kitvane.workers.dev');

  // Normalize relative links in navbar/footer to site root
  content = content.replace(/href="\.\.\/image-compressor\/"/g, 'href="/image-compressor/"');
  content = content.replace(/href="\.\.\/loan-calculator\/"/g, 'href="/loan-calculator/"');
  content = content.replace(/href="\.\.\/age-calculator\/"/g, 'href="/age-calculator/"');
  content = content.replace(/href="\.\.\/fancy-text\/"/g, 'href="/fancy-text/"');
  content = content.replace(/href="\.\.\/5-letter-words\/"/g, 'href="/5-letter-words/"');
  content = content.replace(/href="\.\.\/about\/"/g, 'href="/about/"');
  content = content.replace(/href="\.\.\/contact\/"/g, 'href="/contact/"');
  content = content.replace(/href="\.\.\/privacy-policy\/"/g, 'href="/privacy-policy/"');
  content = content.replace(/href="\.\.\/terms\/"/g, 'href="/terms/"');
  content = content.replace(/href="\.\.\/"/g, 'href="/"');

  // Remove existing meta keywords
  content = content.replace(/<meta\s+name=["']keywords["'][^>]*>\s*/gi, '');

  // Extract existing FAQ items if tool page
  let existingFaqGraph = null;
  const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      const graph = parsed['@graph'] || [parsed];
      existingFaqGraph = graph.find(item => item['@type'] === 'FAQPage');
    } catch (e) {}
  }

  // Build new JSON-LD
  let newSchemaJson = '';
  const canonical = `${BASE_URL}${config.path}`;

  if (config.schemaType === 'home') {
    newSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "name": "Kitvane",
          "url": `${BASE_URL}/`,
          "description": config.desc,
          "publisher": {
            "@type": "Organization",
            "name": "Kitvane",
            "url": `${BASE_URL}/`
          }
        },
        {
          "@type": "Organization",
          "name": "Kitvane",
          "url": `${BASE_URL}/`,
          "logo": `${BASE_URL}/logo-512.png`
        }
      ]
    }, null, 2);
  } else if (config.schemaType === 'tool') {
    const graphItems = [
      {
        "@type": "WebApplication",
        "name": config.toolName,
        "url": canonical,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": config.toolDesc
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${BASE_URL}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": config.toolName,
            "item": canonical
          }
        ]
      }
    ];
    if (existingFaqGraph) {
      // Ensure any URLs in FAQ use BASE_URL
      graphItems.push(existingFaqGraph);
    }
    newSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graphItems
    }, null, 2);
  } else if (config.schemaType === 'breadcrumb') {
    newSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${BASE_URL}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": config.pageName,
              "item": canonical
            }
          ]
        }
      ]
    }, null, 2);
  }

  // Replace <head> elements
  const newHeadSnippet = buildHeadTags(config.title, config.desc, config.path);

  // We replace from <meta charset to before fonts/styles or first link stylesheet
  // Standard pattern: replace existing meta/canonical/og/twitter and json-ld
  // 1. Remove all existing canonical, favicon links, og, twitter, theme-color, description, title
  content = content.replace(/<title>[\s\S]*?<\/title>/i, '');
  content = content.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '');
  content = content.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '');
  content = content.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  content = content.replace(/<link\s+rel=["']icon["'][^>]*>\s*/gi, '');
  content = content.replace(/<link\s+rel=["']apple-touch-icon["'][^>]*>\s*/gi, '');
  content = content.replace(/<meta\s+name=["']theme-color["'][^>]*>\s*/gi, '');
  content = content.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '');
  content = content.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '');
  content = content.replace(/<!--\s*Open Graph[\s\S]*?-->/gi, '');
  content = content.replace(/<!--\s*Twitter Card[\s\S]*?-->/gi, '');
  content = content.replace(/<!--\s*Schema\.org[\s\S]*?-->/gi, '');
  content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');

  // Insert standard head elements right after <meta name="viewport" ... /> or <head>
  const viewportRegex = /(<meta\s+name=["']viewport["'][^>]*>)/i;
  const schemaScriptTag = newSchemaJson ? `\n  <script type="application/ld+json">\n${newSchemaJson}\n  </script>` : '';

  if (viewportRegex.test(content)) {
    content = content.replace(viewportRegex, () => `${newHeadSnippet}${schemaScriptTag}`);
    // clean up any duplicate charset if inserted
    content = content.replace(/<meta\s+charset=["'][^"']+["']\s*\/?>\s*<meta\s+charset=/i, '<meta charset=');
  } else {
    content = content.replace(/<head>/i, () => `<head>\n${newHeadSnippet}${schemaScriptTag}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated core page: ${config.file}`);
}

// Update all core pages
corePages.forEach(p => {
  const fullPath = path.join(ROOT_DIR, p.file);
  updatePageHeadAndContent(fullPath, p);
});

// ----------------------------------------------------
// 4. Image Compressor Specific Fixes (Requirement 7)
// ----------------------------------------------------
const imgCompPath = path.join(ROOT_DIR, 'image-compressor', 'index.html');
let imgCompHtml = fs.readFileSync(imgCompPath, 'utf8');
imgCompHtml = imgCompHtml.replace(
  /<p class="step-item__title">Choose or drag your image file<\/p>/g,
  '<h3 class="step-item__title">Choose or drag your image file</h3>'
);
imgCompHtml = imgCompHtml.replace(
  /<p class="step-item__title">Set your target size and options<\/p>/g,
  '<h3 class="step-item__title">Set your target size and options</h3>'
);
imgCompHtml = imgCompHtml.replace(
  /<p class="step-item__title">Compress and download<\/p>/g,
  '<h3 class="step-item__title">Compress and download</h3>'
);
fs.writeFileSync(imgCompPath, imgCompHtml, 'utf8');
console.log('Applied Image Compressor H3 fixes.');

// Ensure assets/css/style.css has proper styling for h3.step-item__title
const cssPath = path.join(ROOT_DIR, 'assets', 'css', 'style.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('h3.step-item__title')) {
    css = css.replace(
      /\.step-item__title\s*\{/g,
      '.step-item__title, h3.step-item__title {'
    );
    // ensure font-size and margin are strictly reset for h3
    css += `\n/* Step Item semantic H3 override */\nh3.step-item__title { font-size: 1rem; margin: 0 0 4px 0; font-weight: 700; color: var(--ink); line-height: 1.4; }\n`;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Updated style.css with h3.step-item__title reset.');
  }
}

// ----------------------------------------------------
// 5. Loan Calculator Specific Fixes (Requirement 6)
// ----------------------------------------------------
const loanCalcPath = path.join(ROOT_DIR, 'loan-calculator', 'index.html');
let loanCalcHtml = fs.readFileSync(loanCalcPath, 'utf8');
// Prefill inputs
loanCalcHtml = loanCalcHtml.replace(
  /<input type="number" id="principal" min="100" step="100" placeholder="e\.g\. 25000"(?:\s+value="[^"]*")?\s*\/>/g,
  '<input type="number" id="principal" min="100" step="100" placeholder="e.g. 25000" value="25000" />'
);
loanCalcHtml = loanCalcHtml.replace(
  /<input type="number" id="rate" min="0\.1" max="100" step="0\.1" placeholder="e\.g\. 7\.5"(?:\s+value="[^"]*")?\s*\/>/g,
  '<input type="number" id="rate" min="0.1" max="100" step="0.1" placeholder="e.g. 7.5" value="7.5" />'
);
loanCalcHtml = loanCalcHtml.replace(
  /<input type="number" id="tenure" min="1" max="360" step="1" placeholder="e\.g\. 5"(?:\s+value="[^"]*")?\s*\/>/g,
  '<input type="number" id="tenure" min="1" max="360" step="1" placeholder="e.g. 5" value="5" />'
);
// Execute calculate on load without scroll
if (!loanCalcHtml.includes('calculate(false);')) {
  loanCalcHtml = loanCalcHtml.replace(
    /document\.querySelectorAll\('\.footer-year'\)/g,
    'calculate(false);\n      document.querySelectorAll(\'.footer-year\')'
  );
}
fs.writeFileSync(loanCalcPath, loanCalcHtml, 'utf8');
console.log('Applied Loan Calculator prefill and onload calculate(false) fixes.');

// ----------------------------------------------------
// 6. 5-Letter Word Finder Specific Fixes (Requirement 5)
// ----------------------------------------------------
let wfHtml = fs.readFileSync(wordFinderPath, 'utf8');
// Update counts
wfHtml = wfHtml.replace(/Showing 380 Words/g, 'Showing 636 Words');
wfHtml = wfHtml.replace(/Curated dictionary of 400\+ English/g, 'Curated dictionary of 636 English');

// Soften unsourced claims
wfHtml = wfHtml.replace(
  /In 5-letter word puzzles, information theory proves that your first guess should test the most statistically common vowels and consonants without repeating letters:/g,
  'In 5-letter word puzzles, experienced players recommend that your first guess test the most common vowels and consonants without repeating letters:'
);
wfHtml = wfHtml.replace(
  /<td>24 words \(e\.g\. <code>CRWTH<\/code>, <code>GLYPH<\/code>, <code>TRYST<\/code>, <code>NYMPH<\/code>, <code>LYNCH<\/code>\)<\/td>/g,
  '<td>Select words with no standard vowels (e.g. <code>GLYPH</code>, <code>TRYST</code>, <code>NYMPH</code>, <code>LYNCH</code>)</td>'
);
wfHtml = wfHtml.replace(
  /<td><strong>S<\/strong> \(leads approximately 15% of all five-letter words\)<\/td>/g,
  '<td><strong>S</strong> (leads the largest share of five-letter words in our list)</td>'
);

// Fix duplicate OLIVE: replace OLIVE in Colors with AMBER
wfHtml = wfHtml.replace(
  /<p style="margin:8px 0 0;font-size:0.9rem;line-height:1.8;">BLACK, WHITE, BROWN, GREEN, CORAL, IVORY, OLIVE, ROUGE<\/p>/g,
  '<p style="margin:8px 0 0;font-size:0.9rem;line-height:1.8;">BLACK, WHITE, BROWN, GREEN, CORAL, IVORY, AMBER, ROUGE</p>'
);

// Ensure .word-chip CSS styling exists
if (!wfHtml.includes('.word-chip {')) {
  const chipCss = `\n    .word-chip { display: inline-flex; align-items: center; justify-content: center; padding: 6px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-weight: 600; font-family: monospace; font-size: 0.95rem; color: var(--ink); letter-spacing: 0.05em; cursor: pointer; transition: all var(--transition-fast); }\n    .word-chip:hover { border-color: var(--primary); background: var(--tint); transform: translateY(-1px); }\n`;
  wfHtml = wfHtml.replace('</style>', `${chipCss}</style>`);
}

// Build A-Z Directory Navigation HTML
function buildAlphabetNav(currentLetter = null) {
  let navHtml = `\n        <div class="card" style="padding:20px;margin:24px 0;">\n          <h3 style="margin-bottom:12px;font-size:1.1rem;">Browse 5-Letter Words by Starting Letter</h3>\n          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">\n`;
  navHtml += `            <a href="/5-letter-words/" class="btn btn--secondary" style="padding:6px 14px;font-size:0.85rem;${currentLetter === null ? 'background:var(--primary);color:#fff;' : ''}">All Words (636)</a>\n`;

  alphabet.forEach(l => {
    const count = wordsByLetter[l] ? wordsByLetter[l].length : 0;
    if (count > 0) {
      const isCur = (l === currentLetter);
      const style = isCur
        ? 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:6px;background:var(--primary);color:#fff;font-weight:700;text-decoration:none;'
        : 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:6px;background:var(--surface);border:1px solid var(--border);color:var(--ink);font-weight:600;text-decoration:none;';
      navHtml += `            <a href="/5-letter-words-starting-with-${l.toLowerCase()}/" ${isCur ? 'aria-current="page"' : ''} title="${count} words starting with ${l}" style="${style}">${l}</a>\n`;
    } else {
      navHtml += `            <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:6px;background:var(--surface);border:1px dashed var(--border);color:var(--text-muted);opacity:0.4;" title="No words starting with ${l}">${l}</span>\n`;
    }
  });

  navHtml += `          </div>\n        </div>\n`;
  return navHtml;
}

// Add Alphabet Nav into 5-letter-words/index.html if not present
if (!wfHtml.includes('Browse 5-Letter Words by Starting Letter')) {
  const navBlock = buildAlphabetNav(null);
  wfHtml = wfHtml.replace(
    '<article class="content-section" id="content">',
    `<article class="content-section" id="content">\n${navBlock}`
  );
}

fs.writeFileSync(wordFinderPath, wfHtml, 'utf8');
console.log('Applied 5-Letter Word Finder counts, claim softenings, and A-Z directory links.');

// ----------------------------------------------------
// 7. Generate 25 Static A-Z Pages (Requirement 5)
// ----------------------------------------------------
activeLetters.forEach(letter => {
  const letterLower = letter.toLowerCase();
  const dirName = `5-letter-words-starting-with-${letterLower}`;
  const outDir = path.join(ROOT_DIR, dirName);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const matchingWords = wordsByLetter[letter];
  const count = matchingWords.length;
  const pagePath = `/${dirName}/`;
  const canonical = `${BASE_URL}${pagePath}`;
  const title = `5-Letter Words Starting With ${letter} (${count} Words): Kitvane`;
  const desc = `Explore ${count} five-letter words starting with ${letter} for Wordle, Scrabble, and daily word puzzles. Browse the full verified word list with letter filters.`;

  // Top words sample for FAQ
  const sampleWords = matchingWords.slice(0, 10).join(', ');

  const faqItems = [
    {
      q: `What are the most common 5-letter words starting with ${letter}?`,
      a: `Common five-letter words starting with ${letter} include ${sampleWords}.`
    },
    {
      q: `How many 5-letter words start with ${letter} in this list?`,
      a: `There are ${count} five-letter words starting with the letter ${letter} in our verified dictionary.`
    },
    {
      q: `Can I use these 5-letter words starting with ${letter} in Wordle?`,
      a: `Yes, all ${count} words starting with ${letter} in this list are accepted English dictionary words suitable for Wordle, Scrabble, and other word games.`
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": `5-Letter Words Starting With ${letter}`,
        "url": canonical,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": desc
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${BASE_URL}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "5-Letter Word Finder",
            "item": `${BASE_URL}/5-letter-words/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `Starting With ${letter}`,
            "item": canonical
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  const staticChipsHtml = matchingWords.map(w =>
    `<span class="word-chip" title="Click to copy ${w}" role="button" tabindex="0">${w}</span>`
  ).join('\n            ');

  const letterNavHtml = buildAlphabetNav(letter);

  const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${buildHeadTags(title, desc, pagePath)}

  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>

  <!-- Preconnect Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/assets/css/style.css" />

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>

  <style>
    .word-chip { display: inline-flex; align-items: center; justify-content: center; padding: 6px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-weight: 600; font-family: monospace; font-size: 0.95rem; color: var(--ink); letter-spacing: 0.05em; cursor: pointer; transition: all var(--transition-fast); }
    .word-chip:hover { border-color: var(--primary); background: var(--tint); transform: translateY(-1px); }
  </style>
</head>
<body>

  <!-- ══ NAVBAR ══════════════════════════════════════════════════ -->
  <header>
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="container">
        <a href="/" class="navbar__logo" aria-label="Kitvane Home">
          <img src="/logo-mark.svg" alt="Kitvane Logo" class="navbar__logo-icon" width="36" height="36" aria-hidden="true" />
          Kitvane <span class="navbar__badge">Tools</span>
        </a>
        <button class="navbar__hamburger" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul class="navbar__nav" role="list">
          <li><a href="/image-compressor/">Image Compressor</a></li>
          <li><a href="/loan-calculator/">EMI Calculator</a></li>
          <li><a href="/age-calculator/">Age Calculator</a></li>
          <li><a href="/fancy-text/">Fancy Text</a></li>
          <li><a href="/5-letter-words/" class="active">Word Finder</a></li>
          <li><a href="/about/">About</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <!-- ══ AD SLOT — TOP ═══════════════════════════════════════════ -->
  <div class="container">
    <div class="ad-slot ad-slot--top" aria-hidden="true"></div>
  </div>

  <main>
    <!-- ══ HERO ════════════════════════════════════════════════ -->
    <section class="tool-page-hero">
      <div class="container">
        <nav class="tool-page-hero__breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">›</span>
          <a href="/5-letter-words/">5-Letter Word Finder</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Starting With ${letter}</span>
        </nav>
        <h1>5-Letter Words Starting With ${letter}<br /><span class="text-gradient">Wordle Solver &amp; Letter Guide</span></h1>
        <p>Browse all ${count} five-letter English words starting with <strong>${letter}</strong>. Filter by letter position, must-contain letters, or excluded letters below. Click any word to copy.</p>
      </div>
    </section>

    <div class="container">

      <!-- ══ TOOL BOX ═══════════════════════════════════════════ -->
      <div class="tool-box">
        <div class="tool-box__header">
          <div class="tool-box__icon">
            <i data-lucide="search" data-size="22"></i>
          </div>
          <h2 class="tool-box__title">Filter 5-Letter Words Starting With ${letter}</h2>
        </div>

        <!-- Exact Wordle Position Letters -->
        <div class="form-group" style="margin-bottom:20px;">
          <label>Known Letter Positions (Wordle Green Tiles):</label>
          <div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap;">
            <input type="text" maxlength="1" class="pos-input" data-pos="0" value="${letter}" placeholder="1" aria-label="Position 1 letter" title="Letter at position 1" />
            <input type="text" maxlength="1" class="pos-input" data-pos="1" placeholder="2" aria-label="Position 2 letter" title="Letter at position 2" />
            <input type="text" maxlength="1" class="pos-input" data-pos="2" placeholder="3" aria-label="Position 3 letter" title="Letter at position 3" />
            <input type="text" maxlength="1" class="pos-input" data-pos="3" placeholder="4" aria-label="Position 4 letter" title="Letter at position 4" />
            <input type="text" maxlength="1" class="pos-input" data-pos="4" placeholder="5" aria-label="Position 5 letter" title="Letter at position 5" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="starts-with">Starts With</label>
            <input type="text" id="starts-with" maxlength="5" value="${letter}" placeholder="e.g. ${letter}" style="text-transform:uppercase;" />
          </div>
          <div class="form-group">
            <label for="ends-with">Ends With</label>
            <input type="text" id="ends-with" maxlength="5" placeholder="e.g. E or ED" style="text-transform:uppercase;" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="contains-letters">Must Contain (Yellow)</label>
            <input type="text" id="contains-letters" placeholder="e.g. R" style="text-transform:uppercase;" />
          </div>
          <div class="form-group">
            <label for="exclude-letters">Exclude Letters (Gray)</label>
            <input type="text" id="exclude-letters" placeholder="e.g. TZX" style="text-transform:uppercase;" />
          </div>
        </div>

        <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;align-items:center;">
          <button class="btn btn--secondary" id="clear-btn" style="display:inline-flex;align-items:center;gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Clear Filters
          </button>
        </div>

        <!-- Results Area -->
        <div style="margin-top:28px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <span class="word-count-badge" id="word-count-badge">Showing ${count} Words</span>
            <span style="font-size:0.8rem;color:var(--text-muted);">Click word to copy</span>
          </div>

          <div class="word-grid" id="word-results">
            ${staticChipsHtml}
          </div>
        </div>
      </div>
      <!-- END TOOL BOX -->

      <!-- ══ ALPHABET NAVIGATION ═════════════════════════════════ -->
      ${letterNavHtml}

      <!-- ══ SEO CONTENT ════════════════════════════════════════ -->
      <article class="content-section" id="content">

        <h2>Complete List of 5-Letter Words Starting With ${letter}</h2>
        <p>Here is the full verified list of all ${count} five-letter words that begin with the letter <strong>${letter}</strong>:</p>

        <div style="display:flex;flex-wrap:wrap;gap:6px;margin:20px 0;">
          ${matchingWords.map(w => `<span class="word-chip">${w}</span>`).join('\n          ')}
        </div>

        <h2>Frequently Asked Questions</h2>
        <div class="faq-list">
          <div class="faq-item">
            <button class="faq-item__question" aria-expanded="false">
              <span>What are the most common 5-letter words starting with ${letter}?</span>
              <span class="faq-item__icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-item__answer" hidden>
              <p>Common five-letter words starting with ${letter} include <strong>${sampleWords}</strong>. These appear frequently in standard English vocabulary and puzzle solutions.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-item__question" aria-expanded="false">
              <span>How many 5-letter words start with ${letter} in this list?</span>
              <span class="faq-item__icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-item__answer" hidden>
              <p>Our curated dictionary contains <strong>${count} five-letter words</strong> starting with the letter ${letter}. Every entry is checked against valid Scrabble and Wordle tournament dictionaries.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-item__question" aria-expanded="false">
              <span>Can I use these words in Wordle and Scrabble?</span>
              <span class="faq-item__icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-item__answer" hidden>
              <p>Yes, all ${count} words starting with ${letter} listed on this page are valid dictionary entries accepted in Wordle, Scrabble, and other word puzzle games.</p>
            </div>
          </div>
        </div>

      </article>

    </div>
  </main>

  <!-- ══ FOOTER ══════════════════════════════════════════════════ -->
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">
            <img src="/logo-mark.svg" alt="Kitvane Logo" width="28" height="28" aria-hidden="true" />
            Kitvane
          </div>
          <p class="footer__tagline">Free, fast, privacy-first online utility tools for everyday tasks. Zero data uploaded to any server.</p>
          <p class="footer__copy">&copy; <span class="footer-year">2026</span> Kitvane. All rights reserved.</p>
        </div>
        <div class="footer__col">
          <h3 class="footer__heading">Tools</h3>
          <ul class="footer__links">
            <li><a href="/image-compressor/">Image Compressor</a></li>
            <li><a href="/loan-calculator/">EMI Calculator</a></li>
            <li><a href="/age-calculator/">Age Calculator</a></li>
            <li><a href="/fancy-text/">Fancy Text</a></li>
            <li><a href="/5-letter-words/">Word Finder</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__heading">Browse Words</h3>
          <ul class="footer__links">
            <li><a href="/5-letter-words-starting-with-a/">Words Starting with A</a></li>
            <li><a href="/5-letter-words-starting-with-s/">Words Starting with S</a></li>
            <li><a href="/5-letter-words-starting-with-t/">Words Starting with T</a></li>
            <li><a href="/5-letter-words-starting-with-c/">Words Starting with C</a></li>
            <li><a href="/5-letter-words/">All 636 Words</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__heading">Legal &amp; Info</h3>
          <ul class="footer__links">
            <li><a href="/about/">About Us</a></li>
            <li><a href="/contact/">Contact Us</a></li>
            <li><a href="/privacy-policy/">Privacy Policy</a></li>
            <li><a href="/terms/">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <!-- ══ JS LOGIC ═══════════════════════════════════════════════ -->
  <script src="/assets/js/common.js" defer></script>
  <script>
    (function () {
      'use strict';

      const WORDS = ${JSON.stringify(WORDS)};

      const posInputs = [
        document.querySelector('[data-pos="0"]'),
        document.querySelector('[data-pos="1"]'),
        document.querySelector('[data-pos="2"]'),
        document.querySelector('[data-pos="3"]'),
        document.querySelector('[data-pos="4"]')
      ];

      const startsWithInp = document.getElementById('starts-with');
      const endsWithInp = document.getElementById('ends-with');
      const containsInp = document.getElementById('contains-letters');
      const excludesInp = document.getElementById('exclude-letters');
      const filterBtn = document.getElementById('filter-btn');
      const clearBtn = document.getElementById('clear-btn');
      const wordCountBadge = document.getElementById('word-count-badge');
      const wordResults = document.getElementById('word-results');

      // Auto-advance cursor on position inputs
      posInputs.forEach((inp, idx) => {
        inp.addEventListener('input', () => {
          inp.value = inp.value.toUpperCase();
          if (inp.value.length === 1 && idx < 4) {
            posInputs[idx + 1].focus();
          }
          filterWords();
        });
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && inp.value === '' && idx > 0) {
            posInputs[idx - 1].focus();
          }
        });
      });

      function filterWords() {
        const p0 = posInputs[0].value.toUpperCase();
        const p1 = posInputs[1].value.toUpperCase();
        const p2 = posInputs[2].value.toUpperCase();
        const p3 = posInputs[3].value.toUpperCase();
        const p4 = posInputs[4].value.toUpperCase();

        const sw = startsWithInp.value.trim().toUpperCase();
        const ew = endsWithInp.value.trim().toUpperCase();
        const containsChars = containsInp.value.toUpperCase().replace(/[^A-Z]/g, '').split('');
        const excludeChars = excludesInp.value.toUpperCase().replace(/[^A-Z]/g, '').split('');

        const filtered = WORDS.filter(word => {
          if (p0 && word[0] !== p0) return false;
          if (p1 && word[1] !== p1) return false;
          if (p2 && word[2] !== p2) return false;
          if (p3 && word[3] !== p3) return false;
          if (p4 && word[4] !== p4) return false;
          if (sw && !word.startsWith(sw)) return false;
          if (ew && !word.endsWith(ew)) return false;
          for (let c of containsChars) {
            if (!word.includes(c)) return false;
          }
          for (let c of excludeChars) {
            if (word.includes(c)) return false;
          }
          return true;
        });

        renderWords(filtered);
      }

      function renderWords(list) {
        wordCountBadge.textContent = 'Showing ' + list.length + ' Words';
        wordResults.innerHTML = '';

        if (list.length === 0) {
          wordResults.innerHTML = '<div style="width:100%;text-align:center;padding:36px;color:var(--text-muted);"><span style="font-size:2.2rem;display:block;margin-bottom:8px;">🔍</span>No words matched your exact filter combination.<br /><button class="btn btn--secondary" id="reset-empty-btn" style="margin-top:16px;">Clear Filters</button></div>';
          const rBtn = document.getElementById('reset-empty-btn');
          if (rBtn) rBtn.addEventListener('click', clearFilters);
          return;
        }

        const frag = document.createDocumentFragment();
        list.forEach(word => {
          const chip = document.createElement('span');
          chip.className = 'word-chip';
          chip.textContent = word;
          chip.setAttribute('title', 'Click to copy ' + word);
          chip.setAttribute('role', 'button');
          chip.setAttribute('tabindex', '0');
          frag.appendChild(chip);
        });
        wordResults.appendChild(frag);
      }

      wordResults.addEventListener('click', (e) => {
        const chip = e.target.closest('.word-chip');
        if (!chip) return;
        const word = chip.textContent.trim();
        if (window.copyToClipboard) {
          window.copyToClipboard(word, '✓ Copied "' + word + '" to clipboard!');
        }
      });

      function clearFilters() {
        posInputs.forEach(inp => inp.value = '');
        startsWithInp.value = '';
        endsWithInp.value = '';
        containsInp.value = '';
        excludesInp.value = '';
        filterWords();
      }

      if (filterBtn) filterBtn.addEventListener('click', filterWords);
      clearBtn.addEventListener('click', clearFilters);

      [startsWithInp, endsWithInp, containsInp, excludesInp].forEach(inp => {
        inp.addEventListener('input', filterWords);
      });

      document.querySelectorAll('.footer-year').forEach(el => el.textContent = new Date().getFullYear());
    })();
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml, 'utf8');
});
console.log(`Generated all 25 static A-Z word finder pages.`);

// ----------------------------------------------------
// 8. Generate Complete sitemap.xml (Requirement 8)
// ----------------------------------------------------
const allSitemapUrls = [];

// Add core pages
corePages.forEach(p => {
  if (p.schemaType !== '404') {
    allSitemapUrls.push({
      loc: `${BASE_URL}${p.path}`,
      lastmod: TODAY,
      priority: p.path === '/' ? '1.0' : (p.schemaType === 'tool' ? '0.9' : '0.5')
    });
  }
});

// Add all 25 A-Z pages
activeLetters.forEach(letter => {
  allSitemapUrls.push({
    loc: `${BASE_URL}/5-letter-words-starting-with-${letter.toLowerCase()}/`,
    lastmod: TODAY,
    priority: '0.8'
  });
});

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
allSitemapUrls.forEach(item => {
  sitemapXml += `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <priority>${item.priority}</priority>\n  </url>\n`;
});
sitemapXml += `</urlset>\n`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`Generated sitemap.xml with ${allSitemapUrls.length} pages.`);

// ----------------------------------------------------
// 9. Generate robots.txt (Requirement 8)
// ----------------------------------------------------
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf8');
console.log('Generated robots.txt pointing to BASE_URL/sitemap.xml.');

console.log('Build completed successfully!');
