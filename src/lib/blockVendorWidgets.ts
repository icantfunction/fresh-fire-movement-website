/**
 * Removes third-party floating widgets injected into the page after our build.
 *
 * Lovable's hosting layer injects a "#lovable-badge" pill into the bottom-right of every
 * served page. It is not in this repo and not in dist/ — it is added at serve time, so it
 * cannot be deleted from the source. The supported fix is the badge toggle in Lovable's
 * project settings; this is the client-side backstop for when that is unavailable.
 *
 * Deliberately an explicit selector list rather than a blanket rule against fixed-position
 * elements: the app has its own fixed UI (toasts, dialog overlays, the nav) that must keep
 * working. Add a selector here when a new vendor widget shows up.
 */
const BLOCKED_SELECTORS = [
  "#lovable-badge",
  "#lovable-badge-cta",
  "#lovable-badge-close",
  "#lovable-badge-text",
  "#lovable-badge-divider",
  "[data-lovable-badge]",
  'a[href*="lovable.dev/projects"]',
  'a[href*="gpteng.co"]',
];

const STYLE_ID = "vendor-widget-block";

const injectHidingRule = () => {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `${BLOCKED_SELECTORS.join(",")}{display:none!important;visibility:hidden!important;pointer-events:none!important;}`;
  document.head.appendChild(style);
};

const sweep = () => {
  for (const selector of BLOCKED_SELECTORS) {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  }
};

/**
 * Hides matching widgets via CSS and removes them from the DOM, then keeps watching.
 *
 * Both halves earn their place: the stylesheet suppresses the badge before it can paint,
 * but an injected element carrying inline `!important` styles would beat a stylesheet
 * rule, so the nodes are also removed outright. The observer covers re-injection after
 * hydration or on route changes.
 */
export const blockVendorWidgets = () => {
  if (typeof document === "undefined") return;

  const start = () => {
    injectHidingRule();
    sweep();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          sweep();
          return;
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
};
