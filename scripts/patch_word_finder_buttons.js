const fs = require('fs');
const path = require('path');

const targetRoots = [
  'C:\\Users\\jz\\Desktop\\Kitvane',
  'C:\\Users\\jz\\.gemini\\antigravity\\scratch\\Kitvane'
];

const svgRotateCcw = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;

const replacementButtons = `<div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;align-items:center;">
          <button class="btn btn--secondary" id="clear-btn" style="display:inline-flex;align-items:center;gap:6px;">
            ${svgRotateCcw}
            Clear Filters
          </button>
        </div>`;

targetRoots.forEach(rootDir => {
  if (!fs.existsSync(rootDir)) return;

  // Find 5-letter-words/index.html and 5-letter-words-starting-with-*/index.html
  const dirs = fs.readdirSync(rootDir).filter(d => d === '5-letter-words' || d.startsWith('5-letter-words-starting-with-'));

  dirs.forEach(d => {
    const filePath = path.join(rootDir, d, 'index.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the button div containing filter-btn and clear-btn
    // Note: in files it might contain emoji or raw characters
    const oldButtonsRegex = /<div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;">\s*<button class="btn btn--primary" id="filter-btn">[\s\S]*?<\/button>\s*<button class="btn btn--secondary" id="clear-btn">[\s\S]*?Clear Filters<\/button>\s*<\/div>/;

    if (oldButtonsRegex.test(content)) {
      content = content.replace(oldButtonsRegex, () => replacementButtons);
    } else {
      console.warn('Could not match button pattern in:', filePath);
    }

    // Safely guard filterBtn listener in JS
    content = content.replace(/filterBtn\.addEventListener\('click',\s*filterWords\);/g, 'if (filterBtn) filterBtn.addEventListener(\'click\', filterWords);');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated buttons in:', filePath);
  });

  // Also update build-all.js template in scripts
  const buildAllPath = path.join(rootDir, 'scripts', 'build-all.js');
  if (fs.existsSync(buildAllPath)) {
    let buildScript = fs.readFileSync(buildAllPath, 'utf8');
    const oldBuildButtonsRegex = /<div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;">\s*<button class="btn btn--primary" id="filter-btn">[\s\S]*?<\/button>\s*<button class="btn btn--secondary" id="clear-btn">[\s\S]*?Clear Filters<\/button>\s*<\/div>/;
    if (oldBuildButtonsRegex.test(buildScript)) {
      buildScript = buildScript.replace(oldBuildButtonsRegex, () => replacementButtons);
      buildScript = buildScript.replace(/filterBtn\.addEventListener\('click',\s*filterWords\);/g, 'if (filterBtn) filterBtn.addEventListener(\'click\', filterWords);');
      fs.writeFileSync(buildAllPath, buildScript, 'utf8');
      console.log('Updated template in build-all.js in:', rootDir);
    }
  }
});

console.log('All word finder buttons successfully patched!');
