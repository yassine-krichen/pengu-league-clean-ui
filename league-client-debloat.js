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
        width: 28px;
        height: 28px;
        cursor: pointer;
        position: relative;
        z-index: 9999;
        pointer-events: auto !important;
        -webkit-app-region: no-drag;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle .generic-button-root {
        width: 100%;
        height: 100%;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle .generic-button-state {
        display: none;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle .generic-button-state.up {
        display: block;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle:hover .generic-button-state.up {
        display: none;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle:hover .generic-button-state.over {
        display: block;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle:active .generic-button-state.up,
      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle:active .generic-button-state.over {
        display: none;
      }

      ${RIGHT_NAV_SELECTOR} .pengu-right-nav-toggle:active .generic-button-state.down {
        display: block;
      }

      ${RIGHT_NAV_SELECTOR}.${RIGHT_NAV_COLLAPSED_CLASS} > *:not(.pengu-right-nav-toggle) {
        display: none !important;
      }

      /* Fallback hide rules in case Riot changes mount order or wrappers. */
      section.rcp-fe-viewport-persistent [data-screen-name*="activity-center"],
      section.rcp-fe-viewport-persistent [class*="rcp-fe-lol-activity-center"],
      section.rcp-fe-viewport-persistent #activity-center,
      section.rcp-fe-viewport-persistent [class*="activity-center"] {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function ensureRightNavCollapseControl() {
    document.querySelectorAll(RIGHT_NAV_SELECTOR).forEach(rightNav => {
      let toggle = rightNav.querySelector('.pengu-right-nav-toggle');
      if (!toggle) {
        toggle = document.createElement('div');
        toggle.className = 'pengu-right-nav-toggle generic-button match-h match-w ember-view';
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.innerHTML = `
          <div class="generic-button-root">
            <div class="generic-button-state up active">
              <div class="generic-button-primary-img-container">
                <img src="/fe/lol-parties/button-back-arrow.png">
              </div>
            </div>
            <div class="generic-button-state over">
              <div class="generic-button-primary-img-container">
                <img src="/fe/lol-parties/button-back-arrow-over.png">
              </div>
            </div>
            <div class="generic-button-state down">
              <div class="generic-button-primary-img-container">
                <img src="/fe/lol-parties/button-back-arrow-down.png">
              </div>
            </div>
            <div class="generic-button-state disabled">
              <div class="generic-button-primary-img-container">
                <img src="/fe/lol-parties/button-back-arrow-disabled.png">
              </div>
            </div>
          </div>
        `;
        rightNav.insertBefore(toggle, rightNav.firstChild);

        const onToggle = () => {
          const collapsed = !rightNav.classList.contains(RIGHT_NAV_COLLAPSED_CLASS);
          rightNav.classList.toggle(RIGHT_NAV_COLLAPSED_CLASS, collapsed);
          toggle.setAttribute('aria-label', collapsed ? 'Expand right nav' : 'Collapse right nav');
          toggle.style.transform = collapsed ? 'scaleX(-1)' : 'scaleX(1)';
          saveCollapsedState(collapsed);
        };

        toggle.addEventListener('click', onToggle);
        toggle.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        });
      }

      const shouldCollapse = loadCollapsedState();
      rightNav.classList.toggle(RIGHT_NAV_COLLAPSED_CLASS, shouldCollapse);
      toggle.setAttribute('aria-label', shouldCollapse ? 'Expand right nav' : 'Collapse right nav');
      toggle.style.transform = shouldCollapse ? 'scaleX(-1)' : 'scaleX(1)';
    });
  }

  function removeAll(selectors) {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(node => {
        node.remove();
      });
    });
  }

  function purgeActivityCenterRoots() {
    removeAll([
      'section.rcp-fe-viewport-persistent .screen-root[data-screen-name="rcp-fe-lol-activity-center"]',
      'section.rcp-fe-viewport-persistent [data-screen-name*="activity-center"]',
      'section.rcp-fe-viewport-persistent .rcp-fe-lol-activity-center',
      'section.rcp-fe-viewport-persistent #activity-center',
      'section.rcp-fe-viewport-persistent .activity-center-application',
      'section.rcp-fe-viewport-persistent .activity-center__contents',
      'section.rcp-fe-viewport-persistent .activity-center-skin-activity',
      'section.rcp-fe-viewport-persistent .persistent-control-panel',
      'section.rcp-fe-viewport-persistent #persistent-iframe-container'
    ]);
  }

  function clearLeagueToVoid() {
    ensureStyle();
    purgeActivityCenterRoots();

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
      '.launch-lor-button-container',

      // Play screen TFT selector card.
      '.game-type-card[data-game-mode="TFT"]',
      '[data-game-mode="TFT"]',
      '.game-type-card[data-map-id="22"]'
    ]);

    ensureRightNavCollapseControl();
  }

  const observer = new MutationObserver(() => {
    clearLeagueToVoid();
  });

  document.addEventListener('DOMContentLoaded', () => {
    clearLeagueToVoid();
    observer.observe(document.body, { childList: true, subtree: true });

    // Timer fallback for async/lazy screens that may mount outside normal mutations.
    window.setInterval(clearLeagueToVoid, 1500);
  });
})();