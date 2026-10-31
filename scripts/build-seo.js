/**
 * Kitvane SEO & Static Site Generator
 * Enforces single BASE_URL, valid OpenGraph / Twitter tags, JSON-LD schemas,
 * A-Z static word finder pages, sitemap.xml, and robots.txt.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://tools.kitvane.workers.dev';
const TODAY = new Date().toISOString().split('T')[0];

console.log(`Starting Kitvane SEO build with BASE_URL = ${BASE_URL}...`);

// 1. Load WORDS dictionary from 5-letter-words/index.html
const wordFinderPath = path.join(ROOT_DIR, '5-letter-words', 'index.html');
const wordFinderContent = fs.readFileSync(wordFinderPath, 'utf8');
const wordsMatch = wordFinderContent.match(/const WORDS = (\[[\s\S]*?\]);/);
if (!wordsMatch) {
  throw new Error('Could not parse WORDS from 5-letter-words/index.html');
}
const WORDS = JSON.parse(wordsMatch[1]);
console.log(`Loaded ${WORDS.length} words from dictionary.`);

// Group words by starting letter
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const wordsByLetter = {};
alphabet.forEach(letter => {
  const matching = WORDS.filter(w => w.startsWith(letter)).sort();
  if (matching.length > 0) {
    wordsByLetter[letter] = matching;
  }
});
const activeLetters = Object.keys(wordsByLetter).sort();
console.log(`Active letters with words (${activeLetters.length}): ${activeLetters.join(', ')}`);

// Core pages metadata configuration (meta descriptions strictly 120-155 chars)
const corePages = {
  'index.html': {
    path: '/',
    title: 'Kitvane Tools: Free Online Tools for Everyday Tasks',
    description: 'Free browser-based utility tools: compress images, calculate loan EMIs, find exact age, generate fancy text, and solve 5-letter word puzzles privately.',
    type: 'home'
  },
  'image-compressor/index.html': {
    path: '/image-compressor/',
    title: 'Image Compressor: Kitvane Tools',
    description: 'Compress JPG, PNG, and WebP images to your target KB size online. 100% private client-side processing with no file uploads to any server.',
    type: 'tool',
    toolName: 'Image Compressor',
    toolDesc: 'Compress images to exact KB size online. Supports JPG, PNG, WebP. Runs entirely in browser.'
  },
  'loan-calculator/index.html': {
    path: '/loan-calculator/',
    title: 'Loan & EMI Calculator: Kitvane Tools',
    description: 'Calculate exact monthly EMI for home, car, or personal loans. View total interest, repayment amounts, and year-by-year amortization instantly.',
    type: 'tool',
    toolName: 'EMI Calculator',
    toolDesc: 'Calculate exact monthly EMI for home, car, or personal loans with full amortization schedule.'
  },
  'age-calculator/index.html': {
    path: '/age-calculator/',
    title: 'Age Calculator: Kitvane Tools',
    description: 'Calculate your exact age in years, months, days, and hours. Discover upcoming birthday countdowns and historical life milestones for free.',
    type: 'tool',
    toolName: 'Age Calculator',
    toolDesc: 'Calculate exact age in years, months, days, hours, weeks, and minutes. Handles leap years correctly.'
  },
  'fancy-text/index.html': {
    path: '/fancy-text/',
    title: 'Fancy Text Generator: Kitvane Tools',
    description: 'Generate stylish Unicode text styles online. Copy and paste gothic, cursive, bold, and bubble fonts for Instagram, Twitter, and WhatsApp bio.',
    type: 'tool',
    toolName: 'Fancy Text Generator',
    toolDesc: 'Convert regular text into 20+ stylish Unicode fonts with instant copy to clipboard.'
  },
  '5-letter-words/index.html': {
    path: '/5-letter-words/',
    title: '5-Letter Word Finder: Kitvane Tools',
    description: 'Solve word puzzles with our 5-letter word finder. Filter 636 curated words by starting letter, position, and excluded letters for Wordle.',
    type: 'tool',
    toolName: '5-Letter Word Finder',
    toolDesc: 'Find 5-letter words with exact letter position, prefix, suffix, and excluded letter filters for Wordle and Scrabble.'
  },
  'about/index.html': {
    path: '/about/',
    title: 'About Us: Kitvane Tools',
    description: 'Learn about Kitvane: who we are, what we built, and why we built free privacy-first browser tools with no account or uploads required.',
    type: 'info',
    pageName: 'About Us'
  },
  'contact/index.html': {
    path: '/contact/',
    title: 'Contact Us: Kitvane Tools',
    description: 'Get in touch with the Kitvane team for questions, tool suggestions, bug reports, or partnership opportunities. We respond within 24–48 hours.',
    type: 'info',
    pageName: 'Contact Us'
  },
  'privacy-policy/index.html': {
    path: '/privacy-policy/',
    title: 'Privacy Policy: Kitvane Tools',
    description: 'Kitvane privacy policy explains our commitment to user privacy. All utility tools process data locally in your browser with no uploads.',
    type: 'info',
    pageName: 'Privacy Policy'
  },
  'terms/index.html': {
    path: '/terms/',
    title: 'Terms of Service: Kitvane Tools',
    description: 'Read the Kitvane terms of service covering acceptable use, service availability, liability limitations, and intellectual property terms.',
    type: 'info',
    pageName: 'Terms of Service'
  },
  '404.html': {
    path: '/404.html',
    title: 'Page Not Found: Kitvane Tools',
    description: 'The page you requested could not be found. Explore Kitvane free online utility tools including image compressor, calculators, and word solvers.',
    type: '404'
  }
};

// Verify all descriptions are strictly between 120 and 155 chars
Object.entries(corePages).forEach(([file, meta]) => {
  const len = meta.description.length;
  if (len < 120 || len > 155) {
    throw new Error(`Meta description for ${file} is ${len} chars (must be 120-155): "${meta.description}"`);
  }
});
console.log('All core page descriptions verified (120-155 chars).');

module.exports = {
  ROOT_DIR,
  BASE_URL,
  TODAY,
  WORDS,
  wordsByLetter,
  activeLetters,
  corePages
};
