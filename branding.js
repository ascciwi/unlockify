// @name    Unlockify Branding
// @version 1.0.2
// @desc    Recolors Spotify's green accent to Unlockify purple
(function () {
  const PURPLE = '#a855f7';
  const GREEN_PATTERN = /1db954|1ed760|107434|17a84a|1aa34a|169c46|148a3d|16ab4a/i;
  const STYLE_ID = 'unlockify-brand-css';

  const CSS_VARS = [
    '--encore-icon-fill', '--text-bright-accent', '--text-positive',
    '--background-positive', '--background-bright-accent', '--essential-bright-accent',
  ];

  // ── CSS variables + class overrides ──────────────────────────────────────
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.encore-internal-color-text-bright-accent { color: #a855f7 !important; }',
      '.encore-bright-accent-set { background-color: #a855f7 !important; }',
      '.encore-bright-accent-set svg, .encore-bright-accent-set path { color: #000 !important; fill: #000 !important; }',
      'img[src*="equaliser"] { filter: brightness(0) saturate(100%) invert(44%) sepia(69%) saturate(1700%) hue-rotate(250deg) brightness(105%) !important; }',
      '[aria-label*="Shuffle"] { color: #a855f7 !important; }',
      '[aria-label*="shuffle"] { color: #a855f7 !important; }',
      '[aria-label*="Smart Shuffle"] { color: #a855f7 !important; }',
      ':root {',
      '  --text-bright-accent:        #a855f7 !important;',
      '  --essential-positive:        #a855f7 !important;',
      '  --background-positive:       #a855f7 !important;',
      '  --decorative-positive:       #a855f7 !important;',
      '  --text-positive:             #a855f7 !important;',
      '  --essential-bright-accent:   #a855f7 !important;',
      '  --background-bright-accent:  #a855f7 !important;',
      '}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  // ── Inline-style green patching ───────────────────────────────────────────
  function recolor(el) {
    if (!el || !el.style) return;
    var raw = el.getAttribute('style') || '';
    if (GREEN_PATTERN.test(raw)) {
      el.setAttribute('style', raw.replace(new RegExp(GREEN_PATTERN.source, 'gi'), PURPLE.replace('#', '')));
    }
    CSS_VARS.forEach(function(v) {
      if (el.style.getPropertyValue(v)) el.style.setProperty(v, PURPLE, 'important');
    });
  }

  function recolorEqualiser(el) {
    if (el.tagName === 'IMG' && el.src && el.src.includes('equaliser')) {
      el.style.setProperty('filter', 'brightness(0) saturate(100%) invert(44%) sepia(69%) saturate(1700%) hue-rotate(250deg) brightness(105%)', 'important');
    }
  }

  document.querySelectorAll('[style]').forEach(recolor);
  document.querySelectorAll('img[src*="equaliser"]').forEach(recolorEqualiser);

  // ── MutationObserver setup (only once per page lifetime) ─────────────────
  if (!window.__UNLOCKIFY_BRAND__) {
    window.__UNLOCKIFY_BRAND__ = true;

    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(n) {
          if (n.nodeType !== 1) return;
          recolor(n);
          recolorEqualiser(n);
          if (n.querySelectorAll) {
            n.querySelectorAll('[style]').forEach(recolor);
            n.querySelectorAll('img[src*="equaliser"]').forEach(recolorEqualiser);
          }
        });
        if (m.type === 'attributes') {
          if (m.attributeName === 'style') recolor(m.target);
          if (m.attributeName === 'src') recolorEqualiser(m.target);
        }
      });
    }).observe(document.documentElement, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['style', 'src'],
    });

    // ── Marketplace panel overlay ────────────────────────────────────────
    function attachPanelObserver() {
      if (!document.body) return;
      new MutationObserver(function() {
        var panel = document.getElementById('unlockify-panel');
        if (panel && !document.getElementById('unlockify-panel-brand')) {
          var s = document.createElement('style');
          s.id = 'unlockify-panel-brand';
          s.textContent = [
            '#unlockify-header-left svg { color: #a855f7; }',
            '.unlockify-tab.active { border-bottom-color: #a855f7 !important; }',
            '#unlockify-search:focus { border-color: rgba(168,85,247,0.5) !important; }',
            '.unlockify-js-badge { background: rgba(168,85,247,0.15) !important; color: #a855f7 !important; }',
            '.unlockify-btn-install:not(.installed):not(.loading) { background: #a855f7 !important; }',
            '.unlockify-btn-install:not(.installed):not(.loading):hover { background: #c084fc !important; }',
            '.unlockify-btn-install.loading { background: rgba(168,85,247,0.2) !important; color: #a855f7 !important; }',
            '.unlockify-spinner { border-color: rgba(168,85,247,0.15) !important; border-top-color: #a855f7 !important; }',
            '#unlockify-toast.success { background: #a855f7 !important; }',
            '#unlockify-marketplace-btn.active { color: #a855f7 !important; }',
            '.unlockify-btn-update { background: #a855f7 !important; color: #fff !important; }',
            '.unlockify-btn-update:hover { background: #c084fc !important; }',
          ].join('\n');
          document.head.appendChild(s);
        }
      }).observe(document.body, { childList: true, subtree: true });
    }

    if (document.body) {
      attachPanelObserver();
    } else {
      document.addEventListener('DOMContentLoaded', attachPanelObserver);
    }
  }
})();
