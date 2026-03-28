(function() {
  const COLLAPSE_KEY = 'penguRightNavCollapsed';
  const STYLE_ID = 'pengu-debloat-style';
  const RIGHT_NAV_SELECTOR = '.right-nav-menu';
  const RIGHT_NAV_COLLAPSED_CLASS = 'pengu-right-nav-collapsed';

  function loadCollapsedState() {
    try {
      const stored = localStorage.getItem(COLLAPSE_KEY);
      if (stored === null) {
        return true;
      }
      return JSON.parse(stored) === true;
    }
    catch (e) {
      return true;
    }
  }

  function saveCollapsedState(value) {
    try {
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(Boolean(value)));
    }
    catch (e) {
      // Best effort persistence.
    }
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      ${RIGHT_NAV_SELECTOR} {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle {
        width: 22px;
        height: 22px;
        border: 1px solid rgba(200, 170, 110, 0.7);
        background: rgba(15, 24, 35, 0.88);
        color: #c8aa6e;
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        padding: 0;
        position: relative;
        z-index: 9999;
        pointer-events: auto !important;
        -webkit-app-region: no-drag;
      }

      ${RIGHT_NAV_SELECTOR}.${RIGHT_NAV_COLLAPSED_CLASS} > *:not(.pengu-right-nav-toggle) {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function ensureRightNavCollapseControl() {
    document.querySelectorAll(RIGHT_NAV_SELECTOR).forEach(rightNav => {
      let toggle = rightNav.querySelector('.pengu-right-nav-toggle');
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'pengu-right-nav-toggle';
        rightNav.insertBefore(toggle, rightNav.firstChild);
        toggle.addEventListener('click', () => {
          const collapsed = !rightNav.classList.contains(RIGHT_NAV_COLLAPSED_CLASS);
          rightNav.classList.toggle(RIGHT_NAV_COLLAPSED_CLASS, collapsed);
          toggle.textContent = collapsed ? '>' : '<';
          toggle.setAttribute('aria-label', collapsed ? 'Expand right nav' : 'Collapse right nav');
          saveCollapsedState(collapsed);
        });
      }

      const shouldCollapse = loadCollapsedState();
      rightNav.classList.toggle(RIGHT_NAV_COLLAPSED_CLASS, shouldCollapse);
      toggle.textContent = shouldCollapse ? '>' : '<';
      toggle.setAttribute('aria-label', shouldCollapse ? 'Expand right nav' : 'Collapse right nav');
    });
  }

  function removeAll(selectors) {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(node => {
        node.remove();
      });
    });
  }

  function clearLeagueToVoid() {
    ensureStyle();

    removeAll([
      // League left sidebar and tabs (Patch Notes included).
      '.activity-center__tabs_container',
      '.activity-center__tabs_scrollable',
      '.activity-center__tabs',
      '.activity-center__tabs_footer',

      // League center content and footer cards/cta.
      '.activity-center-default-activity__content',
      '.activity-center-default-activity__main-content',
      '.activity-center-default-activity__footer',
      '.activity-center__header',
      '.activity-center__media-group',
      '.activity-center__background-component_container',
      '.activity-center__background-component__image',
      '.activity-center__background-component__blend',

      // Social panel cleanup.
      'lol-player-notifications-button.notifications-button',
      '.notifications-button',
      '.lol-social-actions-bar .folder-button',
      '.lol-social-actions-bar .options-button',
      '.bug-report-button',

      // TFT and LoR top buttons.
      '.menu_item_navbar_tft',
      '.deep-links-promo',
      '.deep-links-promo-element',
      '.launch-lor-button-container'
    ]);

    ensureRightNavCollapseControl();
  }

  const observer = new MutationObserver(() => {
    clearLeagueToVoid();
  });

  document.addEventListener('DOMContentLoaded', () => {
    clearLeagueToVoid();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();