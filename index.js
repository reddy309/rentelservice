/* =========================================================
   ESTATENEST — COMPLETE UPDATED INDEX.JS
   Header | Home Dropdown | Active Underline
   Sticky Header | Mobile Menu | Scroll Reveal
   Hero Counters | Testimonials | CTA | Lucide Icons

   Home 1: index.html
   Home 2: index1.html

   Dark Mode: Removed
   RTL: Removed
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     1. LUCIDE ICONS
  ========================================================= */

  function refreshIcons(root = document) {
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
    } catch {
      return href.split("#")[0].split("?")[0].split("/").pop().toLowerCase();
    }
  }

  /* =========================================================
     4. HOME DROPDOWN + ACTIVE UNDERLINE
  ========================================================= */

  const homeButton = document.getElementById("homeDropdownButton");

  const homeDropdown = homeButton ? homeButton.closest(".nav-dropdown") : null;

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
      ".dropdown-menu a, .dropdown-menu .dropdown-link",
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
     5. HOME DROPDOWN OPEN / CLOSE
  ========================================================= */

  if (homeButton && homeDropdown) {
    const dropdownMenu = homeDropdown.querySelector(".dropdown-menu");

    function closeHomeDropdown() {
      homeDropdown.classList.remove("open");

      homeButton.setAttribute("aria-expanded", "false");
    }

    function openHomeDropdown() {
      homeDropdown.classList.add("open");

      homeButton.setAttribute("aria-expanded", "true");
    }

    homeButton.setAttribute("aria-haspopup", "true");

    homeButton.setAttribute("aria-expanded", "false");

    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = homeDropdown.classList.contains("open");

      if (isOpen) {
        closeHomeDropdown();
      } else {
        openHomeDropdown();
      }
    });

    if (dropdownMenu) {
      dropdownMenu.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (link) {
          closeHomeDropdown();
        }
      });
    }

    document.addEventListener("click", (event) => {
      if (!homeDropdown.contains(event.target)) {
        closeHomeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeHomeDropdown();
        homeButton.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 820) {
        closeHomeDropdown();
      }
    });
  }

  /* =========================================================
     6. NAVIGATION ACTIVE STATE
  ========================================================= */

  function setActiveNavigation() {
    const currentPage = getCurrentPage();

    const navigationLinks = document.querySelectorAll(
      ".main-nav a, .nav-links a, .site-nav a, #mainNav a",
    );

    navigationLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      const linkPage = normalizePagePath(href);

      // Home underline is handled separately.
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
     7. STICKY HEADER
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
     8. MOBILE NAVIGATION
  ========================================================= */

  function closeMobileMenu() {
    if (nav) {
      nav.classList.remove("active", "open");
    }

    if (menuToggle) {
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
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

      refreshIcons();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

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

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMobileMenu();
      }
    });
  }

  /* =========================================================
     9. SCROLL REVEAL — FIXED
     Supports .revealed and .is-visible CSS classes
  ========================================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, " +
      ".reveal-up, .fade-in, .scroll-reveal",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.classList.add("revealed");

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
     10. HERO / STATISTICS COUNTERS
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
  /* =========================================
   3. ESTATENEST TESTIMONIAL SLIDER
========================================= */

  document.querySelectorAll(".cs-testimonial-slider").forEach((slider) => {
    const section = slider.closest(".cs-testimonials");
    if (!section || slider.dataset.initialized === "true") return;

    slider.dataset.initialized = "true";

    const slides = Array.from(slider.querySelectorAll(".cs-testimonial-slide"));
    const prevButton = slider.querySelector(".cs-prev");
    const nextButton = slider.querySelector(".cs-next");
    const dots = Array.from(section.querySelectorAll(".cs-testimonial-dot"));

    if (!slides.length) return;

    let currentIndex = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains("active")),
    );

    let timer;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentIndex);
        slide.setAttribute("aria-hidden", String(i !== currentIndex));
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);

        if (i === currentIndex) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });

      console.log("Showing testimonial:", currentIndex + 1);
    }

    function startAutoSlide() {
      clearInterval(timer);

      if (!document.hidden && slides.length > 1) {
        timer = setInterval(() => {
          showSlide(currentIndex + 1);
        }, 4000);
      }
    }

    if (prevButton) {
      prevButton.addEventListener("click", (event) => {
        event.preventDefault();
        showSlide(currentIndex - 1);
        startAutoSlide();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", (event) => {
        event.preventDefault();
        showSlide(currentIndex + 1);
        startAutoSlide();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", (event) => {
        event.preventDefault();
        showSlide(index);
        startAutoSlide();
      });
    });

    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", startAutoSlide);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        startAutoSlide();
      }
    });

    showSlide(currentIndex);
    startAutoSlide();
  });
  /* =========================================================
     12. CTA BUTTON FEEDBACK
  ========================================================= */

  document
    .querySelectorAll(".cta-button, .btn-primary, .btn-secondary")
    .forEach((button) => {
      if (button.tagName === "A" || button.tagName === "BUTTON") {
        button.addEventListener("click", () => {
          button.classList.add("is-clicked");

          window.setTimeout(() => {
            button.classList.remove("is-clicked");
          }, 180);
        });
      }
    });

  /* =========================================================
     13. SMOOTH SCROLL FOR SAME-PAGE LINKS
  ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let target;

      try {
        target = document.querySelector(href);
      } catch {
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
     14. FOOTER CURRENT YEAR
  ========================================================= */

  document
    .querySelectorAll("[data-current-year], #currentYear")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  /* =========================================================
     15. FORM VALIDATION FEEDBACK
     Native HTML validation remains enabled
  ========================================================= */

  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }

      // Add real form submission/backend handling here.
    });
  });

  /* =========================================================
     16. FINAL INITIALIZATION
  ========================================================= */

  setActiveHomeLine();
  setActiveNavigation();
  updateHeader();
  refreshIcons();
});
