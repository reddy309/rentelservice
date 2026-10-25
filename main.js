/* ==================================================
   CRAFT NEST
   RTL + DARK MODE
   LOCAL STORAGE
================================================== */

(function () {
  "use strict";

  /* ==================================================
     1. APPLY ALL MODES
  ================================================== */

  function applyModes() {
    const rtlEnabled = localStorage.getItem("craftNestRTL") === "enabled";

    const darkEnabled = localStorage.getItem("craftNestDark") === "enabled";

    const html = document.documentElement;
    const body = document.body;

    /* ==================================================
       2. HTML DIRECTION
    ================================================== */

    html.setAttribute("dir", rtlEnabled ? "rtl" : "ltr");

    html.classList.toggle("rtl", rtlEnabled);
    html.classList.toggle("dark", darkEnabled);

    /* ==================================================
       3. BODY CLASSES
    ================================================== */

    if (body) {
      body.classList.toggle("rtl", rtlEnabled);
      body.classList.toggle("dark", darkEnabled);
    }

    /* ==================================================
       4. RTL BUTTON
    ================================================== */

    const rtlButton = document.getElementById("rtlToggle");

    if (rtlButton) {
      rtlButton.textContent = rtlEnabled ? "LTR" : "RTL";

      rtlButton.setAttribute(
        "aria-label",
        rtlEnabled ? "Switch to LTR" : "Switch to RTL",
      );

      rtlButton.setAttribute(
        "title",
        rtlEnabled ? "Switch to LTR" : "Switch to RTL",
      );

      rtlButton.setAttribute("aria-pressed", String(rtlEnabled));
    }

    /* ==================================================
       5. DARK MODE BUTTON
    ================================================== */

    const darkButton = document.getElementById("darkToggle");

    if (darkButton) {
      darkButton.setAttribute(
        "aria-label",
        darkEnabled ? "Switch to Light Mode" : "Switch to Dark Mode",
      );

      darkButton.setAttribute(
        "title",
        darkEnabled ? "Switch to Light Mode" : "Switch to Dark Mode",
      );

      darkButton.setAttribute("aria-pressed", String(darkEnabled));

      const icon = darkButton.querySelector("[data-lucide]");

      if (icon) {
        icon.setAttribute("data-lucide", darkEnabled ? "sun" : "moon");
      }
    }

    /* ==================================================
       6. REFRESH LUCIDE ICONS
    ================================================== */

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ==================================================
     7. INITIALIZE AFTER PAGE LOAD
  ================================================== */

  function initializeModes() {
    /* Apply saved preferences first */
    applyModes();

    /* ==================================================
       RTL / LTR TOGGLE
    ================================================== */

    const rtlButton = document.getElementById("rtlToggle");

    if (rtlButton && !rtlButton.dataset.modeListener) {
      rtlButton.dataset.modeListener = "true";

      rtlButton.addEventListener("click", function (event) {
        event.preventDefault();

        const rtlEnabled = localStorage.getItem("craftNestRTL") === "enabled";

        localStorage.setItem(
          "craftNestRTL",
          rtlEnabled ? "disabled" : "enabled",
        );

        applyModes();
      });
    }

    /* ==================================================
       DARK / LIGHT TOGGLE
    ================================================== */

    const darkButton = document.getElementById("darkToggle");

    if (darkButton && !darkButton.dataset.modeListener) {
      darkButton.dataset.modeListener = "true";

      darkButton.addEventListener("click", function (event) {
        event.preventDefault();

        const darkEnabled = localStorage.getItem("craftNestDark") === "enabled";

        localStorage.setItem(
          "craftNestDark",
          darkEnabled ? "disabled" : "enabled",
        );

        applyModes();
      });
    }

    /* Apply again after controls are initialized */
    applyModes();
  }

  /* ==================================================
     8. DOM READY
  ================================================== */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeModes, {
      once: true,
    });
  } else {
    initializeModes();
  }
})();
