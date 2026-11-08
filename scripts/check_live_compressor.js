const https = require('https');

https.get('https://tools.kitvane.workers.dev/image-compressor/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Contains compress-progress:', data.includes('compress-progress'));
    console.log('Contains value="100":', data.includes('value="100"'));
    console.log('Contains placeholder with target KB:', data.includes('placeholder="e.g. 200'));
    console.log('Hidden file input present:', data.includes('pointer-events: none'));
  });
}).on('error', (e) => {
  console.error('Error fetching live:', e.message);
});
