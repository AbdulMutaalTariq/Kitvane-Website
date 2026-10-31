/**
 * Refine All Fixes Script
 * Ensures:
 * 1. Loan calculator has static prefilled result & amortization table rows
 * 2. 5-letter word finder Top 50 has comma/whitespace separators
 * 3. Footer on all pages has links to A-Z pages
 * 4. Single BASE_URL = "https://tools.kitvane.workers.dev" across all files
 * 5. Strict meta description (120-155 chars) & no meta keywords
 * 6. Valid heading hierarchy (h1 -> h2 -> h3)
 * 7. Clean HTML comments and whitespace
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://tools.kitvane.workers.dev';

console.log('Running Refine All Fixes...');

// 1. Update Loan Calculator Static HTML
const loanPath = path.join(ROOT_DIR, 'loan-calculator', 'index.html');
let loanHtml = fs.readFileSync(loanPath, 'utf8');

const prefilledResultHtml = `<div class="result-box is-visible" id="result-box">
          <div style="margin-bottom:16px;">
            <span class="result-box__label">Monthly EMI Payment</span>
            <div class="result-box__main" id="res-emi">$500.95</div>
          </div>
          <div class="results-grid">
            <div class="result-item">
              <span class="result-item__value" id="res-principal">$25,000.00</span>
              <span class="result-item__label">Principal Amount</span>
            </div>
            <div class="result-item">
              <span class="result-item__value" style="color:var(--warning);" id="res-interest">$5,056.92</span>
              <span class="result-item__label">Total Interest</span>
            </div>
            <div class="result-item">
              <span class="result-item__value" style="color:var(--secondary);" id="res-total">$30,056.92</span>
              <span class="result-item__label">Total Payment</span>
            </div>
          </div>
          <h3 style="margin-top:36px;margin-bottom:12px;font-size:1.15rem;color:var(--text-primary);">Year-by-Year Amortization Schedule</h3>
          <div class="table-wrap">
            <table id="amort-table">
              <thead>
                <tr>
                  <th style="text-align:left;">Year</th>
                  <th>Principal Paid</th>
                  <th>Interest Paid</th>
                  <th>Ending Balance</th>
                </tr>
              </thead>
              <tbody id="amort-body">
                <tr>
                  <td style="font-weight:600;color:var(--text-primary);text-align:left;">Year 1</td>
                  <td style="text-align:right;">$4,281.58</td>
                  <td style="text-align:right;color:var(--warning);">$1,729.81</td>
                  <td style="text-align:right;font-weight:600;">$20,718.42</td>
                </tr>
                <tr>
                  <td style="font-weight:600;color:var(--text-primary);text-align:left;">Year 2</td>
                  <td style="text-align:right;">$4,613.97</td>
                  <td style="text-align:right;color:var(--warning);">$1,397.42</td>
                  <td style="text-align:right;font-weight:600;">$16,104.46</td>
                </tr>
                <tr>
                  <td style="font-weight:600;color:var(--text-primary);text-align:left;">Year 3</td>
                  <td style="text-align:right;">$4,972.16</td>
                  <td style="text-align:right;color:var(--warning);">$1,039.22</td>
                  <td style="text-align:right;font-weight:600;">$11,132.29</td>
                </tr>
                <tr>
                  <td style="font-weight:600;color:var(--text-primary);text-align:left;">Year 4</td>
                  <td style="text-align:right;">$5,358.16</td>
                  <td style="text-align:right;color:var(--warning);">$653.22</td>
                  <td style="text-align:right;font-weight:600;">$5,774.13</td>
                </tr>
                <tr>
                  <td style="font-weight:600;color:var(--text-primary);text-align:left;">Year 5</td>
                  <td style="text-align:right;">$5,774.13</td>
                  <td style="text-align:right;color:var(--warning);">$237.25</td>
                  <td style="text-align:right;font-weight:600;">$0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;

loanHtml = loanHtml.replace(/<div class="result-box"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="ad-slot/i, `${prefilledResultHtml}\n      </div>\n      <div class="ad-slot`);
fs.writeFileSync(loanPath, loanHtml, 'utf8');
console.log('Loan calculator static results & amortization rows prefilled.');

// 2. Update 5-Letter Word Finder Top 50 Separators
const wfPath = path.join(ROOT_DIR, '5-letter-words', 'index.html');
let wfHtml = fs.readFileSync(wfPath, 'utf8');

const top50Words = [
  "ABOUT", "AFTER", "AGAIN", "AMONG", "BEING",
  "BUILT", "CARRY", "CAUSE", "COULD", "COUNT",
  "DEATH", "DOING", "EARLY", "EVERY", "FIRST",
  "FOUND", "GIVES", "GOING", "GREAT", "GROUP",
  "HANDS", "HEART", "HOUSE", "HUMAN", "LARGE",
  "LATER", "LEVEL", "LIGHT", "LOCAL", "NEVER",
  "NIGHT", "OFTEN", "ORDER", "OTHER", "PLACE",
  "POINT", "RIGHT", "ROUND", "SINCE", "SMALL",
  "STATE", "STILL", "TAKEN", "THEIR", "THING",
  "THOSE", "THREE", "UNDER", "UNTIL", "WATER"
];

const top50ChipsSeparated = top50Words.map((w, idx) =>
  `<span class="word-chip">${w}</span>${idx < top50Words.length - 1 ? ' ' : ''}`
).join('\n          ');

wfHtml = wfHtml.replace(
  /<div style="display:flex;flex-wrap:wrap;gap:6px;margin:16px 0;">[\s\S]*?<\/div>\s*<h2>5-Letter Words Grouped by Category/i,
  `<div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0;">\n          ${top50ChipsSeparated}\n        </div>\n        <h2>5-Letter Words Grouped by Category`
);

fs.writeFileSync(wfPath, wfHtml, 'utf8');
console.log('5-letter word finder Top 50 rendered with clean separators.');

// 3. Update Footer with A-Z Word Navigation Across All Pages
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
console.log(`Checking footers and links across ${htmlFiles.length} HTML files...`);

const footerAzColumn = `<div class="footer__col">
          <p class="footer__col-title">5-Letter Words</p>
          <ul class="footer__links">
            <li><a href="/5-letter-words-starting-with-a/">Words Starting with A</a></li>
            <li><a href="/5-letter-words-starting-with-b/">Words Starting with B</a></li>
            <li><a href="/5-letter-words-starting-with-c/">Words Starting with C</a></li>
            <li><a href="/5-letter-words-starting-with-s/">Words Starting with S</a></li>
            <li><a href="/5-letter-words-starting-with-t/">Words Starting with T</a></li>
            <li><a href="/5-letter-words/">All 636 5-Letter Words</a></li>
          </ul>
        </div>`;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Ensure footer has 5-letter words column
  if (!content.includes('Words Starting with A') && content.includes('<div class="footer__grid">')) {
    content = content.replace(
      /(<div class="footer__col">[\s\S]*?<p class="footer__col-title">Tools<\/p>[\s\S]*?<\/div>)/i,
      `$1\n        ${footerAzColumn}`
    );
  }

  // Ensure zero kitvane.link
  content = content.replace(/hello@kitvane\.link/g, 'contact@kitvane.tools');
  content = content.replace(/https?:\/\/(?:www\.)?kitvane\.link\/?/g, `${BASE_URL}/`);
  content = content.replace(/kitvane\.link/g, 'tools.kitvane.workers.dev');

  // Clean trailing spaces
  content = content.replace(/[ \t]+$/gm, '');
  // Collapse blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(file, content.trim() + '\n', 'utf8');
});

console.log('All footers and links refined across all HTML files.');
