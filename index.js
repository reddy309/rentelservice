/* =========================================================
   ESTATENEST — COMPLETE UPDATED INDEX.JS
   Header | Home Dropdown | Active Underline
   Sticky Header | Mobile Menu | Scroll Reveal
   Hero Counters | Testimonials | CTA | Lucide Icons

   Home 1: index.html
   Home 2: index1.html

   Responsive: Samsung Galaxy S8+
               iPad Mini
               Google Nest Hub

   Dark Mode: Removed
   RTL: Removed
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     1. LUCIDE ICONS
  ========================================================= */

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.7,
        },
      });
    }
  }

  refreshIcons();

  /* =========================================================
     2. HEADER ELEMENTS
  ========================================================= */

  const header =
    document.querySelector("#siteHeader") ||
    document.querySelector(".site-header");

  const menuToggle =
    document.querySelector("#menuToggle") ||
    document.querySelector(".menu-toggle") ||
    document.querySelector(".mobile-menu-toggle");

  const nav =
    document.querySelector("#mainNav") ||
    document.querySelector(".main-nav") ||
    document.querySelector(".nav-links") ||
    document.querySelector(".site-nav");

  /* =========================================================
     3. CURRENT PAGE HELPERS
  ========================================================= */

  function getCurrentPage() {
    const filename = window.location.pathname.split("/").pop().toLowerCase();

    return filename || "index.html";
  }

  function normalizePagePath(href) {
    if (!href) return "";

    try {
      const url = new URL(href, window.location.href);

      return url.pathname.split("/").pop().toLowerCase() || "index.html";
    } catch (error) {
      return href.split("#")[0].split("?")[0].split("/").pop().toLowerCase();
    }
  }

  /* =========================================================
     4. HOME DROPDOWN ELEMENTS
  ========================================================= */

  const homeButton =
    document.getElementById("homeDropdownButton") ||
    document.querySelector(".dropdown-button");

  const homeDropdown = homeButton ? homeButton.closest(".nav-dropdown") : null;

  const dropdownMenu = homeDropdown
    ? homeDropdown.querySelector(".dropdown-menu")
    : null;

  /* =========================================================
     5. HOME DROPDOWN OPEN / CLOSE
     Supports .open AND .active
     Works with touch and mouse
  ========================================================= */

  function openHomeDropdown() {
    if (!homeButton || !homeDropdown || !dropdownMenu) {
      return;
    }

    homeDropdown.classList.add("open", "active");

    homeButton.setAttribute("aria-expanded", "true");

    dropdownMenu.setAttribute("aria-hidden", "false");
  }

  function closeHomeDropdown() {
    if (!homeButton || !homeDropdown || !dropdownMenu) {
      return;
    }

    homeDropdown.classList.remove("open", "active");

    homeButton.setAttribute("aria-expanded", "false");

    dropdownMenu.setAttribute("aria-hidden", "true");
  }

  function toggleHomeDropdown(event) {
    if (!homeButton || !homeDropdown || !dropdownMenu) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const isOpen =
      homeDropdown.classList.contains("open") ||
      homeDropdown.classList.contains("active");

    if (isOpen) {
      closeHomeDropdown();
    } else {
      openHomeDropdown();
    }
  }

  if (homeButton && homeDropdown && dropdownMenu) {
    homeButton.setAttribute("aria-haspopup", "true");

    homeButton.setAttribute("aria-expanded", "false");

    homeButton.setAttribute("aria-controls", "homeDropdownMenu");

    dropdownMenu.id = "homeDropdownMenu";

    dropdownMenu.setAttribute("aria-hidden", "true");

    /*
      Use click for touchscreens.
      Do not depend only on CSS hover.
    */

    homeButton.addEventListener("click", toggleHomeDropdown);

    /*
      Close after selecting Home 1 or Home 2.
      Normal navigation is not prevented.
    */

    dropdownMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeHomeDropdown();
      });
    });

    /*
      Close when clicking outside the dropdown.
    */

    document.addEventListener("click", (event) => {
      if (!homeDropdown.contains(event.target)) {
        closeHomeDropdown();
      }
    });

    /*
      Close dropdown with Escape.
    */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeHomeDropdown();
      }
    });
  }

  /* =========================================================
     6. ACTIVE HOME UNDERLINE
     Home 1: index.html
     Home 2: index1.html
  ========================================================= */

  function setActiveHomeLine() {
    if (!homeButton || !homeDropdown) return;

    const currentPage = getCurrentPage();

    const homePages = ["index.html", "index1.html"];

    const isHomePage = homePages.includes(currentPage);

    homeButton.classList.toggle("active", isHomePage);

    homeButton.classList.toggle("home-page-active", isHomePage);

    if (isHomePage) {
      homeButton.setAttribute("aria-current", "page");
    } else {
      homeButton.removeAttribute("aria-current");
    }

    const dropdownLinks = homeDropdown.querySelectorAll(
      ".dropdown-menu a, .dropdown-link",
    );

    dropdownLinks.forEach((link) => {
      const linkPage = normalizePagePath(link.getAttribute("href"));

      const isCurrentPage =
        homePages.includes(linkPage) && linkPage === currentPage;

      link.classList.toggle("active", isCurrentPage);

      if (isCurrentPage) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  setActiveHomeLine();

  /* =========================================================
     7. OTHER NAVIGATION ACTIVE STATE
  ========================================================= */

  function setActiveNavigation() {
    const currentPage = getCurrentPage();

    const navigationLinks = document.querySelectorAll(
      ".main-nav a, " + ".nav-links a, " + ".site-nav a, " + "#mainNav a",
    );

    navigationLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      const linkPage = normalizePagePath(href);

      /*
        Home 1 and Home 2 are handled separately.
      */

      if (linkPage === "index.html" || linkPage === "index1.html") {
        return;
      }

      const isActive = linkPage === currentPage;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  setActiveNavigation();

  /* =========================================================
     8. STICKY HEADER
  ========================================================= */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 30);
  }

  updateHeader();

  let scrollScheduled = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;

      window.requestAnimationFrame(() => {
        updateHeader();
        scrollScheduled = false;
      });
    },
    { passive: true },
  );

  /* =========================================================
     9. MOBILE NAVIGATION
  ========================================================= */

  function isMobileNavigation() {
    return window.matchMedia("(max-width: 820px)").matches;
  }

  function closeMobileMenu() {
    if (nav) {
      nav.classList.remove("active", "open");
    }

    if (menuToggle) {
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");

    closeHomeDropdown();
  }

  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = !(
        nav.classList.contains("active") || nav.classList.contains("open")
      );

      nav.classList.toggle("active", isOpen);

      nav.classList.toggle("open", isOpen);

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      document.body.classList.toggle("menu-open", isOpen);

      if (!isOpen) {
        closeHomeDropdown();
      }

      refreshIcons();
    });

    /*
      Close navigation after selecting a normal link.
      Home dropdown button itself is not an anchor.
    */

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    /*
      Clicking inside navigation must not close it.
      Clicking outside closes it.
    */

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    /*
      Reset mobile navigation when switching to desktop.
      Do not close the dropdown simply because the
      device is a touchscreen.
    */

    window.addEventListener("resize", () => {
      if (!isMobileNavigation()) {
        closeMobileMenu();
      }
    });
  }

  /* =========================================================
     10. SCROLL REVEAL
     Supports .reveal and .is-visible
  ========================================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, " +
      ".reveal-left, " +
      ".reveal-right, " +
      ".reveal-up, " +
      ".fade-in, " +
      ".scroll-reveal",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "revealed");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible", "revealed");
    });
  }

  /* =========================================================
     11. HERO / STATISTICS COUNTERS
  ========================================================= */

  const counters = document.querySelectorAll(
    "[data-count], [data-target], .counter",
  );

  function animateCounter(element) {
    if (element.dataset.countAnimated === "true") {
      return;
    }

    const rawTarget =
      element.getAttribute("data-count") ||
      element.getAttribute("data-target") ||
      element.textContent;

    const cleanedTarget = String(rawTarget).replace(/,/g, "");

    const match = cleanedTarget.match(/-?\d+(\.\d+)?/);

    if (!match) return;

    const target = Number(match[0]);

    if (!Number.isFinite(target)) return;

    element.dataset.countAnimated = "true";

    const duration = 1600;

    const startTime = performance.now();

    const prefix = element.getAttribute("data-prefix") || "";

    const suffix =
      element.getAttribute("data-suffix") ||
      (element.classList.contains("counter") ? "+" : "");

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = target * easedProgress;

      const displayValue = Number.isInteger(target)
        ? Math.floor(currentValue).toLocaleString("en-US")
        : currentValue.toFixed(1);

      element.textContent = prefix + displayValue + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        const finalValue = Number.isInteger(target)
          ? target.toLocaleString("en-US")
          : target.toFixed(1);

        element.textContent = prefix + finalValue + suffix;
      }
    }

    window.requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach((counter) => {
      animateCounter(counter);
    });
  }

  /* =========================================================
   ESTATENEST TESTIMONIALS — JAVASCRIPT
========================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
     01. SCROLL REVEAL
  ===================================================== */

    const revealElements = document.querySelectorAll(
      ".cs-testimonials .reveal",
    );

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");

              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -30px 0px",
        },
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    }

    /* =====================================================
     03. INITIAL ACTIVE TESTIMONIAL
  ===================================================== */

    activateTestimonial(0);
  });

  /* =========================================================
     13. CTA BUTTON FEEDBACK
  ========================================================= */

  document
    .querySelectorAll(".cta-button, .btn-primary, .btn-secondary")
    .forEach((button) => {
      if (button.tagName !== "A" && button.tagName !== "BUTTON") {
        return;
      }

      button.addEventListener("click", () => {
        button.classList.add("is-clicked");

        window.setTimeout(() => {
          button.classList.remove("is-clicked");
        }, 180);
      });
    });

  /* =========================================================
     14. SMOOTH SCROLL
  ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let target;

      try {
        target = document.querySelector(href);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",

        block: "start",
      });
    });
  });

  /* =========================================================
     15. FOOTER CURRENT YEAR
  ========================================================= */

  document
    .querySelectorAll("[data-current-year], #currentYear")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  /* =========================================================
     16. FORM VALIDATION FEEDBACK
  ========================================================= */

  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();

        form.reportValidity();

        return;
      }

      /*
          Add backend submission logic here if required.
        */
    });
  });

  /* =========================================================
     17. FINAL INITIALIZATION
  ========================================================= */

  setActiveHomeLine();

  setActiveNavigation();

  updateHeader();

  refreshIcons();
});
