/**
 * Official Lucide Icons Bundle (Tree-shaken for Kitvane)
 * Contains only explicitly required named imports from 'lucide' package.
 * Consistent stroke-width: 2, viewBox: 0 0 24 24.
 */
(function(window) {
  'use strict';
  const ICONS = {
    "box": [["path",{"d":"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{"d":"m3.3 7 8.7 5 8.7-5"}],["path",{"d":"M12 22V12"}]],
    "image": [["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2","ry":"2"}],["circle",{"cx":"9","cy":"9","r":"2"}],["path",{"d":"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]],
    "calculator": [["rect",{"width":"16","height":"20","x":"4","y":"2","rx":"2"}],["line",{"x1":"8","x2":"16","y1":"6","y2":"6"}],["line",{"x1":"16","x2":"16","y1":"14","y2":"18"}],["path",{"d":"M16 10h.01"}],["path",{"d":"M12 10h.01"}],["path",{"d":"M8 10h.01"}],["path",{"d":"M12 14h.01"}],["path",{"d":"M8 14h.01"}],["path",{"d":"M12 18h.01"}],["path",{"d":"M8 18h.01"}]],
    "calendar": [["path",{"d":"M8 2v3"}],["path",{"d":"M16 2v3"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2"}],["path",{"d":"M3 9h18"}]],
    "type": [["path",{"d":"M12 4v16"}],["path",{"d":"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"}],["path",{"d":"M9 20h6"}]],
    "search": [["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],
    "arrow-right": [["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]],
    "arrow-down": [["path",{"d":"M12 5v14"}],["path",{"d":"m19 12-7 7-7-7"}]],
    "shield-check": [["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{"d":"m9 12 2 2 4-4"}]],
    "zap": [["path",{"d":"M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z"}]],
    "lock": [["rect",{"width":"18","height":"11","x":"3","y":"11","rx":"2","ry":"2"}],["path",{"d":"M7 11V7a5 5 0 0 1 10 0v4"}]],
    "menu": [["path",{"d":"M4 5h16"}],["path",{"d":"M4 12h16"}],["path",{"d":"M4 19h16"}]],
    "x": [["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],
    "chevron-down": [["path",{"d":"m6 9 6 6 6-6"}]],
    "copy": [["rect",{"width":"14","height":"14","x":"8","y":"8","rx":"2","ry":"2"}],["path",{"d":"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]],
    "check": [["path",{"d":"M20 6 9 17l-5-5"}]],
    "plus": [["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],
    "download": [["path",{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{"points":"7 10 12 15 17 10"}],["line",{"x1":"12","x2":"12","y1":"15","y2":"3"}]],
    "cpu": [["rect",{"width":"16","height":"16","x":"4","y":"4","rx":"2"}],["rect",{"width":"6","height":"6","x":"9","y":"9","rx":"1"}],["path",{"d":"M15 2v2"}],["path",{"d":"M15 20v2"}],["path",{"d":"M2 15h2"}],["path",{"d":"M2 9h2"}],["path",{"d":"M20 15h2"}],["path",{"d":"M20 9h2"}],["path",{"d":"M9 2v2"}],["path",{"d":"M9 20v2"}]],
    "mail": [["rect",{"width":"20","height":"16","x":"2","y":"4","rx":"2"}],["path",{"d":"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"}]],
    "clock": [["circle",{"cx":"12","cy":"12","r":"10"}],["polyline",{"points":"12 6 12 12 16 14"}]],
    "briefcase": [["rect",{"width":"20","height":"14","x":"2","y":"7","rx":"2","ry":"2"}],["path",{"d":"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}]]
  };

  function createSvgElement(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
    return el;
  }

  function renderIcon(iconName, options) {
    const iconDef = ICONS[iconName];
    if (!iconDef) return null;
    const opts = options || {};
    const size = opts.size || 20;
    const strokeWidth = opts.strokeWidth || 2;
    const className = opts.class || '';

    const svg = createSvgElement('svg', {
      'xmlns': 'http://www.w3.org/2000/svg',
      'width': size,
      'height': size,
      'viewBox': '0 0 24 24',
      'fill': 'none',
      'stroke': 'currentColor',
      'stroke-width': strokeWidth,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'class': ('lucide lucide-' + iconName + ' ' + className).trim(),
      'aria-hidden': 'true'
    });

    iconDef.forEach(function(item) {
      const tag = item[0];
      const attrs = item[1];
      svg.appendChild(createSvgElement(tag, attrs));
    });

    return svg;
  }

  function createIcons(root) {
    const scope = root || document;
    const elements = scope.querySelectorAll('[data-lucide]');
    elements.forEach(function(el) {
      const iconName = el.getAttribute('data-lucide');
      const size = el.getAttribute('data-size') || 20;
      const strokeWidth = el.getAttribute('data-stroke-width') || 2;
      const svg = renderIcon(iconName, { size: size, strokeWidth: strokeWidth, class: el.className });
      if (svg) {
        el.parentNode.replaceChild(svg, el);
      }
    });
  }

  window.lucide = {
    createIcons: createIcons,
    icons: ICONS
  };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => createIcons());
    } else {
      createIcons();
    }
  }
})(typeof window !== 'undefined' ? window : this);
