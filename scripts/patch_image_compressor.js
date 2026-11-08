const fs = require('fs');
const path = require('path');

const targetPaths = [
  'C:\\Users\\jz\\Desktop\\Kitvane\\image-compressor\\index.html',
  'C:\\Users\\jz\\.gemini\\antigravity\\scratch\\Kitvane\\image-compressor\\index.html'
];

targetPaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping non-existent:', filePath);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add CSS for hidden native file input and dynamic progress bar inside <style>
  const stylePatch = `
    /* 5. Hide native file input completely across all browsers */
    .upload-area {
      cursor: pointer;
      position: relative;
      user-select: none;
    }
    .upload-area:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    .upload-area input[type="file"],
    #file-input {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* 6. Dynamic Compression Progress Bar */
    .compress-progress {
      display: none;
      margin-top: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 14px 18px;
      box-shadow: var(--shadow-sm);
    }
    .compress-progress.is-visible {
      display: block;
    }
    .compress-progress__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--ink);
    }
    .compress-progress__track {
      width: 100%;
      height: 10px;
      background: var(--border);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .compress-progress__bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--primary) 0%, #3b82f6 100%);
      border-radius: 999px;
      transition: width 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    }
  </style>`;

  html = html.replace(/\s*<\/style>/, stylePatch);

  // 2. Update upload-area HTML & tool-settings HTML
  const oldUploadAndSettingsPattern = /<div class="upload-area" id="upload-area"[\s\S]*?<\/button>\s*<\/div>/;
  const newUploadAndSettings = `<div class="upload-area" id="upload-area" role="button" tabindex="0" aria-label="Upload image file">
          <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp" aria-label="Select image file" />
          <div class="upload-area__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
          </div>
          <p><strong>Click to choose an image</strong> or drag and drop here</p>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-top:6px;">JPG, PNG, WebP — up to ~20MB</p>
        </div>

        <div id="tool-settings" class="hidden" style="margin-top:28px;">
          <div class="form-row">
            <div class="form-group">
              <label for="target-kb">Target File Size (KB) <span style="color:var(--text-muted);font-weight:400;">(optional)</span></label>
              <input type="number" id="target-kb" min="5" max="50000" placeholder="e.g. 200 (enter desired KB)" />
            </div>
            <div class="form-group">
              <label for="output-format">Output Format</label>
              <select id="output-format">
                <option value="original" selected>Keep Original Format</option>
                <option value="image/jpeg">JPEG (Best for photos)</option>
                <option value="image/webp">WebP (Smallest file size)</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="resize-width">Resize Width (px) <span style="color:var(--text-muted);font-weight:400;">(optional)</span></label>
              <input type="number" id="resize-width" min="1" placeholder="e.g. 1280 (leave empty to keep)" />
            </div>
            <div class="form-group">
              <label for="resize-height">Resize Height (px) <span style="color:var(--text-muted);font-weight:400;">(optional)</span></label>
              <input type="number" id="resize-height" min="1" placeholder="e.g. 720 (leave empty to keep)" />
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="lock-aspect" checked style="margin-right:6px;" />
              Lock aspect ratio (auto-calculate missing dimension)
            </label>
          </div>

          <button class="btn btn--primary" id="compress-btn" style="margin-top:8px;">
            Compress Image
          </button>

          <div class="compress-progress" id="compress-progress" aria-live="polite">
            <div class="compress-progress__header">
              <span id="compress-status">Compressing image...</span>
              <span id="compress-percent" style="color:var(--primary);font-variant-numeric:tabular-nums;font-weight:700;">0%</span>
            </div>
            <div class="compress-progress__track">
              <div class="compress-progress__bar" id="compress-bar"></div>
            </div>
          </div>
        </div>`;

  if (oldUploadAndSettingsPattern.test(html)) {
    html = html.replace(oldUploadAndSettingsPattern, () => newUploadAndSettings);
  } else {
    console.error('Could not match oldUploadAndSettingsPattern in', filePath);
  }

  // 3. Replace the JavaScript logic
  const oldScriptPattern = /<script>\s*\/\/\s*── Image Compressor Logic ────────────────────────────────────[\s\S]*?<\/script>\s*<\/body>/;
  const newScript = `<script>
    // ── Image Compressor Logic ────────────────────────────────────
    (function () {
      const fileInput        = document.getElementById('file-input');
      const uploadArea       = document.getElementById('upload-area');
      const toolSettings     = document.getElementById('tool-settings');
      const compressBtn      = document.getElementById('compress-btn');
      const compressProgress = document.getElementById('compress-progress');
      const compressStatus   = document.getElementById('compress-status');
      const compressPercent  = document.getElementById('compress-percent');
      const compressBar      = document.getElementById('compress-bar');
      const resetBtn         = document.getElementById('reset-btn');
      const downloadBtn      = document.getElementById('download-btn');
      const previewWrap      = document.getElementById('preview-wrap');
      const previewOrig      = document.getElementById('preview-original');
      const previewComp      = document.getElementById('preview-compressed');
      const origInfo         = document.getElementById('original-info');
      const compInfo         = document.getElementById('compressed-info');
      const resultBox        = document.getElementById('result-box');
      const resultStats      = document.getElementById('result-stats');
      const targetKbEl       = document.getElementById('target-kb');
      const outputFmtEl      = document.getElementById('output-format');
      const resizeWidthEl    = document.getElementById('resize-width');
      const resizeHeightEl   = document.getElementById('resize-height');
      const lockAspect       = document.getElementById('lock-aspect');

      let originalFile = null;
      let compressedDataUrl = null;
      let compressedMime    = 'image/jpeg';

      function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      }

      function dataUrlToBytes(dataUrl) {
        const base64 = dataUrl.split(',')[1];
        return Math.round((base64.length * 3) / 4);
      }

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      function updateProgress(pct, statusText) {
        const p = Math.min(100, Math.max(0, Math.round(pct)));
        if (compressBar) compressBar.style.width = p + '%';
        if (compressPercent) compressPercent.textContent = p + '%';
        if (statusText && compressStatus) compressStatus.textContent = statusText;
      }

      // Click to choose file anywhere on the dropzone
      uploadArea.addEventListener('click', (e) => {
        if (e.target !== fileInput) {
          fileInput.click();
        }
      });

      // Keyboard support for accessibility
      uploadArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput.click();
        }
      });

      // Drag-and-drop
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('is-dragover');
      });
      uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('is-dragover'));
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('is-dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleFileLoad(file);
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFileLoad(fileInput.files[0]);
      });

      function handleFileLoad(file) {
        originalFile = file;
        const url = URL.createObjectURL(file);
        previewOrig.src = url;
        previewOrig.onload = () => URL.revokeObjectURL(url);
        origInfo.textContent = \`Original: \${formatBytes(file.size)} | \${file.name}\`;
        uploadArea.style.display = 'none';
        toolSettings.classList.remove('hidden');
        previewWrap.classList.add('is-visible');
        resultBox.classList.remove('is-visible');
        if (compressProgress) compressProgress.classList.remove('is-visible');
        compressedDataUrl = null;
      }

      // Lock aspect ratio on width input
      resizeWidthEl.addEventListener('input', () => {
        if (!lockAspect.checked || !previewOrig.naturalWidth) return;
        const ratio = previewOrig.naturalHeight / previewOrig.naturalWidth;
        const w = parseInt(resizeWidthEl.value, 10);
        if (!isNaN(w)) resizeHeightEl.value = Math.round(w * ratio);
      });

      resizeHeightEl.addEventListener('input', () => {
        if (!lockAspect.checked || !previewOrig.naturalHeight) return;
        const ratio = previewOrig.naturalWidth / previewOrig.naturalHeight;
        const h = parseInt(resizeHeightEl.value, 10);
        if (!isNaN(h)) resizeWidthEl.value = Math.round(h * ratio);
      });

      // Compression trigger
      compressBtn.addEventListener('click', async () => {
        if (!originalFile) return;
        compressBtn.textContent = 'Compressing…';
        compressBtn.disabled = true;
        resultBox.classList.remove('is-visible');
        if (compressProgress) compressProgress.classList.add('is-visible');
        updateProgress(5, 'Preparing image...');

        await sleep(40);
        await doCompress();
      });

      async function doCompress() {
        const origBytes = originalFile.size;
        const userTargetKb = parseFloat(targetKbEl.value);

        // Calculate targetBytes based on user input or smart compression
        let targetBytes;
        if (userTargetKb && userTargetKb > 0) {
          targetBytes = Math.round(userTargetKb * 1024);
        } else {
          // Smart default: compress by ~50% or down to 250KB if large
          targetBytes = Math.round(Math.min(origBytes * 0.55, 250 * 1024));
          if (targetBytes >= origBytes) targetBytes = Math.round(origBytes * 0.7);
        }
        if (targetBytes < 4 * 1024) targetBytes = 4 * 1024; // Min 4 KB

        // Output format
        let mime = outputFmtEl.value;
        if (mime === 'original') {
          mime = originalFile.type || 'image/jpeg';
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) {
            mime = 'image/jpeg';
          }
        }
        compressedMime = mime;

        updateProgress(15, 'Reading image into canvas...');
        await sleep(35);

        const img = new Image();
        const objUrl = URL.createObjectURL(originalFile);

        img.onerror = () => {
          URL.revokeObjectURL(objUrl);
          compressBtn.textContent = 'Compress Image';
          compressBtn.disabled = false;
          if (compressProgress) compressProgress.classList.remove('is-visible');
          if (window.showToast) {
            window.showToast('Could not process this image format. Please try a JPG, PNG, or WebP.');
          } else {
            alert('Could not process this image format.');
          }
        };

        img.onload = async () => {
          URL.revokeObjectURL(objUrl);

          updateProgress(25, 'Analyzing dimensions...');
          await sleep(30);

          let outW = img.naturalWidth;
          let outH = img.naturalHeight;
          const rw = parseInt(resizeWidthEl.value, 10);
          const rh = parseInt(resizeHeightEl.value, 10);

          if (rw > 0 && rh > 0) { outW = rw; outH = rh; }
          else if (rw > 0) { outH = Math.round((rw / img.naturalWidth) * img.naturalHeight); outW = rw; }
          else if (rh > 0) { outW = Math.round((rh / img.naturalHeight) * img.naturalWidth); outH = rh; }

          function renderCanvas(w, h) {
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            if (mime === 'image/jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, w, h);
            }
            ctx.drawImage(img, 0, 0, w, h);
            return canvas;
          }

          let canvas = renderCanvas(outW, outH);

          // ── Case A: PNG Compression (strictly downscales to meet target KB) ──
          if (mime === 'image/png') {
            updateProgress(35, 'Compressing PNG...');
            await sleep(35);

            let testUrl = canvas.toDataURL('image/png');
            let currentBytes = dataUrlToBytes(testUrl);

            let pass = 0;
            const maxPasses = 8;
            while ((currentBytes > targetBytes * 1.05 || currentBytes > origBytes) && pass < maxPasses && outW > 120 && outH > 120) {
              pass++;
              const stepPct = 35 + Math.round((pass / maxPasses) * 55);
              updateProgress(stepPct, \`Compressing PNG to target size (pass \${pass})...\`);
              await sleep(30);

              const desiredBytes = Math.min(targetBytes, Math.round(origBytes * 0.95));
              const ratio = Math.max(0.55, Math.min(0.88, Math.sqrt(desiredBytes / currentBytes) * 0.96));
              outW = Math.max(100, Math.round(outW * ratio));
              outH = Math.max(100, Math.round(outH * ratio));

              canvas = renderCanvas(outW, outH);
              testUrl = canvas.toDataURL('image/png');
              currentBytes = dataUrlToBytes(testUrl);
            }

            updateProgress(95, 'Finalizing image...');
            await sleep(40);
            updateProgress(100, 'Done!');
            await sleep(60);
            finalize(testUrl);
            return;
          }

          // ── Case B: JPEG & WebP Compression ───────────────────────
          const formatLabel = mime === 'image/webp' ? 'WebP' : 'JPEG';
          updateProgress(35, \`Optimizing \${formatLabel} quality...\`);
          await sleep(35);

          let lo = 0.05, hi = 0.95, bestDataUrl = null;
          for (let i = 0; i < 12; i++) {
            const mid = (lo + hi) / 2;
            const testUrl = canvas.toDataURL(mime, mid);
            const bytes = dataUrlToBytes(testUrl);
            bestDataUrl = testUrl;

            if (bytes > targetBytes) {
              hi = mid;
            } else {
              lo = mid;
            }

            if (i % 3 === 0) {
              const bPct = 35 + Math.round((i / 12) * 35);
              updateProgress(bPct, \`Testing quality settings (\${Math.round(mid * 100)}%)...\`);
              await sleep(20);
            }
          }

          let finalUrl = canvas.toDataURL(mime, lo);
          let currentBytes = dataUrlToBytes(finalUrl);

          // If still larger than target KB or larger than original, auto-downscale
          let scalePasses = 0;
          while ((currentBytes > targetBytes * 1.05 || currentBytes > origBytes) && scalePasses < 5 && outW > 120 && outH > 120) {
            scalePasses++;
            const sPct = 70 + Math.round((scalePasses / 5) * 22);
            updateProgress(sPct, \`Adjusting resolution to meet target KB (pass \${scalePasses})...\`);
            await sleep(30);

            const desiredBytes = Math.min(targetBytes, Math.round(origBytes * 0.95));
            const ratio = Math.max(0.6, Math.min(0.85, Math.sqrt(desiredBytes / currentBytes) * 0.96));
            outW = Math.max(100, Math.round(outW * ratio));
            outH = Math.max(100, Math.round(outH * ratio));

            canvas = renderCanvas(outW, outH);
            finalUrl = canvas.toDataURL(mime, 0.70);
            currentBytes = dataUrlToBytes(finalUrl);
          }

          if (currentBytes > origBytes) {
            finalUrl = canvas.toDataURL(mime, 0.45);
            currentBytes = dataUrlToBytes(finalUrl);
          }

          updateProgress(95, 'Finalizing image...');
          await sleep(40);
          updateProgress(100, 'Done!');
          await sleep(60);
          finalize(finalUrl);
        };

        img.src = objUrl;
      }

      function finalize(dataUrl, customNote = '') {
        compressedDataUrl = dataUrl;
        const compBytes = dataUrlToBytes(dataUrl);
        const origBytes = originalFile.size;
        const diffPercent = Math.round(((compBytes - origBytes) / origBytes) * 100);

        previewComp.src = dataUrl;
        compInfo.textContent = \`Compressed: \${formatBytes(compBytes)}\`;

        let diffBadgeHtml = '';
        if (compBytes < origBytes) {
          const reduction = Math.abs(diffPercent);
          diffBadgeHtml = \`
            <div class="result-item">
              <span class="result-item__value" style="color:var(--success);">\${reduction}%</span>
              <span class="result-item__label">Size Reduced</span>
            </div>
          \`;
        } else if (compBytes === origBytes) {
          diffBadgeHtml = \`
            <div class="result-item">
              <span class="result-item__value" style="color:var(--ink);">0%</span>
              <span class="result-item__label">Optimized</span>
            </div>
          \`;
        } else {
          diffBadgeHtml = \`
            <div class="result-item">
              <span class="result-item__value" style="color:var(--warning);">+\${diffPercent}%</span>
              <span class="result-item__label">Size Difference</span>
            </div>
          \`;
        }

        const userTargetKb = parseFloat(targetKbEl.value);
        let targetNoteHtml = '';
        if (userTargetKb && userTargetKb > 0) {
          const targetBytes = userTargetKb * 1024;
          if (compBytes <= targetBytes * 1.1) {
            targetNoteHtml = \`<p style="grid-column:1/-1;font-size:0.85rem;color:var(--success);margin-top:8px;text-align:center;font-weight:600;">Target: \${formatBytes(targetBytes)} | Achieved: \${formatBytes(compBytes)}</p>\`;
          }
        }

        resultStats.innerHTML = \`
          <div class="result-item">
            <span class="result-item__value">\${formatBytes(origBytes)}</span>
            <span class="result-item__label">Original Size</span>
          </div>
          <div class="result-item">
            <span class="result-item__value" style="color:var(--primary);">\${formatBytes(compBytes)}</span>
            <span class="result-item__label">New File Size</span>
          </div>
          \${diffBadgeHtml}
          \${targetNoteHtml}
        \`;

        if (customNote) {
          const noteEl = document.createElement('p');
          noteEl.style.cssText = 'grid-column:1/-1;font-size:0.85rem;color:var(--warning);margin-top:8px;text-align:center;';
          noteEl.textContent = customNote;
          resultStats.appendChild(noteEl);
        }

        if (compressProgress) compressProgress.classList.remove('is-visible');
        resultBox.classList.add('is-visible');
        compressBtn.textContent = 'Compress Image';
        compressBtn.disabled = false;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      downloadBtn.addEventListener('click', () => {
        if (!compressedDataUrl) return;
        const ext = compressedMime.split('/')[1].replace('jpeg', 'jpg');
        const name = (originalFile.name.split('.').slice(0, -1).join('.') || 'image') + \`-compressed.\${ext}\`;
        const a = document.createElement('a');
        a.href = compressedDataUrl;
        a.download = name;
        a.click();
        if (window.showToast) window.showToast('Image downloaded successfully!');
      });

      resetBtn.addEventListener('click', () => {
        originalFile = null;
        compressedDataUrl = null;
        fileInput.value = '';
        targetKbEl.value = ''; // Clears input so placeholder shows cleanly
        uploadArea.style.display = '';
        toolSettings.classList.add('hidden');
        previewWrap.classList.remove('is-visible');
        resultBox.classList.remove('is-visible');
        if (compressProgress) compressProgress.classList.remove('is-visible');
        previewOrig.src = '';
        previewComp.src = '';
        resizeWidthEl.value = '';
        resizeHeightEl.value = '';
      });

      // Footer year
      document.querySelectorAll('.footer-year').forEach(el => el.textContent = new Date().getFullYear());
    })();
  </script>
</body>`;

  if (oldScriptPattern.test(html)) {
    html = html.replace(oldScriptPattern, () => newScript);
  } else {
    console.error('Could not match oldScriptPattern in', filePath);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully patched:', filePath);
});
