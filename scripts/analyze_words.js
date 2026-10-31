const fs = require('fs');
const html = fs.readFileSync('5-letter-words/index.html', 'utf8');
const match = html.match(/const WORDS = (\[[\s\S]*?\]);/);
const words = JSON.parse(match[1]);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const wordsByLetter = {};

alphabet.forEach(letter => {
  wordsByLetter[letter] = words.filter(w => w.startsWith(letter)).sort();
});

console.log('Words count per letter:');
alphabet.forEach(letter => {
  console.log(`${letter}: ${wordsByLetter[letter].length}`);
});
